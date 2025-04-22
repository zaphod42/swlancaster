const getNextMeetupDate = require('schedule');

describe("when the 7th is coming up", () => {
    test('shows the upcoming day', () => {
        expect(getNextMeetupDate(new Date("6 May 2025"))).toBe("Wednesday 7 May");
    });

    test('rolls to the preceeding Friday if it falls on a Saturday', () => {
        expect(getNextMeetupDate(new Date("4 December 2024"))).toBe("Friday 6 December");
    });

    test('rolls to the following Monday if it falls on a Sunday', () => {
        expect(getNextMeetupDate(new Date("4 July 2024"))).toBe("Monday 8 July");
    });

    test('shows the current day on the day of the event', () => {
        expect(getNextMeetupDate(new Date("7 May 2025"))).toBe("Wednesday 7 May");
    });
});

describe("when the 21st is coming up", () => {
    test('shows the upcoming day', () => {
        expect(getNextMeetupDate(new Date("18 May 2025"))).toBe("Wednesday 21 May");
    });

    test('rolls to the preceeding Friday if it falls on a Saturday', () => {
        expect(getNextMeetupDate(new Date("16 December 2024"))).toBe("Friday 20 December");
    });

    test('rolls to the following Monday if it falls on a Sunday', () => {
        expect(getNextMeetupDate(new Date("18 July 2024"))).toBe("Monday 22 July");
    });

    test('shows the current day on the day of the event', () => {
        expect(getNextMeetupDate(new Date("21 May 2025"))).toBe("Wednesday 21 May");
    });
});
