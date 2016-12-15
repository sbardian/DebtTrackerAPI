/**
 * Created by sbardian on 12/13/16.
 */

let CreditCard = require('../app/models/CreditCard');

let routesLogic = {
    /**
     * Add a new credit card to the database.
     * @param req the request
     * @param res the response
     */
    addCreditCard (req, res) {
        let db = new CreditCard();
        let response = {};
        // fetch email and password from REST request.
        // Add strict validation when you use this in Production.
        db.name = req.body.name;
        db.limit = req.body.limit;
        db.balance = req.body.balance;
        db.interest_rate = req.body.interest_rate;
        db.save(function(err) {
            // save() will run insert() command of MongoDB.
            // it will add new data in collection.
            if(err) {
                response = {"error" : true, "message" : "Error adding data"};
            } else {
                response = {"message" : "Data added"};
            }
            res.json(response);
        });
    },

    /**
     * Get all the credit cards in the database.
     * @param req the request
     * @param res the response
     */
    getAllCreditCards (req, res) {
        let response = {};
        CreditCard.find({}, function (err, data) {
            // Mongo command to fetch all data from collection.
            if (err) {
                response = {"error": true, "message": "Error fetching data"};
            } else {
                response = {"message" : data};
            }
            res.json(response);
        }).sort([['balance', 'descending']]);
    },

    /**
     * Get a specific credit card by its ID
     * @param req the request
     * @param res the response
     */
    getCreditCardByID (req, res) {
        let response = {};
        CreditCard.findById(req.params.id, function (err, data) {
            // This will run Mongo Query to fetch data based on ID.
            if (err) {
                response = {"error": true, "message": "Error fetching data"};
            } else {
                response = {"message": data};
            }
            res.json(response);
        });
    },

    /**
     * Add or update (if exists) a credit card.
     * @param req the request
     * @param res the response
     */
    putOrUpdate (req, res) {
        let response = {};
        // first find out record exists or not
        // if it does then update the record
        CreditCard.findById(req.params.id, function(err, data){
            if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
            } else {
                if(req.body.name !== undefined)
                    data.name = req.body.name;
                if(req.body.limit !== undefined)
                    data.limit = req.body.limit;
                if(req.body.balance !== undefined)
                    data.balance = req.body.balance;
                if(req.body.interest_rate !== undefined)
                    data.interest_rate = req.body.interest_rate;
                // save the data
                data.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error updating data"};
                    } else {
                        response = {"message" : "Data is updated for " + req.params.id};
                    }
                    res.json(response);
                })
            }
        });
    },

    /**
     * delete a credit card from the database.
     * @param req the request
     * @param res the response
     */
    deleteCreditCard (req, res) {
        let response = {};
        // find the data
        CreditCard.findById(req.params.id, function(err, data){
            if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
            } else {
                // data exists, remove it.
                CreditCard.remove({_id : req.params.id},function(err){
                    if(err) {
                        response = {"error" : true, "message" : "Error deleting data"};
                    } else {
                        response = {"message" : "Data associated with " + req.params.id + "is deleted"};
                    }
                    res.json(response);
                });
            }
        });
    }
}

module.exports = routesLogic;