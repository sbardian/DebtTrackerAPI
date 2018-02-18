import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    require: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
  },
  passwordConf: {
    type: String,
    require: true,
  },
});

// authenticate input against database
UserSchema.statics.authenticate = (email, password, callback) => {
  User.findOne({ email }).exec((err, user) => {
    if (err) {
      return callback(err);
    } else if (!user) {
      const error = new Error('User not found.');
      error.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result === true) {
        return callback(null, user);
      }
      return callback();
    });
  });
};

// hashing a password before storing it to the database
UserSchema.pre('save', next => {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
