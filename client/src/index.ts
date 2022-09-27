import { Game } from './game';
import { SpriteLoader } from './sprite-loader';
import mainChar from './assets/main_character.png';
import spritesheet from './assets/pokemonmap.png';
import exMark from './assets/ex_mark.png';
import ArrowRight from './assets/arrow_right.png';
import { AUTH } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Settings } from './settings';
import { ViewPort } from './viewport';
import './style.css';

const email = document.getElementById('email') as HTMLInputElement;
const password = document.getElementById('password') as HTMLInputElement;
const formText = document.getElementById('form-text');
const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
let showLogin = true;

formText?.addEventListener('click', () => {
  showLogin = !showLogin;
  formText.textContent = showLogin
    ? 'New User? Register'
    : 'Already have an account. Log in';
  loginBtn.textContent = showLogin ? 'Sign in' : 'Sign up';
});

loginBtn?.addEventListener('click', async (ev) => {
  const emailText = email.value;
  const passwordText = password.value;
  console.log({
    emailText,
    passwordText,
  });

  ev.preventDefault();
  try {
    const res = showLogin
      ? await signInWithEmailAndPassword(AUTH, emailText, passwordText)
      : await createUserWithEmailAndPassword(AUTH, emailText, passwordText);
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

async function main(user: { token: string; uid: string }) {
  const { uid, token } = user;
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error(`Canvas hasn't initialized yet`);
  }
  fixCanvasHeight(canvas);
  window.addEventListener('resize', () => fixCanvasHeight(canvas));

  const { playerSprite, spritesheetSprite, exMarkSprite, arrowRightSprite } =
    await loadAllImages();
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
  SpriteLoader.SPRITES.ARROW_RIGHT = {
    loaded: true,
    image: arrowRightSprite,
    height: arrowRightSprite.height,
    width: arrowRightSprite.width,
  };
  SpriteLoader.ALL_LOADED = true;
  const game = new Game({ uid, token });
}

function fixCanvasHeight(canvas: HTMLCanvasElement) {
  const newWidth = Math.min(window.innerWidth - 50, 720);
  const newHeight = Math.min(window.innerHeight - 50, 640);
  console.log({
    newWidth,
    newHeight,
  });

  canvas.width = newWidth >= 480 ? newWidth : 480;
  canvas.height = newHeight;
  Settings.CANVAS_WIDTH = newWidth >= 480 ? newWidth : 480;
  Settings.CANVAS_HEIGHT = newHeight;
  ViewPort.resize();
}

async function loadAllImages() {
  const playerSprite = new Image(); // Create new img element
  playerSprite.src = mainChar; // Set source path
  const playerSpriteLoadedTask = new Promise<boolean>((res, rej) => {
    playerSprite.addEventListener(
      'load',
      function () {
        res(true);
      },
      false,
    );
  });
  const spritesheetSprite = new Image();
  spritesheetSprite.src = spritesheet;
  const spritesheetLoadedTask = new Promise<boolean>((res, rej) => {
    spritesheetSprite.addEventListener(
      'load',
      function () {
        res(true);
      },
      false,
    );
  });

  const exMarkSprite = new Image();
  exMarkSprite.src = exMark;
  const exMarkSpriteLoadedTask = new Promise<boolean>((res, rej) => {
    exMarkSprite.addEventListener(
      'load',
      function () {
        res(true);
      },
      false,
    );
  });

  const arrowRightSprite = new Image();
  arrowRightSprite.src = ArrowRight;
  const arrowRightSpriteLoadedTask = new Promise<boolean>((res, rej) => {
    arrowRightSprite.addEventListener(
      'load',
      function () {
        res(true);
      },
      false,
    );
  });

  await Promise.all([
    playerSpriteLoadedTask,
    spritesheetLoadedTask,
    exMarkSpriteLoadedTask,
    arrowRightSpriteLoadedTask,
  ]);
  return { playerSprite, spritesheetSprite, exMarkSprite, arrowRightSprite };
}
