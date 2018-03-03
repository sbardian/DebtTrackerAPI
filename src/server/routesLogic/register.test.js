import request from 'supertest';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import { server } from '../server';
import {
  SUCCESS_REGISTER_MOCK_USER,
  NO_USERNAME_MOCK_USER,
  BAD_PASSWORD_CONF_MOCK_USER,
} from '../testEnv/fictures';

let db;
let users;

beforeAll(async () => {
  mongoose.connect(global.__MONGO_URI__, {
    useMongoClient: true,
    promiseLibrary: bluebird,
  });
  db = await mongoose.connection;
});

afterAll(async () => {
  await users.removeAll({});
  await db.close();
});

describe('Test /register API paths', () => {
  it('Register success, return 200 status: ', () =>
    request(server)
      .post('/auth/register')
      .type('form')
      .set('Accept', 'text/html, application/json')
      .send(SUCCESS_REGISTER_MOCK_USER)
      .expect(200));
  it('Register failure. No username, return 400 status: ', () =>
    request(server)
      .post('/auth/register')
      .type('form')
      .set('Accept', 'text/html, application/json')
      .send(NO_USERNAME_MOCK_USER)
      .expect(400));
  // TODO: validate password and passwordConf match in client
  it('Register failure. Passwords do not match, return 400 status: ', () =>
    request(server)
      .post('/auth/register')
      .type('form')
      .set('Accept', 'text/html, application/json')
      .send(BAD_PASSWORD_CONF_MOCK_USER)
      .expect(400));
});
