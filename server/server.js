/**
 * Created by sbardian on 12/12/16.
 */

const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./connectDB');

const expressServer = express();
connectDB.connect();

// configure server to use bodyParser()
// this will let us get the data from a POST
expressServer.use(bodyParser.urlencoded({ extended: true }));
expressServer.use(bodyParser.json());

const router = express.Router();

// middleware to use for all requests
expressServer.use(express.static('public'));

// include our routes
const routes = require('./routes')(router);

// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api
expressServer.use('/api', router);

// Send index.html for requests to /
expressServer.get('/', (req, res) => {
  res.sendfile('/index.html');
});

module.exports = expressServer;
