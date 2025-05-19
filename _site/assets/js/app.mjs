import getNextMeetupDate from './schedule.mjs';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

function showNextMeetingDate(document, console, fetch) {
    document.addEventListener('DOMContentLoaded', function () {
        const nextMeetupDateElement = document.getElementById('next-meetup-date');
        fetch('https://www.gov.uk/bank-holidays.json').then((response) => {
            if (response.ok) {
                response.json().then((json) => {
                    nextMeetupDateElement.textContent = getNextMeetupDate(new Date(), json);
                })
            } else {
                console.error(response);
                nextMeetupDateElement.textContent = "Error calculating next meetup date.";
            }
        }).catch((error) => {
            nextMeetupDateElement.textContent = `Error calculating next meetup date: ${error}`;
        });
    });
}

function connectLoginAction(document) {
    if(document.location.hostname === 'localhost') {
        connectAuthEmulator(getAuth(), 'http://localhost:9099');
    }
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start(document.getElementById('firebaseui-auth-container'), {
        signInOptions: [{
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
        }]
    });
}

function initialize() {
    const firebaseConfig = {
        apiKey: "AIzaSyBm3vDDHzmIiLFiSJwedNh_J9HS5JIt_2I",
        authDomain: "software-lancaster.firebaseapp.com",
        projectId: "software-lancaster",
        storageBucket: "software-lancaster.firebasestorage.app",
        messagingSenderId: "844471974310",
        appId: "1:844471974310:web:bd3450059bf0e49f9b3767"
    };
    firebase.initializeApp(firebaseConfig);
}

export default function run(document, console, fetch) {
    showNextMeetingDate(document, console, fetch);
    if(document.location.search.match('.*\\bfeature=login\\b.*')) {
        initialize();
        connectLoginAction(document);
    }
}