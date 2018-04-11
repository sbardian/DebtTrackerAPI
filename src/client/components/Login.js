import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import utils from '../utils/utils';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
    marginTop: '20px',
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: 0,
    width: 400,
  },
  title: {
    padding: '40px',
    paddingTop: '50px',
    backgroundColor: '#bbff99',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 235,
  },
  button: {
    margin: '20px 10px 20px 10px',
  },
});

const theme = createMuiTheme({
  typography: {
    // Use the system font over Roboto.
    fontFamily:
      '-apple-system,system-ui,BlinkMacSystemFont,' +
      '"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      email: '',
      password: '',
      isAdmin: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.userLogin = this.userLogin.bind(this);
  }

  // User login
  userLogin(e) {
    const { email, password } = this.state;
    e.preventDefault();
    utils
      .userLogin(email, password)
      .then(response => {
        if (response.status === 200) {
          this.setState({
            username: response.data.username,
          });
          browserHistory.push({
            pathname: `/`,
            state: {
              username: response.data.username,
              isAdmin: response.data.isAdmin,
              token: response.data.token,
            },
          });
        } else {
          console.log('bad response ', response);
        }
      })
      .catch(err => {
        console.log('error in userLogin ', err);
      });
  }

  // Updates state based on table cell that was edited.
  handleChange(e) {
    const { value, id } = e.target;
    switch (id) {
      case 'email':
        this.setState({ email: value });
        break;
      case 'password':
        this.setState({ password: value });
        break;
      default:
        break;
    }
  }

  render() {
    const { classes } = this.props;
    const { email, password } = this.state;
    return (
      <Grid className={classes.root}>
        <MuiThemeProvider theme={theme}>
          <Grid
            container
            item
            xs={12}
            justify={'center'}
            className={classes.container}
          >
            <Grid>
              <Paper className={classes.paper}>
                <Typography
                  className={classes.title}
                  variant="headline"
                  component="h3"
                >
                  DebtTracker
                </Typography>
                <form className={classes.form}>
                  <Grid item xs={12}>
                    <TextField
                      id="email"
                      label="Email"
                      type="email"
                      value={email}
                      placeholder="Email"
                      onChange={this.handleChange}
                      className={classes.textField}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="password"
                      label="Password"
                      type="password"
                      value={password}
                      placeholder="Password"
                      onChange={this.handleChange}
                      className={classes.textField}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="raised"
                      className={classes.button}
                      onClick={event => this.userLogin(event)}
                    >
                      Login
                    </Button>
                    <Button variant="raised" className={classes.button}>
                      Register
                    </Button>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </MuiThemeProvider>
      </Grid>
    );
  }
}

export default withStyles(styles)(Login);
