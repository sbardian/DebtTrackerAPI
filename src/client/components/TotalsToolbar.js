import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import { lighten } from '@material-ui/core/styles/colorManipulator';

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
  title: {
    flex: '0 0 auto',
  },
});

class TotalsToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, onAddTotal } = this.props;
    return (
      <Toolbar className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h6">Totals</Typography>
        </div>
        <div className={classes.spacer} />
        <div className={classes.alignIcons}>
          <Tooltip title="Add Total">
            <IconButton onClick={onAddTotal} aria-label="Add Total">
              <AddCircleOutline />
            </IconButton>
          </Tooltip>
        </div>
      </Toolbar>
    );
  }
}

TotalsToolbar.propTypes = {
  classes: PropTypes.shape().isRequired,
  onAddTotal: PropTypes.func.isRequired,
};

export default withStyles(totalsToolbarStyles)(TotalsToolbar);
