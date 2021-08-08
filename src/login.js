import './App.css';
import React from 'react';
import AddTrip from './AddTrip';
import {Button, MenuItem, TextField} from "@material-ui/core";
import TripAccordian from './TripPageComponents';
import { getExampleTrips } from './Classes';
import Trips from './Trips'

export default function login(props){

    return <div>
            <form>
                <label for = "user">UserName:</label>
                <input type = "text" id = "user" name = "user"></input>
                <label for="password">password:</label>
                <input type = "text" id ="password" name = "password"></input>
            </form>
            <Button variant = "contained" color = "secondary"
            onClick={() => props.pageUpdater(<Trips pageUpdater={props.pageUpdater}/>)}> 
            login
            </Button>
        </div>
}