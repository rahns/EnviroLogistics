import './App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trip } from './Classes';
import { database } from './App';
import React from 'react';

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
  for (let i = 0; i < allTripsList.length; i++) {

    data.push({name: a[allTripsList[i].date.getMonth()] + " " +allTripsList[i].date.getFullYear(), Gas:  allTripsList[i].emissions})
  }
        return  (<div className = "divBox">
        
            <LineChart
              width={1200}
              height={800}
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
            
            </div>
          );
    
}