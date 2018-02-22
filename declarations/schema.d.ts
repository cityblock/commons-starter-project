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
    All Users (admin only)
  */
    users: IUserEdges;
    /**
    List of all Users with care roles
  */
    userSummaryList: Array<IUser>;
    /**
    The current User
  */
    currentUser: IUser | null;
    /**
    A single Patient
  */
    patient: IPatient;
    /**
    Users on a care team
  */
    patientCareTeam: Array<IUser>;
    /**
    Patient scratch pad
  */
    patientScratchPad: IPatientScratchPad;
    /**
    Patient search
  */
    patientSearch: IPatientTableRowEdges;
    /**
    Patients filtered by options
  */
    patientPanel: IPatientTableRowEdges;
    /**
    Patient dashboard - tasks due and notifications
  */
    patientsWithUrgentTasks: IPatientForDashboardEdges;
    /**
    Patient dashboard - new to user care team
  */
    patientsNewToCareTeam: IPatientForDashboardEdges;
    /**
    Patient dashboard - pending MAP suggestions
  */
    patientsWithPendingSuggestions: IPatientForDashboardEdges;
    /**
    Patient dashboard - lacking demographic information
  */
    patientsWithMissingInfo: IPatientForDashboardEdges;
    /**
    Patient dashboard - no recent engagement
  */
    patientsWithNoRecentEngagement: IPatientForDashboardEdges;
    /**
    Patient dashboard - out of date MAP
  */
    patientsWithOutOfDateMAP: IPatientForDashboardEdges;
    /**
    Patient dashboard - open CBO referrals
  */
    patientsWithOpenCBOReferrals: IPatientForDashboardEdges;
    /**
    Patient dashboard - computed list for answer
  */
    patientsForComputedList: IPatientForDashboardEdges;
    /**
    A single clinic
  */
    clinic: IClinic;
    /**
    Clinics
  */
    clinics: IClinicEdges;
    /**
    Task
  */
    task: ITask;
    /**
    Patient's Tasks
  */
    tasksForPatient: ITaskEdges;
    /**
    Current user's Tasks
  */
    tasksForCurrentUser: ITaskEdges;
    /**
    Tasks due soon for patient - in dashboard
  */
    tasksDueSoonForPatient: Array<ITask>;
    /**
    Tasks with notifications for patient - in dashboard
  */
    tasksWithNotificationsForPatient: Array<ITask>;
    /**
    Task IDs with notifications for current user - in care plan MAP and tasks panel
  */
    taskIdsWithNotifications: Array<ITaskId>;
    /**
    List of task comments
  */
    taskComments: ITaskCommentEdges;
    /**
    Single task comment
  */
    taskComment: ITaskComment;
    /**
    RiskAreaGroup
  */
    riskAreaGroup: IRiskAreaGroup;
    /**
    Risk Area Group with associated patient answers
  */
    riskAreaGroupForPatient: IRiskAreaGroupForPatient;
    /**
    RiskAreaGroups
  */
    riskAreaGroups: Array<IRiskAreaGroup>;
    /**
    RiskArea
  */
    riskArea: IRiskArea;
    /**
    RiskAreas
  */
    riskAreas: Array<IRiskArea>;
    /**
    Question
  */
    question: IQuestion;
    /**
    Questions for risk area, progress note template or screening tool
  */
    questions: Array<IQuestion>;
    /**
    Answer
  */
    answer: IAnswer | null;
    /**
    Answers
  */
    answersForQuestion: Array<IAnswer>;
    /**
    PatientAnswer
  */
    patientAnswer: IPatientAnswer;
    /**
    PatientAnswersForQuestion
  */
    patientAnswers: Array<IPatientAnswer>;
    /**
    PatientPreviousAnswersForQuestion
  */
    patientPreviousAnswersForQuestion: Array<IPatientAnswer>;
    /**
    PatientRiskAreaSummary
  */
    patientRiskAreaSummary: IRiskAreaSummary;
    /**
    PatientRiskAreaRiskScore
  */
    patientRiskAreaRiskScore: IRiskScore;
    /**
    QuestionCondition
  */
    questionCondition: IQuestionCondition;
    /**
    Event notifications for a user
  */
    eventNotificationsForCurrentUser: IEventNotificationEdges;
    /**
    Event notifications for a task
  */
    eventNotificationsForTask: IEventNotificationEdges;
    /**
    Event notifications for a user's task - on dashboard
  */
    eventNotificationsForUserTask: Array<IEventNotification>;
    /**
    Concern
  */
    concern: IConcern;
    /**
    Concerns
  */
    concerns: Array<IConcern>;
    /**
    Concerns for answer
  */
    concernsForAnswer: Array<IConcern>;
    /**
    patient concern
  */
    patientConcern: IPatientConcern;
    /**
    patient concerns for patient
  */
    patientConcerns: Array<IPatientConcern>;
    /**
    Patient goal
  */
    patientGoal: IPatientGoal;
    /**
    Patient goals for patient
  */
    patientGoals: Array<IPatientGoal>;
    /**
    Goal suggestion templates
  */
    goalSuggestionTemplate: IGoalSuggestionTemplate;
    /**
    Goal suggestion templates
  */
    goalSuggestionTemplates: Array<IGoalSuggestionTemplate>;
    /**
    Goal suggestion for template for answer
  */
    goalSuggestionTemplatesForAnswer: Array<IGoalSuggestionTemplate>;
    /**
    Task template
  */
    taskTemplate: ITaskTemplate;
    /**
    Task templates
  */
    taskTemplates: Array<ITaskTemplate>;
    /**
    Task templates suggested for answer
  */
    taskTemplatesForAnswer: Array<ITaskTemplate>;
    /**
    patient task suggestions
  */
    patientTaskSuggestions: Array<IPatientTaskSuggestion>;
    /**
    Care Plan Suggestions
  */
    carePlanSuggestionsForPatient: Array<ICarePlanSuggestion>;
    /**
    Care Plan
  */
    carePlanForPatient: ICarePlan;
    /**
    screening tool
  */
    screeningTool: IScreeningTool;
    /**
    screening tools
  */
    screeningTools: Array<IScreeningTool>;
    /**
    screening tools for risk area
  */
    screeningToolsForRiskArea: Array<IScreeningTool>;
    /**
    screening tool score range
  */
    screeningToolScoreRange: IScreeningToolScoreRange;
    /**
    screening tool score range for screening tool and score
  */
    screeningToolScoreRangeForScoreAndScreeningTool: IScreeningToolScoreRange | null;
    /**
    screening tool score ranges
  */
    screeningToolScoreRanges: Array<IScreeningToolScoreRange>;
    /**
    screening tool score ranges for screening tool
  */
    screeningToolScoreRangesForScreeningTool: Array<IScreeningToolScoreRange>;
    /**
    patient screening tool submission
  */
    patientScreeningToolSubmission: IPatientScreeningToolSubmission;
    /**
    latest patient sreening tool submission for a screening tool
  */
    patientScreeningToolSubmissionForPatientAndScreeningTool: IPatientScreeningToolSubmission | null;
    /**
    patient screening tool submissions for patient and screening tool (optioanlly)
  */
    patientScreeningToolSubmissionsForPatient: Array<IPatientScreeningToolSubmission>;
    /**
    patient screening tool submissions for patient 360 (history tab)
  */
    patientScreeningToolSubmissionsFor360: Array<IPatientScreeningToolSubmission>;
    /**
    patient screening tool submissions
  */
    patientScreeningToolSubmissions: Array<IPatientScreeningToolSubmission>;
    /**
    progress note template
  */
    progressNoteTemplate: IProgressNoteTemplate;
    /**
    progress note templates
  */
    progressNoteTemplates: Array<IProgressNoteTemplate>;
    /**
    progress note
  */
    progressNote: IProgressNote;
    /**
    progress notes for patient
  */
    progressNotesForPatient: Array<IProgressNote>;
    /**
    progress notes for current user
  */
    progressNotesForCurrentUser: Array<IProgressNote>;
    /**
    progress notes for supervisor review
  */
    progressNotesForSupervisorReview: Array<IProgressNote>;
    /**
    progress note activities for progress note
  */
    progressNoteActivityForProgressNote: IProgressNoteActivity;
    /**
    quick call
  */
    quickCall: IQuickCall;
    /**
    quick calls for progress note
  */
    quickCallsForProgressNote: Array<IQuickCall>;
    /**
    computed field
  */
    computedField: IComputedField;
    /**
    computed fields
  */
    computedFields: Array<IComputedField>;
    /**
    computed fields schema
  */
    computedFieldsSchema: IComputedFieldsSchema;
    /**
    risk area assessment submission
  */
    riskAreaAssessmentSubmission: IRiskAreaAssessmentSubmission;
    /**
    latest risk area assessment submission for a screening tool
  */
    riskAreaAssessmentSubmissionForPatient: IRiskAreaAssessmentSubmission | null;
    /**
    patient list
  */
    patientList: IPatientList;
    /**
    all patient lists
  */
    patientLists: Array<IPatientList>;
    /**
    all CBO categories
  */
    CBOCategories: Array<ICBOCategory>;
    /**
    CBO
  */
    CBO: ICBO;
    /**
    all CBOs
  */
    CBOs: Array<ICBO>;
    /**
    all CBOs for given category
  */
    CBOsForCategory: Array<ICBO>;
    /**
    patient data flags for a patient
  */
    patientDataFlagsForPatient: Array<IPatientDataFlag>;
    /**
    patient glass breaks for user during current session
  */
    patientGlassBreaksForUser: Array<IPatientGlassBreak>;
    /**
    progress note glass breaks for a user during current session
  */
    progressNoteGlassBreaksForUser: Array<IProgressNoteGlassBreak>;
    /**
    computed patient status for a patient
  */
    patientComputedPatientStatus: IComputedPatientStatus;
  }


  type IUserOrderOptionsEnum = 'createdAtDesc' | 'createdAtAsc' | 'lastLoginAtDesc' | 'lastLoginAtAsc' | 'updatedAtDesc' | 'updatedAtAsc' | 'emailAsc';

  /**
    User edges
  */
  interface IUserEdges {
    edges: Array<IUserNode> | null;
    pageInfo: IPageInfo;
  }

  /**
    User node
  */
  interface IUserNode {
    node: IUser | null;
    cursor: string;
  }

  /**
    User account model
  */
  interface IUser {
    id: string;
    locale: string | null;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    userRole: IUserRoleEnum;
    homeClinicId: string;
    googleProfileImageUrl: string | null;
    createdAt: string;
    updatedAt: string;
    permissions: IPermissionsEnum;
  }

  /**
    An object with a Globally Unique ID
  */
  interface IUniqueId {
    /**
    The ID of the object.
  */
    id: string;
  }


  type IUserRoleEnum = 'physician' | 'nurseCareManager' | 'primaryCarePhysician' | 'communityHealthPartner' | 'psychiatrist' | 'healthCoach' | 'familyMember' | 'anonymousUser' | 'admin';


  type IPermissionsEnum = 'green' | 'pink' | 'orange' | 'blue' | 'yellow' | 'red' | 'black';

  /**
    Page info for paginated responses
  */
  interface IPageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }

  /**
    Patient combining data in athena and our database
  */
  interface IPatient {
    id: string;
    patientInfo: IPatientInfo;
    firstName: string;
    middleName: string | null;
    lastName: string;
    dateOfBirth: string | null;
    homeClinicId: string | null;
    createdAt: string;
    scratchPad: string | null;
    consentToCall: boolean | null;
    consentToText: boolean | null;
    careTeam: Array<IUser>;
    patientDataFlags: Array<IPatientDataFlag>;
    computedPatientStatus: IComputedPatientStatus;
    coreIdentityVerifiedAt: string | null;
    coreIdentityVerifiedById: string | null;
  }

  /**
    Patient info that is editable in Commons
  */
  interface IPatientInfo {
    id: string;
    patientId: string;
    gender: string | null;
    language: string | null;
    primaryAddress: IAddress | null;
    addresses: Array<IAddress>;
  }

  /**
    Address
  */
  interface IAddress {
    id: string;
    zip: string | null;
    street: string | null;
    state: string | null;
    city: string | null;
    description: string | null;
  }

  /**
    Patient Data Flag
  */
  interface IPatientDataFlag {
    id: string;
    patientId: string;
    userId: string;
    fieldName: ICoreIdentityOptionsEnum;
    suggestedValue: string | null;
    notes: string | null;
    updatedAt: string | null;
  }


  type ICoreIdentityOptionsEnum = 'firstName' | 'middleName' | 'lastName' | 'dateOfBirth';

  /**
    ComputedPatientStatus
  */
  interface IComputedPatientStatus {
    id: string;
    patientId: string;
    updatedById: string;
    isCoreIdentityVerified: boolean;
    isDemographicInfoUpdated: boolean;
    isEmergencyContactAdded: boolean;
    isAdvancedDirectivesAdded: boolean;
    isConsentSigned: boolean;
    isPhotoAddedOrDeclined: boolean;
    isIneligible: boolean;
    isDisenrolled: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  /**
    Patient Scratch Pad
  */
  interface IPatientScratchPad {
    text: string | null;
  }

  /**
    Patient table row edges
  */
  interface IPatientTableRowEdges {
    edges: Array<IPatientTableRowNode>;
    pageInfo: IPageInfo;
    totalCount: number;
  }

  /**
    Patient table row node
  */
  interface IPatientTableRowNode {
    node: IPatientTableRow | null;
    cursor: string;
  }

  /**
    Patient table row
  */
  interface IPatientTableRow {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string | null;
    userCareTeam: boolean | null;
    patientInfo: IPatientInfo;
  }


  interface IPatientFilterOptions {
    ageMin: number | null;
    ageMax: number | null;
    gender: IGenderEnum | null;
    zip: string | null;
    careWorkerId: string | null;
  }


  type IGenderEnum = 'male' | 'female' | 'transgender' | 'nonbinary';

  /**
    Patient dashboard item edges
  */
  interface IPatientForDashboardEdges {
    edges: Array<IPatientForDashboardNode>;
    pageInfo: IPageInfo;
    totalCount: number;
  }

  /**
    Patient dashboard item node
  */
  interface IPatientForDashboardNode {
    node: IPatientForDashboard | null;
    cursor: string;
  }

  /**
    Patient dashboard item
  */
  interface IPatientForDashboard {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string | null;
    patientInfo: IPatientInfo;
  }

  /**
    Clinic
  */
  interface IClinic {
    id: string;
    name: string;
    departmentId: number;
    createdAt: string;
    updatedAt: string;
  }

  /**
    Clinic edges
  */
  interface IClinicEdges {
    edges: Array<IClinicNode>;
    pageInfo: IPageInfo;
  }

  /**
    Clinic node
  */
  interface IClinicNode {
    node: IClinic;
    cursor: string;
  }

  /**
    Task
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
    assignedToId: string | null;
    assignedTo: IUser | null;
    followers: Array<IUser>;
    patientGoalId: string;
    patientGoal: IPatientGoalShort;
    CBOReferralId: string | null;
    CBOReferral: ICBOReferral | null;
  }


  type IPriorityEnum = 'low' | 'medium' | 'high';


  interface IPatientGoalShort {
    id: string;
    title: string;
    patientId: string;
    patientConcernId: string | null;
    patientConcern: IPatientConcern | null;
    goalSuggestionTemplateId: string | null;
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
    Concern
  */
  interface IConcern {
    id: string;
    title: string;
    diagnosisCodes: Array<IDiagnosisCode>;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  /**
    DiagnosisCode
  */
  interface IDiagnosisCode {
    id: string;
    codesetName: string;
    label: string;
    code: string;
    version: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }


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
    CBOCategoryId: string | null;
  }


  type ICompletedWithinIntervalEnum = 'hour' | 'day' | 'week' | 'month' | 'year';


  interface ICBOReferral {
    id: string;
    categoryId: string;
    category: ICBOCategory;
    CBOId: string | null;
    CBO: ICBO | null;
    name: string | null;
    url: string | null;
    diagnosis: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    sentAt: string | null;
    acknowledgedAt: string | null;
  }


  interface ICBOCategory {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }


  interface ICBO {
    id: string;
    name: string;
    categoryId: string;
    category: ICBOCategory;
    address: string;
    city: string;
    state: string;
    zip: string;
    fax: string | null;
    phone: string;
    url: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }


  type ITaskOrderOptionsEnum = 'createdAtDesc' | 'createdAtAsc' | 'dueAtDesc' | 'dueAtAsc' | 'updatedAtDesc' | 'updatedAtAsc' | 'titleAsc' | 'titleDesc';

  /**
    Task edges
  */
  interface ITaskEdges {
    edges: Array<ITaskNode>;
    pageInfo: IPageInfo;
  }

  /**
    Task node
  */
  interface ITaskNode {
    node: ITask | null;
    cursor: string;
  }

  /**
    Task ID
  */
  interface ITaskId {
    id: string;
  }

  /**
    Task comment edges
  */
  interface ITaskCommentEdges {
    edges: Array<ITaskCommentNode>;
    pageInfo: IPageInfo;
  }

  /**
    Task comment node
  */
  interface ITaskCommentNode {
    node: ITaskComment | null;
    cursor: string;
  }

  /**
    Task comment
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
    Risk Area Group
  */
  interface IRiskAreaGroup {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    title: string;
    shortTitle: string;
    order: number;
    mediumRiskThreshold: number;
    highRiskThreshold: number;
    riskAreas: Array<IRiskArea>;
  }

  /**
    Risk Area
  */
  interface IRiskArea {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    title: string;
    assessmentType: IAssessmentTypeEnum;
    riskAreaGroupId: string;
    order: number;
    mediumRiskThreshold: number;
    highRiskThreshold: number;
    questions: Array<IQuestion>;
    screeningTools: Array<IScreeningTool>;
  }


  type IAssessmentTypeEnum = 'automated' | 'manual';

  /**
    Question
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
    computedFieldId: string | null;
    computedField: IComputedField | null;
    otherTextAnswerId: string | null;
  }

  /**
    Answer
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
    riskArea: IRiskAreaShort | null;
    screeningTool: IScreeningToolShort | null;
  }


  type IAnswerValueTypeOptionsEnum = 'string' | 'boolean' | 'number';


  type IRiskAdjustmentTypeOptionsEnum = 'inactive' | 'increment' | 'forceHighRisk';


  interface IRiskAreaShort {
    id: string;
    title: string;
  }


  interface IScreeningToolShort {
    id: string;
    title: string;
  }


  type IAnswerTypeOptionsEnum = 'dropdown' | 'radio' | 'freetext' | 'multiselect';

  /**
    QuestionCondition
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


  interface IScreeningTool {
    id: string;
    title: string;
    riskAreaId: string;
    screeningToolScoreRanges: Array<IScreeningToolScoreRange>;
    patientScreeningToolSubmissions: Array<IPatientScreeningToolSubmissionShort>;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }


  interface IScreeningToolScoreRange {
    id: string;
    description: string;
    screeningToolId: string;
    riskAdjustmentType: IRiskAdjustmentTypeOptionsEnum;
    minimumScore: number;
    maximumScore: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    concernSuggestions: Array<IConcern>;
    goalSuggestions: Array<IGoalSuggestionTemplate> | null;
  }


  interface IPatientScreeningToolSubmissionShort {
    id: string;
    progressNoteId: string;
    patientId: string;
    patient: IPatient;
    userId: string;
    user: IUser;
    score: number | null;
    screeningToolId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    scoredAt: string | null;
    screeningToolScoreRangeId: string | null;
  }


  interface IRiskAreaGroupForPatient {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    title: string;
    shortTitle: string;
    order: number;
    mediumRiskThreshold: number;
    highRiskThreshold: number;
    riskAreas: Array<IRiskAreaForPatient>;
  }


  interface IRiskAreaForPatient {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    title: string;
    assessmentType: IAssessmentTypeEnum;
    riskAreaGroupId: string;
    order: number;
    mediumRiskThreshold: number;
    highRiskThreshold: number;
    questions: Array<IQuestionWithPatientAnswer>;
    riskAreaAssessmentSubmissions: Array<IRiskAreaAssessmentSubmission>;
    screeningTools: Array<IScreeningToolForPatient>;
  }

  /**
    Question with patient answer
  */
  interface IQuestionWithPatientAnswer {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    title: string;
    validatedSource: string | null;
    answers: Array<IAnswerWithPatientAnswer>;
    answerType: IAnswerTypeOptionsEnum;
    riskAreaId: string | null;
    screeningToolId: string | null;
    progressNoteTemplateId: string | null;
    applicableIfQuestionConditions: Array<IQuestionCondition>;
    applicableIfType: IQuestionConditionTypeOptionsEnum | null;
    order: number;
    computedFieldId: string | null;
    computedField: IComputedField | null;
    otherTextAnswerId: string | null;
  }

  /**
    Answer with Patient answer
  */
  interface IAnswerWithPatientAnswer {
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
    riskAreaId: string | null;
    screeningToolId: string | null;
    patientAnswers: Array<IPatientAnswer>;
  }

  /**
    PatientAnswer
  */
  interface IPatientAnswer {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    answer: IAnswer;
    answerId: string;
    answerValue: string;
    patientId: string;
    applicable: boolean | null;
    questionId: string | null;
    question: IQuestion | null;
    patientScreeningToolSubmissionId: string | null;
    patientScreeningToolSubmission: IPatientScreeningToolSubmission | null;
    riskAreaAssessmentSubmissionId: string | null;
    riskAreaAssessmentSubmission: IRiskAreaAssessmentSubmission | null;
  }


  interface IPatientScreeningToolSubmission {
    id: string;
    progressNoteId: string;
    patientId: string;
    patient: IPatient;
    userId: string;
    user: IUser;
    score: number | null;
    screeningToolId: string;
    screeningTool: IScreeningTool;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    scoredAt: string | null;
    carePlanSuggestions: Array<ICarePlanSuggestion>;
    screeningToolScoreRangeId: string | null;
    screeningToolScoreRange: IScreeningToolScoreRangeForPatientScreeningToolSubmission | null;
    patientAnswers: Array<IPatientAnswer>;
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
    riskAreaAssessmentSubmissionId: string | null;
    riskAreaAssessmentSubmission: IRiskAreaAssessmentSubmission | null;
  }


  type ICarePlanSuggestionTypeEnum = 'concern' | 'goal';


  interface IRiskAreaAssessmentSubmission {
    id: string;
    riskAreaId: string;
    patientId: string;
    patient: IPatient;
    userId: string;
    user: IUser;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    completedAt: string | null;
    carePlanSuggestions: Array<ICarePlanSuggestion>;
  }


  interface IScreeningToolScoreRangeForPatientScreeningToolSubmission {
    id: string;
    description: string;
    riskAdjustmentType: IRiskAdjustmentTypeOptionsEnum;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }


  interface IScreeningToolForPatient {
    id: string;
    title: string;
    patientScreeningToolSubmissions: Array<IPatientScreeningToolSubmission>;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }


  type IQuestionFilterTypeEnum = 'progressNoteTemplate' | 'riskArea' | 'screeningTool';


  type IAnswerFilterTypeEnum = 'question' | 'progressNote' | 'riskArea' | 'screeningTool' | 'patientScreeningToolSubmission' | 'riskAreaAssessmentSubmission';


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
    Event Notification edges
  */
  interface IEventNotificationEdges {
    edges: Array<IEventNotificationNode>;
    pageInfo: IPageInfo;
  }

  /**
    Event Notification node
  */
  interface IEventNotificationNode {
    node: IEventNotification | null;
    cursor: string;
  }

  /**
    Event Notification
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
    Task Event
  */
  interface ITaskEvent {
    id: string;
    taskId: string;
    task: ITask;
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


  type ITaskEventTypesEnum = 'create_task' | 'add_follower' | 'remove_follower' | 'complete_task' | 'uncomplete_task' | 'delete_task' | 'add_comment' | 'edit_comment' | 'delete_comment' | 'edit_priority' | 'edit_due_date' | 'edit_assignee' | 'edit_title' | 'edit_description' | 'cbo_referral_edit_sent_at' | 'cbo_referral_edit_acknowledged_at';


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
    memberConcern: string | null;
    completedAt: string | null;
    startedAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    supervisorId: string | null;
    supervisor: IUser | null;
    needsSupervisorReview: boolean | null;
    reviewedBySupervisorAt: string | null;
    supervisorNotes: string | null;
  }


  interface IProgressNoteTemplate {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
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
    patientScreeningToolSubmissions: Array<IPatientScreeningToolSubmission>;
  }

  /**
    Patient Answer Event
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
    Care Plan Update Event
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


  type IComputedFieldOrderOptionsEnum = 'labelDesc' | 'labelAsc' | 'slugDesc' | 'slugAsc';


  interface IComputedFieldsSchema {
    computedFields: Array<IComputedFieldSchema>;
  }


  interface IComputedFieldSchema {
    slug: string;
    dataType: IComputedFieldDataTypesEnum;
    values: Array<string>;
  }


  interface IPatientList {
    id: string;
    title: string;
    answerId: string;
    order: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  /**
    Patient Glass Break
  */
  interface IPatientGlassBreak {
    id: string;
    userId: string;
    patientId: string;
    reason: string;
    note: string | null;
  }

  /**
    Progress Note Glass Break
  */
  interface IProgressNoteGlassBreak {
    id: string;
    userId: string;
    progressNoteId: string;
    reason: string;
    note: string | null;
  }


  interface IRootMutationType {
    /**
    Create a new user
  */
    userCreate: IUser | null;
    /**
    Login user
  */
    userLogin: IUserWithAuthToken | null;
    /**
    Edit user - role
  */
    userEditRole: IUser | null;
    /**
    Edit user - permissions
  */
    userEditPermissions: IUser | null;
    /**
    Delete user
  */
    userDelete: IUser | null;
    /**
    Edit current user
  */
    currentUserEdit: IUser | null;
    /**
    Create a new clinic
  */
    clinicCreate: IClinic | null;
    /**
    Add user to careTeam
  */
    careTeamAddUser: Array<IUser> | null;
    /**
    Remove user from careTeam
  */
    careTeamRemoveUser: Array<IUser> | null;
    /**
    Add multiple patients to careTeam
  */
    careTeamAssignPatients: IUserWithCount | null;
    /**
    Create an address for a Patient
  */
    addressCreateForPatient: IAddress | null;
    /**
    Create an primary address for a Patient
  */
    addressCreatePrimaryForPatient: IAddress | null;
    /**
    Edit an address
  */
    addressEdit: IAddress | null;
    /**
    Edit fields on patient stored in the db
  */
    patientEdit: IPatient | null;
    /**
    mark core identity verified on patient stored in the db
  */
    patientCoreIdentityVerify: IPatient | null;
    /**
    Edit fields on patient info stored in the db
  */
    patientInfoEdit: IPatientInfo | null;
    /**
    Edit a patient scratch pad
  */
    patientScratchPadEdit: IPatientScratchPad | null;
    /**
    Create a task
  */
    taskCreate: ITask | null;
    /**
    Delete a task
  */
    taskDelete: ITask | null;
    /**
    Edit a task
  */
    taskEdit: ITask | null;
    /**
    Complete a task
  */
    taskComplete: ITask | null;
    /**
    Uncomplete a task
  */
    taskUncomplete: ITask | null;
    /**
    Add user to task followers
  */
    taskUserFollow: ITask | null;
    /**
    Remove user from task followers
  */
    taskUserUnfollow: ITask | null;
    /**
    Create a task
  */
    taskCommentCreate: ITaskComment | null;
    /**
    Edit a task
  */
    taskCommentEdit: ITaskComment | null;
    /**
    Delete a task
  */
    taskCommentDelete: ITaskComment | null;
    /**
    Create a RiskAreaGroup
  */
    riskAreaGroupCreate: IRiskAreaGroup | null;
    /**
    Edit a RiskAreaGroup
  */
    riskAreaGroupEdit: IRiskAreaGroup | null;
    /**
    Delete a RiskAreaGroup
  */
    riskAreaGroupDelete: IRiskAreaGroup | null;
    /**
    Create a RiskArea
  */
    riskAreaCreate: IRiskArea | null;
    /**
    Edit a RiskArea
  */
    riskAreaEdit: IRiskArea | null;
    /**
    Deletes a RiskArea
  */
    riskAreaDelete: IRiskArea | null;
    /**
    Create a Question
  */
    questionCreate: IQuestion | null;
    /**
    Edit a Question
  */
    questionEdit: IQuestion | null;
    /**
    Delete a question
  */
    questionDelete: IQuestion | null;
    /**
    Create an Answer
  */
    answerCreate: IAnswer | null;
    /**
    Edit an Answer
  */
    answerEdit: IAnswer | null;
    /**
    Deletes an Answer
  */
    answerDelete: IAnswer | null;
    /**
    Create a patient answer
  */
    patientAnswersCreate: Array<IPatientAnswer> | null;
    /**
    Edit a patient answer
  */
    patientAnswerEdit: IPatientAnswer | null;
    /**
    Deletes a patient Answer
  */
    patientAnswerDelete: IPatientAnswer | null;
    /**
    Create a QuestionCondition
  */
    questionConditionCreate: IQuestionCondition | null;
    /**
    Edit a QuestionCondition
  */
    questionConditionEdit: IQuestionCondition | null;
    /**
    Deletes a QuestionCondition
  */
    questionConditionDelete: IQuestionCondition | null;
    /**
    Dismisses (marks as seen) an EventNotification
  */
    eventNotificationDismiss: IEventNotification | null;
    /**
    Dismisses (marks as seen) all of the EventNotifications on a Task for a the current user
  */
    eventNotificationsForTaskDismiss: Array<IEventNotification> | null;
    /**
    Create a concern
  */
    concernCreate: IConcern | null;
    /**
    Edit a concern
  */
    concernEdit: IConcern | null;
    /**
    Deletes a concern
  */
    concernDelete: IConcern | null;
    /**
    Add a diagnosis code to a concern
  */
    concernAddDiagnosisCode: IConcern | null;
    /**
    Remove a diagnosis code from a concern
  */
    concernRemoveDiagnosisCode: IConcern | null;
    /**
    suggest a concern for an answer
  */
    concernSuggestionCreate: Array<IConcern> | null;
    /**
    delete suggestion a concern for an answer
  */
    concernSuggestionDelete: Array<IConcern> | null;
    /**
    goal suggestion template create
  */
    goalSuggestionTemplateCreate: IGoalSuggestionTemplate | null;
    /**
    Edit a goal suggestion template
  */
    goalSuggestionTemplateEdit: IGoalSuggestionTemplate | null;
    /**
    Deletes a goal suggestion template
  */
    goalSuggestionTemplateDelete: IGoalSuggestionTemplate | null;
    /**
    Suggest a goal suggestion template for an answer
  */
    goalSuggestionCreate: Array<IGoalSuggestionTemplate> | null;
    /**
    unsuggest a goal suggestion template for an answer
  */
    goalSuggestionDelete: Array<IGoalSuggestionTemplate> | null;
    /**
    task template create
  */
    taskTemplateCreate: ITaskTemplate | null;
    /**
    Edit a task template
  */
    taskTemplateEdit: ITaskTemplate | null;
    /**
    Deletes a task template
  */
    taskTemplateDelete: ITaskTemplate | null;
    /**
    Suggest a task template for an answer
  */
    taskSuggestionCreate: Array<ITaskTemplate> | null;
    /**
    unsuggest a task template for an answer
  */
    taskSuggestionDelete: Array<ITaskTemplate> | null;
    /**
    patient task suggestion accept
  */
    patientTaskSuggestionAccept: IPatientTaskSuggestion | null;
    /**
    patient task suggestion dismiss
  */
    patientTaskSuggestionDismiss: IPatientTaskSuggestion | null;
    /**
    patient goal create
  */
    patientGoalCreate: IPatientGoal | null;
    /**
    patient goal edit
  */
    patientGoalEdit: IPatientGoal | null;
    /**
    patient goal delete
  */
    patientGoalDelete: IPatientGoal | null;
    /**
    patient concern create
  */
    patientConcernCreate: IPatientConcern | null;
    /**
    patient concern edit
  */
    patientConcernEdit: IPatientConcern | null;
    /**
    patient concern bulk edit
  */
    patientConcernBulkEdit: Array<IPatientConcern> | null;
    /**
    patient concern delete
  */
    patientConcernDelete: IPatientConcern | null;
    /**
    care plan suggestion accept
  */
    carePlanSuggestionAccept: ICarePlanSuggestion | null;
    /**
    care plan suggestion dismiss
  */
    carePlanSuggestionDismiss: ICarePlanSuggestion | null;
    /**
    screening tool create
  */
    screeningToolCreate: IScreeningTool | null;
    /**
    screening tool edit
  */
    screeningToolEdit: IScreeningTool | null;
    /**
    screening tool delete
  */
    screeningToolDelete: IScreeningTool | null;
    /**
    screening tool score range create
  */
    screeningToolScoreRangeCreate: IScreeningToolScoreRange | null;
    /**
    screening tool score range edit
  */
    screeningToolScoreRangeEdit: IScreeningToolScoreRange | null;
    /**
    screening tool score range delete
  */
    screeningToolScoreRangeDelete: IScreeningToolScoreRange | null;
    /**
    patient screening tool submission create
  */
    patientScreeningToolSubmissionCreate: IPatientScreeningToolSubmission | null;
    /**
    patient screening tool submission score
  */
    patientScreeningToolSubmissionScore: IPatientScreeningToolSubmission | null;
    /**
    create a progress note template
  */
    progressNoteTemplateCreate: IProgressNoteTemplate | null;
    /**
    edits a progress note template
  */
    progressNoteTemplateEdit: IProgressNoteTemplate | null;
    /**
    deletes a progress note template
  */
    progressNoteTemplateDelete: IProgressNoteTemplate | null;
    /**
    creates a progress note
  */
    progressNoteCreate: IProgressNote | null;
    /**
    completes a progress note
  */
    progressNoteComplete: IProgressNote | null;
    /**
    edits a progress note
  */
    progressNoteEdit: IProgressNote | null;
    /**
    add or edit supervisor notes
  */
    progressNoteAddSupervisorNotes: IProgressNote | null;
    /**
    closes out supervisor review
  */
    progressNoteCompleteSupervisorReview: IProgressNote | null;
    /**
    creates a quick call
  */
    quickCallCreate: IQuickCall | null;
    /**
    Create a computed field
  */
    computedFieldCreate: IComputedField | null;
    /**
    Delete a computed field
  */
    computedFieldDelete: IComputedField | null;
    /**
    risk area assessment submission create
  */
    riskAreaAssessmentSubmissionCreate: IRiskAreaAssessmentSubmission | null;
    /**
    risk area assessment submission complete
  */
    riskAreaAssessmentSubmissionComplete: IRiskAreaAssessmentSubmission | null;
    computedFieldFlagCreate: IComputedFieldFlag | null;
    /**
    Create a PatientList
  */
    patientListCreate: IPatientList | null;
    /**
    Edit a PatientList
  */
    patientListEdit: IPatientList | null;
    /**
    Delete a PatientList
  */
    patientListDelete: IPatientList | null;
    /**
    Create a CBO
  */
    CBOCreate: ICBO | null;
    /**
    Edit a CBO
  */
    CBOEdit: ICBO | null;
    /**
    Delete a CBO
  */
    CBODelete: ICBO | null;
    /**
    Create a CBO Referral
  */
    CBOReferralCreate: ICBOReferral | null;
    /**
    Edit a CBO Referral
  */
    CBOReferralEdit: ICBOReferral | null;
    /**
    Jwt token to view a PDF
  */
    JWTForPDFCreate: IJWTForPDF;
    /**
    creates a patient data flag
  */
    patientDataFlagCreate: IPatientDataFlag | null;
    /**
    creates a patient glass break
  */
    patientGlassBreakCreate: IPatientGlassBreak | null;
    /**
    creates a progress note glass break
  */
    progressNoteGlassBreakCreate: IProgressNoteGlassBreak | null;
  }

  /**
    params for creating a user
  */
  interface IUserCreateInput {
    email: string;
    homeClinicId: string;
  }

  /**
    params for logging in a user
  */
  interface IUserLoginInput {
    googleAuthCode: string;
  }

  /**
    The user account with an optional auth token
  */
  interface IUserWithAuthToken {
    user: IUser;
    /**
    The auth token to allow for quick login. JWT passed back in via headers for further requests
  */
    authToken: string | null;
  }

  /**
    params for editing a user - only supports user role
  */
  interface IUserEditRoleInput {
    userRole: string;
    email: string;
  }

  /**
    params for editing a user - only supports permissions
  */
  interface IUserEditPermissionsInput {
    permissions: IPermissionsEnum;
    email: string;
  }

  /**
    params for deleting a user
  */
  interface IUserDeleteInput {
    email: string;
  }

  /**
    params for editing a current user
  */
  interface ICurrentUserEditInput {
    locale: string | null;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
  }

  /**
    params for creating a clinic
  */
  interface IClinicCreateInput {
    departmentId: number;
    name: string;
  }

  /**
    params for adding or removing patient from care team
  */
  interface ICareTeamInput {
    userId: string;
    patientId: string;
  }

  /**
    params for adding multiple patients to a user's care team
  */
  interface ICareTeamAssignInput {
    userId: string;
    patientIds: Array<string>;
  }


  interface IUserWithCount {
    id: string;
    firstName: string | null;
    lastName: string | null;
    patientCount: number | null;
  }

  /**
    params for creating and address for a patient in the db
  */
  interface IAddressCreateForPatientInput {
    patientId: string;
    zip: string | null;
    street: string | null;
    state: string | null;
    city: string | null;
    description: string | null;
  }

  /**
    params for creating and address for a patient in the db
  */
  interface IAddressCreatePrimaryForPatientInput {
    patientInfoId: string;
    zip: string | null;
    street: string | null;
    state: string | null;
    city: string | null;
    description: string | null;
  }

  /**
    Editable fields on an address
  */
  interface IAddressEditInput {
    addressId: string;
    patientId: string;
    zip: string | null;
    street: string | null;
    state: string | null;
    city: string | null;
    description: string | null;
  }

  /**
    params for editing a patient in the db
  */
  interface IPatientEditInput {
    patientId: string;
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    dateOfBirth: string | null;
    consentToCall: boolean | null;
    consentToText: boolean | null;
  }

  /**
    params for editing a patient in the db
  */
  interface IPatientCoreIdentityVerifyInput {
    patientId: string;
  }

  /**
    params for editing a patient in the db
  */
  interface IPatientInfoEditInput {
    patientInfoId: string;
    gender: string | null;
    language: string | null;
    primaryAddressId: string | null;
  }

  /**
    params for editing a patient scratch pad
  */
  interface IPatientScratchPadEditInput {
    patientId: string;
    text: string;
  }

  /**
    params for creating a task
  */
  interface ITaskCreateInput {
    title: string;
    description: string | null;
    dueAt: string | null;
    patientId: string;
    assignedToId: string | null;
    patientGoalId: string | null;
    priority: IPriorityEnum | null;
    CBOReferralId: string | null;
  }

  /**
    params for deleting a task
  */
  interface ITaskDeleteInput {
    taskId: string;
  }

  /**
    params for creating a task
  */
  interface ITaskEditInput {
    taskId: string;
    title: string | null;
    description: string | null;
    dueAt: string | null;
    assignedToId: string | null;
    priority: IPriorityEnum | null;
    patientGoalId: string | null;
  }

  /**
    params for completing a task
  */
  interface ITaskCompleteInput {
    taskId: string;
  }

  /**
    params for adding user to a task's followers
  */
  interface ITaskFollowInput {
    userId: string;
    taskId: string;
  }

  /**
    params for creating a task comment
  */
  interface ITaskCommentCreateInput {
    taskId: string;
    body: string;
  }

  /**
    params for editing a task comment
  */
  interface ITaskCommentEditInput {
    taskCommentId: string;
    body: string;
  }

  /**
    params for deleting a task comment
  */
  interface ITaskCommentDeleteInput {
    taskCommentId: string;
  }

  /**
    params for creating a risk area group
  */
  interface IRiskAreaGroupCreateInput {
    title: string;
    shortTitle: string;
    order: number;
    mediumRiskThreshold: number;
    highRiskThreshold: number;
  }

  /**
    params for editing a risk area group
  */
  interface IRiskAreaGroupEditInput {
    riskAreaGroupId: string;
    title: string | null;
    shortTitle: string | null;
    order: number | null;
    mediumRiskThreshold: number | null;
    highRiskThreshold: number | null;
  }

  /**
    params for deleting a risk area group
  */
  interface IRiskAreaGroupDeleteInput {
    riskAreaGroupId: string;
  }


  interface IRiskAreaCreateInput {
    title: string;
    assessmentType: IAssessmentTypeEnum;
    riskAreaGroupId: string;
    order: number;
    mediumRiskThreshold: number;
    highRiskThreshold: number;
  }


  interface IRiskAreaEditInput {
    riskAreaId: string;
    title: string | null;
    order: number | null;
    mediumRiskThreshold: number | null;
    highRiskThreshold: number | null;
  }


  interface IRiskAreaDeleteInput {
    riskAreaId: string;
  }


  interface IQuestionCreateInput {
    title: string;
    answerType: IAnswerTypeOptionsEnum;
    validatedSource: string | null;
    riskAreaId: string | null;
    screeningToolId: string | null;
    progressNoteTemplateId: string | null;
    order: number;
    applicableIfType: IQuestionConditionTypeOptionsEnum | null;
    computedFieldId: string | null;
    hasOtherTextAnswer: boolean | null;
  }


  interface IQuestionEditInput {
    questionId: string;
    title: string | null;
    answerType: IAnswerTypeOptionsEnum | null;
    validatedSource: string | null;
    order: number | null;
    applicableIfType: IQuestionConditionTypeOptionsEnum | null;
    hasOtherTextAnswer: boolean | null;
  }


  interface IQuestionDeleteInput {
    questionId: string;
  }


  interface IAnswerCreateInput {
    displayValue: string;
    value: string;
    valueType: IAnswerValueTypeOptionsEnum;
    riskAdjustmentType: IRiskAdjustmentTypeOptionsEnum | null;
    inSummary: boolean | null;
    summaryText: string | null;
    questionId: string;
    order: number;
  }


  interface IAnswerEditInput {
    displayValue: string | null;
    value: string | null;
    valueType: IAnswerValueTypeOptionsEnum | null;
    riskAdjustmentType: IRiskAdjustmentTypeOptionsEnum | null;
    inSummary: boolean | null;
    summaryText: string | null;
    order: number | null;
    answerId: string;
  }


  interface IAnswerDeleteInput {
    answerId: string;
  }


  interface IPatientAnswersCreateInput {
    patientId: string;
    patientAnswers: Array<IPatientAnswerInput>;
    questionIds: Array<string>;
    patientScreeningToolSubmissionId: string | null;
    riskAreaAssessmentSubmissionId: string | null;
    progressNoteId: string | null;
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


  interface IQuestionConditionCreateInput {
    questionId: string;
    answerId: string;
  }

  /**
    QuestionCondition edit input - for validation, need to edit question and answer at the same time
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
    EventNotification edit input
  */
  interface IEventNotificationEditInput {
    eventNotificationId: string;
  }


  interface IUserTaskNotificationsEditInput {
    taskId: string;
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


  interface IConcernAddDiagnosisCodeInput {
    concernId: string;
    codesetName: string;
    code: string;
    version: string;
  }


  interface IConcernRemoveDiagnosisCodeInput {
    concernId: string;
    diagnosisCodeId: string;
  }


  interface IConcernSuggestInput {
    concernId: string;
    answerId: string | null;
    screeningToolScoreRangeId: string | null;
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
    answerId: string | null;
    screeningToolScoreRangeId: string | null;
    goalSuggestionTemplateId: string;
  }


  interface ITaskTemplateCreateInput {
    title: string;
    completedWithinNumber: number | null;
    completedWithinInterval: string | null;
    repeating: boolean | null;
    goalSuggestionTemplateId: string;
    priority: IPriorityEnum | null;
    careTeamAssigneeRole: string | null;
    CBOCategoryId: string | null;
  }


  interface ITaskTemplateEditInput {
    title: string;
    completedWithinNumber: number | null;
    completedWithinInterval: string | null;
    repeating: boolean | null;
    goalSuggestionTemplateId: string | null;
    priority: IPriorityEnum | null;
    careTeamAssigneeRole: string | null;
    CBOCategoryId: string | null;
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
    title: string | null;
    patientId: string;
    patientConcernId: string | null;
    goalSuggestionTemplateId: string | null;
    taskTemplateIds: Array<string> | null;
    concernId: string | null;
    concernTitle: string | null;
    startedAt: string | null;
  }


  interface IPatientGoalEditInput {
    patientGoalId: string;
    title: string;
    patientConcernId: string | null;
    goalSuggestionTemplateId: string | null;
  }


  interface IPatientGoalDeleteInput {
    patientGoalId: string;
  }


  interface IPatientConcernCreateInput {
    concernId: string;
    patientId: string;
    startedAt: string | null;
    completedAt: string | null;
  }


  interface IPatientConcernEditInput {
    order: number | null;
    concernId: string | null;
    patientId: string | null;
    startedAt: string | null;
    completedAt: string | null;
    patientConcernId: string;
  }


  interface IPatientConcernBulkEditInput {
    patientConcerns: Array<IPatientConcernBulkEditFields>;
    patientId: string;
  }


  interface IPatientConcernBulkEditFields {
    id: string;
    order: number | null;
    startedAt: string | null;
    completedAt: string | null;
  }


  interface IPatientConcernDeleteInput {
    patientConcernId: string;
  }


  interface ICarePlanSuggestionAcceptInput {
    carePlanSuggestionId: string;
    patientConcernId: string | null;
    concernId: string | null;
    startedAt: string | null;
    taskTemplateIds: Array<string> | null;
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
    title: string | null;
    riskAreaId: string | null;
  }


  interface IScreeningToolDeleteInput {
    screeningToolId: string;
  }


  interface IScreeningToolScoreRangeCreateInput {
    screeningToolId: string;
    description: string;
    minimumScore: number;
    maximumScore: number;
    riskAdjustmentType: IRiskAdjustmentTypeOptionsEnum;
  }


  interface IScreeningToolScoreRangeEditInput {
    screeningToolScoreRangeId: string;
    description: string | null;
    screeningToolId: string | null;
    minimumScore: number | null;
    maximumScore: number | null;
    deletedAt: string | null;
    riskAdjustmentType: IRiskAdjustmentTypeOptionsEnum | null;
  }


  interface IScreeningToolScoreRangeDeleteInput {
    screeningToolScoreRangeId: string;
  }


  interface IPatientScreeningToolSubmissionCreateInput {
    screeningToolId: string;
    patientId: string;
  }


  interface IPatientScreeningToolSubmissionScoreInput {
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
    progressNoteTemplateId: string | null;
    startedAt: string | null;
    location: string | null;
    summary: string | null;
    memberConcern: string | null;
    supervisorId: string | null;
    needsSupervisorReview: boolean | null;
  }


  interface IProgressNoteAddSupervisorNotesInput {
    progressNoteId: string;
    supervisorNotes: string;
  }


  interface IProgressNoteCompleteSupervisorReviewInput {
    progressNoteId: string;
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


  interface IRiskAreaAssessmentSubmissionCreateInput {
    riskAreaId: string;
    patientId: string;
  }


  interface IRiskAreaAssessmentSubmissionCompleteInput {
    riskAreaAssessmentSubmissionId: string;
  }

  /**
    params for creating a computed field flag
  */
  interface IComputedFieldFlagCreateInput {
    patientAnswerId: string;
    reason: string | null;
  }


  interface IComputedFieldFlag {
    id: string;
    patientAnswerId: string;
    userId: string;
    reason: string | null;
  }

  /**
    params for creating a patient list
  */
  interface IPatientListCreateInput {
    title: string;
    answerId: string;
    order: number;
  }

  /**
    params for editing a patient list
  */
  interface IPatientListEditInput {
    patientListId: string;
    title: string | null;
    answerId: string | null;
    order: number | null;
  }

  /**
    params for deleting a patient list
  */
  interface IPatientListDeleteInput {
    patientListId: string;
  }

  /**
    params for creating a CBO
  */
  interface ICBOCreateInput {
    name: string;
    categoryId: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    fax: string | null;
    phone: string;
    url: string;
  }

  /**
    params for editing a CBO
  */
  interface ICBOEditInput {
    CBOId: string;
    name: string | null;
    categoryId: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    fax: string | null;
    phone: string | null;
    url: string | null;
  }

  /**
    params for deleting a CBO
  */
  interface ICBODeleteInput {
    CBOId: string;
  }

  /**
    params for creating a CBO referral
  */
  interface ICBOReferralCreateInput {
    categoryId: string;
    CBOId: string | null;
    name: string | null;
    url: string | null;
    diagnosis: string | null;
  }

  /**
    params for editing a CBO referral
  */
  interface ICBOReferralEditInput {
    CBOReferralId: string;
    taskId: string;
    categoryId: string | null;
    CBOId: string | null;
    name: string | null;
    url: string | null;
    diagnosis: string | null;
    sentAt: string | null;
    acknowledgedAt: string | null;
  }

  /**
    JWT token for PDF viewing
  */
  interface IJWTForPDF {
    authToken: string;
  }


  interface IPatientDataFlagCreateInput {
    patientId: string;
    fieldName: ICoreIdentityOptionsEnum;
    suggestedValue: string | null;
    notes: string | null;
  }

  /**
    params for creating a patient glass break
  */
  interface IPatientGlassBreakCreateInput {
    patientId: string;
    reason: string;
    note: string | null;
  }

  /**
    params for creating a progress note glass break
  */
  interface IProgressNoteGlassBreakCreateInput {
    progressNoteId: string;
    reason: string;
    note: string | null;
  }

  /**
    Patient node
  */
  interface IPatientNode {
    node: IPatient | null;
    cursor: string;
  }

  /**
    Patient edges
  */
  interface IPatientEdges {
    edges: Array<IPatientNode>;
    pageInfo: IPageInfo;
  }

  /**
    PatientDiagnosis
  */
  interface IPatientDiagnosis {
    code: string;
    codeSystem: string;
    description: string;
  }


  interface IRiskAreaStatistic {
    riskArea: IRiskArea;
    summaryData: IRiskAreaSummary;
    scoreData: IRiskScore;
  }


  interface IThreeSixtySummary {
    riskAreas: Array<IRiskAreaStatistic>;
  }

  /**
    ConcernDiagnosisCode
  */
  interface IConcernDiagnosisCode {
    id: string;
    concernId: string;
    diagnosisCodeId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }
}
