class Vehicle {
    constructor(brand, make, year, autoTransmission, avgEmissionsPerKm, rego) {
      this.brand = brand;
      this.make = make;
      this.year = year;
      this.autoTransmission = autoTransmission;
      this.avgEmissionsPerKm = avgEmissionsPerKm;
      this.rego = rego;
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
    constructor(startLocation, endLocation, vehicle, duration, distance) {
      this.startLocation = startLocation;
      this.endLocation = endLocation;
      this.vehicle = vehicle;
      this.duration = duration;
      this.distance = distance;
    }
  };
  
  class Trip {
      constructor(date, legs) {
        this.date = date;
        this.legs = legs;
      }
  };
  

const exampleCar = Vehicle("Toyota", "Hilux", "2002", true, 13, "ABC123");
const exampleLocation1 = Location(132, -32, "Depot");
const exampleLocation2 = Location(136, -36, "Stop 1");
const exampleTrip = Trip(Date('2/8/2021'), [
    TripLeg(exampleLocation1, exampleLocation2, exampleCar, 56, 72),
    TripLeg(exampleLocation2, exampleLocation1, exampleCar, 56, 72)
]);
console.log(exampleTrip);