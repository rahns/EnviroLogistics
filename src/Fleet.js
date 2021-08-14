import './App.css';
import React from 'react';
import {Button} from "@material-ui/core";
import { getExampleCars , Vehicle} from './Classes';
import VehicleCard from './FleetPageComponents';
import { database } from './App';
//import ReactDOM from 'react-dom';


function filterVehicles(filter, allVehicles, currentVehicles) {
  if (filter[0] === 0){
    return allVehicles;
  }
  else {
    return currentVehicles;
  }
}

export default function Fleet(props) {
  const [filter, setFilter] = React.useState([0, true]);
  const [currentVehicles, setVehicles] = React.useState([]);
  const [allVehicles, setAllVehicles] = React.useState([]);

  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  let vehicleComponents = [];
  for (let i = 0; i < currentVehicles.length; i++) {
    vehicleComponents.push(<VehicleCard vehicle={currentVehicles[i]} id={i} changeHandler={handleChange} expanded={expanded} user={props.user}/>);
    vehicleComponents.push(<div style={{margin: 4}}></div>);
  };
  if (vehicleComponents.length === 0){
    vehicleComponents = "No Vehicles to Show";
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
    setVehicles(filterVehicles(filter, allVehicles, currentVehicles));
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

  return (
    <>
      <div className="row" style={{marginCenter: "auto"}}>
        <div className="divBox" style={{marginLeft: 10, marginBottom: 10, left: "10%", minWidth: "40%", height:10}}>
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
        
        <div className="divBox" style={{marginLeft: "auto"}}>
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

      <div className="row">
      <div className="divBox">
        <Button onClick={() => addTestVehicles()}>Add Some Test Cars</Button>
      </div>
    </div>
    </>
  );
}
