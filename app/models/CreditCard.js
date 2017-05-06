/**
 * Created by sbardian on 12/12/16.
 */

var mongoose = require('mongoose');
var bluebird = require('bluebird');

mongoose.Promise = bluebird;

mongoose.connect('mongodb://localhost/DeptTracker');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected to db');
});

// Create a schema
var CreditCardSchema = new mongoose.Schema({
  user: String,
  name: String,
  limit: Number,
  balance: Number,
  interest_rate: Number,
  updated_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model('CreditCard', CreditCardSchema);