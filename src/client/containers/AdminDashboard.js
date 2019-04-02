import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import orderBy from 'lodash/orderBy';
import CreditCards from '../components/CreditCards';
import AdminUsers from '../components/AdminUsers';
import EditUserDialog from '../components/EditUserDialog';
import utils from '../utils/utils';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  loading: {
    textAlign: 'center',
    fontSize: '48pt',
  },
  flex: {
    flex: 1,
  },
  creditCardsTitle: {
    marginTop: '20px',
    marginLeft: '20px',
  },
  chart: {
    background: '#fff',
  },
});

const DialogTransition = props => <Slide direction="up" {...props} />;

const AdminDashboard = ({ classes, showAlert }) => {
  // User state
  const [users, setUsers] = React.useState([]);
  const [userCount, setUserCount] = React.useState(0);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [allSelected, setAllSelected] = React.useState(false);
  const [numSelected, setNumSelected] = React.useState(0);
  const [userToEdit, setUserToEdit] = React.useState({});
  const [userSortColumn, setUserSortColumn] = React.useState('username');
  const [userSort, setUserSort] = React.useState('asc');
  const [showEditUserDialog, setShowEditUserDialog] = React.useState(false);

  // User credit cards state
  const [showUserCreditCards, setShowUserCreditCards] = React.useState(false);
  const [userCreditCards, setUserCreditCards] = React.useState([]);
  const [allCreditCardsSelected, setAllCreditCardsSelected] = React.useState(
    true,
  );
  const [creditCardSortColumn, setCreditCardSortColumn] = React.useState(
    'name',
  );
  const [creditCardSort, setCreditCardSort] = React.useState('asc');

  // User functions
  const handleUserSort = (column, sortValue) => {
    setUserSort(sortValue);
    setUserSortColumn(column);
  };

  React.useEffect(() => {
    utils.adminGetAllUsers(userSortColumn, userSort).then(data => {
      setUserCount(data.users.length);
      setUsers(
        data.users.map(user => ({
          ...user,
          isSelected: false,
        })),
      );
    });
  }, []);

  React.useEffect(() => {
    setNumSelected(selectedUsers.length);
  }, [selectedUsers]);

  React.useEffect(() => {
    setSelectedUsers(users.filter(user => user.isSelected === true));
  }, [users]);

  React.useEffect(() => {
    setUsers(orderBy(users, [userSortColumn], [userSort]));
  }, [userSort, userSortColumn]);

  const handleEditUserDialogOpen = () => {
    setUserToEdit(selectedUsers[0]);
    setShowEditUserDialog(true);
  };

  const handleEditUserDialogClose = () => {
    setShowEditUserDialog(false);
  };

  const handleSetSelectedUsers = selected => {
    setShowUserCreditCards(false);
    setUsers(
      users.map(user => {
        if (user._id === selected._id) {
          return { ...user, isSelected: !user.isSelected };
        }
        return user;
      }),
    );
  };

  const handleSelectAllUsers = () => {
    setShowUserCreditCards(false);
    setUsers(users.map(user => ({ ...user, isSelected: !allSelected })));
    setAllSelected(!allSelected);
  };

  const handleDeleteUser = () => {
    selectedUsers.forEach(user => {
      utils
        .adminDeleteUser(user._id)
        .then(data => {
          setUsers(
            users.filter(existingUser => {
              if (user._id === existingUser._id) {
                return null;
              }
              return { ...user };
            }),
          );
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
      return null;
    });
    setSelectedUsers([]);
  };

  const handleEditUser = () => {
    handleEditUserDialogOpen();
  };

  const handleGetUsersCreditCards = () => {
    setShowUserCreditCards(true);
    utils
      .adminUserCreditCards(
        selectedUsers[0]._id,
        creditCardSortColumn,
        creditCardSort,
      )
      .then(data => {
        const { creditCards: cards } = data;

        setUserCreditCards(
          cards.map(card => ({
            ...card,
            isSelected: false,
          })),
        );
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

  const handleUpdateUser = ({
    _id,
    username,
    email,
    password,
    passwordConf,
  }) => {
    if (password && passwordConf && password === passwordConf) {
      utils
        .adminUpdateUser(_id, username, email, password, passwordConf)
        .then(data => {
          showAlert({
            message: data.message,
            theme: 'dark',
            offset: '50px',
            position: 'top right',
            duration: 5000,
            style: { zIndex: 2000 },
          });
          handleEditUserDialogClose();
        })
        .catch(error => {
          showAlert({
            message: `Error updating user: ${error.message}`,
            offset: '50px',
            position: 'top right',
            duration: 5000,
            progressBarColor: 'white',
            style: { zIndex: 2000, color: 'white', backgroundColor: 'red' },
          });
        });
    } else if (_id && username && email) {
      utils
        .adminUpdateUser(_id, username, email)
        .then(data => {
          showAlert({
            message: data.message,
            theme: 'dark',
            offset: '50px',
            position: 'top right',
            duration: 5000,
            style: { zIndex: 2000 },
          });
          handleEditUserDialogClose();
        })
        .catch(error => {
          showAlert({
            message: `Error updating user: ${error.message}`,
            offset: '50px',
            position: 'top right',
            duration: 5000,
            progressBarColor: 'white',
            style: { zIndex: 2000, color: 'white', backgroundColor: 'red' },
          });
        });
    } else {
      showAlert({
        message: 'Username and email fields are required.',
        offset: '50px',
        position: 'top right',
        duration: 5000,
        progressBarColor: 'white',
        style: { zIndex: 2000, color: 'white', backgroundColor: 'red' },
      });
    }
  };

  const handleRequired = () => {
    showAlert({
      message: 'Username and email fields are required.',
      offset: '50px',
      position: 'top right',
      duration: 5000,
      progressBarColor: 'white',
      style: { zIndex: 2000, color: 'white', backgroundColor: 'red' },
    });
  };

  // User credit cards functions
  const handleCreditCardSelectAll = () => {
    setAllCreditCardsSelected(!allCreditCardsSelected);
    setUserCreditCards(
      userCreditCards.map(card => ({
        ...card,
        isSelected: allCreditCardsSelected,
      })),
    );
  };

  const handleCreditCardSelectSingle = selected => {
    setUserCreditCards(
      userCreditCards.map(card => {
        if (card._id === selected._id) {
          return { ...card, isSelected: !card.isSelected };
        }
        return card;
      }),
    );
  };

  const handleCreditCardDelete = () => {
    // clone creditCards
    const ccCopy = userCreditCards.slice(0);

    userCreditCards.forEach(card => {
      if (card.isSelected) {
        utils
          .adminDeleteCreditCard(card._id)
          .then(data => {
            const index = ccCopy.findIndex(x => x._id === card._id);
            ccCopy.splice(index, 1);
            setUserCreditCards(ccCopy);
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
        return null;
      }
    });
  };

  // TODO: sort is taking a few clicks to 'start working'.
  const handleCreditCardSort = (_, column, ccSort) => {
    setCreditCardSort(ccSort);
    setCreditCardSortColumn(column);
    setUserCreditCards(
      orderBy(userCreditCards, [creditCardSortColumn], [creditCardSort]),
    );
  };

  return (
    <div>
      <AdminUsers
        showAlert={showAlert}
        onDeleteUser={handleDeleteUser}
        onEditUser={handleEditUser}
        onUsersCreditCards={handleGetUsersCreditCards}
        numSelected={numSelected}
        totalUsers={userCount}
        onSelectAllUsers={handleSelectAllUsers}
        onSelectUser={handleSetSelectedUsers}
        currentUsers={users}
        onUserSort={handleUserSort}
        sortColumn={userSortColumn}
        sort={userSort}
      />
      <EditUserDialog
        onTransition={DialogTransition}
        dialogOpen={showEditUserDialog}
        onOpenEditUserDialog={handleEditUserDialogOpen}
        onCloseEditUserDialog={handleEditUserDialogClose}
        userToEdit={userToEdit}
        onUpdateUser={handleUpdateUser}
        onRequired={handleRequired}
      />
      {showUserCreditCards && (
        <div>
          <div className={classes.creditCardsTitle}>
            <Typography data-testid="totals-toolbar-title" variant="h6">
              {`User: ${selectedUsers[0].username.toUpperCase() || ''}`}
            </Typography>
          </div>
          <CreditCards
            creditCards={userCreditCards}
            onSelectAll={handleCreditCardSelectAll}
            onSelect={handleCreditCardSelectSingle}
            onDelete={handleCreditCardDelete}
            onAdd={() => {
              showAlert({
                message: `Adding user credit cards not implemented.`,
                theme: 'light',
                offset: '50px',
                position: 'top right',
                duration: 5000,
                progressBarColor: 'white',
                style: { zIndex: 2000, color: 'white', backgroundColor: 'red' },
              });
            }}
            onEdit={() => {
              showAlert({
                message: `Editing users credit cards not implemented.`,
                theme: 'light',
                offset: '50px',
                position: 'top right',
                duration: 5000,
                progressBarColor: 'white',
                style: { zIndex: 2000, color: 'white', backgroundColor: 'red' },
              });
            }}
            onDetails={() => {
              showAlert({
                message: `Users credit card details not implemented.`,
                theme: 'light',
                offset: '50px',
                position: 'top right',
                duration: 5000,
                progressBarColor: 'white',
                style: { zIndex: 2000, color: 'white', backgroundColor: 'red' },
              });
            }}
            onSort={handleCreditCardSort}
            sort={creditCardSort}
            creditCardSortColumn={creditCardSortColumn}
          />
        </div>
      )}
    </div>
  );
};

AdminDashboard.defaultProps = {
  // TODO
};

AdminDashboard.propTypes = {
  classes: PropTypes.shape().isRequired,
  showAlert: PropTypes.func.isRequired,
};

export default withTheme()(withRouter(withStyles(styles)(AdminDashboard)));
