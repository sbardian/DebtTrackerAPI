import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import utils from '../utils/utils';
import HandleSlide from './HandleSlide';
import { useCalcPayOff } from './utils/useCalcPayOff';

const PayOffDetailsStyles = theme => ({
  appBar: {
    position: 'relative',
    backgroundColor: theme.palette.primary.main,
    color: '#666',
  },
  flex: {
    flex: 1,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  containerTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: 1,
    padding: 20,
    marginBottom: 50,
  },
  containerBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    flexGrow: 1,
    margin: 50,
  },
  titleHeaders: {
    fontWeight: 'bold',
  },
  wrapperStyle: {
    marginRight: 50,
    marginLeft: 50,
    width: '100%',
  },
  button: {
    margin: theme.spacing.unit,
  },
});

const PayOffDetails = ({
  classes,
  history,
  location: { state: { username, isAdmin } = {} },
  match: {
    params: { cardId },
  },
}) => {
  const [months, setMonths] = useState(1);
  const [limit, setLimit] = useState(0);
  const [balance, setBalance] = useState(0);
  const [interest, setInterest] = useState(0);

  useEffect(() => {
    utils
      .getCreditCardById(cardId)
      .then(response => {
        if (response.status === 200) {
          response.json().then(data => {
            const { message: card } = data;
            setLimit(card.limit);
            setBalance(card.balance);
            setInterest(card.interest_rate);
          });
        } else {
          history.push('/login');
        }
      })
      .catch(() => history.push('/login'));
  }, [cardId]);

  const { minimum = 0, totalPaid = 0 } = useCalcPayOff(
    months,
    balance,
    interest,
  );

  const back = () => {
    history.push('/dashboard', {
      username,
      isAdmin,
    });
  };

  const marks = {
    1: {
      label: `1`,
    },
    72: {
      label: `72`,
    },
  };

  return (
    <Paper>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.flex}>
            Pay Off Details
          </Typography>
          <Button color="inherit" onClick={() => back()}>
            back
          </Button>
        </Toolbar>
      </AppBar>
      <div className={classes.containerTop}>
        <Typography>
          <strong>Limit: </strong>${utils.createDollar(limit)}
        </Typography>
        <Typography>
          <strong>Balance: </strong>${utils.createDollar(balance)}
        </Typography>
        <Typography>
          <strong>Interest Rate: </strong>
          {interest}%
        </Typography>
        <Typography>
          <strong>Minimum Payment: </strong>${utils.createDollar(minimum)}
        </Typography>
      </div>
      <div className={classes.container}>
        <div>Months:</div>
      </div>
      <div className={classes.container}>
        <h1>{months}</h1>
      </div>
      <div className={classes.container}>
        <div className={classes.wrapperStyle}>
          <Slider
            min={1}
            max={72}
            marks={marks}
            defaultValue={1}
            onChange={setMonths}
            handle={HandleSlide}
          />
        </div>
      </div>
      <div className={classes.containerBottom}>
        <div>
          Minimum Payment: <h1>${utils.createDollar(minimum)}</h1>
        </div>
        <div>
          Total Paid: <h1>${utils.createDollar(totalPaid)}</h1>
        </div>
      </div>
    </Paper>
  );
  // }
};

PayOffDetails.defaultProps = {
  location: [],
};

PayOffDetails.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  classes: PropTypes.shape().isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      user: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      cardId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default withStyles(PayOffDetailsStyles)(PayOffDetails);
