import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
import { UsernameContext } from './UsernameContext';
import utils from '../utils/utils';
import bluedollar from '../images/bluedollar.png';

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
    background: 'white',
    padding: 0,
    width: 400,
    boxShadow: '0px 2px 2px #e1e1e1',
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
    color: 'red',
    textAlign: 'center',
  },
  loginBox: {
    display: 'grid',
    gridTemplateRows: '1fr',
    justifyItems: 'center',
    gridGap: '20px',
  },
});

const Login = ({ classes, history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailure, setLoginFailure] = useState(false);

  const clickLoginButton = event => {
    const loginButton = document.getElementById('login-button');
    if (event.keyCode === 13) {
      loginButton.click();
    }
  };

  useEffect(() => {
    document
      .getElementById('password')
      .addEventListener('keypress', clickLoginButton);
    document
      .getElementById('email')
      .addEventListener('keypress', clickLoginButton);
    return () => {
      document.removeEventListener('password', clickLoginButton);
      document.removeEventListener('email', clickLoginButton);
    };
  }, []);

  const { updateUsername } = useContext(UsernameContext);

  const registerButtonClick = () => {
    history.push('register');
  };

  const userLogin = event => {
    event.preventDefault();
    utils
      .userLogin(email, password)
      .then(data => {
        const { username } = data;
        updateUsername(username);
        history.push('/dashboard', {
          username,
        });
      })
      .catch(() => {
        setLoginFailure(true);
      });
  };

  const handleEmailChange = event => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  return (
    <div>
      <Grid className={classes.root}>
        <Grid
          container
          item
          xs={12}
          justify="center"
          className={classes.container}
        >
          <Grid className={classes.loginBox}>
            <img src={bluedollar} alt="Debt Tracker" />
            <div className={classes.paper}>
              <Typography className={classes.title} variant="h5" component="h3">
                DebtTracker
              </Typography>
              <ValidatorForm
                className={classes.formContainer}
                onSubmit={() => {}}
              >
                <Grid item xs={12}>
                  <TextValidator
                    id="email"
                    label="Email"
                    onChange={handleEmailChange}
                    name="email"
                    placeholder="user@domain.com"
                    className={classes.textField}
                    value={email}
                    margin="normal"
                    validators={['required', 'isEmail']}
                    errorMessages={[
                      'Required',
                      'Please enter a valid email address',
                    ]}
                  />
                  <TextValidator
                    id="password"
                    label="Password"
                    onChange={handlePasswordChange}
                    name="password"
                    placeholder="Password"
                    className={classes.textField}
                    value={password}
                    margin="normal"
                    type="password"
                    validators={['required']}
                    errorMessages={['Required', 'Please enter a password']}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    id="login-button"
                    variant="contained"
                    className={classes.button}
                    onClick={event => userLogin(event)}
                    data-testid="login-button"
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    className={classes.button}
                    onClick={() => registerButtonClick()}
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
              </ValidatorForm>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

Login.propTypes = {
  classes: PropTypes.shape().isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default withTheme()(withRouter(withStyles(styles)(Login)));
