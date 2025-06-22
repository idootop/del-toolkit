import { configure, render } from '@testing-library/react';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { StrictMode } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { mockReactDevEnvironment } from './dev.test.js';

describe('useUnStrictRun React Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Behavior in production environment', () => {
    beforeEach(() => {
      mockReactDevEnvironment(false);
    });

    test('should execute function immediately', async () => {
      const { useUnStrictRun } = await import('../src/useUnStrictRun.js');
      const runCallback = vi.fn();

      function TestComponent() {
        useUnStrictRun(runCallback);
        return <div>Test</div>;
      }

      render(<TestComponent />);

      expect(runCallback).toHaveBeenCalledTimes(1);
    });

    test('should execute again on re-render', async () => {
      const { useUnStrictRun } = await import('../src/useUnStrictRun.js');
      const runCallback = vi.fn();

      function TestComponent({ prop }: { prop: number }) {
        useUnStrictRun(() => runCallback(prop));
        return <div>Test {prop}</div>;
      }

      const { rerender } = render(<TestComponent prop={1} />);

      expect(runCallback).toHaveBeenCalledWith(1);
      expect(runCallback).toHaveBeenCalledTimes(1);

      rerender(<TestComponent prop={2} />);

      expect(runCallback).toHaveBeenCalledWith(2);
      expect(runCallback).toHaveBeenCalledTimes(2);
    });
  });

  describe('Behavior in development environment', () => {
    beforeEach(() => {
      mockReactDevEnvironment(true);
      configure({ reactStrictMode: true });
    });

    test('should prevent double execution in StrictMode', async () => {
      const { useUnStrictRun } = await import('../src/useUnStrictRun.js');
      const runCallback = vi.fn();
      const runCallback2 = vi.fn();

      function TestComponent() {
        useUnStrictRun(runCallback);
        runCallback2();
        return <div>Test</div>;
      }

      render(
        <StrictMode>
          <TestComponent />
        </StrictMode>,
      );

      // Should execute only once in StrictMode
      expect(runCallback).toHaveBeenCalledTimes(1);
      expect(runCallback2).toHaveBeenCalledTimes(2);
    });

    test('should handle count correctly on component re-render', async () => {
      const { useUnStrictRun } = await import('../src/useUnStrictRun.js');
      const runCallback = vi.fn();
      const runCallback2 = vi.fn();

      function TestComponent({ counter }: { counter: number }) {
        useUnStrictRun(() => runCallback(counter));
        runCallback2(counter);
        return <div>Counter: {counter}</div>;
      }

      const { rerender } = render(
        <StrictMode>
          <TestComponent counter={1} />
        </StrictMode>,
      );

      expect(runCallback).toHaveBeenCalledWith(1);
      expect(runCallback).toHaveBeenCalledTimes(1);
      expect(runCallback2).toHaveBeenCalledTimes(2);

      rerender(<TestComponent counter={2} />);

      expect(runCallback).toHaveBeenCalledWith(2);
      expect(runCallback).toHaveBeenCalledTimes(2);
      expect(runCallback2).toHaveBeenCalledTimes(4);
    });
  });
});
