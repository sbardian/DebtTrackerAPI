import express from 'express';
import historyApiFallback from 'connect-history-api-fallback';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectToDatabase from './db-connect';
import { apiRoutes } from './apiRoutes';
import { authRoutes } from './authRoutes';
import { adminRoutes } from './adminRoutes';
import { checkAuth, checkAdmin } from './routesLogic';
import { config } from './yargs';
import log from './logger';

const MongoStore = require('connect-mongo')(session);

export default () => {
  const { sessionSecret } = config;
  const expressServer = express();
  const router = express.Router();

  if (process.env.NODE_ENV !== 'test') {
    const db = connectToDatabase();

    db.on('error', () => log.error('Error connecting to database 🙀'));
    db.once('open', () => log.info('Connected to the database 😺'));

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

  const corsOptions = {
    credentials: true,
    origin: true,
  };
  expressServer.use(cors(corsOptions));
  expressServer.use(bodyParser.urlencoded({ extended: true }));
  expressServer.use(bodyParser.json());
  expressServer.use('/auth', authRoutes(router));
  expressServer.use('/api', checkAuth, apiRoutes(router));
  expressServer.use('/admin', checkAdmin, adminRoutes(router));

  const staticContent = express.static('dist/client');
  expressServer.use(staticContent);

  expressServer.use(
    historyApiFallback({
      disableDotRule: true,
      verbose: true,
    }),
  );

  expressServer.use(staticContent);
  return expressServer;
};
