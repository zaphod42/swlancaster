import getNextMeetupDate from "./schedule.mjs";

export default function run(document, console) {
    // Set the next meetup date in the HTML
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