import './App.css';
import React from 'react';
import {Button, TextField, InputAdornment, MenuItem, Typography} from "@material-ui/core";
import { getExampleCars , Vehicle} from './Classes';
import VehicleCard from './FleetPageComponents';
import { database } from './App';
import Popup from 'reactjs-popup';


function filterVehicles(filter, allVehicles, currentVehicles) {
  if (filter[0] !== ""){
    return allVehicles.filter(vehicle => (vehicle.make + " " + vehicle.model) === filter[0]);
  }
  if (filter[0] === ""){
    return allVehicles;
  }
  else {
    return currentVehicles;
  }
}

export default function Fleet(props) {
  const [filter, setFilter] = React.useState(["", true]);
  const [filteredVehicles, setVehicles] = React.useState([]);
  const [allVehicles, setAllVehicles] = React.useState([]);

  const [transmission, setTransmission] = React.useState('');
  const handleTransmissionSelect = (event) => {
    setTransmission(event.target.value);
    document.getElementById("newVehicleTransmission").setAttribute("value", event.target.value);
  };

  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const addVehicle = () => {
    const make = document.getElementById("newVehicleMake").value;
    const model = document.getElementById("newVehicleModel").value;
    const year = document.getElementById("newVehicleYear").value;
    const avgEmissions = document.getElementById("newVehicleEmissions").value;
    const rego = document.getElementById("newVehicleRego").value;
    const transmission = document.getElementById("newVehicleTransmission").getAttribute("value") == 1 ? true : false;
    let newVehicle = new Vehicle(make, model, year, transmission, avgEmissions, rego);
    props.addToDatabase('vehicles/', JSON.stringify(newVehicle));
  }


  let vehicleComponents = [];
  for (let i = 0; i < filteredVehicles.length; i++) {
    vehicleComponents.push(<VehicleCard vehicle={filteredVehicles[i]} id={i} changeHandler={handleChange} expanded={expanded} user={props.user}/>);
    vehicleComponents.push(<div style={{margin: 4}}></div>);
  };
  if (vehicleComponents.length === 0){
    vehicleComponents = <Typography variant="h6">No Vehicles to Show</Typography>;
  }

  React.useEffect(() =>
  database.ref("vehicles/" + props.user.uid).on("value", snapshot => {
    let allVehicles = [];
    if (snapshot) {
      snapshot.forEach(snap => {
        let i = new Vehicle(); 
        i.objectToInstance(JSON.parse(snap.val().data), snap.key);
        allVehicles.push(i);
        }
      );
    }
    setAllVehicles(allVehicles);
    setVehicles(filterVehicles(filter, allVehicles, filteredVehicles));
    setFilter([filter[0], false]);
    setExpanded(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [])

  const dummyVehicles = getExampleCars();
  const addTestVehicles = () => {
    for (let i = 0; i < dummyVehicles.length; i++){
      props.addToDatabase('vehicles/', JSON.stringify(dummyVehicles[i]));
    }
  }

  if (filter[1]) {
    var vehicles = filterVehicles(filter, allVehicles, filteredVehicles);
    setVehicles(vehicles);
    setFilter(["", false]);
  }

  return (
    <>
      <div className="row" style={{marginCenter: "auto"}}>
        <div className="divBox" style={{minWidth: "40%", height:36}}>
          <TextField id="searchField" label="Search Vehicle" action="/" type="search" method="get" style={{minWidth: "70%", fontSize: "16px", marginBottom: 10}}></TextField>
          <Button type="submit" variant="contained" color="secondary" onClick={() => setFilter([document.getElementById("searchField").value, true])}>Search</Button>
        </div>
        
        <div className="divBox" style={{marginLeft: "auto"}}>
          <Popup
            trigger={
            <Button variant="contained" color="secondary">
              Add Vehicle
            </Button>}
            modal
            nested
          >
            {close => (
              <div className="modal">
                <button className="close" onClick={close}>
                  &times;
                </button>
                <div className="header"> NEW VEHICLE </div>
                <div className="content">
                  {' '}
                  <div className="row" style={{align: "center"}}>
                    <TextField id="newVehicleMake" label="Brand" action="/" method="get" InputProps={{shrink: true}} variant="filled" style={{minWidth: "40%", fontSize: "16px", marginBottom: 10}}></TextField>
                    <TextField id="newVehicleModel" label="Model" action="/" method="get" InputProps={{shrink: true}} variant="filled" style={{minWidth: "40%", fontSize: "16px", marginBottom: 10}}></TextField>
                    <TextField id="newVehicleYear" label="Manufactored Year" type="number" min="2000" max="2021" action="/" method="get" InputProps={{shrink: true}} variant="filled" style={{minWidth: "40%", fontSize: "16px", marginBottom: 10}}></TextField>
                    <TextField id="newVehicleEmissions" label="Average Emissions" type="number" action="/" method="get" InputProps={{endAdornment: <InputAdornment position="end">Grams of CO2/Km</InputAdornment>, shrink: true}} variant="filled" style={{minWidth: "40%", fontSize: "16px", marginBottom: 10}}></TextField>
                    <TextField id="newVehicleRego" label="Registration" action="/" method="get" InputProps={{shrink: true}} variant="filled" style={{minWidth: "40%", fontSize: "16px", marginBottom: 10}}></TextField>
                    <TextField id="newVehicleTransmission" label="Transmissions" select value={transmission} onChange={handleTransmissionSelect} variant="filled" style={{minWidth: "40%", fontSize: "16px", marginBottom: 10}}>
                      <MenuItem value={0}>Manual</MenuItem>
                      <MenuItem value={1}>Auto</MenuItem>
                    </TextField>
                  </div>
                </div>
                
                <div className="actions">
                  <Button
                    variant="contained" 
                    color="secondary"
                    style={{marginLeft: 20}}
                    onClick={() => {
                      close();
                    }}
                  > Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    style={{marginLeft: 20}}
                    onClick={addVehicle}
                  > Confirm 
                  </Button>
                </div>
              </div>
            )}
          </Popup>
        </div>
      </div>

      <div className="row" style={{width:"100%"}}>
        <div className={`divBox vehicleList`} style={{width:"100%", margin:"auto"}}>
            {vehicleComponents}
        </div>
      </div>

      <div className="row">
      <div className="divBox">
        <Button onClick={() => addTestVehicles()}>Add Some Test Cars</Button>
      </div>
    </div>
    </>
  );
}
