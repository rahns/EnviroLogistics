import './App.css';
import React from 'react';
import {Button, Accordion, AccordionActions, AccordionDetails, AccordionSummary, Divider} from "@material-ui/core";
import {ExpandMore} from '@material-ui/icons';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  Accordion: {
    "&.MuiAccordion-root:before": {
      backgroundColor: "rgba(255, 255, 255, 0)"
    }
  }
}));

export default function TripAccordian(props) {
  const trip = props.trip;
  console.log(props)
  const vehicleTrips = [];
  for (let i = 0; i < trip.vehicleTrips.length; i++) {
    vehicleTrips.push(<VehicleAccordian vehicleTrip={trip.vehicleTrips[i]} />)
  };
  return (
    <Accordion className="roundedCorners" classes={{root: useStyles().Accordion}} expanded={props.expanded === props.id} onChange={props.changeHandler(props.id)}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        {trip.date.toDateString()}
      </AccordionSummary>
      <AccordionDetails className="innerAccordian">
        {vehicleTrips}
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button size="small" color="secondary">Delete Trip</Button>
      </AccordionActions>
    </Accordion>
  )
}

function VehicleAccordian(props) {
  const vehicleTrip = props.vehicleTrip;
  const vehicle = vehicleTrip.vehicle;
  const legs = []
  for (let i = 0; i < vehicleTrip.tripLegs.length; i++) {
    legs.push(<DisplayLeg leg={vehicleTrip.tripLegs[i]} />)
  };
  return (
    <Accordion className={`roundedCorners fillWidth`} classes={{root: useStyles().Accordion}}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        {vehicle.toString()}
      </AccordionSummary>
      <AccordionDetails style={{display: "block"}}>
        {legs}
      </AccordionDetails>
    </Accordion>
  );
}

function DisplayLeg(props) {
  return (
    <div className="row" style={{margin: 0, padding: 0, paddingBottom: 10, marginRight: 20}}>
      <div className={`divBox fillWidth`} style={{marginBottom: 10, display: "grid"}}>
        <div style={{gridColumn: 1, gridRow: 1}}>
        {props.leg.startLocation.nickname} to {props.leg.endLocation.nickname}
        </div>
        <div style={{gridColumn: 2, gridRow: 1}}>
        {props.leg.duration} minutes, {props.leg.distance}kms
        </div>
        <Button color="primary" style={{gridColumn: 3, gridRow: 1}}>Begin Navigation</Button>
      </div>
    </div>
  )
}
