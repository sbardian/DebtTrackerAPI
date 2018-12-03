import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import CssBaseline from '@material-ui/core/CssBaseline';
import alertOptions from '../utils/alertOptions';
import Login from './Login';
import Logout from './Logout';
import Register from './Register';
import Dashboard from '../containers/DashboardContainer';
import PayOffDetailsContainer from '../containers/PayOffDetailsContainer';
import PayOffDetails from './PayOffDetails';

const theme = createMuiTheme({
  typography: {
    // Use the system font over Roboto.
    fontFamily:
      '-apple-system,system-ui,BlinkMacSystemFont,' +
      '"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
  },
  palette: {
    primary: {
      light: '#b6ffff',
      main: '#81d4fa',
      dark: '#4ba3c7',
      contrastText: '#000000',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000000',
    },
  },
});

const Main = () => (
  <div>
    <Provider template={AlertTemplate} {...alertOptions}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div className="main-container">
          <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <Route path="/register" component={Register} />
          <Route path="payoff/:card" component={PayOffDetailsContainer} />
          <Route path="payoffdetails/:card" component={PayOffDetails} />
        </div>
      </MuiThemeProvider>
    </Provider>
  </div>
);

export default Main;
