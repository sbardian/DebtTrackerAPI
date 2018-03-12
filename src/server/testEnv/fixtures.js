export const LOGIN_MOCK_USER = {
  email: 'test@test.com',
  username: 'test',
  password: '$2a$10$9fEj.goY9ZR1INP8iup/1exbhGBj8BBmOKfUWJwpZmD8.cPF3zrhi',
  passwordConf: 'testpass',
  isAdmin: false,
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

export const CREDIT_CARDS = {
  name: 'test',
  limit: 10000,
  balance: 5000,
  interest_rate: 10,
  updated_at: Date.now,
};
