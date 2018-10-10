import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// import { CssBaseLine } from '@material-ui/core/CssBaseline';

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
      contrastText: '#000',
    },
  },
});

const Main = ({ children }) => (
  <div>
    {/* <CssBaseLine /> */}
    <MuiThemeProvider theme={theme}>
      <div className="main-container">{children}</div>
    </MuiThemeProvider>
  </div>
);

Main.propTypes = {};

export default Main;
