import * as base64 from 'base-64';
import * as express from 'express';
import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { decode, sign, verify } from 'jsonwebtoken';
import OpticsAgent from 'optics-agent';
import AthenaApi from '../../apis/athena';
import config from '../../config';
import Db from '../../db';
import User, { UserRole } from '../../models/user';

export interface IContext {
  db: Db;
  athenaApi: AthenaApi;
  userRole: UserRole;
  userId?: string;
  opticsContext: any;
}

export function formatRelayEdge(node: any, id: string) {
  return {
    cursor: base64.encode(id),
    node,
  };
}

interface IJWTData {
  userId: string;
  userRole: UserRole;
  lastLoginAt: string;
}

export const signJwt = (jwtData: IJWTData) => (
  sign(jwtData, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRY })
);

export async function parseAndVerifyJwt(jwt: string) {
  // verify throws an error if jwt is not valid and if expiry passed
  await verify(jwt, config.JWT_SECRET);

  const decoded = decode(jwt);

  // goal: allow user to be logged into exactly 1 device at a time
  // solution: invalidate token if user has logged in on a different device since token was issued
  const lastLoginAt = await User.getLastLoggedIn(decoded.userId);
  if (new Date(decoded.lastLoginAt).valueOf() + 1000 < new Date(lastLoginAt || 0).valueOf()) {
    throw new Error('token invalid: login too old');
  }
  return decoded;
}

export async function getGraphQLContext(request: express.Request): Promise<IContext> {
  const authToken = request.headers.auth_token;
  const [db, athenaApi] = await Promise.all([
    Db.get(),
    AthenaApi.get(),
  ]);

  let userRole: UserRole = 'anonymousUser';
  let userId = null;
  let opticsContext;

  if (authToken) {
    const parsedToken = await parseAndVerifyJwt(authToken);
    userId = parsedToken.userId;
    userRole = parsedToken.userRole;
  }

  if (config.NODE_ENV === 'production') {
    opticsContext = OpticsAgent.context(request);
  }
  return {
    userId,
    userRole,
    db,
    athenaApi,
    opticsContext,
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
