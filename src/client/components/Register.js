/* eslint react/prefer-stateless-function: 0 */
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { browserHistory } from 'react-router';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
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

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConf: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  registerUser() {
    const { username, email, password, passwordConf } = this.state;
    // TODO: confirm password and passwordConf match
    utils
      .registerUser(username, email, password, passwordConf)
      .then(response => {
        if (response && response.status === 200) {
          this.setState({
            username: response.data.username,
          });
          browserHistory.push({
            pathname: `/`,
            state: {
              username: response.data.username,
              token: response.data.token,
            },
          });
        }
      })
      .catch(err => {
        console.log('error registering: ', err);
      });
  }

  close() {
    browserHistory.push({
      pathname: `/login`,
    });
  }

  render() {
    const { classes } = this.props;
    const { username, email, password, passwordConf } = this.state;
    return (
      <div>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              Register
            </Typography>
            <Button color="inherit" onClick={() => this.registerUser()}>
              register
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
            id="email"
            label="Email"
            className={classes.textField}
            value={this.state.email}
            onChange={this.handleChange('email')}
            margin="normal"
          />
          <TextField
            id="username"
            label="Username"
            className={classes.textField}
            value={this.state.username}
            onChange={this.handleChange('username')}
            margin="normal"
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            className={classes.textField}
            value={this.state.password}
            onChange={this.handleChange('password')}
            margin="normal"
          />
          <TextField
            id="passwordConf"
            label="Confirm Password"
            type="password"
            className={classes.textField}
            value={this.state.passwordConf}
            onChange={this.handleChange('passwordConf')}
            margin="normal"
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Register);
