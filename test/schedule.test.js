const getNextMeetupDate = require('schedule');

describe("when the 7th is coming up", () => {
    test('shows the upcoming day', () => {
        expect(getNextMeetupDate(new Date("6 May 2025"))).toBe("Wednesday 7 May");
    });

    test('shows the upcoming day in the next month', () => {
        expect(getNextMeetupDate(new Date("22 April 2025"))).toBe("Wednesday 7 May");
    });

    test('rolls to the preceeding Friday if it falls on a Saturday', () => {
        expect(getNextMeetupDate(new Date("4 December 2024"))).toBe("Friday 6 December");
        expect(getNextMeetupDate(new Date("22 November 2024"))).toBe("Friday 6 December");
    });

    test('rolls to the following Monday if it falls on a Sunday', () => {
        expect(getNextMeetupDate(new Date("4 July 2024"))).toBe("Monday 8 July");
        expect(getNextMeetupDate(new Date("22 June 2024"))).toBe("Monday 8 July");
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

describe("skipping bank holidays", () => {
    // See https://www.api.gov.uk/gds/bank-holidays/#bank-holidays
    function bankHolidaysOn(dates) {
        return {
            "england-and-wales": {
                "division": "england-and-wales",
                "events": dates.map((date) => { return { "title": "A Famous Day", "date": date } })
            }
        };
    }

    describe("when the 7th is coming up", () => {
        test('rolls forward if the day is a bank holiday', () => {
            expect(getNextMeetupDate(new Date("1 May 2025"), bankHolidaysOn(["2025-05-07"]))).toBe("Thursday 8 May")
            expect(getNextMeetupDate(new Date("22 Apr 2025"), bankHolidaysOn(["2025-05-07"]))).toBe("Thursday 8 May")
        });

        test('rolls backward if the day is a Friday and is a bank holiday', () => {
            expect(getNextMeetupDate(new Date("1 Nov 2025"), bankHolidaysOn(["2025-11-07"]))).toBe("Thursday 6 November")
            expect(getNextMeetupDate(new Date("22 Oct 2025"), bankHolidaysOn(["2025-11-07"]))).toBe("Thursday 6 November")
        });

        test('rolls backward if the next day is also a bank holiday', () => {
            expect(getNextMeetupDate(new Date("1 May 2025"), bankHolidaysOn(["2025-05-07", "2025-05-08"]))).toBe("Tuesday 6 May")
            expect(getNextMeetupDate(new Date("22 Apr 2025"), bankHolidaysOn(["2025-05-07", "2025-05-08"]))).toBe("Tuesday 6 May")
        });
    });

    describe("when the 21st is coming up", () => {
        test('rolls forward if the day is a bank holiday', () => {
            expect(getNextMeetupDate(new Date("18 May 2025"), bankHolidaysOn(["2025-05-21"]))).toBe("Thursday 22 May")
        });

        test('rolls backward if the day is a Friday and is a bank holiday', () => {
            expect(getNextMeetupDate(new Date("18 Nov 2025"), bankHolidaysOn(["2025-11-21"]))).toBe("Thursday 20 November")
        });

        test('rolls backward if the next day is also a bank holiday', () => {
            expect(getNextMeetupDate(new Date("18 May 2025"), bankHolidaysOn(["2025-05-21", "2025-05-22"]))).toBe("Tuesday 20 May")
        });

        test('rolls forward to Monday when it falls on a saturday preceeded by a bank holiday', () => {
            expect(getNextMeetupDate(new Date("16 December 2024"), bankHolidaysOn(["2024-12-20"]))).toBe("Monday 23 December");
        });
    });
});
