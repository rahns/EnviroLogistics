import './App.css';
import { database } from './App';
import React from 'react';
import {BottomNavigation, BottomNavigationAction, Typography, Dialog, DialogActions, DialogTitle, Button, DialogContent } from "@material-ui/core";
import {Map, Timeline, LocalShipping, ExitToApp} from '@material-ui/icons';
import Trips from './Trips';
import Analyse from './Analyse';
import Fleet from './Fleet';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

// const mapboxAccessToken = 'pk.eyJ1IjoicmFobnN0YXZhciIsImEiOiJjazA2YXBvODcwNzZlM2NuMHlyYWUxY3YzIn0.3PUdd2L5DSLXWYcUnosvaQ';

export default function Main(props) {
  const [navState, setValue] = React.useState(0);  // Set default state to 0
  const [activePage, pageUpdater] = React.useState();
  const [dialogState, setDialogState] = React.useState(false);

  const handleClickLogout = () => {
    setDialogState(true);
  };

  var user = props.firebase.auth().currentUser;
  var username = user.displayName ? user.displayName : user.email
  const addToDatabase = (path, data) => {
    database.ref(path + user.uid).push({data});
  }

  const handleDialogClose = () => {
    setDialogState(false);
    pageUpdater(<Trips pageUpdater={pageUpdater} addToDatabase={addToDatabase} user={user} />);
    setValue(0);
  };


  // Set default state of the page
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => pageUpdater(<Trips pageUpdater={pageUpdater} addToDatabase={addToDatabase} user={user}/>), []);  // useEffect runs only on first render
  
  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}> 
      <div className="App-content">
        {activePage}  {/* Page contents are retrieved from the activePage variable*/}
        <div className="row"><div className="divBox"><Typography>Signed-in as: <b>{username}</b></Typography></div></div>
      </div>
      </MuiPickersUtilsProvider>

      <BottomNavigation showLabels value={navState} onChange={(event, newValue) => {
        setValue(newValue);
        switch(newValue) {
          case 0:
            pageUpdater(<Trips pageUpdater={pageUpdater} addToDatabase={addToDatabase} user={user} />);
            break;
          case 1:
            pageUpdater(<Analyse pageUpdater={pageUpdater} addToDatabase={addToDatabase}/>);
            break;
          case 2:
            pageUpdater(<Fleet pageUpdater={pageUpdater}/>);
            break;
          case 3:
            handleClickLogout();
            break;
          default:
            pageUpdater(<Trips pageUpdater={pageUpdater}/>);
        }
      }} 
      className="bottomBar">
          <BottomNavigationAction label="Trips" icon={<Map />} />
          <BottomNavigationAction label="Analysis" icon={<Timeline />} />
          <BottomNavigationAction label="Fleet" icon={<LocalShipping />} />
          <BottomNavigationAction label="Logout" icon={<ExitToApp />} />
      </BottomNavigation>
      <Dialog open={dialogState} onClose={handleDialogClose}>
        <DialogTitle >Are you sure you want to logout?</DialogTitle>
        <DialogContent>You are currently signed-in as <b>{username}</b></DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => props.firebase.auth().signOut()} color="primary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
