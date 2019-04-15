import session from 'supertest-session';
import mockingoose from 'mockingoose';
import createServer from '../server';
import { ALL_USERS } from '../testEnv/fixtures';
import User from '../models/User';

jest.mock('./checkAdmin');

describe('Test /admin API routes', () => {
  const server = createServer();
  const serverSession = session(server);

  describe('Test getAllUsers, /admin/users route:', () => {
    it('success', async () => {
      mockingoose(User).toReturn(ALL_USERS, 'find');
      const response = await serverSession
        .get(`/admin/users`)
        .set('Accept', 'text/html application/json');
      expect(response.statusCode).toBe(200);
      expect(response.error).toEqual(false);
      expect(response.body.users).toEqual(ALL_USERS);
    });
  });

  // it('Test getUserCreditCards', async () => {
  //   // TODO: write test
  //   expect(1).toEqual(1);
  // });
  // it('Test deleteUser', async () => {
  //   // TODO: write test
  //   expect(1).toEqual(1);
  // });
  // it('Test updateUser', async () => {
  //   // TODO: write test
  //   expect(1).toEqual(1);
  // });
  // it('Test deleteUserCreditCard', async () => {
  //   // TODO: write test
  //   expect(1).toEqual(1);
  // });
  // it('Test updateUserCreditCard', async () => {
  //   // TODO: write test
  //   expect(1).toEqual(1);
  // });
  // it('Test getUsersTotals', async () => {
  //   // TODO: write test
  //   expect(1).toEqual(1);
  // });
  // it('Test  deleteUsersTotals', async () => {
  //   // TODO: write test
  //   expect(1).toEqual(1);
  // });
});