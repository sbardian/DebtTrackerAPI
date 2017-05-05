/**
 * Created by sbardian on 5/1/17.
 */

var mongoose = require('mongoose');
var bluebird = require('bluebird');

mongoose.Promise = bluebird;

// Create a schema
var TotalsSchema = new mongoose.Schema({
  user: String,
  total: Number,
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Totals', TotalsSchema);