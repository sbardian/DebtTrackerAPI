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

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  save = () => {
    const { onSave, onClose } = this.props;
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
        transition={onTransition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
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
        <div className={classes.formContainer}>
          <TextField
            id="name"
            label="Name"
            className={classes.textField}
            value={name}
            onChange={this.handleChange('name')}
            margin="normal"
          />
          <TextField
            id="limit"
            label="Limit"
            className={classes.textField}
            value={limit}
            onChange={this.handleChange('limit')}
            margin="normal"
          />
          <TextField
            id="balance"
            label="Balance"
            className={classes.textField}
            value={balance}
            onChange={this.handleChange('balance')}
            margin="normal"
          />
          <TextField
            id="interest_rate"
            label="Interest Rate"
            className={classes.textField}
            value={interest_rate}
            onChange={this.handleChange('interest_rate')}
            margin="normal"
          />
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(AddDialog);

AddDialog.propTypes = {};
