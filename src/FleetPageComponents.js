import './App.css';
import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Build, Eco, LocalShipping, HowToReg} from '@material-ui/icons';
import {Button, Card, Chip, Typography, CardContent, CardActions, Divider, Tooltip, Dialog, DialogTitle, DialogActions} from "@material-ui/core";
import { database } from './App';
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
    const vehicle = props.vehicle;
    const make = props.vehicle.make;
    const model = props.vehicle.model;
    const year = props.vehicle.year;
    const avgEmissions = props.vehicle.avgEmissionsPerKm;
    const rego = props.vehicle.rego;
    var autoTransmission;
    if (props.vehicle.autoTransmission){
        autoTransmission = "Auto";
    }
    else {
        autoTransmission = "Manual";
    }

    const [dialogState, setDialogState] = React.useState(false);
    const handleClickDeleteButton = () => {
        setDialogState(true);
    };
    const handleDialogClose = () => {
        setDialogState(false);
    };
    const handleDelete = () => {
        database.ref('vehicles/' + props.user.uid + '/' + vehicle.dbKey).remove(); 
        handleDialogClose();
    }

    return(
        <Card className="roundedCorners" classes={{root: useStyles().Card}}>
            <CardContent>
                <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 5}}>
                <Chip variant="outlined" color='primary' icon={<LocalShipping />}
                    label ={<Typography variant="h5" style={{margin: "auto"}}>
                        {make + " " + model}
                    </Typography>}
                    />
                </div>
                <div className="row">
                    <Tooltip title="Manufactored Year"><Chip icon={<Build />} label={year}/></Tooltip>
                    <Tooltip title="Auto Transmission?"><Chip  label={autoTransmission.toString()}/></Tooltip>
                    <Tooltip title="Avg Emissions"><Chip icon={<Eco />} label={avgEmissions + " grams of CO2/km"}/></Tooltip>
                    <Tooltip title="Registration"><Chip icon={<HowToReg />} label={rego}/></Tooltip>
                </div>
            </CardContent>
            <Divider />
            <CardActions>
                <Button size="small" color="secondary" style={{marginLeft: "auto"}} onClick={() => handleClickDeleteButton()}>Remove Vehicle</Button>
            </CardActions>
            <Dialog open={dialogState} onClose={handleDialogClose}>
                <DialogTitle >Are you sure you want to delete this vehicle?</DialogTitle>
                <DialogActions>
                <Button onClick={handleDialogClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleDelete} color="secondary" autoFocus>
                    Delete
                </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )

}
