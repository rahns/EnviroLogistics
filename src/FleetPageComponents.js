import './App.css';
import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button, Card, Typography, CardContent, CardActions, Divider} from "@material-ui/core";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const useStyles = makeStyles(() => ({
    Card: {
      "&.MuiCard-root:before": {
        backgroundColor: "rgba(255, 255, 255, 0)"
      },
      maxWidth: "100%"
    }
  }));

export default function VehicleCard(props) {
    const brand = props.vehicle.brand;
    const make = props.vehicle.make;
    const year = props.vehicle.year;
    const popupInfo = VehicleInfoCard(props);
    return(
        <Card className="roundedCorners" classes={{root: useStyles().Card}}>
            <Popup trigger={
                <CardContent>
                    <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 5}}>
                        <Typography variant="h3" style={{margin: "auto"}}>
                            {brand + " " + make + " " + year}
                        </Typography>
                    </div>
                </CardContent>
                } position="right center"> 
                <div>{popupInfo}</div>
            </Popup>
            <Divider />
            <CardActions>
                <Button size="small" color="secondary" style={{left: "88%"}}>Remove Vehicle</Button>
            </CardActions>
        </Card>
    )

}

export function VehicleInfoCard(props) {
    const brand = props.vehicle.brand;
    const make = props.vehicle.make;
    const year = props.vehicle.year;
    const autoTransmission = props.vehicle.autoTransmission;
    const avgEmissions = props.vehicle.avgEmissionsPerKm;
    const rego = props.vehicle.rego;
    return(
        <Card className="roundedCorners" classes={{root: useStyles().Card}}>
            <CardContent>
                <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 5}}>
                    <div classname = "row">
                        <Typography variant="h4" style={{margin: "auto"}}> Vehicle Details </Typography>
                    </div>
                    <div classname = "row">
                        <Typography variant="h6" style={{margin: "left"}}> Brand: {brand} </Typography>
                    </div>
                    <div classname = "row">
                        <Typography variant="h6" style={{margin: "left"}}> Model: {make} </Typography>
                    </div>
                    <div classname = "row">
                        <Typography variant="h6" style={{margin: "left"}}> FactoryYear: {year} </Typography>
                    </div>
                    <div classname = "row">
                        <Typography variant="h6" style={{margin: "left"}}> AutoTranmission: {autoTransmission} </Typography>
                    </div>
                    <div classname = "row">
                        <Typography variant="h6" style={{margin: "left"}}> AvgEmissions: {avgEmissions} </Typography>
                    </div>
                    <div classname = "row">
                        <Typography variant="h6" style={{margin: "left"}}> Rego: {rego} </Typography>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}