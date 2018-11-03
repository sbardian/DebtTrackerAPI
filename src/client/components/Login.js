import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Rain from './Rain/Rain';
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
    color: theme.palette.secondary.dark,
    padding: 0,
    width: 400,
  },
  title: {
    padding: '40px',
    paddingTop: '50px',
    backgroundColor: theme.palette.primary.main,
    color: '#666',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 235,
  },
  button: {
    margin: '20px 10px 20px 10px',
  },
  failure: {
    padding: '20px',
  },
});

const Login = ({ classes }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailure, setLoginFailure] = useState(false);

  useEffect(() => {
    document.body.style.overflowY = 'hidden';
  });

  const register = () => {
    browserHistory.push({
      pathname: `/register`,
    });
  };

  const userLogin = e => {
    e.preventDefault();
    utils
      .userLogin(email, password)
      .then(response => {
        if (response.status === 200) {
          browserHistory.push({
            pathname: `/`,
            state: {
              username: response.data.username,
              isAdmin: response.data.isAdmin,
              token: response.data.token,
            },
          });
        } else {
          setLoginFailure(true);
        }
      })
      .catch(() => {
        setLoginFailure(true);
      });
  };

  // Updates state based on table cell that was edited.
  const handleChange = e => {
    const { value, id } = e.target;
    switch (id) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Rain count={30} />
      <Rain count={30} />
      <Rain count={30} />
      <Grid className={classes.root}>
        <Grid
          container
          item
          xs={12}
          justify="center"
          className={classes.container}
        >
          <Grid>
            <Paper className={classes.paper}>
              <Typography className={classes.title} variant="h5" component="h3">
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    className={classes.textField}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    className={classes.button}
                    onClick={event => userLogin(event)}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    className={classes.button}
                    onClick={() => register()}
                  >
                    Register
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  {loginFailure && (
                    <div className={classes.failure}>
                      Login Failure, please try again.
                    </div>
                  )}
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

Login.propTypes = {
  classes: PropTypes.shape().isRequired,
};

export default withTheme()(withStyles(styles)(Login));
