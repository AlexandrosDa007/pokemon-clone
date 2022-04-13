import { Game } from "./game";
const mainChar = require('./assets/main_character.png').default;
const mapAssets = require('./assets/map.png').default;
console.log(mainChar);

async function main() {
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`Canvas hasn't initialized yet`);
  }
  fixCanvasHeight(canvas);
  window.addEventListener('resize', () => fixCanvasHeight(canvas));

  const { mapSprite, playerSprite } = await loadAllImages();
  // execute drawImage statements here
  const game = new Game(640, 640, playerSprite, mapSprite);
}


function fixCanvasHeight(canvas: HTMLCanvasElement) {
  canvas.height = 640;
  canvas.width = 640;
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

  await Promise.all([playerSpriteLoadedTask, mapSpriteLoadedTask]);
  return { playerSprite, mapSprite };
}

main();