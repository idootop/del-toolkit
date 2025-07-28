import { exec as execSync } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execSync);

interface StdIO {
  stdout?: string;
  stderr?: string;
  error?: any;
}

class _Shell {
  get args() {
    return process.argv.slice(2);
  }

  async run(
    command: string,
    options?: { silent?: boolean; cwd?: string },
  ): Promise<StdIO> {
    const { silent, cwd } = options ?? {};
    try {
      const { stdout, stderr } = await exec(command, { cwd });
      if (!silent) {
        console.log(`stdout: ${stdout}`);
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
      }
      return { stdout, stderr };
    } catch (error) {
      if (!silent) {
        console.error(`run shell error: ${error}`);
      }
      return { error };
    }
  }
}

export const Shell = new _Shell();
