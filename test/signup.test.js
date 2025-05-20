import { connectSignupAction } from '../_site/assets/js/signup.mjs'
import { describe, test } from 'node:test'
import assert from 'node:assert'
import { JSDOM } from 'jsdom'

class DummyServices{
    constructor() {
        this.verificationsSent = [];
    }

    sendVerificationEmail(email, returnLocation) {
        this.verificationsSent.push({ email, returnLocation });
    }

    isVerificationLocation(location) {
        return location === this.verificationLocation;
    }

    setVerificationLocation(location) {
        this.verificationLocation = location;
    }
}

function createElement() {
    return (new JSDOM(`<!DOCTYPE html><div></div>`)).window.document.querySelector('div');
}

const testLocation = new URL('http://localhost:3001/testing');

describe("signup widget", () => {
    test('it renders the email entry button by default', () => {
        const element = createElement();
        const services = new DummyServices();

        connectSignupAction(element, testLocation, services);

        assert.match(element.innerHTML, /Sign up/);
        assert.match(element.innerHTML, /Email:/);
    });

    test('submitting an email sends a verification email', () => {
        const element = createElement();
        const services = new DummyServices();

        connectSignupAction(element, new URL('http://localhost:3001/testing'), services);
        element.querySelector('input').value = 'test@example.com';
        element.querySelector('button').click();

        assert.ok(services.verificationsSent[0].email === 'test@example.com');
        assert.match(element.innerHTML, /You will receive an email/);
    });

    test('following the verification link shows a thank you', () => {
        const element = createElement();
        const services = new DummyServices();
        services.setVerificationLocation(testLocation);

        connectSignupAction(element, testLocation, services);

        assert.match(element.innerHTML, /Thank you for signing up!/);
    })
});
