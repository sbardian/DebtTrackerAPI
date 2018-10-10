import React from 'react';
import PropTypes from 'prop-types';

const Main = ({ children }) => (
  <div>
    <div className="main-container">{children}</div>
  </div>
);

Main.propTypes = {};

export default Main;
