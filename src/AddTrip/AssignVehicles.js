import React from 'react';
import '../App.css';
import { Grid } from "@material-ui/core";
import CheckboxList from '../components/CheckboxList.js';
import DragDropListOfLists from '../components/DnDListofLists/DnDListofLists';
import { getExampleCars } from '../Classes';

export default function AssignVehicles({ locsChecked, handleToggle, vehiLocs, setVehiLocs, depot, vehiChecked, setVehiChecked }) {
    //vehicle page constants
    const cars = getExampleCars();

    React.useEffect(() => {
        const depotPos = locsChecked.indexOf(depot);
        const noDepotLocs = locsChecked.slice(0, depotPos).concat(locsChecked.slice(depotPos + 1));
        setVehiLocs(initVehiLocs(vehiChecked, noDepotLocs));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vehiChecked, locsChecked]);

    return (
        <div>
            <Grid container>
                <Grid item xs style={{ maxHeight: "70vh", overflow: 'auto' }}>
                    <CheckboxList items={cars} handleToggle={handleToggle(setVehiChecked)} checked={vehiChecked} />
                </Grid>
                <Grid item xs={9}>
                    <div style={{ textAlign: 'center' }}>
                        <p>Drag and drop the locations between your selected cars. Rearrange the locations in the order you would like the cars to visit.</p>
                        <p><b>Note: All vehicles will start and finish at the depot, which is currently set to {depot.toString()}.</b></p>
                    </div>
                    <DragDropListOfLists stateUpdater={setVehiLocs} state={vehiLocs} />
                </Grid>
            </Grid>
        </div>
    )
}

const splitToChunks = (array, parts) => {
    let result = [];
    for (let i = parts; i > 0; i--) {
        result.push(array.splice(0, Math.ceil(array.length / i)));
    }
    return result;
};

const initVehiLocs = (vehicles, locs) => {
    let chunkedLocs = splitToChunks(locs.map((loc, idx) => ({ id: idx.toString(), content: loc })), vehicles.length);
    let result = vehicles.reduce((obj, veh, idx) => {
        obj[veh.toString()] = {
            id: veh.toString(), vehicle: veh, list: chunkedLocs[idx]
        };
        console.log(obj[veh.toString()]);
        return obj;
    }
        , {}
    )
    return result;
};
