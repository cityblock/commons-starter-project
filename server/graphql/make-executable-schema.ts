import * as fs from 'fs';
import { GraphQLDateTime, GraphQLEmail, GraphQLPassword } from 'graphql-custom-types';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';
import config from '../config';
import {
  addUserToCareTeam,
  removeUserFromCareTeam,
  resolvePatientCareTeam,
  resolveUserPatientPanel,
} from './care-team-resolver';
import { createClinic, resolveClinic } from './clinic-resolver';
import { resolvePatientEncounters } from './patient-encounters-resolver';
import { resolvePatientMedications } from './patient-medications-resolver';
import {
  resolvePatient,
  resolvePatientHealthRecord,
} from './patient-resolver';
import { createUser, login, resolveCurrentUser, resolveUser, resolveUsers } from './user-resolver';

const schemaGql = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8');

const resolveFunctions = {
  GraphQLDateTime,
  GraphQLEmail,
  GraphQLPassword: new GraphQLPassword(6, 60),
  RootQueryType: {
    clinic: resolveClinic,
    currentUser: resolveCurrentUser,
    patient: resolvePatient,
    patientHealthRecord: resolvePatientHealthRecord,
    patientCareTeam: resolvePatientCareTeam,
    patientEncounters: resolvePatientEncounters,
    patientMedications: resolvePatientMedications,
    user: resolveUser,
    users: resolveUsers,
    userPatientPanel: resolveUserPatientPanel,
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
