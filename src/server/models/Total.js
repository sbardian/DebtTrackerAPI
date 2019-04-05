import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const TotalSchema = new mongoose.Schema({
  userId: String,
  total: Number,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Total', TotalSchema);
