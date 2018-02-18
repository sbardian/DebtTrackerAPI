import express from 'express';
import routesLogic from './routesLogic';

const router = express.Router();

/**
 * routes ending in '/creditcards'
 */
router
  .route('/creditcards')
  .post(routesLogic.addCreditCard)
  .get(routesLogic.getAllCreditCards);

/**
 * routes ending in '/creditcards/id'
 */
router
  .route('/creditcards/:id')
  .get(routesLogic.getCreditCardByID)
  .put(routesLogic.putOrUpdate)
  .delete(routesLogic.deleteCreditCard);

/**
 * routes ending in '/totals'
 */
router
  .route('/totals')
  .post(routesLogic.addTotal)
  .get(routesLogic.getTotals);

/**
 * routes ending in '/totals/id
 */
router.route('/totals/:id').delete(routesLogic.deleteTotal);

export default router;
