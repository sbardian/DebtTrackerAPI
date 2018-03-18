import session from 'supertest-session';
import mockingoose from 'mockingoose';
import { server } from '../server';
import {
  CREDIT_CARD,
  INVALID_CREDIT_CARD,
  LOGIN_SUCCESS_MOCK_USER,
} from '../testEnv/fixtures';

jest.mock('./checkAuth');

describe('Test /creditcards API routes', () => {
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

  describe('Test addCreditCard', () => {
    it('addCreditCard success, return 200 status, and error = false', async () => {
      mockingoose.CreditCard.toReturn(CREDIT_CARD, 'save');
      const response = await serverSession
        .post('/api/creditcards')
        .set('Accept', 'text/html, application/json')
        .send(CREDIT_CARD);
      expect(response.body.data.limit).toEqual(10000);
    });
    it('addCreditCard failure, error = true', async () => {
      mockingoose.CreditCard.toReturn(INVALID_CREDIT_CARD, 'save');
      const response = await serverSession
        .post('/api/creditcards')
        .set('Accept', 'text/html, application/json')
        .send(INVALID_CREDIT_CARD);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toEqual(
        'Error adding data, all fields required',
      );
    });
  });
});
