import * as admin from 'firebase-admin';
import serviceAccount from '../../service-account.json';
process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099"
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    databaseURL: process.env.DATABASE_URL,
});

import express from 'express';
import { GameServer } from '..';

const api = express();

export default ((gameServerInstance: GameServer) => {
    return api;
});