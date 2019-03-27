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
import AdminUsersToolbar from './AdminUsersToolbar';

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
  title: {
    flex: '0 0 auto',
    marginLeft: '20px',
  },
});

function AdminUsers({
  classes,
  onDeleteUser,
  onEditUser,
  onUsersCreditCards,
  numSelected,
  totalUsers,
  onSelectAllUsers,
  onSelectUser,
  currentUsers,
  onUserSort,
  sort,
  sortColumn,
}) {
  return (
    <div className={classes.container}>
      <Paper className={classes.root}>
        <AdminUsersToolbar
          onDeleteUser={onDeleteUser}
          onUsersCreditCards={onUsersCreditCards}
          onEditUser={onEditUser}
          numSelected={numSelected}
        />
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < totalUsers}
                  checked={numSelected === totalUsers}
                  onChange={onSelectAllUsers}
                />
              </TableCell>
              <TableCell padding="checkbox">
                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                  <TableSortLabel
                    active={sortColumn === 'username'}
                    direction={sort}
                    onClick={() =>
                      onUserSort('username', sort === 'asc' ? 'desc' : 'asc')
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
                      onUserSort('email', sort === 'asc' ? 'desc' : 'asc')
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
                      onUserSort('isAdmin', sort === 'asc' ? 'desc' : 'asc')
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
                onClick={() => onSelectUser(user)}
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
  onDeleteUser: PropTypes.func.isRequired,
  onUsersCreditCards: PropTypes.func.isRequired,
  numSelected: PropTypes.number.isRequired,
  totalUsers: PropTypes.number.isRequired,
  onSelectAllUsers: PropTypes.func.isRequired,
  onSelectUser: PropTypes.func.isRequired,
  onEditUser: PropTypes.func.isRequired,
  currentUsers: PropTypes.arrayOf(
    PropTypes.shape({
      __v: PropTypes.number.isRequired,
      _id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      isAdmin: PropTypes.bool.isRequired,
      isSelected: PropTypes.bool.isRequired,
      username: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onUserSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
  sortColumn: PropTypes.string.isRequired,
};

export default withStyles(AdminUsersStyles)(AdminUsers);
