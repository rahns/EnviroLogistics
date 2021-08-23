import '../App.css';
import React from 'react';
import {ExpandMore, Event, Timer, AvTimer, Straighten, LocalShipping, Eco, Room, Map} from '@material-ui/icons';
import {Button, Accordion, AccordionActions, AccordionDetails, AccordionSummary, Divider, 
  Typography, Chip, Tooltip, Dialog, DialogTitle, DialogActions, IconButton} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import { database } from '../App';

const useStyles = makeStyles((theme) => ({
  Accordion: {
    "&.MuiAccordion-root:before": {
      backgroundColor: "rgba(255, 255, 255, 0)",
    },
    maxWidth: "100%"
  },
  wrapChipRoot: { height: '100%', display: 'flex', flexDirection: 'column' }, 
  wrapChipLabel: { marginBottom: 5, marginTop: 5, overflowWrap: 'break-word', whiteSpace: 'normal', textOverflow: 'clip' }
}));

const handleViewMap = (event, modalOpener, setMapState, markerCoordinates) => {
  setMapState(markerCoordinates);
  modalOpener(true);
  event.stopPropagation()
}

export default function TripAccordian(props) {
  const trip = props.trip;
  const vehicleTrips = [];
  for (let i = 0; i < trip.vehicleTrips.length; i++) {
    vehicleTrips.push(<VehicleAccordian vehicleTrip={trip.vehicleTrips[i]} modalOpener={props.modalOpener} setMapState={props.setMapState}/>);
    vehicleTrips.push(<div style={{margin: 7}}></div>);
  };

  const [dialogState, setDialogState] = React.useState(false);
  const handleClickDeleteButton = () => {
    setDialogState(true);
  };
  const handleDialogClose = () => {
    setDialogState(false);
  };
  const handleDelete = () => {
    database.ref('trips/' + props.user.uid + '/' + trip.dbKey).remove(); 
    handleDialogClose();
  }
  const classes = useStyles();

  return (
    <Accordion className="roundedCorners" classes={{root: classes.Accordion}} expanded={props.expanded === props.id} onChange={props.changeHandler(props.id)}>
      <AccordionSummary expandIcon={<ExpandMore />} style={{marginLeft: 3}}>
        <div className="row" style={{width: "100%", alignItems: "center"}}>
          <div style={{display: "flex", flexDirection: "column", marginRight: "auto"}}>
              <div className="row"><Chip variant="outlined" color='primary' icon={<Event />} label={<Typography variant="h6">{trip.date.getDate() + "/" + (trip.date.getMonth()+1) + "/" + trip.date.getFullYear()}</Typography>} /></div>
              {trip.notes ? <div className="row"><Chip classes={{ root: classes.wrapChipRoot, label: classes.wrapChipLabel, }} variant="outlined" color='primary' label={<Typography variant="body2"><b>Notes:</b> {trip.notes}</Typography>} /></div> : null}
              <div className="row">
                <Tooltip title="Consecutive Duration"><Chip icon={<Timer />} label={"Duration: " + trip.consecutiveDuration + " minutes"}/></Tooltip>
                <Tooltip title="Total Individual Driving Minutes"><Chip icon={<AvTimer />} label={"Aggregate: " + trip.totalDuration + " minutes"} /></Tooltip>
                <Tooltip title="Total Distance"><Chip icon={<Straighten />} label={trip.distance + "km"} /></Tooltip>
                <Tooltip title="Number of Vehicles Used"><Chip icon={<LocalShipping />} label={trip.vehicleTrips.length + " vehicle" + (trip.vehicleTrips.length === 1 ? "" : "s")} /></Tooltip>
                <Tooltip title={<> Amount of CO<sub>2</sub> Emitted </>}><Chip icon={<Eco />} label={trip.emissions + " grams of CO2"} /></Tooltip>
              </div>
            </div>
            <div>
              <Tooltip title="Show on map">
                <IconButton color="primary" onClick={(event) => handleViewMap(event, props.modalOpener, props.setMapState, {})} style={{padding: 5}}>
                  <Map />
                </IconButton>                
              </Tooltip>
            </div>
        </div>
      </AccordionSummary>
      <AccordionDetails className="innerAccordian">
        <Typography style={{marginBottom: 5}}><b>Vehicles:</b></Typography>
        {vehicleTrips}
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button size="small" color="secondary" onClick={() => handleClickDeleteButton()}>Delete Trip</Button>
      </AccordionActions>
      <Dialog open={dialogState} onClose={handleDialogClose}>
        <DialogTitle >Are you sure you want to delete this trip?</DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Accordion>
  )
}

function VehicleAccordian(props) {
  const classes = useStyles();
  const vehicleTrip = props.vehicleTrip;
  const vehicle = vehicleTrip.vehicle;
  const legs = []
  for (let i = 0; i < vehicleTrip.tripLegs.length; i++) {
    legs.push(<DisplayLeg leg={vehicleTrip.tripLegs[i]} modalOpener={props.modalOpener} setMapState={props.setMapState}/>)
  };
  return (
    <Accordion className={`roundedCorners fillWidth`} classes={{root: classes.Accordion}}>
      <AccordionSummary expandIcon={<ExpandMore />} style={{minHeight: "1px !important"}}>
        <div className="row" style={{width: "100%", alignItems: "center"}}>
          <div style={{display: "flex", flexDirection: "column", marginRight: "auto"}}>
            <div className="row" style={{marginBottom: 0, paddingTop: 0}}>
              <Tooltip title="Vehicle Used"><div className="row"><Chip variant="outlined" color='primary' classes={{ root: classes.wrapChipRoot, label: classes.wrapChipLabel, }} label={<b>{vehicle.toString()}</b>}/></div></Tooltip>
            </div>
            <div className="row" style={{paddingTop: 0}}>
              <Tooltip title="Duration"><Chip icon={<Timer />} label={vehicleTrip.vehicleDuration + " minutes"}/></Tooltip>
              <Tooltip title="Distance"><Chip icon={<Straighten />} label={vehicleTrip.vehicleDistance + "km"} /></Tooltip>
              <Tooltip title={<> Amount of CO<sub>2</sub> Emitted </>}><Chip icon={<Eco />} label={vehicleTrip.vehicleEmissions + " grams of CO2"} /></Tooltip>
            </div>
          </div>
          <div>
            <Tooltip title="Show on map">
              <IconButton color="primary" onClick={event => handleViewMap(event, props.modalOpener, props.setMapState, {})} style={{padding: 5}}>
                <Map />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails style={{display: "block"}}>
      <Typography style={{marginBottom: 5}}><b>Legs:</b></Typography>
        {legs}
      </AccordionDetails>
    </Accordion>
  );
}

function DisplayLeg(props) {
  const origin_lat = props.leg.startLocation.lat;
  const origin_long = props.leg.startLocation.long;
  const dest_lat = props.leg.endLocation.lat;
  const dest_long = props.leg.endLocation.long;
  const navURL = "https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=" + 
    origin_lat + "," + origin_long + "&destination=" + dest_lat + "," + dest_long
  return (
    <div className="divBox" style={{marginBottom: 10, width: "calc(100% - 20px)"}}>
      <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 5}}>
        <div style={{marginRight: "auto", marginLeft: 0}}>
          <Tooltip title="Waypoints" style={{margin: 4, marginLeft: 0}}><Chip variant="outlined" icon={<Room />} label={<>{props.leg.startLocation.nickname} to {props.leg.endLocation.nickname}</>}/></Tooltip>
          <Tooltip title="Duration" style={{margin: 4, marginLeft: 0}}><Chip icon={<Timer />} label={props.leg.duration + " minutes"}/></Tooltip>
          <Tooltip title="Distance" style={{margin: 4, marginLeft: 0}}><Chip icon={<Straighten />} label={props.leg.distance + "km"} /></Tooltip>
          <Tooltip title={<> Amount of CO<sub>2</sub> Emitted </>}><Chip icon={<Eco />} label={props.leg.legEmissions + " grams of CO2"} /></Tooltip>
        </div>
        <div>
          <Tooltip title="Show on map">
            <IconButton color="primary" onClick={event => handleViewMap(
                event, props.modalOpener, props.setMapState, {markerCoords: [[origin_long, origin_lat], [dest_long, dest_lat]]}
                )} style={{padding: 5}}>
              <Map />
            </IconButton>
          </Tooltip>
        </div>
        <Button target="_blank" href={navURL} color="primary" size="small" >Navigate</Button>
      </div>
    </div>
  )
}
