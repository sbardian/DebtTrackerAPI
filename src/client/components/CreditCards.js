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
import utils from '../utils/utils';
import ButtonControls from '../components/ButtonControls';
import alertOptions from '../utils/alertOptions';
import save from '../icons/save.png';
import error from '../icons/error.png';

export default class CreditCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      onCardToDeleteState: '',
    };
    this.onRowSelect = this.onRowSelect.bind(this);
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      isLoading: props.isLoading,
      onCardToDeleteState: props.onCardToDeleteState,
    });
  }

  // Called after a cards cell has been edited.
  onAfterSaveCell(row) {
    const self = this;
    utils
      .saveCreditCard(
        row._id,
        row.name,
        parseFloat(row.limit),
        parseFloat(row.balance),
        parseFloat(row.interest_rate),
      )
      .then(response => {
        if (response.error) {
          this.msg.show(response.message, {
            time: 5000,
            type: 'error',
            icon: <img src={error} alt="Error updating card." />,
          });
        } else {
          const temp = self.props.creditCards;
          const index = temp.findIndex(x => x.name === row.name);
          temp[index] = {
            __v: 0,
            _id: row._id,
            name: row.name,
            limit: parseFloat(row.limit),
            balance: parseFloat(row.balance),
            interest_rate: parseFloat(row.interest_rate),
          };
          self.props.onCardUpdateState(temp);
          this.msg.show(response.message, {
            time: 5000,
            type: 'success',
            icon: <img src={save} alt="Card updated." />,
          });
        }
      });
  }

  // Called when a row is selected.
  onRowSelect(row) {
    this.state.onCardToDeleteState(row._id, row.name);
  }

  // Formats a number to a dollar amount.
  dollarFormatter(cell) {
    return `$${utils.createDollar(parseFloat(cell))}`;
  }

  render() {
    const cellEditProp = {
      mode: 'click',
      blurToSave: true,
      afterSaveCell: this.onAfterSaveCell,
    };
    const selectRowProp = {
      mode: 'radio',
      clickToSelect: true,
      onSelect: this.onRowSelect,
    };
    const { creditCards, user, cardToDelete, onCardUpdateState } = this.props;
    return this.state.isLoading === true ? (
      <p>Loading!!!</p>
    ) : (
      <div className="col-md-6">
        <h4>Credit Cards</h4>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Limit</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Interest Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {creditCards.map(card => (
              <TableRow key={card._id}>
                <TableCell>{card._id}</TableCell>
                <TableCell>{card.name}</TableCell>
                <TableCell>{card.limit}</TableCell>
                <TableCell>{card.balance}</TableCell>
                <TableCell>{card.interest_rate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ButtonControls
          user={user}
          creditCards={creditCards}
          cardToDelete={cardToDelete}
          onCardUpdateState={onCardUpdateState}
        />
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
