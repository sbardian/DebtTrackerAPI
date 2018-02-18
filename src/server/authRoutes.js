import express from 'express';
import routesLogic from './routesLogic';

const router = express.Router();

/**
 * route ending in '/login'
 */
router.route('/login').post(routesLogic.login);

/**
 * route ending in '/register'
 */
router.route('/register').post(routesLogic.register);

/**
 * route ending in '/logout'
 */
router.route('/logout').get(routesLogic.logout);

export default router;
