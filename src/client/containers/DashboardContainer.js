import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import utils from '../utils/utils';
import CreditCards from '../components/CreditCards';
import PieChart from '../components/PieChart';
import Totals from '../components/Totals';
import { ButtonContainer, TitleContainer } from '../styles';

export default class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      creditCards: [],
      cardToDelete: null,
      totals: [],
      loggedIn: false,
      username: '',
    };
    this.handleCardUpdateState = this.handleCardToDeleteState.bind(this);
    this.handleCardToDeleteState = this.handleCardToDeleteState.bind(this);
    this.handleTotalUpdateState = this.handleTotalUpdateState.bind(this);
  }

  componentDidMount() {
    utils.getCreditCards()
      .then((cards) => {
        this.setState({
          isLoading: false,
          username: 'Brian',
          creditCards: cards,
        });
      })
      .catch(err => {
        console.log('Bad request, err = ', err);
        browserHistory.push({
          pathname: '/login',
        });
      });
    utils.getTotals()
      .then((totals) => {
        this.setState({
          totals: totals,
        });
      });
  }

  /**
   *
   *
   */
  failboat() {

  }

  /**
   * Updates credit cards array.
   *
   * @param {array} creditCards - array of credit cards.
   */
  handleCardUpdateState(creditCards) {
    this.setState({
      creditCards,
    });
  }

  /**
   * Sets state of card to delete.
   *
   * @param {string} id - id of card to delete.
   * @param {string} name - name of card to delete.
   */
  handleCardToDeleteState(id, name) {
    this.setState({
      cardToDelete: {
        id,
        name,
      },
    });
  }

  /**
   * Updates totals array.
   *
   * @param {array} totals - array of totals.
   */
  handleTotalUpdateState(totals) {
    this.setState({
      totals,
    });
  }

  render() {
    const { user } = this.state.username;
    const { isLoading, creditCards, cardToDelete, totals } = this.state;
    return (
      <div>
        <div className="row" style={TitleContainer}>
          <h3>{user} Credit Status:</h3>
        </div>
        <div className="container">
          <div className="row">
            <CreditCards
              isLoading={isLoading}
              user={user}
              creditCards={creditCards}
              cardToDelete={cardToDelete}
              onCardUpdateState={this.handleCardUpdateState}
              onCardToDeleteState={this.handleCardToDeleteState}
            />
            <PieChart
              cards={creditCards}
            />
          </div>
          <div className="row">
            <Totals
              creditCards={creditCards}
              totals={totals}
              onTotalUpdateState={this.handleTotalUpdateState}
              user={user}
            />
          </div>
        </div>
        <div className="row" style={ButtonContainer} />
      </div>
    );
  }
}

DashboardContainer.propTypes = {
    user: PropTypes.string,
};

DashboardContainer.defaultProps = {
  user: '',
};
