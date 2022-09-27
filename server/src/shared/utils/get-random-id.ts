const alphabet =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function getRandomId(prefix = '', length = 16) {
  let str = '';
  for (let i = 0; i < length; i++) {
    const min = 0;
    const max = Math.floor(length);
    str += alphabet[Math.floor(Math.random() * (max - min + 1)) + 0];
  }
  return prefix + str;
}
