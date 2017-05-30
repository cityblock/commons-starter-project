import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import User from '../../models/user';
import { mockGoogleOauthAuthorize } from '../../spec-helpers';
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

    it('errors if a user cannot be found', async () => {
      const query = `{ user(userId: "fakeId") { firstName } }`;
      const result = await graphql(schema, query, null, { db, userRole });

      expect(result.errors![0].message).toMatch(
        'No such user: fakeId',
      );
    });
  });

  describe('resolve all users', () => {
    it('resolves all users', async () => {
      const user = await User.create({
        email: 'a@b.com',
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
        email: 'a@b.com', userRole, homeClinicId,
      });
      const user2 = await User.create({
        email: 'b@c.com', userRole, homeClinicId,
      });
      const user3 = await User.create({
        email: 'c@d.com', userRole: 'healthCoach', homeClinicId,
      });
      const user4 = await User.create({
        email: 'd@e.com', userRole: 'familyMember', homeClinicId,
      });
      await User.create({
        email: 'e@f.com', userRole: 'nurseCareManager', homeClinicId,
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

  describe('userLogin', () => {
    /* tslint:disable:max-line-length */
    const sidewalklabsToken = `eyJhbGciOiJSUzI1NiIsImtpZCI6ImM5YjM5YzI0ZWQ1NGEyYjFhZWYzZTU3MmQ0ZTQxMWZlNWNjZjY5N2YifQ.eyJhenAiOiI0NTMwMTk2ODQwMjItN2hwdDB2Zms5YmpqYzUzcG0ycmw5ZjF2Z211amtsNjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0NTMwMTk2ODQwMjItN2hwdDB2Zms5YmpqYzUzcG0ycmw5ZjF2Z211amtsNjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTU0MjI2MDA5NjQ3MTYyMTcxMjkiLCJoZCI6InNpZGV3YWxrbGFicy5jb20iLCJlbWFpbCI6ImJyZW5uYW5Ac2lkZXdhbGtsYWJzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoid1JnaXNHQk01b1JGY0lxZ01FYlhydyIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6MTQ5NjA4NjcxMSwiZXhwIjoxNDk2MDkwMzExLCJuYW1lIjoiQnJlbm5hbiBNb29yZSIsInBpY3R1cmUiOiJodHRwczovL2xoNC5nb29nbGV1c2VyY29udGVudC5jb20vLWZndkRtYjFEX0F3L0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFzL01PS2ZJTzdHcmRZL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJCcmVubmFuIiwiZmFtaWx5X25hbWUiOiJNb29yZSIsImxvY2FsZSI6ImVuIn0.okbx05mv7Csc4dgCpdRgU6Zuc-Ol7Dw_A1lLDtiYPG63IZ-OpOVbC2FGcYSZB52W4oC7XAS1AprfassDRwPtNVAkB6_DRMNycvQpKyFJpZXH7QqFEJb_trIpmOKfOKxRYxOStFct_A50Z-tbyccJunWnBcm8nyV8LnIneeqBHS0tjoZYTxVDJDykFpmc2qyjTczr8ARO_iC05LEKKWrKH2goKMZUlf0aXYEEzJ8NnL-H-Ewk72QoNjz6QWyKHlcSg3uCype1BW3wEUDy5-veNoMLlCbX-i_yaA5ehPyXPIIzKjTHCokoPi3p6YCQ7Ff1xUIO4L_oexbyJj1iANbyHQ`;
    const gmailToken = `eyJhbGciOiJSUzI1NiIsImtpZCI6ImM5YjM5YzI0ZWQ1NGEyYjFhZWYzZTU3MmQ0ZTQxMWZlNWNjZjY5N2YifQ.eyJhenAiOiI0NTMwMTk2ODQwMjItN2hwdDB2Zms5YmpqYzUzcG0ycmw5ZjF2Z211amtsNjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0NTMwMTk2ODQwMjItN2hwdDB2Zms5YmpqYzUzcG0ycmw5ZjF2Z211amtsNjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDA4ODQ0MzA4MDIzNDY2OTgwNjYiLCJlbWFpbCI6ImJyZW5uYW5tb29yZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjhjUlVHOUY4Qi1USXFfNGx4Zk5LUnciLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE0OTYwODY4MzksImV4cCI6MTQ5NjA5MDQzOSwibmFtZSI6IkJyZW5uYW4gTW9vcmUiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDYuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1KNnZaejJNRTBYby9BQUFBQUFBQUFBSS9BQUFBQUFBQUJmSS9TemFjN2RONklOdy9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiQnJlbm5hbiIsImZhbWlseV9uYW1lIjoiTW9vcmUiLCJsb2NhbGUiOiJlbiJ9.BMsqORq3GDnE5lpJE25NL2MY-lrt-3Djr_IAlc8biHVo3axe77X1SBF6NBlmmYQ5pxKk4IKrm09ytEEBb0zctLSthnYhlJlLwu-PBCaXvFqdmgRSFbeQAaQ_VyK9SwXHpm1M96ae9RNhNt5VTPD2-Quwj10LZ8ClkqMKB0qYz5F2fub0J4sorplUzow3p0sAeTGWMCkNwzWrAcfcqGL9Z2ROYvy0kdWmDKphGZEsyIjz31WC30Mz2KY3t37-M2FlMZyTxDjo0_jxUmYPmw6ewVsC1Jc5q_SOV8de7btd2NpzpQMI7GocH22IeLHch9Z1lvVvMXPdei_baYVB43lmAA`;
    /* tslint:enable:max-line-length */
    it('logs in user and returns user with token', async () => {
      const user = await User.create({
        email: 'brennan@sidewalklabs.com',
        firstName: 'Bertrand',
        lastName: 'Russell',
        userRole,
        homeClinicId,
      });
      expect(user.lastLoginAt).toBeNull();
      mockGoogleOauthAuthorize(sidewalklabsToken);
      const mutation = `mutation {
        userLogin(input: { googleAuthCode: "google-auth-code" }) {
          authToken
          user { firstName, lastName }
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole });
      expect(cloneDeep(result.data!.userLogin.user)).toMatchObject({
        firstName: 'Bertrand',
        lastName: 'Russell',
      });
      const freshUser = await User.query().findById(user.id);
      expect(freshUser!.lastLoginAt).not.toBeNull();
    });

    it('updates lastLoginAt', async () => {
      const user = await User.create({
        email: 'brennan@sidewalklabs.com',
        userRole,
        homeClinicId,
      });
      mockGoogleOauthAuthorize(sidewalklabsToken);

      expect(user.lastLoginAt).toBeNull();
      const mutation = `mutation {
        userLogin(input: { googleAuthCode: "google-auth-code" }) {
          authToken
        }
      }`;
      await graphql(schema, mutation, null, { db, userRole });

      const freshUser = await User.query().findById(user.id);
      expect(freshUser!.lastLoginAt).not.toBeNull();
    });

    it('errors if no user', async () => {
      mockGoogleOauthAuthorize(sidewalklabsToken);
      const mutation = `mutation {
        userLogin(input: { googleAuthCode: "google-auth-code" }) {
          authToken
          user { firstName, lastName }
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole });
      expect(result.errors![0].message).toMatch(
        'User not found for brennan@sidewalklabs.com',
      );
    });

    it('errors if token is invalid', async () => {
      mockGoogleOauthAuthorize('invalid');
      const mutation = `mutation {
        userLogin(input: { googleAuthCode: "google-auth-code" }) {
          authToken
          user { firstName, lastName }
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole });
      expect(result.errors![0].message).toMatch(
        'Auth failed: Email not verified',
      );
    });

    it('errors email is not @sidewalklabs.com', async () => {
      mockGoogleOauthAuthorize(gmailToken);
      const mutation = `mutation {
        userLogin(input: { googleAuthCode: "google-auth-code" }) {
          authToken
          user { firstName, lastName }
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole });
      expect(result.errors![0].message).toMatch(
        'Email must have a @sidewalklabs.com domain',
      );
    });
  });

  describe('userCreate', () => {
    it('creates a new user', async () => {
      const mutation = `mutation {
        userCreate(input: { email: "a@b.com", homeClinicId: "1" }) {
          authToken
          user { email }
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole });
      expect(cloneDeep(result.data!.userCreate.user)).toMatchObject({
        email: 'a@b.com',
      });
    });

    it('errors if email already exists', async () => {
      await User.create({
        email: 'a@b.com',
        userRole,
        homeClinicId,
      });
      const mutation = `mutation {
        userCreate(input: { email: "a@b.com", homeClinicId: "1" }) {
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
