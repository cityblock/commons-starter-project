import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Clinic from '../../models/clinic';
import User from '../../models/user';
import { createMockClinic, createMockUser, mockGoogleOauthAuthorize } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);

  return { clinic };
}

describe('user tests', () => {
  let db: Db;
  const userRole = 'physician';
  const log = jest.fn();
  const logger = { log };

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve user', () => {
    it('can fetch user', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
        const query = `{ user(userId: "${user.id}") { email, firstName, lastName } }`;
        const result = await graphql(schema, query, null, { db, userRole, txn });
        expect(cloneDeep(result.data!.user)).toMatchObject({
          email: 'a@b.com',
          firstName: 'dan',
          lastName: 'plant',
        });
      });
    });

    it('errors if a user cannot be found', async () => {
      await transaction(User.knex(), async txn => {
        const fakeId = uuid();
        const query = `{ user(userId: "${fakeId}") { firstName } }`;
        const result = await graphql(schema, query, null, { db, userRole, txn });

        expect(result.errors![0].message).toMatch(`No such user: ${fakeId}`);
      });
    });
  });

  describe('resolve all users', () => {
    it('resolves all users', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole), txn);

        const query = `{ users { edges { node { id, firstName } } } }`;
        const result = await graphql(schema, query, null, {
          db,
          userRole: 'admin',
          txn,
        });

        expect(cloneDeep(result.data!.users)).toMatchObject({
          edges: [
            {
              node: {
                id: user.id,
                firstName: 'dan',
              },
            },
          ],
        });
      });
    });

    it('does not resolve all users for non-admins', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        await User.create(createMockUser(11, clinic.id, userRole), txn);

        const query = `{ users { edges { node { id, firstName } } } }`;
        const result = await graphql(schema, query, null, { db, userRole, txn });

        expect(cloneDeep(result.errors![0].message)).toMatch('physician not able to view allUsers');
      });
    });

    it('returns correct page information', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        await User.create(createMockUser(11, clinic.id, userRole), txn);
        const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);
        const user3 = await User.create(createMockUser(11, clinic.id, userRole, 'c@d.com'), txn);
        const user4 = await User.create(createMockUser(11, clinic.id, userRole, 'd@e.com'), txn);
        const user5 = await User.create(createMockUser(11, clinic.id, userRole, 'e@f.com'), txn);

        const query = `{
          users(pageNumber: 0, pageSize: 4, orderBy: createdAtDesc) {
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

        const result = await graphql(schema, query, null, {
          db,
          userRole: 'admin',
          txn,
        });

        expect(cloneDeep(result.data!.users)).toMatchObject({
          edges: [
            {
              node: {
                email: user5.email,
                userRole: user5.userRole,
              },
            },
            {
              node: {
                email: user4.email,
                userRole: user4.userRole,
              },
            },
            {
              node: {
                email: user3.email,
                userRole: user3.userRole,
              },
            },
            {
              node: {
                email: user2.email,
                userRole: user2.userRole,
              },
            },
          ],
          pageInfo: {
            hasNextPage: true,
            hasPreviousPage: false,
          },
        });
      });
    });
  });

  describe('resolve current user', () => {
    it('can fetch current user', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
        const query = `{ currentUser { email, firstName, lastName } }`;
        const result = await graphql(schema, query, null, {
          db,
          userId: user.id,
          userRole,
          txn,
        });
        expect(cloneDeep(result.data!.currentUser)).toMatchObject({
          email: 'dan@plant.com',
          firstName: 'dan',
          lastName: 'plant',
        });
      });
    });

    it('errors if there is no logged in user', async () => {
      await transaction(User.knex(), async txn => {
        const query = `{ currentUser { email, firstName, lastName } }`;
        const result = await graphql(schema, query, null, { db, userRole, txn });

        expect(cloneDeep(result.errors![0].message)).toMatch('not logged in');
      });
    });

    it('errors if the logged in user does not exist', async () => {
      await transaction(User.knex(), async txn => {
        const fakeId = uuid();
        const query = `{ currentUser { email, firstName, lastName } }`;
        const result = await graphql(schema, query, null, {
          db,
          userId: fakeId,
          userRole,
          txn,
        });

        expect(cloneDeep(result.errors![0].message)).toMatch(`No such user: ${fakeId}`);
      });
    });
  });

  describe('currentUserEdit', () => {
    it('edits user', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
        const query = `mutation {
          currentUserEdit(input: { locale: "es", firstName: "first" }) {
            locale, firstName
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.currentUserEdit)).toMatchObject({
          locale: 'es',
          firstName: 'first',
        });
      });
    });
  });

  describe('userLogin', () => {
    const cityblockToken = `eyJhbGciOiJSUzI1NiIsImtpZCI6ImY3MDI4OTBmY2RkODU4Yzg5ZDlhMzFmNTAyYjQxOWNhYTg2MWE0NzkifQ.eyJhenAiOiI0NTMwMTk2ODQwMjItN2hwdDB2Zms5YmpqYzUzcG0ycmw5ZjF2Z211amtsNjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0NTMwMTk2ODQwMjItN2hwdDB2Zms5YmpqYzUzcG0ycmw5ZjF2Z211amtsNjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDAxNTU4MjI3Mzk3MzY1Mzk4NjkiLCJoZCI6ImNpdHlibG9jay5jb20iLCJlbWFpbCI6ImxvZ2FuQGNpdHlibG9jay5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6InE3ZVVNVzhYV0Y5eHc0NUNxTXJqZlEiLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE0OTcyNzk4MDAsImV4cCI6MTQ5NzI4MzQwMCwibmFtZSI6IkxvZ2FuIEhhc3NvbiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vLVBBZElibFBfWkowL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FBeVlCRjc0V2FfZUxJSGRMYzItODhBVDdmZ1Y4NlpDSWcvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IkxvZ2FuIiwiZmFtaWx5X25hbWUiOiJIYXNzb24iLCJsb2NhbGUiOiJlbiJ9.AlKDr4beAw7nTTuebFHCS-Mi6VCBPCn3fERief9Itl4gtxY8j5rZgvyjSprplbFbwDCOF_YW4YJB4BcHmKCEbw0TXvGPjPla84U7GJZvKxKSAh2oyYW6aJGGKK_CY5AH5GLAmgzg_3TuuF026YAHzpEYTQSPRG28LCJxGhNiMKPEdQi7D7r85aCE0CbhGOvFClaoyrLRMeEgvbkskVcl1xRvhzdxee974k92T10kjScRPQRPdjs98i3EFXO4IYwh5c0k7eg-0LkJgddJARM5FN4UN8Cu1VsKZhjsoh2WNLpQ8CLHtiC7ov24WOb2dSZNOCqX1NB2A2cmMDrWvKRMiw`;
    const gmailToken = `eyJhbGciOiJSUzI1NiIsImtpZCI6ImM5YjM5YzI0ZWQ1NGEyYjFhZWYzZTU3MmQ0ZTQxMWZlNWNjZjY5N2YifQ.eyJhenAiOiI0NTMwMTk2ODQwMjItN2hwdDB2Zms5YmpqYzUzcG0ycmw5ZjF2Z211amtsNjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0NTMwMTk2ODQwMjItN2hwdDB2Zms5YmpqYzUzcG0ycmw5ZjF2Z211amtsNjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDA4ODQ0MzA4MDIzNDY2OTgwNjYiLCJlbWFpbCI6ImJyZW5uYW5tb29yZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjhjUlVHOUY4Qi1USXFfNGx4Zk5LUnciLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE0OTYwODY4MzksImV4cCI6MTQ5NjA5MDQzOSwibmFtZSI6IkJyZW5uYW4gTW9vcmUiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDYuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1KNnZaejJNRTBYby9BQUFBQUFBQUFBSS9BQUFBQUFBQUJmSS9TemFjN2RONklOdy9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiQnJlbm5hbiIsImZhbWlseV9uYW1lIjoiTW9vcmUiLCJsb2NhbGUiOiJlbiJ9.BMsqORq3GDnE5lpJE25NL2MY-lrt-3Djr_IAlc8biHVo3axe77X1SBF6NBlmmYQ5pxKk4IKrm09ytEEBb0zctLSthnYhlJlLwu-PBCaXvFqdmgRSFbeQAaQ_VyK9SwXHpm1M96ae9RNhNt5VTPD2-Quwj10LZ8ClkqMKB0qYz5F2fub0J4sorplUzow3p0sAeTGWMCkNwzWrAcfcqGL9Z2ROYvy0kdWmDKphGZEsyIjz31WC30Mz2KY3t37-M2FlMZyTxDjo0_jxUmYPmw6ewVsC1Jc5q_SOV8de7btd2NpzpQMI7GocH22IeLHch9Z1lvVvMXPdei_baYVB43lmAA`;

    it('logs in user and returns user with token', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(
          {
            email: 'logan@cityblock.com',
            firstName: 'Bertrand',
            lastName: 'Russell',
            userRole,
            homeClinicId: clinic.id,
          },
          txn,
        );
        expect(user.lastLoginAt).toBeFalsy();
        mockGoogleOauthAuthorize(cityblockToken);
        const mutation = `mutation {
          userLogin(input: { googleAuthCode: "google-auth-code" }) {
            authToken
            user { firstName, lastName }
          }
        }`;

        const result = await graphql(schema, mutation, null, { db, userRole, logger, txn });
        // update user name from google response
        expect(cloneDeep(result.data!.userLogin.user)).toMatchObject({
          firstName: 'Logan',
          lastName: 'Hasson',
        });
        const freshUser = await User.query(txn).findById(user.id);
        expect(freshUser!.lastLoginAt).not.toBeFalsy();
        expect(log).toBeCalled();
      });
    });

    it('updates lastLoginAt', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(
          {
            email: 'logan@cityblock.com',
            userRole,
            homeClinicId: clinic.id,
          },
          txn,
        );
        mockGoogleOauthAuthorize(cityblockToken);

        expect(user.lastLoginAt).toBeFalsy();
        const mutation = `mutation {
          userLogin(input: { googleAuthCode: "google-auth-code" }) {
            authToken
          }
        }`;
        await graphql(schema, mutation, null, { db, userRole, txn });

        const freshUser = await User.query(txn).findById(user.id);
        expect(freshUser!.lastLoginAt).not.toBeFalsy();
      });
    });

    it('errors if no user', async () => {
      await transaction(User.knex(), async txn => {
        mockGoogleOauthAuthorize(cityblockToken);
        const mutation = `mutation {
          userLogin(input: { googleAuthCode: "google-auth-code" }) {
            authToken
            user { firstName, lastName }
          }
        }`;
        const result = await graphql(schema, mutation, null, { db, userRole, txn });
        expect(result.errors![0].message).toMatch('User not found for logan@cityblock.com');
      });
    });

    it('errors if token is invalid', async () => {
      await transaction(User.knex(), async txn => {
        mockGoogleOauthAuthorize('invalid');
        const mutation = `mutation {
          userLogin(input: { googleAuthCode: "google-auth-code" }) {
            authToken
            user { firstName, lastName }
          }
        }`;
        const result = await graphql(schema, mutation, null, { db, userRole, txn });
        expect(result.errors![0].message).toMatch('Auth failed: Email not verified');
      });
    });

    it('errors email is not @cityblock.com', async () => {
      await transaction(User.knex(), async txn => {
        mockGoogleOauthAuthorize(gmailToken);
        const mutation = `mutation {
          userLogin(input: { googleAuthCode: "google-auth-code" }) {
            authToken
            user { firstName, lastName }
          }
        }`;
        const result = await graphql(schema, mutation, null, { db, userRole, txn });
        expect(result.errors![0].message).toMatch('Email must have a @cityblock.com domain');
      });
    });
  });

  describe('userCreate', () => {
    it('creates a new user', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const mutation = `mutation {
          userCreate(input: { email: "a@b.com", homeClinicId: "${clinic.id}" }) {
            email
          }
        }`;
        const result = await graphql(schema, mutation, null, { db, userRole, txn });
        expect(cloneDeep(result.data!.userCreate)).toMatchObject({
          email: 'a@b.com',
        });
      });
    });

    it('errors if email already exists', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
        const mutation = `mutation {
          userCreate(input: { email: "a@b.com", homeClinicId: "${clinic.id}" }) {
            email
        } }`;
        const result = await graphql(schema, mutation, null, { db, userRole, txn });
        expect(cloneDeep(result.errors![0].message)).toMatch(
          'Cannot create account: Email already exists',
        );
      });
    });
  });

  describe('userEditRole', () => {
    it('edits user role', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
        const mutation = `mutation {
          userEditRole(input: { email: "a@b.com", userRole: "nurseCareManager" }) {
            email, userRole
          } }`;
        const result = await graphql(schema, mutation, null, { db, userRole: 'admin', txn });
        expect(cloneDeep(result.data!.userEditRole)).toEqual({
          email: 'a@b.com',
          userRole: 'nurseCareManager',
        });
      });
    });

    it('error if user not able to edit user role for other users', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
        const mutation = `mutation {
          userEditRole(input: { email: "a@b.com", userRole: "nurseCareManager" }) {
            email, userRole
          } }`;
        const result = await graphql(schema, mutation, null, { db, userRole, txn });
        expect(cloneDeep(result.errors![0].message)).toMatch(
          `${userRole} not able to edit user role`,
        );
      });
    });
  });

  describe('userDelete', () => {
    it('deletes user', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
        const mutation = `mutation {
          userDelete(input: { email: "a@b.com" }) {
            email, userRole
          } }`;

        const result = await graphql(schema, mutation, null, { db, userRole: 'admin', txn });
        expect(cloneDeep(result.data!.userDelete)).toEqual({
          email: 'a@b.com',
          userRole,
        });
      });
    });

    it('error if user not able to delete user', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
        const mutation = `mutation {
          userDelete(input: { email: "a@b.com" }) {
            email, userRole
          } }`;
        const result = await graphql(schema, mutation, null, { db, userRole, txn });
        expect(cloneDeep(result.errors![0].message)).toMatch(`${userRole} not able to delete user`);
      });
    });
  });
});
