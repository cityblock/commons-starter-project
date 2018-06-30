import {
  ContactMethodOptions,
  ContactTimeOptions,
  CurrentPatientState,
  DocumentTypeOptions,
  ExternalProviderOptions,
  Gender,
  GoogleCalendarEventType,
  MaritalStatus,
  PatientRelationOptions,
  PhoneTypeOptions,
  Transgender,
} from '../../graphql/types';

export const clinic = {
  id: 'clinic-id',
  name: 'Home clinic',
};

export const currentUser = {
  id: 'id',
  locale: 'en',
  phone: '(212) 555-8394',
  firstName: 'first',
  lastName: 'last',
  userRole: 'Primary_Care_Physician' as any,
  email: 'a@b.com',
  homeClinicId: clinic.id,
  googleProfileImageUrl: null,
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  permissions: 'orange' as any,
  isAvailable: true,
  awayMessage: 'Winter is here',
};

export const currentUserHours = [
  {
    id: 'monday',
    userId: currentUser.id,
    weekday: 1,
    startTime: 800,
    endTime: 1500,
    createdAt: '2017-09-07T13:45:14.532Z',
    updatedAt: '2017-09-07T13:45:14.532Z',
    deletedAt: null,
  },
  {
    id: 'friday',
    userId: currentUser.id,
    weekday: 5,
    startTime: 900,
    endTime: 1630,
    createdAt: '2017-09-07T13:45:14.532Z',
    updatedAt: '2017-09-07T13:45:14.532Z',
    deletedAt: null,
  },
];

export const currentUserForCareTeam = {
  id: 'id',
  locale: 'en',
  phone: '(212) 555-8394',
  firstName: 'first',
  lastName: 'last',
  userRole: 'Primary_Care_Physician' as any,
  email: 'a@b.com',
  homeClinicId: clinic.id,
  googleProfileImageUrl: null,
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  permissions: 'orange' as any,
  isCareTeamLead: false,
};

export const featureFlags = {
  isBuilderEnabled: false,
  isManagerEnabled: false,
  canChangeUserPermissions: false,
  canDeleteUsers: false,
  canBulkAssign: false,
  canEditCareTeam: true,
  canViewAllMembers: true,
  canEditAllMembers: true,
  canViewMembersOnPanel: true,
  canEditMembersOnPanel: true,
  canShowAllMembersInPatientPanel: true,
  canDisenrollPatient: true,
  canAutoBreakGlass: false,
};

export const user = {
  id: 'id2',
  locale: 'en',
  phone: '(212) 555-2828',
  firstName: 'first',
  lastName: 'last',
  userRole: 'Primary_Care_Physician' as any,
  email: 'b@c.com',
  homeClinicId: clinic.id,
  googleProfileImageUrl: null,
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  permissions: 'blue' as any,
  isAvailable: true,
  awayMessage: 'I drink and I know things',
};

export const userForCareTeam = {
  id: 'id2',
  locale: 'en',
  phone: '(212) 555-2828',
  firstName: 'first',
  lastName: 'last',
  userRole: 'Primary_Care_Physician' as any,
  email: 'b@c.com',
  homeClinicId: clinic.id,
  googleProfileImageUrl: null,
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  permissions: 'blue' as any,
  isCareTeamLead: true,
};

export const nonLeadUserForCareTeam = {
  id: 'id3',
  locale: 'en',
  phone: '(212) 555-5555',
  firstName: 'non lead first',
  lastName: 'non lead last',
  userRole: 'Primary_Care_Physician' as any,
  email: 'b@c.com',
  homeClinicId: clinic.id,
  googleProfileImageUrl: null,
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  permissions: 'blue' as any,
  isCareTeamLead: false,
};

export const address1 = {
  id: 'address-1-id',
  street1: '55 Washington St',
  street2: 'Unit 552',
  city: 'Brooklyn',
  state: 'NY',
  description: 'work',
  zip: '11201',
};

export const address2 = {
  id: 'address-2-id',
  street1: '101 Fake St',
  street2: 'Apt 2',
  city: 'Cambridge',
  state: 'MA',
  zip: '02139',
  description: null,
};

export const address3 = {
  id: 'address-3-id',
  street1: '20 Main St',
  street2: null,
  city: null,
  state: null,
  zip: '12345',
  description: 'generic',
};

export const email1 = {
  id: 'email-1-id',
  emailAddress: 'test@email.com',
};

export const email2 = {
  id: 'email-2-id',
  emailAddress: 'test2@email.com',
  description: 'some test email',
};

export const phone1 = {
  id: 'phone-1-id',
  phoneNumber: '555-555-5555',
  type: 'mobile' as PhoneTypeOptions,
  description: 'main phone number',
};

export const phone2 = {
  id: 'phone-2-id',
  phoneNumber: '222-222-2222',
  type: 'work' as PhoneTypeOptions,
};

interface IAddress {
  id: string;
  street1: string | null;
  street2: string | null;
  state: string | null;
  zip: string | null;
  city: string | null;
  description: string | null;
}

interface IEmail {
  id: string;
  emailAddress: string;
  description: string | null;
}

interface IPhone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
  description: string | null;
}

export const patientState = {
  id: 'patientStateId',
  currentState: 'outreach' as CurrentPatientState,
};

export const patient = {
  id: 'patient-id',
  firstName: 'Bob',
  middleName: null,
  lastName: 'Smith',
  dateOfBirth: '01/01/1999',
  ssnEnd: '1234',
  homeClinicId: clinic.id,
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  nmi: '12345',
  mrn: '12345',
  deletedAt: null,
  scratchPad: 'Note',
  coreIdentityVerifiedAt: '2017-09-07T13:45:14.532Z',
  coreIdentityVerifiedById: user.id,
  productDescription: 'Something',
  lineOfBusiness: 'HMO',
  medicaidPremiumGroup: null,
  pcpName: null,
  pcpPractice: null,
  pcpPhone: null,
  pcpAddress: null,
  memberId: '12345',
  insurance: 'Company A',
  inNetwork: true,
  patientInfo: {
    id: 'patient-info-id',
    preferredName: 'Bobby',
    gender: Gender.male,
    genderFreeText: null,
    transgender: Transgender.no,
    maritalStatus: MaritalStatus.currentlyMarried,
    language: 'en',
    isMarginallyHoused: false,
    primaryAddress: address1 as IAddress,
    hasEmail: true,
    primaryEmail: email1 as IEmail,
    primaryPhone: phone1 as IPhone,
    preferredContactMethod: ContactMethodOptions.phone,
    preferredContactTime: ContactTimeOptions.afternoon,
    canReceiveCalls: true,
    hasHealthcareProxy: false,
    hasMolst: false,
    hasDeclinedPhotoUpload: false,
    hasUploadedPhoto: false,
    googleCalendarId: null,
    isWhite: false,
    isBlack: true,
    isAmericanIndianAlaskan: true,
    isAsian: null,
    isHawaiianPacific: false,
    isOtherRace: false,
    isHispanic: true,
    raceFreeText: null,
  },
  patientDataFlags: [],
  cityblockId: 123,
  patientState,
  computedPatientStatus: {
    isCoreIdentityVerified: true,
    isDemographicInfoUpdated: true,
    isEmergencyContactAdded: false,
    isAdvancedDirectivesAdded: true,
    isFullConsentSigned: false,
    isPhotoAddedOrDeclined: false,
  },
};

export const concern = {
  id: 'concern-id',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  title: 'Concern Title',
  diagnosisCodes: [],
};

export const riskAreaGroup = {
  id: 'ghost',
  title: "Jon Snow's Direwolf",
  shortTitle: 'Ghost',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  order: 1,
  mediumRiskThreshold: 30,
  highRiskThreshold: 9000,
  riskAreas: [],
};

export const riskArea = {
  id: 'cool-risk-area-id',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  title: 'Risk Area Title',
  order: 1,
  mediumRiskThreshold: 5,
  highRiskThreshold: 8,
  assessmentType: 'manual' as any,
  riskAreaGroupId: riskAreaGroup.id,
  questions: [],
  screeningTools: [],
};

export const fullRiskAreaGroup = {
  id: 'ghost',
  title: "Jon Snow's Direwolf",
  shortTitle: 'Ghost',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  order: 1,
  mediumRiskThreshold: 30,
  highRiskThreshold: 9000,
  forceHighRisk: false,
  lastUpdated: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  riskAreas: [riskArea],
  totalScore: 3,
  riskScore: 'low' as any,
  automatedSummaryText: [],
  manualSummaryText: [],
  screeningToolResultSummaries: [
    {
      title: 'result summary',
      score: 4,
      description: 'dire wolf in dire straits ',
    },
  ],
};

export const automatedRiskArea = {
  id: 'ghost',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  title: "Jon Snow's Direwolf",
  order: 1,
  mediumRiskThreshold: 5,
  highRiskThreshold: 8,
  assessmentType: 'automated' as any,
  riskAreaGroup,
  questions: [],
};

export const riskAreaAssessmentSubmission = {
  carePlanSuggestions: [],
  completedAt: null,
  createdAt: 'Thu Dec 14 2017 13:06:41 GMT-0500 (EST)',
  deletedAt: null,
  id: 'risk-area-id',
  patientId: patient.id,
  riskAreaId: riskArea.id,
  updatedAt: 'Thu Dec 14 2017 13:06:41 GMT-0500 (EST)',
  userId: user.id,
};

export const answer = {
  id: 'answer-id',
  displayValue: 'answer value',
  value: 'true',
  valueType: 'boolean' as any,
  riskAdjustmentType: 'increment' as any,
  inSummary: true,
  summaryText: 'summary text',
  questionId: 'cool-task-id',
  order: 1,
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  concernSuggestions: [],
  goalSuggestions: [],
  riskArea: null,
  screeningTool: null,
};

export const otherTextAnswer = {
  id: 'other-text-answer-id',
  displayValue: 'other',
  value: 'other',
  valueType: 'string' as any,
  riskAdjustmentType: 'inactive' as any,
  inSummary: false,
  summaryText: null,
  questionId: 'cool-task-id',
  order: 1,
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  concernSuggestions: [],
  goalSuggestions: [],
  riskArea: null,
  screeningTool: null,
};

export const answerMutiSelect = {
  id: '456',
  displayValue: 'Answer',
  value: 'answer',
  valueType: 'string' as any,
  questionId: '123',
  order: 1,
  riskAdjustmentType: null,
  inSummary: false,
  summaryText: null,
  concernSuggestions: [],
  goalSuggestions: [],
  riskArea: null,
  screeningTool: null,
};

export const taskTemplate = {
  id: 'task-template-id',
  title: 'Task Template Title',
  completedWithinNumber: 1,
  completedWithinInterval: 'hour' as any,
  repeating: false,
  goalSuggestionTemplateId: 'goal-suggestion-template-id',
  priority: 'high' as any,
  careTeamAssigneeRole: 'physician' as any,
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  CBOCategoryId: null,
};

export const goalSuggestionTemplate = {
  id: 'goal-suggestion-template-id',
  title: 'Goal Suggestion Template Title',
  taskTemplates: [taskTemplate],
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
};

export const answerWithConcernAndGoal = {
  ...answer,
  concernSuggestions: [concern],
  goalSuggestions: [goalSuggestionTemplate],
};

export const goal = {
  id: 'goal-id',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  title: 'Goal Title',
  taskTemplates: [taskTemplate],
};

export const question = {
  id: 'cool-question-id',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  title: 'Question Title',
  order: 1,
  validatedSource: 'validated source',
  answerType: 'radio' as any,
  answers: [answer],
  riskAreaId: 'risk-area-id',
  screeningToolId: null,
  applicableIfType: 'allTrue' as any,
  applicableIfQuestionConditions: [
    {
      id: 'question-condition',
      questionId: 'cool-question-id',
      answerId: 'answer-id',
    },
  ],
  computedFieldId: null,
  computedField: null,
  otherTextAnswerId: null,
};

export const questionWithOtherTextAnswer = {
  id: 'cool-question-id',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  title: 'Question Title',
  order: 1,
  validatedSource: 'validated source',
  answerType: 'radio' as any,
  answers: [otherTextAnswer, answer],
  riskAreaId: 'risk-area-id',
  screeningToolId: null,
  applicableIfType: 'allTrue' as any,
  applicableIfQuestionConditions: [
    {
      id: 'question-condition',
      questionId: 'cool-question-id',
      answerId: 'answer-id',
    },
  ],
  computedFieldId: null,
  computedField: null,
  otherTextAnswerId: otherTextAnswer.id,
};

export const questionWithAnswerWithConcernAndGoal = {
  id: 'different-question-id',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  title: 'different Question Title',
  order: 1,
  validatedSource: 'validated source',
  answerType: 'radio' as any,
  answers: [answerWithConcernAndGoal],
  riskAreaId: 'risk-area-id',
  screeningToolId: null,
  applicableIfType: 'allTrue' as any,
  applicableIfQuestionConditions: [
    {
      id: 'question-condition',
      questionId: 'cool-question-id',
      answerId: 'answer-id',
    },
  ],
};

export const carePlanSuggestionWithConcern = {
  id: 'care-plan-suggestion-id',
  patientId: 'patient-id',
  patient,
  suggestionType: 'concern' as any,
  concernId: 'concern-id',
  concern,
  goalSuggestionTemplateId: null,
  goalSuggestionTemplate: null,
  acceptedById: null,
  acceptedBy: null,
  dismissedById: null,
  dismissedBy: null,
  dismissedReason: null,
  dismissedAt: null,
  acceptedAt: null,
  createdAt: '2017-08-16T19:27:36.378Z',
  updatedAt: '2017-08-16T19:27:36.378Z',
  patientScreeningToolSubmissionId: null,
  computedField: null,
  riskArea: null,
  screeningTool: null,
};

export const fullCarePlanSuggestionWithConcern = {
  id: 'care-plan-suggestion-id',
  patientId: 'patient-id',
  patient,
  suggestionType: 'concern' as any,
  concernId: 'concern-id',
  concern,
  goalSuggestionTemplateId: null,
  goalSuggestionTemplate: null,
  acceptedById: null,
  acceptedBy: null,
  dismissedById: null,
  dismissedBy: null,
  dismissedReason: null,
  dismissedAt: null,
  acceptedAt: null,
  createdAt: '2017-08-16T19:27:36.378Z',
  updatedAt: '2017-08-16T19:27:36.378Z',
  patientScreeningToolSubmissionId: null,
  computedField: null,
  riskArea: {
    id: riskArea.id,
    title: riskArea.title,
  },
  screeningTool: null,
};

export const carePlanSuggestionWithGoal = {
  id: 'care-plan-suggestion-id',
  patientId: 'patient-id',
  patient,
  suggestionType: 'goal' as any,
  concernId: null,
  concern: null,
  goalSuggestionTemplateId: 'goal-suggestion-template-id',
  goalSuggestionTemplate: {
    id: 'goal-suggestion-template-id',
    title: 'Goal Title',
    taskTemplates: [
      {
        id: 'task-template-1',
        title: 'Task Title',
        priority: 'high' as any,
        completedWithinNumber: 1,
        completedWithinInterval: 'week' as any,
        repeating: false,
        goalSuggestionTemplateId: 'goal-suggestion-template-1',
        careTeamAssigneeRole: 'physician' as any,
        createdAt: '2017-08-16T19:27:36.378Z',
        updatedAt: '2017-08-16T19:27:36.378Z',
        deletedAt: null,
        CBOCategoryId: null,
      },
    ],
    createdAt: '2017-08-16T19:27:36.378Z',
    updatedAt: '2017-08-16T19:27:36.378Z',
    deletedAt: null,
  },
  acceptedById: null,
  acceptedBy: null,
  dismissedById: null,
  dismissedBy: null,
  dismissedReason: null,
  dismissedAt: null,
  acceptedAt: null,
  createdAt: '2017-08-16T19:27:36.378Z',
  updatedAt: '2017-08-16T19:27:36.378Z',
  patientScreeningToolSubmissionId: null,
  computedField: null,
  riskArea: null,
  screeningTool: null,
};

export const fullCarePlanSuggestionWithGoal = {
  id: 'care-plan-suggestion-id',
  patientId: 'patient-id',
  patient,
  suggestionType: 'goal' as any,
  concernId: null,
  concern: null,
  goalSuggestionTemplateId: 'goal-suggestion-template-id',
  goalSuggestionTemplate: {
    id: 'goal-suggestion-template-id',
    title: 'Goal Title',
    taskTemplates: [
      {
        id: 'task-template-1',
        title: 'Task Title',
        priority: 'high' as any,
        completedWithinNumber: 1,
        completedWithinInterval: 'week' as any,
        repeating: false,
        goalSuggestionTemplateId: 'goal-suggestion-template-1',
        careTeamAssigneeRole: 'physician' as any,
        createdAt: '2017-08-16T19:27:36.378Z',
        updatedAt: '2017-08-16T19:27:36.378Z',
        deletedAt: null,
        CBOCategoryId: null,
      },
    ],
    createdAt: '2017-08-16T19:27:36.378Z',
    updatedAt: '2017-08-16T19:27:36.378Z',
    deletedAt: null,
  },
  acceptedById: null,
  acceptedBy: null,
  dismissedById: null,
  dismissedBy: null,
  dismissedReason: null,
  dismissedAt: null,
  acceptedAt: null,
  createdAt: '2017-08-16T19:27:36.378Z',
  updatedAt: '2017-08-16T19:27:36.378Z',
  patientScreeningToolSubmissionId: null,
  computedField: null,
  riskArea: {
    id: riskArea.id,
    title: riskArea.title,
  },
  screeningTool: null,
};

export const task = {
  id: 'task-id',
  title: 'Task Title',
  description: null,
  patientId: 'patient-id',
  patient,
  dueAt: '2017-05-16',
  priority: 'high' as any,
  createdBy: currentUser,
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  deletedAt: null,
  completedBy: null,
  completedAt: null,
  assignedTo: null,
  followers: [],
  patientGoal: null,
  CBOReferralId: null,
  CBOReferral: null,
  assignedToId: 'jonSnow',
};

export const comment = {
  id: 'comment-id',
  body: 'body',
  user: currentUser,
  taskId: task.id,
  createdAt: 'Thu Jul 14 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 14 2017 16:52:56 GMT-0400 (EDT)',
};

export const patientConcernForGoal = {
  id: 'nightKingMarchingSouth',
  order: 1,
  concernId: 'concern-id',
  concern,
  patientGoals: [],
  patientId: 'patient-id',
  patient,
  startedAt: null,
  completedAt: null,
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  deletedAt: null,
};

export const patientGoal = {
  id: 'patient-goal-id',
  title: 'Goal Title',
  patientId: 'patient-id',
  patient,
  patientConcernId: 'nightKingMarchingSouth',
  patientConcern: patientConcernForGoal,
  goalSuggestionTemplateId: 'goal-suggestion-template-id',
  goalSuggestionTemplate,
  tasks: [task],
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  deletedAt: null,
};

export const assignedTask = {
  ...task,
  patient,
  patientId: patient.id,
  assignedTo: currentUser,
  createdBy: currentUser,
  followers: [currentUser],
};

export const completedTask = {
  ...task,
  patientId: patient.id,
  createdById: currentUser.id,
  assignedToId: currentUser.id,
  completedById: currentUser.id,
};

export const patientConcern = {
  id: 'patient-concern-id',
  order: 1,
  concernId: 'concern-id',
  concern,
  patientGoals: [patientGoal],
  patientId: 'patient-id',
  patient,
  startedAt: null,
  completedAt: null,
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  deletedAt: null,
};

export const patientConcernActive = {
  id: 'patient-concern-id-active',
  order: 2,
  concernId: 'concern-id-active',
  concern,
  patientGoals: [patientGoal],
  patientId: 'patient-id',
  patient,
  startedAt: '2017-09-07T13:45:14.532Z',
  completedAt: null,
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  deletedAt: null,
};

export const patientAnswer = {
  id: 'patient-answer',
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  deletedAt: null,
  answerId: answer.id,
  answerValue: answer.value,
  patientId: patient.id,
  applicable: true,
  patientScreeningToolSubmissionId: null,
  question: {
    id: question.id,
    title: question.title,
    answerType: 'radio' as any,
  },
  answer,
};

export const patientAnswerFreetext = {
  id: 'patient-answer',
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  deletedAt: null,
  answerId: answer.id,
  answerValue: 'a custom written in answer!',
  patientId: patient.id,
  applicable: true,
  patientScreeningToolSubmissionId: null,
  question: {
    id: question.id,
    title: question.title,
    answerType: 'freetext' as any,
  },
  answer,
};

export const encounter = {
  encounterType: 'encounter type',
  providerName: 'provider name',
  providerRole: 'provider role',
  location: 'location',
  diagnoses: [
    {
      code: 'code',
      codeSystem: 'code system',
      description: 'desc',
    },
  ],
  reasons: ['reason'],
  dateTime: '10/10/2010',
};

export const medication = {
  id: 'med id',
  name: 'name',
  dosageInstructions: 'once daily',
};

export const eventNotification = {
  id: 'event-notificaiton-id',
  title: 'event notification',
  userId: currentUser.id,
  user: currentUser,
  taskEventId: 'task-event-id',
  taskEvent: {
    id: 'task-event-id',
    taskId: task.id,
    task,
    userId: currentUser.id,
    eventUserId: currentUser.id,
    eventUser: currentUser,
    user: currentUser,
    eventType: 'create_task' as any,
    eventCommentId: null,
    eventComment: null,
    createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    deletedAt: null,
  },
  task,
  seenAt: null,
  emailSentAt: null,
  deliveredAt: null,
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
};

export const screeningTool = {
  id: 'screening-tool-id',
  title: 'Screening Tool',
  riskAreaId: riskArea.id,
  riskArea,
  screeningToolScoreRanges: [],
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  patientScreeningToolSubmissions: [],
};

export const screeningToolScoreRange = {
  id: 'screening-tool-score-range-id',
  screeningToolId: screeningTool.id,
  description: 'Screening Tool Score Range',
  minimumScore: 0,
  maximumScore: 10,
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  concernSuggestions: [],
  goalSuggestions: [],
  riskAdjustmentType: 'increment' as any,
};

export const patientScreeningToolSubmission = {
  id: 'patient-screening-tool-submission-id',
  screeningToolId: screeningTool.id,
  patientId: patient.id,
  patient,
  userId: user.id,
  user,
  score: 5,
  scoredAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  carePlanSuggestions: [carePlanSuggestionWithConcern, carePlanSuggestionWithGoal],
  screeningToolScoreRangeId: screeningToolScoreRange.id,
  screeningToolScoreRange,
};

export const shortPatientScreeningToolSubmission = {
  id: 'nymeria',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  scoredAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  score: 5,
  screeningTool: {
    id: screeningTool.id,
    title: screeningTool.title,
    riskAreaId: riskArea.id,
  },
  user: {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
  },
  screeningToolScoreRange: {
    id: screeningToolScoreRange.id,
    description: screeningToolScoreRange.description,
    riskAdjustmentType: screeningToolScoreRange.riskAdjustmentType,
  },
};

export const shortPatientScreeningToolSubmission2 = {
  id: 'ghost',
  createdAt: 'Thu Jul 11 2017 16:52:56 GMT-0400 (EDT)',
  scoredAt: 'Thu Jul 11 2017 16:52:56 GMT-0400 (EDT)',
  score: 11,
  screeningTool: {
    id: screeningTool.id,
    title: screeningTool.title,
    riskAreaId: riskArea.id,
  },
  user: {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
  },
  screeningToolScoreRange: {
    id: screeningToolScoreRange.id,
    description: screeningToolScoreRange.description,
    riskAdjustmentType: screeningToolScoreRange.riskAdjustmentType,
  },
};

export const progressNoteTemplate = {
  id: 'progress-note-template-id',
  title: 'Progress Note Template Title',
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  deletedAt: null,
};

export const progressNote = {
  id: 'progress-note-id',
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  startedAt: null,
  location: null,
  deletedAt: null,
  completedAt: null,
  patientId: patient.id,
  summary: 'summary!',
  memberConcern: 'member concern',
  patient,
  user: currentUser,
  progressNoteTemplateId: progressNoteTemplate.id,
  progressNoteTemplate,
  supervisorId: null,
  supervisor: null,
  needsSupervisorReview: null,
  reviewedBySupervisorAt: null,
  supervisorNotes: null,
  worryScore: 2,
};

export const quickCall = {
  id: 'quick-call-id',
  createdAt: '2017-11-07T13:45:14.532Z',
  updatedAt: '2017-11-07T13:45:14.532Z',
  deletedAt: null,
  reason: 'Quick Call reason',
  summary: 'Quick Call summary',
  direction: 'Outbound',
  callRecipient: 'Social worker',
  wasSuccessful: true,
  startTime: '2017-11-07T13:45:14.532Z',
  progressNoteId: progressNote.id,
  userId: user.id,
};

export const computedField = {
  id: 'computed-field-id',
  label: 'Computed Field',
  slug: 'computed-field',
  dataType: 'boolean' as any,
  createdAt: '2017-11-07T13:45:14.532Z',
  updatedAt: '2017-11-07T13:45:14.532Z',
  deletedAt: null,
};

export const patientList = {
  id: 'whiteWalkers',
  title: 'White Walkers',
  answerId: 'has-blue-eyes',
  order: 1,
  createdAt: '2017-11-07T13:45:14.532Z',
};

export const patientList2 = {
  id: 'nightsWatch',
  title: 'Protectors of the Seven Kingdoms',
  answerId: 'has-taken-vows',
  order: 2,
  createdAt: '2017-11-07T13:45:14.532Z',
};

export const CBOCategory = {
  id: 'foodServices',
  title: 'Food Services',
};

export const CBOCategory2 = {
  id: 'mentalHealth',
  title: 'Mental Health',
};

export const CBO = {
  id: 'aGirlHasNoPies',
  name: 'Arya Stark Pie Pantry',
  categoryId: CBOCategory.id,
  category: CBOCategory,
  address: 'The Twins',
  city: 'Riverlands',
  state: 'WS',
  zip: '11111',
  phone: '(333) 555-5555',
  fax: '(444) 666-6666',
  url: 'www.facelessmen.com',
  createdAt: '2017-11-07T13:45:14.532Z',
};

export const CBO2 = {
  id: 'evilLaugh',
  name: 'Ramsay Bolton Immersive Therapy',
  categoryId: CBOCategory2.id,
  category: CBOCategory2,
  address: 'Winterfell',
  city: 'The North',
  state: 'WS',
  zip: '12211',
  phone: '(111) 555-5555',
  fax: '(222) 666-6666',
  url: 'www.housebolton.com',
  createdAt: '2017-11-07T13:45:14.532Z',
};

export const CBOReferral = {
  id: 'CBOReferral',
  categoryId: CBOCategory.id,
  category: CBOCategory,
  CBOId: CBO.id,
  CBO,
  name: null,
  url: null,
  diagnosis: null,
  sentAt: null,
  acknowledgedAt: null,
};

export const CBOReferralOther = {
  id: 'CBOReferral',
  categoryId: CBOCategory.id,
  category: CBOCategory,
  CBOId: null,
  CBO: null,
  name: 'Greyjoy Water Therapy',
  url: 'www.thesilence.com',
  diagnosis: null,
  sentAt: null,
  acknowledgedAt: null,
};

export const CBOReferralRequiringAction = {
  id: 'wallHasComeDown',
  categoryId: CBOCategory.id,
  category: CBOCategory,
  CBOId: null,
  CBO: null,
  name: "Night's Watch",
  url: null,
  diagnosis: null,
  sentAt: null,
  acknowledgedAt: null,
};

export const taskWithComment = {
  ...task,
  patient,
  comments: [comment],
  patientId: patient.id,
  assignedTo: currentUser,
  createdBy: currentUser,
  followers: [currentUser],
  patientGoal,
  CBOReferral,
  CBOReferralId: CBOReferral.id,
};

export const healthcareProxy = {
  id: 'patient-contact-id',
  firstName: 'mary',
  lastName: 'jane',
  relationToPatient: PatientRelationOptions.parent,
  relationFreeText: null,
  patientId: patient.id,
  phone: {
    id: phone1.id,
    phoneNumber: phone1.phoneNumber,
    type: 'mobile' as PhoneTypeOptions,
  },
  email: {
    id: email1.id,
    emailAddress: email1.emailAddress,
  },
  address: null,
  isHealthcareProxy: true,
  isEmergencyContact: false,
  isConsentedForSubstanceUse: null,
  isConsentedForHiv: null,
  isConsentedForStd: null,
  isConsentedForGeneticTesting: null,
  isConsentedForFamilyPlanning: null,
  isConsentedForMentalHealth: null,
  consentDocumentId: null,
  isConsentDocumentOutdated: null,
  description: 'some healthcare person',
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  deletedAt: null,
};

export const advancedDirectives = {
  patientId: patient.id,
  patientInfoId: patient.patientInfo.id,
  hasMolst: null,
  hasHealthcareProxy: null,
};

export const externalProviderPerson = {
  id: 'external-provider-id',
  patientId: patient.id,
  firstName: 'Tonya',
  lastName: 'Willis',
  role: ExternalProviderOptions.cardiology,
  roleFreeText: null,
  patientExternalOrganizationId: 'org-1',
  patientExternalOrganization: {
    id: 'org-1',
    name: 'Mount Sinai',
    isConsentedForSubstanceUse: null,
    isConsentedForHiv: null,
    isConsentedForStd: null,
    isConsentedForGeneticTesting: null,
    isConsentedForFamilyPlanning: null,
    isConsentedForMentalHealth: null,
    consentDocumentId: null,
    isConsentDocumentOutdated: null,
  },
  description: 'best doctor for this patient',
  phone: {
    id: phone1.id,
    phoneNumber: phone1.phoneNumber,
    type: 'mobile' as PhoneTypeOptions,
  },
  email: {
    id: email1.id,
    emailAddress: email1.emailAddress,
  },
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  deletedAt: null,
};

export const externalProviderEntity = {
  id: 'external-provider-id-2',
  patientId: patient.id,
  firstName: null,
  lastName: null,
  role: ExternalProviderOptions.other,
  roleFreeText: 'Some other type of provider',
  patientExternalOrganizationId: 'org-1',
  patientExternalOrganization: {
    id: 'org-1',
    name: 'Mount Sinai',
    isConsentedForSubstanceUse: null,
    isConsentedForHiv: null,
    isConsentedForStd: null,
    isConsentedForGeneticTesting: null,
    isConsentedForFamilyPlanning: null,
    isConsentedForMentalHealth: null,
    consentDocumentId: null,
    isConsentDocumentOutdated: null,
  },
  description: null,
  phone: {
    id: phone1.id,
    phoneNumber: phone1.phoneNumber,
  },
  email: null,
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  deletedAt: null,
};

export const externalOrganization = {
  id: 'external-organization',
  patientId: patient.id,
  name: 'Test Organization',
  description: null,
  phoneNumber: null,
  faxNumber: null,
  address: null,
  isConsentedForSubstanceUse: null,
  isConsentedForHiv: null,
  isConsentedForStd: null,
  isConsentedForGeneticTesting: null,
  isConsentedForFamilyPlanning: null,
  isConsentedForMentalHealth: null,
  consentDocumentId: null,
  isConsentDocumentOutdated: null,
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  deletedAt: null,
};

export const externalOrganization2 = {
  id: 'external-organization-2',
  patientId: patient.id,
  name: 'Test Organization 2',
  phoneNumber: '+144455567889',
  faxNumber: '+123455067889',
  address: address1,
  description: 'some organization',
  isConsentedForSubstanceUse: null,
  isConsentedForHiv: null,
  isConsentedForStd: null,
  isConsentedForGeneticTesting: null,
  isConsentedForFamilyPlanning: null,
  isConsentedForMentalHealth: null,
  consentDocumentId: null,
  isConsentDocumentOutdated: null,
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  deletedAt: null,
};

export const basicInfo = {
  gender: patient.patientInfo.gender,
  genderFreeText: patient.patientInfo.genderFreeText,
  transgender: patient.patientInfo.transgender,
  maritalStatus: patient.patientInfo.maritalStatus,
  language: patient.patientInfo.language,
  primaryAddress: patient.patientInfo.primaryAddress,
  isMarginallyHoused: patient.patientInfo.isMarginallyHoused,
  preferredName: patient.patientInfo.preferredName,
  isWhite: patient.patientInfo.isWhite,
  isBlack: patient.patientInfo.isBlack,
  isAmericanIndianAlaskan: patient.patientInfo.isAmericanIndianAlaskan,
  isAsian: patient.patientInfo.isAsian,
  isHawaiianPacific: patient.patientInfo.isHawaiianPacific,
  isOtherRace: patient.patientInfo.isOtherRace,
  isHispanic: patient.patientInfo.isHispanic,
  raceFreeText: patient.patientInfo.raceFreeText,
};

export const planInfo = {
  patientDataFlags: patient.patientDataFlags,
};

export const coreIdentity = {
  firstName: patient.firstName,
  middleName: patient.middleName,
  lastName: patient.lastName,
  dateOfBirth: patient.dateOfBirth,
  patientDataFlags: patient.patientDataFlags,
  cityblockId: patient.cityblockId,
  ssnEnd: patient.ssnEnd,
  nmi: patient.nmi,
  mrn: patient.mrn,
  memberId: patient.memberId,
};

export const contactInfo = {
  primaryEmail: patient.patientInfo.primaryEmail,
  primaryPhone: patient.patientInfo.primaryPhone,
  hasEmail: patient.patientInfo.hasEmail,
  canReceiveCalls: patient.patientInfo.canReceiveCalls,
  preferredContactMethod: patient.patientInfo.preferredContactMethod,
  preferredContactTime: patient.patientInfo.preferredContactTime,
};

export const patientPhoto = {
  hasDeclinedPhotoUpload: patient.patientInfo.hasDeclinedPhotoUpload,
  hasUploadedPhoto: patient.patientInfo.hasUploadedPhoto,
};

export const completeComputedPatientStatus = {
  id: 'computedPatientStatusId',
  patientId: 'patientId',
  updatedById: 'userId',
  isCoreIdentityVerified: true,
  isDemographicInfoUpdated: true,
  isEmergencyContactAdded: true,
  isAdvancedDirectivesAdded: true,
  isCoreConsentSigned: true,
  isFullConsentSigned: true,
  isPhotoAddedOrDeclined: true,
  isIneligible: false,
  isDisenrolled: false,
  createdAt: '2017-11-07T13:45:14.532Z',
  updatedAt: '2017-11-07T13:45:14.532Z',
  deletedAt: null,
};

export const incompleteComputedPatientStatus = {
  id: 'computedPatientStatusId',
  patientId: 'patientId',
  updatedById: 'userId',
  isCoreIdentityVerified: true,
  isDemographicInfoUpdated: true,
  isEmergencyContactAdded: true,
  isAdvancedDirectivesAdded: true,
  isCoreConsentSigned: false,
  isFullConsentSigned: false,
  isPhotoAddedOrDeclined: false,
  isIneligible: false,
  isDisenrolled: false,
  createdAt: '2017-11-07T13:45:14.532Z',
  updatedAt: '2017-11-07T13:45:14.532Z',
  deletedAt: null,
};

export const signedPatientAdvancedDirectiveForm = {
  patientAdvancedDirectiveFormId: 'patientAdvancedDirectiveFormId',
  patientId: 'patientId',
  userId: 'userId',
  formId: 'advancedDirectiveFormId',
  title: 'Advanced Directive Form Title',
  signedAt: '2017-11-07T13:45:14.532Z',
};

export const unsignedPatientAdvancedDirectiveForm = {
  patientAdvancedDirectiveFormId: null,
  patientId: 'patientId',
  userId: 'userId',
  formId: 'advancedDirectiveFormId',
  title: 'Advanced Directive Form Title',
  signedAt: null,
};

export const signedPatientConsentForm = {
  patientConsentFormId: 'patientConsentFormId',
  patientId: 'patientId',
  userId: 'userId',
  formId: 'consentFormId',
  title: 'Consent Form Title',
  signedAt: '2017-11-07T13:45:14.532Z',
};

export const unsignedPatientConsentForm = {
  patientConsentFormId: null,
  patientId: 'patientId',
  userId: 'userId',
  formId: 'consentFormId',
  title: 'Consent Form Title',
  signedAt: null,
};

export const patientScratchPad = {
  id: 'nightKing',
  patientId: patient.id,
  userId: user.id,
  body: 'Concerned about Night King Breaching Wall',
};

export const patientMedication = {
  id: 'patientMedicationId',
  name: 'Advil',
  dosage: '200mg',
  instructions: 'Take every 8 hours',
  prescribedBy: 'John Snow',
  prescribedOn: 'May 26, 2005',
};

export const patientDiagnosis = {
  id: 'patientDiagnosisId',
  name: 'Cholesteatoma of middle ear',
  code: 'H71',
};

export const smsMessage1 = {
  id: 'sms1',
  userId: user.id,
  contactNumber: '+11234567890',
  patientId: patient.id,
  direction: 'toUser' as any,
  body: 'Winter is coming.',
  createdAt: '2017-11-07T13:45:14.532Z',
};

export const smsMessage2 = {
  id: 'sms2',
  userId: user.id,
  contactNumber: '+11234567890',
  patientId: patient.id,
  direction: 'fromUser' as any,
  body: 'Winter is here.',
  createdAt: '2017-11-08T13:50:14.532Z',
};

export const partialCalendarEvent = {
  id: 'id0',
  title: 'First Appointment',
  htmlLink: 'www.fakeurl.com',
  description: 'some appointment',
  location: 'somewhere',
  guests: [],
  eventType: 'siu' as GoogleCalendarEventType,
  providerName: null,
  providerCredentials: null,
};

export const partialCalendarEventSIU = {
  id: 'id0',
  title: 'First Appointment',
  htmlLink: 'www.fakeurl.com',
  description: 'some appointment',
  location: 'someplace',
  guests: [],
  eventType: 'siu' as GoogleCalendarEventType,
  providerName: 'Jane Doctor',
  providerCredentials: 'MD, DDS',
};

export const textConsentDocument = {
  id: 'textmeyo',
  documentType: 'textConsent' as DocumentTypeOptions,
  patientId: patient.id,
  uploadedById: user.id,
  uploadedBy: user,
  description: 'textmeyo',
  filename: '/lets/go/eevee.png',
  createdAt: '2017-11-08T13:50:14.532Z',
  updatedAt: '2017-11-08T13:50:14.532Z',
};
