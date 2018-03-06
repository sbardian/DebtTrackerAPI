import request from 'supertest';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import { server } from '../server';
import { LOGIN_MOCK_USER } from '../testEnv/fixtures';

let db;
let users;

beforeAll(async () => {
  mongoose.connect(global.__MONGO_URI__, {
    useMongoClient: true,
    promiseLibrary: bluebird,
  });
  db = await mongoose.connection;
  users = await db.collection('users');
  await users.insertOne(LOGIN_MOCK_USER);
});

afterAll(async () => {
  await users.remove({});
  await db.close();
});

describe('Test Login API paths', () => {
  it('Login success, return 200 status: ', () =>
    request(server)
      .post('/auth/login')
      .set('Accept', 'text/html, application/json')
      .send({
        email: LOGIN_MOCK_USER.email,
        password: LOGIN_MOCK_USER.passwordConf,
      })
      .expect(200));
  it('Login failure, return 401 status: ', () =>
    request(server)
      .post('/auth/login')
      .set('Accept', 'text/html, application/json')
      .send({ email: LOGIN_MOCK_USER.email, password: 'InvalidPassword' })
      .expect(401));
});
