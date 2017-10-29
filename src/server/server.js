import express from 'express';
import historyApiFallback from 'connect-history-api-fallback';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import apiRoutes from './apiRoutes';
import authRoutes from './authRoutes';
import routesLogic from './routesLogic';

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

    mongoose.connect('mongodb://localhost/DeptTracker', {
      useMongoClient: true,
      promiseLibrary: bluebird,
    });

    const db = mongoose.connection;

    // handle mongo error
    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', () => {
      // Connected!
    });

    // use sessions for tracking logins
    // TODO: use env var for secret, using npm script
    expressServer.use(
      session({
        secret: 'shit sandwich dawg',
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({
          mongooseConnection: db,
          autoRemove: 'interval',
          autoRemoveInterval: 10,
        }),
      }),
    );

    // configure server to use bodyParser()
    // this will let us get the data from a POST
    expressServer.use(bodyParser.urlencoded({ extended: true }));
    expressServer.use(bodyParser.json());

    // routes to login/register/logout
    expressServer.use('/auth', authRoutes);

    // REGISTER OUR API ROUTES
    // all of our routes will be prefixed with /api
    expressServer.use('/api', routesLogic.checkAuth, apiRoutes);

    // middleware to use for all requests
    const expressStatic = express.static('dist/client');
    expressServer.use(expressStatic);
    expressServer.use(
      historyApiFallback({
        disableDotRule: true,
        verbose: true,
      }),
    );
    expressServer.use(expressStatic);

    return expressServer;
  },
};

module.exports = server;
