import React, { Component } from 'react';
// import { BootstrapTable, TableCell } from 'react-bootstrap-table';
import PropTypes from 'prop-types';
import AlertContainer from 'react-alert';
import Table, {
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import { withStyles } from 'material-ui/styles';
import { lighten } from 'material-ui/styles/colorManipulator';
import Paper from 'material-ui/Paper';
import utils from '../utils/utils';
import TableToolbar from '../components/TableToolbar';
import ButtonControls from '../components/ButtonControls';
import alertOptions from '../utils/alertOptions';
import save from '../icons/save.png';
import error from '../icons/error.png';

const styles = theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
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
  table: {
    minWidth: 800,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class CreditCards extends Component {
  // Formats a number to a dollar amount.
  dollarFormatter(cell) {
    return `$${utils.createDollar(parseFloat(cell))}`;
  }

  render() {
    const {
      classes,
      creditCards,
      onSelectAll,
      onSelect,
      onDelete,
    } = this.props;

    const numSelected = creditCards.filter(card => card.isSelected).length;
    const totalCards = creditCards.length;

    return (
      <div className={classes.container}>
        <Paper className={classes.root}>
          <TableToolbar numSelected={numSelected} onDelete={onDelete} />
          <Table className={classes.customTableFontSize}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    indeterminate={numSelected > 0 && numSelected < totalCards}
                    checked={numSelected === totalCards}
                    onChange={onSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Limit</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Interest Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {creditCards.map(card => (
                <TableRow
                  hover
                  onClick={() => onSelect(card)}
                  role="checkbox"
                  aria-checked={card.isSelected}
                  tabIndex={-1}
                  key={card._id}
                  selected={card.isSelected}
                >
                  <TableCell>
                    <Checkbox checked={card.isSelected} />
                  </TableCell>
                  <TableCell>{card.name}</TableCell>
                  <TableCell>{this.dollarFormatter(card.limit)}</TableCell>
                  <TableCell>{this.dollarFormatter(card.balance)}</TableCell>
                  <TableCell>{card.interest_rate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <AlertContainer ref={a => (this.msg = a)} {...alertOptions} />
      </div>
    );
  }
}

export default withStyles(styles)(CreditCards);
