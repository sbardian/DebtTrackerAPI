import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { Oops } from './Rain/Oops';

const NoMatchStyles = theme => ({
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
  button: {
    margin: '20px 10px 20px 10px',
  },
  fourOfour: {
    fontSize: '80pt',
    color: '#090d53',
  },
  pageNotFound: {
    alignSelf: 'end',
    paddingBottom: '20px',
    color: '#0b2263',
  },
});

const NoMatch = ({ classes, history }) => {
  const back = () => {
    history.push('/dashboard');
  };

  return (
    <div>
      <Oops count={30} />
      <Oops count={30} />
      <Oops count={30} />
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
              <Typography className={classes.title} variant="h5" component="h3">
                Oops. . .
              </Typography>
              <Grid item xs={12}>
                <div className={classes.fourOfour}>404</div>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.pageNotFound}>Page not found</div>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  className={classes.button}
                  onClick={() => back()}
                  data-testid="back-fourOfour"
                >
                  back
                </Button>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

NoMatch.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  classes: PropTypes.shape().isRequired,
};

export default withStyles(NoMatchStyles)(NoMatch);
