import './App.css';
import Trips from './Trips';
import React from 'react';
import {Button} from "@material-ui/core";
import { DateTimePicker } from "@material-ui/pickers";

export default function AddTrip(props) {
  const [selectedDate, handleDateChange] = React.useState(new Date());


  return (
    <div>
      <Button variant="contained" color="secondary" onClick={() => props.pageUpdater(<Trips pageUpdater={props.pageUpdater}/>)}>
        Cancel
      </Button>

      <Button variant="contained" color="secondary">
        Optimise
      </Button>

      <Button variant="contained" color="secondary">
        Start
      </Button>

      <DateTimePicker
        className="divBox"
        autoOk
        ampm={false}
        disablePast
        value={selectedDate}
        onChange={handleDateChange}
        label="Date/Time"
        showTodayButton
      />
    </div>
  );
}
