// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDz3xAsYHHi4BW8eKrknHkPj40BmoBq7uk",
    authDomain: "voice-vote-bf4ea.firebaseapp.com",
    projectId: "voice-vote-bf4ea",
    storageBucket: "voice-vote-bf4ea.appspot.com",
    messagingSenderId: "291123850624",
    appId: "1:291123850624:web:9375ed210978dbc2146565",
    measurementId: "G-KDMSC1KXM5"
};

// Initialize Firebase app only once
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

// Initialize and export Storage
const storage = getStorage(app);

export { storage };
