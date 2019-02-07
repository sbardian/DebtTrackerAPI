const axios = require('axios');

const API_BASE_URL = `/api/`;
const AUTH_BASE_URL = `/auth/`;
const CREDITCARDS_URL = `${API_BASE_URL}creditcards/`;
const CREDITCARDBYID_URL = `${API_BASE_URL}creditcards/`;
const TOTALS_URL = `${API_BASE_URL}totals/`;
const REGISTER_URL = `${AUTH_BASE_URL}register/`;
const LOGIN_URL = `${AUTH_BASE_URL}login/`;
const LOGOUT_URL = `${AUTH_BASE_URL}logout/`;

const utils = {
  /**
   * Formats a number to a dollar. (USD)
   *
   * @param {float} value - number to format.
   * @returns {string}
   */
  createDollar(value) {
    return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  },

  /**
   * Axios instance
   *
   * @private
   */
  _axios() {
    return axios.create({
      // headers: { Authorization: `Bearer ${token}` },
    });
  },

  /**
   * Post to Logout
   *
   */
  userLogout: () =>
    fetch(LOGOUT_URL, {
      method: 'GET',
    })
      .then(response => response)
      .catch(err => err),

  /**
   * Post to Login
   *
   * @param email
   * @param password
   */
  userLogin: (email, password) => {
    return fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then(response => response)
      .catch(err => err);
  },

  /**
   * Post to Register
   *
   * @param username
   * @param email
   * @param password
   * @param passwordConf
   */
  registerUser: (username, email, password, passwordConf) =>
    fetch(REGISTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        passwordConf,
      }),
    })
      .then(response => response)
      .catch(err => err),

  /**
   * Returns array of credit cards from API.
   *
   */
  getCreditCards: () =>
    fetch(CREDITCARDS_URL, {
      method: 'GET',
    })
      .then(response => response)
      .catch(err => err),

  /**
   * Get credit card by ID
   *
   * @param {*} id
   */
  getCreditCardById: id =>
    fetch(`${CREDITCARDBYID_URL}${id}`, {
      method: 'GET',
    })
      .then(response => response)
      .catch(err => err),

  /**
   * Updates a credit card in the database.
   *
   * @param {string} id - id of card.
   * @param {string} name - name of card.
   * @param {float} limit - limit of card.
   * @param {float} balance - balance of card.
   * @param {float} interest_rate - interest rate of card.
   */
  saveCreditCard: (id, name, limit, balance, interest_rate) =>
    fetch(`${CREDITCARDS_URL}${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name,
        limit,
        balance,
        interest_rate,
      })
        .then(response => response)
        .catch(err => err),
    }),

  /**
   * Deletes a card from the database.
   *
   * @param {string} id - id of card to delete.
   */
  deleteCreditCards: id =>
    fetch(`${CREDITCARDS_URL}${id}`, {
      method: 'DELETE',
    })
      .then(response => response)
      .catch(err => err),

  /**
   * Adds a credit card to the database.
   *
   * @param {string} user - name of user.
   * @param {string} name - name of card.
   * @param {float} limit - limit of card.
   * @param {float} balance - balance of card.
   * @param {float} interest_rate - interest rate of card.
   */
  addCreditCard: (user, name, limit, balance, interest_rate) =>
    fetch(CREDITCARDS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        name,
        limit,
        balance,
        interest_rate,
      }),
    })
      .then(response => response)
      .catch(err => err),

  /**
   * Saves a new total to the database.
   *
   * @param {string} user - name of user.
   * @param {float} total - new total debt.
   */
  addNewTotal: (user, total) =>
    fetch(TOTALS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        total,
      }),
    })
      .then(response => response)
      .catch(err => err),

  /**
   * Returns promise of totals from the database.
   *
   */
  getTotals() {
    return utils
      ._axios()
      .get(TOTALS_URL)
      .then(response => response.data.message)
      .catch(err => err);
  },

  /**
   * Delete a total.
   *
   * @param id ID of the total to delete
   */
  deleteTotals(id) {
    return utils
      ._axios()({
        method: 'delete',
        url: `${TOTALS_URL}${id}`,
      })
      .then(response => response.data)
      .catch(err => err.data);
  },

  // TODO: Remove and add this functionality to the API
  getUserCards(cards, user) {
    return cards.filter(card => card.user === user);
  },

  // TODO: Remove and add this functionality to the API
  getUserTotals(totals, user) {
    return totals.filter(total => total.user === user);
  },
};

module.exports = utils;
