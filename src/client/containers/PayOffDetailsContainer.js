import { Link } from 'react-router-dom';
import 'rc-slider/assets/index.css';
import React from 'react';
import Slider, { Handle } from 'rc-slider';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import { listStyle, wrapperStyle } from '../styles';
import utils from '../utils/utils';

export default class PayOffDetailsContainer extends React.Component {
  // Called when slider is moved.
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

  constructor(props) {
    super(props);
    this.state = {
      minimum: null,
      months: null,
      monthsSave: null,
      total: null,
      totalSave: null,
      singlePaymentMax: 0,
      paymentAmount: 0,
    };
    this.log = this.log.bind(this);
    this.calc = this.calc.bind(this);
  }

  componentWillMount() {
    this.calc();
  }

  // Calculates the total paid and number of months to
  // pay off a card, based on paymentAmount.
  calc(paymentAmount) {
    const {
      location: {
        state: { card },
      },
    } = this.props;
    const { interest_rate: intRate, balance } = card[0];
    let monthlyPayment = paymentAmount || balance * 0.023;
    monthlyPayment = monthlyPayment < 25 ? 25 : monthlyPayment;
    const monthlyIntRate = (intRate / 365) * 30;
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

  // Logs the payment amount for updating component.
  log(value) {
    this.setState({
      paymentAmount: value,
    });
    this.calc(value);
  }

  render() {
    const marks = {};
    const {
      location: {
        state: { card },
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
    const { name, limit, balance, interest_rate } = card[0];
    const {
      location: {
        state: { username, token },
      },
    } = this.props;

    marks[`${Math.trunc(minimum)}`] = (
      <string>${utils.createDollar(Math.trunc(minimum))}</string>
    );
    marks[`${Math.trunc(singlePaymentMax)}`] = (
      <string>${utils.createDollar(Math.trunc(singlePaymentMax))}</string>
    );

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2>{name}</h2>
            <ul style={listStyle}>
              <li>
                <strong>Limit: </strong>${utils.createDollar(limit)}
              </li>
              <li>
                <strong>Balance: </strong>${utils.createDollar(balance)}
              </li>
              <li>
                <strong>Interest Rate: </strong>
                {interest_rate}%
              </li>
              <li>
                <strong>Minimum Payment: </strong>${utils.createDollar(minimum)}
              </li>
              <li>
                <strong>Months to Payoff: </strong>
                {monthsSave}
              </li>
              <li>
                <strong>Total Paid: </strong>${utils.createDollar(totalSave)}
              </li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            Adjust payment:
            <h1>${utils.createDollar(paymentAmount)}</h1>
            <div style={wrapperStyle}>
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
          <div className="col-md-2">
            Months: <h1>{months}</h1>
          </div>
          <div className="col-md-2">
            Total Paid: <h1>${utils.createDollar(total)}</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Link to={{ pathname: '/', state: { username, token } }}>
              <button type="button" className="btn btn-lg">
                Back
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

PayOffDetailsContainer.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      card: PropTypes.arrayOf(PropTypes.object),
      user: PropTypes.string,
      name: PropTypes.string,
      limit: PropTypes.number,
      balance: PropTypes.number,
      interest_rate: PropTypes.number,
    }),
  }),
};

PayOffDetailsContainer.defaultProps = {
  location: [],
};
