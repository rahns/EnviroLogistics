import './App.css';
import React from 'react';
import {Button, Card, Typography, CardContent, CardActions, Divider} from "@material-ui/core";
import { Trip } from './Classes';
import { database } from './App';

export default function Report(props) {
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
    const max = 0
    const min = 0
    var average = 0
    for (let i = 0; i < allTripsList.length; i++) {
      if (allTripsList[i].emission < min) {
        min = allTripsList[i]
      }
      if (allTripsList[i].emission > max){
        max = allTripsList[i]
      }
      average += allTripsList[i]
    }
    average /= allTripsList.length
  }), [])
  // const max = 0
  // const min = 0
  // const average = 0
  // for (let i = 0; i < allTripsList.length; i++) {
  //   if (allTripsList[i].emission < min) {
  //     min = allTripsList[i]
  //   }
  //   if (allTripsList[i].emission > max){
  //     max = allTripsList[i]
  //   }
  //   average += allTripsList[i]
  // }
  // average = average/allTripsList.length
    return (
      <div stlye={{}}>
        <h1 style = {{marginLeft: 500, color: "white"}}>Your Yearly Report</h1>
        <Card
          style={{
            width: 800,
            height: 800,
            backgroundColor: "#89CFF0",
            marginLeft: 500,
          }}
        >
          <CardContent>

            <Typography
              style={{ fontSize: 40 }}
              color="black"
              gutterBottom
            >
              The following contains information on your report
            </Typography>

            <Typography variant="h4" component="h2">
              Average: average
            </Typography>

            <Typography
              style={{
                marginBottom: 12,
              }}
              color="textSecondary"
            >
              Good job keeping your gas emission median this low, to improve you could try .....
            </Typography>
            <Typography variant="h4" component="h2">
              Min: min
            </Typography>
            <Typography
              style={{
                marginBottom: 16,
              }}
              color="textSecondary"
            >
              Great work achieving this minimum! 
            </Typography>
            <Typography variant="h4" component="h2">
              Max: max
            </Typography>
            <Typography
              style={{
                marginBottom: 16,
              }}
              color="textSecondary"
            >
              Great work achieving this maximum! 
            </Typography>

            <Typography variant="h7" component="h2">
              Over all good job with helping to save the environment, if you want to do better, buy a Tesla!
            </Typography>



          </CardContent>
          
        </Card>
      </div>
    );
  }