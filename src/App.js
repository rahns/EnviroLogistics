import React from 'react';
import './index.css';
import Main from './Main';
import firebase from "firebase/app";
import "firebase/auth";
import { FirebaseAuthProvider, IfFirebaseAuthed, IfFirebaseUnAuthed } from "@react-firebase/auth";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {Typography, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';


var firebaseConfig = {
    apiKey: "AIzaSyBrec3dqroIgZLstvNTt14HsRRwHLFWw1w",
    authDomain: "envirologistics-team17.firebaseapp.com",
    projectId: "envirologistics-team17",
    storageBucket: "envirologistics-team17.appspot.com",
    messagingSenderId: "528290527068",
    appId: "1:528290527068:web:f4c3fe45f5ad568f2eb399",
    measurementId: "G-9R4DEPNWPE"
  };
  
firebase.initializeApp(firebaseConfig);

export default function App(props) { 
    const [msgState, setMsgOpen] = React.useState(false);

    const handleLogin = () => {
        setMsgOpen(true);
    };

    const handleClose = (event, reason) => {
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
        },
        requireDisplayName: false
      };
    return (
        <FirebaseAuthProvider {...firebaseConfig} firebase={firebase}>
            <IfFirebaseAuthed>
                <Main firebase={firebase}/>
            </IfFirebaseAuthed>
            <IfFirebaseUnAuthed>
                <div className={`App-content`} style={{justifyContent: "center", alignItems: "center"}}>
                    <div className="divBox">
                    <Typography variant="h6" style={{textAlign: "center"}}>Welcome to EnviroLogistics</Typography>
                    <Typography style={{textAlign: "center"}}>Please sign-in:</Typography>
                    <StyledFirebaseAuth uiConfig={loginUIConfig} firebaseAuth={firebase.auth()} />
                    </div>
                </div>
            </IfFirebaseUnAuthed>
            <Snackbar open={msgState} autoHideDuration={6000} onClose={handleClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="success">
                    Sign-in successful. Welcome {firebase.auth().currentUser !== null ? firebase.auth().currentUser.email : ""}
                </MuiAlert>
            </Snackbar>
        </FirebaseAuthProvider>
    )
}