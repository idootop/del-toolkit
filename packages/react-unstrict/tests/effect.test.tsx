import { configure, render, waitFor } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: just do it
import React, { StrictMode, useEffect } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { mockReactDevEnvironment } from './dev.test.js';

describe('useUnStrictEffect React Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Behavior in production environment', () => {
    beforeEach(() => {
      mockReactDevEnvironment(false);
    });

    test('should execute effect normally', async () => {
      const { useUnStrictEffect } = await import('../src/useUnStrictEffect.js');
      const effectCallback = vi.fn();

      function TestComponent() {
        useUnStrictEffect(effectCallback, []);
        return <div>Test</div>;
      }

      render(<TestComponent />);

      await waitFor(() => {
        expect(effectCallback).toHaveBeenCalledTimes(1);
      });
    });

    test('should re-execute when dependencies change', async () => {
      const { useUnStrictEffect } = await import('../src/useUnStrictEffect.js');
      const effectCallback = vi.fn();

      function TestComponent({ dep }: { dep: number }) {
        useUnStrictEffect(() => {
          effectCallback(dep);
        }, [dep]);
        return <div>Test</div>;
      }

      const { rerender } = render(<TestComponent dep={1} />);

      await waitFor(() => {
        expect(effectCallback).toHaveBeenCalledWith(1);
      });

      rerender(<TestComponent dep={2} />);

      await waitFor(() => {
        expect(effectCallback).toHaveBeenCalledWith(2);
        expect(effectCallback).toHaveBeenCalledTimes(2);
      });
    });

    test('cleanup function should execute correctly', async () => {
      const { useUnStrictEffect } = await import('../src/useUnStrictEffect.js');
      const effectCallback = vi.fn();
      const cleanupCallback = vi.fn();

      function TestComponent() {
        useUnStrictEffect(() => {
          effectCallback();
          return cleanupCallback;
        }, []);
        return <div>Test</div>;
      }

      const { unmount } = render(<TestComponent />);

      await waitFor(() => {
        expect(effectCallback).toHaveBeenCalledTimes(1);
        expect(cleanupCallback).toHaveBeenCalledTimes(0);
      });

      unmount();

      await waitFor(() => {
        expect(cleanupCallback).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Behavior in development environment', () => {
    beforeEach(() => {
      mockReactDevEnvironment(true);
      vi.useFakeTimers();
      configure({ reactStrictMode: true });
    });

    test('should prevent double execution in StrictMode', async () => {
      const { useUnStrictEffect } = await import('../src/useUnStrictEffect.js');
      const effectCallback = vi.fn();
      const effectCallback2 = vi.fn();

      function TestComponent() {
        useUnStrictEffect(() => {
          effectCallback();
        }, []);
        useEffect(() => {
          effectCallback2();
        }, []);
        return <div>Test</div>;
      }

      render(
        <StrictMode>
          <TestComponent />
        </StrictMode>,
      );

      // Should execute only once in StrictMode, not twice
      expect(effectCallback).toHaveBeenCalledTimes(1);
      expect(effectCallback2).toHaveBeenCalledTimes(2);
    });

    test('cleanup function should handle correctly in StrictMode', async () => {
      const { useUnStrictEffect } = await import('../src/useUnStrictEffect.js');
      const effectCallback = vi.fn();
      const cleanupCallback = vi.fn();
      const cleanupCallback2 = vi.fn();

      function TestComponent() {
        useUnStrictEffect(() => {
          effectCallback();
          return cleanupCallback;
        }, []);
        useEffect(() => {
          return cleanupCallback2;
        }, []);
        return <div>Test</div>;
      }

      const { unmount } = render(
        <StrictMode>
          <TestComponent />
        </StrictMode>,
      );

      expect(effectCallback).toHaveBeenCalledTimes(1);
      expect(cleanupCallback).toHaveBeenCalledTimes(0);
      expect(cleanupCallback2).toHaveBeenCalledTimes(1);

      unmount();

      vi.advanceTimersByTime(1);
      expect(cleanupCallback).toHaveBeenCalledTimes(1);
      expect(cleanupCallback2).toHaveBeenCalledTimes(2);
    });

    test('should correctly reset counter when dependencies change', async () => {
      const { useUnStrictEffect } = await import('../src/useUnStrictEffect.js');
      const effectCallback = vi.fn();
      const effectCallback2 = vi.fn();

      function TestComponent({ dep }: { dep: number }) {
        useUnStrictEffect(() => {
          effectCallback(dep);
        }, [dep]);
        useEffect(() => {
          effectCallback2(dep);
        }, [dep]);
        return <div>Test</div>;
      }

      const { rerender } = render(
        <StrictMode>
          <TestComponent dep={1} />
        </StrictMode>,
      );

      expect(effectCallback).toHaveBeenCalledWith(1);
      expect(effectCallback2).toHaveBeenCalledTimes(2);

      rerender(<TestComponent dep={2} />);

      expect(effectCallback).toHaveBeenCalledWith(2);
      expect(effectCallback).toHaveBeenCalledTimes(2);
      expect(effectCallback2).toHaveBeenCalledTimes(4);
    });
  });
});
