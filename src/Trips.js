import './App.css';
import { database } from './App';
import React from 'react';
import AddTrip from './AddTrip';
import {Button, MenuItem, TextField, Typography, LinearProgress, Grow, Tooltip, Backdrop, IconButton} from "@material-ui/core";
import {Cancel} from '@material-ui/icons';
import TripAccordian from './components/TripAccordian';
import { getExampleOptimisedTrip, getExampleOptimisedTrip2, getExampleOptimisedTrip3, Trip} from './Classes';
import MapBox from './components/MapBox.js';

function filterTrips(filter, allTripsList, currentTripsList, searchText) {
  if (searchText) {
    allTripsList = allTripsList.filter((trip) => (
      trip.date.getDate() + "/" + (trip.date.getMonth()+1) + "/" + trip.date.getFullYear() + " " + 
      trip.notes + " " + 
      JSON.stringify(trip)).toLowerCase().includes(searchText.toLowerCase()));
  }
  if (filter[0] !== 0){
    return allTripsList.filter((trip) => (
      new Date(trip.date.toDateString()) < (new Date(new Date().toDateString())) && filter[0] === 1 ? true : 
      (trip.date.toDateString()) === (new Date().toDateString()) && filter[0] === 2 ? true : 
      (new Date(trip.date.toDateString()) > (new Date(new Date().toDateString())) && filter[0] === 3) ? true : 
      false)
    );
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
  const [searchText, search] = React.useState("");
  const [currentTripsList, setTrips] = React.useState([]);
  const [allTripsList, setAllTrips] = React.useState([]);
  const [stillLoading, setStillLoading] = React.useState(true);
  const [showTrips, setShowTrips] = React.useState(false);
  const [modalState, setModalOpen] = React.useState(false);
  const [mapIsLoaded, setMapIsLoaded] = React.useState(false);
  if (modalState && !mapIsLoaded) {setMapIsLoaded(true)}; // only load map component if already been requested

  // Map state:
  const [mapState, setMapState] = React.useState({});

  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  React.useEffect(() =>
    database.ref("trips/" + props.user.uid).on("value", snapshot => {
      let allTrips = [];
      try {
        if (snapshot) {
        snapshot.forEach(snap => {
            let i = new Trip(); 
            i.objectToInstance(JSON.parse(snap.val().data), snap.key);
            allTrips.push(i);
        }
        )
      };
      }
      catch (e){
        if (!(e instanceof ReferenceError)) {throw e}
        else {console.log("Caught:" + e)};
      }
      setAllTrips(allTrips);
      setTrips(filterTrips(filter, allTrips, currentTripsList));
      setFilter([filter[0], false]);
      setExpanded(false);
      setStillLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, (err) => console.log(err)), [])

  const addTestTrips = () => {
    const errorHandler = (error) => {
      console.log(error);
      alert("There was an error retrieving the navigation data. Either your are offline or have made too many requests in a short period. Check your internet connection and try again in a few minutes.\n" + error);
    }
    // Test the trip optimiser
    getExampleOptimisedTrip().then(function(trip) { props.addToDatabase('trips/', JSON.stringify(trip)); console.log(trip) }, errorHandler);
    getExampleOptimisedTrip2().then(function(trip) { props.addToDatabase('trips/', JSON.stringify(trip)); console.log(trip) }, errorHandler);
    getExampleOptimisedTrip3().then(function(trip) { props.addToDatabase('trips/', JSON.stringify(trip)); console.log(trip) }, errorHandler);
    alert("Takes about 30 seconds to add (10 seconds per trip)")
  }
  
  allTripsList.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (filter[1]) {
    var trips = filterTrips(filter, allTripsList, currentTripsList, searchText);
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
            <TripAccordian trip={currentTripsList[i]} id={i} changeHandler={handleChange} expanded={expanded} user={props.user} 
              modalOpener={setModalOpen} setMapState={setMapState}/>
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
      <div className="divBox" style={{minHeight: 40, marginRight: "auto"}}>
          <Button variant="contained" color="secondary" onClick={() => props.pageUpdater(<AddTrip pageUpdater={props.pageUpdater} addToDatabase={props.addToDatabase} user={props.user}/>)}>
            Create Trip
          </Button>
        </div>

        <div className="divBox">
          <Tooltip title="Search by date, vehicles, waypoints, notes, roads, stats, etc.">
            <TextField label="Search" type="search" variant="outlined" size="small" onChange={(event) => {search(event.target.value); setFilter([filter[0], true])}}/>
          </Tooltip>
        </div>    
        <div className="divBox" style={{minWidth: "15%"}}>
          <TextField
            label="Filter"
            variant="outlined"
            select
            size='small'
            SelectProps={{ value: filter[0], onChange: (event) => {setFilter([event.target.value, true])}}}
          >
            <MenuItem value={0}>All</MenuItem>
            <MenuItem value={1}>Past</MenuItem>
            <MenuItem value={2}>Today</MenuItem>
            <MenuItem value={3}>Future</MenuItem>
          </TextField> 
        </div>     
      </div>

      <div className="row">
        <div className={`divBox tripList`}>
            {tripComponents}
        </div>
      </div>

      {mapIsLoaded ? // delay the initalisation of the Map component until first requested
      <div style={{position: "fixed", zIndex: 1, top: 0, left: 0, height: "100%", width: "100%", pointerEvents: "none"}}>
        <Backdrop in={modalState} style={{height: "calc(100vh - 56px)"}}></Backdrop>
        <Grow in={modalState}>
          <div onClick={() => setModalOpen(false)} style={{pointerEvents: "auto", display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh - 56px)"}}>
            <div style={{position: "relative", padding: 0, backgroundColor: "white", borderRadius: "13px"}} onClick={(event) => event.stopPropagation()}>
              <div className="closeButton">
                <IconButton size="small" style={{padding: 1}} onClick={() => setModalOpen(false)}>
                  <Cancel fontSize="inherit" />
                </IconButton>
              </div>
              <MapBox height="75vh" width="80vw" mapState={mapState}/>
            </div>
          </div>
        </Grow>
      </ div> : 
      null}

      <div className='row'><div className="divBox"><Typography variant='subtitle1'><b>Buttons for Testing:</b></Typography></div></div>
      <div className="row">
        <div className="divBox">
          <Button onClick={() => addTestTrips()}>Add 3 Optimised Test Trips</Button>
        </div>
        <div className="divBox">
          <Button onClick={() => database.ref('trips/' + props.user.uid + '/').remove() }>Delete All Trips</Button>
        </div>
    </div>
  </>
  );
}