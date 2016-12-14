/**
 * Created by sbardian on 12/13/16.
 */

let CreditCard = require('../app/models/CreditCard');
let routesLogic = require('./routesLogic');

module.exports = function(router) {

    router.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next(); // go to next routes
    });

    // test route (accessed at GET http://localhost:8080/api)
    // =============================================================================
    router.get('/', function(req, res) {
        res.json({ message: 'API up and running.' });
    });

    // route /creditcards
    // =============================================================================
    router.route('/creditcards')
        // create a credit card (accessed at POST http://localhost:8080/api/creditcards)
        .post(function(req, res){
            routesLogic.addCreditCard(req, res);
        })

        // get all the credit cards (accessed at GET http://localhost:8080/api/creditcards)
        .get(function(req, res) {
            routesLogic.getAllCreditCards(req, res);
        });

    // route /creditcards/id
    // =============================================================================
    router.route("/creditcards/:id")
        .get(function(req, res) {
            routesLogic.getCreditCardByID(req, res);
        })

        .put(function(req, res){
            routesLogic.putOrUpdate(req, res);
        })

        .delete(function(req, res){
            routesLogic.deleteCreditCard(req, res);
        });
}