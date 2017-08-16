import * as fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';
import config from '../config';
import {
  answerCreate,
  answerDelete,
  answerEdit,
  resolveAnswer,
  resolveAnswersForQuestion,
} from './answer-resolver';
import { appointmentAddNote, appointmentEnd, appointmentStart } from './appointments-resolver';
import {
  careTeamAddUser,
  careTeamRemoveUser,
  resolvePatientCareTeam,
  resolveUserPatientPanel,
} from './care-team-resolver';
import { clinicCreate, resolveClinic, resolveClinics } from './clinic-resolver';
import {
  eventNotificationDismiss,
  resolveEventNotificationsForCurrentUser,
  resolveEventNotificationsForTask,
} from './event-notification-resolver';
import {
  patientAnswersCreate,
  patientAnswersUpdateApplicable,
  patientAnswerDelete,
  patientAnswerEdit,
  resolvePatientAnswer,
  resolvePatientAnswersForQuestion,
  resolvePatientAnswersForRiskArea,
  resolvePreviousPatientAnswersForQuestion,
} from './patient-answer-resolver';
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
  questionConditionCreate,
  questionConditionDelete,
  questionConditionEdit,
  resolveQuestionCondition,
} from './question-condition-resolver';
import {
  questionCreate,
  questionDelete,
  questionEdit,
  resolveQuestion,
  resolveQuestionsForRiskArea,
} from './question-resolver';
import {
  resolvePatientRiskAreaRiskScore,
  resolvePatientRiskAreaSummary,
  resolveRiskArea,
  resolveRiskAreas,
  riskAreaCreate,
  riskAreaDelete,
  riskAreaEdit,
} from './risk-area-resolver';
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
    riskArea: resolveRiskArea,
    riskAreas: resolveRiskAreas,
    patientRiskAreaRiskScore: resolvePatientRiskAreaRiskScore,
    patientRiskAreaSummary: resolvePatientRiskAreaSummary,
    question: resolveQuestion,
    questionsForRiskArea: resolveQuestionsForRiskArea,
    answer: resolveAnswer,
    answersForQuestion: resolveAnswersForQuestion,
    questionCondition: resolveQuestionCondition,
    eventNotificationsForCurrentUser: resolveEventNotificationsForCurrentUser,
    eventNotificationsForTask: resolveEventNotificationsForTask,
    patientAnswer: resolvePatientAnswer,
    patientAnswersForQuestion: resolvePatientAnswersForQuestion,
    patientPreviousAnswersForQuestion: resolvePreviousPatientAnswersForQuestion,
    patientAnswersForRiskArea: resolvePatientAnswersForRiskArea,
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
    questionEdit,
    questionCreate,
    questionDelete,
    answerEdit,
    answerCreate,
    answerDelete,
    questionConditionEdit,
    questionConditionCreate,
    questionConditionDelete,
    riskAreaEdit,
    riskAreaCreate,
    riskAreaDelete,
    eventNotificationDismiss,
    patientAnswersCreate,
    patientAnswerDelete,
    patientAnswerEdit,
    patientAnswersUpdateApplicable,
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
