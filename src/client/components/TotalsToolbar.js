import React from 'react';
import Toolbar from 'material-ui/Toolbar';
import { withStyles } from 'material-ui';
import Typography from 'material-ui/Typography';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import AddCircleOutline from 'material-ui-icons/AddCircleOutline';
import { lighten } from 'material-ui/styles/colorManipulator';

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

class TotalsToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, onAddTotal } = this.props;
    return (
      <Toolbar className={classes.root}>
        <div className={classes.title}>
          <Typography variant="title">Totals</Typography>
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

export default withStyles(totalsToolbarStyles)(TotalsToolbar);
