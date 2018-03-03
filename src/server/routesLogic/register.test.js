import request from 'supertest';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import { server } from '../server';
import { SUCCESS_REGISTER_MOCK_USER } from '../testEnv/fictures';

let db;
let users;

beforeAll(async () => {
  mongoose.connect(global.__MONGO_URI__, {
    useMongoClient: true,
    promiseLibrary: bluebird,
  });
  db = await mongoose.connection;
  // users = await db.collection('users');
  // await users.insertOne(LOGIN_MOCK_USER);
});

afterAll(async () => {
  await users.removeAll({});
  await db.close();
});
describe('Test Register API paths', () => {
  it('Register success, return 200 status: ', () =>
    request(server)
      .post('/auth/register')
      .type('form')
      .set('Accept', 'text/html, application/json')
      .send(SUCCESS_REGISTER_MOCK_USER)
      .expect(200));
});
