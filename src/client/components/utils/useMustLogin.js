import { useEffect, useState } from 'react';

export default (history, username) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (username) {
      setIsLoggedIn(true);
    } else {
      history.push('/login');
    }
  }, []);

  return isLoggedIn;
};
