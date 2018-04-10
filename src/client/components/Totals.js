/* eslint react/prefer-stateless-function: 0 */
import React, { Component } from 'react';
import Table, {
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import Moment from 'moment';
import TotalsToolbar from './TotalsToolbar';
import utils from '../utils/utils';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class Totals extends Component {
  // Formats a date.
  dateFormatter = cell => {
    const date = new Moment(cell);
    return date.format('LL');
  };

  render() {
    const { classes, totals, onAddTotal } = this.props;
    return (
      <Paper className={classes.root}>
        <TotalsToolbar onAddTotal={onAddTotal} />
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell numeric>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {totals.map(total => (
              <TableRow key={total._id}>
                <TableCell>{this.dateFormatter(total.updated_at)}</TableCell>
                <TableCell numeric>{`$${utils.createDollar(
                  total.total,
                )}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default withStyles(styles)(Totals);
