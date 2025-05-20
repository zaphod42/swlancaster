import { renderAttendanceWidget } from '../_site/assets/js/attendance.mjs'
import { Meetup } from '../_site/assets/js/schedule.mjs'
import { describe, test } from 'node:test'
import assert from 'node:assert'
import { JSDOM } from 'jsdom'

class DummyServices{
    #numberSignedUp;

    constructor(numberSignedUp){
        this.#numberSignedUp = numberSignedUp;
    }

    numberSignedUp(_meetup){
        return this.#numberSignedUp;
    }
}

function createElement() {
    return (new JSDOM(`<!DOCTYPE html><div></div>`)).window.document.querySelector('div');
}

const meetup = new Meetup(new Date());

describe("attendance widget", () => {
    test('shows a sad message when nobody is signed up', async () => {
        const element = createElement();
        const services = new DummyServices(0);

        await renderAttendanceWidget(element, meetup, services);

        assert.match(element.innerHTML, /Nobody's signed up/);
    })

    test('message with one signed up', async () => {
        const element = createElement();
        const services = new DummyServices(1);

        await renderAttendanceWidget(element, meetup, services);

        assert.match(element.innerHTML, /There is 1 attending/);
    })

    test('message with many signed up', async () => {
        const element = createElement();
        const services = new DummyServices(10);

        await renderAttendanceWidget(element, meetup, services);

        assert.match(element.innerHTML, /There are 10 attending/);
    })
})