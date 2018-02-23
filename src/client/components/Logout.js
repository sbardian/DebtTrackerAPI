import React from 'react';
import utils from '../utils/utils';

const Logout = () => {
  utils.userLogout();
  return (
    <div>
      <h2>You have been logged out.</h2>
    </div>
  );
};

export default Logout;
