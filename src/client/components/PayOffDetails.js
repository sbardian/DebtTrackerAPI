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
  location: {
    state: {
      card: { limit, interest_rate, balance },
      username,
      isAdmin,
      token,
    },
  },
}) => {
  const [minimum, setMinimum] = useState(0);
  const [months, setMonths] = useState(0);
  const [monthsSave, setMonthsSave] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalSave, setTotalSave] = useState(0);
  const [singlePaymentMax, setSinglePaymentMax] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);

  // const calc = payment => {
  //   let currentMonths = 0;
  //   let currentTotalPaid = 0;
  //   let currentTotalInterest = 0;
  //   let newBalance = balance;
  //   let x = 0;
  //   const monthlyInterestRate = (interest_rate / 365) * 30;
  //   const interest = (monthlyInterestRate * newBalance) / 100;
  //   let monthlyPayment = payment || balance * 0.023;
  //   monthlyPayment = monthlyPayment < 25 ? 25 : monthlyPayment;
  //   const paid = monthlyPayment - interest;
  //   do {
  //     currentTotalInterest += interest;
  //     currentTotalPaid = currentTotalPaid + interest + paid;
  //     x += paid;
  //     newBalance -= paid;
  //     currentMonths += 1;
  //     if (paid * currentMonths > balance) {
  //       currentTotalPaid =
  //         currentTotalPaid -
  //         (currentTotalPaid - balance) +
  //         currentTotalInterest;
  //     }
  //   } while (x <= balance);
  //   setMonths(currentMonths);
  //   setTotal(currentTotalPaid);
  //   setPaymentAmount(monthlyPayment);
  //   if (!payment) {
  //     const currentSinglePaymentMax =
  //       balance + (balance * monthlyInterestRate) / 100 + 1;
  //     setSinglePaymentMax(currentSinglePaymentMax);
  //     setMinimum(monthlyPayment);
  //     setMonthsSave(currentMonths);
  //     setTotalSave(currentTotalPaid);
  //   }
  // };

  // useEffect(() => {
  //   calc();
  // }, []);

  const {
    currentSinglePaymentMax,
    monthlyPayment,
    currentMonths,
    currentTotalPaid,
  } = useCalcPayOff(balance, interest_rate);

  setMonths(currentMonths);
  setTotal(currentTotalPaid);
  setPaymentAmount(monthlyPayment);
  setSinglePaymentMax(currentSinglePaymentMax);
  setMinimum(monthlyPayment);
  setMonthsSave(currentMonths);
  setTotalSave(currentTotalPaid);

  const updatePaymentAmount = updatedValue => {
    setPaymentAmount(updatedValue);
  };

  const back = () => {
    console.log('back: ', username, isAdmin, token);
    history.push('/dashboard', {
      username,
      isAdmin,
      token,
    });
  };

  const marks = {
    [`${Math.trunc(minimum)}`]: {
      style: {
        width: 50,
        marginLeft: 0,
      },
      label: `$${utils.createDollar(Math.trunc(minimum))}`,
    },
    [`${Math.trunc(singlePaymentMax)}`]: {
      style: {
        width: 50,
        marginLeft: 0,
        left: '96%',
      },
      label: `$${utils.createDollar(Math.trunc(singlePaymentMax))}`,
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
          {interest_rate}%
        </Typography>
        <Typography>
          <strong>Minimum Payment: </strong>${utils.createDollar(minimum)}
        </Typography>
        <Typography>
          <strong>Months to Payoff: </strong>
          {monthsSave}
        </Typography>
        <Typography>
          <strong>Total Paid: </strong>${utils.createDollar(totalSave)}
        </Typography>
      </div>
      <div className={classes.container}>
        <div>Adjust payment:</div>
      </div>
      <div className={classes.container}>
        <h1>${utils.createDollar(paymentAmount)}</h1>
      </div>
      <div className={classes.container}>
        <div className={classes.wrapperStyle}>
          <Slider
            min={Math.trunc(minimum)}
            max={Math.trunc(singlePaymentMax)}
            marks={marks}
            defaultValue={Math.trunc(minimum)}
            onChange={updatePaymentAmount}
            handle={HandleSlide}
          />
        </div>
      </div>
      <div className={classes.containerBottom}>
        <div>
          Months: <h1> {months} </h1>
        </div>
        <div>
          Total Paid: <h1>${utils.createDollar(total)}</h1>
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
      card: PropTypes.shape({
        limit: PropTypes.number.isRequired,
        balance: PropTypes.number.isRequired,
        interest_rate: PropTypes.number.isRequired,
      }),
      user: PropTypes.string,
      name: PropTypes.string,
      limit: PropTypes.number,
      balance: PropTypes.number,
      interest_rate: PropTypes.number,
    }),
  }),
};

export default withStyles(PayOffDetailsStyles)(PayOffDetails);
