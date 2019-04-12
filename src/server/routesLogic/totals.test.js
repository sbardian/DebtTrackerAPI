import session from 'supertest-session';
import mockingoose from 'mockingoose';
import createServer from '../server';
import {
  LOGIN_SUCCESS_MOCK_USER,
  VALID_TOTAL,
  INVALID_TOTAL,
  INVALID_FINDING_TOTAL,
  // INVALID_DELETING_TOTAL,
} from '../testEnv/fixtures';

jest.mock('./checkAuth');

describe('Test /totals API routes', () => {
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

  describe('Test getTotals', () => {
    it('getTotal success, return 200 status, and error = false', async () => {
      mockingoose.Total.toReturn(VALID_TOTAL, 'find');
      const response = await serverSession
        .get('/api/totals')
        .set('Accept', 'text/html, application/json');
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toBe(false);
    });
    it('getTotal failure, return 400 status, and error = true', async () => {
      mockingoose.Total.toReturn(new Error('Error'), 'find');
      const response = await serverSession
        .get('/api/totals')
        .set('Accept', 'text/html, application/json');
      expect(response.statusCode).toBe(400);
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
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual('Error adding data');
      expect(response.body.error).toEqual(true);
    });
    it('addTotal failure, return 200, error true', async () => {
      mockingoose.Total.toReturn(new Error('Error'), 'save');
      const response = await serverSession
        .post('/api/totals')
        .set('Accept', 'text/html application/json')
        .send(VALID_TOTAL);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual('Error adding data');
      expect(response.body.error).toEqual(true);
    });
  });

  describe('Test deleteTotal', () => {
    it('deleteTotal success, return 200, error false', async () => {
      mockingoose.Total.toReturn(VALID_TOTAL, 'findOne').toReturn(
        VALID_TOTAL,
        'deleteOne',
      );
      const response = await serverSession.delete('/api/totals/8675309');
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toEqual(false);
      expect(response.body.data.total).toEqual(20000);
    });
    it('deleteTotal findById failure, return 200, error true', async () => {
      mockingoose.Total.toReturn(new Error('Error'), 'findOne').toReturn(
        INVALID_FINDING_TOTAL,
        'deleteOne',
      );
      const response = await serverSession.delete('/api/totals/8675309');
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(true);
      expect(response.body.message).toEqual('Error fetching data');
    });
    it('deleteTotal remove failure from Error, return 200, error true', async () => {
      mockingoose.Total.toReturn(VALID_TOTAL, 'findOne').toReturn(
        new Error('Error'),
        'deleteOne',
      );
      const response = await serverSession.delete('/api/totals/8675309');
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toEqual(true);
      expect(response.body.message).toEqual('Error deleting total');
    });
    // TODO: figure out how to mock nReturned: 0
    // fit('deleteTotal remove failure from No Results, return 200, error true', async () => {
    //   mockingoose.Total.toReturn(VALID_TOTAL, 'findOne').toReturn(
    //     INVALID_DELETING_TOTAL,
    //     'deleteOne',
    //   );
    //   const response = await serverSession.delete('/api/totals/8675309');
    //   expect(response.statusCode).toBe(400);
    //   expect(response.body.error).toEqual(true);
    //   expect(response.body.message).toEqual('Error deleting total');
    // });
  });
});
