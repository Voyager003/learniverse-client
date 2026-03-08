import { spawnSync } from 'node:child_process';
import path from 'node:path';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';
const API_READY_TIMEOUT_MS = Number(
  process.env.PW_API_READY_TIMEOUT_MS ?? 60000,
);
const API_POLL_INTERVAL_MS = 1000;
const DOCKER_COMPOSE_FILE = 'docker-compose.e2e.yml';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function probeApiReady(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
      signal: controller.signal,
    });

    if (res.status === 404 || res.status >= 500) {
      return false;
    }
    return true;
  } finally {
    clearTimeout(timer);
  }
}

async function waitForApiReady() {
  const probeUrl = `${API_BASE_URL}/auth/login`;
  const deadline = Date.now() + API_READY_TIMEOUT_MS;
  let lastReason = 'no probe yet';

  while (Date.now() < deadline) {
    try {
      const ready = await probeApiReady(probeUrl);
      if (ready) return;
      lastReason = `received 404 or 5xx from ${probeUrl}`;
    } catch (error) {
      lastReason =
        error instanceof Error ? error.message : 'unknown fetch error';
    }
    await sleep(API_POLL_INTERVAL_MS);
  }

  throw new Error(
    `[E2E global-setup] API is not ready: ${probeUrl} (timeout ${API_READY_TIMEOUT_MS}ms, lastReason: ${lastReason})`,
  );
}

function seedAdminUser() {
  const composeFile = path.join(process.cwd(), DOCKER_COMPOSE_FILE);
  const result = spawnSync(
    'docker',
    ['compose', '-f', composeFile, 'exec', '-T', 'backend', 'node', 'dist/scripts/seed-admin.js'],
    {
      cwd: process.cwd(),
      env: process.env,
      encoding: 'utf-8',
    },
  );

  if (result.status !== 0) {
    const stderr = result.stderr?.trim();
    const stdout = result.stdout?.trim();
    throw new Error(
      `[E2E global-setup] admin seed failed: ${stderr || stdout || 'unknown error'}`,
    );
  }
}

export default async function globalSetup() {
  await waitForApiReady();
  seedAdminUser();
}
