import { login, register, logout } from './routesLogic';

const authRoutes = router => {
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

  return router;
};

export { authRoutes };
