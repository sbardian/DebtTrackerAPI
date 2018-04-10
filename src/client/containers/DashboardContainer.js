import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AlertContainer from 'react-alert';
import { Link, browserHistory } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import utils from '../utils/utils';
import CreditCards from '../components/CreditCards';
import PieChart from '../components/PieChart';
import Totals from '../components/Totals';
import alertOptions from '../utils/alertOptions';
import check from '../icons/check.png';
import error from '../icons/error.png';
import save from '../icons/save.png';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

class DashboardContainer extends Component {
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
      tab: 0,
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

  handleTabChange = (event, tab) => {
    this.setState({ tab });
  };

  handleCreditCardSelectAll = () => {
    const { selectAll, creditCards } = this.state;
    this.setState({
      selectAll: !selectAll,
      creditCards: creditCards.map(card => ({
        ...card,
        isSelected: !selectAll,
      })),
    });
  };

  handleCreditCardSelectSingle = selected => {
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

  handleCreditCardDelete = () => {
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

  handleCreditCardAdd = card => {
    const { username, creditCards } = this.state;
    const { name, limit, balance, interest_rate } = card;
    utils
      .addCreditCard(username, name, limit, balance, interest_rate)
      .then(res => {
        const temp = creditCards;
        const { _id, updated_at, __v } = res.data;
        temp.push({
          _id,
          username,
          name,
          limit: parseFloat(limit),
          balance: parseFloat(balance),
          interest_rate: parseFloat(interest_rate),
          updated_at,
          __v,
          isSelected: false,
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

  handleTotalAdd = () => {
    console.log('OnAddTotal clicked');
  };

  render() {
    const {
      isLoading,
      username,
      isAdmin,
      token,
      creditCards,
      totals,
      tab,
    } = this.state;

    const { classes } = this.props;

    return isLoading === true ? (
      <p>Loading!!!</p>
    ) : (
      <div>
        <Paper className={classes.root}>
          <Tabs
            value={tab}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Credit Cards" />
            <Tab label="Chart" />
            <Tab label="Totals" />
          </Tabs>
        </Paper>
        {tab === 0 && (
          <CreditCards
            creditCards={creditCards}
            onSelectAll={this.handleCreditCardSelectAll}
            onSelect={this.handleCreditCardSelectSingle}
            onDelete={this.handleCreditCardDelete}
            onAdd={this.handleCreditCardAdd}
          />
        )}
        {tab === 1 && (
          <div className="row" style={{ paddingTop: '20px' }}>
            <PieChart cards={creditCards} username={username} token={token} />
          </div>
        )}
        {tab === 2 && (
          <Totals onAddTotal={this.handleTotalAdd} totals={totals} />
        )}
        <AlertContainer ref={a => (this.msg = a)} {...alertOptions} />
      </div>
    );
  }
}

export default withStyles(styles)(DashboardContainer);
