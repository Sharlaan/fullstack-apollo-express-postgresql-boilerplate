import {
  signIn,
  signUp,
  getMeWithToken,
  getAllUsers,
  getUserById,
  modifyUser,
  removeUser,
} from './api';

// Drops previous schemas, then initializes a fresh test database
beforeAll(() => require('../../index'));

describe('USER MODULE', () => {
  describe('user(id: String!): User', () => {
    test('returns a user when user exists', async () => {
      const expectedResult = {
        data: {
          user: {
            id: '1',
            username: 'rwieruch',
            email: 'hello@robin.com',
            role: 'ADMIN',
          },
        },
      };

      const { data } = await getUserById({ id: '1' });

      expect(data).toEqual(expectedResult);
    });

    test('returns null when user cannot be found', async () => {
      const expectedResult = {
        data: {
          user: null,
        },
      };

      const { data } = await getUserById({ id: '42' });

      expect(data).toEqual(expectedResult);
    });
  });

  describe('users: [User!]', () => {
    test('returns a list of users', async () => {
      const expectedResult = {
        data: {
          users: [
            {
              id: '1',
              username: 'rwieruch',
              email: 'hello@robin.com',
              role: 'ADMIN',
            },
            {
              id: '2',
              username: 'ddavids',
              email: 'hello@david.com',
              role: 'USER',
            },
          ],
        },
      };

      const { data } = await getAllUsers();

      expect(data).toEqual(expectedResult);
    });
  });

  describe('me: User', () => {
    test('returns null when no user is signed in', async () => {
      const expectedResult = {
        data: {
          me: null,
        },
      };

      const { data } = await getMeWithToken();

      expect(data).toEqual(expectedResult);
    });

    test('returns me when me is signed in', async () => {
      const expectedResult = {
        data: {
          me: {
            id: '1',
            username: 'rwieruch',
            email: 'hello@robin.com',
          },
        },
      };

      const signInResult = await signIn({
        login: 'rwieruch',
        password: 'rwieruch',
      });

      signInResult.data.errors && console.error(signInResult.data.errors[0].message);

      const { token } = signInResult.data.data.signIn;

      const { data } = await getMeWithToken(token);

      expect(data).toEqual(expectedResult);
    });
  });

  describe('signUp, updateUser, deleteUser', () => {
    test('signs up a user, updates a user and deletes the user as admin', async () => {
      // sign up

      const signUpResult = await signUp({
        username: 'Mark',
        email: 'mark@gmule.com',
        password: 'asdasdasd',
      });

      signUpResult.data.errors && console.error(signUpResult.data.errors[0].message);

      const { token } = signUpResult.data.data.signUp;

      const {
        data: {
          data: { me },
        },
      } = await getMeWithToken(token);

      expect(me).toEqual({
        id: '3',
        username: 'Mark',
        email: 'mark@gmule.com',
      });

      // update as user

      const {
        data: {
          data: { updateUser },
        },
      } = await modifyUser({ username: 'Mark' }, token);

      expect(updateUser.username).toEqual('Mark');

      // delete as admin

      const {
        data: {
          data: {
            signIn: { token: adminToken },
          },
        },
      } = await signIn({
        login: 'rwieruch',
        password: 'rwieruch',
      });

      const {
        data: {
          data: { deleteUser },
        },
      } = await removeUser({ id: me.id }, adminToken);

      expect(deleteUser).toEqual(true);
    });
  });

  describe('deleteUser(id: String!): Boolean!', () => {
    test('returns an error because only admins can delete a user', async () => {
      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await signIn({
        login: 'ddavids',
        password: 'ddavids',
      });

      const {
        data: { errors },
      } = await removeUser({ id: '1' }, token);

      expect(errors[0].message).toEqual('Not authorized as admin.');
    });
  });

  describe('updateUser(username: String!): User!', () => {
    test('returns an error because only authenticated users can update a user', async () => {
      const {
        data: { errors },
      } = await modifyUser({ username: 'Mark' });

      expect(errors[0].message).toEqual('Not authenticated as user.');
    });
  });

  describe('signIn(login: String!, password: String!): Token!', () => {
    test('returns a token when a user signs in with username', async () => {
      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await signIn({
        login: 'ddavids',
        password: 'ddavids',
      });

      expect(typeof token).toBe('string');
    });

    test('returns a token when a user signs in with email', async () => {
      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await signIn({
        login: 'hello@david.com',
        password: 'ddavids',
      });

      expect(typeof token).toBe('string');
    });

    test('returns an error when a user provides a wrong password', async () => {
      const {
        data: { errors },
      } = await signIn({
        login: 'ddavids',
        password: 'dontknow',
      });

      expect(errors[0].message).toEqual('Invalid password.');
    });
  });

  test('returns an error when a user is not found', async () => {
    const {
      data: { errors },
    } = await signIn({
      login: 'dontknow',
      password: 'ddavids',
    });

    expect(errors[0].message).toEqual('No user found with these login credentials.');
  });
});
