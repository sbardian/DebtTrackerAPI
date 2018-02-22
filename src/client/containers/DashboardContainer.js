import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { Button, SplitButton, MenuItem } from 'react-bootstrap';
import utils from '../utils/utils';
import CreditCards from '../components/CreditCards';
import PieChart from '../components/PieChart';
import Totals from '../components/Totals';
import {
  ButtonContainer,
  TitleContainer,
  titleStyle,
  logoutStyle,
} from '../styles';

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
      isAdmin: false,
      token: '',
    };
    this.handleCardUpdateState = this.handleCardToDeleteState.bind(this);
    this.handleCardToDeleteState = this.handleCardToDeleteState.bind(this);
    this.handleTotalUpdateState = this.handleTotalUpdateState.bind(this);
    this.logout = this.logout.bind(this);
  }

  // TODO: error after logout not going to login page. . .
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
      .then(cards => {
        this.setState({
          isLoading: false,
          creditCards: cards,
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

  /**
   * Logout from the app.
   *
   * @returns {*} none
   */
  // eslint-disable-next-line class-methods-use-this
  logout() {
    utils.userLogout(this.state.token).then(res => {
      if (res.status === 200) {
        browserHistory.push({
          pathname: '/login',
        });
      }
    });
  }

  /**
   * Updates credit cards array.
   *
   * @param {array} creditCards - array of credit cards.
   * @returns {*} none
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
   * @returns {*} none
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
   * @returns {*} none
   */
  handleTotalUpdateState(totals) {
    this.setState({
      totals,
    });
  }

  render() {
    const {
      username,
      isLoading,
      creditCards,
      cardToDelete,
      totals,
      isAdmin,
      token,
    } = this.state;
    return (
      <div>
        <div className="row" style={TitleContainer}>
          <h3 style={titleStyle}>{username} Credit Status:</h3>
          <Link onClick={this.logout} style={logoutStyle}>
            <Button>Logout</Button>
          </Link>
          <span style={logoutStyle}>
            {isAdmin ? (
              <SplitButton title="Admin" key={1} id={`dropdown-basic-${1}`}>
                <MenuItem eventKey="1">Action</MenuItem>
                <MenuItem eventKey="2">Another action</MenuItem>
                <MenuItem eventKey="3" active>
                  Active Item
                </MenuItem>
                <MenuItem divider />
                <MenuItem eventKey="4">Separated link</MenuItem>
              </SplitButton>
            ) : (
              ''
            )}
          </span>
        </div>
        <div className="container">
          <div className="row">
            <CreditCards
              isLoading={isLoading}
              user={username}
              creditCards={creditCards}
              cardToDelete={cardToDelete}
              onCardUpdateState={this.handleCardUpdateState}
              onCardToDeleteState={this.handleCardToDeleteState}
            />
            <PieChart cards={creditCards} username={username} token={token} />
          </div>
          <div className="row">
            <Totals
              creditCards={creditCards}
              totals={totals}
              onTotalUpdateState={this.handleTotalUpdateState}
              user={username}
            />
          </div>
        </div>
        <div className="row" style={ButtonContainer} />
      </div>
    );
  }
}

DashboardContainer.propTypes = {
  username: PropTypes.string,
  isAdmin: PropTypes.bool,
};

DashboardContainer.defaultProps = {
  username: '',
  isAdmin: false,
};
