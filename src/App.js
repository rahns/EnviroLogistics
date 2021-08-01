import './App.css';
import React from 'react';
import {BottomNavigation, BottomNavigationAction} from "@material-ui/core";
import {Map, Timeline, LocalShipping, ExitToApp} from '@material-ui/icons';
import Trips from './Trips';
import Analyse from './Analyse';
import Fleet from './Fleet';

// const mapboxAccessToken = 'pk.eyJ1IjoicmFobnN0YXZhciIsImEiOiJjazA2YXBvODcwNzZlM2NuMHlyYWUxY3YzIn0.3PUdd2L5DSLXWYcUnosvaQ';

export default function App() {
  const [value, setValue] = React.useState(0);
  const [activePage, setPage] = React.useState();

  React.useEffect(() => setPage(<Trips pageUpdater={setPage}/>), []);  // useEffect runs only on first render
  
  return (
    <div className="App">
      <div className="App-content">
        {activePage}  {/* Page contents are retrieved from the activePage variable*/}
      </div>

      <BottomNavigation showLabels 
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
        switch(newValue) {
          case 0:
            setPage(<Trips pageUpdater={setPage}/>);
            break;
          case 1:
            setPage(<Analyse pageUpdater={setPage}/>);
            break;
          case 2:
            setPage(<Fleet pageUpdater={setPage}/>);
            break;
          case 3:
            // code block
            break;
          default:
            // code block
        }
      }} 
      className="bottomBar">
          <BottomNavigationAction label="Trips" icon={<Map />} />
          <BottomNavigationAction label="Analysis" icon={<Timeline />} />
          <BottomNavigationAction label="Fleet" icon={<LocalShipping />} />
          <BottomNavigationAction label="Logout" icon={<ExitToApp />} />
      </BottomNavigation>
    </div>
  );
}

// function makeOptimiseAPICall() {
//   var url = "https://api.mapbox.com/optimized-trips/v1/mapbox/driving/-122.42,37.78;-122.48,37.73;-122.45,37.91?access_token=" + mapboxAccessToken + "&annotations=duration,distance"

//   var xmlHttp = new XMLHttpRequest();
//   xmlHttp.open( "GET", url, false);
//   xmlHttp.send();
//   var response = JSON.parse(xmlHttp.responseText);
//   console.log(response);
//   return response;
// }

