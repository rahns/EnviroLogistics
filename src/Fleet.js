import './App.css';
import React from 'react';
import {Button} from "@material-ui/core";
import { getExampleCars } from './Classes';
import VehicleCard from './FleetPageComponents';


//import ReactDOM from 'react-dom';

export default function Fleet(props) {
  let vehicles = getExampleCars();
  const [selectedDate, handleDateChange] = React.useState(new Date());

  let vehicleComponents = [];
  for (let i = 0; i < vehicles.length; i++) {
    vehicleComponents.push(<VehicleCard vehicle={vehicles[i]} id={i}/>);
    vehicleComponents.push(<div style={{margin: 4}}></div>);
  };
  if (vehicleComponents.length === 0){
    vehicleComponents = "No Vehicles to Show";
  }

  return (
    <>
      <div className="row" style={{marginCenter: "auto"}}>
        <div className="divBox" style={{marginLeft: 10, marginBottom: 10, left: "10%"}}>
          <form action="/" method="get">
            <input
              type="text"
              id="header-search"
              placeholder="Search Vehicle"
              name="s" 
            />
            <button type="submit"> Search</button>
          </form>
        </div>
        
        <div className="divBox" style={{left: "60%"}}>
          <Button variant="contained" color="secondary" >
            Add Vehicle
          </Button>
        </div>
      </div>

      <div className="row" style={{width:"100%"}}>
        <div className={`divBox vehicleList`} style={{width:"90%", margin:"auto"}}>
            {vehicleComponents}
        </div>
      </div>
    </>
  );
}
