import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import utils from '../utils/utils';
import { UsernameContext } from './UsernameContext';

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
  failure: {
    padding: '20px',
    color: 'red',
    textAlign: 'center',
  },
});

const Register = ({ classes, history }) => {
  const { updateUsername } = React.useContext(UsernameContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [registerFailure, setRegisterFailure] = useState(false);
  const [registrationErrorMessage, setregistrationErrorMessage] = useState('');

  const close = () => {
    history.push('/login');
  };

  const handleUsernameChange = event => {
    setUsername(event.target.value);
  };

  const handleEmailChange = event => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  const handlePasswordConfChange = event => {
    setPasswordConf(event.target.value);
  };

  const registerUser = () => {
    utils
      .registerUser(username, email, password, passwordConf)
      .then(data => {
        if (data.error) {
          throw new Error(data.message);
        }
        const { username: responseUsername } = data;
        updateUsername(responseUsername);
        setUsername(responseUsername);
        history.push('/dashboard', {
          username: responseUsername,
        });
      })
      .catch(error => {
        setregistrationErrorMessage(error.message);
        setRegisterFailure(true);
      });
  };

  useEffect(() => {
    ValidatorForm.addValidationRule('isPasswordConf', passwordConfValue => {
      if (passwordConfValue !== password) {
        return false;
      }
      return true;
    });
  }, [passwordConf]);

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
      <ValidatorForm className={classes.formContainer} onSubmit={() => {}}>
        <TextValidator
          id="email"
          label="Email"
          onChange={handleEmailChange}
          name="email"
          className={classes.textField}
          value={email}
          margin="normal"
          validators={['required', 'isEmail']}
          errorMessages={['Required', 'Email Address']}
        />
        <TextValidator
          id="username"
          label="Username"
          onChange={handleUsernameChange}
          name="username"
          className={classes.textField}
          value={username}
          margin="normal"
          validators={['required', 'isString']}
          errorMessages={['Required', 'Your username']}
        />
        <TextValidator
          id="password"
          label="Password"
          onChange={handlePasswordChange}
          name="password"
          className={classes.textField}
          value={password}
          margin="normal"
          type="password"
          validators={['required']}
          errorMessages={['Required', 'Passwords do not match']}
        />
        <TextValidator
          id="passwordConf"
          label="Repeat Password"
          onChange={handlePasswordConfChange}
          name="passwordConf"
          className={classes.textField}
          value={passwordConf}
          margin="normal"
          type="password"
          validators={['required', 'isPasswordConf']}
          errorMessages={['Required', 'Passwords do not match']}
        />
      </ValidatorForm>
      <div>
        {registerFailure && (
          <div className={classes.failure}>{registrationErrorMessage}</div>
        )}
      </div>
    </div>
  );
};

Register.propTypes = {
  classes: PropTypes.shape().isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default withStyles(styles)(Register);
