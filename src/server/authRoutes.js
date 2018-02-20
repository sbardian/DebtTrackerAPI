import express from 'express';
import { login, register, logout } from './routesLogic';

const router = express.Router();

/**
 * route ending in '/login'
 */
router.route('/login').post(login);

/**
 * route ending in '/register'
 */
router.route('/register').post(register);

/**
 * route ending in '/logout'
 */
router.route('/logout').get(logout);

export default router;
