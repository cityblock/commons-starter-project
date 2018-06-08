import { transaction } from 'objection';
import {
  ICurrentUserEditInput,
  IJwtForPdfCreateInput,
  IRootMutationType,
  IRootQueryType,
  IUserCreateInput,
  IUserDeleteInput,
  IUserEditPermissionsInput,
  IUserEditRoleInput,
  IUserLoginInput,
  IUserNode,
  Permissions,
  UserRole,
} from 'schema';
import { GENERATE_PDF_JWT_TYPE } from '../../server/handlers/pdf/render-pdf';
import { parseIdToken, OauthAuthorize } from '../apis/google/oauth-authorize';
import config from '../config';
import GoogleAuth from '../models/google-auth';
import PatientGlassBreak from '../models/patient-glass-break';
import User, { IUserFilterOptions, Locale, UserOrderOptions } from '../models/user';
import checkUserPermissions, {
  checkLoggedInWithPermissions,
  validateGlassBreak,
} from './shared/permissions-check';
import { formatOrderOptions, formatRelayEdge, signJwt, IContext } from './shared/utils';

const GENERATE_PDF_EXPIRY = '5m'; // 5 minutes
const DOWNLOAD_VCF_EXPIRY = '5m'; // 5 minutes

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

export interface IUserEditPermissionsOptions {
  input: IUserEditPermissionsInput;
}

export interface IUserDeleteOptions {
  input: IUserDeleteInput;
}

export interface IEditCurrentUserOptions {
  input: ICurrentUserEditInput;
}

export interface IUserJwtForPdfArgs {
  input: IJwtForPdfCreateInput;
}

export async function userCreate(
  root: any,
  { input }: IUserCreateArgs,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['userCreate']> {
  const { email, homeClinicId } = input;
  return transaction(testTransaction || User.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'user', txn);

    const user = await User.getBy({ fieldName: 'email', field: email }, txn);

    if (user) {
      throw new Error(`Cannot create account: Email already exists for ${email}`);
    } else {
      return User.create(
        {
          email,
          userRole: 'healthCoach' as UserRole,
          homeClinicId,
        },
        txn,
      );
    }
  });
}

export async function userEditRole(
  root: any,
  { input }: IUserEditRoleOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['userEditRole']> {
  const { userRole, email } = input;
  return transaction(testTransaction || User.knex(), async txn => {
    await checkUserPermissions(userId, permissions as Permissions, 'edit', 'user', txn);

    const user = await User.getBy({ fieldName: 'email', field: email }, txn);
    if (!user) {
      throw new Error('User not found');
    }

    return User.updateUserRole(user.id, userRole as UserRole, txn);
  });
}

export async function userEditPermissions(
  root: any,
  { input }: IUserEditPermissionsOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['userEditPermissions']> {
  return transaction(testTransaction || User.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'user', txn);

    const user = await User.getBy({ fieldName: 'email', field: input.email }, txn);
    if (!user) {
      throw new Error('User not found');
    }

    return User.updateUserPermissions(user.id, input.permissions, txn);
  });
}

export async function userDelete(
  root: any,
  { input }: IUserDeleteOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['userDelete']> {
  const { email } = input;
  return transaction(testTransaction || User.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'delete', 'user', txn);

    const user = await User.getBy({ fieldName: 'email', field: email }, txn);
    if (!user) {
      throw new Error('User not found');
    }

    await User.delete(user.id, txn);
    return user;
  });
}

/* tslint:disable:check-is-allowed */
export async function resolveCurrentUser(
  root: any,
  args: any,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['currentUser']> {
  return transaction(testTransaction || User.knex(), async txn => {
    checkLoggedInWithPermissions(userId, permissions);
    return User.get(userId!, txn);
  });
}

export async function currentUserEdit(
  root: any,
  args: IEditCurrentUserOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['currentUserEdit']> {
  return transaction(testTransaction || User.knex(), async txn => {
    checkLoggedInWithPermissions(userId, permissions);

    return User.update(
      userId!,
      {
        locale: args.input.locale as Locale,
        awayMessage: args.input.awayMessage || undefined,
        isAvailable:
          typeof args.input.isAvailable === 'boolean' ? args.input.isAvailable : undefined,
      },
      txn,
    );
  });
}
/* tslint:enable:check-is-allowed */

export async function resolveUsers(
  root: any,
  args: Partial<IUserFilterOptions>,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['users']> {
  return transaction(testTransaction || User.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'allUsers', txn);

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
  });
}

export async function resolveUserSummaryList(
  root: any,
  { userRoleFilters }: IUserSummaryOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['userSummaryList']> {
  return transaction(testTransaction || User.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'allUsers', txn);

    return User.getUserSummaryList(userRoleFilters, txn);
  });
}

export async function JwtForPdfCreate(
  root: {},
  { input }: IUserJwtForPdfArgs,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['JwtForPdfCreate']> {
  return transaction(testTransaction || User.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, input.patientId);

    // load the current glass break for user and patient
    const glassBreaks = await PatientGlassBreak.getForCurrentUserPatientSession(
      userId!,
      input.patientId,
      txn,
    );
    const glassBreakId = glassBreaks && glassBreaks.length ? glassBreaks[0].id : null;

    await validateGlassBreak(userId!, permissions, 'patient', input.patientId, txn, glassBreakId);
    const jwtData = {
      type: GENERATE_PDF_JWT_TYPE,
      createdAt: new Date().toISOString(),
      userId: userId!,
    };

    const authToken = signJwt(jwtData, GENERATE_PDF_EXPIRY);
    return { authToken };
  });
}

export async function JwtForVcfCreate(
  root: {},
  input: {},
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['JwtForVcfCreate']> {
  return transaction(testTransaction || User.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'allPatients', txn);

    const jwtData = {
      createdAt: new Date().toISOString(),
      userId: userId!,
    };

    const authToken = signJwt(jwtData, DOWNLOAD_VCF_EXPIRY);
    return { authToken };
  });
}

// disabling isAllowed check for login endpoint so users can log in
/* tslint:disable check-is-allowed */
export async function userLogin(
  root: any,
  { input }: IUserLoginOptions,
  { logger, testTransaction }: IContext,
): Promise<IRootMutationType['userLogin']> {
  return transaction(testTransaction || User.knex(), async txn => {
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
        refreshToken: oauth.refresh_token,
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
      permissions: user.permissions,
      lastLoginAt,
    });

    logger.log(`User login for ${user.id}`);
    return { authToken, user: updatedUser };
  });
}
/* tslint:enable check-is-allowed */
