/* eslint-disable no-console */
import express from 'express';
import historyApiFallback from 'connect-history-api-fallback';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import { apiRoutes } from './apiRoutes';
import { authRoutes } from './authRoutes';
import { checkAuth } from './routesLogic';
import { config } from './yargs';

const MongoStore = require('connect-mongo')(session);

// Initialize server, and routes.
const { databaseUrl, sessionSecret } = config;
const expressServer = express();
const router = express.Router();

const corsOptions = {
  credentials: true,
  origin: true,
};

expressServer.use(cors(corsOptions));

// Only load DB when in production
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(
    databaseUrl,
    {
      promiseLibrary: bluebird,
      useNewUrlParser: true,
    },
  );

  const db = mongoose.connection;

  // handle mongo error
  db.on('error', () => console.error('connection error:'));

  db.once('open', () => {
    console.info('Connected to the database!');
  });

  expressServer.use(
    session({
      name: 'DT_Session',
      secret: sessionSecret,
      resave: false,
      saveUninitialized: true,
      store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'interval',
        autoRemoveInterval: 10,
      }),
    }),
  );
} else {
  expressServer.use(
    session({
      name: 'DT_Session',
      secret: sessionSecret,
      resave: false,
      saveUninitialized: true,
    }),
  );
}

// configure server to use bodyParser()
// this will let us get the data from a POST
expressServer.use(bodyParser.urlencoded({ extended: true }));
expressServer.use(bodyParser.json());

// routes to login/register/logout
expressServer.use('/auth', authRoutes(router));

// REGISTER OUR API ROUTES
// all of our routes will be prefixed with /api
expressServer.use('/api', checkAuth, apiRoutes(router));

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

export { expressServer as server };
