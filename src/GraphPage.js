import './App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



const data = [
  {
    name: 'January',
    Gas: 2400
  },
  {
    name: 'February',
    Gas: 1398
  },
  {
    name: 'March',
    Gas: 9800
  },
  {
    name: 'April',
    Gas: 3908
  },
  {
    name: 'May',
    Gas: 4800
  },
  {
    name: 'June',
    Gas: 3800
  },
  {
    name: 'July',
    Gas: 4300
  },
];

export default function Graph(props) {
        return  (<div>
            <h4 style = {{marginLeft: 400  , marginTop: 100}}>Time Series Chart</h4>
            <LineChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5

              }}
              style = {{marginLeft: 450  , marginTop: 200}} 
            >
              <CartesianGrid strokeDasharray="3 3" />
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