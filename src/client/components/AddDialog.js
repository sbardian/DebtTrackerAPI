/* eslint react/prefer-stateless-function: 0 */
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#bbff99',
    color: '#666',
  },
  flex: {
    flex: 1,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

class AddDialog extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      balance: '',
      limit: '',
      interest_rate: '',
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  save = () => {
    const { onAdd, onClose } = this.props;
    onAdd(this.state);
    this.setState({
      name: '',
      balance: '',
      limit: '',
      interest_rate: '',
    });
    onClose();
  };

  close = () => {
    this.setState({
      name: '',
      balance: '',
      limit: '',
      interest_rate: '',
    });
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const { classes, dialogOpen, onOpen, onClose, onTransition } = this.props;
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
              Add Credit Card
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
        <TextField
          id="name"
          label="Name"
          className={classes.textField}
          value={this.state.name}
          onChange={this.handleChange('name')}
          margin="normal"
        />
        <TextField
          id="limit"
          label="Limit"
          className={classes.textField}
          value={this.state.limit}
          onChange={this.handleChange('limit')}
          margin="normal"
        />
        <TextField
          id="balance"
          label="Balance"
          className={classes.textField}
          value={this.state.balance}
          onChange={this.handleChange('balance')}
          margin="normal"
        />
        <TextField
          id="interest_rate"
          label="Interest Rate"
          className={classes.textField}
          value={this.state.interest_rate}
          onChange={this.handleChange('interest_rate')}
          margin="normal"
        />
      </Dialog>
    );
  }
}

export default withStyles(styles)(AddDialog);
