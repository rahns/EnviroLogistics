import './App.css';
import React from 'react';
import { Button, ButtonGroup } from "@material-ui/core";
import { DateTimePicker } from "@material-ui/pickers";
import Trips from './Trips';
import CheckboxList from './components/CheckboxList.js'
import DragDropList from './components/DragDropList.js'
import { getExampleCars, getExampleLocations } from './Classes';

export default function AddTrip(props) {
  const [selectedDate, handleDateChange] = React.useState(new Date());

  const cars = getExampleCars();
  const locations = getExampleLocations();

  return (
    <div>
      <h2>New Trip</h2>
      <div className="divBox">
        <div className="row">
          <div className="divBox">
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
        </div>

        <h3>Waypoints</h3>

        <div className="row">

          <DragDropList initialList={locations} />

        </div>


        <h3>Vehicles</h3>

        <div className="row">

          <CheckboxList items={cars} />

        </div>


        <ButtonGroup color="primary" aria-label="outlined primary button group">
          <Button variant="contained" color="secondary" onClick={() => props.pageUpdater(<Trips pageUpdater={props.pageUpdater} />)}>Cancel</Button>
          <Button variant="contained" color="secondary">Optimise</Button>
          <Button variant="contained" color="secondary">Save</Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
