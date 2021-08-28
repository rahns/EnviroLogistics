import { optimise } from "./Optimise";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import distinctColors from 'distinct-colors'
import './App.css';

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

export class TripLeg {
  constructor(startLocation, endLocation, duration, distance, vehicle, directions, errorStatus) {
    this.startLocation = startLocation;
    this.endLocation = endLocation;
    this.duration = duration;
    this.distance = distance;
    this.vehicle = vehicle;
    this.directions = directions;
    this.legEmissions = vehicle.avgEmissionsPerKm * distance;
    this.errorStatus = errorStatus;
  }

  getDirectionsGeometry(colour) { 
    if (this.directions && !this.errorStatus) {
      return [this.directions.geometry.coordinates, colour]
    } 
    else {
      return [[[this.startLocation.long, this.startLocation.lat], this.endLocation.long, this.endLocation.lat], 'black']
    }
  }

  getMapMarkersList(colour, startNum, endNum) {
    if (!colour) {colour = '#9a53a0'}
    if (!startNum) {startNum = 1}
    const startPopup = new mapboxgl.Popup({ offset: 25 }).setText(
      this.startLocation.nickname
      );
    const endPopup = new mapboxgl.Popup({ offset: 25 }).setText(
      this.endLocation.nickname
      );
    var startMarker = document.createElement('div');
    startMarker.className = 'marker';
    startMarker.innerHTML = '<span style="background: ' + colour + ';"><b>' + (startNum) + '</b></span>'
    var endMarker = document.createElement('div');
    endMarker.className = 'marker';
    endMarker.innerHTML = '<span style="background: ' + colour + ';"><b>' + (endNum ? endNum : startNum instanceof String ? 1 : startNum + 1) + '</b></span>'
    if (this.directions) {
      return [
        new mapboxgl.Marker(startMarker).setLngLat([this.startLocation.long, this.startLocation.lat]).setPopup(startPopup),
        new mapboxgl.Marker(endMarker).setLngLat([this.endLocation.long, this.endLocation.lat]).setPopup(endPopup)
    ];
    }
    return [];
  }

  getMapState(colour) {
    if (!colour) {colour = '#9a53a0'}
    return new MapState(this.getMapMarkersList(colour, "A", "B"), this.directions ? [this.getDirectionsGeometry(colour)] : [])
  }
};

export class VehicleTrip {
  constructor(vehicle, tripLegs) {
    this.vehicle = vehicle;
    this.tripLegs = tripLegs;
    [this.vehicleDistance, this.vehicleDuration] = tripLegs.reduce(
      (accumulator, currentTripLeg) =>
        [accumulator[0] + currentTripLeg.distance, accumulator[1] + currentTripLeg.duration], [0, 0]
    );
    this.vehicleEmissions = vehicle.avgEmissionsPerKm * this.vehicleDistance;
  }

  getMapState(colour, excludeDepotMarker) {
    if (!colour) {colour = '#9a53a0'};
    let markersList = []
    let directionsGeometery = []
    for (let i = 0; i < this.tripLegs.length; i++) {
      if (this.tripLegs[i].directions) {
        if (i !== 0 || !excludeDepotMarker) {markersList.push(this.tripLegs[i].getMapMarkersList(i === 0 ? "black" : colour, i === 0 ? "D" : i)[0])};
        directionsGeometery.push(this.tripLegs[i].getDirectionsGeometry(colour))
      }
    }
    return new MapState(markersList, directionsGeometery)
  }
}

export class MapState {
  constructor(markers, paths) {
    this.markers = markers;
    this.paths = paths;    
  }

  combine(other) {
    this.markers = this.markers.concat(other.markers);
    this.paths = this.paths.concat(other.paths);
  }

  getBoundingBox() {
    if (this.paths.length !== 0) {
      var coords = this.paths.flat().flat().filter((e) => (e instanceof Array));
      var lats = coords.map((e) => e[1])
      var lngs = coords.map((e) => e[0])
      // calc the min and max lng and lat
      var minLat = Math.min.apply(null, lats);
      var maxLat = Math.max.apply(null, lats);
      var minLng = Math.min.apply(null, lngs);
      var maxLng = Math.max.apply(null, lngs);
      return [[minLng, minLat],[maxLng, maxLat]];
    }
    return undefined
  }
}

export class MapVehicleTripData {
  constructor(vehicleTrip) {
    for (let i = 0; i < vehicleTrip.tripLegs.length; i++) {

    }
  }
}

export class Trip {
  constructor(date, vehicleTrips, notes) {
    this.date = date;
    this.notes = notes;
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

  getMapState() {
    const colours = distinctColors({count: this.vehicleTrips.length, lightMin: 30, lightMax: 90, chromaMin: 90}).map(e => e.hex())
    var mapState = new MapState([], [])
    for (let i = 0; i < this.vehicleTrips.length; i++) {
      mapState.combine(this.vehicleTrips[i].getMapState(colours[i%colours.length], i === 0 ? false : true))
    }
    return mapState;
  }

  objectToInstance(obj, dbKey) {
    this.dbKey = dbKey;
    this.notes = obj.notes;
    this.consecutiveDuration = obj.consecutiveDuration;
    this.date = new Date(Date.parse(obj.date));
    this.distance = obj.distance;
    this.emissions = obj.emissions;
    this.totalDuration = obj.totalDuration;
    this.vehicleTrips = obj.vehicleTrips.map((e) => new VehicleTrip(
      new Vehicle(e.vehicle.make, e.vehicle.model, e.vehicle.year, e.vehicle.autoTransmission, e.vehicle.avgEmissionsPerKm, e.vehicle.rego),
      e.tripLegs.map((t) => new TripLeg(new Location(t.startLocation.lat, t.startLocation.long, t.startLocation.nickname),
        new Location(t.endLocation.lat, t.endLocation.long, t.endLocation.nickname), t.duration, t.distance,
        new Vehicle(t.vehicle.make, t.vehicle.model, t.vehicle.year, t.vehicle.autoTransmission, t.vehicle.avgEmissionsPerKm, t.vehicle.rego), t.directions, t.errorStatus))))

  }
};

const hilux = new Vehicle("Toyota", "Hilux", "2002", true, 13, "ABC123");
const mazdasix = new Vehicle("Mazda", "6", "2012", true, 10, "KJC836");
// Example locations
const depot = new Location(-37.871011482016286, 145.02958519226144, "Depot");
const coles = new Location(-37.88547095750236, 145.08436342596195, "Coles");
const woolworths = new Location(-37.94903921470658, 145.0406876435942, "Woolworths");
const monash = new Location(-37.91430871112805, 145.1349541627051, "Monash University");
const gmhbastadium = new Location(-38.15806474307235, 144.35463009484664, "GMHBA Stadium");
const melbournecentral = new Location(-37.8101676448892, 144.96272227875326, "Melbourne Central");
const mcg = new Location(-37.81989845691743, 144.98336346301312, "Melbourne Cricket Ground");
const operahouse = new Location(-33.85678377807042, 151.21533961793205, "Sydney Opera House");

export function getExampleCars() {
  return [hilux, mazdasix];
}

export function getExampleLocations() {
  return [depot, coles, woolworths];
}

export function getExampleLocationsNoDepot() {
  return [coles, woolworths];
}

export function getExampleOptimisedTrip() {
  return optimise(new Date('8/20/2021'), [hilux, mazdasix], [coles, woolworths], depot, "Example optimised trip; 2 vehicles available, 2 delivery jobs, close range");
}

export function getExampleOptimisedTrip2() {
  return optimise(new Date('8/2/2029'), [hilux, mazdasix], [coles, woolworths, monash, gmhbastadium, melbournecentral, mcg, operahouse], depot, "Example optimised trip; 2 vehicles available, 7 delivery jobs, long range delivery");
}

export function getExampleOptimisedTrip3() {
  return optimise(new Date('8/3/2021'), [hilux, mazdasix], [coles, woolworths, monash, melbournecentral, mcg], depot, "Example optimised trip; 2 vehicles available, 5 delivery jobs, mid-range");
}
