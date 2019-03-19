import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
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
  chart: {
    background: '#fff',
  },
});

const DialogTransition = props => <Slide direction="up" {...props} />;

const AdminDashboard = ({ classes, showAlert }) => {
  const [currentUsers, setCurrentUsers] = React.useState([]);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [allSelected, setAllSelected] = React.useState(false);
  const [numSelected, setNumSelected] = React.useState(0);

  const [showCreditCards, setShowCreditCards] = React.useState(false);
  const [creditCards, setCreditCards] = React.useState([]);
  const [creditCardSortColumn] = React.useState('name');
  const [creditCardSort] = React.useState('asc');
  const [sortColumn, setSortColumn] = React.useState('username');
  const [sort, setSort] = React.useState('asc');

  const handleUserSort = (column, sortValue) => {
    setSort(sortValue);
    setSortColumn(column);
  };

  React.useEffect(() => {
    utils.adminGetAllUsers(sortColumn, sort).then(data => {
      const { users } = data;
      setTotalUsers(users.length);
      setCurrentUsers(
        users.map(user => ({
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
    setSelectedUsers(currentUsers.filter(user => user.isSelected === true));
  }, [currentUsers]);

  React.useEffect(() => {
    setCurrentUsers(orderBy(currentUsers, [sortColumn], [sort]));
  }, [sort, sortColumn]);

  const [showEditUserDialog, setShowEditUserDialog] = React.useState(false);

  const handleEditUserDialogOpen = () => {
    setShowEditUserDialog(true);
  };

  const handleEditUserDialogClose = () => {
    setShowEditUserDialog(false);
  };

  const handleSelectUser = selected => {
    setShowCreditCards(false);
    setCurrentUsers(
      currentUsers.map(user => {
        if (user._id === selected._id) {
          return { ...user, isSelected: !user.isSelected };
        }
        return user;
      }),
    );
  };

  const handleSelectAllUsers = () => {
    setShowCreditCards(false);
    setCurrentUsers(
      currentUsers.map(user => ({ ...user, isSelected: !allSelected })),
    );
    setAllSelected(!allSelected);
  };

  const handleDeleteUser = () => {
    selectedUsers.forEach(user => {
      utils
        .adminDeleteUser(user._id)
        .then(data => {
          setCurrentUsers(
            currentUsers.filter(existingUser => {
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

  const handleUsersCreditCards = () => {
    setShowCreditCards(true);
    utils
      .adminUserCreditCards(
        selectedUsers[0]._id,
        creditCardSortColumn,
        creditCardSort,
      )
      .then(data => {
        const { creditCards: cards } = data;

        setCreditCards(
          cards.map(card => ({
            ...card,
            isSelected: false,
          })),
        );
      })
      .catch(error => {
        console.log('Error: ', error);
      });
  };

  return (
    <div>
      <AdminUsers
        showAlert={showAlert}
        onDeleteUser={handleDeleteUser}
        onEditUser={handleEditUser}
        onUsersCreditCards={handleUsersCreditCards}
        numSelected={numSelected}
        totalUsers={totalUsers}
        onSelectAllUsers={handleSelectAllUsers}
        onSelectUser={handleSelectUser}
        currentUsers={currentUsers}
        onUserSort={handleUserSort}
        sortColumn={sortColumn}
        sort={sort}
      />
      <EditUserDialog
        user={{ username: 'test' }}
        onTransition={DialogTransition}
        dialogOpen={showEditUserDialog}
        onOpenEditUserDialog={handleEditUserDialogOpen}
        onCloseEditUserDialog={handleEditUserDialogClose}
        // onSave={onSave}
        // onRequired={handleRequired}
        // cardToEdit={cardToEdit}
        // title={dialogTitle}
        // username={username}
      />
      {showCreditCards && (
        <div>
          <div className={classes.title}>
            <Typography data-testid="totals-toolbar-title" variant="h6">
              {selectedUsers[0].username || ''}:
            </Typography>
          </div>
          <CreditCards
            creditCards={creditCards}
            onSelectAll={() => console.log('test')}
            onSelect={() => console.log('test')}
            onDelete={() => console.log('test')}
            onAdd={() => console.log('test')}
            onEdit={() => console.log('test')}
            onDetails={() => console.log('test')}
            onSort={() => console.log('test')}
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
