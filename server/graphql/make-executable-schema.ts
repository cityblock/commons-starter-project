import * as fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';
import config from '../config';
import { appointmentAddNote, appointmentEnd, appointmentStart } from './appointments-resolver';
import {
  careTeamAddUser,
  careTeamRemoveUser,
  resolvePatientCareTeam,
  resolveUserPatientPanel,
} from './care-team-resolver';
import { clinicCreate, resolveClinic, resolveClinics } from './clinic-resolver';
import { resolvePatientEncounters } from './patient-encounters-resolver';
import { resolvePatientMedications } from './patient-medications-resolver';
import {
  patientEdit,
  patientScratchPadEdit,
  patientSetup,
  resolvePatient,
  resolvePatientHealthRecord,
  resolvePatientScratchPad,
} from './patient-resolver';
import {
  resolveTaskComment,
  resolveTaskComments,
  taskCommentCreate,
  taskCommentDelete,
  taskCommentEdit,
} from './task-comment-resolver';
import {
  resolveCurrentUserTasks, taskUserFollow, taskUserUnfollow,
} from './task-follower-resolver';
import {
  resolvePatientTasks,
  resolveTask,
  taskComplete,
  taskCreate,
  taskDelete,
  taskEdit,
  taskUncomplete,
} from './task-resolver';
import {
  currentUserEdit,
  resolveCurrentUser,
  resolveUser,
  resolveUsers,
  userCreate,
  userLogin,
} from './user-resolver';

const schemaGql = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8');

const resolveFunctions = {
  RootQueryType: {
    clinic: resolveClinic,
    clinics: resolveClinics,
    currentUser: resolveCurrentUser,
    patient: resolvePatient,
    patientHealthRecord: resolvePatientHealthRecord,
    patientCareTeam: resolvePatientCareTeam,
    patientEncounters: resolvePatientEncounters,
    patientMedications: resolvePatientMedications,
    patientScratchPad: resolvePatientScratchPad,
    user: resolveUser,
    users: resolveUsers,
    userPatientPanel: resolveUserPatientPanel,
    task: resolveTask,
    tasksForPatient: resolvePatientTasks,
    tasksForCurrentUser: resolveCurrentUserTasks,
    taskComments: resolveTaskComments,
    taskComment: resolveTaskComment,
  },
  RootMutationType: {
    appointmentAddNote,
    appointmentStart,
    appointmentEnd,
    careTeamAddUser,
    careTeamRemoveUser,
    clinicCreate,
    patientEdit,
    patientSetup,
    patientScratchPadEdit,
    currentUserEdit,
    userCreate,
    userLogin,
    taskCreate,
    taskDelete,
    taskEdit,
    taskComplete,
    taskUncomplete,
    taskUserFollow,
    taskUserUnfollow,
    taskCommentCreate,
    taskCommentEdit,
    taskCommentDelete,
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

const schema = (makeExecutableSchema as any)({
  typeDefs: schemaGql,
  resolvers: resolveFunctions,
  logger,
});

export default schema;
