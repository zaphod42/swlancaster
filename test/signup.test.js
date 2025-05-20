import { connectSignupAction } from '../_site/assets/js/signup.mjs'
import { test, describe } from 'node:test'
import assert from 'node:assert'
import { JSDOM } from 'jsdom'

class DummyFirebase {
    constructor() {
        this.verificationsSent = [];
    }
    sendVerificationEmail(email, returnLocation) {
        this.verificationsSent.push({ email, returnLocation });
    }
}

describe("signup widget", () => {
    test('it renders the email entry button by default', () => {
        const element = (new JSDOM(`<!DOCTYPE html><div></div>`)).window.document.querySelector('div');
        const location = new URL('http://localhost:3001/testing');
        const firebase = new DummyFirebase();

        connectSignupAction(element, location, firebase);

        assert.match(element.innerHTML, /Sign up/);
        assert.match(element.innerHTML, /Email:/);
    });

    test('submitting an email sends a verification email', () => {
        const element = (new JSDOM(`<!DOCTYPE html><div></div>`)).window.document.querySelector('div');
        const location = new URL('http://localhost:3001/testing');
        const firebase = new DummyFirebase();

        connectSignupAction(element, location, firebase);
        element.querySelector('input').value = 'test@example.com';
        element.querySelector('button').click();

        assert.ok(firebase.verificationsSent[0].email === 'test@example.com');
        assert.match(element.innerHTML, /You will receive an email/);
    });
});
