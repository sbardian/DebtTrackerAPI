
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const session = require('express-session');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const cors = require('cors');
const MongoStore = require('connect-mongo')(session);

const server = {
  /**
   * Initialize server, and routes.
   *
   * @returns {express} expressServer - The express server instance.
   */
  init() {
    const expressServer = express();

    const corsOptions = {
      credentials: true,
      origin: true,
    };

    expressServer.use(cors(corsOptions));

    mongoose.connect(
        'mongodb://localhost/DeptTracker',
        { useMongoClient: true,
          promiseLibrary: bluebird,
        });

    const db = mongoose.connection;

    //handle mongo error
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
      // we're connected!
    });

    // use sessions for tracking logins
    // TODO: use env var for secret, using npm script
    expressServer.use(session({
      secret: 'shit sandwich dawg',
      resave: false,
      saveUninitialized: true,
      store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'interval',
        autoRemoveInterval: 10,
      })
    }));

    // configure server to use bodyParser()
    // this will let us get the data from a POST
    expressServer.use(bodyParser.urlencoded({extended: true}));
    expressServer.use(bodyParser.json());

    const router = express.Router();

    // include our routes
    routes.setRoutes(router);

    // REGISTER OUR ROUTES
    // all of our routes will be prefixed with /api
    expressServer.use('/api', router);

    // middleware to use for all requests
    expressServer.use(express.static('dist/client'));

    return expressServer;
  }
};

module.exports = server;
