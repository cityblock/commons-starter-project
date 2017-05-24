import { compare } from 'bcrypt';
import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import User from '../../models/user';
import schema from '../make-executable-schema';

describe('user tests', () => {

  let db: Db = null as any;
  const userRole = 'physician';
  const homeClinicId = '1';

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve user', () => {
    it('can fetch user', async () => {
      const user = await User.create({
        email: 'a@b.com',
        password: 'password1',
        firstName: 'Bertrand',
        lastName: 'Russell',
        userRole,
        homeClinicId,
      });
      const query = `{ user(userId: "${user.id}") { email, firstName, lastName } }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.user)).toMatchObject({
        email: 'a@b.com',
        firstName: 'Bertrand',
        lastName: 'Russell',
      });
    });

    it('errors if hashedPassword is queried', async () => {
      const dbUser = await User.create({
        email: 'brennan@sidewalklabs.com',
        password: 'Pa33word1',
        userRole,
        homeClinicId,
      });
      const user = await User.get(dbUser.id);
      expect(compare('Pa33word1', user!.hashedPassword)).toBeTruthy();
      const query = `{ user(userId: "${dbUser.id}") { hashedPassword } }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(result.errors![0].message).toMatch(
        'Cannot query field "hashedPassword" on type "User".',
      );
    });

    it('errors if a user cannot be found', async () => {
      const query = `{ user(userId: "fakeId") { firstName } }`;
      const result = await graphql(schema, query, null, { db, userRole});

      expect(result.errors![0].message).toMatch(
        'No such user: fakeId',
      );
    });
  });

  describe('resolve all users', () => {
    it('resolves all users', async () => {
      const user = await User.create({
        email: 'a@b.com',
        password: 'password1',
        firstName: 'Bertrand',
        lastName: 'Russell',
        userRole,
        homeClinicId,
      });

      const query = `{ users { edges { node { id, firstName } } } }`;
      const result = await graphql(schema, query, null, { db, userRole: 'admin' });

      expect(cloneDeep(result.data!.users)).toMatchObject({
        edges: [{
          node: {
            id: user.id,
            firstName: 'Bertrand',
          },
        }],
      });
    });

    it('does not resolve all users for non-admins', async () => {
      await User.create({
        email: 'a@b.com',
        password: 'password1',
        firstName: 'Bertrand',
        lastName: 'Russell',
        userRole,
        homeClinicId,
      });

      const query = `{ users { edges { node { id, firstName } } } }`;
      const result = await graphql(schema, query, null, { db, userRole });

      expect(cloneDeep(result.errors![0].message)).toMatch(
        'physician not able to view allUsers',
      );
    });

    it('returns correct page information', async () => {
      const user1 = await User.create({
        email: 'a@b.com', password: 'password', userRole, homeClinicId,
      });
      const user2 = await User.create({
        email: 'b@c.com', password: 'password', userRole, homeClinicId,
      });
      const user3 = await User.create({
        email: 'c@d.com', password: 'password', userRole: 'healthCoach', homeClinicId,
      });
      const user4 = await User.create({
        email: 'd@e.com', password: 'password', userRole: 'familyMember', homeClinicId,
      });
      await User.create({
        email: 'e@f.com', password: 'password', userRole: 'nurseCareManager', homeClinicId,
      });

      const query = `{
        users(pageNumber: 0, pageSize: 4) {
          edges {
            node {
              email
              userRole
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }`;

      const result = await graphql(schema, query, null, { db, userRole: 'admin' });

      expect(cloneDeep(result.data!.users)).toMatchObject({
        edges: [{
          node: {
            email: user1.email,
            userRole: user1.userRole,
          },
        }, {
          node: {
            email: user2.email,
            userRole: user2.userRole,
          },
        }, {
          node: {
            email: user3.email,
            userRole: user3.userRole,
          },
        }, {
          node: {
            email: user4.email,
            userRole: user4.userRole,
          },
        }],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
        },
      });
    });
  });

  describe('resolve current user', () => {
    it('can fetch current user', async () => {
      const user = await User.create({
        email: 'a@b.com',
        password: 'password1',
        firstName: 'Bertrand',
        lastName: 'Russell',
        userRole,
        homeClinicId,
      });
      const query = `{ currentUser { email, firstName, lastName } }`;
      const result = await graphql(schema, query, null, { db, userId: user.id, userRole });
      expect(cloneDeep(result.data!.currentUser)).toMatchObject({
        email: 'a@b.com',
        firstName: 'Bertrand',
        lastName: 'Russell',
      });
    });

    it('errors if there is no logged in user', async () => {
      const query = `{ currentUser { email, firstName, lastName } }`;
      const result = await graphql(schema, query, null, { db, userRole });

      expect(cloneDeep(result.errors![0].message)).toMatch(
        'User not logged in',
      );
    });

    it('errors if the logged in user does not exist', async () => {
      const query = `{ currentUser { email, firstName, lastName } }`;
      const result = await graphql(schema, query, null, { db, userId: 'fakeId', userRole });

      expect(cloneDeep(result.errors![0].message)).toMatch(
        'No such user: fakeId',
      );
    });
  });

  describe('login user', () => {
    it('logs in user and returns user with token', async () => {
      const user = await User.create({
        email: 'a@b.com',
        password: 'password1',
        firstName: 'Bertrand',
        lastName: 'Russell',
        userRole,
        homeClinicId,
      });
      expect(user.lastLoginAt).toBeNull();
      const mutation = `mutation {
        login(input: { email: "a@b.com", password: "password1" }) {
          authToken
          user { firstName, lastName }
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole });
      expect(cloneDeep(result.data!.login.user)).toMatchObject({
        firstName: 'Bertrand',
        lastName: 'Russell',
      });
      const freshUser = await User.query().findById(user.id);
      expect(freshUser!.lastLoginAt).not.toBeNull();
    });

    it('updates lastLoginAt', async () => {
      const user = await User.create({
        email: 'a@b.com',
        password: 'password1',
        userRole,
        homeClinicId,
      });
      expect(user.lastLoginAt).toBeNull();
      const mutation = `mutation {
        login(input: { email: "a@b.com", password: "password1" }) {
          authToken
        }
      }`;
      await graphql(schema, mutation, null, { db, userRole });

      const freshUser = await User.query().findById(user.id);
      expect(freshUser!.lastLoginAt).not.toBeNull();
    });

    it('errors if no user', async () => {
      const mutation = `mutation {
        login(input: { email: "not-a-user@foo.com", password: "password1" }) {
          authToken
          user { firstName, lastName }
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole });
      expect(result.errors![0].message).toMatch(
        'User not found for not-a-user@foo.com',
      );
    });

    it('errors if incorrect password', async () => {
      await User.create({
        email: 'a@b.com',
        password: 'password1',
        firstName: 'Bertrand',
        lastName: 'Russell',
        userRole,
        homeClinicId,
      });
      const mutation = `mutation {
        login(input: { email: "a@b.com", password: "incorrect!" }) {
          authToken
          user { firstName, lastName }
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole });
      expect(result.errors![0].message).toMatch('Login failed: password');
    });
  });

  describe('create user', () => {
    it('creates a new user', async () => {
      const mutation = `mutation {
        createUser(input: { email: "a@b.com", password: "c0000lp3rd!", homeClinicId: "1" }) {
          authToken
          user { email }
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole });
      expect(cloneDeep(result.data!.createUser.user)).toMatchObject({
        email: 'a@b.com',
      });
    });

    it('errors if password to short', async () => {
      const mutation = `mutation {
        createUser(input: { email: "a@b.com", password: "c", homeClinicId: "1" }) {
        authToken
        user { email }
      } }`;
      const result = await graphql(schema, mutation, null, { db, userRole });
      expect(cloneDeep(result.errors![0].message)).toMatch(
        'Query error: String not long enough',
      );
    });

    it('errors if email already exists', async () => {
      await User.create({
        email: 'a@b.com',
        password: 'password1',
        userRole,
        homeClinicId,
      });
      const mutation = `mutation {
        createUser(input: { email: "a@b.com", password: "c0000lp3rd!", homeClinicId: "1" }) {
        authToken
        user { email }
      } }`;
      const result = await graphql(schema, mutation, null, { db, userRole });
      expect(cloneDeep(result.errors![0].message)).toMatch(
        'Cannot create account: Email already exists',
      );
    });
  });
});
