import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

const TotalSchema = new mongoose.Schema({
  userId: String,
  total: Number,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Total', TotalSchema);
