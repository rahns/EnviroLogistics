import './App.css';
import React from 'react';
import { Button, Stepper, Step, StepLabel, Grid, TextField } from "@material-ui/core";
import { DateTimePicker } from "@material-ui/pickers";
import { makeStyles } from '@material-ui/core/styles';
import CheckboxList from './components/CheckboxList.js'
import MapBox from './components/MapBox.js'
import Trips from './Trips';
import { getExampleCars, getExampleLocations, Location } from './Classes';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import DragDropListOfLists from './components/DnDListofLists/DnDListofLists';
//import { database } from './App';


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
  // state relating to errors
  const [snackbarOpen, setSnackbar] = React.useState(false);
  const [errorText, setErrorText] = React.useState('');

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
                <CheckboxList items={locations} handleToggle={handleToggle(setLocsChecked)} checked={locsChecked} deletable={true} handleDelete={handleDelete(setLocations)} />
                <TextField id="location-nickname-input" label="Nickname for Location" onChange={(e) => setlocNickname(e.target.value)} />
                <Button variant="contained" color="secondary" onClick={() => addLocation()}>Add From Marker</Button>
              </Grid>
              <Grid item xs>
                <MapBox height="60vh" width="70vw" mapState={mapState} />
              </Grid>
            </Grid>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbar(false)}>
              <MuiAlert elevation={6} variant="filled" severity="warning" onClose={() => setSnackbar(false)}>
                {errorText}
              </MuiAlert>
            </Snackbar>
          </div >

        );

      case 1: // Vehicles
        return (
          <div className="row">
            <Grid container>
              <Grid item xs>
                <CheckboxList items={cars} handleToggle={handleToggle(setVehiChecked)} checked={vehiChecked} />
              </Grid>
              <Grid item xs>
                <DragDropListOfLists stateUpdater={setVehiLocs} state={vehiLocs} />
              </Grid>
            </Grid>
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
  const [locNickname, setlocNickname] = React.useState('');
  const [locsChecked, setLocsChecked] = React.useState([]);
  const [locations, setLocations] = React.useState(getExampleLocations());
  const [geocoderResult, setGeocoderResult] = React.useState([]);

  const geocoder = new MapboxGeocoder({
    accessToken: process.env.REACT_APP_MAPBOX_API_KEY,
    marker: true,
    mapboxgl: mapboxgl,
    proximity: {
      // Prioritise coordinates near Melbourne
      latitude: -37.8136,
      longitude: 144.9631
    }
  })
    .on('result', ({ result }) => {
      setGeocoderResult(result.geometry.coordinates);
    });;

  const [mapState] = React.useState({
    controls: [{
      control: geocoder,
      position: "top-left"
    }]
  });

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

  const addLocation = () => {
    let dupeNick = false;
    let dupeLoc = false;
    locations.forEach(function (element) {
      if (element.nickname === locNickname) {
        dupeNick = true;
      }
      if (element.lat === geocoderResult[1] && element.long === geocoderResult[0]) {
        dupeLoc = true;
      }
    });

    //console.log(geocoderResult);

    if (geocoderResult.length !== 0 && locNickname !== '' && !dupeNick) {
      setLocations([new Location(geocoderResult[1], geocoderResult[0], locNickname), ...locations]);
      console.log("added location " + locNickname + " at coordinates " + geocoderResult[1].toString() + " " + geocoderResult[0].toString())
    }
    else {
      let errorText = 'Waypoint not added: '
      errorText = geocoderResult.length === 0 ? errorText + 'No marker specified!'
        : locNickname === '' ? errorText + 'No nickname given!'
          : dupeNick ? errorText + 'Duplicate Nickname!'
            : dupeLoc ? errorText + 'Coordinates match existing waypoint!' : errorText + 'Unknown error...'

      setErrorText(errorText);
      setSnackbar(true);

    }
  }

  //vehicle page constants
  const cars = getExampleCars();
  const [vehiChecked, setVehiChecked] = React.useState([]);

  const splitToChunks = (array, parts) => {
    let result = [];
    for (let i = parts; i > 0; i--) {
      result.push(array.splice(0, Math.ceil(array.length / i)));
    }
    return result;
  };

  const initVehiLocs = (vehicles, locs) => {
    let chunkedLocs = splitToChunks(locs.map((loc, idx) => ({id: idx.toString(), text: loc})), vehicles.length);
    let result = vehicles.reduce((obj, veh, idx) => {
      return {
        ...obj, [veh.toString()]: {
          id: veh.toString(), vehicle: veh, list: chunkedLocs[idx]
        }
      }
    }
      , {}
    )
    return result;
  };

  const [vehiLocs, setVehiLocs] = React.useState(initVehiLocs(vehiChecked, locsChecked));

  React.useEffect(() => {
    setVehiLocs(initVehiLocs(vehiChecked, locsChecked));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehiChecked, locsChecked]);

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
