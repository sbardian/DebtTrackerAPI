import session from 'supertest-session';
import mockingoose from 'mockingoose';
import createServer from '../server';
import { LOGIN_SUCCESS_MOCK_USER } from '../testEnv/fixtures';

jest.mock('./checkAuth');

describe('Test /logout route', () => {
  const server = createServer();
  const serverSession = session(server);
  beforeAll(async () => {
    mockingoose.User.toReturn(LOGIN_SUCCESS_MOCK_USER, 'findOne');
    await serverSession
      .post('/auth/login')
      .set('Accept', 'text/html, application/json')
      .send({
        email: LOGIN_SUCCESS_MOCK_USER.email,
        password: LOGIN_SUCCESS_MOCK_USER.passwordConf,
      })
      .expect(200);
  });

  describe('Test logout', () => {
    it('logout success, return 200 status, and error = false', async () => {
      const response = await serverSession
        .get('/auth/logout')
        .set('Accept', 'text/html, application/json');
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toEqual(false);
    });
    it('logout failure, return 400 status, and error = true', async () => {
      const fakeSession = session(server, {
        before: async req => {
          delete req.session;
          const response = await fakeSession
            .get('/auth/logout')
            .set('Accept', 'text/html, application/json');
          expect(response.statusCode).toBe(400);
          expect(response.body.error).toEqual(true);
        },
      });
    });
  });
});
