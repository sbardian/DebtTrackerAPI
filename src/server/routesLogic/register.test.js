import session from 'supertest-session';
import mockingoose from 'mockingoose';
import { server } from '../server';
import {
  SUCCESS_REGISTER_MOCK_USER,
  NO_USERNAME_MOCK_USER,
  BAD_PASSWORD_CONF_MOCK_USER,
} from '../testEnv/fixtures';

describe('Test /register API routes', () => {
  const serverSession = session(server);

  it('Register success, return 200 status: ', async () => {
    mockingoose.User.toReturn(SUCCESS_REGISTER_MOCK_USER, 'save');
    const respons = await serverSession
      .post('/auth/register')
      .type('form')
      .set('Accept', 'text/html, application/json')
      .send(SUCCESS_REGISTER_MOCK_USER);
    expect(respons.statusCode).toBe(200);
  });
  it('Register failure no username, return 400 status: ', async () => {
    mockingoose.User.toReturn(NO_USERNAME_MOCK_USER, 'save');
    const response = await serverSession
      .post('/auth/register')
      .type('form')
      .set('Accept', 'text/html, application/json')
      .send(NO_USERNAME_MOCK_USER);
    expect(response.statusCode).toBe(400);
  });
  // TODO: validate password and passwordConf match in client
  it('Register failure password do not match, return 400 status: ', async () => {
    mockingoose.User.toReturn(BAD_PASSWORD_CONF_MOCK_USER, 'save');
    const response = await serverSession
      .post('/auth/register')
      .type('form')
      .set('Accept', 'text/html, application/json')
      .send(BAD_PASSWORD_CONF_MOCK_USER);
    expect(response.statusCode).toBe(400);
  });
});
