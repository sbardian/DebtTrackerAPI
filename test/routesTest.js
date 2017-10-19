/**
 * Created by sbardian on 5/4/17.
 */

const server = require('../src/server/server');
const describe = require('mocha').describe;
const it = require('mocha').it;
const before = require('mocha').before;
const after = require('mocha').after;
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

// Test API Server
describe('API Server', () => {
  let srv;
  let createdCardID;
  let totalID;
  before(() => {
    chai.use(chaiHttp);
    srv = server.listen(5555);
  });
  after(() => {
    srv.close();
  });

  // Test GET on api root to confirm API is up
  it('Get / should return status 200 or 304', (done) => {
    chai.request('http://localhost:5555/api')
        .get('/')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          done();
        });
  });

  // Test GET on api creditcards route
  it('Get all creditcards /api/creditcards, should return 200 or 304', (done) => {
    chai.request('http://localhost:5555/api')
        .get('/creditcards')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          done();
        });
  });
/*
  // Test POST on api creditcards route - ERROR
  it('Post new credit card to /api/creditcards, should return json with message equal to '+
      '-Error adding data- : ERROR', (done) => {
    chai.request('http://localhost:5555/api')
        .post('/creditcards')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          id: 'error'
        })
        .end((err, res) => {
      console.log('err = ', err ,', res body = ', res.body);
          expect(err.body.message).to.equal('Error adding data');
          expect(res).to.equal(null);
          done();
        });
  });
*/
  // Test POST on api creditcards route - SUCCESS
  it('Post new credit card to /api/creditcards, should return json with message equal to '+
      '-Data added- : SUCCESS', (done) => {
    chai.request('http://localhost:5555/api')
        .post('/creditcards')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          user: 'test',
          name: 'Test Card',
          limit: 12000,
          balance: 5000,
          interest_rate: 12,
        })
        .end((err, res) => {
          createdCardID = res.body.id;
          expect(err).to.equal(null);
          expect(res.body.message).to.equal('Data added');
          done();
        });
  });

  // Test GET creditcard by ID
  it('Get credit card by ID from /api/creditcards/:id, should return card with correct ID', (done) => {
    chai.request('http://localhost:5555/api')
        .get(`/creditcards/${createdCardID}`)
        .end((err, res) => {
          expect(err).to.be.equal(null);
          expect(res.body.message._id).to.equal(createdCardID);
          done();
        });
  });

  // Test PUT creditcard by ID
  it('Update credit card info with Put to /api/creditcards/:id, should return json ' +
      'with message -Data is updated for Test Card-', (done) => {
    chai.request('http://localhost:5555/api')
        .put(`/creditcards/${createdCardID}`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          user: 'test',
          name: 'Test Card',
          limit: 12000,
          balance: 5000,
          interest_rate: 12,
        })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.body.message).to.equal('Data is updated for Test Card');
          done();
        });
  });

  // Test DELETE on api creditcard route
  it('Delete credit card to /api/creditcards/:id, should return json', (done) => {
    chai.request('http://localhost:5555/api')
        .delete(`/creditcards/${createdCardID}`)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.body.message).to.equal(`Data associated with ${createdCardID} is deleted`);
          done();
        });
  });

  // POST total to database
  it('Adds total to /api/totals, returns json.', (done) => {
    chai.request('http://localhost:5555/api')
        .post('/totals')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          user: 'test',
          total: 5000,
        })
        .end((err, res) => {
          totalID = res.body.id;
          expect(err).to.equal(null);
          expect(res.body.message).to.equal('Data added');
          done();
        });
  });

  // Test GET totals on api totals route
  it('Get all totals to /api/totals, should return json.', (done) => {
    chai.request('http://localhost:5555/api')
        .get('/totals')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          done();
        });
  });

  // Test DELETE total on api totals:id route
  it('Delete total to /api/totals/:id, should return json.', (done) => {
    chai.request('http://localhost:5555/api')
        .delete(`/totals/${totalID}`)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.body.message).to.equal(`Data associated with ${totalID} is deleted`);
          done();
        });
  });

});
