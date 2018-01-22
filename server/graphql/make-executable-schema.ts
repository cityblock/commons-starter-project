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
import { computedFieldFlagCreate } from './computed-field-flag-resolver';
import {
  computedFieldCreate,
  computedFieldDelete,
  resolveComputedField,
  resolveComputedFields,
} from './computed-field-resolver';
import { resolveComputedFieldsSchema } from './computed-field-schema-resolver';
import {
  concernAddDiagnosisCode,
  concernCreate,
  concernDelete,
  concernEdit,
  concernRemoveDiagnosisCode,
  resolveConcern,
  resolveConcerns,
} from './concern-resolver';
import {
  concernSuggestionCreate,
  concernSuggestionDelete,
  resolveConcernsForAnswer,
} from './concern-suggestion-resolver';
import {
  eventNotificationsForTaskDismiss,
  eventNotificationDismiss,
  resolveEventNotificationsForCurrentUser,
  resolveEventNotificationsForTask,
  resolveEventNotificationsForUserTask,
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
  patientAnswerDelete,
  patientAnswerEdit,
  resolvePatientAnswer,
  resolvePatientAnswers,
  resolvePreviousPatientAnswersForQuestion,
} from './patient-answer-resolver';
import {
  patientConcernBulkEdit,
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
import {
  patientListCreate,
  patientListDelete,
  patientListEdit,
  resolvePatientList,
  resolvePatientLists,
} from './patient-list-resolver';
import {
  patientEdit,
  patientScratchPadEdit,
  patientSetup,
  resolvePatient,
  resolvePatientsNewToCareTeam,
  resolvePatientsWithMissingInfo,
  resolvePatientsWithNoRecentEngagement,
  resolvePatientsWithOutOfDateMAP,
  resolvePatientsWithPendingSuggestions,
  resolvePatientsWithUrgentTasks,
  resolvePatientScratchPad,
  resolvePatientSearch,
} from './patient-resolver';
import {
  patientScreeningToolSubmissionCreate,
  patientScreeningToolSubmissionScore,
  resolvePatientScreeningToolSubmission,
  resolvePatientScreeningToolSubmissions,
  resolvePatientScreeningToolSubmissionsFor360,
  resolvePatientScreeningToolSubmissionsForPatient,
  resolvePatientScreeningToolSubmissionForPatientAndScreeningTool,
} from './patient-screening-tool-submission-resolver';
import {
  patientTaskSuggestionAccept,
  patientTaskSuggestionDismiss,
  resolvePatientTaskSuggestions,
} from './patient-task-suggestion-resolver';
import { resolveProgressNoteActivityForProgressNote } from './progress-note-activity-resolver';
import {
  progressNoteAddSupervisorNotes,
  progressNoteComplete,
  progressNoteCompleteSupervisorReview,
  progressNoteCreate,
  progressNoteEdit,
  resolveProgressNote,
  resolveProgressNotesForCurrentUser,
  resolveProgressNotesForPatient,
  resolveProgressNotesForSupervisorReview,
} from './progress-note-resolver';
import {
  progressNoteTemplateCreate,
  progressNoteTemplateDelete,
  progressNoteTemplateEdit,
  resolveProgressNoteTemplate,
  resolveProgressNoteTemplates,
} from './progress-note-template-resolver';
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
  resolveQuestions,
} from './question-resolver';
import {
  quickCallCreate,
  resolveQuickCall,
  resolveQuickCallsForProgressNote,
} from './quick-call-resolver';
import {
  resolveRiskAreaAssessmentSubmission,
  resolveRiskAreaAssessmentSubmissionForPatient,
  riskAreaAssessmentSubmissionComplete,
  riskAreaAssessmentSubmissionCreate,
} from './risk-area-assessment-submission-resolver';
import {
  resolveRiskAreaGroup,
  resolveRiskAreaGroups,
  resolveRiskAreaGroupForPatient,
  riskAreaGroupCreate,
  riskAreaGroupDelete,
  riskAreaGroupEdit,
} from './risk-area-group-resolver';
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
  resolveTasksDueSoonForPatient,
  resolveTasksWithNotificationsForPatient,
  resolveTaskIdsWithNotificationsForPatient,
  taskComplete,
  taskCreate,
  taskDelete,
  taskEdit,
  taskUncomplete,
} from './task-resolver';
import {
  resolveTaskSuggestionTemplatesForAnswer,
  taskSuggestionCreate,
  taskSuggestionDelete,
} from './task-suggestion-resolver';
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

const resolveFunctions = {
  RootQueryType: {
    clinic: resolveClinic,
    clinics: resolveClinics,
    currentUser: resolveCurrentUser,
    patient: resolvePatient,
    patientCareTeam: resolvePatientCareTeam,
    patientEncounters: resolvePatientEncounters,
    patientScratchPad: resolvePatientScratchPad,
    patientSearch: resolvePatientSearch,
    patientsWithUrgentTasks: resolvePatientsWithUrgentTasks,
    patientsNewToCareTeam: resolvePatientsNewToCareTeam,
    patientsWithPendingSuggestions: resolvePatientsWithPendingSuggestions,
    patientsWithMissingInfo: resolvePatientsWithMissingInfo,
    patientsWithNoRecentEngagement: resolvePatientsWithNoRecentEngagement,
    patientsWithOutOfDateMAP: resolvePatientsWithOutOfDateMAP,
    user: resolveUser,
    users: resolveUsers,
    userPatientPanel: resolveUserPatientPanel,
    task: resolveTask,
    tasksForPatient: resolvePatientTasks,
    tasksForCurrentUser: resolveCurrentUserTasks,
    tasksDueSoonForPatient: resolveTasksDueSoonForPatient,
    taskIdsWithNotificationsForPatient: resolveTaskIdsWithNotificationsForPatient,
    tasksWithNotificationsForPatient: resolveTasksWithNotificationsForPatient,
    taskComments: resolveTaskComments,
    taskComment: resolveTaskComment,
    riskAreaGroups: resolveRiskAreaGroups,
    riskAreaGroup: resolveRiskAreaGroup,
    riskAreaGroupForPatient: resolveRiskAreaGroupForPatient,
    riskArea: resolveRiskArea,
    riskAreas: resolveRiskAreas,
    patientRiskAreaRiskScore: resolvePatientRiskAreaRiskScore,
    patientRiskAreaSummary: resolvePatientRiskAreaSummary,
    question: resolveQuestion,
    questions: resolveQuestions,
    answer: resolveAnswer,
    answersForQuestion: resolveAnswersForQuestion,
    questionCondition: resolveQuestionCondition,
    eventNotificationsForCurrentUser: resolveEventNotificationsForCurrentUser,
    eventNotificationsForTask: resolveEventNotificationsForTask,
    eventNotificationsForUserTask: resolveEventNotificationsForUserTask,
    patientAnswer: resolvePatientAnswer,
    patientAnswers: resolvePatientAnswers,
    patientPreviousAnswersForQuestion: resolvePreviousPatientAnswersForQuestion,
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
    taskTemplatesForAnswer: resolveTaskSuggestionTemplatesForAnswer,
    patientTaskSuggestions: resolvePatientTaskSuggestions,
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
    patientScreeningToolSubmissionForPatientAndScreeningTool: resolvePatientScreeningToolSubmissionForPatientAndScreeningTool,
    patientScreeningToolSubmissionsForPatient: resolvePatientScreeningToolSubmissionsForPatient,
    patientScreeningToolSubmissionsFor360: resolvePatientScreeningToolSubmissionsFor360,
    patientScreeningToolSubmissions: resolvePatientScreeningToolSubmissions,
    riskAreaAssessmentSubmission: resolveRiskAreaAssessmentSubmission,
    riskAreaAssessmentSubmissionForPatient: resolveRiskAreaAssessmentSubmissionForPatient,
    progressNoteTemplate: resolveProgressNoteTemplate,
    progressNoteTemplates: resolveProgressNoteTemplates,
    progressNote: resolveProgressNote,
    progressNotesForPatient: resolveProgressNotesForPatient,
    progressNotesForSupervisorReview: resolveProgressNotesForSupervisorReview,
    progressNotesForCurrentUser: resolveProgressNotesForCurrentUser,
    progressNoteActivityForProgressNote: resolveProgressNoteActivityForProgressNote,
    quickCall: resolveQuickCall,
    quickCallsForProgressNote: resolveQuickCallsForProgressNote,
    computedField: resolveComputedField,
    computedFields: resolveComputedFields,
    computedFieldsSchema: resolveComputedFieldsSchema,
    patientLists: resolvePatientLists,
    patientList: resolvePatientList,
  },

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
    riskAreaGroupCreate,
    riskAreaGroupEdit,
    riskAreaGroupDelete,
    riskAreaEdit,
    riskAreaCreate,
    riskAreaDelete,
    eventNotificationDismiss,
    eventNotificationsForTaskDismiss,
    patientAnswersCreate,
    patientAnswerDelete,
    patientAnswerEdit,
    concernSuggestionCreate,
    concernSuggestionDelete,
    concernCreate,
    concernDelete,
    concernEdit,
    concernAddDiagnosisCode,
    concernRemoveDiagnosisCode,
    goalSuggestionTemplateCreate,
    goalSuggestionTemplateEdit,
    goalSuggestionTemplateDelete,
    goalSuggestionCreate,
    goalSuggestionDelete,
    taskTemplateCreate,
    taskTemplateEdit,
    taskTemplateDelete,
    taskSuggestionCreate,
    taskSuggestionDelete,
    patientTaskSuggestionAccept,
    patientTaskSuggestionDismiss,
    patientConcernCreate,
    patientConcernDelete,
    patientConcernEdit,
    patientConcernBulkEdit,
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
    patientScreeningToolSubmissionScore,
    progressNoteTemplateCreate,
    progressNoteTemplateDelete,
    progressNoteTemplateEdit,
    progressNoteComplete,
    progressNoteCreate,
    progressNoteEdit,
    progressNoteAddSupervisorNotes,
    progressNoteCompleteSupervisorReview,
    quickCallCreate,
    computedFieldCreate,
    computedFieldDelete,
    riskAreaAssessmentSubmissionComplete,
    riskAreaAssessmentSubmissionCreate,
    computedFieldFlagCreate,
    patientListCreate,
    patientListEdit,
    patientListDelete,
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

const schema = makeExecutableSchema({
  typeDefs: schemaGql,
  resolvers: resolveFunctions,
  logger,
} as any);

export default schema;
