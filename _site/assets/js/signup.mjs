const SIGN_UP_BUTTON = `
    <button>Sign Up</button>
`;

function renderCancelConfirmation(signupElement) {
    signupElement.innerHTML = `
            <h3>Cancelled</h3>
            <p>We are sorry that you can't make it. We hope to see you soon.</p>`
}

function renderCancelButton(signupElement, services, meetup) {
    signupElement.innerHTML = `<button>I'm not going</button>`;
    signupElement.querySelector('button').addEventListener('click', async (_e) => {
        await services.cancelSignUp(meetup);
        renderCancelConfirmation(signupElement);
    });
}

function renderSignedInSignUpButton(signupElement, services, meetup) {
    signupElement.innerHTML = SIGN_UP_BUTTON;
    signupElement.querySelector('button').addEventListener('click', async (_e) => {
        await services.signUp(meetup);
        renderCancelButton(signupElement, services, meetup);
    });
}

function renderContinuationMessage(signupElement) {
    signupElement.innerHTML = `
        <h3>Continue your sign up!</h3>
        <p>You will receive an email at the address you provided. Please follow the link there to verify your email and sign up.</p>
        <p>We look forward to seeing you soon!</p>
    `;
}

function renderEmailVerificationForm(signupElement, onSubmit) {
    signupElement.innerHTML = `
        <h3>Verify</h3>
        <p>In order to sign up we need to verify your email address (don't want any bots, you see).</p>
        <label>Email:</label><input type="email" id="email"/><button>Submit</button>
    `;
    signupElement.querySelector('button').addEventListener('click', (_e) => {
        let email = signupElement.querySelector('input').value;
        onSubmit(email);
        renderContinuationMessage(signupElement);
    });
}

function renderNotSignedInSignUpButton(signupElement, onSubmit) {
    signupElement.innerHTML = SIGN_UP_BUTTON;
    signupElement.querySelector('button').addEventListener('click', (_e) => {
        renderEmailVerificationForm(signupElement, onSubmit);
    });
}

function renderThankYou(signupElement) {
    signupElement.innerHTML = `
        <h3>Thank you for signing up!</h3>
        <p>We look forward to seeing you soon!</p>
    `;
}

function renderProblem(signupElement) {
    signupElement.innerHTML = `
        <h3>Problem signing up!</h3>
        <p>You have opened the verification link on a different device. Please follow the link on the original device.</p>
    `;
}

export async function renderSignupWidget(signupElement, meetup, location, services) {
    if (services.isSignedIn()) {
        if(await services.isSignedUp(meetup)) {
            renderCancelButton(signupElement, services, meetup);
        } else {
            renderSignedInSignUpButton(signupElement, services, meetup, location);
        }
    } else if (!services.isSignedIn() && !services.isVerificationLocation(location)) {
        renderNotSignedInSignUpButton(signupElement, (email) => {
            services.sendVerificationEmail(email, location.toString());
            services.setLocal('email', email);
        });
    } else if (services.isVerificationLocation(location)) {
        let email = services.getLocal('email');
        if (email) {
            await services.signIn(email, location);
            await services.signUp(meetup);
            services.removeLocal('email');
            renderThankYou(signupElement);
        } else {
            renderProblem(signupElement);
        }
    }
}