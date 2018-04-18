import * as fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';
import 'regenerator-runtime/runtime';
import config from '../config';
import {
  addressCreate,
  addressCreateForPatient,
  addressDeleteForPatient,
  addressEdit,
} from './address-resolver';
import {
  answerCreate,
  answerDelete,
  answerEdit,
  resolveAnswer,
  resolveAnswersForQuestion,
} from './answer-resolver';
import {
  calendarCreateEventForPatient,
  resolveCalendarEventsForPatient,
} from './calendar-resolver';
import {
  carePlanSuggestionAccept,
  carePlanSuggestionDismiss,
  resolveCarePlanForPatient,
  resolveCarePlanSuggestionsForPatient,
} from './care-plan-resolver';
import {
  careTeamAddUser,
  careTeamAssignPatients,
  careTeamMakeTeamLead,
  careTeamReassignUser,
  resolvePatientCareTeam,
} from './care-team-resolver';
import { resolveCBOCategories } from './cbo-category-resolver';
import { CBOReferralCreate, CBOReferralEdit } from './cbo-referral-resolver';
import {
  resolveCBO,
  resolveCBOs,
  resolveCBOsForCategory,
  CBOCreate,
  CBODelete,
  CBOEdit,
} from './cbo-resolver';
import { resolveClinic, resolveClinics } from './clinic-resolver';
import { computedFieldFlagCreate } from './computed-field-flag-resolver';
import {
  computedFieldCreate,
  computedFieldDelete,
  resolveComputedField,
  resolveComputedFields,
} from './computed-field-resolver';
import { resolveComputedFieldsSchema } from './computed-field-schema-resolver';
import { resolvePatientComputedPatientStatus } from './computed-patient-status-resolver';
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
  emailCreate,
  emailCreateForPatient,
  emailDeleteForPatient,
  emailEdit,
} from './email-resolver';
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
import { resolveAddresses } from './patient-address-resolver';
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
import {
  patientContactCreate,
  patientContactDelete,
  patientContactEdit,
  resolveHealthcareProxiesForPatient,
  resolvePatientContactsForPatient,
} from './patient-contact-resolver';
import {
  patientDataFlagCreate,
  resolvePatientDataFlagsForPatient,
} from './patient-data-flag-resolver';
import {
  patientDocumentCreate,
  patientDocumentDelete,
  patientDocumentSignedUrlCreate,
  resolvePatientDocuments,
} from './patient-document-resolver';
import { resolveEmails } from './patient-email-resolver';
import {
  patientExternalProviderCreate,
  patientExternalProviderDelete,
  patientExternalProviderEdit,
  resolvePatientExternalProvidersForPatient,
} from './patient-external-provider-resolver';
import {
  patientGlassBreakCreate,
  resolvePatientGlassBreaksForUser,
  resolvePatientGlassBreakCheck,
} from './patient-glass-break-resolver';
import {
  patientGoalCreate,
  patientGoalDelete,
  patientGoalEdit,
  resolvePatientGoal,
  resolvePatientGoalsForPatient,
} from './patient-goal-resolver';
import {
  patientInfoEdit,
  patientNeedToKnowEdit,
  resolvePatientNeedToKnow,
} from './patient-info-resolver';
import {
  patientListCreate,
  patientListDelete,
  patientListEdit,
  resolvePatientList,
  resolvePatientLists,
} from './patient-list-resolver';
import { resolvePhones } from './patient-phone-resolver';
import { patientPhotoSignedUrlCreate } from './patient-photo-resolver';
import {
  patientCoreIdentityVerify,
  resolvePatient,
  resolvePatientsForComputedList,
  resolvePatientsNewToCareTeam,
  resolvePatientsWithAssignedState,
  resolvePatientsWithIntakeInProgress,
  resolvePatientsWithMissingInfo,
  resolvePatientsWithNoRecentEngagement,
  resolvePatientsWithOpenCBOReferrals,
  resolvePatientsWithOutOfDateMAP,
  resolvePatientsWithPendingSuggestions,
  resolvePatientsWithRecentConversations,
  resolvePatientsWithUrgentTasks,
  resolvePatientPanel,
  resolvePatientSearch,
  resolvePatientSocialSecurity,
} from './patient-resolver';
import { patientScratchPadEdit, resolvePatientScratchPad } from './patient-scratch-pad-resolver';
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
import {
  phoneCreate,
  phoneCreateForPatient,
  phoneDeleteForPatient,
  phoneEdit,
} from './phone-resolver';
import { resolveProgressNoteActivityForProgressNote } from './progress-note-activity-resolver';
import {
  progressNoteGlassBreakCreate,
  resolveProgressNoteGlassBreaksForUser,
  resolveProgressNoteGlassBreakCheck,
} from './progress-note-glass-break-resolver';
import {
  progressNoteAddSupervisorNotes,
  progressNoteComplete,
  progressNoteCompleteSupervisorReview,
  progressNoteCreate,
  progressNoteEdit,
  resolveProgressNote,
  resolveProgressNotesForCurrentUser,
  resolveProgressNotesForSupervisorReview,
  resolveProgressNoteIdsForPatient,
  resolveProgressNoteLatestForPatient,
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
  resolveSmsMessages,
  resolveSmsMessageLatest,
  smsMessageCreate,
  smsMessageSubscribe,
} from './sms-message-resolver';
import {
  resolveTaskComment,
  resolveTaskComments,
  taskCommentCreate,
  taskCommentDelete,
  taskCommentEdit,
} from './task-comment-resolver';
import { taskUserFollow, taskUserUnfollow } from './task-follower-resolver';
import {
  resolveCurrentUserTasks,
  resolvePatientTasks,
  resolveTask,
  resolveTasksDueSoonForPatient,
  resolveTasksForUserForPatient,
  resolveTasksWithNotificationsForPatient,
  resolveTaskIdsWithNotifications,
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
  resolveUsers,
  resolveUserSummaryList,
  userCreate,
  userDelete,
  userEditPermissions,
  userEditRole,
  userLogin,
  JwtForPdfCreate,
} from './user-resolver';

const schemaGql = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8');

const resolveFunctions = {
  RootQueryType: {
    clinic: resolveClinic,
    clinics: resolveClinics,
    currentUser: resolveCurrentUser,
    patient: resolvePatient,
    patientCareTeam: resolvePatientCareTeam,
    patientNeedToKnow: resolvePatientNeedToKnow,
    patientSearch: resolvePatientSearch,
    patientPanel: resolvePatientPanel,
    patientsWithUrgentTasks: resolvePatientsWithUrgentTasks,
    patientsWithRecentConversations: resolvePatientsWithRecentConversations,
    patientsNewToCareTeam: resolvePatientsNewToCareTeam,
    patientsWithPendingSuggestions: resolvePatientsWithPendingSuggestions,
    patientsWithIntakeInProgress: resolvePatientsWithIntakeInProgress,
    patientsWithMissingInfo: resolvePatientsWithMissingInfo,
    patientsWithNoRecentEngagement: resolvePatientsWithNoRecentEngagement,
    patientsWithOutOfDateMAP: resolvePatientsWithOutOfDateMAP,
    patientsWithOpenCBOReferrals: resolvePatientsWithOpenCBOReferrals,
    patientsWithAssignedState: resolvePatientsWithAssignedState,
    patientsForComputedList: resolvePatientsForComputedList,
    patientContacts: resolvePatientContactsForPatient,
    patientContactHealthcareProxies: resolveHealthcareProxiesForPatient,
    patientExternalProviders: resolvePatientExternalProvidersForPatient,
    patientDocuments: resolvePatientDocuments,
    users: resolveUsers,
    userSummaryList: resolveUserSummaryList,
    task: resolveTask,
    tasksForPatient: resolvePatientTasks,
    tasksForCurrentUser: resolveCurrentUserTasks,
    tasksDueSoonForPatient: resolveTasksDueSoonForPatient,
    taskIdsWithNotifications: resolveTaskIdsWithNotifications,
    tasksWithNotificationsForPatient: resolveTasksWithNotificationsForPatient,
    tasksForUserForPatient: resolveTasksForUserForPatient,
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
    progressNoteIdsForPatient: resolveProgressNoteIdsForPatient,
    progressNotesForSupervisorReview: resolveProgressNotesForSupervisorReview,
    progressNotesForCurrentUser: resolveProgressNotesForCurrentUser,
    progressNoteActivityForProgressNote: resolveProgressNoteActivityForProgressNote,
    progressNoteLatestForPatient: resolveProgressNoteLatestForPatient,
    quickCall: resolveQuickCall,
    quickCallsForProgressNote: resolveQuickCallsForProgressNote,
    computedField: resolveComputedField,
    computedFields: resolveComputedFields,
    computedFieldsSchema: resolveComputedFieldsSchema,
    patientLists: resolvePatientLists,
    patientList: resolvePatientList,
    CBOCategories: resolveCBOCategories,
    CBOs: resolveCBOs,
    CBOsForCategory: resolveCBOsForCategory,
    CBO: resolveCBO,
    patientDataFlagsForPatient: resolvePatientDataFlagsForPatient,
    patientGlassBreaksForUser: resolvePatientGlassBreaksForUser,
    progressNoteGlassBreaksForUser: resolveProgressNoteGlassBreaksForUser,
    patientGlassBreakCheck: resolvePatientGlassBreakCheck,
    progressNoteGlassBreakCheck: resolveProgressNoteGlassBreakCheck,
    patientComputedPatientStatus: resolvePatientComputedPatientStatus,
    patientAddresses: resolveAddresses,
    patientEmails: resolveEmails,
    patientPhones: resolvePhones,
    patientScratchPad: resolvePatientScratchPad,
    patientSocialSecurity: resolvePatientSocialSecurity,
    calendarEventsForPatient: resolveCalendarEventsForPatient,
    smsMessages: resolveSmsMessages,
    smsMessageLatest: resolveSmsMessageLatest,
  },
  RootMutationType: {
    addressCreate,
    addressCreateForPatient,
    addressDeleteForPatient,
    addressEdit,
    calendarCreateEventForPatient,
    careTeamAddUser,
    careTeamReassignUser,
    careTeamMakeTeamLead,
    careTeamAssignPatients,
    emailCreate,
    emailCreateForPatient,
    emailDeleteForPatient,
    emailEdit,
    patientContactCreate,
    patientContactDelete,
    patientContactEdit,
    patientExternalProviderCreate,
    patientExternalProviderDelete,
    patientExternalProviderEdit,
    patientDocumentCreate,
    patientDocumentDelete,
    patientDocumentSignedUrlCreate,
    patientCoreIdentityVerify,
    patientInfoEdit,
    patientNeedToKnowEdit,
    phoneCreate,
    phoneCreateForPatient,
    phoneDeleteForPatient,
    phoneEdit,
    currentUserEdit,
    userCreate,
    userLogin,
    userEditRole,
    userEditPermissions,
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
    CBOCreate,
    CBOEdit,
    CBODelete,
    CBOReferralCreate,
    CBOReferralEdit,
    JwtForPdfCreate,
    patientDataFlagCreate,
    patientGlassBreakCreate,
    progressNoteGlassBreakCreate,
    patientScratchPadEdit,
    patientPhotoSignedUrlCreate,
    smsMessageCreate,
  },
  RootSubscriptionType: {
    smsMessageCreated: {
      subscribe: smsMessageSubscribe,
    },
  },
  // From https://github.com/apollographql/graphql-tools/pull/698
  uniqueId: {
    __resolveType: ({ type }: { type: string }) => type,
  },
};

const logger = {
  log: (e: any) => {
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
