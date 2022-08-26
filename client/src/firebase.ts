import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectDatabaseEmulator, getDatabase } from 'firebase/database';


const firebaseConfig = {
    apiKey: "AIzaSyCh3EjuHGyh1IPOZaYh4pV3a_aVgCyaS4A",
    authDomain: "pokemonclone-9ae87.firebaseapp.com",
    databaseURL: "https://pokemonclone-9ae87-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "pokemonclone-9ae87",
    storageBucket: "pokemonclone-9ae87.appspot.com",
    messagingSenderId: "840705661782",
    appId: "1:840705661782:web:44ed9779a94558b29c14f7"
};

const app = initializeApp(firebaseConfig);

connectDatabaseEmulator(getDatabase(app), 'localhost', 8080);
connectAuthEmulator(getAuth(app), 'http://localhost:9099');

export default app;