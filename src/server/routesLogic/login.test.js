import request from 'supertest';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import { server } from '../server';
import { MOCK_USER } from '../testEnv/fictures';

beforeAll(async () => {
  mongoose.connect(global.__MONGO_URI__, {
    useMongoClient: true,
    promiseLibrary: bluebird,
  });

  const db = await mongoose.connection;
  const users = await db.collection('users');
  // await request(server)
  //   .post('/auth/register')
  //   .type('form')
  //   .set('Accept', 'text/html, application/json')
  //   .send(MOCK_USER)
  //   .expect(200);
  await users.insertOne(MOCK_USER);
});

describe('Test API paths', () => {
  describe('Test Login', () => {
    it('Login success, return 200 status: ', () =>
      request(server)
        .post('/auth/login')
        .set('Accept', 'text/html, application/json')
        .send({ email: MOCK_USER.email, password: MOCK_USER.passwordConf })
        .expect(200));
    it('Login failure, return 401 status: ', () =>
      request(server)
        .post('/auth/login')
        .set('Accept', 'text/html, application/json')
        .send({ email: MOCK_USER.email, password: 'InvalidPassword' })
        .expect(401));
  });
});
