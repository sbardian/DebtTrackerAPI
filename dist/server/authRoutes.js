'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const express = require('express');
const routesLogic = require('./routesLogic');

const router = express.Router();

/**
 * route ending in '/login'
 */
router.route('/login').post(routesLogic.login);

/**
 * route ending in '/register'
 */
router.route('/register').post((req, res, next) => routesLogic.register(req, res, next));

/**
 * route ending in '/logout'
 */
router.route('/logout').get((req, res, next) => routesLogic.logout(req, res, next));

exports.default = router;
//# sourceMappingURL=authRoutes.js.map