import { compare } from 'bcrypt';
import { IUserEdges, IUserNode } from 'schema';
import User from '../models/user';
import accessControls from './shared/access-controls';
import { formatRelayEdge, signJwt, IContext } from './shared/utils';

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

interface IUsersFilterOptions {
  pageNumber: number;
  pageSize: number;
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

  return await User.get(args.userId);
}

export async function resolveCurrentUser(
  root: any, args: any, { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'user');

  if (!userId) {
    throw new Error('User not logged in');
  }

  return await User.get(userId);
}

export async function resolveUsers(
  root: any, args: Partial<IUsersFilterOptions>, { db, userRole }: IContext,
): Promise<IUserEdges> {
  await accessControls.isAllowed(userRole, 'view', 'allUsers');

  const pageNumber = args.pageNumber || 0;
  const pageSize = args.pageSize || 10;

  const users = await User.getAll({ pageNumber, pageSize });
  const userEdges = users.results.map((user, i) => formatRelayEdge(user, user.id) as IUserNode);

  const hasPreviousPage = pageNumber !== 0;
  const hasNextPage = ((pageNumber + 1) * pageSize) < users.total;

  return {
    edges: userEdges,
    pageInfo: {
      hasPreviousPage,
      hasNextPage,
    },
  };
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
