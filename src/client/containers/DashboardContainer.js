import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AlertContainer from 'react-alert';
import { browserHistory } from 'react-router';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Tabs, { Tab } from 'material-ui/Tabs';
import Slide from 'material-ui/transitions/Slide';
import utils from '../utils/utils';
import CreditCards from '../components/CreditCards';
import PieChart from '../components/PieChart';
import Totals from '../components/Totals';
import AddDialog from '../components/AddDialog';
import alertOptions from '../utils/alertOptions';
import check from '../icons/check.png';
import error from '../icons/error.png';
import save from '../icons/save.png';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  appBarMain: {
    background: '#4ba3c7',
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
    console.log('this.props = ', this.props);
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
    selectedCards.forEach(card => {
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

  handleCreditCardEdit = () => {
    const { selectedCards } = this.state;
    const card = selectedCards[0];
    this.setState({
      cardToEdit: card,
      onSave: this.handleCreditCardEditSave,
      dialogTitle: 'Edit Credit Card',
    });
    this.handleDialogClickOpen();
  };

  handleCreditCardEditSave = ({ _id, name, limit, balance, interest_rate }) => {
    const { creditCards } = this.state;
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
          this.msg.show(response.message, {
            time: 5000,
            type: 'error',
            icon: <img src={error} alt="Error updating card." />,
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
          this.msg.show(response.message, {
            time: 5000,
            type: 'success',
            icon: <img src={save} alt="Card updated." />,
          });
        }
      });
  };

  handleOnDetails = () => {
    const { selectedCards } = this.state;
    const card = selectedCards[0];
    browserHistory.push({
      pathname: `/payoffdetails/${card.name}`,
      state: {
        card,
        username: this.state.username,
        token: this.state.token,
      },
    });
  };

  computeDebt() {
    let total = this.state.totalDebt;
    this.state.creditCards.forEach(card => {
      total += card.balance;
    });
    return utils.createDollar(total);
  }

  computeAvailable() {
    let total = this.state.totalAvailable;
    this.state.creditCards.forEach(card => {
      total += card.limit;
    });
    return utils.createDollar(total);
  }

  computeNewTotal() {
    let total = this.state.totalDebt;
    this.state.creditCards.forEach(card => {
      total += card.balance;
    });
    return total;
  }

  handleTotalAdd = () => {
    const newTotal = this.computeNewTotal();
    utils.addNewTotal(this.state.username, newTotal).then(res => {
      const temp = this.state.totals;
      const { _id, updated_at } = res;
      temp.push({
        user: this.state.username,
        total: newTotal,
        _id,
        updated_at,
      });
      this.setState({
        totals: temp,
      });
      this.msg.show('Total saved.', {
        time: 5000,
        type: 'success',
        icon: <img src={save} alt="Total saved." />,
      });
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
  // eslint-disable-next-line class-methods-use-this
  logout =() => {
    utils.userLogout(this.state.token).then(res => {
      if (res.status === 200) {
        browserHistory.push({
          pathname: '/login',
        });
      }
    });
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
    } = this.state;

    const { classes } = this.props;

    return isLoading === true ? (
      <p>Loading!!!</p>
    ) : (
      <div>
        <div> 
          <AppBar className={classes.appBarMain}>
            <Toolbar>
              <Typography
                variant="title"
                color="inherit"
                className={classes.flex}
              >
                {username}
              </Typography>
              <Button color="inherit" onClick={() => this.logout()}>
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
            <Tab label="Credit Cards" />
            <Tab label="Chart" />
            <Tab label="Totals" />
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
              dialogOpen={this.state.dialogOpen}
              onSave={onSave}
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
