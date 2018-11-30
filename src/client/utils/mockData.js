import faker from 'faker';

export const getUser = () => {
  const password = faker.internet.password();
  return {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password,
    passwordConf: password,
  };
};
