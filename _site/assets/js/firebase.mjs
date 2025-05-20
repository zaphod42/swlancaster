import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, sendSignInLinkToEmail } from "firebase/auth";

export class Firebase {
    #useAuthEmulator;

    constructor(useAuthEmulator) {
        this.#useAuthEmulator = useAuthEmulator;
    }

    initialize() {
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
    }

    sendVerificationEmail(email, returnLocation) {
        return sendSignInLinkToEmail(getAuth(), email, {
            url: returnLocation,
            handleCodeInApp: true
        });
    }

}