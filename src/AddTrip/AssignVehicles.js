import React from 'react';
import '../App.css';
import { Grid } from "@material-ui/core";
import CheckboxList from '../components/CheckboxList.js';
import DragDropListOfLists from '../components/DnDListofLists/DnDListofLists';
import { getExampleCars } from '../Classes';

export default function AssignVehicles({ locsChecked, handleToggle, vehiLocs, setVehiLocs }) {
    //vehicle page constants
    const cars = getExampleCars();
    const [vehiChecked, setVehiChecked] = React.useState([]);

    React.useEffect(() => {
        setVehiLocs(initVehiLocs(vehiChecked, locsChecked));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vehiChecked, locsChecked]);

    return (
        <div>
            <Grid container>
                <Grid item xs>
                    <CheckboxList items={cars} handleToggle={handleToggle(setVehiChecked)} checked={vehiChecked} />
                </Grid>
                <Grid item xs>
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
        return {
            ...obj, [veh.toString()]: {
                id: veh.toString(), vehicle: veh, list: chunkedLocs[idx]
            }
        }
    }
        , {}
    )
    return result;
};
