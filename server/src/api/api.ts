import * as admin from 'firebase-admin';
import serviceAccount from '../../service-account.json';
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    databaseURL: process.env.DATABASE_URL,
});

import express from 'express';
import { GameServer } from '../game-server';

const api = express();

export default ((gameServerInstance: GameServer) => {
    return api;
});
