const axios = require('axios');
const API_BASE_URL = `/api/`;
const AUTH_BASE_URL = `/auth/`;
const CREDITCARDS_URL = `${API_BASE_URL}creditcards/`;
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
    return axios.create();
  },

  /**
   * Post to Logout
   *
   */
  userLogout() {
    return (
        utils._axios()({
          method: 'get',
          url: LOGOUT_URL,
        })
          .then(response => response)
          .catch(err => err)
    )
  },

  /**
   * Post to Login
   *
   * @param email
   * @param password
   */
  userLogin(email, password) {
    return (
        utils._axios()({
          method: 'post',
          url: LOGIN_URL,
          data: {
            email,
            password,
          },
        })
          .then(response => response)
          .catch(err => err)
    )
  },

  /**
   * Post to Register
   *
   * @param username
   * @param email
   * @param password
   * @param passwordConf
   */
  registerUser(username, email, password, passwordConf ) {
    return (
        utils._axios()({
          method: 'post',
          url: REGISTER_URL,
          data: {
            username,
            email,
            password,
            passwordConf,
          }
        })
          .then(response => response)
          .catch(err => err.data)
    )
  },

  /**
   * Returns array of credit cards from API.
   *
   */
  getCreditCards() {
    console.log('axios = ', this._axios);
    return utils._axios().get(CREDITCARDS_URL, { withCredentials: true, })
      .then(response => response.data.message);
  },

  /**
   * Updates a credit card in the database.
   *
   * @param {string} id - id of card.
   * @param {string} name - name of card.
   * @param {float} limit - limit of card.
   * @param {float} balance - balance of card.
   * @param {float} interest_rate - interest rate of card.
   */
  saveCreditCard(id, name, limit, balance, interest_rate) {
    return (
        utils._axios()({
          method: 'put',
          url: `${CREDITCARDS_URL}${id}`,
          data: {
            name,
            limit,
            balance,
            interest_rate,
        },
      })
        .then(response => response.data)
        .catch(err => err.data)
    );
  },

  /**
   * Deletes a card from the database.
   *
   * @param {string} id - id of card to delete.
   */
  deleteCreditCards(id) {
    return (
        utils._axios()({
          method: 'delete',
          url: `${CREDITCARDS_URL}${id}`,
      })
        .then(response => response.data)
        .catch(err => err.data)
    );
  },

  /**
   * Adds a credit card to the database.
   *
   * @param {string} user - name of user.
   * @param {string} name - name of card.
   * @param {float} limit - limit of card.
   * @param {float} balance - balance of card.
   * @param {float} interest_rate - interest rate of card.
   */
  addCreditCard(user, name, limit, balance, interest_rate) {
    return (
        utils._axios()({
          method: 'post',
          url: CREDITCARDS_URL,
          data: {
            user,
            name,
            limit,
            balance,
            interest_rate,
        },
      })
        .then(response => response.data)
        .catch(err => err.data)
    );
  },

  /**
   * Saves a new total to the database.
   *
   * @param {string} user - name of user.
   * @param {float} total - new total debt.
   */
  addNewTotal(user, total) {
    return utils._axios()({
      method: 'post',
      url: TOTALS_URL,
      data: {
        user,
        total,
      },
    })
      .then(response => response.data)
      .catch(err => err.data)
  },

  /**
   * Returns promise of totals from the database.
   *
   */
  getTotals() {
    return utils._axios().get(TOTALS_URL, { withCredentials: true, })
      .then(response => response.data.message)
      .catch(err => err);
  },

  /**
   * Delete a total.
   *
   * @param id ID of the total to delete
   */
  deleteTotals(id) {
    return (
        utils._axios()({
          method: 'delete',
          url: `${TOTALS_URL}${id}`,
      })
        .then(response => response.data.message)
        .catch(err => err.data)
    );
  },

  // TODO: Remove and add this functionality to the API
  getUserCards(cards, user) {
    const userCards = [];
    cards.map((card) => {
      if (card.user === user) {
        userCards.push(card);
      }
    });
    return userCards;
  },

  // TODO: Remove and add this functionality to the API
  getUserTotals(totals, user) {
    const userTotals = [];
    totals.map((total) => {
      if (total.user === user) {
        userTotals.push(total);
      }
    });
    return userTotals;
  },
};

module.exports = utils;
