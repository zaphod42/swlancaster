import getNextMeetupDate from "../_site/assets/js/schedule.mjs";'../_site/assets/js/schedule.mjs';
import { test, describe } from 'node:test'
import assert from 'node:assert'

describe("when the 7th is coming up", () => {
    test('shows the upcoming day', () => {
        assert.equal(getNextMeetupDate(new Date("6 May 2025")), "Wednesday 7 May");
    });

    test('shows the upcoming day in the next month', () => {
        assert.equal(getNextMeetupDate(new Date("22 April 2025")), "Wednesday 7 May");
    });

    test('rolls to the preceeding Friday if it falls on a Saturday', () => {
        assert.equal(getNextMeetupDate(new Date("4 December 2024")), "Friday 6 December");
        assert.equal(getNextMeetupDate(new Date("22 November 2024")), "Friday 6 December");
    });

    test('rolls to the following Monday if it falls on a Sunday', () => {
        assert.equal(getNextMeetupDate(new Date("4 July 2024")), "Monday 8 July");
        assert.equal(getNextMeetupDate(new Date("22 June 2024")), "Monday 8 July");
    });

    test('shows the current day on the day of the event', () => {
        assert.equal(getNextMeetupDate(new Date("7 May 2025")), "Wednesday 7 May");
    });
});

describe("when the 21st is coming up", () => {
    test('shows the upcoming day', () => {
        assert.equal(getNextMeetupDate(new Date("18 May 2025")), "Wednesday 21 May");
    });

    test('rolls to the preceeding Friday if it falls on a Saturday', () => {
        assert.equal(getNextMeetupDate(new Date("16 December 2024")), "Friday 20 December");
    });

    test('rolls to the following Monday if it falls on a Sunday', () => {
        assert.equal(getNextMeetupDate(new Date("18 July 2024")), "Monday 22 July");
    });

    test('shows the current day on the day of the event', () => {
        assert.equal(getNextMeetupDate(new Date("21 May 2025")), "Wednesday 21 May");
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
            assert.equal(getNextMeetupDate(new Date("1 May 2025"), bankHolidaysOn(["2025-05-07"])), "Thursday 8 May")
            assert.equal(getNextMeetupDate(new Date("22 Apr 2025"), bankHolidaysOn(["2025-05-07"])), "Thursday 8 May")
        });

        test('rolls backward if the day is a Friday and is a bank holiday', () => {
            assert.equal(getNextMeetupDate(new Date("1 Nov 2025"), bankHolidaysOn(["2025-11-07"])), "Thursday 6 November")
            assert.equal(getNextMeetupDate(new Date("22 Oct 2025"), bankHolidaysOn(["2025-11-07"])), "Thursday 6 November")
        });

        test('rolls backward if the next day is also a bank holiday', () => {
            assert.equal(getNextMeetupDate(new Date("1 May 2025"), bankHolidaysOn(["2025-05-07", "2025-05-08"])), "Tuesday 6 May")
            assert.equal(getNextMeetupDate(new Date("22 Apr 2025"), bankHolidaysOn(["2025-05-07", "2025-05-08"])), "Tuesday 6 May")
        });
    });

    describe("when the 21st is coming up", () => {
        test('rolls forward if the day is a bank holiday', () => {
            assert.equal(getNextMeetupDate(new Date("18 May 2025"), bankHolidaysOn(["2025-05-21"])), "Thursday 22 May")
        });

        test('rolls backward if the day is a Friday and is a bank holiday', () => {
            assert.equal(getNextMeetupDate(new Date("18 Nov 2025"), bankHolidaysOn(["2025-11-21"])), "Thursday 20 November")
        });

        test('rolls backward if the next day is also a bank holiday', () => {
            assert.equal(getNextMeetupDate(new Date("18 May 2025"), bankHolidaysOn(["2025-05-21", "2025-05-22"])), "Tuesday 20 May")
        });

        test('rolls forward to Monday when it falls on a saturday preceeded by a bank holiday', () => {
            assert.equal(getNextMeetupDate(new Date("16 December 2024"), bankHolidaysOn(["2024-12-20"])), "Monday 23 December");
        });
    });
});
