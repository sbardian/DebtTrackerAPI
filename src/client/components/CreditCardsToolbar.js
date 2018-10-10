/* eslint react/prefer-stateless-function: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import DetailsIcon from '@material-ui/icons/Details';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import classNames from 'classnames';

const toolbarStyles = theme => ({
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

class TableToolbar extends Component {
  render() {
    const {
      numSelected,
      onDelete,
      onAdd,
      onEdit,
      onDetails,
      classes,
    } = this.props;
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
            <Typography variant="h6">Credit Cards</Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected === 1 && (
            <div className={classes.alignIcons}>
              <Tooltip title="Delete">
                <IconButton onClick={onDelete} aria-label="Delete">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton onClick={onEdit} aria-label="Edit">
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Details">
                <IconButton onClick={onDetails} aria-label="Details">
                  <DetailsIcon />
                </IconButton>
              </Tooltip>
            </div>
          )}
          {numSelected > 1 && (
            <Tooltip title="Delete">
              <IconButton onClick={onDelete} aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {numSelected < 1 && (
            <div className={classes.alignIcons}>
              <Tooltip title="Add Card">
                <IconButton onClick={onAdd} aria-label="Add Card">
                  <AddCircleOutline />
                </IconButton>
              </Tooltip>
              <Tooltip title="Filter list">
                <IconButton aria-label="Filter list">
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
      </Toolbar>
    );
  }
}

export default withTheme()(withStyles(toolbarStyles)(TableToolbar));
