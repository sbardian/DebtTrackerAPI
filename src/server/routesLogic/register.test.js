import request from 'supertest';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import { server } from '../server';
import {
  SUCCESS_REGISTER_MOCK_USER,
  NO_USERNAME_MOCK_USER,
  BAD_PASSWORD_CONF_MOCK_USER,
} from '../testEnv/fixtures';

let db;
let users;

beforeEach(async () => {
  mongoose.connect(global.__MONGO_URI__, {
    useMongoClient: true,
    promiseLibrary: bluebird,
  });
  db = await mongoose.connection;
  users = await db.collection('users');
});

afterEach(async () => {
  await users.remove({});
  await db.close();
});

describe('Test /register API paths', () => {
  describe('Register success', () => {
    it('Register success, return 200 status: ', () =>
      request(server)
        .post('/auth/register')
        .type('form')
        .set('Accept', 'text/html, application/json')
        .send(SUCCESS_REGISTER_MOCK_USER)
        .expect(200));
  });
  describe('Register no username', () => {
    it('Register failure, return 400 status: ', () =>
      request(server)
        .post('/auth/register')
        .type('form')
        .set('Accept', 'text/html, application/json')
        .send(NO_USERNAME_MOCK_USER)
        .expect(400));
  });
  // TODO: validate password and passwordConf match in client
  describe('Register Passwords do not match', () => {
    it('Register failure, return 400 status: ', () =>
      request(server)
        .post('/auth/register')
        .type('form')
        .set('Accept', 'text/html, application/json')
        .send(BAD_PASSWORD_CONF_MOCK_USER)
        .expect(400));
  });
});
