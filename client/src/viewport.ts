export class ViewPort {
  x: number;
  y: number;
  w: number;
  h: number;
  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  scrollTo(x: number, y: number) {
    this.x = x - this.w * 0.5;
    this.y = y - this.h * 0.5;
  }

}
