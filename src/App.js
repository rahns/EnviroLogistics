import logo from './logo.svg';
import './App.css';
import {Button} from "@material-ui/core";

const mapboxAccessToken = 'pk.eyJ1IjoicmFobnN0YXZhciIsImEiOiJjazA2YXBvODcwNzZlM2NuMHlyYWUxY3YzIn0.3PUdd2L5DSLXWYcUnosvaQ';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p><Button variant="contained" onClick={makeOptimiseAPICall} color="primary">Test API Call</Button></p>
      </header>
    </div>
  );
}

function makeOptimiseAPICall() {
  var url = "https://api.mapbox.com/optimized-trips/v1/mapbox/driving/-122.42,37.78;-122.48,37.73;-122.45,37.91?access_token=" + mapboxAccessToken + "&annotations=duration,distance"

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", url, false);
  xmlHttp.send();
  var response = JSON.parse(xmlHttp.responseText);
  console.log(response);
  return response;
}


export default App;
