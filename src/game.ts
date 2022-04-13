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
  fps = 30;
  frameDuration = 1000 / this.fps;
  accumulatedFrameTime = 0;
  mapSprite: HTMLImageElement;
  constructor(width: number, height: number, playerSprite: HTMLImageElement, mapSprite: HTMLImageElement) {
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
    this.mapSprite = mapSprite;
    this.ctx = context;
    this.width = width;
    this.height = height;
    this.player = new Player(playerSprite);
    this.input = new InputHandler();
    window.requestAnimationFrame(this.loop.bind(this));
  }


  static getInstance() {
    return this;
  }

  loop(timestamp: number) {
    const delta = timestamp - this.lastRender;
    this.lastRender = timestamp;
    this.accumulatedFrameTime += delta;
    let noOfUpdates = 0;
    while (this.accumulatedFrameTime >= this.frameDuration) {
      this.update(this.frameDuration);
      this.render(delta);
      this.accumulatedFrameTime -= this.frameDuration;
      if (noOfUpdates++ >= 200) {
        this.accumulatedFrameTime = 0;
        break;
      }
    }
    window.requestAnimationFrame(this.loop.bind(this));
  }

  private update(delta: number) {
    this.player.update(this.input.lastKey);
  }

  drawGrid() {
    this.ctx.strokeStyle = "black";
    for (let i = 0; i < this.canvas.width; i += 32) {
      for (let j = 0; j < this.canvas.height; j += 32) {
        this.ctx.strokeRect(i, j, 32, 32);
      }
    }

  }

  private render(deltaTime: number) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    // this.ctx.drawImage(this.mapSprite, 0, 0, 1024, 1024, 0, 0, 1024, 1024);
    this.ctx.font = '48px serif';
    this.ctx.fillText(`mpla ${deltaTime}`, 0, 50, 500);
    this.player.render(this.ctx, deltaTime);
  }
}
