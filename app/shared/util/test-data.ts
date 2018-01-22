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
  userRole: 'physician' as any,
  email: 'a@b.com',
  homeClinicId: clinic.id,
  googleProfileImageUrl: null,
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
};

export const user = {
  id: 'id2',
  locale: 'en',
  phone: '(212) 555-2828',
  firstName: 'first',
  lastName: 'last',
  userRole: 'physician' as any,
  email: 'b@c.com',
  homeClinicId: clinic.id,
  googleProfileImageUrl: null,
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
};

export const patient = {
  id: 'patient-id',
  firstName: 'Bob',
  middleName: null,
  lastName: 'Smith',
  language: 'en',
  dateOfBirth: '01/01/1999',
  gender: 'male',
  zip: '05431',
  homeClinicId: clinic.id,
  createdAt: '2017-09-07T13:45:14.532Z',
  scratchPad: 'Note',
  consentToCall: true,
  consentToText: true,
};

export const concern = {
  id: 'concern-id',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  dueAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
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
  dueAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  title: 'Risk Area Title',
  order: 1,
  mediumRiskThreshold: 5,
  highRiskThreshold: 8,
  assessmentType: 'manual' as any,
  riskAreaGroup,
  questions: [],
  screeningTools: [],
};

export const automatedRiskArea = {
  id: 'ghost',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  dueAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
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
  dueAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
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
  dueAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
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
  dueAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
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
};

export const task = {
  id: 'task-id',
  title: 'Task Title',
  description: null,
  patientId: 'patient-id',
  patient,
  dueAt: '2017-09-07T13:45:14.532Z',
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
};

export const comment = {
  id: 'comment-id',
  body: 'body',
  user: currentUser,
  taskId: task.id,
  createdAt: 'Thu Jul 14 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 14 2017 16:52:56 GMT-0400 (EDT)',
};

export const patientGoal = {
  id: 'patient-goal-id',
  title: 'Goal Title',
  patientId: 'patient-id',
  patient,
  patientConcernId: 'patient-concern-id',
  goalSuggestionTemplateId: 'goal-suggestion-template-id',
  goalSuggestionTemplate,
  tasks: [task],
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  deletedAt: null,
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
  riskArea,
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
  score: 5,
  screeningTool: {
    id: screeningTool.id,
    title: screeningTool.title,
  },
  riskArea: {
    id: riskArea.id,
    title: riskArea.title,
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
  score: 11,
  screeningTool: {
    id: screeningTool.id,
    title: screeningTool.title,
  },
  riskArea: {
    id: riskArea.id,
    title: riskArea.title,
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
