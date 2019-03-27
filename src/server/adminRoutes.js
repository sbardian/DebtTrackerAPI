import {
  getAllUsers,
  deleteUser,
  updateUser,
  getUserCreditCards,
  deleteUserCreditCard,
  updateUserCreditCard,
  getUsersTotals,
  deleteUsersTotals,
} from './routesLogic';

export const adminRoutes = router => {
  router.route('/users').get(getAllUsers);
  router
    .route('/users/:id')
    .delete(deleteUser)
    .put(updateUser);
  router
    .route('/users/cards/:id')
    .get(getUserCreditCards)
    .delete(deleteUserCreditCard)
    .put(updateUserCreditCard);
  router
    .route('/users/totals/:id')
    .get(getUsersTotals)
    .delete(deleteUsersTotals);

  return router;
};
