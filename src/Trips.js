import './App.css';
import { database } from './App';
import React from 'react';
import AddTrip from './AddTrip';
import {Button, MenuItem, TextField, Typography } from "@material-ui/core";
import TripAccordian from './components/TripAccordian';
import { getExampleCars, getExampleLocations, getExampleLocationsNoDepot, getExampleTrips, Trip } from './Classes';
import { optimise } from './Optimise';

function filterTrips(filter, allTripsList, currentTripsList) {
  if (filter[0] !== 0){
    return allTripsList.filter((trip) => new Date(trip.date.toDateString()) < (new Date(new Date().toDateString())) && filter[0] === 1 ? true : (trip.date.toDateString()) === (new Date().toDateString()) && filter[0] === 2 ? true : (new Date(trip.date.toDateString()) > (new Date(new Date().toDateString())) && filter[0] === 3) ? true : false);
  }
  if (filter[0] === 0){
    return allTripsList;
  }
  else {
    return currentTripsList;
  }
}


export default function Trips(props) {
  // Testing:
  React.useEffect(() => 
    optimise(getExampleCars(), getExampleLocationsNoDepot(), getExampleLocations()[0])
    );
  // Remove Above


  const [filter, setFilter] = React.useState([0, true]);
  const [currentTripsList, setTrips] = React.useState([]);
  const [allTripsList, setAllTrips] = React.useState([]);

  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  React.useEffect(() =>
  database.ref("trips/" + props.user.uid).on("value", snapshot => {
    let allTrips = [];
    if (snapshot) {
      snapshot.forEach(snap => {
        let i = new Trip(); 
        i.objectToInstance(JSON.parse(snap.val().data), snap.key);
        allTrips.push(i);
        }
      );
    }
    setAllTrips(allTrips);
    setTrips(filterTrips(filter, allTrips, currentTripsList));
    setFilter([filter[0], false]);
    setExpanded(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [])

  const testTrips = getExampleTrips();
  const addTestTrips = () => {
    for (let i = 0; i < testTrips.length; i++){
      props.addToDatabase('trips/', JSON.stringify(testTrips[i]));
    }
  }
  

  if (filter[1]) {
    var trips = filterTrips(filter, allTripsList, currentTripsList);
    trips.sort((a, b) => new Date(b.date) - new Date(a.date));
    setTrips(trips);
    setFilter([filter[0], false]);
  }
 
  let tripComponents = [];
  for (let i = 0; i < currentTripsList.length; i++) {
    tripComponents.push(<TripAccordian trip={currentTripsList[i]} id={i} changeHandler={handleChange} expanded={expanded} user={props.user}/>);
    tripComponents.push(<div style={{margin: 4}}></div>);
  };
  if (tripComponents.length === 0){
    tripComponents = <Typography variant="h6">No Trips to Show</Typography>;
  }

  return (
    <>
    <div className="row">
    <div className="divBox" style={{minHeight: 40}}>
        <Button variant="contained" color="secondary" onClick={() => props.pageUpdater(<AddTrip pageUpdater={props.pageUpdater} addToDatabase={props.addToDatabase} user={props.user}/>)}>
          Create Trip
        </Button>
      </div>

      <div className="divBox" style={{minWidth: "15%", marginLeft: "auto"}}>
        <TextField
          label="Filter"
          variant="outlined"
          select
          size='small'
          SelectProps={{ value: filter[0], onChange: (event) => {setFilter([event.target.value, true])}}}
        >
          <MenuItem value={0}>All</MenuItem>
          <MenuItem value={1}>Past</MenuItem>
          <MenuItem value={2}>Current</MenuItem>
          <MenuItem value={3}>Future</MenuItem>
        </TextField> 
      </div>     
    </div>

    <div className="row">
      <div className={`divBox tripList`}>
          {tripComponents}
      </div>
    </div>

    <div className="row">
      <div className="divBox">
        <Button onClick={() => addTestTrips()}>Add Some Test Trips</Button>
      </div>
    </div>
  </>
  );
}