/* eslint react/prefer-stateless-function: 0 */
import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

const styles = theme => ({
  appBar: {
    position: 'relative',
    backgroundColor: theme.palette.primary.main,
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

const EditUserDialog = ({
  classes,
  dialogOpen,
  onTransition,
  onCloseEditUserDialog,
  userToEdit,
  onUpdateUser,
  onRequired,
}) => {
  const initialState = {
    _id: '',
    email: '',
    username: '',
    password: '',
    passwordConf: '',
  };

  const reducer = (state, action) => {
    const { payload, type } = action;
    switch (type) {
      case 'reset':
        return { ...payload };
      case '_id':
        return { ...state, _id: payload };
      case 'email':
        return { ...state, email: payload };
      case 'username':
        return { ...state, username: payload };
      case 'password':
        return { ...state, password: payload };
      case 'passwordConf':
        return { ...state, passwordConf: payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const { _id: uteId, email: uteEmail, username: uteusername } = userToEdit;
    dispatch({ type: '_id', payload: uteId });
    dispatch({ type: 'email', payload: uteEmail });
    dispatch({ type: 'username', payload: uteusername });
  }, [userToEdit]);

  const handleChange = event => {
    const { value, id } = event.target;
    switch (id) {
      case 'email':
        dispatch({ type: 'email', payload: value });
        break;
      case 'username':
        dispatch({ type: 'username', payload: value });
        break;
      case 'password':
        dispatch({ type: 'password', payload: value });
        break;
      case 'passwordConf':
        dispatch({ type: 'passwordConf', payload: value });
        break;
      default:
        break;
    }
  };

  const save = () => {
    const { _id, email, username, password, passwordConf } = state;
    if (_id && email && username) {
      onUpdateUser({ _id, email, username, password, passwordConf });
    } else {
      onRequired();
    }
  };

  const close = () => {
    dispatch({ type: 'reset', payload: initialState });
    onCloseEditUserDialog();
  };

  useEffect(() => {
    const { password } = state;
    ValidatorForm.addValidationRule('isPasswordConf', passwordConfValue => {
      if (passwordConfValue !== password) {
        return false;
      }
      return true;
    });
  }, [state.passwordConf]);

  return (
    <Dialog
      fullScreen
      open={dialogOpen}
      onClose={onCloseEditUserDialog}
      TransitionComponent={onTransition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.flex}>
            {`Edit User ${state.username}`}
          </Typography>
          <Button
            data-testid="save-card-button"
            color="inherit"
            onClick={() => save()}
          >
            save
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
          onChange={handleChange}
          name="email"
          className={classes.textField}
          value={state.email}
          margin="normal"
          validators={['required', 'isEmail']}
          errorMessages={['Required', 'Email of user']}
        />
        <TextValidator
          id="username"
          label="Username"
          onChange={handleChange}
          name="username"
          className={classes.textField}
          value={state.username}
          margin="normal"
          validators={['required', 'isString']}
          errorMessages={['Required', 'Username of user']}
        />
        <TextValidator
          id="password"
          label="Password"
          onChange={handleChange}
          name="password"
          className={classes.textField}
          value={state.password}
          type="password"
          margin="normal"
          validators={['required']}
          errorMessages={['Required', 'Password of user']}
        />
        <TextValidator
          id="passwordConf"
          label="Repeat Password"
          onChange={handleChange}
          name="passwordConf"
          className={classes.textField}
          value={state.passwordConf}
          margin="normal"
          type="password"
          validators={['required', 'isPasswordConf']}
          errorMessages={['Required', 'Passwords do not match']}
        />
      </ValidatorForm>
    </Dialog>
  );
};

export default withStyles(styles)(EditUserDialog);

EditUserDialog.defaultProps = {
  userToEdit: {
    _id: '',
    email: '',
    username: '',
  },
};

EditUserDialog.propTypes = {
  classes: PropTypes.shape().isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  onTransition: PropTypes.func.isRequired,
  onCloseEditUserDialog: PropTypes.func.isRequired,
  userToEdit: PropTypes.shape({
    _id: PropTypes.string,
    email: PropTypes.string,
    username: PropTypes.string,
  }),
  onUpdateUser: PropTypes.func.isRequired,
  onRequired: PropTypes.func.isRequired,
};
