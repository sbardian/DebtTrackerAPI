import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import bluedollar from '../images/bluedollar.png';

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
    boxShadow: '0px 2px 2px #e1e1e1',
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
    marginTop: '20px',
    color: '#090d53',
  },
  pageNotFound: {
    alignSelf: 'end',
    paddingBottom: '20px',
    color: '#0b2263',
  },
  oopsBox: {
    display: 'grid',
    gridTemplateRows: '1fr',
    justifyItems: 'center',
    gridGap: '20px',
  },
});

const NoMatch = ({ classes, history }) => {
  const back = () => {
    history.push('/dashboard');
  };

  return (
    <div>
      <Grid className={classes.root}>
        <Grid
          container
          item
          xs={12}
          justify="center"
          className={classes.container}
        >
          <Grid className={classes.oopsBox}>
            <img src={bluedollar} alt="Debt Tracker" />
            <div className={classes.paper}>
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
            </div>
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
