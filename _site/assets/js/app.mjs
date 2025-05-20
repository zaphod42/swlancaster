import getNextMeetup from './schedule.mjs';
import { renderSignupWidget } from "./signup.mjs";
import { Services } from "./services.mjs";
import { renderAttendanceWidget } from "./attendance.mjs";

async function showNextMeetingDate(nextMeetupDateElement, console, fetch) {
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
    let useEmulators = document.location.hostname === 'localhost';
    const services = new Services(localStorage, useEmulators);
    await services.initialize();

    const meetup = await showNextMeetingDate(document.getElementById('next-meetup-date'), console, fetch);
    await renderSignupWidget(document.getElementById('signup-container'), meetup, document.location, services);
    await renderAttendanceWidget(document.getElementById('attendance-container'), meetup, services);
}