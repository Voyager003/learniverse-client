import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

const ACT_WARNING_PATTERNS = [
  /not wrapped in act/i,
  /suspended inside an `?act`? scope/i,
];

const originalConsoleError = console.error;

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    const message = args.map((arg) => String(arg)).join(' ');
    if (ACT_WARNING_PATTERNS.some((pattern) => pattern.test(message))) {
      throw new Error(`React act warning detected: ${message}`);
    }
    originalConsoleError(...args);
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
