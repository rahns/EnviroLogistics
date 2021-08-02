class Vehicle {
    constructor(brand, make, year, autoTransmission, avgEmissionsPerKm, rego) {
      this.brand = brand;
      this.make = make;
      this.year = year;
      this.autoTransmission = autoTransmission;
      this.avgEmissionsPerKm = avgEmissionsPerKm;
      this.rego = rego;
    }

    toString(){
      return this.brand + " " + this.make + " " + this.year + " - " + this.rego;
    }
  };
  
  class Location {
    constructor(lat, long, nickname) {
      this.lat = lat;
      this.long = long;
      this.nickname = nickname;
    }
  }
  
  class TripLeg {
    constructor(startLocation, endLocation, duration, distance) {
      this.startLocation = startLocation;
      this.endLocation = endLocation;
      this.duration = duration;
      this.distance = distance;
    }
  };

  class VehicleTrip {
    constructor(vehicle, tripLegs) {
      this.vehicle = vehicle;
      this.tripLegs = tripLegs;
    }
  }
  
  class Trip {
      constructor(date, vehicleTrips) {
        this.date = date;
        this.vehicleTrips = vehicleTrips
      }
  };
  

const exampleCar = new Vehicle("Toyota", "Hilux", "2002", true, 13, "ABC123");
const exampleCar2 = new Vehicle("Mazda", "6", "2012", true, 10, "KJC836");
const exampleLocation1 = new Location(132, -32, "Depot");
const exampleLocation2 = new Location(136, -36, "Coles");
const exampleLocation3 = new Location(127, -26, "Woolworths");
const exampleTripPast = new Trip(new Date('8/2/2021'), [
    new VehicleTrip(exampleCar, [
      new TripLeg(exampleLocation1, exampleLocation2, 56, 72),
      new TripLeg(exampleLocation2, exampleLocation1, 56, 72)
    ]),
    new VehicleTrip(exampleCar2, [
      new TripLeg(exampleLocation1, exampleLocation3, 56, 72),
      new TripLeg(exampleLocation3, exampleLocation1, 56, 72)
    ])
]);
const exampleTripCurrent = new Trip(new Date('8/3/2021'), [
  new VehicleTrip(exampleCar, [
    new TripLeg(exampleLocation1, exampleLocation2, 56, 72),
    new TripLeg(exampleLocation2, exampleLocation3, 56, 72)
  ]),
  new VehicleTrip(exampleCar2, [
    new TripLeg(exampleLocation3, exampleLocation2, 56, 72),
    new TripLeg(exampleLocation2, exampleLocation1, 56, 72)
  ])
]);
const exampleTripFuture = new Trip(new Date('8/3/2029'), [
  new VehicleTrip(exampleCar, [
    new TripLeg(exampleLocation3, exampleLocation2, 56, 72),
    new TripLeg(exampleLocation2, exampleLocation3, 56, 72)
  ])
]);
export function getExampleTrips() {
  return [exampleTripPast, exampleTripCurrent, exampleTripFuture];
}