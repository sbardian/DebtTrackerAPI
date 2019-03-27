import { login, register, logout } from './routesLogic';

const authRoutes = router => {
  router.route('/login').post(login);
  router.route('/register').post(register);
  router.route('/logout').get(logout);

  return router;
};

export { authRoutes };
