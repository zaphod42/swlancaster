function getNextMeetupDate(date = new Date()) {
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();

    // Create Dates for the 7th and 21st of the current month
    const meetup7th = new Date(currentYear, currentMonth, 7);
    const meetup21st = new Date(currentYear, currentMonth, 21);

    // Helper function to get the closest weekday if the date is on a weekend
    function getNextMonday(date) {
        const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
        if (dayOfWeek === 6) {
            // Saturday
            return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
        } else if (dayOfWeek === 0) {
            // Sunday
            return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        }
        return date; // Return the original date if it's not a weekend
    }

    // Check the next possible meetup dates
    const nextMeetup7th = getNextMonday(meetup7th);
    const nextMeetup21st = getNextMonday(meetup21st);

    // Determine which is the next upcoming meetup date
    let nextMeetup;
    if (date <= nextMeetup7th) {
        nextMeetup = nextMeetup7th;
    } else if (date <= nextMeetup21st) {
        nextMeetup = nextMeetup21st;
    } else {
        // If both dates are in the past, calculate the next month's meetup
        const nextMonth = currentMonth + 1;
        nextMeetup = getNextMonday(new Date(currentYear, nextMonth, 7));
    }

    // Format the date as a human-readable string
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return nextMeetup.toLocaleDateString('en-GB', options);
}

module.exports = getNextMeetupDate;