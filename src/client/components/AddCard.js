import React, { Component } from 'react';
import {
  Button,
  Modal,
  Form,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
import AlertContainer from 'react-alert';
import PropTypes from 'prop-types';
import utils from '../utils/utils';
import alertOptions from '../utils/alertOptions';
import save from '../icons/save.png';

export default class AddCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      user: '',
      name: '',
      limit: 0,
      balance: 0,
      interest_rate: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  static getValidationState() {
    // TODO: do we care to validate anything?
  }

  componentWillReceiveProps(props) {
    this.setState({
      user: props.user
    });
  }

  /**
   * Updates state based on table cell that was
   * edited.
   *
   * @param {object} e - Event of change.
   * @returns {null} none
   */
  handleChange(e) {
    const { value, id } = e.target;
    switch (id) {
      case 'name':
        this.setState({ name: value });
        break;
      case 'limit':
        this.setState({ limit: value });
        break;
      case 'balance':
        this.setState({ balance: value });
        break;
      case 'interest_rate':
        this.setState({ interest_rate: value });
        break;
      default:
        break;
    }
  }

  /**
   * Saves the card that was added to the database
   * and updates the component.
   *
   * @returns {null} none
   */
  save() {
    const { creditCards, onCardUpdateState } = this.props;
    const { user, name, limit, balance, interest_rate } = this.state;
    utils.addCreditCard(user, name, limit, balance, interest_rate).then(res => {
      const temp = creditCards;
      const { _id, update_at, __v } = res;
      temp.push({
        _id,
        user,
        name,
        limit: parseFloat(limit),
        balance: parseFloat(balance),
        interest_rate: parseFloat(interest_rate),
        update_at,
        __v
      });
      onCardUpdateState(temp);
      this.msg.show('Card added.', {
        time: 5000,
        type: 'success',
        icon: <img src={save} alt="Card added." />
      });
    });
    this.close();
  }

  /**
   * Closes the add card modal.
   *
   * @returns {null} none
   */
  close() {
    this.setState({
      showModal: false
    });
  }

  /**
   * Opens the add card modal.
   *
   * @returns {null} none
   */
  open() {
    this.setState({
      showModal: true,
      user: this.state.user,
      name: '',
      limit: '',
      balance: '',
      interest_rate: ''
    });
  }

  render() {
    const { showModal, name, limit, balance, interest_rate } = this.state;
    return (
      <div>
        <Button bsSize="lg" onClick={this.open}>
          Add Card
        </Button>
        <Modal show={showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Add Card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <FormGroup validationState={this.getValidationState}>
                <ControlLabel>Edit card name</ControlLabel>
                <FormControl
                  id="name"
                  type="text"
                  value={name}
                  placeholder="(ex: Citi)"
                  onChange={this.handleChange}
                />
                <FormControl.Feedback />
                <ControlLabel>Edit card limit: </ControlLabel>
                <FormControl
                  id="limit"
                  type="number"
                  value={limit}
                  placeholder="(ex: 12000)"
                  onChange={this.handleChange}
                />
                <FormControl.Feedback />
                <ControlLabel>Edit card balance: </ControlLabel>
                <FormControl
                  id="balance"
                  type="number"
                  value={balance}
                  placeholder="(ex: 1499.98)"
                  onChange={this.handleChange}
                />
                <FormControl.Feedback />
                <ControlLabel>Edit card interest rate: </ControlLabel>
                <FormControl
                  id="interest_rate"
                  type="number"
                  value={interest_rate}
                  placeholder="(ex: 18.2)"
                  onChange={this.handleChange}
                />
                <FormControl.Feedback />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.save}>Save</Button>
            <Button onClick={this.close}>Cancel</Button>
          </Modal.Footer>
        </Modal>
        <AlertContainer ref={a => (this.msg = a)} {...alertOptions} />
      </div>
    );
  }
}

AddCard.propTypes = {
  user: PropTypes.string.isRequired,
  creditCards: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCardUpdateState: PropTypes.func.isRequired
};

AddCard.defaultProps = {
  user: '',
  creditCards: [],
  onCardUpdateState: () => {}
};
