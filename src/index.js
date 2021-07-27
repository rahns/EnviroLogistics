import React from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from "@material-ui/core";
import {createTheme} from '@material-ui/core/styles';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const theme = createTheme({
  palette: {
    primary: {
      light: '#ffffee',
      main: '#ffccbc',
      dark: '#cb9b8c',
      contrastText: '#000',
    },
    secondary: {
      light: '#fffffa',
      main: '#dcedc7',
      dark: '#aabb96',
      contrastText: '#fff',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
