import { connectSignupAction } from '../_site/assets/js/signup.mjs'
import { describe, test } from 'node:test'
import assert from 'node:assert'
import { JSDOM } from 'jsdom'

class DummyServices{
    #localStorage = {};
    verificationsSent = [];
    signedInEmails = [];

    /***
     * Overrides/implementations of the Service interface
     */
    sendVerificationEmail(email, returnLocation) {
        this.verificationsSent.push({ email, returnLocation });
    }

    isVerificationLocation(location) {
        return location === this.verificationLocation;
    }

    signIn(email, location) {
        this.signedInEmails.push({ email, location });
        return Promise.resolve();
    }

    isSignedIn() {
        return this.signedInEmails.length > 0;
    }

    setLocal(key, value) {
        this.#localStorage[key] = value;
    }

    getLocal(key) {
        return this.#localStorage[key];
    }

    removeLocal(key) {
        delete this.#localStorage[key];
    }

    /**
     * Methods to manipulate the double's behaviour
     */
    setVerificationLocation(location) {
        this.verificationLocation = location;
    }

    clearLocalStorage() {
        this.#localStorage = {};
    }
}

function createElement() {
    return (new JSDOM(`<!DOCTYPE html><div></div>`)).window.document.querySelector('div');
}

const testLocation = new URL('http://localhost:3001/testing');

async function submitSignup(element, services, email) {
    await connectSignupAction(element, testLocation, services);
    element.querySelector('input').value = email;
    element.querySelector('button').click();
}

describe("signup widget", () => {
    test('it renders the email entry button by default', async () => {
        const element = createElement();
        const services = new DummyServices();

        await connectSignupAction(element, testLocation, services);

        assert.match(element.innerHTML, /Sign up/);
        assert.match(element.innerHTML, /Email:/);
    });

    test('submitting an email sends a verification email', async () => {
        const element = createElement();
        const services = new DummyServices();

        await submitSignup(element, services, 'test@example.com');

        assert.ok(services.verificationsSent[0].email === 'test@example.com');
        assert.match(element.innerHTML, /You will receive an email/);
    });

    test('following the verification link shows a thank you', async () => {
        const element = createElement();
        const services = new DummyServices();
        await submitSignup(element, services, 'test@example.com');

        services.setVerificationLocation(testLocation);
        await connectSignupAction(element, testLocation, services);

        assert.match(element.innerHTML, /Thank you for signing up!/);
    })

    test('following the verification link signs in the user', async () => {
        const element = createElement();
        const services = new DummyServices();
        await submitSignup(element, services, 'test@example.com');

        services.setVerificationLocation(testLocation);
        await connectSignupAction(element, testLocation, services);

        assert.ok(services.signedInEmails[0].email === 'test@example.com');
        assert.ok(!services.getLocal('email'));
    })

    test('opening the verification link on a different device shows a warning', async () => {
        const element = createElement();
        const services = new DummyServices();
        await submitSignup(element, services, 'test@example.com');

        services.setVerificationLocation(testLocation);
        services.clearLocalStorage(); // different device identified by empty storage
        await connectSignupAction(element, testLocation, services);

        assert.match(element.innerHTML, /You have opened the verification link on a different device. Please follow the link on the original device./);
    })

    test('does not show the different-device warning if the user is signed in', async () => {
        const element = createElement();
        const services = new DummyServices();
        await submitSignup(element, services, 'test@example.com');
        services.setVerificationLocation(testLocation);
        await connectSignupAction(element, testLocation, services);
        services.setVerificationLocation(null);

        await connectSignupAction(element, testLocation, services);

        assert.equal(element.innerHTML, '');
    })
});
