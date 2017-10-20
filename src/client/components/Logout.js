import React, { Component } from 'react';
import utils from '../utils/utils';

export default class Logout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    utils.userLogout();
    return (
      <div>
        <h2>You have been logged out.</h2>
      </div>
    );
  }
}