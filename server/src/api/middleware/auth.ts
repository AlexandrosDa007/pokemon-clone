import { auth } from "firebase-admin";

export const getAuth = async (token: string) => {
    try {
        const { uid } = await auth().verifyIdToken(token);
        return uid;
    } catch (error) {
        //TODO: log errors
        console.error(error);
        return null;
    }
};
