/**
 * Created by sbardian on 5/4/17.
 */

const mongoose = require('mongoose');
const bluebird = require('bluebird');

const connectDB = {
  connect() {
    mongoose.Promise = bluebird;
    mongoose.connect('mongodb://localhost/DeptTracker');

    const db = mongoose.connection;
  // db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      // console.log('Connected to DB');
    });
  },
};

module.exports = connectDB;
