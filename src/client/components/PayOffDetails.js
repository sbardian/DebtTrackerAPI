import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from 'rc-tooltip';
import Slider, { Handle } from 'rc-slider';
import utils from '../utils/utils';

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

class PayOffDetails extends Component {
  static handleSlide(props) {
    const { value, dragging, index, ...restProps } = props;
    return (
      <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={value}
        visible={dragging}
        placement="top"
        key={index}
      >
        <Handle {...restProps} />
      </Tooltip>
    );
  }

  constructor() {
    super();
    this.state = {
      minimum: null,
      months: null,
      monthsSave: null,
      total: null,
      totalSave: null,
      singlePaymentMax: 0,
      paymentAmount: 0,
    };
  }

  componentWillMount() {
    this.calc();
  }

  // Logs the payment amount for updating component.
  log = value => {
    this.setState({
      paymentAmount: value,
    });
    this.calc(value);
  };

  back = () => {
    const {
      history,
      location: {
        state: { username, isAdmin, token },
      },
    } = this.props;

    history.push('/', {
      username,
      isAdmin,
      token,
    });
  };

  // Calculates the total paid and number of months to
  // pay off a card, based on paymentAmount.
  calc(paymentAmount) {
    // const { interest_rate, balance } = this.props.location.state.card;
    const {
      location: {
        state: {
          card: { interest_rate, balance },
        },
      },
    } = this.props;
    let monthlyPayment = paymentAmount || balance * 0.023;
    monthlyPayment = monthlyPayment < 25 ? 25 : monthlyPayment;
    const monthlyIntRate = (interest_rate / 365) * 30;
    let months = 0;
    let totalPaid = 0;
    let totalInterest = 0;
    let newBalance = balance;
    let x = 0;
    do {
      const interest = (monthlyIntRate * newBalance) / 100;
      totalInterest += interest;
      const paid = monthlyPayment - interest;
      totalPaid = totalPaid + interest + paid;
      x += paid;
      newBalance -= paid;
      months += 1;
      if (paid * months > balance) {
        totalPaid = totalPaid - (totalPaid - balance) + totalInterest;
      }

      // TODO: uncomment 2 lines below for updating minimum monthly payment
      // monthlyPayment = newBalance * .023;
      // monthlyPayment = (monthlyPayment < 25 ? 25 : monthlyPayment);
    } while (x <= balance);

    this.setState({
      months,
      total: totalPaid,
      paymentAmount: monthlyPayment,
    });
    if (!paymentAmount) {
      this.setState({
        singlePaymentMax: balance + (balance * monthlyIntRate) / 100 + 1,
        minimum: monthlyPayment,
        monthsSave: months,
        totalSave: totalPaid,
      });
    }
  }

  render() {
    const { classes } = this.props;
    const {
      location: {
        state: {
          card: { limit, balance, interest_rate },
        },
      },
    } = this.props;
    const {
      minimum,
      singlePaymentMax,
      monthsSave,
      totalSave,
      total,
      months,
      paymentAmount,
    } = this.state;

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
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              Pay Off Details
            </Typography>
            <Button color="inherit" onClick={() => this.back()}>
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
              onChange={this.log}
              handle={this.handleSlide}
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
  }
}

export default withStyles(PayOffDetailsStyles)(PayOffDetails);
