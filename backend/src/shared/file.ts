import { unlink } from 'fs/promises';

export const removeFile = (file?: Express.Multer.File): Promise<void> =>
  file
    ? unlink(file.path).catch((err: unknown) => {
        console.error(`Failed to remove file ${file.path}:`, err);
      })
    : Promise.resolve();
