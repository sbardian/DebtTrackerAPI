/* eslint react/prefer-stateless-function: 0 */
import React, { Component } from 'react';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import FilterListIcon from 'material-ui-icons/FilterList';
import AddCircleOutline from 'material-ui-icons/AddCircleOutline';
import { withStyles } from 'material-ui/styles';
import { lighten } from 'material-ui/styles/colorManipulator';
import classNames from 'classnames';
import PropTypes from 'prop-types';

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
    const { numSelected, onDelete, classes } = this.props;
    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subheading">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography variant="title">Credit Cards</Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton onClick={onDelete} aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <div className={classes.alignIcons}>
              <Tooltip title="Add Card">
                <IconButton aria-label="Add Card">
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

TableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

export default withStyles(toolbarStyles)(TableToolbar);
