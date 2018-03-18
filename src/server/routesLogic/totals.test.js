import session from 'supertest-session';
import mockingoose from 'mockingoose';
import { server } from '../server';
import {
  LOGIN_SUCCESS_MOCK_USER,
  VALID_TOTAL,
  INVALID_TOTAL,
  INVALID_FINDING_TOTAL,
  INVALID_DELETING_TOTAL,
} from '../testEnv/fixtures';

jest.mock('./checkAuth');

describe('Test /totals API routes', () => {
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

  describe('Test getTotals', () => {
    it('getTotal success, return 200 status, and error = false', async () => {
      mockingoose.Total.toReturn(VALID_TOTAL, 'find');
      const response = await serverSession
        .get('/api/totals')
        .set('Accept', 'text/html, application/json');
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toBe(false);
    });
    it('getTotal failure, return 200 status, and error = true', async () => {
      mockingoose.Total.toReturn(new Error('Error'), 'find');
      const response = await serverSession
        .get('/api/totals')
        .set('Accept', 'text/html, application/json');
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toBe(true);
    });
  });

  describe('Test addTotals', () => {
    it('addTotal success, return 200, error false', async () => {
      mockingoose.Total.toReturn(VALID_TOTAL, 'save');
      const response = await serverSession
        .post('/api/totals')
        .set('Accept', 'text/html application/json')
        .send(VALID_TOTAL);
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toEqual(false);
    });
    it('addTotal failure, return 200, error true', async () => {
      mockingoose.Total.toReturn(INVALID_TOTAL, 'save');
      const response = await serverSession
        .post('/api/totals')
        .set('Accept', 'text/html application/json')
        .send(INVALID_TOTAL);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toEqual('Error adding data');
      expect(response.body.error).toEqual(true);
    });
    it('addTotal failure, return 200, error true', async () => {
      mockingoose.Total.toReturn(new Error('Error'), 'save');
      const response = await serverSession
        .post('/api/totals')
        .set('Accept', 'text/html application/json')
        .send(VALID_TOTAL);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toEqual('Error adding data');
      expect(response.body.error).toEqual(true);
    });
  });

  describe('Test deleteTotal', () => {
    it('deleteTotal success, return 200, error false', async () => {
      mockingoose.Total.toReturn(VALID_TOTAL, 'findOne');
      mockingoose.Total.toReturn(VALID_TOTAL, 'delete');
      const response = await serverSession.delete('/api/totals/8675309');
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toEqual(false);
      expect(response.body.data.total).toEqual(20000);
    });
    it('deleteTotal failure, return 200, error true', async () => {
      mockingoose.Total.toReturn(INVALID_DELETING_TOTAL, 'findOne');
      mockingoose.Total.toReturn(new Error('Error'), 'remove');
      const response = await serverSession.delete('/api/totals/8675309');
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toEqual(true);
      expect(response.body.message).toEqual('Error deleting data');
    });
    it('deleteTotal failure, return 200, error true', async () => {
      mockingoose.Total.toReturn(new Error('Error'), 'findOne');
      mockingoose.Total.toReturn(INVALID_FINDING_TOTAL, 'remove');
      const response = await serverSession.delete('/api/totals/8675309');
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toEqual(true);
      expect(response.body.message).toEqual('Error fetching data');
    });
  });
});
