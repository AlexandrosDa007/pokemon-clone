import * as admin from 'firebase-admin';

export const db = admin.database();
export const rootRef = db.ref();
