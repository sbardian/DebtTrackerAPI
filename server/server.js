/**
 * Created by sbardian on 12/12/16.
 */

const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./connectDB');
const routes = require('./routes');

const server = {
  /**
   * Initialize server, and routes.
   *
   * @returns {express} expressServer - The express server instance.
   */
  init() {
    const expressServer = express();
    connectDB.connect();

    // configure server to use bodyParser()
    // this will let us get the data from a POST
    expressServer.use(bodyParser.urlencoded({extended: true}));
    expressServer.use(bodyParser.json());

    const router = express.Router();

    // middleware to use for all requests
    expressServer.use(express.static('public'));

    // include our routes
    routes.setRoutes(router);

    // REGISTER OUR ROUTES
    // all of our routes will be prefixed with /api
    expressServer.use('/api', router);

    // Send index.html for requests to /
    expressServer.get('/', (req, res) => {
      return res.sendFile(process.env.PWD + '/app/RedirectPage/index.html');
    });
    return expressServer;
  }
}

module.exports = server;
