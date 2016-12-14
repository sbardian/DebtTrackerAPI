/**
 * Created by sbardian on 12/12/16.
 */

let express = require('express');
let app = express();
let bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let router = express.Router();

// middleware to use for all requests
app.use(express.static('public'));

// include our routes
let routes = require('./routes')(router);

// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api
app.use('/api', router);

// Send index.html for requests to /
app.get('/', function(req, res) {
    console.log('get index');
    res.sendfile('/index.html');
});

// START THE SERVER
app.listen('9090');
