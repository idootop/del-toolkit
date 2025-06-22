import { vi } from 'vitest';

export function mockReactDevEnvironment(isDev: boolean) {
  if (isDev) {
    Object.defineProperty(global, 'window', {
      value: {},
      writable: true,
    });
    Object.defineProperty(global, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
      value: {
        renderers: new Map([[1, { bundleType: 1 }]]),
      },
      writable: true,
    });
  } else {
    (global as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = undefined;
  }
  vi.resetModules();
}

import { afterEach, beforeEach, describe, expect, test } from 'vitest';

describe('kIsReactDev', () => {
  let originalWindow: any;
  let originalHook: any;

  beforeEach(() => {
    // Save original values
    originalWindow = (global as any).window;
    originalHook = (global as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
    vi.resetModules();
  });

  afterEach(() => {
    // Restore original values
    if (originalWindow) {
      (global as any).window = originalWindow;
    } else {
      delete (global as any).window;
    }
    if (originalHook) {
      (global as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = originalHook;
    } else {
      delete (global as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
    }
  });

  test('should return true in development environment (Chrome/Firefox)', async () => {
    // Setup browser environment + React DevTools Hook (bundleType = 1)
    Object.defineProperty(global, 'window', {
      value: {},
      writable: true,
      configurable: true,
    });
    Object.defineProperty(global, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
      value: {
        renderers: new Map([[1, { bundleType: 1 }]]),
      },
      writable: true,
      configurable: true,
    });

    const { kIsReactDev } = await import('../src/dev.js');
    expect(kIsReactDev).toBe(true);
  });

  test('should return true in development environment (Safari)', async () => {
    // Setup browser environment + React DevTools Hook (renderer is null)
    Object.defineProperty(global, 'window', {
      value: {},
      writable: true,
      configurable: true,
    });
    Object.defineProperty(global, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
      value: {
        renderers: new Map([[1, null]]),
      },
      writable: true,
      configurable: true,
    });

    const { kIsReactDev } = await import('../src/dev.js');
    expect(kIsReactDev).toBe(true);
  });

  test('should return false in ssr environment (no window)', async () => {
    // Remove window object (Node.js environment)
    delete (global as any).window;
    delete (global as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;

    const { kIsReactDev } = await import('../src/dev.js');
    expect(kIsReactDev).toBe(false);
  });

  test('should return false when React DevTools Hook is missing', async () => {
    // Setup browser environment but no React DevTools Hook
    Object.defineProperty(global, 'window', {
      value: {},
      writable: true,
      configurable: true,
    });
    delete (global as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;

    const { kIsReactDev } = await import('../src/dev.js');
    expect(kIsReactDev).toBe(false);
  });

  test('should return false when bundleType is not 1', async () => {
    // Setup browser environment + React DevTools Hook but bundleType is not 1
    Object.defineProperty(global, 'window', {
      value: {},
      writable: true,
      configurable: true,
    });
    Object.defineProperty(global, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
      value: {
        renderers: new Map([[1, { bundleType: 0 }]]),
      },
      writable: true,
      configurable: true,
    });

    const { kIsReactDev } = await import('../src/dev.js');
    expect(kIsReactDev).toBe(false);
  });

  test('should return false when Hook is undefined', async () => {
    // Setup browser environment but Hook is undefined
    Object.defineProperty(global, 'window', {
      value: {},
      writable: true,
      configurable: true,
    });
    (global as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = undefined;

    const { kIsReactDev } = await import('../src/dev.js');
    expect(kIsReactDev).toBe(false);
  });
});
