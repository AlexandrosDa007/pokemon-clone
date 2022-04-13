
type KeyType = 'ArrowDown' | 'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'Enter';
type PressKey = `PRESS_${KeyType}`;
type ReleaseKey = `RELEASE_${KeyType}`;
export type GameKeyCode = PressKey | ReleaseKey;

const VALID_KEYS: any = {
  'ArrowDown': true,
  'ArrowLeft': true,
  'ArrowUp': true,
  'ArrowRight': true,
  'Enter': true,
};

export class InputHandler {
  lastKey?: GameKeyCode;
  constructor() {
    window.addEventListener('keydown', (e) => {
      const key = e.key;
      if (!VALID_KEYS[key]) {
        return;
      }
      const keyboardTypeKey = `PRESS_${key}` as GameKeyCode;
      if (keyboardTypeKey !== this.lastKey) {
        console.log(keyboardTypeKey);
      }
      this.lastKey = keyboardTypeKey;

    });
    window.addEventListener('keyup', (e) => {
      const key = e.key;
      if (!VALID_KEYS[key]) {
        return;
      }
      const keyboardTypeKey = `RELEASE_${key}` as GameKeyCode;
      if (keyboardTypeKey !== this.lastKey) {
        console.log(keyboardTypeKey);
      }
      this.lastKey = keyboardTypeKey;
    });
  }
}
