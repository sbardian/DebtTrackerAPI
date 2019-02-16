import { getAllUsers, deleteUser } from './routesLogic';

export const adminRoutes = router => {
  /**
   * routes ending in '/getAllUsers'
   */
  router.route('/users').get(getAllUsers);

  router.route('/users/:id').delete(deleteUser);

  return router;
};
