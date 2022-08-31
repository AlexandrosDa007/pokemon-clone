require('module-alias/register');
import 'dotenv/config';
import API from './api/api';
import { GameServer } from './game-server';

console.log('Starting server');

const gameServer = new GameServer();
API(gameServer);
