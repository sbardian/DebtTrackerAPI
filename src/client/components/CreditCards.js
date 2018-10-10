/* eslint-disable no-return-assign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AlertContainer from 'react-alert';
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Paper from '@material-ui/core/Paper';
import utils from '../utils/utils';
import CreditCardsToolbar from './CreditCardsToolbar';
import alertOptions from '../utils/alertOptions';

const styles = theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  // highlight:
  //   theme.palette.type === 'light'
  //     ? {
  //         color: theme.palette.secondary.main,
  //         backgroundColor: lighten(theme.palette.secondary.light, 0.85),
  //       }
  //     : {
  //         color: theme.palette.text.primary,
  //         backgroundColor: theme.palette.secondary.dark,
  //       },
  // spacer: {
  //   flex: '1 1 100%',
  // },
  // actions: {
  //   color: theme.palette.text.secondary,
  // },
  // title: {
  //   flex: '0 0 auto',
  // },
  // table: {
  //   minWidth: 800,
  // },
  // tableWrapper: {
  //   overflowX: 'auto',
  // },
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
      onAdd,
      onEdit,
      onDetails,
    } = this.props;

    const numSelected = creditCards.filter(card => card.isSelected).length;
    const totalCards = creditCards.length;

    return (
      <div className={classes.container}>
        <Paper className={classes.root}>
          <CreditCardsToolbar
            numSelected={numSelected}
            onDelete={onDelete}
            onAdd={onAdd}
            onEdit={onEdit}
            onDetails={onDetails}
          />
          <Table>
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

// CreditCards.propTypes = {
// classes: PropTypes.node.isRequired,
// creditCards: PropTypes.shape({
//   name: PropTypes.string,
//   limit: PropTypes.number,
//   balance: PropTypes.number,
//   interest_rate: PropTypes.number,
//   isSelected: PropTypes.bool,
// }).isRequired,
// onSelectAll: PropTypes.func.isRequired,
// onSelect: PropTypes.func.isRequired,
// onDelete: PropTypes.func.isRequired,
// onAdd: PropTypes.func.isRequired,
// onEdit: PropTypes.func.isRequired,
// onDetails: PropTypes.func.isRequired,
// };

export default withTheme()(withStyles(styles)(CreditCards));
