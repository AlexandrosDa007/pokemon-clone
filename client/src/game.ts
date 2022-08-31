import { Boundry } from "./boundary";
import { CANVAS_HEIGHT, CANVAS_WIDTH, COLUMS, ROWS, SCALED_SIZE, SPRITE_SIZE } from "@shared/constants/environment";
// import { getCollisionArray } from "./get-collision-array";
import { InputHandler } from "./input-handler";
import { Player } from "./models/player";
import { ViewPort } from "./viewport";
import { OverworldGameState } from '@shared/models/overworld-game-state';
import { OtherPlayer } from "./models/other-player";
import { createBoundries } from "./utils/create-boundries";
import { Settings } from "./settings";
import { SpriteLoader } from "./sprite-loader";
import { SocketHandler } from "./socket-handler";
import { GAME_FPS } from "./constants/environment";


Settings.SHOW_BOUNDRIES = true;
// Settings.SHOW_GRID = true;
export class Game {
  socketHandler: SocketHandler;
  ctx: CanvasRenderingContext2D;
  input: InputHandler;
  canvas: HTMLCanvasElement;
  player: Player;
  boundaries: Boundry[];
  otherPlayers: OtherPlayer[] = [];
  gameState: OverworldGameState = { players: {} };
  uid: string;
  lastRender = 0;
  frameDuration = 1000 / GAME_FPS;
  accumulatedFrameTime = 0;

  constructor(opt: { uid: string, token: string }) {
    const { uid, token } = opt;
    const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`No canvas`);
    }
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error(`No context`);
    }
    if (!SpriteLoader.ALL_LOADED) {
      throw new Error('Sprites not loaded');
    }
    this.canvas = canvas;
    this.ctx = context;
    this.ctx.imageSmoothingEnabled = true;
    this.input = new InputHandler();
    this.boundaries = createBoundries();
    this.uid = uid;
    this.socketHandler = new SocketHandler(this, token, uid);
    this.player = new Player(SpriteLoader.SPRITES.PLAYER_1.image, this.socketHandler.socket, { x: 0, y: 0 });
    // start loop
    window.requestAnimationFrame(this.loop.bind(this));
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
    const playerState = this.gameState.players[this.uid];
    if (playerState) {
      this.player.changeGameState(playerState);
      ViewPort.scrollTo(playerState.pos.x, playerState.pos.y);
      this.player.update(delta, this.input);
    }
    this.otherPlayers = this.otherPlayers.filter(p => !!this.gameState.players[p.playerUid]);
    // remove offline other players
    this.otherPlayers.forEach(p => {
      p.changeGameState((this.gameState?.players ?? {})[p.playerUid]);
      p.update(delta);
    });
  }

  drawGrid() {
    this.ctx.strokeStyle = "black";
    for (let i = 0; i < this.canvas.width; i += 32) {
      for (let j = 0; j < this.canvas.height; j += 32) {
        this.ctx.strokeStyle = 'color: grey';
        this.ctx.strokeRect(i, j, 32, 32);
      }
    }

  }

  private render(deltaTime: number) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let xMin = Math.floor(ViewPort.x / SCALED_SIZE);
    let yMin = Math.floor(ViewPort.y / SCALED_SIZE);
    let xMax = Math.ceil((ViewPort.x + ViewPort.w) / SCALED_SIZE);
    let yMax = Math.ceil((ViewPort.y + ViewPort.h) / SCALED_SIZE);

    if (xMin < 0) xMin = 0;
    if (yMin < 0) yMin = 0;
    if (xMax > COLUMS) xMax = COLUMS;
    if (yMax > ROWS) yMax = ROWS;

    for (let i = xMin; i < xMax; i++) {
      for (let j = yMin; j < yMax; j++) {
        const spriteX = Math.floor(i * SCALED_SIZE - ViewPort.x + CANVAS_WIDTH * 0.5 - ViewPort.w * 0.5);
        const spriteY = Math.floor(j * SCALED_SIZE - ViewPort.y + CANVAS_HEIGHT * 0.5 - ViewPort.h * 0.5);

        const spriteIndex = (j * COLUMS) + i;
        const remainder = spriteIndex % COLUMS;
        const frameX = remainder * SPRITE_SIZE;
        const frameY = j * SPRITE_SIZE;
        // Draw map
        this.ctx.drawImage(SpriteLoader.SPRITES.MAP.image, frameX, frameY, SPRITE_SIZE, SPRITE_SIZE, spriteX, spriteY, SCALED_SIZE, SCALED_SIZE);
      }
    }
    if (Settings.SHOW_GRID) {
      this.drawGrid();
    }
    if (Settings.SHOW_BOUNDRIES) {
      this.boundaries.forEach(b => b.draw(this.ctx));
    }
    this.ctx.font = '48px serif';
    this.ctx.fillText(`(x = ${this.player.position.x} , y = ${this.player.position.y} )`, 0, 50, 500);
    this.otherPlayers.forEach(p => p.render(this.ctx, deltaTime));
    this.player.render(this.ctx, deltaTime);
  }
}
