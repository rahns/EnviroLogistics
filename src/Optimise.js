export async function optimise(vehicleList, locationList, depotLocation) {
    // Get distance matrix:
    let locationToArrayMapping, distanceMatrix = getDistanceMatrix(locationList, depotLocation);

    
    // Construct problem for passing to solver:
    let planObj = {jobs: [{id: "job", deliveries: generateDeliveriesList(locationList.length)}]};
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
                }
            ]
        ]
    };

    // Initialise and call solver:
    await window.init();
    await distanceMatrix.then(matrix => console.log(matrix[1]));
    await distanceMatrix.then(matrix => console.log(window.solve_pragmatic(problemObj, matrix[1], {})));
}

async function getDistanceMatrix(locationList, depotLocation) {
    const base_url = "http://router.project-osrm.org/table/v1/driving/";
    const coordinateString = locationList.reduce(((acc, e) => acc + ";" + e.long + "," + e.lat), depotLocation.long + "," + depotLocation.lat);
    const request_url = base_url + coordinateString + "?annotations=distance";
    let response = await fetch(request_url);
    let data = await response.json();
    let matrix = await data.distances.map((e) => (e.map((l) => Math.round(l))));
    // Flip matrix column and rows to be in same format as the solver requires, then flatten from 2D to 1D
    let refactoredMatrix = await matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex])).flat();
    return [[depotLocation].concat(locationList), ([
        {
            "matrix": "normal",
            "distances": refactoredMatrix,
            "travelTimes": new Array(refactoredMatrix.length).fill(0)  // times are required for solver but not used
        }]
    )]
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
            costs: {fixed: 0, distance: i.avgEmissionsPerKm, time: 0},
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
            capacity: [1]
        }
    ))
}