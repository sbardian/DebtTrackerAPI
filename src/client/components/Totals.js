import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Moment from 'moment';
import Checkbox from '@material-ui/core/Checkbox';
import TotalsToolbar from './TotalsToolbar';
import utils from '../utils/utils';

const styles = () => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

function Totals({
  classes,
  totals,
  onAddTotal,
  onDeleteTotal,
  onSelect,
  onSelectAll,
  onSort,
  sort,
  totalSortColumn,
}) {
  const numSelected = totals.filter(total => total.isSelected).length;
  const totalTotals = totals.length;

  const dateFormatter = useMemo(
    () => cell => {
      const date = new Moment(cell);
      return date.format('LL');
    },
    [],
  );

  return (
    <div className={classes.container}>
      <Paper className={classes.root}>
        <TotalsToolbar
          onAddTotal={onAddTotal}
          numSelected={numSelected}
          onDeleteTotal={onDeleteTotal}
        />
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < totalTotals}
                  checked={numSelected === totalTotals}
                  onChange={onSelectAll}
                />
              </TableCell>
              <TableCell padding="checkbox">
                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                  <TableSortLabel
                    active={totalSortColumn === 'updated_at'}
                    direction={sort}
                    onClick={() =>
                      onSort('updated_at', sort === 'asc' ? 'desc' : 'asc')
                    }
                  >
                    Date
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell numeric>
                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                  <TableSortLabel
                    active={totalSortColumn === 'total'}
                    direction={sort}
                    onClick={() =>
                      onSort('total', sort === 'asc' ? 'desc' : 'asc')
                    }
                  >
                    Total
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {totals.map(total => (
              <TableRow
                key={total._id}
                hover
                onClick={() => onSelect(total)}
                role="checkbox"
                aria-checked={total.isSelected}
                tabIndex={-1}
                selected={total.isSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={total.isSelected} />
                </TableCell>
                <TableCell padding="checkbox">
                  {dateFormatter(total.updated_at)}
                </TableCell>
                <TableCell numeric>
                  {`$${utils.createDollar(total.total)}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
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
  onDeleteTotal: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
  totalSortColumn: PropTypes.string.isRequired,
};

Totals.defaultProps = {
  totals: [],
};

export default withStyles(styles)(Totals);
