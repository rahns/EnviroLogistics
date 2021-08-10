import './App.css';
import React from 'react';
import {Button} from "@material-ui/core";
import Graph from './GraphPage'
import Report from './ReportPage'
import { Title } from '@material-ui/icons';

export default function Analyse(props) {
  return (
    <div>
      <h1 style = {{color: "white",marginLeft: 450  , marginTop: 0}}>This is the Analysis Page</h1>
      <Button variant="contained" color="primary" style = {{marginLeft: 450, marginTop: 100}} 
      onClick={() => props.pageUpdater(<Report pageUpdater={props.pageUpdater}/>)}>
        Report
      </Button>
      <Button variant = "contained" color = "secondary" style = {{marginLeft: 50, marginTop:100}}
      onClick={() => props.pageUpdater(<Graph pageUpdater={props.pageUpdater}/>)}>
        Graph Analysis
      </Button>

    </div>
  );
}
