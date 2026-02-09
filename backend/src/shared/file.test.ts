import { describe, it, expect, vi, beforeEach } from 'vitest';
import { unlink } from 'fs/promises';
import { removeFile } from './file';

vi.mock('fs/promises', () => ({
  unlink: vi.fn(),
}));

const mockedUnlink = vi.mocked(unlink);

describe('removeFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns resolved promise when file is undefined', async () => {
    await expect(removeFile(undefined)).resolves.toBeUndefined();
    expect(mockedUnlink).not.toHaveBeenCalled();
  });

  it('calls unlink with file path when file is provided', async () => {
    mockedUnlink.mockResolvedValue(undefined);
    const file = { path: '/uploads/test.jpg' } as Express.Multer.File;

    await removeFile(file);

    expect(mockedUnlink).toHaveBeenCalledWith('/uploads/test.jpg');
  });

  it('logs error when unlink fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Permission denied');
    mockedUnlink.mockRejectedValue(error);
    const file = { path: '/uploads/test.jpg' } as Express.Multer.File;

    await removeFile(file);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to remove file /uploads/test.jpg:',
      error
    );
  });
});
