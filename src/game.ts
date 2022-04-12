import { GameObject } from "./game-object";
import { InputHandler } from "./input-handler";
import { Player } from "./player";

export class Game {
  width: number;
  height: number;
  player: Player;
  input: InputHandler;
  lastRender = 0;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  constructor(width: number, height: number, playerSprite: HTMLImageElement) {
    const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`No canvas`);
    }
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error(`No context`);
    }
    this.canvas = canvas;
    console.log(this.canvas.width, this.canvas.height);

    this.ctx = context;
    this.width = width;
    this.height = height;
    this.player = new Player(playerSprite);
    this.input = new InputHandler();
    window.requestAnimationFrame(this.loop.bind(this));
  }

  loop(timestamp: number) {
    const delta = timestamp - this.lastRender;
    this.update(delta);
    this.render(delta);
    this.lastRender = timestamp;
    window.requestAnimationFrame(this.loop.bind(this));
  }

  private update(delta: number) {
    this.player.update(this.input.lastKey);

  }

  drawGrid() {
    const bw = this.canvas.width;
    const p = 0;
    const bh = this.canvas.height;
    const step = 32;
    for (var x = 0; x <= bw; x += step) {
      this.ctx.moveTo(0.5 + x + p, p);
      this.ctx.lineTo(0.5 + x + p, bh + p);
    }

    for (var x = 0; x <= bh; x += step) {
      this.ctx.moveTo(p, 0.5 + x + p);
      this.ctx.lineTo(bw + p, 0.5 + x + p);
    }

    this.ctx.strokeStyle = "black";
    this.ctx.stroke();

  }

  private render(deltaTime: number) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    this.player.render(this.ctx, deltaTime);
  }
}
