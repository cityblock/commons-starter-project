import { pickBy } from 'lodash';
import {
  ICurrentUserEditInput,
  IUserCreateInput,
  IUserDeleteInput,
  IUserEdges,
  IUserEditRoleInput,
  IUserLoginInput,
  IUserNode,
} from 'schema';
import { parseIdToken, OauthAuthorize } from '../apis/google/oauth-authorize';
import config from '../config';
import GoogleAuth from '../models/google-auth';
import User, { IUserFilterOptions, Locale, UserOrderOptions, UserRole } from '../models/user';
import accessControls from './shared/access-controls';
import {
  checkUserLoggedIn,
  formatOrderOptions,
  formatRelayEdge,
  signJwt,
  IContext,
} from './shared/utils';

export interface IUserCreateArgs {
  input: IUserCreateInput;
}

export interface IResolveUserOptions {
  userId: string;
}

export interface IUserLoginOptions {
  input: IUserLoginInput;
}

export interface IUserEditRoleOptions {
  input: IUserEditRoleInput;
}

export interface IUserDeleteOptions {
  input: IUserDeleteInput;
}

export interface IEditCurrentUserOptions {
  input: ICurrentUserEditInput;
}

export async function userCreate(root: any, { input }: IUserCreateArgs, context: IContext) {
  const { userRole } = context;
  const { email, homeClinicId } = input;
  await accessControls.isAllowed(userRole, 'create', 'user');

  const user = await User.getBy('email', email);

  if (user) {
    throw new Error(`Cannot create account: Email already exists for ${email}`);
  } else {
    return await User.create({
      email,
      userRole: 'healthCoach',
      homeClinicId,
    });
  }
}

export async function userEditRole(root: any, { input }: IUserEditRoleOptions, context: IContext) {
  const { userRole, email } = input;
  await accessControls.isAllowed(context.userRole, 'edit', 'user');

  // Special case - only admin can edit this field
  if (context.userRole !== 'admin') {
    throw new Error(`${context.userRole} not able to edit user role`);
  }

  const user = await User.getBy('email', email);
  if (!user) {
    throw new Error('User not found');
  }

  return await User.updateUserRole(user.id, userRole as UserRole);
}

export async function userDelete(
  root: any,
  { input }: IUserDeleteOptions,
  { db, userRole }: IContext,
) {
  const { email } = input;
  await accessControls.isAllowed(userRole, 'delete', 'user');

  const user = await User.getBy('email', email);
  if (!user) {
    throw new Error('User not found');
  }

  await User.delete(user.id);
  return user;
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

  const cleanedParams = pickBy<ICurrentUserEditInput>(args.input);
  return await User.update(userId!, {
    locale: (cleanedParams.locale as Locale) || undefined,
    firstName: cleanedParams.firstName || undefined,
    lastName: cleanedParams.lastName || undefined,
  });
}

export async function resolveUsers(
  root: any,
  args: Partial<IUserFilterOptions>,
  { db, userRole }: IContext,
): Promise<IUserEdges> {
  await accessControls.isAllowed(userRole, 'view', 'allUsers');

  const pageNumber = args.pageNumber || 0;
  const pageSize = args.pageSize || 10;

  const { order, orderBy } = formatOrderOptions<UserOrderOptions>(args.orderBy, {
    order: 'desc',
    orderBy: 'createdAt',
  });

  const users = await User.getAll({
    pageNumber,
    pageSize,
    hasLoggedIn: !!args.hasLoggedIn,
    orderBy,
    order,
  });
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

  const lastLoginAt = new Date().toISOString();
  const googleAuth = await GoogleAuth.updateOrCreate({
    accessToken: oauth.access_token,
    expiresAt: new Date(new Date().valueOf() + oauth.expires_in).toISOString(),
    userId: user.id,
  });
  const updatedUser = await User.update(user.id, {
    lastLoginAt,
    googleProfileImageUrl: googleResult.picture,
    googleAuthId: googleAuth.id,
    firstName: googleResult.given_name,
    lastName: googleResult.family_name,
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
