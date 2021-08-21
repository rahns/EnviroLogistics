import './App.css';
import { database } from './App';
import React from 'react';
import AddTrip from './AddTrip';
import {Button, MenuItem, TextField, Typography, LinearProgress, Grow} from "@material-ui/core";
import TripAccordian from './components/TripAccordian';
import { getExampleOptimisedTrip, getExampleTrips, Trip } from './Classes';

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
  const [filter, setFilter] = React.useState([0, true]);
  const [currentTripsList, setTrips] = React.useState([]);
  const [allTripsList, setAllTrips] = React.useState([]);
  const [stillLoading, setStillLoading] = React.useState(true);
  const [showTrips, setShowTrips] = React.useState(false);

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
    setStillLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [])

  const testTrips = getExampleTrips();
  const addTestTrips = () => {
    for (let i = 0; i < testTrips.length; i++){
      props.addToDatabase('trips/', JSON.stringify(testTrips[i]));
      console.log(testTrips[i])
    }
    // Test the trip optimiser
    getExampleOptimisedTrip().then(function(trip) { props.addToDatabase('trips/', JSON.stringify(trip)); console.log(trip) });
  }
  

  if (filter[1]) {
    var trips = filterTrips(filter, allTripsList, currentTripsList);
    trips.sort((a, b) => new Date(b.date) - new Date(a.date));
    setTrips(trips);
    setFilter([filter[0], false]);
  }
 
  let tripComponents = [];
  if (stillLoading) {
    tripComponents = <LinearProgress className='progressBar'/>
  }
  else {
    for (let i = 0; i < currentTripsList.length; i++) {
      tripComponents.push(
        <Grow in={showTrips} {...(showTrips ? { timeout: Math.min(200 + (i*500), 5000) } : {})} >
          <div>
            <TripAccordian trip={currentTripsList[i]} id={i} changeHandler={handleChange} expanded={expanded} user={props.user}/>
            <div style={{margin: 4}}></div>
          </div>
        </Grow>);
    };
    if (tripComponents.length === 0){
      tripComponents = <Typography variant="h6">No Trips to Show</Typography>;
    }
    if (!showTrips) {setShowTrips(true)}
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

    <div className='row'><div className="divBox"><Typography variant='subtitle1'><b>Buttons for Testing:</b></Typography></div></div>
    <div className="row">
      <div className="divBox">
        <Button onClick={() => addTestTrips()}>Add Some Test Trips</Button>
      </div>
      <div className="divBox">
        <Button onClick={() => database.ref('trips/' + props.user.uid + '/').remove() }>Delete All Trips</Button>
      </div>
    </div>
  </>
  );
}