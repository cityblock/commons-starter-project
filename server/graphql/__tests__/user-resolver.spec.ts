import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import * as currentUserEdit from '../../../app/graphql/queries/current-user-edit-mutation.graphql';
import * as getCurrentUser from '../../../app/graphql/queries/get-current-user.graphql';
import * as getUserSummaryList from '../../../app/graphql/queries/get-user-summary-list.graphql';
import * as getUsers from '../../../app/graphql/queries/get-users.graphql';
import * as getJwtForPdfCreate from '../../../app/graphql/queries/jwt-for-pdf-create.graphql';
import * as userLogin from '../../../app/graphql/queries/log-in-user-mutation.graphql';
import * as userCreate from '../../../app/graphql/queries/user-create-mutation.graphql';
import * as userDelete from '../../../app/graphql/queries/user-delete-mutation.graphql';
import * as userEditPermissions from '../../../app/graphql/queries/user-edit-permissions-mutation.graphql';
import * as userEditRole from '../../../app/graphql/queries/user-edit-role-mutation.graphql';
import Db from '../../db';
import Clinic from '../../models/clinic';
import PatientGlassBreak from '../../models/patient-glass-break';
import User from '../../models/user';
import {
  createMockClinic,
  createMockUser,
  createPatient,
  mockGoogleOauthAuthorize,
} from '../../spec-helpers';
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
  const permissions = 'green';
  const currentUserEditMutation = print(currentUserEdit);
  const userSummaryListQuery = print(getUserSummaryList);
  const usersQuery = print(getUsers);
  const currentUserQuery = print(getCurrentUser);
  const jwtForPdfCreateMutation = print(getJwtForPdfCreate);
  const userCreateMutation = print(userCreate);
  const userDeleteMutation = print(userDelete);
  const userEditPermissionsMutation = print(userEditPermissions);
  const userEditRoleMutation = print(userEditRole);
  const userLoginMutation = print(userLogin);
  const log = jest.fn();
  const logger = { log };

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolves a limited set of shortened user objects given some user role filters', () => {
    it('can a fetch a set of shortened user', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const userRole2 = 'admin';

        const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
        const user2 = await User.create(createMockUser(11, clinic.id, userRole2, 'b@c.com'), txn);
        // Need to mark as having logged in once
        await User.update(user.id, { lastLoginAt: new Date().toISOString() }, txn);
        await User.update(user2.id, { lastLoginAt: new Date().toISOString() }, txn);

        const result = await graphql(
          schema,
          userSummaryListQuery,
          null,
          {
            db,
            userId: user.id,
            permissions,
            txn,
          },
          { userRoleFilters: [user.userRole] },
        );

        expect(cloneDeep(result.data!.userSummaryList)).toMatchObject([
          {
            id: user.id,
            userRole,
            firstName: 'dan',
            lastName: 'plant',
          },
        ]);
      });
    });

    it('gives you nothing if there are no users with that user role', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const userRole2 = 'admin';

        const user = await User.create(createMockUser(11, clinic.id, userRole2, 'a@b.com'), txn);
        const user2 = await User.create(createMockUser(11, clinic.id, userRole2, 'b@c.com'), txn);
        // Need to mark as having logged in once
        await User.update(user.id, { lastLoginAt: new Date().toISOString() }, txn);
        await User.update(user2.id, { lastLoginAt: new Date().toISOString() }, txn);

        const result = await graphql(
          schema,
          userSummaryListQuery,
          null,
          {
            db,
            userId: user.id,
            permissions,
            txn,
          },
          { userRoleFilters: [userRole] },
        );

        expect(cloneDeep(result.data!.userSummaryList)).toMatchObject([]);
      });
    });

    it('does not resolve set of shortened user objects for non-admins', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
        // Need to mark as having logged in once
        await User.update(user.id, { lastLoginAt: new Date().toISOString() }, txn);

        const result = await graphql(
          schema,
          userSummaryListQuery,
          null,
          {
            db,
            userId: user.id,
            permissions: 'red',
            txn,
          },
          { userRoleFilters: [user.userRole] },
        );

        expect(cloneDeep(result.errors![0].message)).toMatch('red not able to view allUsers');
      });
    });
  });

  describe('resolve all users', () => {
    it('resolves all users', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole), txn);

        const result = await graphql(schema, usersQuery, null, {
          db,
          userId: user.id,
          permissions,
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
        const user = await User.create(createMockUser(11, clinic.id, userRole), txn);

        const result = await graphql(schema, usersQuery, null, {
          db,
          permissions: 'red',
          userId: user.id,
          txn,
        });

        expect(cloneDeep(result.errors![0].message)).toMatch('red not able to view allUsers');
      });
    });

    it('returns correct page information', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user1 = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
        const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);
        const user3 = await User.create(createMockUser(11, clinic.id, userRole, 'c@d.com'), txn);
        const user4 = await User.create(createMockUser(11, clinic.id, userRole, 'd@e.com'), txn);
        await User.create(createMockUser(11, clinic.id, userRole, 'e@f.com'), txn);

        const result = await graphql(
          schema,
          usersQuery,
          null,
          {
            db,
            userId: user1.id,
            permissions,
            txn,
          },
          { pageNumber: 0, pageSize: 4, orderBy: 'emailAsc' },
        );

        expect(cloneDeep(result.data!.users)).toMatchObject({
          edges: [
            {
              node: {
                email: user1.email,
                userRole: user1.userRole,
              },
            },
            {
              node: {
                email: user2.email,
                userRole: user2.userRole,
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
                email: user4.email,
                userRole: user4.userRole,
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
        const result = await graphql(schema, currentUserQuery, null, {
          db,
          userId: user.id,
          permissions: 'blue',
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
        const result = await graphql(schema, currentUserQuery, null, {
          db,
          userId: '',
          permissions,
          txn,
        });

        expect(cloneDeep(result.errors![0].message)).toMatch('not logged in');
      });
    });

    it('errors if the logged in user does not exist', async () => {
      await transaction(User.knex(), async txn => {
        const fakeId = uuid();
        const result = await graphql(schema, currentUserQuery, null, {
          db,
          userId: fakeId,
          permissions,
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
        const result = await graphql(
          schema,
          currentUserEditMutation,
          null,
          {
            db,
            permissions,
            userId: user.id,
            txn,
          },
          { locale: 'es', firstName: 'first' },
        );
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

        const result = await graphql(
          schema,
          userLoginMutation,
          null,
          { db, userRole, logger, txn },
          { googleAuthCode: 'google-auth-code' },
        );
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
            firstName: 'Sansa',
            lastName: 'Stark',
            email: 'logan@cityblock.com',
            userRole,
            homeClinicId: clinic.id,
          },
          txn,
        );
        mockGoogleOauthAuthorize(cityblockToken);

        expect(user.lastLoginAt).toBeFalsy();
        await graphql(
          schema,
          userLoginMutation,
          null,
          { db, permissions, userId: user.id, txn },
          { googleAuthCode: 'google-auth-code' },
        );

        const freshUser = await User.query(txn).findById(user.id);
        expect(freshUser!.lastLoginAt).not.toBeFalsy();
      });
    });

    it('errors if no user', async () => {
      await transaction(User.knex(), async txn => {
        mockGoogleOauthAuthorize(cityblockToken);

        const result = await graphql(
          schema,
          userLoginMutation,
          null,
          { db, userRole, txn },
          { googleAuthCode: 'google-auth-code' },
        );
        expect(result.errors![0].message).toMatch('User not found for logan@cityblock.com');
      });
    });

    it('errors if token is invalid', async () => {
      await transaction(User.knex(), async txn => {
        mockGoogleOauthAuthorize('invalid');
        const result = await graphql(
          schema,
          userLoginMutation,
          null,
          {
            db,
            userId: 'sansaStark',
            permissions,
            txn,
          },
          { googleAuthCode: 'google-auth-code' },
        );
        expect(result.errors![0].message).toMatch('Auth failed: Email not verified');
      });
    });

    it('errors email is not @cityblock.com', async () => {
      await transaction(User.knex(), async txn => {
        mockGoogleOauthAuthorize(gmailToken);
        const result = await graphql(
          schema,
          userLoginMutation,
          null,
          {
            db,
            permissions,
            userId: 'aryaStark',
            txn,
          },
          { googleAuthCode: 'google-auth-code' },
        );
        expect(result.errors![0].message).toMatch('Email must have a @cityblock.com domain');
      });
    });
  });

  describe('userCreate', () => {
    it('creates a new user', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);

        const result = await graphql(
          schema,
          userCreateMutation,
          null,
          {
            db,
            permissions,
            userId: user.id,
            txn,
          },
          { email: 'a@b.com', homeClinicId: clinic.id },
        );

        expect(cloneDeep(result.data!.userCreate)).toMatchObject({
          email: 'a@b.com',
        });
      });
    });

    it('errors if email already exists', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);

        const result = await graphql(
          schema,
          userCreateMutation,
          null,
          {
            db,
            permissions,
            userId: user.id,
            txn,
          },
          { email: 'a@b.com', homeClinicId: clinic.id },
        );
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
        const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
        const result = await graphql(
          schema,
          userEditRoleMutation,
          null,
          {
            db,
            userId: user.id,
            permissions,
            txn,
          },
          { email: 'a@b.com', userRole: 'nurseCareManager' },
        );
        expect(cloneDeep(result.data!.userEditRole)).toMatchObject({
          email: 'a@b.com',
          userRole: 'nurseCareManager',
        });
      });
    });

    it('error if user not able to edit user role for other users', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
        const result = await graphql(
          schema,
          userEditRoleMutation,
          null,
          {
            db,
            permissions: 'blue',
            userId: user.id,
            txn,
          },
          { email: 'a@b.com', userRole: 'nurseCareManager' },
        );
        expect(cloneDeep(result.errors![0].message)).toMatch('blue not able to edit user');
      });
    });
  });

  describe('userEditPermissions', () => {
    it('edits user permissions', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
        const result = await graphql(
          schema,
          userEditPermissionsMutation,
          null,
          {
            db,
            userId: user.id,
            permissions,
            txn,
          },
          { email: 'a@b.com', permissions: 'blue' },
        );

        expect(cloneDeep(result.data!.userEditPermissions)).toMatchObject({
          email: 'a@b.com',
          permissions: 'blue',
        });
      });
    });

    it('error if user not able to edit user permissions for other users', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
        const result = await graphql(
          schema,
          userEditPermissionsMutation,
          null,
          {
            db,
            permissions: 'blue',
            userId: user.id,
            txn,
          },
          { email: 'a@b.com', permissions: 'green' },
        );
        expect(cloneDeep(result.errors![0].message)).toMatch('blue not able to edit user');
      });
    });
  });

  describe('userDelete', () => {
    it('deletes user', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);

        const result = await graphql(
          schema,
          userDeleteMutation,
          null,
          {
            db,
            userId: user.id,
            permissions,
            txn,
          },
          { email: 'a@b.com' },
        );
        expect(cloneDeep(result.data!.userDelete)).toMatchObject({
          email: 'a@b.com',
          userRole,
        });
      });
    });

    it('error if user not able to delete user', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
        const result = await graphql(
          schema,
          userDeleteMutation,
          null,
          {
            db,
            permissions: 'blue',
            userId: user.id,
            txn,
          },
          { email: 'a@b.com' },
        );
        expect(cloneDeep(result.errors![0].message)).toMatch('blue not able to delete user');
      });
    });
  });

  describe('resolveJwtForPdf', () => {
    it('generates a Jwt token for PDF viewing', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
        const patient = await createPatient(
          { cityblockId: 123, homeClinicId: clinic.id, userId: user.id },
          txn,
        );

        const result = await graphql(
          schema,
          jwtForPdfCreateMutation,
          null,
          {
            db,
            permissions: 'blue',
            txn,
            userId: user.id,
          },
          { patientId: patient.id },
        );

        expect(result.data!.JwtForPdfCreate.authToken).toBeTruthy();
      });
    });

    it('does not allow generating Jwt token for PDF if no relevant permissions', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
        const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
        const result = await graphql(
          schema,
          jwtForPdfCreateMutation,
          null,
          {
            db,
            permissions: 'red',
            txn,
            userId: user.id,
          },
          { patientId: patient.id },
        );

        expect(result.errors![0].message).toBe('red not able to view patient');
      });
    });

    it('validates glass break for generating Jwt token for PDF', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
        const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
        await PatientGlassBreak.create(
          {
            userId: user.id,
            patientId: patient.id,
            reason: 'The Wall Came Down',
            note: 'You know nothing Jon Snow',
          },
          txn,
        );
        const result = await graphql(
          schema,
          jwtForPdfCreateMutation,
          null,
          {
            db,
            permissions: 'blue',
            txn,
            userId: user.id,
          },
          { patientId: patient.id },
        );

        expect(result.data!.JwtForPdfCreate.authToken).toBeTruthy();
      });
    });

    it('validates blocks generating JWT for PDF if no glass break provided', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
        const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

        const result = await graphql(
          schema,
          jwtForPdfCreateMutation,
          null,
          {
            db,
            permissions: 'blue',
            txn,
            userId: user.id,
          },
          { patientId: patient.id },
        );

        const message = `User ${user.id} cannot automatically break the glass for patient ${
          patient.id
        }`;

        expect(result.errors![0].message).toBe(message);
      });
    });
  });
});
