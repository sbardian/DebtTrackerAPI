import request from 'supertest';
import { server } from '../server';
import { SUCCESS_REGISTER_MOCK_USER } from '../testEnv/fictures';

describe('Test Register API paths', () => {
  it('Register success, return 200 status: ', () =>
    request(server)
      .post('/auth/register')
      .type('form')
      .set('Accept', 'text/html, application/json')
      .send(SUCCESS_REGISTER_MOCK_USER)
      .expect(200));
});
