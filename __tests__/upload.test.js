import { isValidFile } from '../public/scripts/upload.js';

describe('isValidFile', () => {
  test('accepts valid jpeg file under limit', async () => {
    const file = { type: 'image/jpeg', size: 2 * 1024 * 1024 };
    await expect(isValidFile(file)).resolves.toBe(true);
  });

  test('rejects file exceeding size limit', async () => {
    const file = { type: 'image/png', size: 10 * 1024 * 1024 };
    await expect(isValidFile(file)).resolves.toBe(false);
  });

  test('rejects invalid mime type', async () => {
    const file = { type: 'audio/mpeg', size: 512 };
    await expect(isValidFile(file)).resolves.toBe(false);
  });
});
