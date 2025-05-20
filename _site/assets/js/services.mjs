import { initializeApp } from "firebase/app";
import {
    browserLocalPersistence,
    connectAuthEmulator,
    getAuth,
    isSignInWithEmailLink,
    onAuthStateChanged,
    sendSignInLinkToEmail,
    setPersistence,
    signInWithEmailLink
} from "firebase/auth";
import { connectFirestoreEmulator, collection, getCountFromServer, deleteDoc, doc, getDoc, getFirestore, runTransaction } from 'firebase/firestore';

export class Services {
    #useEmulators;
    #localStorage;
    #currentUser;
    #auth;
    #db;

    constructor(localStorage, useEmulators) {
        this.#useEmulators= useEmulators;
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

        this.#db = await getFirestore();
        this.#auth = await getAuth();

        if (this.#useEmulators) {
            connectAuthEmulator(this.#auth, 'http://localhost:9099');
            connectFirestoreEmulator(this.#db, 'localhost', 8080);
        }
        await setPersistence(this.#auth, browserLocalPersistence);
        onAuthStateChanged(this.#auth, (user) => { this.#currentUser = user; });
    }

    sendVerificationEmail(email, returnLocation) {
        return sendSignInLinkToEmail(this.#auth, email, {
            url: returnLocation,
            handleCodeInApp: true
        });
    }

    isVerificationLocation(location) {
        return isSignInWithEmailLink(this.#auth, location.toString());
    }

    signIn(email, location) {
        return signInWithEmailLink(this.#auth, email, location.href);
    }

    isSignedIn() {
        return !!this.#currentUser;
    }

    async signUp(meetup) {
        this.#assertLoggedIn();

        const meetupRef = doc(this.#db, 'meetups', meetup.id);
        await runTransaction(this.#db, async (transaction) => {
            console.log(getAuth().currentUser);
            const meetupDoc = await transaction.get(meetupRef);
            if(!meetupDoc.exists()) {
                await transaction.set(meetupRef, { date: meetup.date, location: meetup.location });
            }

            await transaction.set(this.#getSignupRef(meetup), { signedUpAt: new Date() });
        });
    }

    async cancelSignUp(meetup) {
        this.#assertLoggedIn();

        await deleteDoc(this.#getSignupRef(meetup));
    }

    async isSignedUp(meetup) {
        this.#assertLoggedIn();

        const signup = await getDoc(this.#getSignupRef(meetup));
        return signup.exists();
    }

    async numberSignedUp(meetup) {
        const result = await getCountFromServer(collection(this.#db, 'meetups', meetup.id, 'signups'));
        return result.data().count;
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

    #assertLoggedIn() {
        if (!this.isSignedIn()) {
            throw new Error('Invalid State: attempting a logged in operation while not logged in.');
        }
    }

    #getSignupRef(meetup) {
        return doc(this.#db, 'meetups', meetup.id, 'signups', this.#currentUser.uid);
    }
}