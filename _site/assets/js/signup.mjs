export function connectSignupAction(signupElement, location, firebase) {
    signupElement.innerHTML = `
        <h3>Sign up</h3>
        <label>Email:</label><input type="email" id="email"/><button>Submit</button>
    `;
    signupElement.querySelector('button').addEventListener('click', (_e) => {
        firebase.sendVerificationEmail(signupElement.querySelector('input').value, location.toString());
        signupElement.innerHTML = `
        <h3>Continue your sign up!</h3>
        <p>You will receive an email at the address you provided. Please follow the link there to complete your sign up.</p>
        <p>We look forward to seeing you soon!</p>
        `;
    });
}