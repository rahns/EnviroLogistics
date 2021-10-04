import React from 'react';
import '../App.css';
import MapBox from '../components/MapBox.js'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CheckboxList from '../components/CheckboxList.js'
import { Button, Grid, TextField, MenuItem } from "@material-ui/core";
import { getExampleLocations, Location } from '../Classes';

export default function SelectWaypoints({ locsChecked, setLocsChecked, handleToggle, handleDelete, setDepot, depot }) {
  const [snackbarOpen, setSnackbar] = React.useState(false);
  const [errorText, setErrorText] = React.useState('');
  const [locNickname, setlocNickname] = React.useState('');
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

  return (
    <div>
      <Grid container>
        <Grid item xs style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "10px" }}>
            <TextField id="location-nickname-input" label="Nickname for Location" onChange={(e) => setlocNickname(e.target.value)} />
            <Button variant="contained" color="secondary" onClick={() => addLocation()} style={{ marginLeft: "20px" }}>Add From Marker</Button>
          </div>
          <div>
            <CheckboxList style={{ maxHeight: "initial", height: "auto", overflow: "scroll" }} items={locations} handleToggle={handleToggle(setLocsChecked)} checked={locsChecked} deletable={true} handleDelete={handleDelete(setLocations)} />
          </div>
          <div style={{ padding: "10px", marginTop: "auto" }}>
            <TextField
              style={{ minWidth: "75%" }}
              variant="outlined"
              label="Select Depot"
              select
              size='small'
              SelectProps={{
                value: locsChecked.indexOf(depot),
                onChange: (event) => setDepot(locsChecked[event.target.value])
              }}
            >
              {locsChecked.map((loc, index) => {
                return <MenuItem value={index}>{loc.toString()}</MenuItem>
              })}
            </TextField>
          </div>
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
  )
}
