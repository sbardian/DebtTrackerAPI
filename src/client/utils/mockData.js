/* eslint-disable import/no-extraneous-dependencies */
import faker from 'faker';

export const getRegisterUser = () => {
  const password = faker.internet.password();
  return {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password,
    passwordConf: password,
  };
};
