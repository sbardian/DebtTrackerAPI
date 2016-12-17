/**
 * Created by sbardian on 12/13/16.
 */

let CreditCard = require('../app/models/CreditCard');
let routesLogic = require('./routesLogic');

module.exports = function(router) {

    /**
     * Set specific headers.  Allow CORS.
     */
    router.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
        next();
    });

    /**
     * route ending in "/"
     */
    router.get('/', function(req, res) {
        res.json({ message: 'API up and running.' });
    });

    /**
     * routes ending in "/creditcards"
     */
    router.route('/creditcards')
        .post((req, res) => routesLogic.addCreditCard(req, res))
        .get((req, res) => routesLogic.getAllCreditCards(req, res));

    /**
     * routes ending in "/creditcards/id"
     */
    router.route("/creditcards/:id")
        .get((req, res) => routesLogic.getCreditCardByID(req, res))
        .put((req, res) => routesLogic.putOrUpdate(req, res))
        .delete((req, res) => routesLogic.deleteCreditCard(req, res));
}