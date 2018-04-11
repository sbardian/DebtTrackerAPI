/* eslint react/prefer-stateless-function: 0 */
/* eslint no-nested-ternary: 0 */
import React, { Component } from 'react';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import FilterListIcon from 'material-ui-icons/FilterList';
import AddCircleOutline from 'material-ui-icons/AddCircleOutline';
import EditIcon from 'material-ui-icons/Edit';
import { withStyles } from 'material-ui/styles';
import { lighten } from 'material-ui/styles/colorManipulator';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Slide from 'material-ui/transitions/Slide';
import AddDialog from './AddDialog';

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
  constructor() {
    super();
    this.state = {
      dialogOpen: false,
    };
  }

  handleClickOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleClose = () => {
    this.setState({ dialogOpen: false });
  };

  Transition = props => {
    return <Slide direction="up" {...props} />;
  };

  render() {
    const { numSelected, onDelete, onAdd, onEdit, classes } = this.props;
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
                <IconButton
                  onClick={this.handleClickOpen}
                  aria-label="Add Card"
                >
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
        <AddDialog
          onOpen={this.handleClickOpen}
          onClose={this.handleClose}
          onTransition={this.Transition}
          dialogOpen={this.state.dialogOpen}
          onAdd={onAdd}
        />
      </Toolbar>
    );
  }
}

export default withStyles(toolbarStyles)(TableToolbar);
