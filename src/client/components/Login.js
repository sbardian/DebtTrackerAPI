import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import {
  Form,
  FormControl,
  ControlLabel,
  FormGroup,
  Col,
  Checkbox,
  Button,
} from 'react-bootstrap';
import { transparentBg } from '../styles';
import utils from '../utils/utils';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      email: '',
      password: '',
    };
    this.userSelect = this.userSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.userLogin = this.userLogin.bind(this);
  }

  /**
   * User login
   * @param {object} e event
   * @returns {null} none
   */
  userLogin(e) {
    const { email, password } = this.state;
    e.preventDefault();
    utils
      .userLogin(email, password)
      .then(response => {
        if (response.status === 200) {
          console.log('login response ', response);
          this.setState({
            username: response.data.username,
          });
          browserHistory.push({
            pathname: `/`,
            state: {
              username: response.data.username,
              token: response.data.token,
            },
          });
        } else {
          console.log('bad response ', response);
        }
      })
      .catch(err => {
        console.log('error in userLogin ', err);
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
      case 'email':
        this.setState({ email: value });
        break;
      case 'password':
        this.setState({ password: value });
        break;
      default:
        break;
    }
  }

  /**
   * Sets the state of the user selected.
   *
   * @param {object} e - Event of selection.
   * @returns {null} none
   */
  userSelect(e) {
    this.setState({
      user: e.target.value,
    });
  }

  render() {
    const { email, password } = this.state;
    return (
      <div className="jumbotron col-sm-12 text-center" style={transparentBg}>
        <h1>DebtTracker</h1>
        <p className="lead">Lets get started!</p>
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-md-offset-4">
              <Form horizontal onSubmit={this.userLogin}>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>
                    Email
                  </Col>
                  <Col sm={10}>
                    <FormControl
                      id="email"
                      name="email"
                      value={email}
                      type="email"
                      placeholder="Email"
                      onChange={this.handleChange}
                    />
                  </Col>
                </FormGroup>

                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>
                    Password
                  </Col>
                  <Col sm={10}>
                    <FormControl
                      id="password"
                      name="password"
                      value={password}
                      type="password"
                      placeholder="Password"
                      onChange={this.handleChange}
                    />
                  </Col>
                </FormGroup>

                <FormGroup>
                  <Col smOffset={2} sm={10}>
                    <Checkbox>Remember me</Checkbox>
                  </Col>
                </FormGroup>

                <FormGroup>
                  <Col smOffset={2} sm={10}>
                    <Link>
                      <Button type="submit">Login</Button>
                    </Link>
                    <Link to={'/register'}>
                      <Button type="button">Register</Button>
                    </Link>
                  </Col>
                </FormGroup>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
