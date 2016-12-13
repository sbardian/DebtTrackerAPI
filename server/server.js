/**
 * Created by sbardian on 12/12/16.
 */

// BASE SETUP
// =============================================================================
// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var CreditCard = require('../app/models/CreditCard');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
app.use(express.static('public'));

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening. shit yeah');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// on routes that end in /creditcards
// ----------------------------------------------------
router.route('/creditcards')

// create a credit card (accessed at POST http://localhost:8080/api/creditcards)
    .post(function(req, res){
        var db = new CreditCard();
        var response = {};
        // fetch email and password from REST request.
        // Add strict validation when you use this in Production.
        db.name = req.body.name;
        db.credit_line = req.body.credit_line;
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
    })

    // get all the credit cards (accessed at GET http://localhost:8080/api/creditcards)
    .get(function(req, res) {
        console.log('getting credit cards');
        var response = {};
        CreditCard.find({}, function (err, data) {
            // Mongo command to fetch all data from collection.
            if (err) {
                response = {"error": true, "message": "Error fetching data"};
            } else {
                response = {"message" : data};
            }
            res.json(response);
        });
    });

router.route("/creditcards/:id")
    .get(function(req, res) {
        var response = {};
        CreditCard.findById(req.params.id, function (err, data) {
            // This will run Mongo Query to fetch data based on ID.
            if (err) {
                response = {"error": true, "message": "Error fetching data"};
            } else {
                response = {"message": data};
            }
            res.json(response);
        });
    })

    .put(function(req, res){
        var response = {};
        // first find out record exists or not
        // if it does then update the record
        console.log('update name with ' + req.params.id);
        CreditCard.findById(req.params.id, function(err, data){
            if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
            } else {
                // we got data from Mongo.
                // change it accordingly.
                console.log('data.name = ' + JSON.stringify(data));
                if(req.body.name !== undefined)
                    data.name = req.body.name;
                if(req.body.credit_line !== undefined)
                    data.credit_line = req.body.credit_line;
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
    })

    .delete(function(req, res){
        var response = {};
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
    });

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// Send index.html for requests to /
app.get('/', function(req, res) {
    console.log('get index');
    res.sendfile('../index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
