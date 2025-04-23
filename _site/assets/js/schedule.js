function getNextMeetupDate(date = new Date(), bankHolidaySchedule = {}) {
    function calculateNextMeetupDate(date) {
        function isBankHoliday(date) {
            function fallsOnDate(event) {
                let eventDate = new Date(event['date']);
                return eventDate.getFullYear() === date.getFullYear() && eventDate.getMonth() === date.getMonth() && eventDate.getDay() === date.getDay();
            }

            return bankHolidaySchedule['england-and-wales']?.['events'].some((event) => fallsOnDate(event));
        }

        function isSaturday(newDate) {
            return newDate.getDay() === 6;
        }

        function isSunday(date) {
            return date.getDay() === 0;
        }

        function rollForward(date) {
            if (isSaturday(date) || isSunday(date) || isBankHoliday(date)) {
                return rollForward(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));
            } else {
                return date;
            }
        }

        function rollBackward(date) {
            if (isSaturday(date) || isSunday(date) || isBankHoliday(date)) {
                return rollForward(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1));
            } else {
                return date;
            }
        }

        function distanceBetween(forward, date) {
            return Math.abs(forward.getTime() - date.getTime());
        }

        function rollToClosestAllowed(date) {
            const forward = rollForward(date);
            const backward = rollBackward(date);

            return distanceBetween(forward, date) <= distanceBetween(backward, date) ? forward : backward;
        }

        function nextMonth(date) {
            if(date.getMonth() === 11) {
                return new Date(date.getFullYear() + 1, 0, 1);
            } else {
                return new Date(date.getFullYear(), date.getMonth() + 1, 1);
            }
        }

        // Create Dates for the 7th and 21st of the current month
        const meetup7th = new Date(date.getFullYear(), date.getMonth(), 7);
        const meetup21st = new Date(date.getFullYear(), date.getMonth(), 21);

        // Check the next possible meetup dates
        const nextMeetup7th = rollToClosestAllowed(meetup7th);
        const nextMeetup21st = rollToClosestAllowed(meetup21st);

        if (date <= nextMeetup7th) {
            return nextMeetup7th;
        } else if (date <= nextMeetup21st) {
            return nextMeetup21st;
        } else {
            // If both dates are in the past, calculate the next month's meetup
            return calculateNextMeetupDate(nextMonth(date));
        }
    }


    function formateDate(date) {
        const options = {weekday: 'long', month: 'long', day: 'numeric'};
        return date.toLocaleDateString('en-GB', options);
    }

    // Format the date as a human-readable string
    const nextMeetup = calculateNextMeetupDate(date);
    return formateDate(nextMeetup);
}

if(typeof exports !== 'undefined') {
    module.exports = getNextMeetupDate;
}