import mongoose from 'mongoose';
import bluebird from 'bluebird';
import request from 'supertest';
import session from 'supertest-session';
import logger from 'console';
import { server } from '../server';
import { LOGIN_MOCK_USER, CREDIT_CARDS } from '../testEnv/fixtures';

jest.mock('./checkAuth');

let serverSession;
let db;
let users;
let creditCards;
let userId;

beforeAll(async () => {
  // setup mock session
  serverSession = session(server);

  // configure connection to in mem mongodb
  mongoose.connect(global.__MONGO_URI__, {
    useMongoClient: true,
    promiseLibrary: bluebird,
  });
  db = await mongoose.connection;

  // get users collection
  users = await db.collection('users');

  // get creditCards collection
  creditCards = await db.collection('creditcards');

  // insert our mock user
  await users.insertOne(LOGIN_MOCK_USER);

  await serverSession
    .post('/auth/login')
    .set('Accept', 'text/html, application/json')
    .send({
      email: LOGIN_MOCK_USER.email,
      password: LOGIN_MOCK_USER.passwordConf,
    })
    .expect(200)
    .then(response => {
      userId = response.body.userId;
    });

  // insert our mock credit cards
  await creditCards.insertOne(Object.assign(CREDIT_CARDS, { userId }));
});

afterAll(async () => {
  await users.remove({});
  await db.close();
});

describe('Test creditCards API paths', () => {
  describe('Test getAllCreditCards', () => {
    it('getAllCreditCards success, return 200 status, and error = false: ', async () => {
      const response = await serverSession
        .get('/api/creditcards')
        .set('Accept', 'text/html, application/json')
        .expect(200);
      expect(response.body.message[0].limit).toEqual(10000);
    });
    it('getAllCreditCards failure no userId, return 302 status, and error = true: ', () => {
      request(server)
        .get('/api/creditcards')
        .set('Accept', 'text/html, application/json')
        .expect(302);
    });
  });
  describe('Test addCreditCard', () => {
    it('addCreditCard success, return 200 status, and error = false: ', async () => {
      const response = await serverSession
        .post('/api/creditcards')
        .set('Accept', 'text/html, application/json')
        .send(Object.assign(CREDIT_CARDS, { userId }))
        .expect(200);
      logger.info('response = ', response.body);
      expect(response.body.message).toEqual('Data added');
    });
  });
});
