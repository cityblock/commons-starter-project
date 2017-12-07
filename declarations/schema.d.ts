declare module 'schema' {
  interface IGraphQLResponseRoot {
    data?: IRootQueryType | IRootMutationType;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    message: string;            // Required for all errors
    locations?: Array<IGraphQLResponseErrorLocation>;
    [propName: string]: any;    // 7.2.2 says 'GraphQL servers may provide additional entries to error'
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }


  interface IRootQueryType {
    /**
    description: A single User
  */
    user: IUser | null;
    /**
    description: All Users (admin only)
  */
    users: IUserEdges | null;
    /**
    description: List of patients the user is on the care team for (their 'patient panel')
  */
    userPatientPanel: IPatientEdges | null;
    /**
    description: The current User
  */
    currentUser: IUser | null;
    /**
    description: A single Patient
  */
    patient: IPatient | null;
    /**
    description: Users on a care team
  */
    patientCareTeam: Array<IUser> | null;
    /**
    description: Patient scratch pad
  */
    patientScratchPad: IPatientScratchPad | null;
    /**
    description: Patient search
  */
    patientSearch: IPatientEdges | null;
    /**
    description: A single clinic
  */
    clinic: IClinic | null;
    /**
    description: Clinics
  */
    clinics: IClinicEdges | null;
    /**
    description: Patient encounters
  */
    patientEncounters: Array<IPatientEncounter> | null;
    /**
    description: Patient medications
  */
    patientMedications: IPatientMedications | null;
    /**
    description: Task
  */
    task: ITask | null;
    /**
    description: Patient's Tasks
  */
    tasksForPatient: ITaskEdges | null;
    /**
    description: Current user's Tasks
  */
    tasksForCurrentUser: ITaskEdges | null;
    /**
    description: List of task comments
  */
    taskComments: ITaskCommentEdges | null;
    /**
    description: Single task comment
  */
    taskComment: ITaskComment | null;
    /**
    description: RiskArea
  */
    riskArea: IRiskArea | null;
    /**
    description: RiskAreas
  */
    riskAreas: Array<IRiskArea> | null;
    /**
    description: Question
  */
    question: IQuestion | null;
    /**
    description: Questions for risk area, progress note template or screening tool
  */
    questions: Array<IQuestion>;
    /**
    description: Answer
  */
    answer: IAnswer | null;
    /**
    description: Answers
  */
    answersForQuestion: Array<IAnswer>;
    /**
    description: PatientAnswer
  */
    patientAnswer: IPatientAnswer | null;
    /**
    description: PatientAnswersForQuestion
  */
    patientAnswers: Array<IPatientAnswer> | null;
    /**
    description: PatientPreviousAnswersForQuestion
  */
    patientPreviousAnswersForQuestion: Array<IPatientAnswer> | null;
    /**
    description: PatientRiskAreaSummary
  */
    patientRiskAreaSummary: IRiskAreaSummary | null;
    /**
    description: PatientRiskAreaRiskScore
  */
    patientRiskAreaRiskScore: IRiskScore | null;
    /**
    description: QuestionCondition
  */
    questionCondition: IQuestionCondition | null;
    /**
    description: Event notifications for a user
  */
    eventNotificationsForCurrentUser: IEventNotificationEdges | null;
    /**
    description: Event notifications for a task
  */
    eventNotificationsForTask: IEventNotificationEdges | null;
    /**
    description: Task template
  */
    taskTemplate: ITaskTemplate | null;
    /**
    description: Concern
  */
    concern: IConcern | null;
    /**
    description: Concerns
  */
    concerns: Array<IConcern> | null;
    /**
    description: Concerns for answer
  */
    concernsForAnswer: Array<IConcern> | null;
    /**
    description: patient concern
  */
    patientConcern: IPatientConcern | null;
    /**
    description: patient concerns for patient
  */
    patientConcerns: Array<IPatientConcern> | null;
    /**
    description: Patient goal
  */
    patientGoal: IPatientGoal | null;
    /**
    description: Patient goals for patient
  */
    patientGoals: Array<IPatientGoal> | null;
    /**
    description: Goal suggestion templates
  */
    goalSuggestionTemplate: IGoalSuggestionTemplate | null;
    /**
    description: Goal suggestion templates
  */
    goalSuggestionTemplates: Array<IGoalSuggestionTemplate> | null;
    /**
    description: Goal suggestion for template for answer
  */
    goalSuggestionTemplatesForAnswer: Array<IGoalSuggestionTemplate> | null;
    /**
    description: Task templates
  */
    taskTemplates: Array<ITaskTemplate> | null;
    /**
    description: Task templates suggested for answer
  */
    taskTemplatesForAnswer: Array<ITaskTemplate> | null;
    /**
    description: patient task suggestions
  */
    patientTaskSuggestions: Array<IPatientTaskSuggestion> | null;
    /**
    description: Care Plan Suggestions
  */
    carePlanSuggestionsForPatient: Array<ICarePlanSuggestion> | null;
    /**
    description: Care Plan
  */
    carePlanForPatient: ICarePlan | null;
    /**
    description: screening tool
  */
    screeningTool: IScreeningTool | null;
    /**
    description: screening tools
  */
    screeningTools: Array<IScreeningTool> | null;
    /**
    description: screening tools for risk area
  */
    screeningToolsForRiskArea: Array<IScreeningTool> | null;
    /**
    description: screening tool score range
  */
    screeningToolScoreRange: IScreeningToolScoreRange | null;
    /**
    description: screening tool score range for screening tool and score
  */
    screeningToolScoreRangeForScoreAndScreeningTool: IScreeningToolScoreRange | null;
    /**
    description: screening tool score ranges
  */
    screeningToolScoreRanges: Array<IScreeningToolScoreRange> | null;
    /**
    description: screening tool score ranges for screening tool
  */
    screeningToolScoreRangesForScreeningTool: Array<IScreeningToolScoreRange> | null;
    /**
    description: patient screening tool submission
  */
    patientScreeningToolSubmission: IPatientScreeningToolSubmission | null;
    /**
    description: latest patient sreening tool submission for a screening tool
  */
    patientScreeningToolSubmissionForPatientAndScreeningTool: IPatientScreeningToolSubmission | null;
    /**
    description: patient screening tool submissions for patient and screening tool (optioanlly)
  */
    patientScreeningToolSubmissionsForPatient: Array<IPatientScreeningToolSubmission> | null;
    /**
    description: patient screening tool submissions
  */
    patientScreeningToolSubmissions: Array<IPatientScreeningToolSubmission> | null;
    /**
    description: progress note template
  */
    progressNoteTemplate: IProgressNoteTemplate | null;
    /**
    description: progress note templates
  */
    progressNoteTemplates: Array<IProgressNoteTemplate> | null;
    /**
    description: progress note
  */
    progressNote: IProgressNote | null;
    /**
    description: progress notes for patient
  */
    progressNotesForPatient: Array<IProgressNote> | null;
    /**
    description: progress notes for current user
  */
    progressNotesForCurrentUser: Array<IProgressNote> | null;
    /**
    description: progress note activities for progress note
  */
    progressNoteActivityForProgressNote: IProgressNoteActivity | null;
    /**
    description: quick call
  */
    quickCall: IQuickCall | null;
    /**
    description: quick calls for progress note
  */
    quickCallsForProgressNote: Array<IQuickCall> | null;
    /**
    description: computed field
  */
    computedField: IComputedField | null;
    /**
    description: computed fields
  */
    computedFields: Array<IComputedField> | null;
  }

  /**
    description: User account model
  */
  interface IUser {
    id: string;
    locale: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    userRole: IUserRoleEnum;
    createdAt: string;
    homeClinicId: string;
    googleProfileImageUrl: string | null;
    updatedAt: string;
  }

  /**
    description: An object with a Globally Unique ID
  */
  type uniqueId = IUser | IPatient | IClinic | ITask | IPatientGoal | IPatientConcern | IConcern | IGoalSuggestionTemplate | ITaskTemplate | ITaskComment | IRiskArea | IQuestion | IAnswer | IScreeningTool | IScreeningToolScoreRange | IQuestionCondition | IPatientAnswer | IPatientScreeningToolSubmission | ICarePlanSuggestion | IEventNotification | ITaskEvent | IProgressNote | IProgressNoteTemplate | IPatientTaskSuggestion | IPatientAnswerEvent | ICarePlanUpdateEvent | IQuickCall | IComputedField;

  /**
    description: An object with a Globally Unique ID
  */
  interface IUniqueId {
    /**
    description: The ID of the object.
  */
    id: string;
  }


  type IUserRoleEnum = 'physician' | 'nurseCareManager' | 'healthCoach' | 'familyMember' | 'anonymousUser' | 'admin';


  type IUserOrderOptionsEnum = 'createdAtDesc' | 'createdAtAsc' | 'lastLoginAtDesc' | 'lastLoginAtAsc' | 'updatedAtDesc' | 'updatedAtAsc';

  /**
    description: User edges
  */
  interface IUserEdges {
    edges: Array<IUserNode> | null;
    pageInfo: IPageInfo;
  }

  /**
    description: User node
  */
  interface IUserNode {
    node: IUser | null;
    cursor: string;
  }

  /**
    description: Page info for paginated responses
  */
  interface IPageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }

  /**
    description: Patient edges
  */
  interface IPatientEdges {
    edges: Array<IPatientNode> | null;
    pageInfo: IPageInfo;
  }

  /**
    description: Patient node
  */
  interface IPatientNode {
    node: IPatient | null;
    cursor: string;
  }

  /**
    description: Patient combining data in athena and our database
  */
  interface IPatient {
    id: string;
    firstName: string | null;
    middleName: string | null;
    language: string | null;
    lastName: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    zip: string | null;
    homeClinicId: string | null;
    createdAt: string;
    scratchPad: string | null;
    consentToCall: boolean | null;
    consentToText: boolean | null;
  }

  /**
    description: Patient Scratch Pad
  */
  interface IPatientScratchPad {
    text: string | null;
  }

  /**
    description: Clinic
  */
  interface IClinic {
    id: string;
    name: string;
    departmentId: number;
    createdAt: string;
    updatedAt: string;
  }

  /**
    description: Clinic edges
  */
  interface IClinicEdges {
    edges: Array<IClinicNode>;
    pageInfo: IPageInfo;
  }

  /**
    description: Clinic node
  */
  interface IClinicNode {
    node: IClinic;
    cursor: string;
  }

  /**
    description: PatientEncounter
  */
  interface IPatientEncounter {
    encounterType: string;
    providerName: string;
    providerRole: string;
    location: string;
    diagnoses: Array<IPatientDiagnosis>;
    reasons: Array<string>;
    dateTime: string;
  }

  /**
    description: PatientDiagnosis
  */
  interface IPatientDiagnosis {
    code: string;
    codeSystem: string;
    description: string;
  }

  /**
    description: PatientMedications
  */
  interface IPatientMedications {
    medications: IPatientMedicationsDetails;
  }

  /**
    description: PatientMedicationsDetails
  */
  interface IPatientMedicationsDetails {
    active: Array<IPatientMedication>;
    inactive: Array<IPatientMedication>;
  }

  /**
    description: PatientMedication
  */
  interface IPatientMedication {
    name: string;
    medicationId: string;
    quantity: string | null;
    quantityUnit: string | null;
    dosageInstructions: string | null;
    startDate: string | null;
  }

  /**
    description: Task
  */
  interface ITask {
    id: string;
    title: string;
    description: string | null;
    patient: IPatient;
    patientId: string;
    dueAt: string | null;
    priority: IPriorityEnum | null;
    createdBy: IUser;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    completedBy: IUser | null;
    completedAt: string | null;
    assignedTo: IUser | null;
    followers: Array<IUser>;
    patientGoalId: string;
    patientGoal: IPatientGoal;
  }


  type IPriorityEnum = 'low' | 'medium' | 'high';


  interface IPatientGoal {
    id: string;
    title: string;
    patientId: string;
    patient: IPatient;
    patientConcernId: string | null;
    patientConcern: IPatientConcern | null;
    goalSuggestionTemplateId: string | null;
    goalSuggestionTemplate: IGoalSuggestionTemplate | null;
    tasks: Array<ITask>;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }


  interface IPatientConcern {
    id: string;
    order: number;
    concernId: string;
    concern: IConcern;
    patientGoals: Array<IPatientGoal>;
    patientId: string;
    patient: IPatient;
    startedAt: string | null;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  /**
    description: Concern
  */
  interface IConcern {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }


  interface IGoalSuggestionTemplate {
    id: string;
    title: string;
    taskTemplates: Array<ITaskTemplate>;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }


  interface ITaskTemplate {
    id: string;
    title: string;
    completedWithinNumber: number | null;
    completedWithinInterval: ICompletedWithinIntervalEnum | null;
    repeating: boolean | null;
    goalSuggestionTemplateId: string;
    priority: IPriorityEnum | null;
    careTeamAssigneeRole: IUserRoleEnum | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }


  type ICompletedWithinIntervalEnum = 'hour' | 'day' | 'week' | 'month' | 'year';


  type ITaskOrderOptionsEnum = 'createdAtDesc' | 'createdAtAsc' | 'dueAtDesc' | 'dueAtAsc' | 'updatedAtDesc' | 'updatedAtAsc';

  /**
    description: Task edges
  */
  interface ITaskEdges {
    edges: Array<ITaskNode>;
    pageInfo: IPageInfo;
  }

  /**
    description: Task node
  */
  interface ITaskNode {
    node: ITask | null;
    cursor: string;
  }

  /**
    description: Task comment edges
  */
  interface ITaskCommentEdges {
    edges: Array<ITaskCommentNode>;
    pageInfo: IPageInfo;
  }

  /**
    description: Task comment node
  */
  interface ITaskCommentNode {
    node: ITaskComment | null;
    cursor: string;
  }

  /**
    description: Task comment
  */
  interface ITaskComment {
    id: string;
    body: string;
    user: IUser;
    taskId: string;
    createdAt: string;
    updatedAt: string | null;
  }

  /**
    description: Risk Area
  */
  interface IRiskArea {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    title: string;
    order: number;
  }

  /**
    description: Question
  */
  interface IQuestion {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    title: string;
    validatedSource: string | null;
    answers: Array<IAnswer>;
    answerType: IAnswerTypeOptionsEnum;
    riskAreaId: string | null;
    screeningToolId: string | null;
    progressNoteTemplateId: string | null;
    applicableIfQuestionConditions: Array<IQuestionCondition>;
    applicableIfType: IQuestionConditionTypeOptionsEnum | null;
    order: number;
  }

  /**
    description: Answer
  */
  interface IAnswer {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    displayValue: string;
    value: string;
    valueType: IAnswerValueTypeOptionsEnum;
    riskAdjustmentType: IRiskAdjustmentTypeOptionsEnum | null;
    inSummary: boolean | null;
    summaryText: string | null;
    questionId: string;
    order: number;
    concernSuggestions: Array<IConcern>;
    goalSuggestions: Array<IGoalSuggestionTemplate> | null;
    riskArea: IRiskArea | null;
    screeningTool: IScreeningTool | null;
  }


  type IAnswerValueTypeOptionsEnum = 'string' | 'boolean' | 'number';


  type IRiskAdjustmentTypeOptionsEnum = 'inactive' | 'increment' | 'forceHighRisk';


  interface IScreeningTool {
    id: string;
    title: string;
    riskAreaId: string;
    riskArea: IRiskArea;
    screeningToolScoreRanges: Array<IScreeningToolScoreRange>;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }


  interface IScreeningToolScoreRange {
    id: string;
    description: string;
    screeningToolId: string;
    screeningTool: IScreeningTool;
    minimumScore: number;
    maximumScore: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    concernSuggestions: Array<IConcern>;
    goalSuggestions: Array<IGoalSuggestionTemplate> | null;
  }


  type IAnswerTypeOptionsEnum = 'dropdown' | 'radio' | 'freetext' | 'multiselect';

  /**
    description: QuestionCondition
  */
  interface IQuestionCondition {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    answerId: string;
    questionId: string;
  }


  type IQuestionConditionTypeOptionsEnum = 'allTrue' | 'oneTrue';


  type IQuestionFilterTypeEnum = 'progressNoteTemplate' | 'riskArea' | 'screeningTool';

  /**
    description: PatientAnswer
  */
  interface IPatientAnswer {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    answerId: string;
    answer: IAnswer;
    answerValue: string;
    patientId: string;
    applicable: boolean | null;
    question: IQuestion | null;
    patientScreeningToolSubmissionId: string | null;
    patientScreeningToolSubmission: IPatientScreeningToolSubmission | null;
  }


  interface IPatientScreeningToolSubmission {
    id: string;
    screeningToolId: string;
    screeningTool: IScreeningTool;
    patientId: string;
    patient: IPatient;
    userId: string;
    user: IUser;
    score: number;
    riskArea: IRiskArea;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    carePlanSuggestions: Array<ICarePlanSuggestion>;
    screeningToolScoreRangeId: string | null;
    screeningToolScoreRange: IScreeningToolScoreRange | null;
  }


  interface ICarePlanSuggestion {
    id: string;
    patientId: string;
    patient: IPatient;
    suggestionType: ICarePlanSuggestionTypeEnum;
    concernId: string | null;
    concern: IConcern | null;
    goalSuggestionTemplateId: string | null;
    goalSuggestionTemplate: IGoalSuggestionTemplate | null;
    acceptedById: string | null;
    acceptedBy: IUser | null;
    dismissedById: string | null;
    dismissedBy: IUser | null;
    dismissedReason: string | null;
    createdAt: string;
    updatedAt: string;
    dismissedAt: string | null;
    acceptedAt: string | null;
    patientScreeningToolSubmissionId: string | null;
    patientScreeningToolSubmission: IPatientScreeningToolSubmission | null;
  }


  type ICarePlanSuggestionTypeEnum = 'concern' | 'goal';


  type IAnswerFilterTypeEnum = 'question' | 'progressNote' | 'riskArea' | 'screeningTool';


  interface IRiskAreaSummary {
    summary: Array<string>;
    started: boolean;
    lastUpdated: string | null;
  }


  interface IRiskScore {
    score: number;
    forceHighRisk: boolean;
  }

  /**
    description: Event Notification edges
  */
  interface IEventNotificationEdges {
    edges: Array<IEventNotificationNode>;
    pageInfo: IPageInfo;
  }

  /**
    description: Event Notification node
  */
  interface IEventNotificationNode {
    node: IEventNotification | null;
    cursor: string;
  }

  /**
    description: Event Notification
  */
  interface IEventNotification {
    id: string;
    title: string | null;
    userId: string;
    user: IUser;
    taskEventId: string | null;
    taskEvent: ITaskEvent | null;
    seenAt: string | null;
    emailSentAt: string | null;
    deliveredAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  /**
    description: Task Event
  */
  interface ITaskEvent {
    id: string;
    taskId: string;
    userId: string;
    user: IUser;
    eventType: ITaskEventTypesEnum | null;
    eventCommentId: string | null;
    eventComment: ITaskComment | null;
    eventUserId: string | null;
    eventUser: IUser | null;
    progressNoteId: string | null;
    progressNote: IProgressNote | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }


  type ITaskEventTypesEnum = 'create_task' | 'add_follower' | 'remove_follower' | 'complete_task' | 'uncomplete_task' | 'delete_task' | 'add_comment' | 'edit_comment' | 'delete_comment' | 'edit_priority' | 'edit_due_date' | 'edit_assignee' | 'edit_title' | 'edit_description';


  interface IProgressNote {
    id: string;
    patientId: string;
    patient: IPatient;
    userId: string;
    user: IUser;
    progressNoteTemplateId: string | null;
    progressNoteTemplate: IProgressNoteTemplate | null;
    location: string | null;
    summary: string | null;
    completedAt: string | null;
    startedAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }


  interface IProgressNoteTemplate {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    carePlanSuggestions: Array<ICarePlanSuggestion>;
  }


  type IConcernOrderOptionsEnum = 'createdAtDesc' | 'createdAtAsc' | 'titleDesc' | 'titleAsc' | 'updatedAtDesc' | 'updatedAtAsc';


  type IGoalSuggestionOrderOptionsEnum = 'createdAtDesc' | 'createdAtAsc' | 'titleDesc' | 'titleAsc' | 'updatedAtDesc' | 'updatedAtAsc';


  interface IPatientTaskSuggestion {
    id: string;
    patientId: string;
    patient: IPatient;
    taskTemplateId: string | null;
    taskTemplate: ITaskTemplate | null;
    acceptedById: string | null;
    acceptedBy: IUser | null;
    dismissedById: string | null;
    dismissedBy: IUser | null;
    dismissedReason: string | null;
    createdAt: string;
    updatedAt: string;
    dismissedAt: string | null;
    acceptedAt: string | null;
  }


  interface ICarePlan {
    goals: Array<IPatientGoal>;
    concerns: Array<IPatientConcern>;
  }


  interface IProgressNoteActivity {
    taskEvents: Array<ITaskEvent>;
    patientAnswerEvents: Array<IPatientAnswerEvent>;
    carePlanUpdateEvents: Array<ICarePlanUpdateEvent>;
    quickCallEvents: Array<IQuickCall>;
  }

  /**
    description: Patient Answer Event
  */
  interface IPatientAnswerEvent {
    id: string;
    patientId: string;
    patient: IPatient;
    userId: string;
    user: IUser;
    patientAnswerId: string;
    patientAnswer: IPatientAnswer;
    previousPatientAnswerId: string | null;
    previousPatientAnswer: IPatientAnswer | null;
    eventType: IPatientAnswerEventTypesEnum;
    progressNoteId: string | null;
    progressNote: IProgressNote | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }


  type IPatientAnswerEventTypesEnum = 'create_patient_answer';

  /**
    description: Care Plan Update Event
  */
  interface ICarePlanUpdateEvent {
    id: string;
    patientId: string;
    patient: IPatient;
    userId: string;
    user: IUser;
    patientConcernId: string | null;
    patientGoalId: string | null;
    patientConcern: IPatientConcern | null;
    patientGoal: IPatientGoal | null;
    eventType: ICarePlanUpdateEventTypesEnum;
    progressNoteId: string | null;
    progressNote: IProgressNote | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }


  type ICarePlanUpdateEventTypesEnum = 'create_patient_concern' | 'edit_patient_concern' | 'delete_patient_concern' | 'create_patient_goal' | 'edit_patient_goal' | 'delete_patient_goal';


  interface IQuickCall {
    id: string;
    progressNoteId: string;
    progressNote: IProgressNote;
    userId: string;
    user: IUser;
    reason: string;
    summary: string;
    direction: IQuickCallDirectionEnum;
    callRecipient: string;
    wasSuccessful: boolean;
    startTime: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }


  type IQuickCallDirectionEnum = 'Inbound' | 'Outbound';


  interface IComputedField {
    id: string;
    slug: string;
    label: string;
    dataType: IComputedFieldDataTypesEnum;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }


  type IComputedFieldDataTypesEnum = 'boolean' | 'string' | 'number';


  type IComputedFieldOrderOptionsEnum = 'labelDesc' | 'labelAsc' | 'slugDesc' | 'slugAsc';


  interface IRootMutationType {
    /**
    description: Create a new user
  */
    userCreate: IUser | null;
    /**
    description: Login user
  */
    userLogin: IUserWithAuthToken | null;
    /**
    description: Edit user
  */
    userEditRole: IUser | null;
    /**
    description: Delete user
  */
    userDelete: IUser | null;
    /**
    description: Edit current user
  */
    currentUserEdit: IUser | null;
    /**
    description: Create a new clinic
  */
    clinicCreate: IClinic | null;
    /**
    description: Add user to careTeam
  */
    careTeamAddUser: Array<IUser> | null;
    /**
    description: Remove user from careTeam
  */
    careTeamRemoveUser: Array<IUser> | null;
    /**
    description: Add a note to an appointment
  */
    appointmentAddNote: IAppointmentAddNoteResult | null;
    /**
    description: Start an appointment
  */
    appointmentStart: IAppointment | null;
    /**
    description: End an appointment
  */
    appointmentEnd: IAppointmentEndResult | null;
    /**
    description: Edit fields on patient stored in the db
  */
    patientEdit: IPatient | null;
    /**
    description: Setup patient creates the patient in the db AND in athena
  */
    patientSetup: IPatient | null;
    /**
    description: Edit a patient scratch pad
  */
    patientScratchPadEdit: IPatientScratchPad | null;
    /**
    description: Create a task
  */
    taskCreate: ITask | null;
    /**
    description: Delete a task
  */
    taskDelete: ITask | null;
    /**
    description: Edit a task
  */
    taskEdit: ITask | null;
    /**
    description: Complete a task
  */
    taskComplete: ITask | null;
    /**
    description: Uncomplete a task
  */
    taskUncomplete: ITask | null;
    /**
    description: Add user to task followers
  */
    taskUserFollow: ITask | null;
    /**
    description: Remove user from task followers
  */
    taskUserUnfollow: ITask | null;
    /**
    description: Create a task
  */
    taskCommentCreate: ITaskComment | null;
    /**
    description: Edit a task
  */
    taskCommentEdit: ITaskComment | null;
    /**
    description: Delete a task
  */
    taskCommentDelete: ITaskComment | null;
    /**
    description: Create a RiskArea
  */
    riskAreaCreate: IRiskArea | null;
    /**
    description: Edit a RiskArea
  */
    riskAreaEdit: IRiskArea | null;
    /**
    description: Deletes a RiskArea
  */
    riskAreaDelete: IRiskArea | null;
    /**
    description: Create a Question
  */
    questionCreate: IQuestion | null;
    /**
    description: Edit a Question
  */
    questionEdit: IQuestion | null;
    /**
    description: Delete a question
  */
    questionDelete: IQuestion | null;
    /**
    description: Create an Answer
  */
    answerCreate: IAnswer | null;
    /**
    description: Edit an Answer
  */
    answerEdit: IAnswer | null;
    /**
    description: Deletes an Answer
  */
    answerDelete: IAnswer | null;
    /**
    description: Create a patient answer
  */
    patientAnswersCreate: Array<IPatientAnswer> | null;
    /**
    description: Edit a patient answer
  */
    patientAnswerEdit: IPatientAnswer | null;
    /**
    description: Deletes a patient Answer
  */
    patientAnswerDelete: IPatientAnswer | null;
    /**
    description: Updates applicable for Patient Answers in risk area
  */
    patientAnswersUpdateApplicable: Array<IPatientAnswer> | null;
    /**
    description: Create a QuestionCondition
  */
    questionConditionCreate: IQuestionCondition | null;
    /**
    description: Edit a QuestionCondition
  */
    questionConditionEdit: IQuestionCondition | null;
    /**
    description: Deletes a QuestionCondition
  */
    questionConditionDelete: IQuestionCondition | null;
    /**
    description: Dismisses (marks as seen) an EventNotification
  */
    eventNotificationDismiss: IEventNotification | null;
    /**
    description: Create a concern
  */
    concernCreate: IConcern | null;
    /**
    description: Edit a concern
  */
    concernEdit: IConcern | null;
    /**
    description: Deletes a concern
  */
    concernDelete: IConcern | null;
    /**
    description: suggest a concern for an answer
  */
    concernSuggestionCreate: Array<IConcern> | null;
    /**
    description: delete suggestion a concern for an answer
  */
    concernSuggestionDelete: Array<IConcern> | null;
    /**
    description: goal suggestion template create
  */
    goalSuggestionTemplateCreate: IGoalSuggestionTemplate | null;
    /**
    description: Edit a goal suggestion template
  */
    goalSuggestionTemplateEdit: IGoalSuggestionTemplate | null;
    /**
    description: Deletes a goal suggestion template
  */
    goalSuggestionTemplateDelete: IGoalSuggestionTemplate | null;
    /**
    description: Suggest a goal suggestion template for an answer
  */
    goalSuggestionCreate: Array<IGoalSuggestionTemplate> | null;
    /**
    description: unsuggest a goal suggestion template for an answer
  */
    goalSuggestionDelete: Array<IGoalSuggestionTemplate> | null;
    /**
    description: task template create
  */
    taskTemplateCreate: ITaskTemplate | null;
    /**
    description: Edit a task template
  */
    taskTemplateEdit: ITaskTemplate | null;
    /**
    description: Deletes a task template
  */
    taskTemplateDelete: ITaskTemplate | null;
    /**
    description: Suggest a task template for an answer
  */
    taskSuggestionCreate: Array<ITaskTemplate> | null;
    /**
    description: unsuggest a task template for an answer
  */
    taskSuggestionDelete: Array<ITaskTemplate> | null;
    /**
    description: patient task suggestion accept
  */
    patientTaskSuggestionAccept: IPatientTaskSuggestion | null;
    /**
    description: patient task suggestion dismiss
  */
    patientTaskSuggestionDismiss: IPatientTaskSuggestion | null;
    /**
    description: patient goal create
  */
    patientGoalCreate: IPatientGoal | null;
    /**
    description: patient goal edit
  */
    patientGoalEdit: IPatientGoal | null;
    /**
    description: patient goal delete
  */
    patientGoalDelete: IPatientGoal | null;
    /**
    description: patient concern create
  */
    patientConcernCreate: IPatientConcern | null;
    /**
    description: patient concern edit
  */
    patientConcernEdit: IPatientConcern | null;
    /**
    description: patient concern bulk edit
  */
    patientConcernBulkEdit: Array<IPatientConcern> | null;
    /**
    description: patient concern delete
  */
    patientConcernDelete: IPatientConcern | null;
    /**
    description: care plan suggestion accept
  */
    carePlanSuggestionAccept: ICarePlanSuggestion | null;
    /**
    description: care plan suggestion dismiss
  */
    carePlanSuggestionDismiss: ICarePlanSuggestion | null;
    /**
    description: screening tool create
  */
    screeningToolCreate: IScreeningTool | null;
    /**
    description: screening tool edit
  */
    screeningToolEdit: IScreeningTool | null;
    /**
    description: screening tool delete
  */
    screeningToolDelete: IScreeningTool | null;
    /**
    description: screening tool score range create
  */
    screeningToolScoreRangeCreate: IScreeningToolScoreRange | null;
    /**
    description: screening tool score range edit
  */
    screeningToolScoreRangeEdit: IScreeningToolScoreRange | null;
    /**
    description: screening tool score range delete
  */
    screeningToolScoreRangeDelete: IScreeningToolScoreRange | null;
    /**
    description: patient screening tool submission create
  */
    patientScreeningToolSubmissionCreate: IPatientScreeningToolSubmission | null;
    /**
    description: patient screening tool submission edit
  */
    patientScreeningToolSubmissionEdit: IPatientScreeningToolSubmission | null;
    /**
    description: patient screening tool submission delete
  */
    patientScreeningToolSubmissionDelete: IPatientScreeningToolSubmission | null;
    /**
    description: create a progress note template
  */
    progressNoteTemplateCreate: IProgressNoteTemplate | null;
    /**
    description: edits a progress note template
  */
    progressNoteTemplateEdit: IProgressNoteTemplate | null;
    /**
    description: deletes a progress note template
  */
    progressNoteTemplateDelete: IProgressNoteTemplate | null;
    /**
    description: creates a progress note
  */
    progressNoteCreate: IProgressNote | null;
    /**
    description: completes a progress note
  */
    progressNoteComplete: IProgressNote | null;
    /**
    description: edits a progress note
  */
    progressNoteEdit: IProgressNote | null;
    /**
    description: creates a quick call
  */
    quickCallCreate: IQuickCall | null;
    /**
    description: Create a computed field
  */
    computedFieldCreate: IComputedField | null;
    /**
    description: Delete a computed field
  */
    computedFieldDelete: IComputedField | null;
  }

  /**
    description: params for creating a user
  */
  interface IUserCreateInput {
    email: string;
    homeClinicId: string;
  }

  /**
    description: params for logging in a user
  */
  interface IUserLoginInput {
    googleAuthCode: string;
  }

  /**
    description: The user account with an optional auth token
  */
  interface IUserWithAuthToken {
    user: IUser;
    /**
    description: The auth token to allow for quick login. JWT passed back in via headers for further requests
  */
    authToken: string | null;
  }

  /**
    description: params for editing a user - only supports user role
  */
  interface IUserEditRoleInput {
    userRole: string;
    email: string;
  }

  /**
    description: params for deleting a user
  */
  interface IUserDeleteInput {
    email: string;
  }

  /**
    description: params for editing a current user
  */
  interface ICurrentUserEditInput {
    locale?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  }

  /**
    description: params for creating a clinic
  */
  interface IClinicCreateInput {
    departmentId: number;
    name: string;
  }

  /**
    description: params for adding or removing patient from care team
  */
  interface ICareTeamInput {
    userId: string;
    patientId: string;
  }

  /**
    description: params for adding a note to an appointment
  */
  interface IAppointmentAddNoteInput {
    patientId: string;
    appointmentId: string;
    appointmentNote: string;
  }

  /**
    description: Appointment Add Note Result
  */
  interface IAppointmentAddNoteResult {
    success: boolean;
    appointmentNote: string;
  }

  /**
    description: params for starting an appointment
  */
  interface IAppointmentStartInput {
    patientId: string;
    appointmentTypeId?: number | null;
  }

  /**
    description: Appointment
  */
  interface IAppointment {
    athenaAppointmentId: string;
    dateTime: string;
    athenaDepartmentId: number;
    status: IAppointmentStatusEnum;
    athenaPatientId: number;
    duration: number;
    appointmentTypeId: number;
    appointmentType: string;
    athenaProviderId: number;
    userId: string;
    patientId: string;
    clinicId: string;
  }


  type IAppointmentStatusEnum = 'cancelled' | 'future' | 'open' | 'checkedIn' | 'checkedOut' | 'chargeEntered';

  /**
    description: params for ending an appointment
  */
  interface IAppointmentEndInput {
    patientId: string;
    appointmentId: string;
    appointmentNote?: string | null;
  }

  /**
    description: Appointment End Result
  */
  interface IAppointmentEndResult {
    success: boolean;
  }

  /**
    description: params for editing a patient in the db
  */
  interface IPatientEditInput {
    patientId: string;
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
    dateOfBirth?: string | null;
    gender?: string | null;
    zip?: string | null;
    language?: string | null;
    consentToCall?: boolean | null;
    consentToText?: boolean | null;
  }

  /**
    description: params for creating a patient in the db and in athena
  */
  interface IPatientSetupInput {
    firstName: string;
    middleName?: string | null;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    zip: string;
    homeClinicId: string;
    suffix?: string | null;
    preferredName?: string | null;
    race: string;
    ssn: string;
    language: string;
    maritalStatus: string;
    email?: string | null;
    homePhone?: string | null;
    mobilePhone?: string | null;
    consentToCall: boolean;
    consentToText: boolean;
    city?: string | null;
    address1?: string | null;
    county?: string | null;
    country?: string | null;
    state?: string | null;
    insuranceType?: string | null;
    patientRelationshipToPolicyHolder?: string | null;
    memberId?: string | null;
    policyGroupNumber?: string | null;
    issueDate?: string | null;
    expirationDate?: string | null;
  }

  /**
    description: params for editing a patient scratch pad
  */
  interface IPatientScratchPadEditInput {
    patientId: string;
    text: string;
  }

  /**
    description: params for creating a task
  */
  interface ITaskCreateInput {
    title: string;
    description?: string | null;
    dueAt?: string | null;
    patientId: string;
    assignedToId?: string | null;
    patientGoalId?: string | null;
    priority?: IPriorityEnum | null;
  }

  /**
    description: params for deleting a task
  */
  interface ITaskDeleteInput {
    taskId: string;
  }

  /**
    description: params for creating a task
  */
  interface ITaskEditInput {
    taskId: string;
    title?: string | null;
    description?: string | null;
    dueAt?: string | null;
    assignedToId?: string | null;
    priority?: IPriorityEnum | null;
    patientGoalId?: string | null;
  }

  /**
    description: params for completing a task
  */
  interface ITaskCompleteInput {
    taskId: string;
  }

  /**
    description: params for adding user to a task's followers
  */
  interface ITaskFollowInput {
    userId: string;
    taskId: string;
  }

  /**
    description: params for creating a task comment
  */
  interface ITaskCommentCreateInput {
    taskId: string;
    body: string;
  }

  /**
    description: params for editing a task comment
  */
  interface ITaskCommentEditInput {
    taskCommentId: string;
    body: string;
  }

  /**
    description: params for deleting a task comment
  */
  interface ITaskCommentDeleteInput {
    taskCommentId: string;
  }


  interface IRiskAreaCreateInput {
    title: string;
    order: number;
  }


  interface IRiskAreaEditInput {
    riskAreaId: string;
    title?: string | null;
    order?: number | null;
  }


  interface IRiskAreaDeleteInput {
    riskAreaId: string;
  }


  interface IQuestionCreateInput {
    title: string;
    answerType: IAnswerTypeOptionsEnum;
    validatedSource?: string | null;
    riskAreaId?: string | null;
    screeningToolId?: string | null;
    progressNoteTemplateId?: string | null;
    order: number;
    applicableIfType?: IQuestionConditionTypeOptionsEnum | null;
  }


  interface IQuestionEditInput {
    questionId: string;
    title?: string | null;
    answerType?: IAnswerTypeOptionsEnum | null;
    validatedSource?: string | null;
    order?: number | null;
    applicableIfType?: IQuestionConditionTypeOptionsEnum | null;
  }


  interface IQuestionDeleteInput {
    questionId: string;
  }


  interface IAnswerCreateInput {
    displayValue: string;
    value: string;
    valueType: IAnswerValueTypeOptionsEnum;
    riskAdjustmentType?: IRiskAdjustmentTypeOptionsEnum | null;
    inSummary?: boolean | null;
    summaryText?: string | null;
    questionId: string;
    order: number;
  }


  interface IAnswerEditInput {
    displayValue?: string | null;
    value?: string | null;
    valueType?: IAnswerValueTypeOptionsEnum | null;
    riskAdjustmentType?: IRiskAdjustmentTypeOptionsEnum | null;
    inSummary?: boolean | null;
    summaryText?: string | null;
    order?: number | null;
    answerId: string;
  }


  interface IAnswerDeleteInput {
    answerId: string;
  }


  interface IPatientAnswersCreateInput {
    patientId: string;
    patientAnswers: Array<IPatientAnswerInput>;
    questionIds: Array<string>;
    screeningToolId?: string | null;
    progressNoteId?: string | null;
  }


  interface IPatientAnswerInput {
    answerId: string;
    answerValue: string;
    patientId: string;
    applicable: boolean;
    questionId: string;
  }


  interface IPatientAnswerEditInput {
    applicable: boolean;
    patientAnswerId: string;
  }


  interface IPatientAnswerDeleteInput {
    patientAnswerId: string;
  }


  interface IPatientAnswersUpdateApplicableInput {
    patientId: string;
    riskAreaId: string;
  }


  interface IQuestionConditionCreateInput {
    questionId: string;
    answerId: string;
  }

  /**
    description: QuestionCondition edit input - for validation, need to edit question and answer at the same time
  */
  interface IQuestionConditionEditInput {
    questionConditionId: string;
    questionId: string;
    answerId: string;
  }


  interface IQuestionConditionDeleteInput {
    questionConditionId: string;
  }

  /**
    description: EventNotification edit input
  */
  interface IEventNotificationEditInput {
    eventNotificationId: string;
  }


  interface IConcernCreateInput {
    title: string;
  }


  interface IConcernEditInput {
    title: string;
    concernId: string;
  }


  interface IConcernDeleteInput {
    concernId: string;
  }


  interface IConcernSuggestInput {
    concernId: string;
    answerId?: string | null;
    screeningToolScoreRangeId?: string | null;
  }


  interface IGoalSuggestionTemplateCreateInput {
    title: string;
  }


  interface IGoalSuggestionTemplateEditInput {
    title: string;
    goalSuggestionTemplateId: string;
  }


  interface IGoalSuggestionTemplateDeleteInput {
    goalSuggestionTemplateId: string;
  }


  interface IGoalSuggestInput {
    answerId?: string | null;
    screeningToolScoreRangeId?: string | null;
    goalSuggestionTemplateId: string;
  }


  interface ITaskTemplateCreateInput {
    title: string;
    completedWithinNumber?: number | null;
    completedWithinInterval?: string | null;
    repeating?: boolean | null;
    goalSuggestionTemplateId: string;
    priority?: IPriorityEnum | null;
    careTeamAssigneeRole?: string | null;
  }


  interface ITaskTemplateEditInput {
    title: string;
    completedWithinNumber?: number | null;
    completedWithinInterval?: string | null;
    repeating?: boolean | null;
    goalSuggestionTemplateId?: string | null;
    priority?: IPriorityEnum | null;
    careTeamAssigneeRole?: string | null;
    taskTemplateId: string;
  }


  interface ITaskTemplateDeleteInput {
    taskTemplateId: string;
  }


  interface ITaskSuggestInput {
    answerId: string;
    taskTemplateId: string;
  }


  interface IPatientTaskSuggestionAcceptInput {
    patientTaskSuggestionId: string;
  }


  interface IPatientTaskSuggestionDismissInput {
    patientTaskSuggestionId: string;
    dismissedReason: string;
  }


  interface IPatientGoalCreateInput {
    title?: string | null;
    patientId: string;
    patientConcernId?: string | null;
    goalSuggestionTemplateId?: string | null;
    taskTemplateIds?: Array<string> | null;
    concernId?: string | null;
    concernTitle?: string | null;
    startedAt?: string | null;
  }


  interface IPatientGoalEditInput {
    patientGoalId: string;
    title: string;
    patientConcernId?: string | null;
    goalSuggestionTemplateId?: string | null;
  }


  interface IPatientGoalDeleteInput {
    patientGoalId: string;
  }


  interface IPatientConcernCreateInput {
    concernId: string;
    patientId: string;
    startedAt?: string | null;
    completedAt?: string | null;
  }


  interface IPatientConcernEditInput {
    order?: number | null;
    concernId?: string | null;
    patientId?: string | null;
    startedAt?: string | null;
    completedAt?: string | null;
    patientConcernId: string;
  }


  interface IPatientConcernBulkEditInput {
    patientConcerns: Array<IPatientConcernBulkEditFields>;
    patientId: string;
  }


  interface IPatientConcernBulkEditFields {
    id: string;
    order?: number | null;
    startedAt?: string | null;
    completedAt?: string | null;
  }


  interface IPatientConcernDeleteInput {
    patientConcernId: string;
  }


  interface ICarePlanSuggestionAcceptInput {
    carePlanSuggestionId: string;
    patientConcernId?: string | null;
    concernId?: string | null;
    startedAt?: string | null;
    taskTemplateIds?: Array<string> | null;
  }


  interface ICarePlanSuggestionDismissInput {
    carePlanSuggestionId: string;
    dismissedReason: string;
  }


  interface IScreeningToolCreateInput {
    title: string;
    riskAreaId: string;
  }


  interface IScreeningToolEditInput {
    screeningToolId: string;
    title?: string | null;
    riskAreaId?: string | null;
  }


  interface IScreeningToolDeleteInput {
    screeningToolId: string;
  }


  interface IScreeningToolScoreRangeCreateInput {
    screeningToolId: string;
    description: string;
    minimumScore: number;
    maximumScore: number;
  }


  interface IScreeningToolScoreRangeEditInput {
    screeningToolScoreRangeId: string;
    description?: string | null;
    screeningToolId?: string | null;
    minimumScore?: number | null;
    maximumScore?: number | null;
    deletedAt?: string | null;
  }


  interface IScreeningToolScoreRangeDeleteInput {
    screeningToolScoreRangeId: string;
  }


  interface IPatientScreeningToolSubmissionCreateInput {
    screeningToolId: string;
    patientId: string;
    userId: string;
    score: number;
  }


  interface IPatientScreeningToolSubmissionEditInput {
    patientScreeningToolSubmissionId: string;
    screeningToolId?: string | null;
    patientId?: string | null;
    userId?: string | null;
    score?: number | null;
  }


  interface IPatientScreeningToolSubmissionDeleteInput {
    patientScreeningToolSubmissionId: string;
  }


  interface IProgressNoteTemplateCreateInput {
    title: string;
  }


  interface IProgressNoteTemplateEditInput {
    progressNoteTemplateId: string;
    title: string;
  }


  interface IProgressNoteTemplateDeleteInput {
    progressNoteTemplateId: string;
  }


  interface IProgressNoteCreateInput {
    patientId: string;
  }


  interface IProgressNoteCompleteInput {
    progressNoteId: string;
  }


  interface IProgressNoteEditInput {
    progressNoteId: string;
    progressNoteTemplateId: string;
    startedAt?: string | null;
    location?: string | null;
    summary?: string | null;
  }


  interface IQuickCallCreateInput {
    patientId: string;
    reason: string;
    summary: string;
    direction: IQuickCallDirectionEnum;
    callRecipient: string;
    wasSuccessful: boolean;
    startTime: string;
  }


  interface IComputedFieldCreateInput {
    label: string;
    dataType: IComputedFieldDataTypesEnum;
  }


  interface IComputedFieldDeleteInput {
    computedFieldId: string;
  }


  interface IRiskAreaStatistic {
    riskArea: IRiskArea;
    summaryData: IRiskAreaSummary;
    scoreData: IRiskScore;
  }


  interface IThreeSixtySummary {
    riskAreas: Array<IRiskAreaStatistic>;
  }
}
