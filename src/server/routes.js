/**
 * Created by sbardian on 12/13/16.
 */

const routesLogic = require('./routesLogic');

const routes = {
  setRoutes(router) {
    /**
     * route ending in '/'
     */
    router.get('/', (req, res, next) => {
      let err = new Error();
      err.status = 400;
      return next(err);
    });

    /**
     * route ending in '/login'
     */
    router.post('/login', routesLogic.login);

    /**
     * route ending in '/register'
     */
    router.route('/register')
        .post((req, res, next) => routesLogic.register(req, res, next));

    /**
     * route ending in '/logout'
     */
    router.route('/logout')
        .get((req, res, next) => routesLogic.logout(req, res, next));

    /**
     * routes ending in '/creditcards'
     */
    router.route('/creditcards')
        .post((req, res) => routesLogic.addCreditCard(req, res))
        .get((req, res, next) => routesLogic.getAllCreditCards(req, res, next));

    /**
     * routes ending in '/creditcards/id'
     */
    router.route('/creditcards/:id')
        .get((req, res) => routesLogic.getCreditCardByID(req, res))
        .put((req, res) => routesLogic.putOrUpdate(req, res))
        .delete((req, res) => routesLogic.deleteCreditCard(req, res));

    /**
     * routes ending in '/totals'
     */
    router.route('/totals')
        .post((req, res) => routesLogic.addTotal(req, res))
        .get((req, res) => routesLogic.getTotals(req, res));

    /**
     * routes ending in '/totals/id
     */
    router.route('/totals/:id')
        .delete((req, res) => routesLogic.deleteTotal(req, res));
  },
};

module.exports = routes;
