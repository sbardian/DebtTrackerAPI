import React, { Component } from 'react';
import { Form, FormControl, ControlLabel, FormGroup, Col, Button } from 'react-bootstrap';
import { transparentBg } from '../styles';
import utils from '../utils/utils';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      username: '',
      email: '',
      password: '',
      passwordConf: '',
    };
    this.userSelect = this.userSelect.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Sets the state of the user selected.
   *
   * @param {object} e - Event of selection.
   */
  userSelect(e) {
    this.setState({
      user: e.target.value,
    });
  }

  /**
   * Register user
   *
   * @returns {XML}
   */
  registerUser(e) {
    const { email, username, password, passwordConf } = this.state;
    e.preventDefault();
    utils.registerUser(username, email, password, passwordConf)
        .then(response => {
          console.log('register response = ', response);
        });
  }

  /**
   * Updates state based on table cell that was
   * edited.
   *
   * @param {object} e - Event of change.
   */
  handleChange(e) {
    const { value, id } = e.target;
    switch (id) {
      case 'username':
        this.setState({ username: value });
        break;
      case 'email':
        this.setState({ email: value });
        break;
      case 'password':
        this.setState({ password: value });
        break;
      case 'passwordConf':
        this.setState({ passwordConf: value });
        break;
      default:
        break;
    }
  }

  render() {
    const { email, username, password, passwordConf } = this.state;
    return (
        <div className="jumbotron col-sm-12 text-center" style={transparentBg}>
          <h1>DebtTracker</h1>
          <p className="lead">Lets get started!</p>
          <div className="container">
            <div className="row">
              <div className="col-md-4 col-md-offset-4">
                <Form horizontal onSubmit={this.registerUser}>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>
                      Email
                    </Col>
                    <Col sm={10}>
                      <FormControl
                          id="email"
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={this.handleChange}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>
                      Username
                    </Col>
                    <Col sm={10}>
                      <FormControl
                          id="username"
                          type="text"
                          placeholder="Username"
                          value={username}
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
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={this.handleChange}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>
                      Confirm Password
                    </Col>
                    <Col sm={10}>
                      <FormControl
                          id="passwordConf"
                          type="password"
                          placeholder="Confirm Password"
                          value={passwordConf}
                          onChange={this.handleChange}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup>
                    <Col smOffset={2} sm={10}>
                      <Button type="submit">
                        Register
                      </Button>
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
