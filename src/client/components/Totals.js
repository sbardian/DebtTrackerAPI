import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Moment from 'moment';
import TotalsToolbar from './TotalsToolbar';
import utils from '../utils/utils';

const styles = () => ({
  table: {
    minWidth: 700,
  },
});

function Totals({ classes, totals, onAddTotal }) {
  const dateFormatter = useMemo(
    () => cell => {
      const date = new Moment(cell);
      return date.format('LL');
    },
    [],
  );

  return (
    <Paper>
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
              <TableCell>{dateFormatter(total.updated_at)}</TableCell>
              <TableCell numeric>
                {`$${utils.createDollar(total.total)}`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

Totals.propTypes = {
  classes: PropTypes.shape().isRequired,
  onAddTotal: PropTypes.func.isRequired,
  totals: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      updated_at: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
    }),
  ),
};

Totals.defaultProps = {
  totals: [],
};

export default withStyles(styles)(Totals);
