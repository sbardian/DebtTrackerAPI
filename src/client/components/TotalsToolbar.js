import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import classNames from 'classnames';

const totalsToolbarStyles = theme => ({
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

function TotalsToolbar({ classes, onAddTotal, numSelected, onDeleteTotal }) {
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
            Totals
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.alignIcons}>
        {numSelected >= 1 && (
          <Tooltip title="Delete">
            <IconButton onClick={onDeleteTotal} aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Add Total">
          <IconButton onClick={onAddTotal} aria-label="Add Total">
            <AddCircleOutline />
          </IconButton>
        </Tooltip>
      </div>
    </Toolbar>
  );
}

TotalsToolbar.propTypes = {
  classes: PropTypes.shape().isRequired,
  onAddTotal: PropTypes.func.isRequired,
  numSelected: PropTypes.number.isRequired,
  onDeleteTotal: PropTypes.func.isRequired,
};

export default withStyles(totalsToolbarStyles)(TotalsToolbar);
