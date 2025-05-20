import getNextMeetup from './schedule.mjs';
import { connectSignupAction } from "./signup.mjs";
import { Services } from "./services.mjs";

async function showNextMeetingDate(document, console, fetch) {
    const nextMeetupDateElement = document.getElementById('next-meetup-date');
    try {
        const response = await fetch('https://www.gov.uk/bank-holidays.json');
        if (response.ok) {
            const json = await response.json();
            let meetup = getNextMeetup(new Date(), json);
            nextMeetupDateElement.textContent = meetup.text;
            return meetup;
        } else {
            console.error(response);
            nextMeetupDateElement.textContent = "Error calculating next meetup date.";
        }
    } catch (error) {
        nextMeetupDateElement.textContent = `Error calculating next meetup date: ${error}`;
    }
}

export default async function run(document, localStorage, console, fetch) {
    const meetup = await showNextMeetingDate(document, console, fetch);
    if (document.location.search.match('.*\\bfeature=login\\b.*')) {
        let useAuthEmulator = location.hostname === 'localhost';
        const services = new Services(localStorage, useAuthEmulator);
        await services.initialize();
        await connectSignupAction(document.getElementById('signup-container'), meetup, document.location, services);
    }
}