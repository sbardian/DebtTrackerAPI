import session from 'supertest-session';
import mockingoose from 'mockingoose';
import createServer from '../server';
import {
  ALL_USERS,
  ADMIN_USERS_CREDITCARDS,
  ADMIN_USERS_CREDITCARD,
  ADMIN_USERS_TOTALS,
  ADMIN_UPDATED_CREDITCARD,
  // ADMIN_SINGLE_USER,
  // ADMIN_SINGLE_USER_UPDATED,
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

  // describe('Test deleteUser', () => {
  //   it('success', async () => {
  //   });
  // });

  // describe('Test updateUser', () => {
  //   it('success', async () => {
  //     mockingoose(User).toReturn(ADMIN_SINGLE_USER, 'findOne');
  //     mockingoose(User).toReturn(ADMIN_SINGLE_USER_UPDATED, 'update');
  //     const response = await serverSession
  //       .put(`/admin/users/12345`)
  //       .send({ username: 'blah2' })
  //       .set('Accept', 'text/html application/json');
  //     expect(response.statusCode).toBe(200);
  //     expect(response.error).toBe(false);
  //   });
  // });

  describe('Test deleteUserCreditCard', () => {
    it('success', async () => {
      mockingoose(CreditCard).toReturn(ADMIN_USERS_CREDITCARD, 'findOne');
      mockingoose(CreditCard).toReturn(
        ADMIN_USERS_CREDITCARD,
        'findOneAndDelete',
      );
      const response = await serverSession
        .delete(`/admin/users/cards/12345`)
        .set('Accept', 'text/html application/json');
      expect(response.statusCode).toBe(200);
      expect(response.error).toBe(false);
    });
  });

  describe('Test updateUserCreditCard', () => {
    it('success', async () => {
      mockingoose(CreditCard).toReturn(
        ADMIN_UPDATED_CREDITCARD,
        'findOneAndUpdate',
      );
      const response = await serverSession
        .put(`/admin/users/cards/12345`)
        .set('Accept', 'text/html application/json');
      expect(response.statusCode).toBe(200);
      expect(response.error).toBe(false);
      expect(response.body.creditCard.limit).toEqual(4000);
    });
  });

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
