import { Trip, VehicleTrip, TripLeg } from "./Classes";

export async function optimise(tripDate, vehicleList, locationList, depotLocation, notes) {
    // Get distance matrix:
    let matrix_data = getMatrices(locationList, depotLocation);
    
    // Construct problem for passing to solver:
    let planObj = {jobs: generateDeliveriesList(locationList.length).map(e => {
        return {id: JSON.stringify(e), deliveries: [e]}
    })};
    let fleetObj = {
        profiles: [{"name": "normal"}], 
        vehicles: generateVehiclesList(vehicleList)
    };

    let problemObj = {
        plan: planObj, 
        fleet: fleetObj, 
        objectives: [
            [
                {
                    "type": "minimize-unassigned"
                }
            ],
            [
                {
                    "type": "minimize-cost"
                },
                {
                    "type": "minimize-distance"
                },
                {
                    "type": "maximize-tours"
                },
                // {
                //     "type": "minimize-duration"
                // }
            ]
        ]
    };

    const config = {
        "termination": {
             "maxTime": 5,
        }
    };

    console.log(problemObj)

    // Initialise and call solver:
    await window.init();
    let result;
    await matrix_data.then(async data => result = await responseToTrip(
            tripDate, 
            window.solve_pragmatic(problemObj, data[1], config), 
            data[0], notes)
    );
    return result;
}

async function getMatrices(locationList, depotLocation) {
    const base_url = "https://api.openrouteservice.org/v2/matrix/driving-car";
    let locations = [[depotLocation.long, depotLocation.lat]];
    locationList.forEach(e => locations.push([e.long, e.lat]));
    const bodyData = {"locations":locations,"metrics":["distance","duration"],"units":"m"};
    const response = await fetch(base_url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
          'Content-Type': 'application/json',
          'Authorization': process.env.REACT_APP_OPENROUTESERVICE_API_KEY
        },
        body: JSON.stringify(bodyData)
      });
    let data = await response.json();
    let distanceMatrix = await data.distances.map((e) => (e.map((l) => Math.round(l)))).flat();
    let durationMatrix = await data.durations.map((e) => (e.map((l) => Math.round(l/60)))).flat();
    return [
        [depotLocation].concat(locationList), 
        ([{
            "matrix": "normal",
            "distances": distanceMatrix,
            "travelTimes": durationMatrix 
        }])
    ]
}

function generateDeliveriesList(numberOfDeliveries) {
    let deliveriesList = [];
    for (let i = 0; i < numberOfDeliveries; i++) {
        deliveriesList.push(
            {
                places: [
                    {
                        location: {
                            index: i+1
                        },
                        duration: 0
                    }
                ],
                demand: [0]
            }
        );
    }
    return deliveriesList;
}

function generateVehiclesList(vehicleList) {
    return vehicleList.map(i => (
        {
            typeId: JSON.stringify(i),
            vehicleIds: [JSON.stringify(i)],
            profile: {
                "matrix": "normal"
            },
            costs: {fixed: 71000, distance: i.avgEmissionsPerKm, time: 450},
            // costs: {fixed: 0, distance: i.avgEmissionsPerKm, time: 0},
            shifts: [{
                start: {
                    earliest: "1900-01-01T00:00:00Z",
                    location: {
                        index: 0
                    }
                },
                end: {
                    latest: "2200-01-01T00:00:00Z",
                    location: {
                        index: 0
                    }
                }
            }],
            capacity: [1],
            limits: {}
        }
    ))
}

async function responseToTrip(date, response, locationIndexMapping, notes) {
    console.log(locationIndexMapping)
    

    response = JSON.parse(response);
    console.log(response)
    console.log(response.tours.length)
    let vehicleTrips = Promise.all(response.tours.map(async tour => await tourToVehicleTrip(tour, locationIndexMapping)));

    return new Trip(date, await vehicleTrips, notes);
}

async function tourToVehicleTrip(tour, locationIndexMapping) {
    let vehicle = JSON.parse(tour.vehicleId);

    let tripLegs = [];
    let stops = tour.stops;

    for (let i = 1; i < stops.length; i++) {
        let startLocation = locationIndexMapping[stops[i-1].location.index];
        let endLocation = locationIndexMapping[stops[i].location.index];
        let directions = await getDirections(startLocation, endLocation)
        if (directions.error) {alert(
            "Couldn't find a driveable route between " + startLocation.nickname + " and " + endLocation.nickname + ". \nError code: "+ directions.error.message)}
        let leg = new TripLeg(
                startLocation,
                endLocation,
                directions.error ? 0 : Math.round(directions.features[0].properties.summary.duration / 60),
                directions.error ? 0 : Math.round(directions.features[0].properties.summary.distance / 1000),
                vehicle,
                directions.error ? undefined : directions.features[0], 
                directions.error
        )
        tripLegs.push(leg);
    }

    return new VehicleTrip(vehicle, tripLegs);
}

export async function getDirections(start, end) {
    let base_url = "https://api.openrouteservice.org/v2/directions/driving-car?api_key=" + process.env.REACT_APP_OPENROUTESERVICE_API_KEY + "&";
    let request_url = base_url + "start=" + start.long + "," + start.lat + "&end=" + end.long + "," + end.lat
    const response = await fetch(request_url, {mode: 'cors'})

    return response.json()
}