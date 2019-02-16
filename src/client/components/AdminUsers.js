import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import orderBy from 'lodash/orderBy';
import CreditCards from './CreditCards';
import AdminUsersToolbar from './AdminUsersToolbar';
import utils from '../utils/utils';

const AdminUsersStyles = () => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

function AdminUsers({ classes, showAlert }) {
  const [currentUsers, setCurrentUsers] = React.useState([]);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [allSelected, setAllSelected] = React.useState(false);
  const [numSelected, setNumSelected] = React.useState(0);
  const [sortColumn, setSortColumn] = React.useState('username');
  const [sort, setSort] = React.useState('asc');

  const [showCreditCards, setShowCreditCards] = React.useState(false);
  const [creditCards, setCreditCards] = React.useState([]);
  const [creditCardSortColumn, setCreditCardSortColumn] = React.useState(
    'name',
  );
  const [creditCardSort, setCreditCardSort] = React.useState('asc');

  React.useEffect(() => {
    utils.getAllUsers(sortColumn, sort).then(data => {
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

  React.useEffect(() => {});

  const onSelect = selected => {
    setCurrentUsers(
      currentUsers.map(user => {
        if (user._id === selected._id) {
          return { ...user, isSelected: !user.isSelected };
        }
        return user;
      }),
    );
  };

  const onSelectAll = () => {
    setCurrentUsers(
      currentUsers.map(user => ({ ...user, isSelected: !allSelected })),
    );
    setAllSelected(!allSelected);
  };

  const onSort = (column, sortValue) => {
    setSort(sortValue);
    setSortColumn(column);
  };

  const handleDeleteUser = () => {
    selectedUsers.forEach(user => {
      utils
        .deleteUser(user._id)
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

  const handleUsersCreditCards = () => {
    setShowCreditCards(true);
    utils
      .getAdminCreditCards(
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
    <div className={classes.container}>
      <Paper className={classes.root}>
        <AdminUsersToolbar
          onDeleteUser={handleDeleteUser}
          onUsersCreditCards={handleUsersCreditCards}
          onEditUser={() => console.log('edit user')}
          numSelected={numSelected}
        />
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < totalUsers}
                  checked={numSelected === totalUsers}
                  onChange={onSelectAll}
                />
              </TableCell>
              <TableCell padding="checkbox">
                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                  <TableSortLabel
                    active={sortColumn === 'username'}
                    direction={sort}
                    onClick={() =>
                      onSort('username', sort === 'asc' ? 'desc' : 'asc')
                    }
                  >
                    Username
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell numeric>
                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                  <TableSortLabel
                    active={sortColumn === 'email'}
                    direction={sort}
                    onClick={() =>
                      onSort('email', sort === 'asc' ? 'desc' : 'asc')
                    }
                  >
                    Email
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell numeric>
                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                  <TableSortLabel
                    active={sortColumn === 'isAdmin'}
                    direction={sort}
                    onClick={() =>
                      onSort('isAdmin', sort === 'asc' ? 'desc' : 'asc')
                    }
                  >
                    Admin
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentUsers.map(user => (
              <TableRow
                key={user._id}
                hover
                onClick={() => onSelect(user)}
                role="checkbox"
                aria-checked={user.isSelected}
                tabIndex={-1}
                selected={user.isSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={user.isSelected} />
                </TableCell>
                <TableCell padding="checkbox">{user.username}</TableCell>
                <TableCell numeric>{user.email}</TableCell>
                <TableCell numeric>{String(user.isAdmin)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {showCreditCards && (
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
        )}
      </Paper>
    </div>
  );
}

AdminUsers.propTypes = {
  classes: PropTypes.shape().isRequired,
  showAlert: PropTypes.func.isRequired,
};

export default withStyles(AdminUsersStyles)(AdminUsers);
