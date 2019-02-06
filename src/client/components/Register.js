import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import utils from '../utils/utils';

const styles = theme => ({
  appBar: {
    position: 'relative',
    // backgroundColor: theme.palette.primary.main,
    color: '#666',
  },
  flex: {
    flex: 1,
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400,
  },
});

function Register({ classes, history }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');

  const close = () => {
    history.push('/login');
  };

  const handleChange = name => event => {
    switch (name) {
      case 'username':
        setUsername(event.target.value);
        break;
      case 'email':
        setEmail(event.target.value);
        break;
      case 'password':
        setPassword(event.target.value);
        break;
      case 'passwordConf':
        setPasswordConf(event.target.value);
        break;
      default:
        break;
    }
  };

  const registerUser = () => {
    // TODO: validate data in form (password === passwordConf/etc.  Use TextValidator instead of TextField)
    utils
      .registerUser(username, email, password, passwordConf)
      .then(response => {
        if (response.status === 200) {
          response.json().then(data => {
            const { username: responseUsername } = data;
            setUsername(responseUsername);
            history.push('/dashboard', {
              username: responseUsername,
            });
          });
        }
      })
      .catch(() => {
        // TODO: Add some type of element stating registration failed.
      });
  };

  return (
    <div>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography
            variant="h6"
            color="inherit"
            data-testid="title"
            className={classes.flex}
          >
            Register
          </Typography>
          <Button
            color="inherit"
            data-testid="register-button"
            onClick={() => registerUser()}
          >
            register
          </Button>
          <Button color="inherit" onClick={() => close()} aria-label="Close">
            cancel
          </Button>
        </Toolbar>
      </AppBar>
      <div className={classes.formContainer}>
        <TextField
          id="email"
          label="Email"
          className={classes.textField}
          value={email}
          onChange={handleChange('email')}
          margin="normal"
        />
        <TextField
          id="username"
          label="Username"
          className={classes.textField}
          value={username}
          onChange={handleChange('username')}
          margin="normal"
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          className={classes.textField}
          value={password}
          onChange={handleChange('password')}
          margin="normal"
        />
        <TextField
          id="passwordConf"
          label="Confirm Password"
          type="password"
          className={classes.textField}
          value={passwordConf}
          onChange={handleChange('passwordConf')}
          margin="normal"
        />
      </div>
    </div>
  );
}

Register.propTypes = {
  classes: PropTypes.shape().isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default withStyles(styles)(Register);
