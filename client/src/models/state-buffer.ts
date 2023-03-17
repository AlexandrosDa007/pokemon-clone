import { DbPlayer } from '@shared/models/db-player';

export class StateBuffer {
  buffer: DbPlayer[] = [];
  rendering = false;
  lastStateRendered: DbPlayer | null = null;
  constructor(public uid: string) {}

  getNext() {
    const _s = this.buffer.pop();
    if (_s) {
      this.rendering = true;
      this.lastStateRendered = _s;
      return _s;
    }
    return null;
  }

  addToBuffer(dbPlayer: DbPlayer) {
    this.buffer.unshift(dbPlayer);
  }

  peek() {
    return this.buffer[this.buffer.length - 1];
  }
}
