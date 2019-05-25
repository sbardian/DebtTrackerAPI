export const ALL_USERS = [
  {
    _id: '5c9c44dfc72761050e86ee52',
    email: 'blah@blah.com',
    username: 'blah',
    isAdmin: false,
    password: 'shouldBeStripped',
    __v: 0,
  },
  {
    _id: '5ca5664b209ab7f7370d20cf',
    email: 'bob@bob.com',
    username: 'bob',
    isAdmin: false,
    password: 'shouldBeStripped',
    __v: 0,
  },
  {
    _id: '5ca5745abcdfe909b49b6e8c',
    email: 'fuck@fuck.com',
    username: 'fuck',
    isAdmin: false,
    password: 'shouldBeStripped',
    __v: 0,
  },
  {
    _id: '5ca57139d5446506c457b793',
    email: 'test@test.com',
    username: 'test',
    isAdmin: true,
    password: 'shouldBeStripped',
    __v: 0,
  },
  {
    _id: '5cb0c8bba0d60d7e42a4af60',
    email: 'test2@test2.com',
    username: 'test2',
    isAdmin: false,
    password: 'shouldBeStripped',
    __v: 0,
  },
];

export const ADMIN_SINGLE_USER = [
  {
    _id: '5c9c44dfc72761050e86ee52',
    email: 'blah@blah.com',
    username: 'blah',
    isAdmin: false,
    password: 'shouldBeStripped',
    __v: 0,
  },
];

export const ADMIN_SINGLE_USER_UPDATED = [
  {
    _id: '5c9c44dfc72761050e86ee52',
    email: 'blah@blah.com',
    username: 'blah2',
    isAdmin: false,
    password: 'shouldBeStripped',
    __v: 0,
  },
];
export const ADMIN_USERS_CREDITCARD = {
  _id: '5c9c44e9c72761050e86ee53',
  updated_at: '2019-03-28T03:52:09.681Z',
  userId: '5c9c44dfc72761050e86ee52',
  name: 'test',
  limit: 2000,
  balance: 200,
  interest_rate: 2,
  __v: 0,
};

export const ADMIN_UPDATED_CREDITCARD = {
  _id: '5c9c44e9c72761050e86ee53',
  updated_at: '2019-03-28T03:52:09.681Z',
  userId: '5c9c44dfc72761050e86ee52',
  name: 'test',
  limit: 4000,
  balance: 200,
  interest_rate: 2,
  __v: 0,
};

export const ADMIN_USERS_CREDITCARDS = [
  {
    _id: '5c9c44e9c72761050e86ee53',
    updated_at: '2019-03-28T03:52:09.681Z',
    userId: '5c9c44dfc72761050e86ee52',
    name: 'test',
    limit: 2000,
    balance: 200,
    interest_rate: 2,
    __v: 0,
  },
];

export const ADMIN_USERS_TOTALS = [
  {
    userId: '12345',
    total: 20000,
  },
];

export const LOGIN_SUCCESS_MOCK_USER_ADMIN = {
  _id: '5a8e41866c6f9f2f5d53330e',
  email: 'test@test.com',
  username: 'test',
  password: '$2a$10$IL3eU58fJ6ltVpYg0txAa.arQNXI6el9Lmrrc78hdnnbfU5tg3HcW',
  passwordConf: 'test',
  isAdmin: true,
  __v: 0,
};

export const LOGIN_SUCCESS_MOCK_USER = {
  _id: '5a8e41866c6f9f2f5d53330e',
  email: 'test@test.com',
  username: 'test',
  password: '$2a$10$IL3eU58fJ6ltVpYg0txAa.arQNXI6el9Lmrrc78hdnnbfU5tg3HcW',
  passwordConf: 'test',
  isAdmin: false,
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
  passwordConf: 'failpass',
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
  name: 'testCard',
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

export const VALID_USERID = {
  userId: '8675309',
};
