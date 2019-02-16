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

function AdminUsers({ classes }) {
  const [currentUsers, setCurrentUsers] = React.useState([]);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [allSelected, setAllSelected] = React.useState(false);
  const [numSelected, setNumSelected] = React.useState(0);
  const [sortColumn, setSortColumn] = React.useState('username');
  const [sort, setSort] = React.useState('asc');

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

  return (
    <div className={classes.container}>
      <Paper className={classes.root}>
        <AdminUsersToolbar
          onDeleteUser={() => console.log('delete user')}
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
      </Paper>
    </div>
  );
}

AdminUsers.propTypes = {
  classes: PropTypes.shape().isRequired,
};

export default withStyles(AdminUsersStyles)(AdminUsers);
