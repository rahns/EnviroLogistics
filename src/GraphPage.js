import './App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trip } from './Classes';
import { database } from './App';
import React from 'react';
import { Card, Typography, CardContent, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";


export default function Graph(props) {
  const [data, setData] = React.useState([]);
  const [monthly, setMonthly] = React.useState([]);
  const [yearly, setYearly] = React.useState([]);
  const [maximum, setMaximum] = React.useState(0);
  const [minimum, setMinimum] = React.useState(Number.POSITIVE_INFINITY);
  const [average, setAverage] = React.useState(0);
  const [graphPeriod, setPeriod] = React.useState(0);

  React.useEffect(() => {
    switch (graphPeriod) {
      case 0:
        setData(monthly);
        break
      case 1:
        setData(yearly);
        break
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphPeriod])

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

      const a = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const yearly = []
      const monthly = []
      for (let i = 0; i < allTrips.length; i++) {
        monthly.push({ name: a[allTrips[i].date.getMonth()] + " " + allTrips[i].date.getFullYear(), Gas: allTrips[i].emissions })
      }
      for (let i = 0; i < allTrips.length; i++) {
        yearly.push({ name: allTrips[i].date.getFullYear(), Gas: allTrips[i].emissions })
      }

      let avg = 0;
      for (let i = 0; i < allTrips.length; i++) {
        if (allTrips[i].emissions < minimum) {
          setMinimum(allTrips[i].emissions)
        }
        if (allTrips[i].emissions > maximum) {
          setMaximum(allTrips[i].emissions)
        }
        avg += allTrips[i].emissions
      }
      setAverage(avg / allTrips.length);
      setMonthly(monthly)
      setYearly(yearly)
      setData(monthly) // Default to monthly graph
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [])

  return (
    <>
      <div className="row">
        <div className="divBox" style={{ width: "100%", padding: 20 }}>
          <Card
            style={{
              backgroundColor: "#89CFF0"
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

              <Typography style={{ fontsize: 25 }}>
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
              <Typography style={{ fontsize: 25 }}>
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
              <Typography style={{ fontsize: 25 }}>
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
        </div>
      </div>

      <div className="row">
        <div className="divBox" style={{ width: "100%", padding: 20 }}>
          <h3 style={{ marginTop: 0 }}>Emissions Graph</h3>
          <div style={{marginBottom: 10}}>
            <FormControl variant="outlined" style={{minWidth: "15%"}}>
              <InputLabel>Period</InputLabel>
              <Select
                value={graphPeriod}
                onChange={(e) => setPeriod(e.target.value)}
                label="Period"
              >
                <MenuItem value={0}>Monthly</MenuItem>
                <MenuItem value={1}>Yearly</MenuItem>
              </Select>
            </FormControl>
          </div>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={data}
              margin={{ bottom: 15, right: 50, top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" dy={10} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="Gas"
                name="CO2 emitted"
                unit="kg"
                stroke="green"
                activeDot={{ r: 8 }}

              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );

}