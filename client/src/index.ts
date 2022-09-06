import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants/environment";
import { Game } from "./game";
import { SpriteLoader } from "./sprite-loader";
import mainChar from './assets/main_character.png';
import spritesheet from './assets/pokemonmap.png';
import exMark from './assets/ex_mark.png';
import { FIREBASE_APP, DB, AUTH } from './firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const email = document.getElementById('email') as HTMLInputElement;
const password = document.getElementById('password') as HTMLInputElement;
const formText = document.getElementById('form-text');
const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
let showLogin = true;

formText?.addEventListener('click', () => {
  showLogin = !showLogin;
  formText.textContent = showLogin ? 'New User? Register' : 'Already have an account. Log in';
  loginBtn.textContent = showLogin ? 'Sign in' : 'Sign up';
})

loginBtn?.addEventListener('click', async (ev) => {
  const emailText = email.value;
  const passwordText = password.value;
  console.log({
    emailText,
    passwordText,
  });

  ev.preventDefault();
  try {
    const res = showLogin ?
      await signInWithEmailAndPassword(AUTH, emailText, passwordText) :
      await createUserWithEmailAndPassword(AUTH, emailText, passwordText);
    const { expirationTime, token } = await res.user.getIdTokenResult();
    console.log({ expirationTime });
    const user = {
      token,
      uid: res.user.uid,
    };
    await main(user);
    canvas.style.display = 'block';
    document.getElementById('form')!.style.display = 'none';

  } catch (error) {
    console.error(error);
  }

});


async function main(user: { token: string, uid: string }) {
  const { uid, token } = user;
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`Canvas hasn't initialized yet`);
  }
  fixCanvasHeight(canvas);
  window.addEventListener('resize', () => fixCanvasHeight(canvas));

  const { playerSprite, spritesheetSprite, exMarkSprite } = await loadAllImages();
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
  SpriteLoader.SPRITES.EX_MARK = {
    loaded: true,
    image: exMarkSprite,
    height: exMarkSprite.height,
    width: exMarkSprite.width,
  };
  SpriteLoader.ALL_LOADED = true;
  const game = new Game({ uid, token });
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

  const exMarkSprite = new Image();
  exMarkSprite.src = exMark;
  const exMarkSpriteLoadedTask = new Promise<boolean>((res, rej) => {
    exMarkSprite.addEventListener('load', function () {
      res(true);
    }, false);
  });


  await Promise.all([playerSpriteLoadedTask, spritesheetLoadedTask, exMarkSpriteLoadedTask]);
  return { playerSprite, spritesheetSprite, exMarkSprite };
}
