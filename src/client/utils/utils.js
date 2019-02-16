const API_BASE_URL = `/api/`;
const AUTH_BASE_URL = `/auth/`;
const ADMIN_BASE_URL = `/admin/`;
const CREDITCARDS_URL = `${API_BASE_URL}creditcards/`;
const CREDITCARDBYID_URL = `${API_BASE_URL}creditcards/`;
const TOTALS_URL = `${API_BASE_URL}totals/`;
const REGISTER_URL = `${AUTH_BASE_URL}register/`;
const LOGIN_URL = `${AUTH_BASE_URL}login/`;
const LOGOUT_URL = `${AUTH_BASE_URL}logout/`;
const GET_ALL_USERS_URL = `${ADMIN_BASE_URL}getAllUsers/`;
const POST = 'POST';
const GET = 'GET';
const PUT = 'PUT';
const DELETE = 'DELETE';

const _fetch = (url, method, body = null, headers = {}) =>
  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body && JSON.stringify(body),
  }).then(response => response.json());

const utils = {
  // Formats a number to a dollar (USD)
  createDollar(value) {
    return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  },

  // Post to Logout
  userLogout: () => _fetch(LOGOUT_URL, GET),

  // Post to Login
  userLogin: (email, password) => _fetch(LOGIN_URL, POST, { email, password }),

  // Post to Register
  registerUser: (username, email, password, passwordConf) =>
    _fetch(REGISTER_URL, POST, { username, email, password, passwordConf }),

  // Returns array of credit cards from API
  getCreditCards: (field, sort) =>
    _fetch(`${CREDITCARDS_URL}?field=${field}&sort=${sort}`, GET),

  // Get credit card by ID
  getCreditCardById: id => _fetch(`${CREDITCARDBYID_URL}${id}`, GET),

  // Updates a credit card in the database
  saveCreditCard: (id, name, limit, balance, interest_rate) =>
    _fetch(`${CREDITCARDS_URL}${id}`, PUT, {
      name,
      limit,
      balance,
      interest_rate,
    }),

  // Deletes a card from the database
  deleteCreditCards: id => _fetch(`${CREDITCARDS_URL}${id}`, DELETE),

  // Adds a credit card to the database
  addCreditCard: (user, name, limit, balance, interest_rate) =>
    _fetch(CREDITCARDS_URL, POST, {
      user,
      name,
      limit,
      balance,
      interest_rate,
    }),

  // Saves a new total to the database
  addNewTotal: (user, total) => _fetch(TOTALS_URL, POST, { user, total }),

  // Returns promise of totals from the database
  getTotals: (field, sort) =>
    _fetch(`${TOTALS_URL}?field=${field}&sort=${sort}`, GET),

  // Delete a total
  deleteTotals: id => _fetch(`${TOTALS_URL}${id}`, DELETE),

  // **Admin Only!** get all users
  getAllUsers: (field, sort) =>
    _fetch(`${GET_ALL_USERS_URL}?field=${field}&sort=${sort}`),
};

module.exports = utils;
