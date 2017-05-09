/**
 * Created by sbardian on 5/4/17.
 */

const server = require('../server/server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

// Test API Server
describe('API Server', function () {
  let srv;
  let createdCardID;
  before(function () {
    chai.use(chaiHttp);
    srv = server.listen(5555);
    console.log('Server listening on port 5555');
  });
  after(function () {
    srv.close();
  });

  // Test GET on api root to confirm API is up
  it('Get / should return Json', function (done) {
    console.log('running GET...');
    chai.request('http://localhost:5555/api')
        .get('/')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.be.json;
          done();
        });
  });

  // Test GET on api creditcards route
  it('Get all creditcards /api/creditcards, should return json', function (done) {
    console.log('Attempting to get all credit cards...');
    chai.request('http://localhost:5555/api')
        .get('/creditcards')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.be.json;
          done();
        });
  });

  // Test POST on api creditcards route
  it('Post new credit card to /api/creditcards, should return json', function (done) {
    console.log('Attempting to post a creditcard...');
    chai.request('http://localhost:5555/api')
        .post('/creditcards')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          user: 'test',
          name: 'Test Card',
          limit: 12000,
          balance: 5000,
          interest_rate: 12
        })
        .end(function (err, res) {
          createdCardID = res.body.id;
          expect(err).to.be.null;
          expect(res.body.message).to.equal('Data added');
          done();
        });
  });

  // Test GET creditcard by ID
  it('Get credit card by ID from /api/creditcards/:id, should return json', function (done) {
    console.log('Attempting to get a creditcard by id...');
    chai.request('http://localhost:5555/api')
        .get('/creditcards/' + createdCardID)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res.body.message._id).to.equal(createdCardID);
          done();
        });
  });

  // Test PUT creditcard by ID
  it('Update credit card info with Put to /api/creditcards/:id, should return json', function (done) {
    console.log('Attempting to update credit card by id...');
    chai.request('http://localhost:5555/api')
        .put('/creditcards/' + createdCardID)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          user: 'test',
          name: 'Test Card',
          limit: 12000,
          balance: 5000,
          interest_rate: 12
        })
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res.body.message).to.equal('Data is updated for Test Card');
          done();
        });
  });

  // Test DELETE on api creditcard route
  it('Delete credit card to /api/creditcards/:id, should return json', function (done) {
    console.log('Attempting to delete creditcard with ID ' + createdCardID);
    chai.request('http://localhost:5555/api')
        .delete('/creditcards/' + createdCardID)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res.body.message).to.equal('Data associated with ' + createdCardID + ' is deleted');
          done();
        });
  });
});
