import './App.css';
import React from 'react';
import { Button, Stepper, Step, StepLabel, Grid, TextField } from "@material-ui/core";
import { DateTimePicker } from "@material-ui/pickers";
import { makeStyles } from '@material-ui/core/styles';
import CheckboxList from './components/CheckboxList.js'
import Map from './components/Map.js'
import Trips from './Trips';
import { getExampleCars, getExampleLocations, Location } from './Classes';


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
  // whole page constants
  const classes = useStyles();
  const steps = ['Select Waypoints', 'Assign Vehicles', 'Extra Details'];
  const [activeStep, setActiveStep] = React.useState(0);

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
            <Grid container spacing={2}>
              <Grid item xs>
                <div>
                  <TextField id="geocoder-input" label="Search Address Here" onChange={(e) => setGeocoderInput(e.target.value)} />
                  <Button variant="contained" color="secondary">Search</Button>
                  <TextField id="location-nickname-input" label="Nickname for Location" onChange={(e) => setlocNickname(e.target.value)} />
                  <Button variant="contained" color="secondary" onClick={() => setLocations([new Location(0, 0, locNickname), ...locations])}>Add</Button>

                  <CheckboxList items={locations} handleToggle={handleToggle(setLocsChecked)} checked={locsChecked} />
                </div>
                {/* <DragDropList initialList={locations} /> */}
              </Grid>
              <Grid item xs>
                <Map height="700px" />
              </Grid>
            </Grid>
          </div >

        );

      case 1: // Vehicles
        return (
          <div className="row">
            <CheckboxList items={cars} handleToggle={handleToggle(setVehiChecked)} checked={vehiChecked} />
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

  //waypoint page constants
  const [geocoderInput, setGeocoderInput] = React.useState('');
  const [locNickname, setlocNickname] = React.useState('');
  const [locsChecked, setLocsChecked] = React.useState([]);
  const [locations, setLocations] = React.useState(getExampleLocations());
  const [vehiChecked, setVehiChecked] = React.useState([]);

  const handleToggle = (updater) => (checked) => (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    updater(newChecked);
  };

  //vehicle page constants
  const cars = getExampleCars();

  //details page constants
  const [selectedDate, handleDateChange] = React.useState(new Date());

  return (
    <div className={classes.root}>
      <div className="row">
        <div className="divBox">
          <h2>New Trip</h2>
        </div>
      </div>

      <div className="row">
        <div className={`classes.instructions divBox`} style={{ width: "100%" }}>{getStepContent(activeStep)}</div>
      </div>

      <div className="row">
        <div className="divBox" style={{ display: "inline" }}>
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
      </div>

      <div className="row">
        <div className="divBox" style={{ width: "100%" }}>
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
    </div>
  );
}
