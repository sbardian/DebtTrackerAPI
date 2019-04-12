import session from 'supertest-session';
import mockingoose from 'mockingoose';
import createServer from '../server';
import {
  VALID_USERID,
  CREDIT_CARD,
  INVALID_CREDIT_CARD,
  LOGIN_SUCCESS_MOCK_USER,
} from '../testEnv/fixtures';

jest.mock('./checkAuth');

describe('Test /creditcards API routes', () => {
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

  describe('Test getCreditCards', () => {
    it('getCreditCards success, return 200 status, and error = false', async () => {
      mockingoose.CreditCard.toReturn(CREDIT_CARD, 'find');
      const response = await serverSession
        .get('/api/creditcards')
        .set('Accept', 'text/html, application/json');
      expect(response.statusCode).toBe(200);
      expect(response.error).toEqual(false);
    });
    it('getCreditCards failure, find User error, return 400 status, and error = true', async () => {
      mockingoose.CreditCard.toReturn(new Error('Error'), 'find');
      const response = await serverSession
        .get('/api/creditcards')
        .set('Accept', 'text/html application/json');
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(true);
    });
    it('getCreditCards failure, find CreditCard, return 400 status, and error = true', async () => {
      mockingoose.CreditCard.toReturn(new Error('Error'), 'find');
      const response = await serverSession
        .get('/api/creditcards')
        .set('Accept', 'text/html application/json');
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(true);
    });
  });

  describe('Test getCreditCardById', () => {
    it('getCreditCardById success, return 200 status, and error = false', async () => {
      mockingoose.CreditCard.toReturn(CREDIT_CARD, 'findOne');
      const response = await serverSession
        .get('/api/creditcards/8675309')
        .set('Accept', 'text/html application/json');
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toEqual(false);
    });
    it('getCreditCardById failure, return 400 status, and error = true', async () => {
      mockingoose.CreditCard.toReturn(new Error('Error'), 'findOne');
      const response = await serverSession
        .get('/api/creditcards/8675309')
        .set('Accept', 'text/html application/json');
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(true);
    });
  });

  describe('Test addCreditCard', () => {
    it('addCreditCard success, return 200 status, and error = false', async () => {
      mockingoose.CreditCard.toReturn(CREDIT_CARD, 'save');
      const data = await serverSession
        .post('/api/creditcards')
        .set('Accept', 'text/html, application/json')
        .send(CREDIT_CARD);
      expect(data.body.creditCard.limit).toEqual(10000);
    });
    it('addCreditCard failure, return 400 status, error = true', async () => {
      mockingoose.CreditCard.toReturn(new Error('Error adding data'), 'save');
      const response = await serverSession
        .post('/api/creditcards')
        .set('Accept', 'text/html, application/json')
        .send(INVALID_CREDIT_CARD);
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toEqual('Error adding data');
    });
  });

  describe('Test deleteCreditCard', () => {
    it('deleteCreditCard success, return 200 status, and error = false', async () => {
      mockingoose.CreditCard.toReturn(VALID_USERID, 'findOne').toReturn(
        VALID_USERID,
        'deleteOne',
      );
      const response = await serverSession
        .delete('/api/creditcards/8675309')
        .set('Accept', 'text/html application/json');
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toEqual(false);
    });
    it('deleteCreditCard failure, invalid userId, return 400 status, and error = true', async () => {
      mockingoose.CreditCard.toReturn(new Error('Error'), 'findOne').toReturn(
        VALID_USERID,
        'deleteOne',
      );
      const response = await serverSession
        .delete('/api/creditcards/8675309')
        .set('Accept', 'text/html application/json');
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(true);
    });
    it('deleteCreditCard failure, invalid credit card, return 400 status, and error = true', async () => {
      mockingoose.CreditCard.toReturn(VALID_USERID, 'findOne').toReturn(
        new Error('Error'),
        'deleteOne',
      );
      const response = await serverSession
        .delete('/api/creditcards/8675309')
        .set('Accept', 'text/html application/json');
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(true);
    });
  });

  describe('Test putOrUpdate', () => {
    it('putOrUpdate success, return 200 status, and error = false', async () => {
      mockingoose.CreditCard.toReturn(CREDIT_CARD, 'findOne').toReturn(
        CREDIT_CARD,
        'save',
      );
      const response = await serverSession
        .put('/api/creditcards/8675309')
        .set('Accept', 'text/html application/json')
        .send(CREDIT_CARD);
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toEqual(false);
    });
    it('putOrUpdate failure, find error, return 400 status, and error = true', async () => {
      mockingoose.CreditCard.toReturn(new Error('Error'), 'findOne').toReturn(
        CREDIT_CARD,
        'save',
      );
      const response = await serverSession
        .put('/api/creditcards/8675309')
        .set('Accept', 'text/html application/json')
        .send(CREDIT_CARD);
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(true);
    });
    it('putOrUpdate failure, update error, return 400 status, and error = true', async () => {
      mockingoose.CreditCard.toReturn(CREDIT_CARD, 'findOne').toReturn(
        new Error('Error'),
        'save',
      );
      const response = await serverSession
        .put('/api/creditcards/8675309')
        .set('Accept', 'text/html application/json')
        .send(CREDIT_CARD);
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(true);
    });
  });
});
