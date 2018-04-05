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
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: true,
      onCardToDeleteState: '',
      order: 'asc',
      data: [],
      orderBy: 'calories',
      selected: [],
      page: 0,
      rowsPerPage: 5,
    };
    this.handleRequestSort = this.handleRequestSort.bind(this);
    this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.isSelected = this.isSelected.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      isLoading: props.isLoading,
      onCardToDeleteState: props.onCardToDeleteState,
      data: props.creditCards,
    });
  }

  handleRequestSort(event, property) {
    const orderBy = property;
    let order = 'desc';
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));
    this.setState({ data, order, orderBy });
  }

  handleSelectAllClick(event, checked) {
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n._id) });
      return;
    }
    this.setState({ selected: [] });
  }

  handleClick(event, id) {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    this.setState({ selected: newSelected });
  }

  handleChangePage(event, page) {
    this.setState({ page });
  }

  handleChangeRowsPerPage(event) {
    this.setState({ rowsPerPage: event.target.value });
  }

  isSelected(id) {
    return this.state.selected.indexOf(id) !== -1;
  }

  // Formats a number to a dollar amount.
  dollarFormatter(cell) {
    return `$${utils.createDollar(parseFloat(cell))}`;
  }

  render() {
    const { data, selected, rowsPerPage, page } = this.state;
    const {
      classes,
      creditCards,
      user,
      cardToDelete,
      onCardUpdateState,
      order,
      orderBy
    } = this.props;
    // const emptyRows =
    //   rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const numSelected = selected.length;
    const rowCount = creditCards.length;

    return this.state.isLoading === true ? (
      <p>Loading!!!</p>
    ) : (
      <div className={classes.container}>
        <Paper className={classes.root}>
          <TableToolbar numSelected={numSelected} />
          <Table className={classes.customTableFontSize}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={numSelected === rowCount}
                    onChange={this.handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Limit</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Interest Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(card => {
                const isSelected = this.isSelected(card._id);
                return (
                  <TableRow
                    hover
                    onClick={event => this.handleClick(event, card._id)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={card._id}
                    selected={isSelected}
                  >
                    <TableCell>
                      <Checkbox checked={isSelected} />
                    </TableCell>
                    <TableCell>{card.name}</TableCell>
                    <TableCell>{this.dollarFormatter(card.limit)}</TableCell>
                    <TableCell>{this.dollarFormatter(card.balance)}</TableCell>
                    <TableCell>{card.interest_rate}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
        {/* <ButtonControls
          user={user}
          creditCards={creditCards}
          cardToDelete={cardToDelete}
          onCardUpdateState={onCardUpdateState}
        /> */}
        <AlertContainer ref={a => (this.msg = a)} {...alertOptions} />
      </div>
    );
  }
}

CreditCards.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  user: PropTypes.string.isRequired,
  creditCards: PropTypes.arrayOf(PropTypes.object),
  onCardUpdateState: PropTypes.func.isRequired,
};

CreditCards.defaultProps = {
  isLoading: true,
  user: '',
  creditCards: [],
  cardToDelete: {},
  onCardUpdateState: () => {},
};

export default withStyles(styles)(CreditCards);
