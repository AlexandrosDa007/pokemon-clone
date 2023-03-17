require('module-alias/register');
import 'dotenv/config';
import API from './api/api';
import { GameServer } from './game-server';
import { WorldManager } from './models/world-manager';

console.log('Starting server V@');

// const gameServer = GameServer.getInstance();
const worldManager = WorldManager.getInstance();
API();
