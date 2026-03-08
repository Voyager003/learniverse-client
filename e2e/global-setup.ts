const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';
const API_READY_TIMEOUT_MS = Number(
  process.env.PW_API_READY_TIMEOUT_MS ?? 60000,
);
const API_POLL_INTERVAL_MS = 1000;

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

export default async function globalSetup() {
  await waitForApiReady();
}
