class _Logger {
  log(...logs: any[]) {
    console.log(...logs);
  }

  debug(...logs: any[]) {
    console.log('🐛', ...logs);
  }

  success(...logs: any[]) {
    console.log('✅', ...logs);
  }

  error(...logs: any[]) {
    console.log('❌', ...logs);
  }

  assert(condition: boolean, ...logs: any[]) {
    if (!condition) {
      console.log('❌', ...logs);
      throw Error('Assertion failed');
    }
  }
}

export const Logger = new _Logger();
