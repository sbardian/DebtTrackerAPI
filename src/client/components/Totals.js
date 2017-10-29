import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import AlertContainer from 'react-alert';
import TotalsTable from './TotalsTable';
import utils from '../utils/utils';
import alertOptions from '../utils/alertOptions';
import save from '../icons/save.png';
import { TotalsContainer } from '../styles/index';

export default class Totals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalAvailable: 0,
      totalDebt: 0
    };
    this.saveNewTotal = this.saveNewTotal.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({
      totalAvailable: 0,
      totalDebt: 0
    });
  }

  /**
   * Computes the total debt.
   *
   * @returns {string} dollar amount
   */
  computeDebt() {
    let total = this.state.totalDebt;
    this.props.creditCards.map(card => {
      total += card.balance;
    });
    return utils.createDollar(total);
  }

  /**
   * Computes the available credit.
   *
   * @returns {string} dollar amount
   */
  computeAvailable() {
    let total = this.state.totalAvailable;
    this.props.creditCards.map(card => {
      total += card.limit;
    });
    return utils.createDollar(total);
  }

  /**
   * Computes new total debt.
   *
   * @returns {number} total
   */
  computeNewTotal() {
    let total = this.state.totalDebt;
    this.props.creditCards.map(card => {
      total += card.balance;
    });
    return total;
  }

  // TODO: remove self and use this.
  /**
   * Saves a new total debt.
   *
   * @returns {null} none
   */
  saveNewTotal() {
    const self = this;
    const newTotal = self.computeNewTotal();
    utils.addNewTotal(self.props.user, newTotal).then(() => {
      const temp = self.props.totals;
      temp.push({
        user: self.props.user,
        total: newTotal
      });
      self.props.onTotalUpdateState(temp);
      this.msg.show('Total saved.', {
        time: 5000,
        type: 'success',
        icon: <img src={save} alt="Total saved." />
      });
    });
  }

  // TODO: rewrite without calling functions in rendor. Do these calculations and calls while setting state
  render() {
    return (
      <div style={TotalsContainer}>
        <div className="row">
          <div className="col-md-4">
            <h4>Total Available Credit</h4>
            ${this.computeAvailable()}
          </div>
          <div className="col-md-4">
            <h4>Total Debt</h4>
            ${this.computeDebt()}
          </div>
          <div className="col-md-4">
            <h4>Save current total</h4>
            <Button bsSize="lg" onClick={this.saveNewTotal}>
              Save
            </Button>
          </div>
        </div>
        <div className="row">
          <TotalsTable
            totals={this.props.totals}
            onTotalUpdateState={this.props.onTotalUpdateState}
          />
        </div>
        <AlertContainer ref={a => (this.msg = a)} {...alertOptions} />
      </div>
    );
  }
}

Totals.propTypes = {
  creditCards: PropTypes.arrayOf(PropTypes.object).isRequired,
  onTotalUpdateState: PropTypes.func.isRequired
};

Totals.defaultProps = {
  totals: [],
  creditCards: [],
  onTotalUpdateState: () => {}
};
