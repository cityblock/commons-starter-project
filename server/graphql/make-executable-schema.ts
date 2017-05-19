import * as fs from 'fs';
import { GraphQLDateTime, GraphQLEmail, GraphQLPassword } from 'graphql-custom-types';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';
import config from '../config';
import {
  addUserToCareTeam,
  removeUserFromCareTeam,
  resolvePatientCareTeam,
} from './care-team-resolver';
import { createClinic, resolveClinic } from './clinic-resolver';
import { resolvePatient } from './patient-resolver';
import { createUser, login, resolveCurrentUser, resolveUser } from './user-resolver';

const schemaGql = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8');

const resolveFunctions = {
  GraphQLDateTime,
  GraphQLEmail,
  GraphQLPassword: new GraphQLPassword(6, 60),
  RootQueryType: {
    clinic: resolveClinic,
    currentUser: resolveCurrentUser,
    patient: resolvePatient,
    patientCareTeam: resolvePatientCareTeam,
    user: resolveUser,
  },
  RootMutationType: {
    addUserToCareTeam,
    removeUserFromCareTeam,
    createClinic,
    createUser,
    login,
  },
};

const logger = {
  log: (e: any) => {
    /* istanbul ignore if  */
    if (config.NODE_ENV !== 'test' && config.NODE_ENV !== 'production') {
      /* tslint:disable no-console */
      console.log(e);
      /* tslint:enable no-console */
    }
  },
};

const schema = makeExecutableSchema({
  typeDefs: schemaGql,
  resolvers: resolveFunctions,
  logger,
});

export default schema;
