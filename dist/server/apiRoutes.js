'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const express = require('express');
const routesLogic = require('./routesLogic');

const router = express.Router();

/**
 * routes ending in '/creditcards'
 */
router.route('/creditcards').post((req, res) => routesLogic.addCreditCard(req, res)).get((req, res, next) => routesLogic.getAllCreditCards(req, res, next));

/**
 * routes ending in '/creditcards/id'
 */
router.route('/creditcards/:id').get((req, res) => routesLogic.getCreditCardByID(req, res)).put((req, res) => routesLogic.putOrUpdate(req, res)).delete((req, res) => routesLogic.deleteCreditCard(req, res));

/**
 * routes ending in '/totals'
 */
router.route('/totals').post((req, res) => routesLogic.addTotal(req, res)).get((req, res) => routesLogic.getTotals(req, res));

/**
 * routes ending in '/totals/id
 */
router.route('/totals/:id').delete((req, res) => routesLogic.deleteTotal(req, res));

/**
 * route ending in '/'
 */
/*
router.get('/', (req, res, next) => {
  let err = new Error();
  err.status = 400;
  return next(err);
});
*/

exports.default = router;
//# sourceMappingURL=apiRoutes.js.map