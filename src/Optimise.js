export async function optimise(vehicleList, locationList, depotLocation) {
    // Get distance matrix:
    let locationToArrayMapping, distanceMatrix = getDistanceMatrix(locationList, depotLocation);
    // Generate vehicle emission matricies:
    let emissionMatrices = distanceMatrix.then(data => generateEmissionsMatrices(vehicleList, data));
    await emissionMatrices.then(console.log);
}

async function getDistanceMatrix(locationList, depotLocation) {
    const base_url = "http://router.project-osrm.org/table/v1/driving/";
    const coordinateString = locationList.reduce(((acc, e) => acc + ";" + e.long + "," + e.lat), depotLocation.long + "," + depotLocation.lat);
    const request_url = base_url + coordinateString + "?annotations=distance";
    let response = await fetch(request_url);
    let data = await response.json();
    let matrix = await data.distances.map((e) => (e.map((l) => l/1000)));
    // Flip matrix column and rows to be in same format as the solver requires, then flatten from 2D to 1D
    let refactoredMatrix = await matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex])).flat();
    return [[depotLocation].concat(locationList), refactoredMatrix];
}

function generateEmissionsMatrices(vehicleList, distMatrix) {
    return vehicleList.map((vehicle) => (
        {
            "matrix": JSON.stringify(vehicle),
            "distances": distMatrix.map(i => i*(vehicle.avgEmissionsPerKm))
        }
    ));
}