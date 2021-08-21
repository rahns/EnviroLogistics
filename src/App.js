import React from 'react';
import './index.css';
import Main from './Main';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { FirebaseAuthProvider, IfFirebaseAuthed, IfFirebaseUnAuthed } from "@react-firebase/auth";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {Typography, Snackbar, Grow } from "@material-ui/core";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';


var firebaseConfig = {
    apiKey: "AIzaSyBrec3dqroIgZLstvNTt14HsRRwHLFWw1w",
    authDomain: "envirologistics-team17.firebaseapp.com",
    projectId: "envirologistics-team17",
    storageBucket: "envirologistics-team17.appspot.com",
    messagingSenderId: "528290527068",
    appId: "1:528290527068:web:f4c3fe45f5ad568f2eb399",
    databaseURL: "https://envirologistics-team17-default-rtdb.asia-southeast1.firebasedatabase.app/",
    measurementId: "G-9R4DEPNWPE"
  };
  
firebase.initializeApp(firebaseConfig);
export const database = firebase.database();

export default function App(props) { 
    const [msgState, setMsgOpen] = React.useState(false);

    const handleLogin = () => {
        setMsgOpen(true);
        if (!firebase.auth().currentUser.emailVerified) {
            firebase.auth().currentUser.sendEmailVerification();
        }
    };

    const handleMsgClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setMsgOpen(false);
    };
      
    const loginUIConfig = {
        signInFlow: 'popup',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false
          },
        ],
        callbacks: {
          signInSuccessWithAuthResult: handleLogin,
        }
      };

    const theme = createTheme({
        palette: {
          primary: {
            main: '#614385',
          },
          secondary: {
            main: '#9a53a0',
          },
        },
      });
    return (
        <FirebaseAuthProvider {...firebaseConfig} firebase={firebase}>
            <ThemeProvider theme={theme}>
                <IfFirebaseAuthed>
                  <Main firebase={firebase} />
                </IfFirebaseAuthed>
                <IfFirebaseUnAuthed>
                  <div className={`App-content`} style={{justifyContent: "center", alignItems: "center"}}>
                    <Grow in={true} timeout={1000} style={{ transitionDelay: 100}}>
                      <div>
                        <div className="divBox">
                          <Typography variant="h6" style={{textAlign: "center"}}>Welcome to EnviroLogistics</Typography>
                          <Typography style={{textAlign: "center"}}>Please sign-in:</Typography>
                          <StyledFirebaseAuth uiConfig={loginUIConfig} firebaseAuth={firebase.auth()} />
                        </div>
                      </div>
                    </Grow>
                  </div>
                </IfFirebaseUnAuthed>
                <Snackbar open={msgState} autoHideDuration={6000} onClose={handleMsgClose}>
                    <MuiAlert elevation={6} variant="filled" onClose={handleMsgClose} severity="success">
                        Sign-in successful. Welcome, {firebase.auth().currentUser == null ? "" : (firebase.auth().currentUser.displayName ? firebase.auth().currentUser.displayName: firebase.auth().currentUser.email)}
                    </MuiAlert>
                </Snackbar>
            </ThemeProvider>
        </FirebaseAuthProvider>
    )
}