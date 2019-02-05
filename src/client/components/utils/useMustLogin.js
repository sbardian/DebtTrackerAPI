import { useEffect, useState } from 'react';

export default (history, username, token) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (username && token) {
      setIsLoggedIn(true);
    } else {
      history.push('/login');
    }
  }, []);

  return isLoggedIn;
};
