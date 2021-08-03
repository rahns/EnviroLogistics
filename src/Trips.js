import './App.css';
import React from 'react';
import AddTrip from './AddTrip';
import {Button, MenuItem, TextField} from "@material-ui/core";
import TripAccordian from './TripPageComponents';
import { getExampleTrips } from './Classes';

export default function Trips(props) {
  const [filter, setFilter] = React.useState(0);
  let trips = getExampleTrips();
  
  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  
  if (filter !== 0){
    trips = trips.filter((trip) => new Date(trip.date.toDateString()) < (new Date(new Date().toDateString())) && filter === 1 ? true : (trip.date.toDateString()) === (new Date().toDateString()) && filter === 2 ? true : (new Date(trip.date.toDateString()) > (new Date(new Date().toDateString())) && filter === 3) ? true : false);
  }
  
  let tripComponents = [];
  for (let i = 0; i < trips.length; i++) {
    tripComponents.push(<TripAccordian trip={trips[i]} id={i} changeHandler={handleChange} expanded={expanded} />)
  };
  if (tripComponents.length === 0){
    tripComponents = "No Trips to Show";
  }

  return (
    <>
    <div className="row" >
      <div className="divBox" style={{marginRight: 15, marginBottom: 10}}>
        <TextField
          label="Filter"
          variant="outlined"
          select
          size='small'
          style={{ width: 200 }}
          SelectProps={{ value: filter, onChange: (event) => {setFilter(event.target.value)}}}
        >
          <MenuItem value={0}>All</MenuItem>
          <MenuItem value={1}>Past</MenuItem>
          <MenuItem value={2}>Current</MenuItem>
          <MenuItem value={3}>Future</MenuItem>
        </TextField> 
      </div>
      
      <div className="divBox">
        <Button variant="contained" color="secondary" onClick={() => props.pageUpdater(<AddTrip />)}>
          Create Trip
        </Button>
      </div>
    </div>

    <div className="row">
      <div className={`divBox tripList`}>
          {tripComponents}
      </div>
    </div>
  </>
  );
}