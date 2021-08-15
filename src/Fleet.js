import './App.css';
import React from 'react';
import {Button} from "@material-ui/core";
import { getExampleCars , Vehicle, PopupModal} from './Classes';
import VehicleCard from './FleetPageComponents';
import { database } from './App';
import Popup from 'reactjs-popup';


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
  const [filteredVehicles, setVehicles] = React.useState([]);
  const [allVehicles, setAllVehicles] = React.useState([]);

  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  let vehicleComponents = [];
  for (let i = 0; i < filteredVehicles.length; i++) {
    vehicleComponents.push(<VehicleCard vehicle={filteredVehicles[i]} id={i} changeHandler={handleChange} expanded={expanded} user={props.user}/>);
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

  return (
    <>
      <div className="row" style={{marginCenter: "auto"}}>
        <div className="divBox" style={{marginLeft: 20, marginBottom: 10, left: "10%", minWidth: "40%", height:20}}>
          <form action="/" method="get" style={{minWidth: "70%", fontSize: "18px"}}>
            <input
              type="text"
              id="header-search"
              placeholder="Search Vehicle"
              name="s" 
            />
            <Button type="submit" variant="contained" color="secondary">Search</Button>
          </form>
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
                  <div className="row">
                    <form>
                      <label>
                        Brand &nbsp;
                        <input type="text" name="brand" style={{padding: "5px"}}/>
                      </label>
                    </form>
                    <form>
                      <label>
                        Model &nbsp;
                        <input type="text" name="model" style={{padding: "5px"}}/>
                      </label>
                    </form>
                    <form>
                      <label>
                        Manufactor Year &nbsp;
                        <input type="text" name="year" style={{padding: "5px"}}/>
                      </label>
                    </form>
                    <form>
                      <label>
                        Auto Transmission &nbsp;
                        <input type="text" name="brand" style={{padding: "5px"}}/>
                      </label>
                    </form>
                    <form>
                      <label>
                        Average Emissions &nbsp;
                        <input type="text" name="avgemisions" style={{padding: "5px"}}/>
                      </label>
                    </form>
                    <form>
                      <label>
                        Registration &nbsp;
                        <input type="text" name="rego" style={{padding: "5px"}}/>
                      </label>
                    </form>
                  </div>
                </div>
                
                <div className="actions">
                  <Button variant="contained" color="secondary"> Confirm </Button>
                  <Button
                    variant="contained" 
                    color="secondary"
                    onClick={() => {
                      close();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Popup>
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
