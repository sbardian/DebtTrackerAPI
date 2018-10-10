import React, { Component } from 'react';
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
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      email: '',
      password: '',
      isAdmin: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.userLogin = this.userLogin.bind(this);
  }

  componentDidMount() {
    document.body.style.overflowY = 'hidden';
  }

  // User Registration
  register = () => {
    browserHistory.push({
      pathname: `/register`,
    });
  };

  // User login
  userLogin(e) {
    const { email, password } = this.state;
    e.preventDefault();
    utils
      .userLogin(email, password)
      .then(response => {
        if (response.status === 200) {
          this.setState({
            username: response.data.username,
          });
          browserHistory.push({
            pathname: `/`,
            state: {
              username: response.data.username,
              isAdmin: response.data.isAdmin,
              token: response.data.token,
            },
          });
        } else {
          console.log('bad response ', response);
        }
      })
      .catch(err => {
        console.log('error in userLogin ', err);
      });
  }

  // Updates state based on table cell that was edited.
  handleChange(e) {
    const { value, id } = e.target;
    switch (id) {
      case 'email':
        this.setState({ email: value });
        break;
      case 'password':
        this.setState({ password: value });
        break;
      default:
        break;
    }
  }

  render() {
    const { classes } = this.props;
    const { email, password } = this.state;

    return (
      <div>
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
                <Typography
                  className={classes.title}
                  variant="h5"
                  component="h3"
                >
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
                      onChange={this.handleChange}
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
                      onChange={this.handleChange}
                      className={classes.textField}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      className={classes.button}
                      onClick={event => this.userLogin(event)}
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      className={classes.button}
                      onClick={() => this.register()}
                    >
                      Register
                    </Button>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withTheme()(withStyles(styles)(Login));
