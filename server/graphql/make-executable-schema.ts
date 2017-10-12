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
import {
  carePlanSuggestionAccept,
  carePlanSuggestionDismiss,
  resolveCarePlanForPatient,
  resolveCarePlanSuggestionsForPatient,
} from './care-plan-resolver';
import {
  careTeamAddUser,
  careTeamRemoveUser,
  resolvePatientCareTeam,
  resolveUserPatientPanel,
} from './care-team-resolver';
import { clinicCreate, resolveClinic, resolveClinics } from './clinic-resolver';
import {
  concernCreate,
  concernDelete,
  concernEdit,
  resolveConcern,
  resolveConcerns,
} from './concern-resolver';
import {
  concernSuggestionCreate,
  concernSuggestionDelete,
  resolveConcernsForAnswer,
} from './concern-suggestion-resolver';
import {
  eventNotificationDismiss,
  resolveEventNotificationsForCurrentUser,
  resolveEventNotificationsForTask,
} from './event-notification-resolver';
import {
  goalSuggestionCreate,
  goalSuggestionDelete,
  resolveGoalSuggestionTemplatesForAnswer,
} from './goal-suggestion-resolver';
import {
  goalSuggestionTemplateCreate,
  goalSuggestionTemplateDelete,
  goalSuggestionTemplateEdit,
  resolveGoalSuggestionTemplate,
  resolveGoalSuggestionTemplates,
} from './goal-suggestion-template-resolver';
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
import {
  patientConcernCreate,
  patientConcernDelete,
  patientConcernEdit,
  resolvePatientConcern,
  resolvePatientConcernsForPatient,
} from './patient-concern-resolver';
import { resolvePatientEncounters } from './patient-encounters-resolver';
import {
  patientGoalCreate,
  patientGoalDelete,
  patientGoalEdit,
  resolvePatientGoal,
  resolvePatientGoalsForPatient,
} from './patient-goal-resolver';
import { resolvePatientMedications } from './patient-medications-resolver';
import {
  patientEdit,
  patientScratchPadEdit,
  patientSetup,
  resolvePatient,
  resolvePatientScratchPad,
} from './patient-resolver';
import {
  patientScreeningToolSubmissionCreate,
  patientScreeningToolSubmissionDelete,
  patientScreeningToolSubmissionEdit,
  resolvePatientScreeningToolSubmission,
  resolvePatientScreeningToolSubmissions,
  resolvePatientScreeningToolSubmissionsForPatient,
} from './patient-screening-tool-submission-resolver';
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
  resolveQuestionsForRiskAreaOrScreeningTool,
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
  resolveScreeningTool,
  resolveScreeningTools,
  resolveScreeningToolsForRiskArea,
  screeningToolCreate,
  screeningToolDelete,
  screeningToolEdit,
} from './screening-tool-resolver';
import {
  resolveScreeningToolScoreRange,
  resolveScreeningToolScoreRanges,
  resolveScreeningToolScoreRangesForScreeningTool,
  resolveScreeningToolScoreRangeForScoreAndScreeningTool,
  screeningToolScoreRangeCreate,
  screeningToolScoreRangeDelete,
  screeningToolScoreRangeEdit,
} from './screening-tool-score-range-resolver';
import {
  resolveTaskComment,
  resolveTaskComments,
  taskCommentCreate,
  taskCommentDelete,
  taskCommentEdit,
} from './task-comment-resolver';
import {
  resolveCurrentUserTasks,
  taskUserFollow,
  taskUserUnfollow,
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
  resolveTaskTemplate,
  resolveTaskTemplates,
  taskTemplateCreate,
  taskTemplateDelete,
  taskTemplateEdit,
} from './task-template-resolver';
import {
  currentUserEdit,
  resolveCurrentUser,
  resolveUser,
  resolveUsers,
  userCreate,
  userDelete,
  userEditRole,
  userLogin,
} from './user-resolver';

const schemaGql = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8');

/* tslint:disable:max-line-length */
const resolveFunctions = {
  RootQueryType: {
    clinic: resolveClinic,
    clinics: resolveClinics,
    currentUser: resolveCurrentUser,
    patient: resolvePatient,
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
    questionsForRiskAreaOrScreeningTool: resolveQuestionsForRiskAreaOrScreeningTool,
    answer: resolveAnswer,
    answersForQuestion: resolveAnswersForQuestion,
    questionCondition: resolveQuestionCondition,
    eventNotificationsForCurrentUser: resolveEventNotificationsForCurrentUser,
    eventNotificationsForTask: resolveEventNotificationsForTask,
    patientAnswer: resolvePatientAnswer,
    patientAnswersForQuestion: resolvePatientAnswersForQuestion,
    patientPreviousAnswersForQuestion: resolvePreviousPatientAnswersForQuestion,
    patientAnswersForRiskArea: resolvePatientAnswersForRiskArea,
    concern: resolveConcern,
    concerns: resolveConcerns,
    concernsForAnswer: resolveConcernsForAnswer,
    patientConcern: resolvePatientConcern,
    patientConcerns: resolvePatientConcernsForPatient,
    patientGoal: resolvePatientGoal,
    patientGoals: resolvePatientGoalsForPatient,
    goalSuggestionTemplate: resolveGoalSuggestionTemplate,
    goalSuggestionTemplates: resolveGoalSuggestionTemplates,
    goalSuggestionTemplatesForAnswer: resolveGoalSuggestionTemplatesForAnswer,
    taskTemplate: resolveTaskTemplate,
    taskTemplates: resolveTaskTemplates,
    carePlanSuggestionsForPatient: resolveCarePlanSuggestionsForPatient,
    carePlanForPatient: resolveCarePlanForPatient,
    screeningTool: resolveScreeningTool,
    screeningTools: resolveScreeningTools,
    screeningToolsForRiskArea: resolveScreeningToolsForRiskArea,
    screeningToolScoreRange: resolveScreeningToolScoreRange,
    screeningToolScoreRangeForScoreAndScreeningTool: resolveScreeningToolScoreRangeForScoreAndScreeningTool,
    screeningToolScoreRanges: resolveScreeningToolScoreRanges,
    screeningToolScoreRangesForScreeningTool: resolveScreeningToolScoreRangesForScreeningTool,
    patientScreeningToolSubmission: resolvePatientScreeningToolSubmission,
    patientScreeningToolSubmissionsForPatient: resolvePatientScreeningToolSubmissionsForPatient,
    patientScreeningToolSubmissions: resolvePatientScreeningToolSubmissions,
  },
  /* tslint:enable:max-line-length */
  RootMutationType: {
    careTeamAddUser,
    careTeamRemoveUser,
    clinicCreate,
    patientEdit,
    patientSetup,
    patientScratchPadEdit,
    currentUserEdit,
    userCreate,
    userLogin,
    userEditRole,
    userDelete,
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
    concernSuggestionCreate,
    concernSuggestionDelete,
    concernCreate,
    concernDelete,
    concernEdit,
    goalSuggestionTemplateCreate,
    goalSuggestionTemplateEdit,
    goalSuggestionTemplateDelete,
    goalSuggestionCreate,
    goalSuggestionDelete,
    taskTemplateCreate,
    taskTemplateEdit,
    taskTemplateDelete,
    patientConcernCreate,
    patientConcernDelete,
    patientConcernEdit,
    patientGoalCreate,
    patientGoalDelete,
    patientGoalEdit,
    carePlanSuggestionAccept,
    carePlanSuggestionDismiss,
    screeningToolCreate,
    screeningToolEdit,
    screeningToolDelete,
    screeningToolScoreRangeCreate,
    screeningToolScoreRangeEdit,
    screeningToolScoreRangeDelete,
    patientScreeningToolSubmissionCreate,
    patientScreeningToolSubmissionEdit,
    patientScreeningToolSubmissionDelete,
  },
};

const logger = {
  log: (e: any) => {
    /* istanbul ignore next */
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
