import express from 'express';
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

const router = express.Router();

/**
 * routes ending in '/creditcards'
 */
router
  .route('/creditcards')
  .post(addCreditCard)
  .get(getAllCreditCards);

/**
 * routes ending in '/creditcards/id'
 */
router
  .route('/creditcards/:id')
  .get(getCreditCardById)
  .put(putOrUpdate)
  .delete(deleteCreditCard);

/**
 * routes ending in '/totals'
 */
router
  .route('/totals')
  .post(addTotal)
  .get(getTotals);

/**
 * routes ending in '/totals/id
 */
router.route('/totals/:id').delete(deleteTotal);

export default router;
