import React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import AlertContainer from 'react-alert';
import PropTypes from 'prop-types';
import Moment from 'moment';
import utils from '../utils/utils';
import check from '../icons/check.png';
import error from '../icons/error.png';
import alertOptions from '../utils/alertOptions';
import { tableHeaderStyle } from '../styles/index';

export default class TotalsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
    this.buttonFormatter = this.buttonFormatter.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      isLoading: props.isLoading,
    });
  }

  // Formats a number to a dollar amount.
  dollarFormatter(cell) {
    return `$${utils.createDollar(parseFloat(cell))}`;
  }

  // Formats a date.
  dateFormatter(cell) {
    const date = new Moment(cell);
    return date.format('LL');
  }

  // Deletes a total.
  deleteTotal(row) {
    utils.deleteTotals(row._id).then(response => {
      const temp = this.props.totals;
      const index = temp.findIndex(x => x._id === row._id);
      this.msg.show('Total deleted.', {
        time: 5000,
        type: 'success',
        icon: <img src={check} alt="Total deleted." />,
      });
      temp.splice(index, 1);
      this.props.onTotalUpdateState(temp);
    });
  }

  // Returns a delete button for a total row.
  buttonFormatter(cell, row) {
    return (
      <ButtonToolbar>
        <Button
          onClick={() => {
            this.deleteTotal(row);
          }}
          bsStyle="danger"
          bsSize="small"
        >
          X
        </Button>
      </ButtonToolbar>
    );
  }

  render() {
    const { isLoading } = this.state;
    const { totals } = this.props;
    return isLoading === true ? (
      <p>Loading!!!</p>
    ) : (
      <div className="col-md-12">
        <h4>Debt Totals</h4>
        <BootstrapTable
          data={totals}
          striped
          hover
          multiColumnSort={4}
          headerStyle={tableHeaderStyle}
        >
          <TableHeaderColumn isKey dataField="_id" dataSort={false} hidden>
            ID
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="updated_at"
            dataSort
            dataFormat={this.dateFormatter}
          >
            Date
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="total"
            dataSort
            dataFormat={this.dollarFormatter}
          >
            Total
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="button"
            dataFormat={this.buttonFormatter}
          >
            Delete
          </TableHeaderColumn>
        </BootstrapTable>
        <AlertContainer ref={a => (this.msg = a)} {...alertOptions} />
      </div>
    );
  }
}

TotalsTable.propTypes = {
  isLoading: PropTypes.bool,
  totals: PropTypes.arrayOf(PropTypes.object).isRequired,
};

TotalsTable.defaultProps = {
  isLoading: false,
  totals: [],
};
