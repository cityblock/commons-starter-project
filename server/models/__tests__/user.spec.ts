import Db from '../../db';
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
    const user = await User.create({
      email: 'care@care.com',
      firstName: 'Dan',
      lastName: 'Plant',
      userRole,
      homeClinicId: '1',
    });
    expect(user).toMatchObject({
      id: user.id,
      firstName: 'Dan',
      lastName: 'Plant',
    });

    const userById = await User.get(user.id);
    expect(userById).toMatchObject({
      id: user.id,
      firstName: 'Dan',
      lastName: 'Plant',
    });
  });

  it('throws an error when getting an invalid id', async () => {
    const fakeId = 'fakeId';
    await expect(User.get(fakeId)).rejects.toMatch('No such user: fakeId');
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

    await expect(User.create({ email, userRole, homeClinicId: '1' })).rejects.toMatchObject(
      new Error(JSON.stringify({ email: [{ message }] }, null, '  ')),
    );
  });

  it('gets last login', async () => {
    const user = await User.create({
      email: 'care@care.com',
      firstName: 'Dan',
      lastName: 'Plant',
      userRole,
      homeClinicId: '1',
    });
    const lastLoginAt = new Date().toISOString();

    await user.$query().patch({ lastLoginAt });

    const lastLoginQuery = await User.getLastLoggedIn(user.id);
    expect(lastLoginQuery).toMatch(lastLoginAt);
  });

  it('retrieve user by email', async () => {
    const user = await User.create({
      email: 'danplant@b.com',
      firstName: 'Dan',
      lastName: 'Plant',
      userRole,
      homeClinicId: '1',
    });
    expect(user).toMatchObject({
      id: user.id,
      firstName: 'Dan',
      lastName: 'Plant',
    });

    const userByEmail = await User.getBy('email', 'danplant@b.com');
    expect(userByEmail).toMatchObject({
      id: user.id,
      firstName: 'Dan',
      lastName: 'Plant',
    });
  });

  it('should update user', async () => {
    const user = await User.create({
      email: 'a@b.com',
      userRole,
      homeClinicId: '1',
    });
    const googleAuth = await GoogleAuth.updateOrCreate({
      accessToken: 'accessToken',
      expiresAt: 'expires!',
      userId: user.id,
    });
    expect(
      await User.update(user.id, {
        firstName: 'first',
        lastName: 'last',
        googleProfileImageUrl: 'http://google.com',
        homeClinicId: '2',
        googleAuthId: googleAuth.id,
      }),
    ).toMatchObject({
      email: 'a@b.com',
      firstName: 'first',
      lastName: 'last',
      googleProfileImageUrl: 'http://google.com',
      homeClinicId: '2',
      googleAuthId: googleAuth.id,
    });
  });

  it('fetches all users', async () => {
    await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });
    await User.create({ email: 'b@c.com', userRole, homeClinicId: '1' });

    expect(await User.getAll({ pageNumber: 0, pageSize: 10 })).toMatchObject({
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
    await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });
    await User.create({ email: 'b@c.com', userRole, homeClinicId: '1' });

    expect(await User.getAll({ pageNumber: 0, pageSize: 1 })).toMatchObject({
      results: [
        {
          email: 'b@c.com',
          userRole,
        },
      ],
      total: 2,
    });
    expect(await User.getAll({ pageNumber: 1, pageSize: 1 })).toMatchObject({
      results: [
        {
          email: 'a@b.com',
          userRole,
        },
      ],
      total: 2,
    });
  });

  it('marks a user as deleted', async () => {
    const user1 = await User.create({
      email: 'user@place.com',
      userRole,
      homeClinicId: '1',
      athenaProviderId: 1,
    });
    const fetchedUser1 = await User.getBy('email', 'user@place.com');

    // Just to make sure we're fetching the original user first
    expect(fetchedUser1).toMatchObject(user1);

    await User.delete(user1.id);

    const user2 = await User.create({
      email: 'user@place.com',
      userRole,
      homeClinicId: '2', // Different clinic ID to confirm we're actually fetching a new user
      athenaProviderId: 1,
    });
    const fetchedUser2 = await User.getBy('email', 'user@place.com');

    // We should have now fetched the re-created user
    expect(fetchedUser2).toMatchObject(user2);
  });
});
