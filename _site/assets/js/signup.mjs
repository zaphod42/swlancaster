import { connectAuthEmulator, getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { initializeApp } from "firebase/app";

export function connectSignupAction(signupElement, location) {
    if (location.hostname === 'localhost') {
        connectAuthEmulator(getAuth(), 'http://localhost:9099');
    }
    signupElement.innerHTML = `
        <h3>Sign up</h3>
        <label>Email:</label><input type="email" id="email"/><button>Submit</button>
    `;
    const actionCodeSettings = {
        url: location.toString(),
        handleCodeInApp: true
    };
    signupElement.querySelector('button').addEventListener('click', (_e) => {
        sendSignInLinkToEmail(getAuth(), signupElement.querySelector('input').value, actionCodeSettings);
        signupElement.innerHTML = `
        <h3>Continue your sign up!</h3>
        <p>You will have recieved an email at the address you provided. Please follow the link there to complete your sign up.</p>
        <p>We look forward to seeing you soon!</p>
        `;
    });
}

export function initialize() {
    const firebaseConfig = {
        apiKey: "AIzaSyBm3vDDHzmIiLFiSJwedNh_J9HS5JIt_2I",
        authDomain: "software-lancaster.firebaseapp.com",
        projectId: "software-lancaster",
        storageBucket: "software-lancaster.firebasestorage.app",
        messagingSenderId: "844471974310",
        appId: "1:844471974310:web:bd3450059bf0e49f9b3767"
    };
    initializeApp(firebaseConfig);
}