import { connectSignupAction } from '../_site/assets/js/signup.mjs'
import { Meetup } from '../_site/assets/js/schedule.mjs'
import { describe, test } from 'node:test'
import assert from 'node:assert'
import { JSDOM } from 'jsdom'

class DummyServices{
    #localStorage = {};
    verificationsSent = [];
    signedInEmails = [];
    signups = 0;

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

    signUp(_meetup) {
        this.signups++;
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
const meetup = new Meetup(new Date());

async function submitSignup(element, services, email) {
    await connectSignupAction(element, meetup, testLocation, services);
    element.querySelector('button').click();
    element.querySelector('input').value = email;
    element.querySelector('button').click();
}

describe("signup widget", () => {
    test('it renders the email entry button if the user is not signed in', async () => {
        const element = createElement();
        const services = new DummyServices();
        await connectSignupAction(element, meetup, testLocation, services);
        element.querySelector('button').click();

        assert.match(element.innerHTML, /Verify/);
        assert.match(element.innerHTML, /Email:/);
    });

    test('submitting an email sends a verification email', async () => {
        const element = createElement();
        const services = new DummyServices();

        await connectSignupAction(element, meetup, testLocation, services);
        element.querySelector('button').click();
        element.querySelector('input').value = 'test@example.com';
        element.querySelector('button').click();

        assert.ok(services.verificationsSent[0].email === 'test@example.com');
        assert.match(element.innerHTML, /You will receive an email/);
    });

    test('following the verification link shows a thank you', async () => {
        const element = createElement();
        const services = new DummyServices();
        await submitSignup(element, services, 'test@example.com');

        services.setVerificationLocation(testLocation);
        await connectSignupAction(element, meetup, testLocation, services);

        assert.match(element.innerHTML, /Thank you for signing up!/);
    })

    test('following the verification link signs in the user', async () => {
        const element = createElement();
        const services = new DummyServices();
        await submitSignup(element, services, 'test@example.com');

        services.setVerificationLocation(testLocation);
        await connectSignupAction(element, meetup, testLocation, services);

        assert.ok(services.signedInEmails[0].email === 'test@example.com');
        assert.ok(!services.getLocal('email'));
    })

    test('following the verification link signs up the user for the meetup', async () => {
        const element = createElement();
        const services = new DummyServices();
        await submitSignup(element, services, 'test@example.com');

        services.setVerificationLocation(testLocation);
        await connectSignupAction(element, meetup, testLocation, services);

        assert.equal(services.signups, 1);
    })

    test('opening the verification link on a different device shows a warning', async () => {
        const element = createElement();
        const services = new DummyServices();
        await submitSignup(element, services, 'test@example.com');

        services.setVerificationLocation(testLocation);
        services.clearLocalStorage(); // different device identified by empty storage
        await connectSignupAction(element, meetup, testLocation, services);

        assert.match(element.innerHTML, /You have opened the verification link on a different device. Please follow the link on the original device./);
    })

    test('shows a sign up button if the user is signed in', async () => {
        const element = createElement();
        const services = new DummyServices();
        await submitSignup(element, services, 'test@example.com');
        services.setVerificationLocation(testLocation);
        await connectSignupAction(element, meetup, testLocation, services);
        services.setVerificationLocation(null);

        await connectSignupAction(element, meetup, testLocation, services);

        assert.match(element.innerHTML, /Sign Up/);
    })

    test('shows a sign up button if the user is not signed in', async () => {
        const element = createElement();
        const services = new DummyServices();

        await connectSignupAction(element, meetup, testLocation, services);

        assert.match(element.innerHTML, /Sign Up/);
    })
});
