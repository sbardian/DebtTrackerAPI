'use strict';

/**
 * Created by sbardian on 5/1/17.
 */

const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;

// Create a schema
const TotalsSchema = new mongoose.Schema({
  user: String,
  total: Number,
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Totals', TotalsSchema);
//# sourceMappingURL=Total.js.map