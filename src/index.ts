import { Game } from "./game";
const mainChar = require('./assets/main_character.png').default;
console.log(mainChar);

function main() {
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`Canvas hasn't initialized yet`);
  }
  fixCanvasHeight(canvas);
  window.addEventListener('resize', () => fixCanvasHeight(canvas));
  const playerSprite = new Image();   // Create new img element
  playerSprite.src = mainChar; // Set source path
  playerSprite.addEventListener('load', function () {
    // execute drawImage statements here
    const game = new Game(640, 640, playerSprite);
  }, false);
}


function fixCanvasHeight(canvas: HTMLCanvasElement) {
  canvas.height = 640;
  canvas.width = 640;
}
main();