import React from 'react';
import '../App.css';
import { DateTimePicker } from "@material-ui/pickers";
import { TextField, Grid, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import MapBox from '../components/MapBox.js';
import { optimise, tourToVehicleTrip } from '../Optimise';
import { Trip } from "../Classes";

export default function ExtraDetails({ vehiLocs, locsChecked, vehiChecked, depot, setTrip, currentTrip }) {
    //details page constants
    const [selectedDate, handleDateChange] = React.useState(new Date());
    const [notes, setNotes] = React.useState("");

    // list of locations, with the depot at index 0
    const depotPos = locsChecked.indexOf(depot);
    const noDepot = locsChecked.slice(0, depotPos).concat(locsChecked.slice(depotPos + 1));
    const depotAndLocs = [depot, ...noDepot];

    const locationIndexMapping = depotAndLocs.reduce((obj, loc, index) => {
        obj[index] = loc;
        return obj;
    }, {})

    // tours = [list of tours]
    // tour = {
    //     vehicleId: JSONified vehicle
    //     stops: [{location:{index:0}}, {location:{index:1}}, {location:{index:0}}]
    // }
    const vehiLoctoTour = (vehiLoc) => {
        console.log(vehiLoc);
        let tour = { vehicleId: JSON.stringify(vehiLoc.vehicle), stops: [{ location: { index: 0 } }] };
        vehiLoc.list.forEach(loc => tour["stops"].push({ location: { index: depotAndLocs.indexOf(loc.content) } }))
        tour["stops"].push({ location: { index: 0 } });
        return tour;
    };

    const tours = Object.keys(vehiLocs).reduce((prev, key) => {
        if (vehiLocs[key].list.length !== 0) {
            return [...prev, vehiLoctoTour(vehiLocs[key])]
        } else {
            return prev
        }
    }, [])

    const [tripMode, setTripMode] = React.useState("Normal");
    const [mapState, setMapState] = React.useState({});

    React.useEffect(() => {
        getUnoptimised(selectedDate, tours, locationIndexMapping, notes).then(function(trip) { 
            setTrip(trip); 
            setMapState(trip.getMapState()); 
            console.log(trip); });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        const newTrip = {...currentTrip, date: selectedDate, notes: notes };
        setTrip(newTrip);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notes, selectedDate])

    const handleRadio = (event) => {
        if (event.target.value === "Optimised") {
            optimise(selectedDate, vehiChecked, noDepot, depot, notes).then(function(trip) { 
                setTrip(trip); 
                setMapState(trip.getMapState()); 
                setTripMode("Optimised"); 
                console.log(trip); 
            });
        } else {
            getUnoptimised(selectedDate, tours, locationIndexMapping, notes).then(function(trip) { 
                setTrip(trip); 
                setMapState(trip.getMapState()); 
                setTripMode("Normal"); 
                console.log(trip); 
            });
        }
    }

    return (
        <div>
            <Grid container>
                <Grid item xs style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: "10px" }}>
                        <DateTimePicker
                            autoOk
                            ampm={false}
                            disablePast
                            value={selectedDate}
                            onChange={handleDateChange}
                            label="Date/Time"
                            showTodayButton
                        />
                    </div>

                    <div style={{ padding: "10px" }}>
                        <RadioGroup row value={tripMode} label="Select Trip Mode">
                            <FormControlLabel checked={tripMode === "Normal"} onChange={handleRadio} value="Normal" control={<Radio />} label="Normal" />
                            <FormControlLabel checked={tripMode === "Optimised"} onChange={handleRadio} value="Optimised" control={<Radio />} label="Optimised" />
                        </RadioGroup>
                    </div>

                    <div style={{ padding: "10px" }}>
                        <TextField
                            id="outlined-multiline-static"
                            label="Extra Notes"
                            multiline
                            variant="outlined"
                            onChange={(event) => setNotes(event.target.value)}
                        />
                    </div>

                </Grid>
                <Grid item xs>
                    <MapBox height="60vh" width="70vw" mapState={mapState} />
                </Grid>
            </Grid>
        </div>
    )
}

async function getUnoptimised(selectedDate, tours, locationIndexMapping, notes) {
    let vehicleTrips = await Promise.all(tours.map(async tour => await tourToVehicleTrip(tour, locationIndexMapping)));
    return new Trip(selectedDate, vehicleTrips, notes);
}