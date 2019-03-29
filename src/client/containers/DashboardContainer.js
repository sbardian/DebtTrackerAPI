import React, { Suspense, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles, withTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Tabs, Tab } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import orderBy from 'lodash/orderBy';
import utils from '../utils/utils';
import Loading from '../components/Loading';
import AddDialog from '../components/AddDialog';
import { UsernameContext } from '../components/UsernameContext';

const CreditCards = React.lazy(() => import('../components/CreditCards'));
const PieChart = React.lazy(() => import('../components/PieChart'));
const Totals = React.lazy(() => import('../components/Totals'));
const AdminDashboard = React.lazy(() => import('./AdminDashboard'));

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  loading: {
    textAlign: 'center',
    fontSize: '48pt',
  },
  appBarMain: {
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

const DialogTransition = props => <Slide direction="up" {...props} />;

const DashboardContainer = ({ classes, history, showAlert }) => {
  const [state, setState] = useState({
    isLoading: true,
    creditCards: [],
    selectAllCreditCards: false,
    selectAllTotals: false,
    totals: [],
    totalDebt: 0,
    totalAvailable: 0,
    tab: 0,
    dialogOpen: false,
    cardToEdit: {},
    onSave: () => {},
    dialogTitle: '',
    selectedCards: [],
    selectedTotals: [],
    isAdmin: false,
  });
  const { username } = useContext(UsernameContext);

  const [creditCardSortColumn, setCreditCardSortColumn] = useState('name');
  const [creditCardSort, setCreditCardSort] = useState('asc');
  const [totalSortColumn, setTotalSortColumn] = useState('name');
  const [totalSort, setTotalSort] = useState('asc');

  useEffect(() => {
    utils
      .getCreditCards(creditCardSortColumn, creditCardSort)
      .then(data => {
        const { creditCards, isAdmin } = data;
        setState(prevState => ({
          ...prevState,
          isAdmin,
          isLoading: false,
          creditCards: creditCards.map(card => ({
            ...card,
            isSelected: false,
          })),
        }));
      })
      .catch(() => {
        history.push('/login');
      });
  }, [state.tab]);

  useEffect(() => {
    utils
      .getTotals('updated_at', 'desc')
      .then(data => {
        const { message: totals, isAdmin } = data;
        setState(prevState => ({
          ...prevState,
          isAdmin,
          isLoading: false,
          totals: totals.map(total => ({
            ...total,
            isSelected: false,
          })),
        }));
      })
      .catch(() => {
        history.push('/login');
      });
  }, [state.tab]);

  const handleTabChange = (event, tab) => {
    setState(prevState => ({ ...prevState, tab }));
  };

  const handleCreditCardSort = (column, sort) => {
    const { creditCards } = state;
    setCreditCardSort(sort);
    setCreditCardSortColumn(column);
    setState(prevState => ({
      ...prevState,
      creditCards: orderBy(creditCards, [column], [sort]),
    }));
  };

  const handleTotalsSort = (column, sort) => {
    const { totals } = state;
    setTotalSort(sort);
    setTotalSortColumn(column);
    setState(prevState => ({
      ...prevState,
      totals: orderBy(totals, [column], [sort]),
    }));
  };

  const handleCreditCardSelectAll = () => {
    const { creditCards, selectAllCreditCards } = state;
    setState(prevState => ({
      ...prevState,
      selectAllCreditCards: !selectAllCreditCards,
      selectedCards: !selectAllCreditCards ? creditCards : [],
      creditCards: creditCards.map(card => ({
        ...card,
        isSelected: !selectAllCreditCards,
      })),
    }));
  };

  const handleCreditCardSelectSingle = selected => {
    const { creditCards, selectedCards } = state;
    setState(prevState => ({
      ...prevState,
      creditCards: creditCards.map(card => {
        if (card._id === selected._id) {
          return { ...card, isSelected: !card.isSelected };
        }
        return card;
      }),
      selectedCards: selected.isSelected
        ? selectedCards.filter(card => card._id !== selected._id)
        : [...selectedCards, selected],
    }));
  };

  const handleCreditCardDelete = () => {
    const { creditCards, selectedCards } = state;

    selectedCards.forEach(card => {
      utils
        .deleteCreditCards(card._id)
        .then(data => {
          const index = creditCards.findIndex(x => x._id === card._id);
          creditCards.splice(index, 1);
          setState(prevState => ({
            ...prevState,
            creditCards,
          }));
          showAlert({
            message: data.message,
            theme: 'dark',
            offset: '50px',
            position: 'top right',
            duration: 5000,
            style: { zIndex: 2000 },
          });
        })
        .catch(error => {
          showAlert({
            message: error.message,
            theme: 'light',
            offset: '50px',
            position: 'top right',
            duration: 5000,
            progressBarColor: 'white',
            style: { zIndex: 2000, color: 'white', backgroundColor: 'red' },
          });
        });
      setState(prevState => ({
        ...prevState,
        selectedCards: [],
      }));
      return null;
    });
  };

  const handleNewCreditCardSave = ({ name, limit, balance, interest_rate }) => {
    const { creditCards } = state;

    utils
      .addCreditCard(username, name, limit, balance, interest_rate)
      .then(data => {
        const {
          message,
          creditCard: { _id, updated_at, __v },
        } = data;

        const temp = creditCards;
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
        setState(prevState => ({
          ...prevState,
          creditCards: temp,
        }));
        showAlert({
          message,
          theme: 'dark',
          offset: '50px',
          position: 'top right',
          duration: 5000,
          style: { zIndex: 2000 },
        });
      })
      .catch(error => {
        showAlert({
          message: error.message,
          theme: 'light',
          offset: '50px',
          position: 'top right',
          duration: 5000,
          progressBarColor: 'white',
          style: { zIndex: 2000, color: 'white', backgroundColor: 'red' },
        });
      });
  };

  const handleDialogClickOpen = () => {
    setState(prevState => ({ ...prevState, dialogOpen: true }));
  };

  const handleDialogClose = () => {
    setState(prevState => ({ ...prevState, dialogOpen: false }));
  };

  const handleCreditCardAddNewClicked = () => {
    setState(prevState => ({
      ...prevState,
      cardToEdit: {},
      onSave: handleNewCreditCardSave,
      dialogTitle: 'Add Credit Card',
    }));
    handleDialogClickOpen();
  };

  const handleEditCreditCardSave = ({
    _id,
    name,
    limit,
    balance,
    interest_rate,
  }) => {
    const { creditCards } = state;
    utils
      .saveCreditCard(
        _id,
        name,
        parseFloat(limit),
        parseFloat(balance),
        parseFloat(interest_rate),
      )
      .then(data => {
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
        setState(prevState => ({
          ...prevState,
          creditCards: temp,
        }));
        showAlert({
          message: data.message,
          theme: 'dark',
          offset: '50px',
          position: 'top right',
          duration: 5000,
          style: { zIndex: 2000 },
        });
      })
      .catch(error => {
        showAlert({
          message: error.message,
          theme: 'light',
          offset: '50px',
          position: 'top right',
          duration: 5000,
          progressBarColor: 'white',
          style: { zIndex: 2000, color: 'white', backgroundColor: 'red' },
        });
      });
  };

  const handleCreditCardEditClicked = () => {
    const { creditCards } = state;
    const [card] = creditCards.filter(c => (c.isSelected ? c : null));
    setState(prevState => ({
      ...prevState,
      cardToEdit: card,
      onSave: handleEditCreditCardSave,
      dialogTitle: 'Edit Credit Card',
    }));
    handleDialogClickOpen();
  };

  const handleCreditCardDetails = () => {
    const { selectedCards } = state;
    const card = selectedCards[0];
    history.push(`/payoffdetails/${card._id}`, {
      username,
    });
  };

  const computeNewTotal = () => {
    const { creditCards, totalDebt } = state;
    let total = totalDebt;
    creditCards.forEach(card => {
      total += card.balance;
    });
    return total;
  };

  const handleTotalAdd = () => {
    const { totals } = state;

    const newTotal = computeNewTotal();
    utils
      .addNewTotal(username, newTotal)
      .then(data => {
        const {
          message,
          total: { _id, updated_at, userId, total, __v },
        } = data;
        setState(prevState => ({
          ...prevState,
          totals: [
            { userId, total, _id, updated_at, __v, isSelected: false },
            ...totals,
          ],
        }));
        showAlert({
          message,
          theme: 'dark',
          offset: '50px',
          position: 'top right',
          duration: 5000,
          style: { zIndex: 2000 },
        });
      })
      .catch(error => {
        showAlert({
          message: error.message,
          theme: 'light',
          offset: '50px',
          position: 'top right',
          duration: 5000,
          progressBarColor: 'white',
          style: { zIndex: 2000, color: 'white', backgroundColor: 'red' },
        });
      });
  };

  const handleTotalDelete = () => {
    const { totals, selectedTotals } = state;

    selectedTotals.forEach(total => {
      utils.deleteTotals(total._id).then(data => {
        const { message } = data;
        const index = totals.findIndex(x => x._id === total._id);
        totals.splice(index, 1);
        setState(prevState => ({
          ...prevState,
          totals,
        }));
        showAlert({
          message,
          theme: 'dark',
          offset: '50px',
          position: 'top right',
          duration: 5000,
          style: { zIndex: 2000 },
        });
      });
      setState(prevState => ({
        ...prevState,
        selectedTotals: [],
      }));
      return null;
    });
  };

  const handleTotalSelectAll = () => {
    const { totals, selectAllTotals } = state;
    setState(prevState => ({
      ...prevState,
      selectAllTotals: !selectAllTotals,
      selectedCards: !selectAllTotals ? totals : [],
      totals: totals.map(total => ({
        ...total,
        isSelected: !selectAllTotals,
      })),
    }));
  };

  const hanldeTotalSelectSingle = selected => {
    const { totals, selectedTotals } = state;
    setState(prevState => ({
      ...prevState,
      totals: totals.map(total => {
        if (total._id === selected._id) {
          return { ...total, isSelected: !total.isSelected };
        }
        return total;
      }),
      selectedTotals: selected.isSelected
        ? selectedTotals.filter(total => total._id !== selected._id)
        : [...selectedTotals, selected],
    }));
  };

  const handleRequired = () => {
    showAlert({
      message: 'All fields are required.',
      offset: '50px',
      position: 'top right',
      duration: 5000,
      progressBarColor: 'white',
      style: { zIndex: 2000, color: 'white', backgroundColor: 'red' },
    });
  };

  const handleLogout = () => {
    utils.userLogout().then(data => {
      if (!data.error) {
        history.push('/login');
      }
    });
  };

  const {
    isLoading,
    creditCards,
    totals,
    tab,
    onSave,
    cardToEdit,
    dialogTitle,
    dialogOpen,
    isAdmin,
  } = state;

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
              onClick={() => handleLogout()}
            >
              logout
            </Button>
          </Toolbar>
        </AppBar>
      </div>
      <AppBar color="primary" className={classes.appBar}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          className={classes.tabs}
          centered
        >
          <Tab data-testid="creditcards-tab-button" label="Credit Cards" />
          <Tab data-testid="chart-tab-button" label="Chart" />
          <Tab data-testid="totals-tab-button" label="Totals" />
          {isAdmin && <Tab data-testid="admin-tab-button" label="Admin" />}
        </Tabs>
      </AppBar>
      {tab === 0 && (
        <div>
          <Suspense fallback={<Loading />}>
            <CreditCards
              creditCards={creditCards}
              onSelectAll={handleCreditCardSelectAll}
              onSelect={handleCreditCardSelectSingle}
              onDelete={handleCreditCardDelete}
              onAdd={handleCreditCardAddNewClicked}
              onEdit={handleCreditCardEditClicked}
              onDetails={handleCreditCardDetails}
              onSort={handleCreditCardSort}
              sort={creditCardSort}
              creditCardSortColumn={creditCardSortColumn}
            />
          </Suspense>
          <AddDialog
            onOpen={handleDialogClickOpen}
            onClose={handleDialogClose}
            onTransition={DialogTransition}
            dialogOpen={dialogOpen}
            onSave={onSave}
            onRequired={handleRequired}
            cardToEdit={cardToEdit}
            title={dialogTitle}
            username={username}
          />
        </div>
      )}
      {tab === 1 && (
        <div className={classes.chart}>
          <Suspense fallback={<Loading />}>
            <PieChart cards={creditCards} username={username} />
          </Suspense>
        </div>
      )}
      {tab === 2 && (
        <Suspense fallback={<Loading />}>
          <Totals
            totals={totals}
            onAddTotal={handleTotalAdd}
            onDeleteTotal={handleTotalDelete}
            onSelect={hanldeTotalSelectSingle}
            onSelectAll={handleTotalSelectAll}
            onSort={handleTotalsSort}
            sort={totalSort}
            totalSortColumn={totalSortColumn}
          />
        </Suspense>
      )}
      {tab === 3 && (
        <Suspense fallback={<Loading />}>
          <AdminDashboard showAlert={showAlert} />
        </Suspense>
      )}
    </div>
  );
};

DashboardContainer.defaultProps = {
  location: [],
};

DashboardContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  classes: PropTypes.shape().isRequired,
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
  showAlert: PropTypes.func.isRequired,
};

export default withTheme()(withRouter(withStyles(styles)(DashboardContainer)));
