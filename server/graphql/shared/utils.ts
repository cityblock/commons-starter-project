import { ErrorReporting } from '@google-cloud/error-reporting';
import * as trace from '@google-cloud/trace-agent';
import * as base64 from 'base-64';
import * as express from 'express';
import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { decode, sign, verify } from 'jsonwebtoken';
import { isArray } from 'lodash';
import { Transaction } from 'objection';
import { Permissions } from '../../../shared/permissions/permissions-mapping';
import config from '../../config';
import Logger from '../../logging';
import User from '../../models/user';

export const TWENTY_FOUR_HOURS_IN_MILLISECONDS = 86400000;

export interface IGraphQLContextOptions {
  request?: express.Request;
  response?: express.Response;
  errorReporting: ErrorReporting;
}

export interface IContext {
  logger: Logger;
  testConfig?: any;
  errorReporting?: ErrorReporting;
  permissions: Permissions;
  userId?: string;
  testTransaction?: Transaction;
}

export function formatRelayEdge(node: any, id: string) {
  return {
    cursor: base64.encode(id),
    node,
  };
}

export interface IJWTData {
  userId: string;
  permissions: Permissions;
  lastLoginAt: string;
}

export interface IJWTForPDFData {
  type: string;
  createdAt: string;
  userId: string;
}

export interface IJWTForVCFData {
  createdAt: string;
  userId: string;
}

export const signJwt = (
  jwtData: IJWTData | IJWTForPDFData | IJWTForVCFData,
  expiresIn: string | number = config.JWT_EXPIRY,
) => sign(jwtData, config.JWT_SECRET, { expiresIn });

export async function decodeJwt(jwt: string): Promise<IJWTData | IJWTForPDFData | IJWTForVCFData> {
  // verify throws an error if jwt is not valid and if expiry passed
  await verify(jwt, config.JWT_SECRET);

  return decode(jwt) as IJWTData | IJWTForPDFData | IJWTForVCFData;
}

// only use with non-PDF related tokens
export async function parseAndVerifyJwt(jwt: string) {
  const decoded = (await decodeJwt(jwt)) as IJWTData;

  // goal: allow user to be logged into exactly 1 device at a time
  // solution: invalidate token if user has logged in on a different device since token was issued
  const lastLoginAt = await User.getLastLoggedIn(decoded.userId);
  if (isInvalidLogin(decoded.lastLoginAt, lastLoginAt)) {
    throw new Error('token invalid: login too old');
  }
  return decoded;
}

const isInvalidLogin = (tokenLastLoginAt: string, userLastLoginAt: string | undefined): boolean => {
  const tokenLoginDateTime = new Date(tokenLastLoginAt).valueOf() + 1000;
  const currentLoginDateTime = new Date(userLastLoginAt || '0').valueOf();

  const newerLoginExists = tokenLoginDateTime < currentLoginDateTime;
  const loginTooOld = tokenLoginDateTime + TWENTY_FOUR_HOURS_IN_MILLISECONDS < new Date().valueOf();

  return newerLoginExists || loginTooOld;
};

export const logGraphQLContext = (
  req: express.Request,
  res: express.Response,
  logger: Logger,
  userId?: string,
  permissions?: Permissions,
) => {
  const { variables } = req.body;

  const requests = isArray(req.body) ? req.body : [req.body];
  requests.forEach(request => {
    const formattedQuery =
      request && request.query ? request.query.replace(/\s*\n\s*/g, ' ') : 'no query';

    logger.log(
      `### REQUEST ### userId: ${userId}, permissions: ${permissions}, variables: ${JSON.stringify(
        variables,
      )}, operation: ${request.operationName}, query: ${formattedQuery}`,
    );
  });

  // Overwrites stubbed response in tests so cannot run in tests
  if (config.NODE_ENV !== 'test') {
    // Monkey patch res.write
    const originalWrite = res.write;
    res.write = (data: string) => {
      switch (res.statusCode) {
        case 200:
          logger.log(
            `### RESPONSE ### userId: ${userId}, permissions: ${permissions}, data: ${data}`,
          );
          break;
        default:
          console.error(data);
      }

      return originalWrite.call(res, data);
    };
  }
};

export async function getGraphQLContext(
  authToken: string,
  logger: Logger,
  options: IGraphQLContextOptions,
): Promise<IContext> {
  const { request, response, errorReporting } = options;

  const traceAgent = trace.get();
  const childSpan = traceAgent.createChildSpan({ name: 'authentication' });

  let permissions: Permissions = 'black';
  let userId;

  if (authToken) {
    try {
      const parsedToken = await parseAndVerifyJwt(authToken);
      userId = parsedToken.userId;
      permissions = parsedToken.permissions;
    } catch (e) {
      if (request && response) {
        logGraphQLContext(request, response, logger, 'anonymous user');
      }

      return {
        permissions: 'black' as Permissions,
        logger,
        errorReporting,
      };
    }
  }

  childSpan.endSpan();

  if (request && response) {
    logGraphQLContext(request, response, logger, userId, permissions);
  }

  return {
    userId,
    permissions,
    logger,
    errorReporting,
  };
}

export interface IPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const PageInfo = new GraphQLObjectType({
  name: 'PageInfo',
  fields: {
    hasNextPage: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    hasPreviousPage: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
});

export interface IOrderOptions<T> {
  orderBy: T;
  order: 'asc' | 'desc';
}

export function formatOrderOptions<T>(orderBy: string | undefined, def: any): IOrderOptions<T> {
  if (!orderBy) {
    return def;
  }
  if (orderBy.indexOf('Asc') > -1) {
    return {
      order: 'asc',
      orderBy: orderBy.replace('Asc', '') as any,
    };
  } else if (orderBy.indexOf('Desc') > -1) {
    return {
      order: 'desc',
      orderBy: orderBy.replace('Desc', '') as any,
    };
  }
  throw new Error('orderby should contain Asc or Desc');
}

export function checkUserLoggedIn(userId?: string) {
  if (!userId) {
    throw new Error('not logged in');
  }
}
