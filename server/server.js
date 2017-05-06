/**
 * Created by sbardian on 12/12/16.
 */
'use strict';
const express = require('express');
const server = express();
const bodyParser = require('body-parser');
//const connectDB = require('./connectDB');

const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;

mongoose.connect('mongodb://localhost/DeptTracker');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected to db');
});

// configure server to use bodyParser()
// this will let us get the data from a POST
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

let router = express.Router();

// middleware to use for all requests
server.use(express.static('public'));

// include our routes
let routes = require('./routes')(router);

// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api
server.use('/api', router);

// Send index.html for requests to /
server.get('/', function (req, res) {
  console.log('get index');
  res.sendfile('/index.html');
});

module.exports = server;



