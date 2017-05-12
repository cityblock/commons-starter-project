import Db from '../../db';
import User from '../user';

const userRole = 'physician';

describe('user model', () => {
  let db: Db = null as any;

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
      password: 'password1',
      firstName: 'Dan',
      lastName: 'Plant',
      userRole,
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

  it('should not create a user when given an invalid email address', async () => {
    // once jest 20.0.0 ships, this should be updated to use the .rejects method
    let errors;

    try {
      await User.create({
        email: 'nonEmail',
        password: 'password1',
        userRole,
      });
    } catch (err) {
      errors = err;
    }
    expect(JSON.parse(errors.message)).toMatchObject({
      email: [{
        message: 'email is not valid',
      }],
    });
  });

  it('gets last login', async () => {
    const user = await User.create({
      email: 'care@care.com',
      password: 'password1',
      firstName: 'Dan',
      lastName: 'Plant',
      userRole,
    });
    const lastLoginAt = new Date().toISOString();

    await user.$query().patch({ lastLoginAt });

    const lastLoginQuery = await User.getLastLoggedIn(user.id);
    expect(lastLoginQuery).toMatch(lastLoginAt);
  });

  it('retrieve user by email', async () => {
    const user = await User.create({
      email: 'danplant@b.com',
      password: 'password1',
      firstName: 'Dan',
      lastName: 'Plant',
      userRole,
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
});
