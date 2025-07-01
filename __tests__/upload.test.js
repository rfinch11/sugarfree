import { isValidFile } from '../public/scripts/upload.js';

describe('isValidFile', () => {
  test('accepts valid jpeg file under limit', () => {
    const file = { type: 'image/jpeg', size: 2 * 1024 * 1024 };
    expect(isValidFile(file)).toBe(true);
  });

  test('rejects file exceeding size limit', () => {
    const file = { type: 'image/png', size: 10 * 1024 * 1024 };
    expect(isValidFile(file)).toBe(false);
  });

  test('rejects invalid mime type', () => {
    const file = { type: 'audio/mpeg', size: 512 };
    expect(isValidFile(file)).toBe(false);
  });
});
