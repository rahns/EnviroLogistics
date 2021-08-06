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
      return this.rego + " - " + this.brand + " " + this.make + " " + this.year;
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
    constructor(startLocation, endLocation, duration, distance, vehicle) {
      this.startLocation = startLocation;
      this.endLocation = endLocation;
      this.duration = duration;
      this.distance = distance;
      this.vehicle = vehicle;
      this.legEmissions = vehicle.avgEmissionsPerKm * distance;
    }
  };

  class VehicleTrip {
    constructor(vehicle, tripLegs) {
      this.vehicle = vehicle;
      this.tripLegs = tripLegs;
      [this.vehicleDistance, this.vehicleDuration] = tripLegs.reduce(
        (accumulator, currentTripLeg) => 
        [accumulator[0] + currentTripLeg.distance, accumulator[1] + currentTripLeg.duration], [0, 0]
        );
      this.vehicleEmissions = vehicle.avgEmissionsPerKm * this.vehicleDistance;
    }
  }
  
  class Trip {
      constructor(date, vehicleTrips) {
        this.date = date;
        this.vehicleTrips = vehicleTrips;
        [this.distance, this.totalDuration, this.emissions, this.consecutiveDuration] = vehicleTrips.reduce(
          (accumulator, currentVehicleTrip) =>
          [
            accumulator[0] + currentVehicleTrip.vehicleDistance, 
            accumulator[1] + currentVehicleTrip.vehicleDuration,
            accumulator[2] + currentVehicleTrip.vehicleEmissions,
            Math.max(accumulator[3], currentVehicleTrip.vehicleDuration)
          ], 
          [0, 0, 0, 0]
        );
      }
  };
  

const exampleCar = new Vehicle("Toyota", "Hilux", "2002", true, 13, "ABC123");
const exampleCar2 = new Vehicle("Mazda", "6", "2012", true, 10, "KJC836");
const exampleLocation1 = new Location(-37.93556359903012, 145.0612926526105, "Depot");
const exampleLocation2 = new Location(-37.88547095750236, 145.08436342596195, "Coles");
const exampleLocation3 = new Location(-37.94903921470658, 145.0406876435942, "Woolworths");
const exampleTripPast = new Trip(new Date('8/2/2021'), [
    new VehicleTrip(exampleCar, [
      new TripLeg(exampleLocation1, exampleLocation2, 56, 72, exampleCar),
      new TripLeg(exampleLocation2, exampleLocation1, 56, 72, exampleCar)
    ]),
    new VehicleTrip(exampleCar2, [
      new TripLeg(exampleLocation1, exampleLocation3, 56, 72, exampleCar2),
      new TripLeg(exampleLocation3, exampleLocation1, 56, 72, exampleCar2)
    ])
]);
const exampleTripCurrent = new Trip(new Date('8/3/2021'), [
  new VehicleTrip(exampleCar, [
    new TripLeg(exampleLocation1, exampleLocation2, 56, 72, exampleCar),
    new TripLeg(exampleLocation2, exampleLocation3, 56, 72, exampleCar)
  ]),
  new VehicleTrip(exampleCar2, [
    new TripLeg(exampleLocation3, exampleLocation2, 56, 72, exampleCar2),
    new TripLeg(exampleLocation2, exampleLocation1, 56, 72, exampleCar2)
  ])
]);
const exampleTripFuture = new Trip(new Date('8/3/2029'), [
  new VehicleTrip(exampleCar, [
    new TripLeg(exampleLocation3, exampleLocation2, 56, 72, exampleCar),
    new TripLeg(exampleLocation2, exampleLocation3, 56, 72, exampleCar)
  ])
]);

export function getExampleTrips() {
  return [exampleTripPast, exampleTripCurrent, exampleTripFuture];
}