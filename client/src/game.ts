import { Boundry } from "./boundary";
import { COLUMS, ROWS, SCALED_SIZE, SPRITE_SIZE, TEST_COLLISION_DATA, TEST_SPRITE_SHEET_DATA } from "./constants/environment";
import { GameObject } from "./game-object";
import { getCollisionArray } from "./get-collision-array";
import { GameKeyCode, InputHandler } from "./input-handler";
import { Player } from "./player";
import { ViewPort } from "./viewport";
import { io } from 'socket.io-client';
import { OverworldGameState, PlayerDirection } from '@shared/models/overworld-game-state';
import { OtherPlayer } from "./other-player";

const socket = io('ws://localhost:3000');
export class Game {
  gameState: OverworldGameState | null = null;
  width: number;
  height: number;
  player: Player;
  otherPlayers: OtherPlayer[] = [];
  input: InputHandler;
  lastRender = 0;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  fps = 24;
  frameDuration = 1000 / this.fps;
  accumulatedFrameTime = 0;
  mapSprite: HTMLImageElement;
  viewport: ViewPort;
  spritesheet: HTMLImageElement;
  tiles = TEST_COLLISION_DATA;
  showCollisions = true;
  boundaries: Boundry[];
  constructor(width: number, height: number, playerSprite: HTMLImageElement, mapSprite: HTMLImageElement, spritesheet: HTMLImageElement) {
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
    this.spritesheet = spritesheet;
    this.ctx = context;
    this.ctx.imageSmoothingEnabled = true;
    this.width = width;
    this.height = height;
    this.input = new InputHandler();
    socket.on('initializeGame', (firstState: OverworldGameState) => {
      console.log('first state', firstState);
      this.gameState = firstState;
      // this.otherPlayers = Object.values(firstState.players ?? {}).map(p => new OtherPlayer(p, playerSprite, p.pos));
    });
    socket.on('stateChange', (newState: OverworldGameState) => {
      console.log('new state', { newState });
      // fix players
      const _players = newState.players ?? {};
      const arrayOfPlayers = Object.values(_players).filter(p => p.id !== socket.id);
      const newPlayers = arrayOfPlayers.filter(item => !this.otherPlayers.find(i => i.playerUid === item.id));
      console.log({newPlayers: newPlayers.length});
      
      this.otherPlayers.push(...newPlayers.map(p => new OtherPlayer(newState.players[p.id], playerSprite, p.pos, p.id, this.viewport)));
      this.gameState = newState;
      // this.gameState = newState;
      // const newPlayers = Object.values(this.gameState?.players ?? {}).filter(p => p.id !== 'first');
      // console.log({newPlayers});

    });
    this.viewport = new ViewPort(0, 0, 640, 640);
    this.boundaries = getCollisionArray(TEST_COLLISION_DATA, 7995, this.viewport);
    this.player = new Player(playerSprite, this.viewport, socket, { x: 32, y: 32 });
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

  private async update(delta: number) {
    
    const playerState = Object.values(this.gameState?.players ?? {}).find(p => p.id === socket.id);
    if (!playerState) {
      return;
    }
    this.player.changeGameState(playerState);
    this.viewport.scrollTo(playerState.pos.x, playerState.pos.y);
    this.player.update(this.input.lastKey);
    this.otherPlayers.filter(p => !!(this.gameState?.players ?? {})[p.playerUid]).forEach(p => p.changeGameState((this.gameState?.players ?? {})[p.playerUid]));
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
    // this.ctx.drawImage(this.mapSprite, this.player.position.x, this.player.position.y, 640,640, 0, 0, 1024, 1024);
    // this.drawGrid();
    let xMin = Math.floor(this.viewport.x / SCALED_SIZE);
    let yMin = Math.floor(this.viewport.y / SCALED_SIZE);
    let xMax = Math.ceil((this.viewport.x + this.viewport.w) / SCALED_SIZE);
    let yMax = Math.ceil((this.viewport.y + this.viewport.h) / SCALED_SIZE);

    if (xMin < 0) xMin = 0;
    if (yMin < 0) yMin = 0;
    if (xMax > COLUMS) xMax = COLUMS;
    if (yMax > ROWS) yMax = ROWS;

    for (let i = xMin; i < xMax; i++) {
      for (let j = yMin; j < yMax; j++) {
        const spriteX = Math.floor(i * SCALED_SIZE - this.viewport.x + this.width * 0.5 - this.viewport.w * 0.5);
        const spriteY = Math.floor(j * SCALED_SIZE - this.viewport.y + this.height * 0.5 - this.viewport.h * 0.5);

        const spriteIndex = (j * COLUMS) + i;
        const remainder = spriteIndex % COLUMS;
        const frameX = remainder * SPRITE_SIZE;
        const frameY = j * SPRITE_SIZE;
        this.ctx.drawImage(this.spritesheet, frameX, frameY, SPRITE_SIZE, SPRITE_SIZE, spriteX, spriteY, SCALED_SIZE, SCALED_SIZE);
        // if (this.showCollisions) {
        //   const sprite = this.tiles[j * COLUMS + i];
        //   if (sprite === 7995) {

        //     this.ctx.fillStyle = 'red';
        //     this.ctx.fillRect(spriteX, spriteY, SCALED_SIZE, SCALED_SIZE);
        //   }
        //   // this.ctx.drawImage(this.spritesheet, frameX, frameY, SPRITE_SIZE, SPRITE_SIZE, spriteX, spriteY, SCALED_SIZE, SCALED_SIZE);

        // }
        // this.ctx.font = '8px serif';
        // this.ctx.fillText(`(${spriteIndex},${j})`, spriteX, spriteY, 50);
      }
    }
    if (this.showCollisions) {
      this.boundaries.forEach(b => b.draw(this.ctx));
    }
    this.ctx.font = '48px serif';
    this.ctx.fillText(`mpla ${deltaTime}`, 0, 50, 500);
    this.otherPlayers.forEach(p => p.render(this.ctx, deltaTime));
    this.player.render(this.ctx, deltaTime);
  }
}
