'use strict';

var _authRoutes = require('./authRoutes');

var _authRoutes2 = _interopRequireDefault(_authRoutes);

var _connectHistoryApiFallback = require('connect-history-api-fallback');

var _connectHistoryApiFallback2 = _interopRequireDefault(_connectHistoryApiFallback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./apiRoutes');

const session = require('express-session');
const mongoose = require('mongoose');

const bluebird = require('bluebird');
const cors = require('cors');
const MongoStore = require('connect-mongo')(session);
const routesLogic = require('./routesLogic');

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
      origin: true
    };

    expressServer.use(cors(corsOptions));

    mongoose.connect('mongodb://localhost/DeptTracker', { useMongoClient: true,
      promiseLibrary: bluebird
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
        autoRemoveInterval: 10
      })
    }));

    // configure server to use bodyParser()
    // this will let us get the data from a POST
    expressServer.use(bodyParser.urlencoded({ extended: true }));
    expressServer.use(bodyParser.json());

    expressServer.use(function (req, res, next) {
      if (!req.session.userId) {
        return res.redirect('/login');
      } else {
        next();
      }
    });

    // route to login/register/logout
    expressServer.use(_authRoutes2.default);

    // REGISTER OUR API ROUTES
    // all of our routes will be prefixed with /api
    expressServer.use('/api', routesLogic.checkAuth, apiRoutes);

    // middleware to use for all requests
    const expressStatic = express.static('dist/client');
    expressServer.use(expressStatic);
    expressServer.use((0, _connectHistoryApiFallback2.default)({
      disableDotRule: true,
      verbose: true
    }));
    expressServer.use(expressStatic);

    return expressServer;
  }
};

module.exports = server;
//# sourceMappingURL=server.js.map