import './App.css';
import React from 'react';
import {Button} from "@material-ui/core";
import graph from './GraphPage'
import Report from './ReportPage'
import { Title } from '@material-ui/icons';

export default function Analyse(props) {
  return (
    <div>
      <h1 >This is the Analysis Page</h1>
      <Button variant="contained" color="primary" 
      onClick={() => props.pageUpdater(<Report pageUpdater={props.pageUpdater}/>)}>
        Report
      </Button>
      <Button variant = "contained" color = "secondary" 
      onClick={() => props.pageUpdater(<graph pageUpdater={props.pageUpdater}/>)}>
        Graph Analysis
      </Button>

    </div>
  );
}
