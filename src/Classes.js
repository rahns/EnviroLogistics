export class Vehicle {
  constructor(make, model, year, autoTransmission, avgEmissionsPerKm, rego) {
    this.make = make;
    this.model = model;
    this.year = year;
    this.autoTransmission = autoTransmission;
    this.avgEmissionsPerKm = avgEmissionsPerKm;
    this.rego = rego;
  }

  toString() {
    return this.rego + " - " + this.make + " " + this.model + " " + this.year;
  }

  objectToInstance(obj, dbKey) {
    this.dbKey = dbKey;
    this.make = obj.make;
    this.model = obj.model;
    this.year = obj.year;
    this.autoTransmission = obj.autoTransmission;
    this.avgEmissionsPerKm = obj.avgEmissionsPerKm;
    this.rego = obj.rego;
  }
};

export class Location {
  constructor(lat, long, nickname) {
    this.lat = lat;
    this.long = long;
    this.nickname = nickname;
  }

  toString() {
    return this.nickname;
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

export class Trip {
  constructor(date, vehicleTrips) {
    this.date = date;
    this.vehicleTrips = vehicleTrips;
    if (vehicleTrips !== undefined) {
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
  }
  objectToInstance(obj, dbKey) {
    this.dbKey = dbKey;
    this.consecutiveDuration = obj.consecutiveDuration;
    this.date = new Date(Date.parse(obj.date));
    this.distance = obj.distance;
    this.emissions = obj.emissions;
    this.totalDuration = obj.totalDuration;
    this.vehicleTrips = obj.vehicleTrips.map((e) => new VehicleTrip(
      new Vehicle(e.vehicle.make, e.vehicle.model, e.vehicle.year, e.vehicle.autoTransmission, e.vehicle.avgEmissionsPerKm, e.vehicle.rego),
      e.tripLegs.map((t) => new TripLeg(new Location(t.startLocation.lat, t.startLocation.long, t.startLocation.nickname),
        new Location(t.endLocation.lat, t.endLocation.long, t.endLocation.nickname), t.duration, t.distance,
        new Vehicle(t.vehicle.make, t.vehicle.model, t.vehicle.year, t.vehicle.autoTransmission, t.vehicle.avgEmissionsPerKm, t.vehicle.rego)))))

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

export function getExampleCars() {
  return [exampleCar, exampleCar2];
}

export function getExampleLocations() {
  return [exampleLocation1, exampleLocation2, exampleLocation3];
}
