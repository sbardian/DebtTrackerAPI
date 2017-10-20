import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AlertContainer from 'react-alert';
import AddCard from './AddCard';
import utils from '../utils/utils';
import { alertOptions } from '../utils/alertOptions';
import check from '../icons/check.png';
import error from '../icons/error.png';

const DeleteCard = require('react-bootstrap').Button;
const ButtonToolBar = require('react-bootstrap').ButtonToolbar;

export default class ButtonControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardToDelete: null,
    };
    this.deleteCard = this.deleteCard.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      cardToDelete: props.cardToDelete,
    });
  }

  /**
   * Deletes the select card from the database
   * and updates the component.
   *
   */
  deleteCard() {
    const { cardToDelete } = this.state;
    const { creditCards, onCardUpdateState } = this.props;
    if (cardToDelete !== null) {
      const ans = confirm(`Confirm deleting this credit card ${cardToDelete.name}?`);
      if (ans) {
        utils.deleteCreditCards(cardToDelete.id)
          .then((response) => {
            console.log('response to delete = ', response);
            if (response.error) {
              this.msg.show(response.message, {
                time: 5000,
                type: 'error',
                icon: <img src={error} alt="Error deleting card." />,
              });
            }
            else {
              const temp = creditCards;
              const index = temp.findIndex(x => x._id === cardToDelete.id);
              temp.splice(index, 1);
              onCardUpdateState(temp);
              this.msg.show(response.message, {
                time: 5000,
                type: 'success',
                icon: <img src={check} alt="Card deleted."/>,
              });
            }
          });
      }
    }
    else {
      alert('Please select a card to delete.');
    }
  }

  render() {
    const { user, creditCards, onCardUpdateState } = this.props;
    return (
      <div className="col-md-6">
        <ButtonToolBar>
          <AddCard
            user={user}
            creditCards={creditCards}
            onCardUpdateState={onCardUpdateState}
          />
          <DeleteCard
            bsSize="lg"
            onClick={this.deleteCard}
          >
            Delete Card
          </DeleteCard>
        </ButtonToolBar>
        <AlertContainer ref={a => this.msg = a} {...alertOptions} />
      </div>
    );
  }
}

ButtonControls.propTypes = {
  creditCards: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCardUpdateState: PropTypes.func.isRequired,
};
