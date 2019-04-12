import session from 'supertest-session';
import mockingoose from 'mockingoose';
import createServer from '../server';
import {
  LOGIN_SUCCESS_MOCK_USER,
  LOGIN_SUCCESS_MOCK_USER_ADMIN,
} from '../testEnv/fixtures';

jest.mock('./checkAuth');

describe('Test /login API routes', () => {
  const server = createServer();
  const serverSession = session(server);

  it('Login success is Admin, return 200 status: ', async () => {
    mockingoose.User.toReturn(LOGIN_SUCCESS_MOCK_USER_ADMIN, 'findOne');
    const response = await serverSession
      .post('/auth/login')
      .set('Accept', 'text/html, application/json')
      .send({
        email: LOGIN_SUCCESS_MOCK_USER.email,
        password: LOGIN_SUCCESS_MOCK_USER.passwordConf,
      });
    expect(response.statusCode).toBe(200);
  });
  it('Login success not Admin, return 200 status: ', async () => {
    mockingoose.User.toReturn(LOGIN_SUCCESS_MOCK_USER, 'findOne');
    const response = await serverSession
      .post('/auth/login')
      .set('Accept', 'text/html, application/json')
      .send({
        email: LOGIN_SUCCESS_MOCK_USER.email,
        password: LOGIN_SUCCESS_MOCK_USER.passwordConf,
      });
    expect(response.statusCode).toBe(200);
  });
  it('Login failure, bad password, return 401 status: ', async () => {
    mockingoose.User.toReturn(LOGIN_SUCCESS_MOCK_USER, 'findOne');
    const response = await serverSession
      .post('/auth/login')
      .set('Accept', 'text/html, application/json')
      .send({
        email: LOGIN_SUCCESS_MOCK_USER.email,
        password: 'InvalidPassword',
      });
    expect(response.statusCode).toBe(401);
  });
  it('Login failure, no password, return 401 status: ', async () => {
    mockingoose.User.toReturn(LOGIN_SUCCESS_MOCK_USER, 'findOne');
    const response = await serverSession
      .post('/auth/login')
      .set('Accept', 'text/html, application/json')
      .send({
        email: LOGIN_SUCCESS_MOCK_USER.email,
        password: null,
      });
    expect(response.statusCode).toBe(401);
  });
});
