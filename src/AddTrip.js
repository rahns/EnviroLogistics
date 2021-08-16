import './App.css';
import React from 'react';
import { Button, Stepper, Step, StepLabel, Typography } from "@material-ui/core";
import { DateTimePicker } from "@material-ui/pickers";
import Trips from './Trips';
import CheckboxList from './components/CheckboxList.js'
import DragDropList from './components/DragDropList.js'
import Map from './components/Map.js'
import { getExampleCars, getExampleLocations } from './Classes';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export default function AddTrip(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = ['Select Waypoints', 'Assign Vehicles', 'Extra Details'];
  const [selectedDate, handleDateChange] = React.useState(new Date());
  const cars = getExampleCars();
  const locations = getExampleLocations();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0: // Waypoints
        return (
          <div>
            <div>
              <DragDropList initialList={locations} />
            </div>
            <Map height="400px" />
          </div>

        );

      case 1: // Vehicles
        return (
          <div className="row">
            <CheckboxList items={cars} />
          </div>
        );

      case 2: // Extra Details
        return (
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
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <div className={classes.root}>
      <h2>New Trip</h2>

      <div className={`classes.instructions divBox row`} style={{ width: "100%" }}>{getStepContent(activeStep)}</div>

      <div className="divBox row" style={{ display: "inline" }}>
        <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
          Back
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={activeStep === steps.length - 1 ?
            () => props.pageUpdater(<Trips pageUpdater={props.pageUpdater} addToDatabase={props.addToDatabase} user={props.user} />) // TODO: Add to database instead of just returning to trips page
            : handleNext}
          className={classes.button}
        >
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>

      <div className="divBox row" style={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </div>
    </div>
  );
}
