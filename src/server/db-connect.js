/* eslint-disable no-console */
import mongoose from 'mongoose';
import { config } from './yargs';

export default () => {
  const { databaseUrl } = config;

  mongoose.connect(databaseUrl, {
    useCreateIndex: true,
    promiseLibrary: global.Promise,
    useNewUrlParser: true,
  });

  const db = mongoose.connection;

  return db;
};
