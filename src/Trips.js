import './App.css';
import React from 'react';
import AddTrip from './AddTrip';
import {Button} from "@material-ui/core";

export default function Trips(props) {
  return (
    <div>
      Trips Shown Here
      <p><Button variant="contained" color="primary" onClick={() => props.pageUpdater(<AddTrip />)}>
        Create Trip
      </Button></p>
    </div>
  );
}
