'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    require: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    require: true,
    trim: true
  },
  password: {
    type: String,
    require: true
  },
  passwordConf: {
    type: String,
    require: true
  }
});

// authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email }).exec(function (err, user) {
    if (err) {
      return callback(err);
    } else if (!user) {
      const err = new Error('User not found.');
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback();
      }
    });
  });
};

// hashing a password before storing it to the database
UserSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
//# sourceMappingURL=User.js.map