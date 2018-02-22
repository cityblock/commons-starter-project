import * as base64 from 'base-64';
import * as express from 'express';
import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { decode, sign, verify } from 'jsonwebtoken';
import { transaction, Transaction } from 'objection';
import { Permissions } from '../../../shared/permissions/permissions-mapping';
import config from '../../config';
import Db from '../../db';
import User from '../../models/user';

export const TWENTY_FOUR_HOURS_IN_MILLISECONDS = 86400000;

export interface ILogger {
  log: (text: string, logLevel: number) => void;
}

export interface IContext {
  db: Db;
  permissions: Permissions;
  userId?: string;
  logger: ILogger;
  txn: Transaction;
  datadogContext: any;
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

export const signJwt = (
  jwtData: IJWTData | IJWTForPDFData,
  expiresIn: string | number = config.JWT_EXPIRY,
) => sign(jwtData, config.JWT_SECRET, { expiresIn });

export async function decodeJwt(jwt: string): Promise<IJWTData | IJWTForPDFData> {
  // verify throws an error if jwt is not valid and if expiry passed
  await verify(jwt, config.JWT_SECRET);

  return decode(jwt) as IJWTData | IJWTForPDFData;
}

// only use with non-PDF related tokens
export async function parseAndVerifyJwt(jwt: string, txn: Transaction) {
  const decoded = (await decodeJwt(jwt)) as IJWTData;

  // goal: allow user to be logged into exactly 1 device at a time
  // solution: invalidate token if user has logged in on a different device since token was issued
  const lastLoginAt = await User.getLastLoggedIn(decoded.userId, txn);
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

export async function getGraphQLContext(
  request: express.Request,
  logger: ILogger,
  existingTxn?: Transaction,
  dataDog?: any,
): Promise<IContext> {
  const authToken = request.headers.auth_token as string;
  const db = await Db.get();

  const datadogContext = dataDog ? dataDog.context(request) : null;
  const txn = existingTxn || (await transaction.start(User));
  let permissions: Permissions = 'black';
  let userId;

  if (authToken) {
    try {
      const parsedToken = await parseAndVerifyJwt(authToken, txn);
      userId = parsedToken.userId;
      permissions = parsedToken.permissions;
    } catch (e) {
      return {
        db,
        permissions: 'black' as Permissions,
        logger,
        txn,
        datadogContext,
      };
    }
  }
  return {
    userId,
    permissions,
    db,
    logger,
    txn,
    datadogContext,
  };
}

export async function formatResponse(response: any, { context }: any): Promise<any> {
  try {
    await context.txn.commit();
  } catch (err) {
    await context.trx.rollback();
    /* tslint:disable no-console */
    console.log('Transaction failed with error: ', err);
    /* tslint:enable no-console */
  }
  return response;
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
