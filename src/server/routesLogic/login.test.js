import session from 'supertest-session';
import mockingoose from 'mockingoose';
import { server } from '../server';
import { LOGIN_SUCCESS_MOCK_USER } from '../testEnv/fixtures';

jest.mock('./checkAuth');

describe('Test /login API routes', () => {
  const serverSession = session(server);

  it('Login success, return 200 status: ', async () => {
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
