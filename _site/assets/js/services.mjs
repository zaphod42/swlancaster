import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";

export class Services {
    #useAuthEmulator;
    #localStorage;
    #currentUser;

    constructor(localStorage, useAuthEmulator) {
        this.#useAuthEmulator = useAuthEmulator;
        this.#localStorage = localStorage;
    }

    async initialize() {
        const firebaseConfig = {
            apiKey: "AIzaSyBm3vDDHzmIiLFiSJwedNh_J9HS5JIt_2I",
            authDomain: "software-lancaster.firebaseapp.com",
            projectId: "software-lancaster",
            storageBucket: "software-lancaster.firebasestorage.app",
            messagingSenderId: "844471974310",
            appId: "1:844471974310:web:bd3450059bf0e49f9b3767"
        };
        initializeApp(firebaseConfig);

        if (this.#useAuthEmulator) {
            connectAuthEmulator(getAuth(), 'http://localhost:9099');
        }
        await setPersistence(getAuth(), browserLocalPersistence);
        onAuthStateChanged(getAuth(), (user) => { this.#currentUser = user; });
    }

    sendVerificationEmail(email, returnLocation) {
        return sendSignInLinkToEmail(getAuth(), email, {
            url: returnLocation,
            handleCodeInApp: true
        });
    }

    isVerificationLocation(location) {
        return isSignInWithEmailLink(getAuth(), location.toString());
    }

    signIn(email, location) {
        return signInWithEmailLink(getAuth(), email, location.href);
    }

    isSignedIn() {
        return !!this.#currentUser;
    }

    getLocal(key) {
        return this.#localStorage.getItem(key);
    }

    setLocal(key, value) {
        this.#localStorage.setItem(key, value);
    }

    removeLocal(key) {
        this.#localStorage.removeItem(key);
    }
}