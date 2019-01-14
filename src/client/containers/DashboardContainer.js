import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles, withTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Tabs, Tab } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import { withAlert } from 'react-alert';
import utils from '../utils/utils';
import CreditCards from '../components/CreditCards';
import Loading from '../components/Loading';
import AddDialog from '../components/AddDialog';

const PieChart = React.lazy(() => import('../components/PieChart'));
const Totals = React.lazy(() => import('../components/Totals'));

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  loading: {
    textAlign: 'center',
    fontSize: '48pt',
  },
  appBarMain: {
    // background: '#4ba3c7',
    background: theme.palette.primary.dark,
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  appBar: {
    position: 'relative',
  },
  tabs: {
    color: '#666',
  },
  chart: {
    background: '#fff',
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
      totalDebt: 0,
      totalAvailable: 0,
      tab: 0,
      dialogOpen: false,
      cardToEdit: {},
      onSave: () => {},
      dialogTitle: '',
      selectedCards: [],
    };
  }

  componentDidMount() {
    document.body.style.overflowY = 'auto';
    const { history } = this.props;
    if (
      !(
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.username &&
        this.props.location.state.token
      )
    ) {
      history.push('/login');
      return;
    }
    const {
      location: {
        state: { token, username, isAdmin },
      },
    } = this.props;
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
        history.push('/login');
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
    const { creditCards, selectAll } = this.state;
    this.setState({
      selectAll: !selectAll,
      selectedCards: !selectAll ? creditCards : [],
      creditCards: creditCards.map(card => ({
        ...card,
        isSelected: !selectAll,
      })),
    });
  };

  handleCreditCardSelectSingle = selected => {
    const { creditCards, selectedCards } = this.state;
    this.setState({
      creditCards: creditCards.map(card => {
        if (card._id === selected._id) {
          return { ...card, isSelected: !card.isSelected };
        }
        return card;
      }),
      selectedCards: selected.isSelected
        ? selectedCards.filter(card => card._id !== selected._id)
        : [...selectedCards, selected],
    });
  };

  handleCreditCardDelete = () => {
    const { creditCards, selectedCards } = this.state;
    const { alert } = this.props;

    selectedCards.forEach(card => {
      utils.deleteCreditCards(card._id).then(response => {
        if (response.error) {
          alert.show(response.message, {
            type: 'error',
          });
        } else {
          const index = creditCards.findIndex(x => x._id === card._id);
          creditCards.splice(index, 1);
          this.setState({
            creditCards,
          });
          alert.show(response.message, {
            type: 'success',
          });
        }
      });
      this.setState({
        selectedCards: [],
      });
      return null;
    });
  };

  handleCreditCardAdd = () => {
    this.setState({
      cardToEdit: {},
      onSave: this.handleCreditCardAddSave,
      dialogTitle: 'Add Credit Card',
    });
    this.handleDialogClickOpen();
  };

  handleCreditCardAddSave = ({ name, limit, balance, interest_rate }) => {
    const { username, creditCards } = this.state;
    const { alert } = this.props;

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
        alert.show('Card added.', {
          type: 'success',
        });
      });
  };

  handleCreditCardEdit = () => {
    const { creditCards } = this.state;
    const [card] = creditCards.filter(c => {
      if (c.isSelected) return c;
    });
    this.setState({
      cardToEdit: card,
      onSave: this.handleCreditCardEditSave,
      dialogTitle: 'Edit Credit Card',
    });
    this.handleDialogClickOpen();
  };

  handleCreditCardEditSave = ({ _id, name, limit, balance, interest_rate }) => {
    const { creditCards } = this.state;
    const { alert } = this.props;
    // TODO: validate credit card data
    utils
      .saveCreditCard(
        _id,
        name,
        parseFloat(limit),
        parseFloat(balance),
        parseFloat(interest_rate),
      )
      .then(response => {
        if (response.error) {
          alert.show(response.message, {
            type: 'error',
          });
        } else {
          const temp = creditCards;
          const index = temp.findIndex(x => x._id === _id);
          temp[index] = {
            __v: 0,
            _id,
            isSelected: false,
            name,
            limit: parseFloat(limit),
            balance: parseFloat(balance),
            interest_rate: parseFloat(interest_rate),
          };
          this.setState({
            creditCards: temp,
          });
          alert.show(response.message, {
            type: 'success',
          });
        }
      });
  };

  handleOnDetails = () => {
    const { selectedCards, username, token } = this.state;
    const { history } = this.props;
    const card = selectedCards[0];
    history.push(`/payoffdetails/${card.name}`, {
      card,
      username,
      token,
    });
  };

  handleTotalAdd = () => {
    const { username, totals } = this.state;
    const { alert } = this.props;

    const newTotal = this.computeNewTotal();
    utils.addNewTotal(username, newTotal).then(res => {
      const temp = totals;
      const { _id, updated_at } = res;
      temp.push({
        user: username,
        total: newTotal,
        _id,
        updated_at,
      });
      this.setState({
        totals: temp,
      });
      alert.show('Total saved.', {
        type: 'success',
      });
    });
  };

  handleRequired = () => {
    const { alert } = this.props;

    alert.show('All fields are required.', {
      type: 'error',
    });
  };

  handleDialogClickOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  DialogTransition = props => <Slide direction="up" {...props} />;

  // Logout from the app.
  logout = () => {
    const { token } = this.state;
    const { history } = this.props;
    utils.userLogout(token).then(res => {
      if (res.status === 200) {
        history.push('/login');
      }
    });
  };

  computeDebt() {
    const { creditCards, totalDebt } = this.state;
    let total = totalDebt;
    creditCards.forEach(card => {
      total += card.balance;
    });
    return utils.createDollar(total);
  }

  computeAvailable() {
    const { creditCards, totalAvailable } = this.state;
    let total = totalAvailable;
    creditCards.forEach(card => {
      total += card.limit;
    });
    return utils.createDollar(total);
  }

  computeNewTotal() {
    const { creditCards, totalDebt } = this.state;
    let total = totalDebt;
    creditCards.forEach(card => {
      total += card.balance;
    });
    return total;
  }

  render() {
    const {
      isLoading,
      username,
      isAdmin,
      token,
      creditCards,
      totals,
      tab,
      onSave,
      cardToEdit,
      dialogTitle,
      dialogOpen,
    } = this.state;

    const { classes } = this.props;

    return isLoading ? (
      <p className={classes.loading}>Loading...</p>
    ) : (
      <div>
        <div>
          <AppBar className={classes.appBarMain}>
            <Toolbar>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                {username.toUpperCase()}
              </Typography>
              <Button
                color="inherit"
                data-testid="logout-button"
                onClick={() => this.logout()}
              >
                logout
              </Button>
            </Toolbar>
          </AppBar>
        </div>
        <AppBar color="primary" className={classes.appBar}>
          <Tabs
            value={tab}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            className={classes.tabs}
            centered
          >
            <Tab data-testid="creditcards-tab-button" label="Credit Cards" />
            <Tab data-testid="chart-tab-button" label="Chart" />
            <Tab data-testid="totals-tab-button" label="Totals" />
          </Tabs>
        </AppBar>
        {tab === 0 && (
          <div>
            <CreditCards
              creditCards={creditCards}
              onSelectAll={this.handleCreditCardSelectAll}
              onSelect={this.handleCreditCardSelectSingle}
              onDelete={this.handleCreditCardDelete}
              onAdd={this.handleCreditCardAdd}
              onEdit={this.handleCreditCardEdit}
              onDetails={this.handleOnDetails}
            />
            <AddDialog
              onOpen={this.handleDialogClickOpen}
              onClose={this.handleDialogClose}
              onTransition={this.DialogTransition}
              dialogOpen={dialogOpen}
              onSave={onSave}
              onRequired={this.handleRequired}
              cardToEdit={cardToEdit}
              title={dialogTitle}
              username={username}
              isAdmin={isAdmin}
              token={token}
            />
          </div>
        )}
        {tab === 1 && (
          <div className={classes.chart}>
            <Suspense fallback={<Loading />}>
              <PieChart cards={creditCards} username={username} token={token} />
            </Suspense>
          </div>
        )}
        {tab === 2 && (
          <Suspense fallback={<Loading />}>
            <Totals onAddTotal={this.handleTotalAdd} totals={totals} />
          </Suspense>
        )}
      </div>
    );
  }
}

DashboardContainer.propTypes = {
  classes: PropTypes.shape().isRequired,
};

export default withTheme()(
  withRouter(withStyles(styles)(withAlert(DashboardContainer))),
);
