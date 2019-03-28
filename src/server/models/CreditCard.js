import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

const CreditCardSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  limit: {
    type: Number,
    require: true,
  },
  balance: {
    type: Number,
    require: true,
  },
  interest_rate: {
    type: Number,
    require: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CreditCard', CreditCardSchema);
