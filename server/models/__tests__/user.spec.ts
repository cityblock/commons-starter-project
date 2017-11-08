import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createMockClinic, createMockUser } from '../../spec-helpers';
import Clinic from '../clinic';
import GoogleAuth from '../google-auth';
import User from '../user';

const userRole = 'physician';

describe('user model', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and retrieve a user', async () => {
    const clinic = await Clinic.create(createMockClinic());
    const user = await User.create(createMockUser(11, clinic.id, userRole));
    expect(user).toMatchObject({
      id: user.id,
      firstName: 'dan',
      lastName: 'plant',
    });

    const userById = await User.get(user.id);
    expect(userById).toMatchObject({
      id: user.id,
      firstName: 'dan',
      lastName: 'plant',
      homeClinicId: clinic.id,
    });
  });

  it('throws an error when getting an invalid id', async () => {
    const fakeId = uuid();
    await expect(User.get(fakeId)).rejects.toMatch(`No such user: ${fakeId}`);
  });

  it('returns null if getBy is called without a search parameter', async () => {
    const result = await User.getBy('email');

    expect(result).toBeNull();
  });

  it('returns null if getBy does not return a user', async () => {
    const result = await User.getBy('email', 'fake@email.nowhere');

    expect(result).toBeNull();
  });

  it('should not create a user when given an invalid email address', async () => {
    const email = 'nonEmail';
    const message = 'email is not valid';
    const clinic = await Clinic.create(createMockClinic());

    await expect(User.create({ email, userRole, homeClinicId: clinic.id })).rejects.toMatchObject(
      new Error(JSON.stringify({ email: [{ message }] }, null, '  ')),
    );
  });

  it('should not create a user with an invalid clinic id', async () => {
    const fakeClinicId = uuid();
    const message = `Key (homeClinicId)=(${fakeClinicId}) is not present in table "clinic".`;

    await User.create(createMockUser(11, fakeClinicId, userRole)).catch(e => {
      expect(e.detail).toEqual(message);
    });
  });

  it('gets last login', async () => {
    const clinic = await Clinic.create(createMockClinic());
    const user = await User.create(createMockUser(11, clinic.id, userRole));
    const lastLoginAt = new Date().toISOString();

    await user.$query().patch({ lastLoginAt });

    const lastLoginQuery = await User.getLastLoggedIn(user.id);
    expect(lastLoginQuery).toMatch(lastLoginAt);
  });

  it('retrieve user by email', async () => {
    const clinic = await Clinic.create(createMockClinic());
    const user = await User.create(createMockUser(11, clinic.id, userRole, 'danplant@b.com'));
    expect(user).toMatchObject({
      id: user.id,
      firstName: 'dan',
      lastName: 'plant',
    });

    const userByEmail = await User.getBy('email', 'danplant@b.com');
    expect(userByEmail).toMatchObject({
      id: user.id,
      firstName: 'dan',
      lastName: 'plant',
    });
  });

  it('should update user', async () => {
    const clinic = await Clinic.create(createMockClinic());
    const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'));
    const googleAuth = await GoogleAuth.updateOrCreate({
      accessToken: 'accessToken',
      expiresAt: 'expires!',
      userId: user.id,
    });
    const clinic2 = await Clinic.create(createMockClinic('The Bertrand Russell Center', 1));
    expect(
      await User.update(user.id, {
        firstName: 'first',
        lastName: 'last',
        googleProfileImageUrl: 'http://google.com',
        homeClinicId: clinic2.id,
        googleAuthId: googleAuth.id,
      }),
    ).toMatchObject({
      email: 'a@b.com',
      firstName: 'first',
      lastName: 'last',
      googleProfileImageUrl: 'http://google.com',
      homeClinicId: clinic2.id,
      googleAuthId: googleAuth.id,
    });
  });

  it('fetches all users', async () => {
    const clinic = await Clinic.create(createMockClinic());
    await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'));
    await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'));

    expect(
      await User.getAll({
        pageNumber: 0,
        pageSize: 10,
        hasLoggedIn: false,
        orderBy: 'createdAt',
        order: 'desc',
      }),
    ).toMatchObject({
      results: [
        {
          email: 'b@c.com',
          userRole,
        },
        {
          email: 'a@b.com',
          userRole,
        },
      ],
      total: 2,
    });
  });

  it('fetches a limited set of users', async () => {
    const clinic = await Clinic.create(createMockClinic());
    await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'));
    await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'));

    expect(
      await User.getAll({
        pageNumber: 0,
        pageSize: 1,
        hasLoggedIn: false,
        orderBy: 'createdAt',
        order: 'desc',
      }),
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
      await User.getAll({
        pageNumber: 1,
        pageSize: 1,
        hasLoggedIn: false,
        orderBy: 'createdAt',
        order: 'desc',
      }),
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

  it('filter by logged in', async () => {
    const clinic = await Clinic.create(createMockClinic());
    // not logged in user
    await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'));

    // logged in user
    const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'));
    const lastLoginAt = new Date().toISOString();
    await user.$query().patch({ lastLoginAt });

    expect(
      await User.getAll({
        pageNumber: 0,
        pageSize: 2,
        hasLoggedIn: true,
        orderBy: 'createdAt',
        order: 'desc',
      }),
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

  it('updates user role', async () => {
    const clinic = await Clinic.create(createMockClinic());
    const user1 = await User.create(createMockUser(1, clinic.id, userRole, 'user@place.com'));
    expect(user1.userRole).toEqual(userRole);
    await User.updateUserRole(user1.id, 'nurseCareManager');
    const fetchedUser1 = await User.getBy('email', 'user@place.com');
    expect(fetchedUser1!.userRole).toEqual('nurseCareManager');
  });

  it('marks a user as deleted', async () => {
    const clinic = await Clinic.create(createMockClinic());
    const user1 = await User.create(createMockUser(1, clinic.id, userRole, 'user@place.com'));
    const fetchedUser1 = await User.getBy('email', 'user@place.com');

    // Just to make sure we're fetching the original user first
    expect(fetchedUser1).toMatchObject(user1);

    await User.delete(user1.id);

    const clinic2 = await Clinic.create(createMockClinic('The Bertrand Russell Clinic', 1));
    // Different clinic id to confirm we're actually fetching a new user
    const user2 = await User.create(createMockUser(1, clinic2.id, userRole, 'user@place.com'));
    const fetchedUser2 = await User.getBy('email', 'user@place.com');

    // We should have now fetched the re-created user
    expect(fetchedUser2).toMatchObject(user2);
  });
});
