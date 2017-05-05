/**
 * Created by sbardian on 5/4/17.
 */

const server = require('../server/server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

describe('Server', function () {
  let srv;
  before(function () {
    chai.use(chaiHttp);
    srv = server.listen(5555);
  });
  after(function () {
    srv.close();
  });
  it('Get / should return Json', function (done) {
    chai.request('http://localhost:5555/api')
        .get('/')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.be.json;
          done();
        });
  });
});