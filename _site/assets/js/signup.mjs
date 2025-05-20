export async function connectSignupAction(signupElement, location, services) {
    if (services.isVerificationLocation(location)) {
        let email = services.getLocal('email');
        if (email) {
            await services.signIn(email, location);
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
    } else {
        signupElement.innerHTML = `
            <h3>Sign up</h3>
            <label>Email:</label><input type="email" id="email"/><button>Submit</button>
        `;
        signupElement.querySelector('button').addEventListener('click', (_e) => {
            let email = signupElement.querySelector('input').value;
            services.sendVerificationEmail(email, location.toString());
            services.setLocal('email', email);
            signupElement.innerHTML = `
            <h3>Continue your sign up!</h3>
            <p>You will receive an email at the address you provided. Please follow the link there to complete your sign up.</p>
            <p>We look forward to seeing you soon!</p>
            `;
        });
    }
}