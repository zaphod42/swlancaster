export async function renderAttendanceWidget(element, meetup, services) {
    let count = await services.numberSignedUp(meetup);
    if(count === 0) {
        element.innerHTML = `<p>Nobody's signed up yet. Bet the first!</p>`;
    } else {
        const verb = count !== 1 ? 'are' : 'is';
        element.innerHTML = `<p>There ${verb} ${count} attending.</p>`;
    }
}