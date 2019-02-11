import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const NoMatchStyles = theme => ({
  appBar: {
    position: 'relative',
    backgroundColor: theme.palette.primary.main,
    color: '#666',
  },
  flex: {
    flex: 1,
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridGap: '10px',
    gridAutoRows: '200px',
    gridTemplateRows: '1fr 1fr 1fr 1fr 1fr',
  },
  subContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignSelf: 'center',
    justifySelf: 'center',
    gridColumnStart: 2,
    gridColumnEnd: 4,
    gridRowStart: 3,
  },
  fourOfour: {
    fontSize: '80pt',
    color: '#090d53',
  },
  pageNotFound: {
    alignSelf: 'end',
    paddingBottom: '20px',
    paddingLeft: '20px',
    color: '#0b2263',
  },
});

const NoMatch = ({ classes, history }) => {
  const back = () => {
    history.push('/dashboard');
  };

  return (
    <Paper>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.flex}>
            Oops. . .
          </Typography>
          <Button color="inherit" onClick={() => back()}>
            back
          </Button>
        </Toolbar>
      </AppBar>
      <div className={classes.container}>
        <div className={classes.subContainer}>
          <div className={classes.fourOfour}>404</div>
          <div className={classes.pageNotFound}>Page not found</div>
        </div>
      </div>
    </Paper>
  );
};

NoMatch.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  classes: PropTypes.shape().isRequired,
};

export default withStyles(NoMatchStyles)(NoMatch);
