import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import CssBaseline from '@material-ui/core/CssBaseline';
import alertOptions from '../utils/alertOptions';

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

const Main = ({ children }) => (
  <div>
    <Provider template={AlertTemplate} {...alertOptions}>
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <div className="main-container">{children}</div>
      </MuiThemeProvider>
    </Provider>
  </div>
);

Main.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Main;
