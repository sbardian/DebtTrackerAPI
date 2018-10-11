/* eslint react/prefer-stateless-function: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
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

class AddDialog extends Component {
  constructor() {
    super();
    this.state = {
      _id: '',
      userId: '',
      name: '',
      balance: '',
      limit: '',
      interest_rate: '',
      test: '',
    };
  }

  componentWillReceiveProps(props) {
    const {
      _id,
      userId,
      name,
      balance,
      limit,
      interest_rate,
    } = props.cardToEdit;
    this.setState({
      _id,
      userId,
      name,
      balance,
      limit,
      interest_rate,
    });
  }

  handleChange = (name, event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  save = () => {
    const { onSave, onClose, onRequired } = this.props;
    const { name, limit, balance, interest_rate } = this.state;

    // TODO: find a better way to check this.
    if (!name || !limit || !balance || !interest_rate) {
      onRequired();
    } else if (
      name === '' ||
      limit === '' ||
      balance === '' ||
      interest_rate === ''
    ) {
      onRequired();
    } else {
      onSave(this.state);
      this.setState({
        _id: '',
        userId: '',
        name: '',
        balance: '',
        limit: '',
        interest_rate: '',
      });
      onClose();
    }
  };

  close = () => {
    this.setState({
      _id: '',
      userId: '',
      name: '',
      balance: '',
      limit: '',
      interest_rate: '',
    });
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const {
      classes,
      dialogOpen,
      onOpen,
      onClose,
      onTransition,
      onSave,
      cardToEdit,
      title,
    } = this.props;

    const { name, limit, balance, interest_rate } = this.state;

    return (
      <Dialog
        fullScreen
        open={dialogOpen}
        onClose={onClose}
        TransitionComponent={onTransition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              {title}
            </Typography>
            <Button color="inherit" onClick={() => this.save()}>
              save
            </Button>
            <Button
              color="inherit"
              onClick={() => this.close()}
              aria-label="Close"
            >
              cancel
            </Button>
          </Toolbar>
        </AppBar>
        <ValidatorForm className={classes.formContainer} onSubmit={() => {}}>
          <TextValidator
            id="name"
            label="Name"
            onChange={event => this.handleChange('name', event)}
            name="name"
            className={classes.textField}
            value={name || ''}
            margin="normal"
            validators={['required', 'isString']}
            errorMessages={['Required', 'Name of the credit card.']}
          />
          <TextValidator
            id="limit"
            label="Limit"
            onChange={event => this.handleChange('limit', event)}
            name="limit"
            className={classes.textField}
            value={limit || ''}
            margin="normal"
            validators={['required', 'isFloat']}
            errorMessages={[
              'Required',
              'Limit for the card.  (e.g. 1500.00 or 1500)',
            ]}
          />
          <TextValidator
            id="balance"
            label="Balance"
            onChange={event => this.handleChange('balance', event)}
            name="balance"
            className={classes.textField}
            value={balance || ''}
            margin="normal"
            validators={['required', 'isFloat']}
            errorMessages={[
              'Required',
              'Balance for the card.  (e.g. 500.00 or 500)',
            ]}
          />
          <TextValidator
            id="interest_rate"
            label="Interest Rate"
            onChange={event => this.handleChange('interest_rate', event)}
            name="interest_rate"
            className={classes.textField}
            value={interest_rate || ''}
            margin="normal"
            validators={['required', 'isFloat']}
            errorMessages={[
              'Required',
              'Interest rate for the card.  (e.g. 15.0 or 15)',
            ]}
          />
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default withStyles(styles)(AddDialog);

AddDialog.propTypes = {};
