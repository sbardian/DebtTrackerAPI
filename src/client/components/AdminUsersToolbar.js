import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CreditCard from '@material-ui/icons/CreditCard';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import classNames from 'classnames';

const AdminUsersToolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
  alignIcons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

function AdminUsersToolbar({
  classes,
  numSelected,
  onDeleteUser,
  onEditUser,
  onUsersCreditCards,
}) {
  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography data-testid="totals-toolbar-title" variant="h6">
            Users
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.alignIcons}>
        {numSelected === 1 && (
          <div className={classes.alignIcons}>
            <Tooltip title="Edit User">
              <IconButton onClick={onEditUser} aria-label="Edit User">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Credit Cards">
              <IconButton
                onClick={onUsersCreditCards}
                aria-label="Credit Cards"
              >
                <CreditCard />
              </IconButton>
            </Tooltip>
          </div>
        )}
        {numSelected >= 1 && (
          <div className={classes.alignIcons}>
            <Tooltip title="Delete">
              <IconButton onClick={onDeleteUser} aria-label="Delete User">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    </Toolbar>
  );
}

AdminUsersToolbar.propTypes = {
  classes: PropTypes.shape().isRequired,
  numSelected: PropTypes.number.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
  onEditUser: PropTypes.func.isRequired,
  onUsersCreditCards: PropTypes.func.isRequired,
};

export default withStyles(AdminUsersToolbarStyles)(AdminUsersToolbar);
