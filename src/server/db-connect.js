import mongoose from 'mongoose';
import bluebird from 'bluebird';
import { config } from './yargs';

const connectToDatabase = () => {
  const { databaseUrl } = config;
  mongoose.connect(databaseUrl, {
    promiseLibrary: bluebird,
    useNewUrlParser: true,
  });

  const db = mongoose.connection;
  db.on('error', () => console.error('connection error:'));
  db.once('open', () => {
    console.info('Connected to the database!');
  });

  return db;
};

export default connectToDatabase;
