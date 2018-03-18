export const LOGIN_SUCCESS_MOCK_USER = {
  _id: '5a8e41866c6f9f2f5d53330e',
  email: 'test@test.com',
  username: 'test',
  password: '$2a$10$IL3eU58fJ6ltVpYg0txAa.arQNXI6el9Lmrrc78hdnnbfU5tg3HcW',
  passwordConf: 'test',
  isAdmin: true,
  __v: 0,
};

export const SUCCESS_REGISTER_MOCK_USER = {
  email: 'success@success.com',
  username: 'success',
  password: 'success',
  passwordConf: 'success',
  isAdmin: false,
};

export const BAD_PASSWORD_CONF_MOCK_USER = {
  email: 'success@success.com',
  username: 'success',
  password: 'success',
  passwordConf: 'wrongPass',
  isAdmin: false,
};

export const NO_USERNAME_MOCK_USER = {
  email: 'fail@fail.com',
  username: null,
  password: 'failpass',
  passwordConf: 'failpass2',
  isAdmin: false,
};

export const CREDIT_CARD = {
  user: 'test',
  name: 'testCard',
  limit: 10000,
  balance: 5000,
  interest_rate: 10,
};

export const INVALID_CREDIT_CARD = {
  limit: 10000,
  balance: 5000,
  interest_rate: 10,
};

export const VALID_TOTAL = {
  user: 'test',
  total: 20000,
};

export const INVALID_TOTAL = {
  error: true,
  message: 'Error deleting data',
};

export const INVALID_FINDING_TOTAL = {
  error: true,
  message: 'Error fetching data',
};

export const INVALID_DELETING_TOTAL = {
  error: true,
  message: 'Error deleting data',
};
