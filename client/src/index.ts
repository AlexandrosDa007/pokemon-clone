import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@shared/constants/environment";
import { Game } from "./game";
import { SpriteLoader } from "./sprite-loader";
const mainChar = require('./assets/main_character.png').default;
const spritesheet = require('./assets/pokemonmap.png').default;

async function main() {
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`Canvas hasn't initialized yet`);
  }
  fixCanvasHeight(canvas);
  window.addEventListener('resize', () => fixCanvasHeight(canvas));

  const { playerSprite, spritesheetSprite } = await loadAllImages();
  SpriteLoader.SPRITES.MAP = {
    loaded: true,
    image: spritesheetSprite,
    height: spritesheetSprite.height,
    width: spritesheetSprite.width,
  };
  SpriteLoader.SPRITES.PLAYER_1 = {
    loaded: true,
    image: playerSprite,
    height: playerSprite.height,
    width: playerSprite.width,
  };
  SpriteLoader.ALL_LOADED = true;
  const game = new Game();
}


function fixCanvasHeight(canvas: HTMLCanvasElement) {
  canvas.height = CANVAS_HEIGHT;
  canvas.width = CANVAS_WIDTH;
}

async function loadAllImages() {
  const playerSprite = new Image();   // Create new img element
  playerSprite.src = mainChar; // Set source path
  const playerSpriteLoadedTask = new Promise<boolean>((res, rej) => {
    playerSprite.addEventListener('load', function () {
      res(true);
    }, false);
  });
  const spritesheetSprite = new Image();
  spritesheetSprite.src = spritesheet;
  const spritesheetLoadedTask = new Promise<boolean>((res, rej) => {
    spritesheetSprite.addEventListener('load', function () {
      res(true);
    }, false);
  });


  await Promise.all([playerSpriteLoadedTask, spritesheetLoadedTask]);
  return { playerSprite, spritesheetSprite };
}

main();