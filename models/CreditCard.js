/**
 * Created by sbardian on 12/12/16.
 */
/**
 * Created by sbardian on 12/11/16.
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/DeptTracker');

console.log('credit card dog');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected to db');
});

// Create a schema
var CreditCardSchema = new mongoose.Schema({
    name: String,
    credit_line: Number,
    balance: Number,
    interest_rate: Number,
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CreditCard', CreditCardSchema);