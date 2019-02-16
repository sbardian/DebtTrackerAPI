import { getAllUsers } from './routesLogic';

export const adminRoutes = router => {
  /**
   * routes ending in '/getAllUsers'
   */
  router.route('/getAllUsers').get(getAllUsers);

  return router;
};
