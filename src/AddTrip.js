import './App.css';
import React from 'react';
import { Button, Stepper, Step, StepLabel } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Trips from './Trips';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
//import { database } from './App';

import SelectWaypoints from './AddTrip/SelectWaypoints';
import AssignVehicles from './AddTrip/AssignVehicles';
import ExtraDetails from './AddTrip/ExtraDetails';

const useStyles = makeStyles((theme) => ({
  // root: {
  //   width: '100%',
  // },
  // button: {
  //   marginRight: theme.spacing(1),
  // },
  // instructions: {
  //   marginTop: theme.spacing(1),
  //   marginBottom: theme.spacing(1),
  // },
}));

export default function AddTrip(props) {
  // whole page constants
  const classes = useStyles();
  const steps = ['Select Waypoints', 'Assign Vehicles', 'Extra Details'];
  const [activeStep, setActiveStep] = React.useState(0);

  const [locsChecked, setLocsChecked] = React.useState([]);
  const [vehiLocs, setVehiLocs] = React.useState({});
  const [depot, setDepot] = React.useState(null);

  // Setting depot if previously selected isn't available anymore
  React.useEffect(() => {
    if (locsChecked.length === 0) {
      setDepot(null)
    } else if (locsChecked.indexOf(depot) === -1) {
      setDepot(locsChecked[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locsChecked]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0: // Waypoints
        return (<SelectWaypoints locsChecked={locsChecked} setLocsChecked={setLocsChecked} handleToggle={handleToggle} handleDelete={handleDelete} setDepot={setDepot} depot={depot} />);

      case 1: // Vehicles
        return (<AssignVehicles locsChecked={locsChecked} handleToggle={handleToggle} vehiLocs={vehiLocs} setVehiLocs={setVehiLocs} />);

      case 2: // Extra Details
        return (<ExtraDetails />);

      default:
        return 'Unknown step';
    }
  };

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

const handleDelete = (updater) => (items) => (item) => () => {
  const currentIndex = items.indexOf(item);
  const newItems = [...items];

  newItems.splice(currentIndex, 1);

  console.log(newItems);
  updater(newItems);
};