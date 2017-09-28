/**
 * Created by sbardian on 12/12/16.
 */

const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./connectDB');
const routes = require('./routes');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const server = {
  /**
   * Initialize server, and routes.
   *
   * @returns {express} expressServer - The express server instance.
   */
  init() {
    const expressServer = express();
    connectDB.connect();

    // use sessions for tracking logins
    // TODO: use env var for secret, using npm script
    app.use(session({
      secret: 'shit sandwich dawg',
      resave: true,
      saveUninitialized: false,
      store: new MongoStore({
        mongooseConnection: connectDB
      })
    }));

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
      let err = new Error();
      err.status = 400;
      return next(err);
    });
    return expressServer;
  }
}

module.exports = server;
