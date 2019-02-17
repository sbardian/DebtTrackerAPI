import {
  getAllUsers,
  deleteUser,
  getUserCreditCards,
  deleteUserCreditCard,
  updateUserCreditCard,
} from './routesLogic';

export const adminRoutes = router => {
  /**
   * routes ending in '/getAllUsers'
   */
  router.route('/users').get(getAllUsers);

  router.route('/users/:id').delete(deleteUser);

  router
    .route('/users/cards/:id')
    .get(getUserCreditCards)
    .delete(deleteUserCreditCard)
    .put(updateUserCreditCard);

  return router;
};
