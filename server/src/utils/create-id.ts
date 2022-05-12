const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function createId(length = 10, prefix?: string) {
    let str = '';
    for (let i = 0; i < length; i++) {
        const randomInteger = Math.floor(Math.random() * alphabet.length - 1) + 1;
        str += alphabet[randomInteger];
    }
    return prefix ? `${prefix}${str}` : str;
}
