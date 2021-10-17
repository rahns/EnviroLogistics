import Fleet from '../Fleet.js';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
});

it('add vehicle', () => {
    const make = document.getElementById("newVehicleMake");
    const model = document.getElementById("newVehicleModel");
    const year = document.getElementById("newVehicleYear");
    const avgEmissions = document.getElementById("newVehicleEmissions");
    const transmission = document.getElementById("newVehicleTransmission");
    make.setAttribute('Honda');
    model.setAttribute('Civic');
    year.setAttribute(2019);
    transmission.setAttribute('Auto');
    avgEmissions.setAttribute(3168);
    addVehicle();
    ref = users.child('ZWLfa5MUIPMrsBceocgtAKfXZLi1').orderByKey().limitToLast(1);
})