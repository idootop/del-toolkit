import fs from 'node:fs';
import path from 'node:path';

import { jsonDecode, jsonEncode } from '../core/object.js';

export const kRoot = process.cwd();

export const exists = (filePath: string) => fs.existsSync(filePath);

export const ensureDirectoryExists = (filePath: string) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const getFullPath = (filePath: string) => path.resolve(filePath);

export const getFiles = (dir: string) => {
  return new Promise<string[]>((resolve) => {
    fs.readdir(dir, (err, files) => {
      resolve(err ? [] : files);
    });
  });
};

export const deleteFile = (filePath: string) => {
  try {
    fs.rmSync(filePath);
    return true;
  } catch {
    return false;
  }
};

export const copyFile = (
  from: string,
  to: string,
  mode?: number | undefined,
) => {
  if (!fs.existsSync(from)) {
    return false;
  }
  ensureDirectoryExists(to);
  return new Promise<boolean>((resolve) => {
    const callback = (err: any) => {
      resolve(!err);
    };
    if (mode) {
      fs.copyFile(from, to, mode, callback);
    } else {
      fs.copyFile(from, to, callback);
    }
  });
};

export const moveFile = (from: string, to: string) => {
  if (!fs.existsSync(from)) {
    return false;
  }
  ensureDirectoryExists(to);
  return new Promise<boolean>((resolve) => {
    fs.rename(from, to, (err: any) => {
      resolve(!err);
    });
  });
};

export const readFile = async <T = any>(
  filePath: string,
  options?: fs.WriteFileOptions,
) => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    return undefined;
  }
  const result = await new Promise<T | undefined>((resolve) => {
    fs.readFile(filePath, options, (err, data) => {
      resolve(err ? undefined : (data as any));
    });
  });
  return result;
};

export const writeFile = async (
  filePath: string,
  data?: string | NodeJS.ArrayBufferView,
  options?: fs.WriteFileOptions,
) => {
  if (!data) {
    return false;
  }
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  const result = await new Promise<boolean>((resolve) => {
    if (options) {
      fs.writeFile(filePath, data, options, (err) => {
        resolve(!err);
      });
    } else {
      fs.writeFile(filePath, data, (err) => {
        resolve(!err);
      });
    }
  });
  return result;
};

export const readString = (filePath: string) =>
  readFile<string>(filePath, 'utf8');

export const writeString = (filePath: string, content: string) =>
  writeFile(filePath, content, 'utf8');

export const readJSON = async (filePath: string) =>
  jsonDecode(await readFile<string>(filePath, 'utf8'));

export const writeJSON = (filePath: string, content: any) =>
  writeFile(filePath, jsonEncode(content) ?? '', 'utf8');
