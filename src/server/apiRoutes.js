import {
  getAllCreditCards,
  getCreditCardById,
  addCreditCard,
  deleteCreditCard,
  putOrUpdate,
  getTotals,
  addTotal,
  deleteTotal,
} from './routesLogic';

const apiRoutes = router => {
  router
    .route('/creditcards')
    .post(addCreditCard)
    .get(getAllCreditCards);
  router
    .route('/creditcards/:id')
    .get(getCreditCardById)
    .put(putOrUpdate)
    .delete(deleteCreditCard);
  router
    .route('/totals')
    .post(addTotal)
    .get(getTotals);
  router.route('/totals/:id').delete(deleteTotal);

  return router;
};

export { apiRoutes };
