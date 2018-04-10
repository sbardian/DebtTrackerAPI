import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AlertContainer from 'react-alert';
import { Link, browserHistory } from 'react-router';
import utils from '../utils/utils';
import CreditCards from '../components/CreditCards';
import PieChart from '../components/PieChart';
import Totals from '../components/Totals';
import alertOptions from '../utils/alertOptions';
import check from '../icons/check.png';
import error from '../icons/error.png';
import save from '../icons/save.png';

export default class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      username: '',
      isAdmin: false,
      token: '',
      creditCards: [],
      selectAll: false,
      totals: [],
    };
  }

  componentDidMount() {
    if (
      !(
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.username &&
        this.props.location.state.token
      )
    ) {
      browserHistory.push('/login');
      return;
    }
    const { token, username, isAdmin } = this.props.location.state;
    utils
      .getCreditCards(token)
      .then(creditCards => {
        this.setState({
          isLoading: false,
          creditCards: creditCards.map(card => ({
            ...card,
            isSelected: false,
          })),
          username,
          isAdmin,
          token,
        });
      })
      .catch(() => {
        browserHistory.push('/login');
      });
    utils.getTotals(token).then(totals => {
      this.setState({
        totals,
      });
    });
  }

  handleSelectAll = () => {
    const { selectAll, creditCards } = this.state;
    this.setState({
      selectAll: !selectAll,
      creditCards: creditCards.map(card => ({
        ...card,
        isSelected: !selectAll,
      })),
    });
  };

  handleSelectSingle = selected => {
    const { creditCards } = this.state;
    this.setState({
      creditCards: creditCards.map(card => {
        if (card._id === selected._id) {
          return { ...card, isSelected: !card.isSelected };
        }
        return card;
      }),
    });
  };

  handleDelete = () => {
    const { creditCards } = this.state;
    creditCards.forEach(card => {
      if (card.isSelected) {
        utils.deleteCreditCards(card._id).then(response => {
          if (response.error) {
            this.msg.show(response.message, {
              time: 5000,
              type: 'error',
              icon: <img src={error} alt="Error deleting card." />,
            });
          } else {
            const index = creditCards.findIndex(x => x._id === card._id);
            creditCards.splice(index, 1);
            this.setState({
              creditCards,
            });
            this.msg.show(response.message, {
              time: 5000,
              type: 'success',
              icon: <img src={check} alt="Card deleted." />,
            });
          }
        });
      }
      return null;
    });
  };

  handleAdd = card => {
    const { username, creditCards } = this.state;
    const { name, limit, balance, interest_rate } = card;
    utils
      .addCreditCard(username, name, limit, balance, interest_rate)
      .then(res => {
        const temp = creditCards;
        const { _id, update_at, __v } = res.data;
        temp.push({
          _id,
          username,
          name,
          limit: parseFloat(limit),
          balance: parseFloat(balance),
          interest_rate: parseFloat(interest_rate),
          update_at,
          __v,
        });
        this.setState({
          creditCards: temp,
        });
        this.msg.show('Card added.', {
          time: 5000,
          type: 'success',
          icon: <img src={save} alt="Card added." />,
        });
      });
  };

  render() {
    const { isLoading, username, isAdmin, token, creditCards, totals } = this.state;

    return isLoading === true ? (
      <p>Loading!!!</p>
    ) : (
      <div>
        <div style={{ margin: '200px', marginTop: '100px' }}>
          <div>{username}</div>
          <div className="row">
            <CreditCards
              creditCards={creditCards}
              onSelectAll={this.handleSelectAll}
              onSelect={this.handleSelectSingle}
              onDelete={this.handleDelete}
              onAdd={this.handleAdd}
            />
          </div>
          <div className="row" style={{ paddingTop: '20px' }}>
            <PieChart cards={creditCards} username={username} token={token} />
          </div>
          <div>
            <Totals totals={totals} />
          </div>
        </div>
        <AlertContainer ref={a => (this.msg = a)} {...alertOptions} />
      </div>
    );
  }
}
