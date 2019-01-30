import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { AlertProvider, AlertWrapper } from 'react-alerts-plus';
import CssBaseline from '@material-ui/core/CssBaseline';
import Login from './Login';
import Logout from './Logout';
import Register from './Register';
import Dashboard from '../containers/DashboardContainer';
import PayOffDetails from './PayOffDetails';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    // Use the system font over Roboto.
    fontFamily: [
      '-apple-system,system-ui,BlinkMacSystemFont,' +
        '"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
    ].join(','),
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
    <AlertProvider>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <AlertWrapper>
          {({ show, close }) => (
            <div className="main-container">
              <Route
                exact
                path="/"
                render={() => <Redirect to="/dashboard" />}
              />
              <Route
                path="/dashboard"
                render={() => <Dashboard showAlert={show} closeAlert={close} />}
              />
              <Route path="/login" component={Login} />
              <Route path="/logout" component={Logout} />
              <Route path="/register" component={Register} />
              <Route path="/payoffdetails/:card" component={PayOffDetails} />
            </div>
          )}
        </AlertWrapper>
      </MuiThemeProvider>
    </AlertProvider>
  </div>
);

export default Main;
