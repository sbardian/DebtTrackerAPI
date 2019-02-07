import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const UsernameContext = React.createContext();

export const UsernameProvider = ({ children }) => {
  const localStorageUsername = localStorage.getItem('DT_USERNAME');

  const [username, setUsername] = useState(localStorageUsername || '');

  const updateUsername = value => {
    localStorage.setItem('DT_USERNAME', value);
    setUsername(value);
  };

  return (
    <UsernameContext.Provider value={{ username, updateUsername }}>
      {children}
    </UsernameContext.Provider>
  );
};

UsernameProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
