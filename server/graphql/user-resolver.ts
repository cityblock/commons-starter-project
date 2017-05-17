import { compare } from 'bcrypt';
import User from '../models/user';
import accessControls from './shared/access-controls';
import { signJwt, IContext } from './shared/utils';

interface ICreateUserArgs {
  input: {
    email: string;
    password: string;
    homeClinicId: string;
  };
}

interface IResolveUserOptions {
  userId: string;
}

interface IUserLoginOptions {
  input: {
    email: string;
    password: string;
  };
}

export async function createUser(root: any, { input }: ICreateUserArgs, context: IContext) {
  const { userRole } = context;
  const { email, password, homeClinicId } = input;
  await accessControls.isAllowed(userRole, 'create', 'user');

  const user = await User.getBy('email', email);

  if (user) {
    throw new Error(`Cannot create account: Email already exists for ${email}`);
  } else {
    const newUser = await User.create({
      email,
      userRole: 'healthCoach',
      password,
      homeClinicId,
    });

    const authToken = signJwt({
      userId: newUser.id,
      userRole: newUser.userRole,
      lastLoginAt: new Date().toUTCString(),
    });

    return { user: newUser, authToken };
  }
}

export async function resolveUser(
  root: any, args: IResolveUserOptions, { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'user');

  const user = await User.get(args.userId);
  if (!user) {
    throw new Error(`User not found for ${args.userId}`);
  }

  return user;
}

export async function resolveCurrentUser(
  root: any, args: any, { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'user');

  if (!userId) {
    throw new Error('User not logged in');
  }

  const user = await User.get(userId);
  if (!user) {
    throw new Error(`User not found for ${userId}`);
  }

  return user;
}

// disabling isAllowed check for login endpoint so users can log in
/* tslint:disable check-is-allowed */
export async function login(root: any, { input }: IUserLoginOptions, { db }: IContext) {
  const { email, password } = input;

  const user = await User.getBy('email', email);
  if (!user) {
    throw new Error(`User not found for ${email}`);
  }

  const hashedPassword = user.hashedPassword;
  if (!hashedPassword) {
    throw new Error('Hashed password error');
  }

  const isCorrectPassword = await compare(password, hashedPassword);
  if (isCorrectPassword) {
    const lastLoginAt = new Date().toUTCString();
    const authToken = signJwt({
      userId: user.id,
      userRole: user.userRole,
      lastLoginAt,
    });

    await user.updateLoginAt(lastLoginAt);

    return { authToken, user };
  }
  throw new Error('Login failed: password');
}
/* tslint:enable check-is-allowed */
