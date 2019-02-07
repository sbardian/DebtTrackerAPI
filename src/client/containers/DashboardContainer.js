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
import utils from '../utils/utils';
import Loading from '../components/Loading';
import AddDialog from '../components/AddDialog';
import { UsernameContext } from '../components/UsernameContext';

const CreditCards = React.lazy(() => import('../components/CreditCards'));
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

const DashboardContainer = ({
  classes,
  history,
  location: { state: { isAdmin } = {} } = {},
  showAlert,
}) => {
  const [state, setState] = useState({
    isLoading: true,
    isAdmin: false,
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
  });
  const { username } = useContext(UsernameContext);

  document.body.style.overflowY = 'auto';

  useEffect(() => {
    utils
      .getCreditCards()
      .then(response => {
        if (response.status === 200) {
          response.json().then(data => {
            const { message: creditCards } = data;
            setState(prevState => ({
              ...prevState,
              isLoading: false,
              creditCards: creditCards.map(card => ({
                ...card,
                isSelected: false,
              })),
            }));
          });
        }
      })
      .catch(() => {
        history.push('/login');
      });
  }, []);

  useEffect(() => {
    utils
      .getTotals()
      .then(response => {
        if (response.status === 200) {
          response.json().then(data => {
            const { message: totals } = data;
            setState(prevState => ({
              ...prevState,
              isLoading: false,
              totals: totals.map(total => ({
                ...total,
                isSelected: false,
              })),
            }));
          });
        }
      })
      .catch(() => {
        history.push('/login');
      });
  }, []);

  const handleTabChange = (event, tab) => {
    setState(prevState => ({ ...prevState, tab }));
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
      utils.deleteCreditCards(card._id).then(response => {
        if (response.status === 200) {
          response.json().then(data => {
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
          });
        }
      });
      setState(prevState => ({
        ...prevState,
        selectedCards: [],
      }));
      return null;
    });
  };

  const handleCreditCardAddSave = ({ name, limit, balance, interest_rate }) => {
    const { creditCards } = state;

    utils
      .addCreditCard(username, name, limit, balance, interest_rate)
      .then(response => {
        if (response.status === 200) {
          response.json().then(data => {
            const { _id, updated_at, __v, name: addedCardName } = data.data;
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
              message: `${addedCardName} Card Added.`,
              theme: 'dark',
              offset: '50px',
              position: 'top right',
              duration: 5000,
              style: { zIndex: 2000 },
            });
          });
        } else {
          showAlert({ message: `Error deleting ${name}` });
        }
      });
  };

  const handleDialogClickOpen = () => {
    setState(prevState => ({ ...prevState, dialogOpen: true }));
  };

  const handleCreditCardAdd = () => {
    setState(prevState => ({
      ...prevState,
      cardToEdit: {},
      onSave: handleCreditCardAddSave,
      dialogTitle: 'Add Credit Card',
    }));
    handleDialogClickOpen();
  };

  const handleCreditCardEditSave = ({
    _id,
    name,
    limit,
    balance,
    interest_rate,
  }) => {
    const { creditCards } = state;
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
        if (response.status === 200) {
          response.json().then(data => {
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
          });
        } else {
          // TODO: confirm this message. . . or output something to user
          showAlert({ message: response.message });
        }
      })
      .catch(err => {
        showAlert({ message: err.message });
      });
  };

  const handleCreditCardEdit = () => {
    const { creditCards } = state;
    const [card] = creditCards.filter(c => (c.isSelected ? c : null));
    setState(prevState => ({
      ...prevState,
      cardToEdit: card,
      onSave: handleCreditCardEditSave,
      dialogTitle: 'Edit Credit Card',
    }));
    handleDialogClickOpen();
  };

  const handleOnDetails = () => {
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
      .then(response => {
        if (response.status === 200) {
          response.json().then(data => {
            const {
              data: { _id, updated_at },
            } = data;
            setState(prevState => ({
              ...prevState,
              totals: [
                { user: username, total: newTotal, _id, updated_at },
                ...totals,
              ],
            }));
            showAlert({
              message: 'Total saved.',
              theme: 'dark',
              offset: '50px',
              position: 'top right',
              duration: 5000,
              style: { zIndex: 2000 },
            });
          });
        } else {
          showAlert({ message: `Error adding total` });
        }
      })
      .catch(err => {
        showAlert({ message: `${err.data}` });
      });
  };

  const handleTotalDelete = () => {
    const { totals, selectedTotals } = state;

    selectedTotals.forEach(total => {
      utils.deleteTotals(total._id).then(response => {
        response.json().then(data => {
          const { message } = data;
          if (response.status === 200) {
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
          } else {
            showAlert({ message: response.message });
          }
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

  const handleDialogClose = () => {
    setState(prevState => ({ ...prevState, dialogOpen: false }));
  };

  // Logout from the app.
  const logout = () => {
    utils.userLogout().then(res => {
      if (res.status === 200) {
        history.push('/login');
      }
    });
  };

  // const computeDebt = () => {
  //   const { creditCards, totalDebt } = state;
  //   let total = totalDebt;
  //   creditCards.forEach(card => {
  //     total += card.balance;
  //   });
  //   return utils.createDollar(total);
  // };

  // const computeAvailable = () => {
  //   const { creditCards, totalAvailable } = state;
  //   let total = totalAvailable;
  //   creditCards.forEach(card => {
  //     total += card.limit;
  //   });
  //   return utils.createDollar(total);
  // };

  const {
    isLoading,
    creditCards,
    totals,
    tab,
    onSave,
    cardToEdit,
    dialogTitle,
    dialogOpen,
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
              onClick={() => logout()}
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
              onAdd={handleCreditCardAdd}
              onEdit={handleCreditCardEdit}
              onDetails={handleOnDetails}
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
            isAdmin={isAdmin}
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
          />
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
