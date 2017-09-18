import { IUserCreateInput, IUserEdges, IUserLoginInput, IUserNode } from 'schema';
import { parseIdToken, OauthAuthorize } from '../apis/google/oauth-authorize';
import config from '../config';
import GoogleAuth from '../models/google-auth';
import User from '../models/user';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, formatRelayEdge, signJwt, IContext } from './shared/utils';

export interface IUserCreateArgs {
  input: IUserCreateInput;
}

export interface IResolveUserOptions {
  userId: string;
}

export interface IUserLoginOptions {
  input: IUserLoginInput;
}

export interface IUsersFilterOptions {
  pageNumber: number;
  pageSize: number;
}

export interface IEditCurrentUserInput {
  firstName: string;
  lastName: string;
  locale: 'en' | 'es';
}

export interface IEditCurrentUserOptions {
  input: IEditCurrentUserInput;
}

export async function userCreate(root: any, { input }: IUserCreateArgs, context: IContext) {
  const { userRole } = context;
  const { email, homeClinicId } = input;
  await accessControls.isAllowed(userRole, 'create', 'user');

  const user = await User.getBy('email', email);

  if (user) {
    throw new Error(`Cannot create account: Email already exists for ${email}`);
  } else {
    const newUser = await User.create({
      email,
      userRole: 'healthCoach',
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
  root: any,
  args: IResolveUserOptions,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'user');

  return await User.get(args.userId);
}

export async function resolveCurrentUser(root: any, args: any, { db, userId, userRole }: IContext) {
  await accessControls.isAllowed(userRole, 'view', 'user');
  checkUserLoggedIn(userId);

  return await User.get(userId!);
}

export async function currentUserEdit(
  root: any,
  args: IEditCurrentUserOptions,
  { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'user', userId, userId);
  checkUserLoggedIn(userId);

  return await User.update(userId!, args.input);
}

export async function resolveUsers(
  root: any,
  args: Partial<IUsersFilterOptions>,
  { db, userRole }: IContext,
): Promise<IUserEdges> {
  await accessControls.isAllowed(userRole, 'view', 'allUsers');

  const pageNumber = args.pageNumber || 0;
  const pageSize = args.pageSize || 10;

  const users = await User.getAll({ pageNumber, pageSize });
  const userEdges = users.results.map((user, i) => formatRelayEdge(user, user.id) as IUserNode);

  const hasPreviousPage = pageNumber !== 0;
  const hasNextPage = (pageNumber + 1) * pageSize < users.total;

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
export async function userLogin(root: any, { input }: IUserLoginOptions, { db, logger }: IContext) {
  const { googleAuthCode } = input;

  const oauth = await OauthAuthorize(googleAuthCode);
  if (!oauth || !oauth.access_token) {
    throw new Error(`Google auth rejected`);
  }

  const googleResult = parseIdToken(oauth.id_token);
  if (googleResult.email.indexOf(config.GOOGLE_OAUTH_VALID_EMAIL_DOMAIN) < 0) {
    throw new Error(`Email must have a ${config.GOOGLE_OAUTH_VALID_EMAIL_DOMAIN} domain`);
  }

  const user = await User.getBy('email', googleResult.email);
  if (!user) {
    throw new Error(`User not found for ${googleResult.email}`);
  }

  const lastLoginAt = new Date().toUTCString();
  const googleAuth = await GoogleAuth.updateOrCreate({
    accessToken: oauth.access_token,
    expiresAt: new Date(new Date().valueOf() + oauth.expires_in).toISOString(),
    userId: user.id,
  });
  const updatedUser = await User.update(user.id, {
    lastLoginAt,
    googleProfileImageUrl: googleResult.picture,
    googleAuthId: googleAuth.id,
  });

  const authToken = signJwt({
    userId: user.id,
    userRole: user.userRole,
    lastLoginAt,
  });

  logger.log(`User login for ${user.id}`, 2);
  return { authToken, user: updatedUser };
}
/* tslint:enable check-is-allowed */
