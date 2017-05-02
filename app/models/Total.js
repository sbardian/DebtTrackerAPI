/**
 * Created by sbardian on 5/1/17.
 */

var mongoose = require('mongoose');
var bluebird = require('bluebird');

mongoose.connect('mongodb://localhost/DeptTracker');

mongoose.Promise = bluebird;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to db');
});

// Create a schema
var TotalsSchema = new mongoose.Schema({
  user: String,
  total: Number,
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Totals', TotalsSchema);