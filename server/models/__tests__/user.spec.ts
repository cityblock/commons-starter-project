import { transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { attributionUserEmail } from '../../lib/consts';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import CareTeam from '../care-team';
import Clinic from '../clinic';
import GoogleAuth from '../google-auth';
import User, { UserRole } from '../user';

const userRole = 'physician';

describe('user model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and retrieve a user', async () => {
    await transaction(User.knex(), async txn => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
      expect(user.firstName).toBe('dan');
      expect(user.lastName).toBe('plant');
      expect(user.permissions).toBe('red');

      const userById = await User.get(user.id, txn);
      expect(userById).toEqual(user);
    });
  });

  it('should create an attribution user', async () => {
    await transaction(User.knex(), async txn => {
      const user = await User.findOrCreateAttributionUser(txn);
      expect(user.email).toEqual(attributionUserEmail);

      // Check to make sure it's an idempotent operation
      await User.findOrCreateAttributionUser(txn);
      const users = await User.getAll(
        {
          pageNumber: 0,
          pageSize: 100,
          orderBy: 'email',
          order: 'desc',
          hasLoggedIn: false,
        },
        txn,
      );

      expect(users.total).toEqual(1);
    });
  });

  it('throws an error when getting an invalid id', async () => {
    await transaction(User.knex(), async txn => {
      const fakeId = uuid();
      await expect(User.get(fakeId, txn)).rejects.toMatch(`No such user: ${fakeId}`);
    });
  });

  it('returns null if getBy is called without a search parameter', async () => {
    await transaction(User.knex(), async txn => {
      const result = await User.getBy({ fieldName: 'email' }, txn);

      expect(result).toBeFalsy();
    });
  });

  it('returns null if getBy does not return a user', async () => {
    await transaction(User.knex(), async txn => {
      const result = await User.getBy({ fieldName: 'email', field: 'fake@email.nowhere' }, txn);

      expect(result).toBeFalsy();
    });
  });

  it('should not create a user when given an invalid email address', async () => {
    await transaction(User.knex(), async txn => {
      const email = 'nonEmail';
      const clinic = await Clinic.create(createMockClinic(), txn);

      await expect(
        User.create(
          { firstName: 'Jon', lastName: 'Snow', email, userRole, homeClinicId: clinic.id },
          txn,
        ),
      ).rejects.toMatchObject(new Error('email: should match format "email"'));
    });
  });

  it('should not create a user with an invalid clinic id', async () => {
    await transaction(User.knex(), async txn => {
      const fakeClinicId = uuid();
      const message = `Key (homeClinicId)=(${fakeClinicId}) is not present in table "clinic".`;

      await User.create(createMockUser(11, fakeClinicId, userRole), txn).catch(e => {
        expect(e.detail).toEqual(message);
      });
    });
  });

  it('gets last login', async () => {
    await transaction(User.knex(), async txn => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
      const lastLoginAt = new Date().toISOString();

      await user.$query(txn).patch({ lastLoginAt });

      const lastLoginQuery = await User.getLastLoggedIn(user.id, txn);
      expect(lastLoginQuery).toMatch(lastLoginAt);
    });
  });

  it('retrieve user by email', async () => {
    await transaction(User.knex(), async txn => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user = await User.create(
        createMockUser(11, clinic.id, userRole, 'danplant@b.com'),
        txn,
      );
      expect(user).toMatchObject({
        id: user.id,
        firstName: 'dan',
        lastName: 'plant',
      });

      const userByEmail = await User.getBy({ fieldName: 'email', field: 'danplant@b.com' }, txn);
      expect(userByEmail).toMatchObject({
        id: user.id,
        firstName: 'dan',
        lastName: 'plant',
      });
    });
  });

  it('should update user', async () => {
    await transaction(User.knex(), async txn => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
      const googleAuth = await GoogleAuth.updateOrCreate(
        {
          accessToken: 'accessToken',
          expiresAt: 'expires!',
          userId: user.id,
        },
        txn,
      );
      const clinic2 = await Clinic.create(createMockClinic('The Bertrand Russell Center', 1), txn);
      expect(
        await User.update(
          user.id,
          {
            firstName: 'first',
            lastName: 'last',
            googleProfileImageUrl: 'http://google.com',
            homeClinicId: clinic2.id,
            googleAuthId: googleAuth.id,
          },
          txn,
        ),
      ).toMatchObject({
        email: 'a@b.com',
        firstName: 'first',
        lastName: 'last',
        googleProfileImageUrl: 'http://google.com',
        homeClinicId: clinic2.id,
        googleAuthId: googleAuth.id,
      });
    });
  });

  it('fetches all users', async () => {
    await transaction(User.knex(), async txn => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
      await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);

      const allUsers = await User.getAll(
        {
          pageNumber: 0,
          pageSize: 10,
          hasLoggedIn: false,
          orderBy: 'createdAt',
          order: 'desc',
        },
        txn,
      );
      const allUserEmails = allUsers.results.map(user => user.email);
      expect(allUserEmails).toContain('a@b.com');
      expect(allUserEmails).toContain('b@c.com');
      expect(allUsers.total).toEqual(2);
    });
  });

  it('fetches a limited set of users', async () => {
    await transaction(User.knex(), async txn => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
      await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);

      expect(
        await User.getAll(
          {
            pageNumber: 0,
            pageSize: 1,
            hasLoggedIn: false,
            orderBy: 'email',
            order: 'desc',
          },
          txn,
        ),
      ).toMatchObject({
        results: [
          {
            email: 'b@c.com',
            userRole,
          },
        ],
        total: 2,
      });
      expect(
        await User.getAll(
          {
            pageNumber: 1,
            pageSize: 1,
            hasLoggedIn: false,
            orderBy: 'email',
            order: 'desc',
          },
          txn,
        ),
      ).toMatchObject({
        results: [
          {
            email: 'a@b.com',
            userRole,
          },
        ],
        total: 2,
      });
    });
  });

  it('fetches a limited set of shortened user objects', async () => {
    await transaction(User.knex(), async txn => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const userRole2 = 'healthCoach';
      const userRole3 = 'nurseCareManager';
      const userRoleFilters: UserRole[] = [userRole, userRole2];
      const userRoleFilters2: UserRole[] = [userRole3];

      const user1 = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
      const user2 = await User.create(createMockUser(11, clinic.id, userRole2, 'b@c.com'), txn);
      const user3 = await User.create(createMockUser(11, clinic.id, userRole3, 'c@d.com'), txn);
      // Must update lastLoginAt as getUserSummaryList does not return users who haven't logged in
      await User.update(user1.id, { lastLoginAt: new Date().toISOString() }, txn);
      await User.update(user2.id, { lastLoginAt: new Date().toISOString() }, txn);
      await User.update(user3.id, { lastLoginAt: new Date().toISOString() }, txn);

      expect(
        (await User.getUserSummaryList(userRoleFilters, txn)).sort((a, b) => {
          return a.userRole < b.userRole ? 1 : -1;
        }),
      ).toMatchObject([
        {
          userRole,
        },
        {
          userRole: userRole2,
        },
      ]);

      expect(await User.getUserSummaryList(userRoleFilters2, txn)).toMatchObject([
        {
          userRole: userRole3,
        },
      ]);
    });
  });

  it('returns the correct patient count in the summary list', async () => {
    await transaction(User.knex(), async txn => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const healthCoachUserRole = 'healthCoach';

      const user1 = await User.create(
        createMockUser(11, clinic.id, healthCoachUserRole, 'a@b.com'),
        txn,
      );
      const user2 = await User.create(
        createMockUser(11, clinic.id, healthCoachUserRole, 'b@c.com'),
        txn,
      );
      // Must update lastLoginAt as getUserSummaryList does not return users who haven't logged in
      await User.update(user1.id, { lastLoginAt: new Date().toISOString() }, txn);
      await User.update(user2.id, { lastLoginAt: new Date().toISOString() }, txn);

      const patient1 = await createPatient(
        { cityblockId: 123, homeClinicId: clinic.id, userId: user1.id },
        txn,
      );
      await createPatient({ cityblockId: 123, homeClinicId: clinic.id, userId: user1.id }, txn);

      const userSummaryList = await User.getUserSummaryList([healthCoachUserRole], txn);
      const user1Summary = userSummaryList.find(user => user.id === user1.id);
      const user2Summary = userSummaryList.find(user => user.id === user2.id);

      expect((user1Summary! as any).patientCount).toEqual(2);
      expect((user2Summary! as any).patientCount).toEqual(0);

      await CareTeam.delete({ userId: user1.id, patientId: patient1.id }, txn);

      const refetchedUserSummaryList = await User.getUserSummaryList([healthCoachUserRole], txn);
      const refetchedUser1Summary = refetchedUserSummaryList.find(user => user.id === user1.id);
      const refetchedUser2Summary = refetchedUserSummaryList.find(user => user.id === user2.id);

      expect((refetchedUser1Summary! as any).patientCount).toEqual(1);
      expect((refetchedUser2Summary! as any).patientCount).toEqual(0);
    });
  });

  it('fetches a shortened list of user objects where the users have logged in', async () => {
    await transaction(User.knex(), async txn => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const userRole2 = 'healthCoach';
      const userRole3 = 'nurseCareManager';
      const userRoleFilters: UserRole[] = [userRole2, userRole3];

      const user1 = await User.create(createMockUser(11, clinic.id, userRole2, 'a@b.com'), txn);
      const user2 = await User.create(createMockUser(11, clinic.id, userRole3, 'b@c.com'), txn);

      await User.update(user1.id, { lastLoginAt: new Date().toISOString() }, txn);

      const userSummaryList = await User.getUserSummaryList(userRoleFilters, txn);
      const userIds = userSummaryList.map(user => user.id);
      expect(userSummaryList).toHaveLength(1);
      expect(userIds).toContain(user1.id);
      expect(userIds).not.toContain(user2.id);

      // Now, let's have user2 log in
      await User.update(user2.id, { lastLoginAt: new Date().toISOString() }, txn);
      const refetchedUserSummaryList = await User.getUserSummaryList(userRoleFilters, txn);
      const refetchedUserIds = refetchedUserSummaryList.map(user => user.id);
      expect(refetchedUserSummaryList).toHaveLength(2);
      expect(refetchedUserIds).toContain(user1.id);
      expect(refetchedUserIds).toContain(user2.id);
    });
  });

  it('filter by logged in', async () => {
    await transaction(User.knex(), async txn => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      // not logged in user
      await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);

      // logged in user
      const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'), txn);
      const lastLoginAt = new Date().toISOString();
      await user.$query(txn).patch({ lastLoginAt });

      expect(
        await User.getAll(
          {
            pageNumber: 0,
            pageSize: 2,
            hasLoggedIn: true,
            orderBy: 'createdAt',
            order: 'desc',
          },
          txn,
        ),
      ).toMatchObject({
        results: [
          {
            email: 'care@care.com',
            userRole,
          },
        ],
        total: 1,
      });
    });
  });

  it('updates user role', async () => {
    await transaction(User.knex(), async txn => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user1 = await User.create(
        createMockUser(1, clinic.id, userRole, 'user@place.com'),
        txn,
      );
      expect(user1.userRole).toEqual(userRole);
      await User.updateUserRole(user1.id, 'nurseCareManager', txn);
      const fetchedUser1 = await User.getBy({ fieldName: 'email', field: 'user@place.com' }, txn);
      expect(fetchedUser1!.userRole).toEqual('nurseCareManager');
    });
  });

  it('updates user permissions', async () => {
    await transaction(User.knex(), async txn => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user1 = await User.create(
        createMockUser(1, clinic.id, userRole, 'user@place.com'),
        txn,
      );
      expect(user1.permissions).toBe('red');
      await User.updateUserPermissions(user1.id, 'blue', txn);
      const fetchedUser1 = await User.getBy({ fieldName: 'email', field: 'user@place.com' }, txn);
      expect(fetchedUser1!.permissions).toBe('blue');
    });
  });

  it('marks a user as deleted', async () => {
    await transaction(User.knex(), async txn => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user1 = await User.create(
        createMockUser(1, clinic.id, userRole, 'user@place.com'),
        txn,
      );
      const fetchedUser1 = await User.getBy({ fieldName: 'email', field: 'user@place.com' }, txn);

      // Just to make sure we're fetching the original user first
      expect(fetchedUser1).toMatchObject(user1);

      await User.delete(user1.id, txn);

      const clinic2 = await Clinic.create(createMockClinic('The Bertrand Russell Clinic', 1), txn);
      // Different clinic id to confirm we're actually fetching a new user
      const user2 = await User.create(
        createMockUser(1, clinic2.id, userRole, 'user@place.com'),
        txn,
      );
      const fetchedUser2 = await User.getBy({ fieldName: 'email', field: 'user@place.com' }, txn);

      // We should have now fetched the re-created user
      expect(fetchedUser2).toMatchObject(user2);
    });
  });
});
