const SIGN_UP_BUTTON = `
    <button>Sign Up</button>
`;

export async function connectSignupAction(signupElement, meetup, location, services) {
    if (services.isSignedIn()) {
        signupElement.innerHTML = SIGN_UP_BUTTON;
        signupElement.querySelector('button').addEventListener('click', (_e) => {
            services.signUp(meetup);
        });
    } else if (!services.isSignedIn() && !services.isVerificationLocation(location)) {
        signupElement.innerHTML = SIGN_UP_BUTTON;
        signupElement.querySelector('button').addEventListener('click', (_e) => {
            signupElement.innerHTML = `
                <h3>Verify</h3>
                <p>In order to sign up we need to verify your email address (don't want any bots, you see).</p>
                <label>Email:</label><input type="email" id="email"/><button>Submit</button>
            `;
            signupElement.querySelector('button').addEventListener('click', (_e) => {
                let email = signupElement.querySelector('input').value;
                services.sendVerificationEmail(email, location.toString());
                services.setLocal('email', email);
                signupElement.innerHTML = `
            <h3>Continue your sign up!</h3>
            <p>You will receive an email at the address you provided. Please follow the link there to verify your email and sign up.</p>
            <p>We look forward to seeing you soon!</p>
            `;
            });
        });
    } else if (services.isVerificationLocation(location)) {
        let email = services.getLocal('email');
        if (email) {
            await services.signIn(email, location);
            await services.signUp(meetup);
            services.removeLocal('email');
            signupElement.innerHTML = `
                <h3>Thank you for signing up!</h3>
                <p>We look forward to seeing you soon!</p>
            `;
        } else {
            signupElement.innerHTML = `
                <h3>Problem signing up!</h3>
                <p>You have opened the verification link on a different device. Please follow the link on the original device.</p>
            `;
        }
    }
}