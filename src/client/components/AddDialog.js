/* eslint react/prefer-stateless-function: 0 */
import React, { Component, useState, useEffect } from 'react';
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

const AddDialog = ({
  cardToEdit,
  onSave,
  onClose,
  onRequired,
  classes,
  dialogOpen,
  onTransition,
  title,
}) => {
  const [_id, setId] = useState('');
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [limit, setLimit] = useState('');
  const [interestRate, setInterestRate] = useState('');

  useEffect(
    () => {
      const {
        _id: cteId,
        userId: cteUserId,
        name: cteName,
        balance: cteBalance,
        limit: cteLimit,
        interest_rate: cteInterestRate,
      } = cardToEdit;
      setId(cteId);
      setUserId(cteUserId);
      setName(cteName);
      setBalance(cteBalance);
      setLimit(cteLimit);
      setInterestRate(cteInterestRate);
    },
    [cardToEdit],
  );

  const handleChange = event => {
    const { value, id } = event.target;
    switch (id) {
      case 'name':
        setName(value);
        break;
      case 'balance':
        setBalance(value);
        break;
      case 'limit':
        setLimit(value);
        break;
      case 'interest_rate':
        setInterestRate(value);
        break;
      default:
        break;
    }
  };

  const save = () => {
    // TODO: find a better way to check this.
    if (!name || !limit || !balance || !interestRate) {
      onRequired();
    } else if (
      name === '' ||
      limit === '' ||
      balance === '' ||
      interestRate === ''
    ) {
      onRequired();
    } else {
      onSave({ _id, name, limit, balance, interest_rate: interestRate });
      setId('');
      setUserId('');
      setName('');
      setBalance('');
      setLimit('');
      setInterestRate('');
      onClose();
    }
  };

  const close = () => {
    setId('');
    setUserId('');
    setName('');
    setBalance('');
    setLimit('');
    setInterestRate('');
    onClose();
  };

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
          id="name"
          label="Name"
          onChange={handleChange}
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
          onChange={handleChange}
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
          onChange={handleChange}
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
          onChange={handleChange}
          name="interest_rate"
          className={classes.textField}
          value={interestRate || ''}
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
};

export default withStyles(styles)(AddDialog);

AddDialog.propTypes = {
  classes: PropTypes.shape().isRequired,
  onRequired: PropTypes.func.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onTransition: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  cardToEdit: PropTypes.shape().isRequired,
  title: PropTypes.string.isRequired,
};
