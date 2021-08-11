import './App.css';
import React from 'react';
import {Button, Card, Typography, CardContent, CardActions, Divider} from "@material-ui/core";

export default function Report() {
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
              Median: 30
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
              Min: 10
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
              Max: 50
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