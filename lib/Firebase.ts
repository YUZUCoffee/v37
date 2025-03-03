import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCWF7lky8RLkA2dr_xtf8cNRL6-t0j_lOg",
    authDomain: "nfc-coffee-app.firebaseapp.com",
    databaseURL: "https://nfc-coffee-app-default-rtdb.firebaseio.com",
    projectId: "nfc-coffee-app",
    storageBucket: "nfc-coffee-app.firebasestorage.app",
    messagingSenderId: "698012891748",
    appId: "1:698012891748:web:9a23c3b386477b53cc7d71",
    measurementId: "G-98QR48J83W"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, get, set };
