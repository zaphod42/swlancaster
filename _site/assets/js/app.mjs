import getNextMeetupDate from './schedule.mjs';
import { connectSignupAction, initialize } from "./signup.mjs";

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

export default function run(document, console, fetch) {
    showNextMeetingDate(document, console, fetch);
    if(document.location.search.match('.*\\bfeature=login\\b.*')) {
        initialize();
        connectSignupAction(document.getElementById('firebaseui-auth-container'), document.location);
    }
}