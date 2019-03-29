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
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import utils from '../utils/utils';
import CreditCardsToolbar from './CreditCardsToolbar';

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
});

function CreditCards({
  classes,
  creditCards,
  onSelectAll,
  onSelect,
  onDelete,
  onAdd,
  onEdit,
  onDetails,
  onSort,
  sort,
  creditCardSortColumn,
}) {
  const dollarFormatter = useMemo(
    () => cell => `$${utils.createDollar(parseFloat(cell))}`,
    [],
  );

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
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < totalCards}
                  checked={numSelected === totalCards}
                  onChange={onSelectAll}
                />
              </TableCell>
              <TableCell>
                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                  <TableSortLabel
                    active={creditCardSortColumn === 'name'}
                    direction={sort}
                    onClick={() =>
                      onSort('name', sort === 'asc' ? 'desc' : 'asc')
                    }
                  >
                    Name
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                  <TableSortLabel
                    active={creditCardSortColumn === 'limit'}
                    direction={sort}
                    onClick={() =>
                      onSort('limit', sort === 'asc' ? 'desc' : 'asc')
                    }
                  >
                    Limit
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                  <TableSortLabel
                    active={creditCardSortColumn === 'balance'}
                    direction={sort}
                    onClick={() =>
                      onSort('balance', sort === 'asc' ? 'desc' : 'asc')
                    }
                  >
                    Balance
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                  <TableSortLabel
                    active={creditCardSortColumn === 'interest_rate'}
                    direction={sort}
                    onClick={() =>
                      onSort('interest_rate', sort === 'asc' ? 'desc' : 'asc')
                    }
                  >
                    Interest Rate
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
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
                <TableCell padding="checkbox">
                  <Checkbox checked={card.isSelected} />
                </TableCell>
                <TableCell>{card.name}</TableCell>
                <TableCell>{dollarFormatter(card.limit)}</TableCell>
                <TableCell>{dollarFormatter(card.balance)}</TableCell>
                <TableCell>{card.interest_rate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

CreditCards.propTypes = {
  classes: PropTypes.shape().isRequired,
  creditCards: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      limit: PropTypes.number,
      balance: PropTypes.number,
      interest_rate: PropTypes.number,
      isSelected: PropTypes.bool,
    }),
  ).isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDetails: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
  creditCardSortColumn: PropTypes.string.isRequired,
};

export default withTheme()(withStyles(styles)(CreditCards));
