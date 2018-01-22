/**
 * Created by sbardian on 12/12/16.
 */

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

// Create a schema
const CreditCardSchema = new mongoose.Schema({
  userId: String,
  name: String,
  limit: Number,
  balance: Number,
  interest_rate: Number,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CreditCard', CreditCardSchema);
