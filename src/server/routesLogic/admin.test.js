import session from 'supertest-session';
import mockingoose from 'mockingoose';
import createServer from '../server';
import {
  ALL_USERS,
  ADMIN_USERS_CREDITCARDS,
  ADMIN_USERS_TOTALS,
} from '../testEnv/fixtures';
import User from '../models/User';
import CreditCard from '../models/CreditCard';
import Total from '../models/Total';

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

  describe('Test getUserCreditCards', () => {
    it('success', async () => {
      mockingoose(CreditCard).toReturn(ADMIN_USERS_CREDITCARDS, 'find');
      const response = await serverSession
        .get(`/admin/users/cards/12345`)
        .set('Accept', 'text/html application/json');
      expect(response.statusCode).toBe(200);
      expect(response.error).toEqual(false);
      expect(response.body.creditCards[0]).toEqual(ADMIN_USERS_CREDITCARDS[0]);
    });
  });
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
  describe('Test getUsersTotals', () => {
    it('success', async () => {
      mockingoose(Total).toReturn(ADMIN_USERS_TOTALS, 'find');
      const response = await serverSession
        .get(`/admin/users/totals/12345`)
        .set('Accept', 'text/html application/json');
      expect(response.statusCode).toBe(200);
      expect(response.error).toBe(false);
      expect(response.body.message).toEqual(
        "Totals received for user id '12345'",
      );
      expect(response.body.totals[0].total).toEqual(20000);
    });
  });
  // it('Test  deleteUsersTotals', async () => {
  //   // TODO: write test
  //   expect(1).toEqual(1);
  // });
});
