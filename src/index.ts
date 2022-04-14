import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants/environment";
import { Game } from "./game";
const mainChar = require('./assets/main_character.png').default;
const mapAssets = require('./assets/map.png').default;
const spritesheet = require('./assets/pokemonmap.png').default;

async function main() {
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`Canvas hasn't initialized yet`);
  }
  fixCanvasHeight(canvas);
  window.addEventListener('resize', () => fixCanvasHeight(canvas));

  const { mapSprite, playerSprite, spritesheetSprite } = await loadAllImages();
  // execute drawImage statements here
  const game = new Game(CANVAS_WIDTH, CANVAS_HEIGHT, playerSprite, mapSprite, spritesheetSprite);
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
  const mapSprite = new Image();
  mapSprite.src = mapAssets;
  const mapSpriteLoadedTask = new Promise<boolean>((res, rej) => {
    mapSprite.addEventListener('load', function () {
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


  await Promise.all([playerSpriteLoadedTask, mapSpriteLoadedTask, spritesheetLoadedTask]);
  return { playerSprite, mapSprite, spritesheetSprite };
}

main();