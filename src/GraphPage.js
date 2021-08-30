import './App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trip } from './Classes';
import { database } from './App';
import React from 'react';
import {Button, Card, Typography, CardContent, CardActions, Divider} from "@material-ui/core";


export default function Graph(props) {
  const [allTripsList, setAllTrips] = React.useState([]);
  React.useEffect(() =>
  database.ref("trips/" + props.user.uid).on("value", snapshot => {
    let allTrips = [];
    
    if (snapshot) {
      snapshot.forEach(snap => {
        let i = new Trip(); 
        i.objectToInstance(JSON.parse(snap.val().data), snap.key);
        allTrips.push(i);
        }
      );
    }
    setAllTrips(allTrips);
   

  }), [])
  const a = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const data = []
  const yearly = []
  for (let i = 0; i < allTripsList.length; i++) {
    data.push({name: a[allTripsList[i].date.getMonth()] + " " +allTripsList[i].date.getFullYear(), Gas:  allTripsList[i].emissions})
  }
  for (let i = 0; i < allTripsList.length; i++) {
    yearly.push({name: allTripsList[i].date.getFullYear(), Gas:  allTripsList[i].emissions})
  }
  var maximum = 0
  var minimum = Number.POSITIVE_INFINITY
  var average = 0
  for (let i = 0; i < allTripsList.length; i++) {
    if (allTripsList[i].emissions < minimum) {
      minimum = allTripsList[i].emissions
    }
    if (allTripsList[i].emissions > maximum){
      maximum = allTripsList[i].emissions
    }
    average += allTripsList[i].emissions
  }
  average /= allTripsList.length

        return  (
        <div className = "divBox">
        <Card
          style={{
            width: 1800,
            height: 300,
            backgroundColor: "#89CFF0",
            //marginLeft: 500,
          }}
        >
          <CardContent>

            <Typography
              style={{ fontSize: 30 }}
              color="black"
              gutterBottom
            >
              The following contains information on your report
            </Typography>

            <Typography style = {{fontsize: 25}}>
              Average: {average}
            </Typography>

            <Typography
              style={{
                marginBottom: 12,
              }}
              color="textSecondary"
            >
              Good job keeping your gas emission average this low, to improve you could try .....
            </Typography>
            <Typography style = {{fontsize:25}}>
              Min: {minimum}
            </Typography>
            <Typography
              style={{
                marginBottom: 16,
              }}
              color="textSecondary"
            >
              Great work achieving this minimum! 
            </Typography>
            <Typography style = {{fontsize: 25}}>
              Max: {maximum}
            </Typography>
            <Typography
              style={{
                marginBottom: 16,
              }}
              color="textSecondary"
            >
              Great work achieving this maximum! 
            </Typography>
          </CardContent>
          
        </Card>
          <h3>Analysis Graph</h3>
          <h4 style = {{marginLeft: 100}}>x = month, y = co2 emissions</h4>
        
            <LineChart
              width={1800}
              height={600}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            
            >
              <CartesianGrid strokeDasharray= "3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Gas"
                stroke="green"
                activeDot={{ r: 8 }}
                
              />
            </LineChart>
            <Button variant = "contained" color = "secondary" style = {{marginLeft: 50, marginTop:100}}
            onClick={() => props.pageUpdater(<Graph pageUpdater={props.pageUpdater} user = {props.user}/>)}>
            Yearly Graph
            </Button>
            <Button variant = "contained" color = "secondary" style = {{marginLeft: 50, marginTop:100}}
            onClick={() => props.pageUpdater(<Graph pageUpdater={props.pageUpdater} user = {props.user}/>)}>
            Monthly Graph
            </Button>
        
            
            </div>
          );
    
}