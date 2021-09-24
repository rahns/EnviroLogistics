import './App.css';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trip } from './Classes';
import Report from './components/Report';
import { database } from './App';
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, RadioGroup, Radio, FormControlLabel, FormLabel} from "@material-ui/core";


export default function Analysis(props) {
  const [data, setData] = React.useState([]);
  const [monthly, setMonthly] = React.useState([]);
  const [yearly, setYearly] = React.useState([]);
  const [maximum, setMaximum] = React.useState(0);
  const [minimum, setMinimum] = React.useState(Number.POSITIVE_INFINITY);
  const [graphType, setGraphType] = React.useState("line");
  const [graphPeriod, setPeriod] = React.useState(0);
  const [trips, setTrips] = React.useState([]);

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

      setTrips(allTrips);

      const a = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
     
      const yearly = []
      const monthly = []
      for (let i = 0; i < allTrips.length; i++) {
        let found = false;
        for (let j = 0; j < monthly.length; j++){
          if (monthly[j]["name"] == a[allTrips[i].date.getMonth()] + " " + allTrips[i].date.getFullYear()){
              monthly[j]["Gas"] += allTrips[i].emissions;
              found = true
              break;
          }
        }
        if (found == false){
          monthly.push({ name: a[allTrips[i].date.getMonth()] + " " + allTrips[i].date.getFullYear(), Gas: allTrips[i].emissions })
        }
        
      }
      for (let i = 0; i < allTrips.length; i++) {
        let foundd = false;
        for (let j = 0; j< yearly.length; j++){
          if (yearly[j]["name"] == allTrips[i].date.getFullYear()){
            yearly[j]["Gas"] += allTrips[i].emissions;
            foundd = true;
            break
          }
        }
        if (foundd == false){
          yearly.push({ name: allTrips[i].date.getFullYear(), Gas: allTrips[i].emissions })
        }
        
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
      setMonthly(monthly)
      setYearly(yearly)
      setData(monthly) // Default to monthly graph
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [])

  return (
    <>
      <div className="row">
        <div className="divBox" style={{ width: "100%", padding: 20}}>
          <h3 style={{ marginTop: 0 }}>Statistics Dashboard</h3>
            <Report trips={trips} />
        </div>
      </div>

      <div className="row">
        <div className="divBox" style={{ width: "100%", padding: 20 }}>
          <h3 style={{ marginTop: 0 }}>Emissions Graph</h3>
          <div style={{marginBottom: 10}}>
            <FormControl variant="outlined" style={{minWidth: "15%", marginRight: 20}}>
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
            <FormControl component="fieldset">
              <FormLabel component="legend">Graph Type:</FormLabel>
              <RadioGroup row defaultValue="line" onChange={(e) => setGraphType(e.target.value)}>
                <FormControlLabel value="line" control={<Radio color="primary" />} label="Line" />
                <FormControlLabel value="bar" control={<Radio color="primary" />} label="Bar" />
              </RadioGroup>
            </FormControl>
          </div>
          <ResponsiveContainer width="100%" height={500}>
            {graphType === "bar" ? 
            <BarChart
              data={data}
              margin={{ bottom: 15, right: 50, top: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" dy={10} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Gas" name="CO2 emitted" unit="g" fill="#8884d8" />
            </BarChart> :
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
                unit="g"
                stroke="green"
                activeDot={{ r: 8 }}
              />
            </LineChart>
            }
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );

}