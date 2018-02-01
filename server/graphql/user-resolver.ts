import {
  ICurrentUserEditInput,
  IUserCreateInput,
  IUserDeleteInput,
  IUserEdges,
  IUserEditRoleInput,
  IUserLoginInput,
  IUserNode,
} from 'schema';
import { GENERATE_PDF_JWT_TYPE } from '../../server/handlers/pdf/render-pdf';
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

const GENERATE_PDF_EXPIRY = '5m'; // 5 minutes

export interface IUserCreateArgs {
  input: IUserCreateInput;
}

export interface IUserSummaryOptions {
  userRoleFilters: UserRole[];
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
  const { userRole, txn } = context;
  const { email, homeClinicId } = input;
  await accessControls.isAllowed(userRole, 'create', 'user');

  const user = await User.getBy({ fieldName: 'email', field: email }, txn);

  if (user) {
    throw new Error(`Cannot create account: Email already exists for ${email}`);
  } else {
    return User.create(
      {
        email,
        userRole: 'healthCoach',
        homeClinicId,
      },
      txn,
    );
  }
}

export async function userEditRole(root: any, { input }: IUserEditRoleOptions, context: IContext) {
  const { txn } = context;
  const { userRole, email } = input;
  await accessControls.isAllowed(context.userRole, 'edit', 'user');

  // Special case - only admin can edit this field
  if (context.userRole !== 'admin') {
    throw new Error(`${context.userRole} not able to edit user role`);
  }

  const user = await User.getBy({ fieldName: 'email', field: email }, txn);
  if (!user) {
    throw new Error('User not found');
  }

  return User.updateUserRole(user.id, userRole as UserRole, txn);
}

export async function userDelete(
  root: any,
  { input }: IUserDeleteOptions,
  { db, userRole, txn }: IContext,
) {
  const { email } = input;
  await accessControls.isAllowed(userRole, 'delete', 'user');

  const user = await User.getBy({ fieldName: 'email', field: email }, txn);
  if (!user) {
    throw new Error('User not found');
  }

  await User.delete(user.id, txn);
  return user;
}

export async function resolveUser(
  root: any,
  args: IResolveUserOptions,
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'user');

  return User.get(args.userId, txn);
}

export async function resolveCurrentUser(
  root: any,
  args: any,
  { db, userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'user');
  checkUserLoggedIn(userId);

  return User.get(userId!, txn);
}

export async function currentUserEdit(
  root: any,
  args: IEditCurrentUserOptions,
  { db, userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'user', userId, userId);
  checkUserLoggedIn(userId);

  return User.update(
    userId!,
    {
      locale: (args.input.locale as Locale) || undefined,
      phone: args.input.phone || undefined,
      firstName: args.input.firstName || undefined,
      lastName: args.input.lastName || undefined,
    },
    txn,
  );
}

export async function resolveUsers(
  root: any,
  args: Partial<IUserFilterOptions>,
  { db, userRole, txn }: IContext,
): Promise<IUserEdges> {
  await accessControls.isAllowed(userRole, 'view', 'allUsers');

  const pageNumber = args.pageNumber || 0;
  const pageSize = args.pageSize || 10;

  const { order, orderBy } = formatOrderOptions<UserOrderOptions>(args.orderBy, {
    order: 'desc',
    orderBy: 'createdAt',
  });

  const users = await User.getAll(
    {
      pageNumber,
      pageSize,
      hasLoggedIn: !!args.hasLoggedIn,
      orderBy,
      order,
    },
    txn,
  );
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

export async function resolveUserSummaryList(
  root: any,
  { userRoleFilters }: IUserSummaryOptions,
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'allUsers');
  return User.getUserSummaryList(userRoleFilters, txn);
}

// disabling isAllowed check for login endpoint so users can log in
/* tslint:disable check-is-allowed */
export async function userLogin(
  root: any,
  { input }: IUserLoginOptions,
  { db, logger, txn }: IContext,
) {
  const { googleAuthCode } = input;

  const oauth = await OauthAuthorize(googleAuthCode);
  if (!oauth || !oauth.access_token) {
    throw new Error(`Google auth rejected`);
  }

  const googleResult = parseIdToken(oauth.id_token);
  if (googleResult.email.indexOf(config.GOOGLE_OAUTH_VALID_EMAIL_DOMAIN) < 0) {
    throw new Error(`Email must have a ${config.GOOGLE_OAUTH_VALID_EMAIL_DOMAIN} domain`);
  }

  const user = await User.getBy({ fieldName: 'email', field: googleResult.email }, txn);
  if (!user) {
    throw new Error(`User not found for ${googleResult.email}`);
  }

  const lastLoginAt = new Date().toISOString();
  const googleAuth = await GoogleAuth.updateOrCreate(
    {
      accessToken: oauth.access_token,
      expiresAt: new Date(new Date().valueOf() + oauth.expires_in).toISOString(),
      userId: user.id,
    },
    txn,
  );
  const updatedUser = await User.update(
    user.id,
    {
      lastLoginAt,
      googleProfileImageUrl: googleResult.picture,
      googleAuthId: googleAuth.id,
      firstName: googleResult.given_name,
      lastName: googleResult.family_name,
    },
    txn,
  );

  const authToken = signJwt({
    userId: user.id,
    userRole: user.userRole,
    lastLoginAt,
  });

  logger.log(`User login for ${user.id}`, 2);
  return { authToken, user: updatedUser };
}

export async function JWTForPDFCreate(root: {}, input: {}, { db, userRole, userId }: IContext) {
  await accessControls.isAllowed(userRole, 'view', 'task');
  checkUserLoggedIn(userId);

  const jwtData = {
    type: GENERATE_PDF_JWT_TYPE,
    createdAt: new Date().toISOString(),
    userId: userId!,
  };

  const authToken = signJwt(jwtData, GENERATE_PDF_EXPIRY);
  return { authToken };
}
/* tslint:enable check-is-allowed */
