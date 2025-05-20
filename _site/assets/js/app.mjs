import getNextMeetupDate from './schedule.mjs';
import { connectSignupAction } from "./signup.mjs";
import { Services } from "./services.mjs";

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

export default async function run(document, localStorage, console, fetch) {
    showNextMeetingDate(document, console, fetch);
    if (document.location.search.match('.*\\bfeature=login\\b.*')) {
        let useAuthEmulator = location.hostname === 'localhost';
        const services = new Services(localStorage, useAuthEmulator);
        services.initialize();
        await connectSignupAction(document.getElementById('signup-container'), document.location, services);
    }
}