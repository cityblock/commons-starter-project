declare module 'schema' {
  interface IGraphQLResponseRoot {
    data?: IRootQueryType | IRootMutationType | IRootSubscriptionType;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: Array<IGraphQLResponseErrorLocation>;
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface IRootQueryType {

    /**
     * All Users (admin only)
     */
    users: IUserEdges;

    /**
     * List of all Users with care roles
     */
    userSummaryList: Array<IUserWithCount>;

    /**
     * The current User
     */
    currentUser: IUser | null;

    /**
     * A single Patient
     */
    patient: IPatient;

    /**
     * Users on a care team
     */
    patientCareTeam: Array<ICareTeamUser>;

    /**
     * Patient need to know
     */
    patientNeedToKnow: IPatientNeedToKnow;

    /**
     * Patient search
     */
    patientSearch: IPatientTableRowEdges;

    /**
     * Patients filtered by options
     */
    patientPanel: IPatientTableRowEdges;

    /**
     * Patient dashboard - tasks due and notifications
     */
    patientsWithUrgentTasks: IPatientForDashboardEdges;

    /**
     * Patient dashboard - recent conversations
     */
    patientsWithRecentConversations: IPatientForDashboardEdges;

    /**
     * Patient dashboard - new to user care team
     */
    patientsNewToCareTeam: IPatientForDashboardEdges;

    /**
     * Patient dashboard - pending MAP suggestions
     */
    patientsWithPendingSuggestions: IPatientForDashboardEdges;

    /**
     * Patient dashboard - lacking demographic information
     */
    patientsWithMissingInfo: IPatientForDashboardEdges;

    /**
     * Patient dashboard - no recent engagement
     */
    patientsWithNoRecentEngagement: IPatientForDashboardEdges;

    /**
     * Patient dashboard - out of date MAP
     */
    patientsWithOutOfDateMAP: IPatientForDashboardEdges;

    /**
     * Patient dashboard - open CBO referrals
     */
    patientsWithOpenCBOReferrals: IPatientForDashboardEdges;

    /**
     * Patient dashboard - assigned state
     */
    patientsWithAssignedState: IPatientForDashboardEdges;

    /**
     * Patient dashboard - intake in progress
     */
    patientsWithIntakeInProgress: IPatientForDashboardEdges;

    /**
     * Patient dashboard - computed list for answer
     */
    patientsForComputedList: IPatientForDashboardEdges;

    /**
     * Patient contacts for patient
     */
    patientContacts: Array<IPatientContact>;

    /**
     * Patient contact healthcare proxies
     */
    patientContactHealthcareProxies: Array<IPatientContact>;

    /**
     * Patient external providers for patient
     */
    patientExternalProviders: Array<IPatientExternalProvider>;

    /**
     * Patient external organizations for patient
     */
    patientExternalOrganizations: Array<IPatientExternalOrganization>;

    /**
     * Patient documents for patient
     */
    patientDocuments: Array<IPatientDocument>;

    /**
     * Patient documents by type
     */
    patientDocumentsByType: Array<IPatientDocument>;

    /**
     * A single clinic
     */
    clinic: IClinic;

    /**
     * Clinics
     */
    clinics: IClinicEdges;

    /**
     * Task
     */
    task: ITask;

    /**
     * Patient's Tasks
     */
    tasksForPatient: ITaskEdges;

    /**
     * Current user's Tasks
     */
    tasksForCurrentUser: ITaskWithImageEdges;

    /**
     * Tasks due soon for patient - in dashboard
     */
    tasksDueSoonForPatient: Array<ITask>;

    /**
     * Tasks with notifications for patient - in dashboard
     */
    tasksWithNotificationsForPatient: Array<ITask>;

    /**
     * Task IDs with notifications for current user - in care plan MAP and tasks panel
     */
    taskIdsWithNotifications: Array<ITaskId>;

    /**
     * Tasks assigned to or followed by a user for a patient
     */
    tasksForUserForPatient: Array<ITask>;

    /**
     * List of task comments
     */
    taskComments: ITaskCommentEdges;

    /**
     * Single task comment
     */
    taskComment: ITaskComment;

    /**
     * RiskAreaGroup
     */
    riskAreaGroup: IRiskAreaGroup;

    /**
     * Risk Area Group with associated patient answers
     */
    riskAreaGroupForPatient: IRiskAreaGroupForPatient;

    /**
     * RiskAreaGroups
     */
    riskAreaGroups: Array<IRiskAreaGroup>;

    /**
     * RiskAreaGroupsForPatient
     */
    riskAreaGroupsForPatient: Array<IFullRiskAreaGroupForPatient>;

    /**
     * RiskArea
     */
    riskArea: IRiskArea;

    /**
     * RiskAreas
     */
    riskAreas: Array<IRiskArea>;

    /**
     * Question
     */
    question: IQuestion;

    /**
     * Questions for risk area, progress note template or screening tool
     */
    questions: Array<IQuestion>;

    /**
     * Answer
     */
    answer: IAnswer | null;

    /**
     * Answers
     */
    answersForQuestion: Array<IAnswer>;

    /**
     * PatientAnswer
     */
    patientAnswer: IPatientAnswer;

    /**
     * PatientAnswersForQuestion
     */
    patientAnswers: Array<IPatientAnswer>;

    /**
     * PatientPreviousAnswersForQuestion
     */
    patientPreviousAnswersForQuestion: Array<IPatientAnswer>;

    /**
     * PatientRiskAreaSummary
     */
    patientRiskAreaSummary: IRiskAreaSummary;

    /**
     * PatientRiskAreaRiskScore
     */
    patientRiskAreaRiskScore: IRiskScore;

    /**
     * QuestionCondition
     */
    questionCondition: IQuestionCondition;

    /**
     * Event notifications for a user
     */
    eventNotificationsForCurrentUser: IEventNotificationEdges;

    /**
     * Event notifications for a task
     */
    eventNotificationsForTask: IEventNotificationEdges;

    /**
     * Event notifications for a user's task - on dashboard
     */
    eventNotificationsForUserTask: Array<IEventNotification>;

    /**
     * Concern
     */
    concern: IConcern;

    /**
     * Concerns
     */
    concerns: Array<IConcern>;

    /**
     * Concerns for answer
     */
    concernsForAnswer: Array<IConcern>;

    /**
     * patient concern
     */
    patientConcern: IPatientConcern;

    /**
     * patient concerns for patient
     */
    patientConcerns: Array<IPatientConcern>;

    /**
     * Patient goal
     */
    patientGoal: IPatientGoal;

    /**
     * Patient goals for patient
     */
    patientGoals: Array<IPatientGoal>;

    /**
     * Goal suggestion templates
     */
    goalSuggestionTemplate: IGoalSuggestionTemplate;

    /**
     * Goal suggestion templates
     */
    goalSuggestionTemplates: Array<IGoalSuggestionTemplate>;

    /**
     * Goal suggestion for template for answer
     */
    goalSuggestionTemplatesForAnswer: Array<IGoalSuggestionTemplate>;

    /**
     * Task template
     */
    taskTemplate: ITaskTemplate;

    /**
     * Task templates
     */
    taskTemplates: Array<ITaskTemplate>;

    /**
     * Task templates suggested for answer
     */
    taskTemplatesForAnswer: Array<ITaskTemplate>;

    /**
     * Care Plan Suggestions From Risk Area Assessments
     */
    carePlanSuggestionsFromRiskAreaAssessmentsForPatient: Array<
      ICarePlanSuggestion
    >;

    /**
     * Care Plan Suggestions From Screening Tools
     */
    carePlanSuggestionsFromScreeningToolsForPatient: Array<ICarePlanSuggestion>;

    /**
     * Care Plan Suggestions From Computed Fields
     */
    carePlanSuggestionsFromComputedFieldsForPatient: Array<ICarePlanSuggestion>;

    /**
     * Care Plan
     */
    carePlanForPatient: ICarePlan;

    /**
     * screening tool
     */
    screeningTool: IScreeningTool;

    /**
     * screening tools
     */
    screeningTools: Array<IScreeningTool>;

    /**
     * screening tool score range
     */
    screeningToolScoreRange: IScreeningToolScoreRange;

    /**
     * screening tool score range for screening tool and score
     */
    screeningToolScoreRangeForScoreAndScreeningTool: IScreeningToolScoreRange | null;

    /**
     * screening tool score ranges
     */
    screeningToolScoreRanges: Array<IScreeningToolScoreRange>;

    /**
     * screening tool score ranges for screening tool
     */
    screeningToolScoreRangesForScreeningTool: Array<IScreeningToolScoreRange>;

    /**
     * patient screening tool submission
     */
    patientScreeningToolSubmission: IPatientScreeningToolSubmission;

    /**
     * latest patient sreening tool submission for a screening tool
     */
    patientScreeningToolSubmissionForPatientAndScreeningTool: IPatientScreeningToolSubmission | null;

    /**
     * patient screening tool submissions for patient and screening tool (optioanlly)
     */
    patientScreeningToolSubmissionsForPatient: Array<
      IPatientScreeningToolSubmission
    >;

    /**
     * patient screening tool submissions for patient 360 (history tab)
     */
    patientScreeningToolSubmissionsFor360: Array<
      IPatientScreeningToolSubmission
    >;

    /**
     * patient screening tool submissions
     */
    patientScreeningToolSubmissions: Array<IPatientScreeningToolSubmission>;

    /**
     * progress note template
     */
    progressNoteTemplate: IProgressNoteTemplate;

    /**
     * progress note templates
     */
    progressNoteTemplates: Array<IProgressNoteTemplate>;

    /**
     * progress note
     */
    progressNote: IProgressNote;

    /**
     * progress note ids for patient
     */
    progressNoteIdsForPatient: Array<IPatientProgressNoteId>;

    /**
     * progress notes for current user
     */
    progressNotesForCurrentUser: Array<IProgressNote>;

    /**
     * progress notes for supervisor review
     */
    progressNotesForSupervisorReview: Array<IProgressNote>;

    /**
     * progress note activities for progress note
     */
    progressNoteActivityForProgressNote: IProgressNoteActivity;

    /**
     * latest progress note for patient
     */
    progressNoteLatestForPatient: IProgressNote | null;

    /**
     * quick call
     */
    quickCall: IQuickCall;

    /**
     * quick calls for progress note
     */
    quickCallsForProgressNote: Array<IQuickCall>;

    /**
     * computed field
     */
    computedField: IComputedField;

    /**
     * computed fields
     */
    computedFields: Array<IComputedField>;

    /**
     * computed fields schema
     */
    computedFieldsSchema: IComputedFieldsSchema;

    /**
     * risk area assessment submission
     */
    riskAreaAssessmentSubmission: IRiskAreaAssessmentSubmission;

    /**
     * latest risk area assessment submission for a screening tool
     */
    riskAreaAssessmentSubmissionForPatient: IRiskAreaAssessmentSubmission | null;

    /**
     * patient list
     */
    patientList: IPatientList;

    /**
     * all patient lists
     */
    patientLists: Array<IPatientList>;

    /**
     * all CBO categories
     */
    CBOCategories: Array<ICBOCategory>;

    /**
     * CBO
     */
    CBO: ICBO;

    /**
     * all CBOs
     */
    CBOs: Array<ICBO>;

    /**
     * all CBOs for given category
     */
    CBOsForCategory: Array<ICBO>;

    /**
     * patient glass breaks for user during current session
     */
    patientGlassBreaksForUser: Array<IPatientGlassBreak>;

    /**
     * progress note glass breaks for a user during current session
     */
    progressNoteGlassBreaksForUser: Array<IProgressNoteGlassBreak>;

    /**
     * check if don't need to break glass for given patient
     */
    patientGlassBreakCheck: IPatientGlassBreakCheck;

    /**
     * check if don't need to break glass for given progress note
     */
    progressNoteGlassBreakCheck: IProgressNoteGlassBreakCheck;

    /**
     * computed patient status for a patient
     */
    patientComputedPatientStatus: IComputedPatientStatus;

    /**
     * patient consent forms
     */
    patientConsentFormsForPatient: Array<IPatientConsentForm>;

    /**
     * patient advanced directive forms
     */
    patientAdvancedDirectiveFormsForPatient: Array<
      IPatientAdvancedDirectiveForm
    >;

    /**
     * get all emails for a patient
     */
    patientEmails: Array<IEmail>;

    /**
     * get all addresses for a patient
     */
    patientAddresses: Array<IAddress>;

    /**
     * get all phones for a patient
     */
    patientPhones: Array<IPhone>;

    /**
     * gets a patient scratch pad for given user and patient
     */
    patientScratchPad: IPatientScratchPad;

    /**
     * gets a patient problem list
     */
    patientProblemList: Array<IPatientDiagnosis>;

    /**
     * gets patient medications
     */
    patientMedications: Array<IPatientMedication>;

    /**
     * gets patient encounters (external to Commons)
     */
    patientEncounters: Array<IPatientEncounter>;

    /**
     * gets a patients full social security number and records a log of the view by user
     */
    patientSocialSecurity: IPatientSocialSecurity;

    /**
     * Google calendar id and url for the current user
     */
    calendarForCurrentUser: ICalendar;

    /**
     * Google calendar id and url for a patient calendar
     */
    calendarForPatient: IPatientCalendar;

    /**
     * List of google calendar events for a patient
     */
    calendarEventsForPatient: ICalendarEventEdges;

    /**
     * List of google calendar events for the logged in user
     */
    calendarEventsForCurrentUser: ICalendarEventEdges;

    /**
     * SMS messages for given user and patient
     */
    smsMessages: ISmsMessageEdges;

    /**
     * latest SMS message between given user and patient
     */
    smsMessageLatest: ISmsMessage | null;

    /**
     * get user hours for current user
     */
    currentUserHours: Array<IUserHours>;
  }

  interface IUsersOnRootQueryTypeArguments {
    pageNumber?: number | null;
    pageSize?: number | null;
    hasLoggedIn?: boolean | null;
    orderBy?: UserOrderOptions | null;
  }

  interface IUserSummaryListOnRootQueryTypeArguments {
    userRoleFilters: Array<UserRole>;
  }

  interface IPatientOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IPatientCareTeamOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IPatientNeedToKnowOnRootQueryTypeArguments {
    patientInfoId: string;
  }

  interface IPatientSearchOnRootQueryTypeArguments {
    query: string;
    pageNumber: number;
    pageSize: number;
  }

  interface IPatientPanelOnRootQueryTypeArguments {
    pageNumber: number;
    pageSize: number;
    filters: IPatientFilterOptions;
    showAllPatients?: boolean | null;
  }

  interface IPatientsWithUrgentTasksOnRootQueryTypeArguments {
    pageNumber: number;
    pageSize: number;
  }

  interface IPatientsWithRecentConversationsOnRootQueryTypeArguments {
    pageNumber: number;
    pageSize: number;
  }

  interface IPatientsNewToCareTeamOnRootQueryTypeArguments {
    pageNumber: number;
    pageSize: number;
  }

  interface IPatientsWithPendingSuggestionsOnRootQueryTypeArguments {
    pageNumber: number;
    pageSize: number;
  }

  interface IPatientsWithMissingInfoOnRootQueryTypeArguments {
    pageNumber: number;
    pageSize: number;
  }

  interface IPatientsWithNoRecentEngagementOnRootQueryTypeArguments {
    pageNumber: number;
    pageSize: number;
  }

  interface IPatientsWithOutOfDateMAPOnRootQueryTypeArguments {
    pageNumber: number;
    pageSize: number;
  }

  interface IPatientsWithOpenCBOReferralsOnRootQueryTypeArguments {
    pageNumber: number;
    pageSize: number;
  }

  interface IPatientsWithAssignedStateOnRootQueryTypeArguments {
    pageNumber: number;
    pageSize: number;
  }

  interface IPatientsWithIntakeInProgressOnRootQueryTypeArguments {
    pageNumber: number;
    pageSize: number;
  }

  interface IPatientsForComputedListOnRootQueryTypeArguments {
    answerId: string;
    pageNumber: number;
    pageSize: number;
  }

  interface IPatientContactsOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IPatientContactHealthcareProxiesOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IPatientExternalProvidersOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IPatientExternalOrganizationsOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IPatientDocumentsOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IPatientDocumentsByTypeOnRootQueryTypeArguments {
    patientId: string;
    documentType: DocumentTypeOptions;
  }

  interface IClinicOnRootQueryTypeArguments {
    clinicId: string;
  }

  interface IClinicsOnRootQueryTypeArguments {
    pageNumber?: number | null;
    pageSize?: number | null;
  }

  interface ITaskOnRootQueryTypeArguments {
    taskId: string;
  }

  interface ITasksForPatientOnRootQueryTypeArguments {
    patientId: string;
    pageNumber?: number | null;
    pageSize?: number | null;
    orderBy?: TaskOrderOptions | null;
  }

  interface ITasksForCurrentUserOnRootQueryTypeArguments {
    pageNumber?: number | null;
    pageSize?: number | null;
    orderBy?: UserTaskOrderOptions | null;
    isFollowingTasks?: boolean | null;
  }

  interface ITasksDueSoonForPatientOnRootQueryTypeArguments {
    patientId: string;
  }

  interface ITasksWithNotificationsForPatientOnRootQueryTypeArguments {
    patientId: string;
  }

  interface ITasksForUserForPatientOnRootQueryTypeArguments {
    userId: string;
    patientId: string;
  }

  interface ITaskCommentsOnRootQueryTypeArguments {
    pageNumber?: number | null;
    pageSize?: number | null;
    taskId: string;
  }

  interface ITaskCommentOnRootQueryTypeArguments {
    taskCommentId: string;
  }

  interface IRiskAreaGroupOnRootQueryTypeArguments {
    riskAreaGroupId: string;
  }

  interface IRiskAreaGroupForPatientOnRootQueryTypeArguments {
    riskAreaGroupId: string;
    patientId: string;
    glassBreakId?: string | null;
  }

  interface IRiskAreaGroupsForPatientOnRootQueryTypeArguments {
    patientId: string;
    glassBreakId?: string | null;
  }

  interface IRiskAreaOnRootQueryTypeArguments {
    riskAreaId: string;
  }

  interface IQuestionOnRootQueryTypeArguments {
    questionId: string;
  }

  interface IQuestionsOnRootQueryTypeArguments {
    filterId: string;
    filterType: QuestionFilterType;
  }

  interface IAnswerOnRootQueryTypeArguments {
    answerId: string;
  }

  interface IAnswersForQuestionOnRootQueryTypeArguments {
    questionId: string;
  }

  interface IPatientAnswerOnRootQueryTypeArguments {
    patientAnswerId: string;
  }

  interface IPatientAnswersOnRootQueryTypeArguments {
    filterId: string;
    filterType: AnswerFilterType;
    patientId: string;
  }

  interface IPatientPreviousAnswersForQuestionOnRootQueryTypeArguments {
    questionId: string;
    patientId: string;
  }

  interface IPatientRiskAreaSummaryOnRootQueryTypeArguments {
    riskAreaId: string;
    patientId: string;
  }

  interface IPatientRiskAreaRiskScoreOnRootQueryTypeArguments {
    riskAreaId: string;
    patientId: string;
  }

  interface IQuestionConditionOnRootQueryTypeArguments {
    questionConditionId: string;
  }

  interface IEventNotificationsForCurrentUserOnRootQueryTypeArguments {
    pageNumber?: number | null;
    pageSize?: number | null;
    taskEventNotificationsOnly?: boolean | null;
  }

  interface IEventNotificationsForTaskOnRootQueryTypeArguments {
    taskId: string;
    pageNumber?: number | null;
    pageSize?: number | null;
  }

  interface IEventNotificationsForUserTaskOnRootQueryTypeArguments {
    taskId: string;
  }

  interface IConcernOnRootQueryTypeArguments {
    concernId: string;
  }

  interface IConcernsOnRootQueryTypeArguments {
    orderBy?: ConcernOrderOptions | null;
  }

  interface IConcernsForAnswerOnRootQueryTypeArguments {
    answerId: string;
  }

  interface IPatientConcernOnRootQueryTypeArguments {
    patientConcernId: string;
  }

  interface IPatientConcernsOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IPatientGoalOnRootQueryTypeArguments {
    patientGoalId: string;
  }

  interface IPatientGoalsOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IGoalSuggestionTemplateOnRootQueryTypeArguments {
    goalSuggestionTemplateId: string;
  }

  interface IGoalSuggestionTemplatesOnRootQueryTypeArguments {
    orderBy?: GoalSuggestionOrderOptions | null;
  }

  interface IGoalSuggestionTemplatesForAnswerOnRootQueryTypeArguments {
    answerId: string;
  }

  interface ITaskTemplateOnRootQueryTypeArguments {
    taskTemplateId: string;
  }

  interface ITaskTemplatesForAnswerOnRootQueryTypeArguments {
    answerId: string;
  }

  interface ICarePlanSuggestionsFromRiskAreaAssessmentsForPatientOnRootQueryTypeArguments {
    patientId: string;
    glassBreakId?: string | null;
  }

  interface ICarePlanSuggestionsFromScreeningToolsForPatientOnRootQueryTypeArguments {
    patientId: string;
    glassBreakId?: string | null;
  }

  interface ICarePlanSuggestionsFromComputedFieldsForPatientOnRootQueryTypeArguments {
    patientId: string;
    glassBreakId?: string | null;
  }

  interface ICarePlanForPatientOnRootQueryTypeArguments {
    patientId: string;
    glassBreakId?: string | null;
  }

  interface IScreeningToolOnRootQueryTypeArguments {
    screeningToolId: string;
  }

  interface IScreeningToolScoreRangeOnRootQueryTypeArguments {
    screeningToolScoreRangeId: string;
  }

  interface IScreeningToolScoreRangeForScoreAndScreeningToolOnRootQueryTypeArguments {
    screeningToolId: string;
    score: number;
  }

  interface IScreeningToolScoreRangesForScreeningToolOnRootQueryTypeArguments {
    screeningToolId: string;
  }

  interface IPatientScreeningToolSubmissionOnRootQueryTypeArguments {
    patientScreeningToolSubmissionId: string;
  }

  interface IPatientScreeningToolSubmissionForPatientAndScreeningToolOnRootQueryTypeArguments {
    screeningToolId: string;
    patientId: string;
    scored: boolean;
  }

  interface IPatientScreeningToolSubmissionsForPatientOnRootQueryTypeArguments {
    patientId: string;
    screeningToolId?: string | null;
    scored: boolean;
  }

  interface IPatientScreeningToolSubmissionsFor360OnRootQueryTypeArguments {
    patientId: string;
    glassBreakId?: string | null;
  }

  interface IProgressNoteTemplateOnRootQueryTypeArguments {
    progressNoteTemplateId: string;
  }

  interface IProgressNoteOnRootQueryTypeArguments {
    progressNoteId: string;
    glassBreakId?: string | null;
  }

  interface IProgressNoteIdsForPatientOnRootQueryTypeArguments {
    patientId: string;
    completed: boolean;
    glassBreakId?: string | null;
  }

  interface IProgressNotesForCurrentUserOnRootQueryTypeArguments {
    completed: boolean;
  }

  interface IProgressNoteActivityForProgressNoteOnRootQueryTypeArguments {
    progressNoteId: string;
  }

  interface IProgressNoteLatestForPatientOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IQuickCallOnRootQueryTypeArguments {
    quickCallId: string;
  }

  interface IQuickCallsForProgressNoteOnRootQueryTypeArguments {
    progressNoteId: string;
  }

  interface IComputedFieldOnRootQueryTypeArguments {
    computedFieldId: string;
  }

  interface IComputedFieldsOnRootQueryTypeArguments {
    orderBy?: ComputedFieldOrderOptions | null;
  }

  interface IRiskAreaAssessmentSubmissionOnRootQueryTypeArguments {
    riskAreaAssessmentSubmissionId: string;
  }

  interface IRiskAreaAssessmentSubmissionForPatientOnRootQueryTypeArguments {
    riskAreaId: string;
    patientId: string;
    completed: boolean;
  }

  interface IPatientListOnRootQueryTypeArguments {
    patientListId: string;
  }

  interface ICBOOnRootQueryTypeArguments {
    CBOId: string;
  }

  interface ICBOsForCategoryOnRootQueryTypeArguments {
    categoryId: string;
  }

  interface IPatientGlassBreakCheckOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IProgressNoteGlassBreakCheckOnRootQueryTypeArguments {
    progressNoteId: string;
  }

  interface IPatientComputedPatientStatusOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IPatientConsentFormsForPatientOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IPatientAdvancedDirectiveFormsForPatientOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IPatientEmailsOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IPatientAddressesOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IPatientPhonesOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IPatientScratchPadOnRootQueryTypeArguments {
    patientId: string;
    glassBreakId?: string | null;
  }

  interface IPatientProblemListOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IPatientMedicationsOnRootQueryTypeArguments {
    patientId: string;
  }

  interface IPatientEncountersOnRootQueryTypeArguments {
    patientId: string;
    glassBreakId?: string | null;
  }

  interface IPatientSocialSecurityOnRootQueryTypeArguments {
    patientId: string;
    glassBreakId?: string | null;
  }

  interface ICalendarForPatientOnRootQueryTypeArguments {
    patientId: string;
  }

  interface ICalendarEventsForPatientOnRootQueryTypeArguments {
    patientId: string;
    timeMin: string;
    pageSize: number;
    pageToken?: string | null;
  }

  interface ICalendarEventsForCurrentUserOnRootQueryTypeArguments {
    timeMin: string;
    pageSize: number;
    pageToken?: string | null;
  }

  interface ISmsMessagesOnRootQueryTypeArguments {
    patientId: string;
    pageNumber: number;
    pageSize: number;
  }

  interface ISmsMessageLatestOnRootQueryTypeArguments {
    patientId: string;
  }

  enum UserOrderOptions {
    createdAtDesc = 'createdAtDesc',
    createdAtAsc = 'createdAtAsc',
    lastLoginAtDesc = 'lastLoginAtDesc',
    lastLoginAtAsc = 'lastLoginAtAsc',
    updatedAtDesc = 'updatedAtDesc',
    updatedAtAsc = 'updatedAtAsc',
    emailAsc = 'emailAsc'
  }

  /**
   * User edges
   */
  interface IUserEdges {
    edges: Array<IUserNode> | null;
    pageInfo: IPageInfo;
  }

  /**
   * User node
   */
  interface IUserNode {
    node: IUser | null;
    cursor: string;
  }

  /**
   * User account model
   */
  interface IUser {
    id: string;
    locale: string | null;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    userRole: UserRole;
    homeClinicId: string;
    googleProfileImageUrl: string | null;
    createdAt: string;
    updatedAt: string;
    permissions: Permissions;
    twilioSimId: string | null;
    isAvailable: boolean;
    awayMessage: string;
  }

  /**
   * An object with a Globally Unique ID
   */
  type uniqueId =
    | IUser
    | IPatient
    | IPatientInfo
    | IAddress
    | IPhone
    | IEmail
    | IPatientDataFlag
    | IComputedPatientStatus
    | IPatientState
    | ICareTeamUser
    | IPatientTableRow
    | IPatientForDashboard
    | IPatientContact
    | IPatientExternalProvider
    | IPatientExternalOrganization
    | IPatientDocument
    | IClinic
    | ITask
    | IPatientGoalShort
    | IPatientConcern
    | IConcern
    | IDiagnosisCode
    | IPatientGoal
    | IGoalSuggestionTemplate
    | ITaskTemplate
    | ICBOReferral
    | ICBOCategory
    | ICBO
    | ITaskId
    | ITaskComment
    | IRiskAreaGroup
    | IRiskAreaShort
    | IRiskAreaGroupForPatient
    | IRiskAreaForPatient
    | IQuestionWithPatientAnswer
    | IAnswerWithPatientAnswer
    | IPatientAnswer
    | IAnswer
    | IScreeningToolShort
    | IQuestion
    | IQuestionCondition
    | IComputedField
    | IPatientScreeningToolSubmission
    | IScreeningTool
    | IScreeningToolScoreRange
    | IPatientScreeningToolSubmissionShort
    | ICarePlanSuggestion
    | IComputedFieldForSuggestion
    | IScreeningToolScoreRangeForPatientScreeningToolSubmission
    | IRiskAreaAssessmentSubmission
    | IRiskArea
    | IScreeningToolForPatient
    | IFullRiskAreaGroupForPatient
    | IEventNotification
    | ITaskEvent
    | IProgressNote
    | IProgressNoteTemplate
    | IPatientAnswerEvent
    | ICarePlanUpdateEvent
    | IQuickCall
    | IPatientList
    | IPatientGlassBreak
    | IProgressNoteGlassBreak
    | IPatientScratchPad
    | IPatientSocialSecurity
    | ISmsMessage
    | IComputedFieldFlag
    | IConcernDiagnosisCode;

  /**
   * An object with a Globally Unique ID
   */
  interface IUniqueId {

    /**
     * The ID of the object.
     */
    id: string;
  }

  enum UserRole {
    Behavioral_Health_Specialist = 'Behavioral_Health_Specialist',
    Community_Health_Partner = 'Community_Health_Partner',
    Outreach_Specialist = 'Outreach_Specialist',
    Hub_Care_Coordinator = 'Hub_Care_Coordinator',
    Hub_RN = 'Hub_RN',
    Hub_Operations_Manager = 'Hub_Operations_Manager',
    Member_Experience_Advocate = 'Member_Experience_Advocate',
    Primary_Care_Physician = 'Primary_Care_Physician',
    Nurse_Practitioner = 'Nurse_Practitioner',
    Psychiatrist = 'Psychiatrist',
    Nurse_Care_Manager = 'Nurse_Care_Manager',
    Community_Engagement_Manager = 'Community_Engagement_Manager',
    Behavioral_Health_Nurse_Practitioner = 'Behavioral_Health_Nurse_Practitioner',
    Pharmacist = 'Pharmacist',
    Clinical_Operations_Lead = 'Clinical_Operations_Lead',
    Clinical_Operations_Manager = 'Clinical_Operations_Manager',
    Back_Office_Admin = 'Back_Office_Admin'
  }

  enum Permissions {
    green = 'green',
    pink = 'pink',
    orange = 'orange',
    blue = 'blue',
    yellow = 'yellow',
    red = 'red',
    black = 'black'
  }

  /**
   * Page info for paginated responses
   */
  interface IPageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }

  interface IUserWithCount {
    id: string;
    firstName: string | null;
    lastName: string | null;
    userRole: UserRole;
    googleProfileImageUrl: string | null;
    patientCount: number | null;
    email: string | null;
  }

  /**
   * Patient combining data in athena and our database
   */
  interface IPatient {
    id: string;
    patientInfo: IPatientInfo;
    firstName: string;
    middleName: string | null;
    lastName: string;
    dateOfBirth: string | null;
    ssnEnd: string | null;
    nmi: string | null;
    mrn: string | null;
    cityblockId: number;
    homeClinicId: string | null;
    createdAt: string;
    careTeam: Array<IUser>;
    patientDataFlags: Array<IPatientDataFlag>;
    computedPatientStatus: IComputedPatientStatus;
    patientState: IPatientState;
    coreIdentityVerifiedAt: string | null;
    coreIdentityVerifiedById: string | null;
    productDescription: string | null;
    lineOfBusiness: string | null;
    medicaidPremiumGroup: string | null;
    pcpName: string | null;
    pcpPractice: string | null;
    pcpPhone: string | null;
    pcpAddress: string | null;
    memberId: string;
    insurance: string | null;
    inNetwork: boolean;
  }

  /**
   * Patient info that is editable in Commons
   */
  interface IPatientInfo {
    id: string;
    patientId: string;
    preferredName: string | null;
    gender: Gender | null;
    genderFreeText: string | null;
    transgender: Transgender | null;
    maritalStatus: MaritalStatus | null;
    language: string | null;
    isMarginallyHoused: boolean | null;
    primaryAddress: IAddress | null;
    primaryPhone: IPhone | null;
    hasEmail: boolean | null;
    primaryEmail: IEmail | null;
    preferredContactMethod: ContactMethodOptions | null;
    preferredContactTime: ContactTimeOptions | null;
    canReceiveCalls: boolean | null;
    hasHealthcareProxy: boolean | null;
    hasMolst: boolean | null;
    hasDeclinedPhotoUpload: boolean | null;
    hasUploadedPhoto: boolean | null;
    needToKnow: string | null;
    googleCalendarId: string | null;
    isWhite: boolean | null;
    isBlack: boolean | null;
    isAmericanIndianAlaskan: boolean | null;
    isAsian: boolean | null;
    isHawaiianPacific: boolean | null;
    isOtherRace: boolean | null;
    isHispanic: boolean | null;
    raceFreeText: string | null;
  }

  enum Gender {
    male = 'male',
    female = 'female',
    nonbinary = 'nonbinary',
    selfDescribed = 'selfDescribed',
    pass = 'pass'
  }

  enum Transgender {
    yes = 'yes',
    no = 'no',
    pass = 'pass'
  }

  enum MaritalStatus {
    currentlyMarried = 'currentlyMarried',
    widowed = 'widowed',
    divorced = 'divorced',
    separated = 'separated',
    neverMarried = 'neverMarried'
  }

  /**
   * Address
   */
  interface IAddress {
    id: string;
    zip: string | null;
    street1: string | null;
    street2: string | null;
    state: string | null;
    city: string | null;
    description: string | null;
  }

  /**
   * Phone
   */
  interface IPhone {
    id: string;
    phoneNumber: string;
    type: PhoneTypeOptions;
    description: string | null;
  }

  enum PhoneTypeOptions {
    home = 'home',
    work = 'work',
    mobile = 'mobile',
    other = 'other'
  }

  /**
   * Email
   */
  interface IEmail {
    id: string;
    emailAddress: string;
    description: string | null;
  }

  enum ContactMethodOptions {
    phone = 'phone',
    text = 'text',
    email = 'email'
  }

  enum ContactTimeOptions {
    morning = 'morning',
    afternoon = 'afternoon',
    evening = 'evening'
  }

  /**
   * Patient Data Flag
   */
  interface IPatientDataFlag {
    id: string;
    patientId: string;
    userId: string;
    fieldName: DataFlagOptions;
    suggestedValue: string | null;
    notes: string | null;
    updatedAt: string | null;
  }

  enum DataFlagOptions {
    firstName = 'firstName',
    middleName = 'middleName',
    lastName = 'lastName',
    dateOfBirth = 'dateOfBirth',
    cityblockId = 'cityblockId',
    ssn = 'ssn',
    nmi = 'nmi',
    mrn = 'mrn',
    productDescription = 'productDescription',
    lineOfBusiness = 'lineOfBusiness',
    medicaidPremiumGroup = 'medicaidPremiumGroup',
    pcpName = 'pcpName',
    pcpAddress = 'pcpAddress',
    pcpPractice = 'pcpPractice',
    pcpPhone = 'pcpPhone'
  }

  /**
   * ComputedPatientStatus
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
   * PatientState
   */
  interface IPatientState {
    id: string;
    patientId: string;
    updatedById: string;
    currentState: CurrentPatientState;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  enum CurrentPatientState {
    attributed = 'attributed',
    assigned = 'assigned',
    outreach = 'outreach',
    consented = 'consented',
    enrolled = 'enrolled',
    disenrolled = 'disenrolled',
    ineligible = 'ineligible'
  }

  interface ICareTeamUser {
    id: string;
    locale: string | null;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    userRole: UserRole;
    homeClinicId: string;
    googleProfileImageUrl: string | null;
    createdAt: string;
    updatedAt: string;
    permissions: Permissions;
    isCareTeamLead: boolean;
    twilioSimId: string | null;
  }

  /**
   * Patient Scratch Pad
   */
  interface IPatientNeedToKnow {
    text: string | null;
  }

  /**
   * Patient table row edges
   */
  interface IPatientTableRowEdges {
    edges: Array<IPatientTableRowNode>;
    pageInfo: IPageInfo;
    totalCount: number;
  }

  /**
   * Patient table row node
   */
  interface IPatientTableRowNode {
    node: IPatientTableRow | null;
    cursor: string;
  }

  /**
   * Patient table row
   */
  interface IPatientTableRow {
    id: string;
    firstName: string;
    lastName: string;
    cityblockId: number;
    dateOfBirth: string | null;
    userCareTeam: boolean | null;
    patientInfo: IPatientInfo;
    patientState: IPatientState;
  }

  interface IPatientFilterOptions {
    ageMin?: number | null;
    ageMax?: number | null;
    gender?: Gender | null;
    zip?: string | null;
    careWorkerId?: string | null;
    patientState?: CurrentPatientState | null;
    lineOfBusiness?: LinesOfBusiness | null;
    inNetwork?: PatientInNetwork | null;
  }

  enum LinesOfBusiness {
    hmo = 'hmo',
    medicaid = 'medicaid',
    medicare = 'medicare',
    ppo = 'ppo',
    ps = 'ps'
  }

  enum PatientInNetwork {
    yes = 'yes',
    no = 'no'
  }

  /**
   * Patient dashboard item edges
   */
  interface IPatientForDashboardEdges {
    edges: Array<IPatientForDashboardNode>;
    pageInfo: IPageInfo;
    totalCount: number;
  }

  /**
   * Patient dashboard item node
   */
  interface IPatientForDashboardNode {
    node: IPatientForDashboard | null;
    cursor: string;
  }

  /**
   * Patient dashboard item
   */
  interface IPatientForDashboard {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string | null;
    cityblockId: number;
    patientInfo: IPatientInfo;
    patientState: IPatientState;
    computedPatientStatus: IComputedPatientStatus;
  }

  /**
   * Patient contact that is editable in Commons
   */
  interface IPatientContact {
    id: string;
    patientId: string;
    relationToPatient: PatientRelationOptions;
    relationFreeText: string | null;
    firstName: string;
    lastName: string;
    isEmergencyContact: boolean;
    isHealthcareProxy: boolean;
    description: string | null;
    phone: IPhone;
    address: IAddress | null;
    email: IEmail | null;
    isConsentedForSubstanceUse: boolean | null;
    isConsentedForHiv: boolean | null;
    isConsentedForStd: boolean | null;
    isConsentedForGeneticTesting: boolean | null;
    isConsentedForFamilyPlanning: boolean | null;
    isConsentedForMentalHealth: boolean | null;
    consentDocumentId: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;
  }

  enum PatientRelationOptions {
    parent = 'parent',
    grandparent = 'grandparent',
    child = 'child',
    sibling = 'sibling',
    grandchild = 'grandchild',
    roommate = 'roommate',
    friend = 'friend',
    neighbor = 'neighbor',
    partner = 'partner',
    spouse = 'spouse',
    other = 'other'
  }

  /**
   * Patient external provider that is editable in Commons
   */
  interface IPatientExternalProvider {
    id: string;
    patientId: string;
    role: ExternalProviderOptions;
    roleFreeText: string | null;
    patientExternalOrganizationId: string;
    patientExternalOrganization: IPatientExternalOrganization;
    firstName: string | null;
    lastName: string | null;
    description: string | null;
    phone: IPhone;
    email: IEmail | null;
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;
  }

  enum ExternalProviderOptions {
    substanceUseCounselor = 'substanceUseCounselor',
    therapistMentalHealth = 'therapistMentalHealth',
    therapistPhysical = 'therapistPhysical',
    psychiatrist = 'psychiatrist',
    dialysis = 'dialysis',
    housingCaseManager = 'housingCaseManager',
    hasaCaseManager = 'hasaCaseManager',
    pharmacy = 'pharmacy',
    homeAttendant = 'homeAttendant',
    visitingNurse = 'visitingNurse',
    durableMedicalEquipment = 'durableMedicalEquipment',
    healthHomeCareManager = 'healthHomeCareManager',
    insurancePlanCareManager = 'insurancePlanCareManager',
    otherCaseManagement = 'otherCaseManagement',
    formalCaregiver = 'formalCaregiver',
    other = 'other',
    urology = 'urology',
    endocrinology = 'endocrinology',
    ophthalmology = 'ophthalmology',
    cardiology = 'cardiology',
    podiatry = 'podiatry',
    orthopedics = 'orthopedics',
    infectiousDisease = 'infectiousDisease',
    obgyn = 'obgyn',
    pulmonology = 'pulmonology',
    nephrology = 'nephrology',
    hepatology = 'hepatology',
    gastroenterology = 'gastroenterology',
    ent = 'ent',
    vascular = 'vascular',
    oncology = 'oncology',
    hematology = 'hematology',
    dermatology = 'dermatology',
    otherMedicalSpecialist = 'otherMedicalSpecialist'
  }

  /**
   * Patient external organization that is editable in Commons
   */
  interface IPatientExternalOrganization {
    id: string;
    patientId: string;
    name: string;
    description: string | null;
    phoneNumber: string | null;
    faxNumber: string | null;
    address: IAddress | null;
    isConsentedForSubstanceUse: boolean | null;
    isConsentedForHiv: boolean | null;
    isConsentedForStd: boolean | null;
    isConsentedForGeneticTesting: boolean | null;
    isConsentedForFamilyPlanning: boolean | null;
    isConsentedForMentalHealth: boolean | null;
    consentDocumentId: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;
  }

  /**
   * Documents and consents for a user
   */
  interface IPatientDocument {
    id: string;
    patientId: string;
    uploadedBy: IUser;
    filename: string;
    description: string | null;
    documentType: DocumentTypeOptions | null;
    createdAt: string;
  }

  enum DocumentTypeOptions {
    hieHealthixConsent = 'hieHealthixConsent',
    hcp = 'hcp',
    molst = 'molst',
    textConsent = 'textConsent',
    treatmentConsent = 'treatmentConsent',
    phiSharingConsent = 'phiSharingConsent',
    hra2010eApplication = 'hra2010eApplication',
    accessARideApplication = 'accessARideApplication',
    epicSeniorRxApplication = 'epicSeniorRxApplication',
    hieHealthixWithdrawal = 'hieHealthixWithdrawal',
    hieHealthixDenial = 'hieHealthixDenial',
    homecareReferral = 'homecareReferral',
    homeHealthFacetoFaceCertification = 'homeHealthFacetoFaceCertification',
    m11q = 'm11q',
    map2015 = 'map2015',
    molstForDisabilities = 'molstForDisabilities',
    privacyPracticesNotice = 'privacyPracticesNotice',
    socialSecurityDisability = 'socialSecurityDisability'
  }

  /**
   * Clinic
   */
  interface IClinic {
    id: string;
    name: string;
    departmentId: number;
    createdAt: string;
    updatedAt: string;
  }

  /**
   * Clinic edges
   */
  interface IClinicEdges {
    edges: Array<IClinicNode>;
    pageInfo: IPageInfo;
  }

  /**
   * Clinic node
   */
  interface IClinicNode {
    node: IClinic;
    cursor: string;
  }

  /**
   * Task
   */
  interface ITask {
    id: string;
    title: string;
    description: string | null;
    patient: IPatient;
    patientId: string;
    dueAt: string | null;
    priority: Priority | null;
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

  enum Priority {
    low = 'low',
    medium = 'medium',
    high = 'high'
  }

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
   * Concern
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
   * DiagnosisCode
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
    completedWithinInterval: CompletedWithinInterval | null;
    repeating: boolean | null;
    goalSuggestionTemplateId: string;
    priority: Priority | null;
    careTeamAssigneeRole: UserRole | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    CBOCategoryId: string | null;
  }

  enum CompletedWithinInterval {
    hour = 'hour',
    day = 'day',
    week = 'week',
    month = 'month',
    year = 'year'
  }

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
    url: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  enum TaskOrderOptions {
    createdAtDesc = 'createdAtDesc',
    createdAtAsc = 'createdAtAsc',
    dueAtDesc = 'dueAtDesc',
    dueAtAsc = 'dueAtAsc',
    updatedAtDesc = 'updatedAtDesc',
    updatedAtAsc = 'updatedAtAsc',
    titleAsc = 'titleAsc',
    titleDesc = 'titleDesc'
  }

  /**
   * Task edges
   */
  interface ITaskEdges {
    edges: Array<ITaskNode>;
    pageInfo: IPageInfo;
  }

  /**
   * Task node
   */
  interface ITaskNode {
    node: ITask | null;
    cursor: string;
  }

  enum UserTaskOrderOptions {
    dueAtAsc = 'dueAtAsc',
    priorityDesc = 'priorityDesc',
    patientAsc = 'patientAsc'
  }

  /**
   * Task with patient image edges
   */
  interface ITaskWithImageEdges {
    edges: Array<ITaskNode>;
    pageInfo: IPageInfo;
  }

  /**
   * Task ID
   */
  interface ITaskId {
    id: string;
  }

  /**
   * Task comment edges
   */
  interface ITaskCommentEdges {
    edges: Array<ITaskCommentNode>;
    pageInfo: IPageInfo;
  }

  /**
   * Task comment node
   */
  interface ITaskCommentNode {
    node: ITaskComment | null;
    cursor: string;
  }

  /**
   * Task comment
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
   * Risk Area Group
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
    riskAreas: Array<IRiskAreaShort>;
  }

  interface IRiskAreaShort {
    id: string;
    title: string;
    assessmentType: AssessmentType;
  }

  enum AssessmentType {
    automated = 'automated',
    manual = 'manual'
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
    assessmentType: AssessmentType;
    riskAreaGroupId: string;
    order: number;
    mediumRiskThreshold: number;
    highRiskThreshold: number;
    questions: Array<IQuestionWithPatientAnswer>;
    riskAreaAssessmentSubmissions: Array<IRiskAreaAssessmentSubmission>;
    screeningTools: Array<IScreeningToolForPatient>;
    lastUpdated: string | null;
    forceHighRisk: boolean;
    totalScore: number | null;
    riskScore: Priority | null;
    summaryText: Array<string>;
  }

  /**
   * Question with patient answer
   */
  interface IQuestionWithPatientAnswer {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    title: string;
    validatedSource: string | null;
    answers: Array<IAnswerWithPatientAnswer>;
    answerType: AnswerTypeOptions;
    riskAreaId: string | null;
    screeningToolId: string | null;
    progressNoteTemplateId: string | null;
    applicableIfQuestionConditions: Array<IQuestionCondition>;
    applicableIfType: QuestionConditionTypeOptions | null;
    order: number;
    computedFieldId: string | null;
    computedField: IComputedField | null;
    otherTextAnswerId: string | null;
  }

  /**
   * Answer with Patient answer
   */
  interface IAnswerWithPatientAnswer {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    displayValue: string;
    value: string;
    valueType: AnswerValueTypeOptions;
    riskAdjustmentType: RiskAdjustmentTypeOptions | null;
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

  enum AnswerValueTypeOptions {
    string = 'string',
    boolean = 'boolean',
    number = 'number'
  }

  enum RiskAdjustmentTypeOptions {
    inactive = 'inactive',
    increment = 'increment',
    forceHighRisk = 'forceHighRisk'
  }

  /**
   * PatientAnswer
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

  /**
   * Answer
   */
  interface IAnswer {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    displayValue: string;
    value: string;
    valueType: AnswerValueTypeOptions;
    riskAdjustmentType: RiskAdjustmentTypeOptions | null;
    inSummary: boolean | null;
    summaryText: string | null;
    questionId: string;
    order: number;
    concernSuggestions: Array<IConcern>;
    goalSuggestions: Array<IGoalSuggestionTemplate> | null;
    riskArea: IRiskAreaShort | null;
    screeningTool: IScreeningToolShort | null;
  }

  interface IScreeningToolShort {
    id: string;
    title: string;
  }

  /**
   * Question
   */
  interface IQuestion {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    title: string;
    validatedSource: string | null;
    answers: Array<IAnswer>;
    answerType: AnswerTypeOptions;
    riskAreaId: string | null;
    screeningToolId: string | null;
    progressNoteTemplateId: string | null;
    applicableIfQuestionConditions: Array<IQuestionCondition>;
    applicableIfType: QuestionConditionTypeOptions | null;
    order: number;
    computedFieldId: string | null;
    computedField: IComputedField | null;
    otherTextAnswerId: string | null;
  }

  enum AnswerTypeOptions {
    dropdown = 'dropdown',
    radio = 'radio',
    freetext = 'freetext',
    multiselect = 'multiselect'
  }

  /**
   * QuestionCondition
   */
  interface IQuestionCondition {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    answerId: string;
    questionId: string;
  }

  enum QuestionConditionTypeOptions {
    allTrue = 'allTrue',
    oneTrue = 'oneTrue'
  }

  interface IComputedField {
    id: string;
    slug: string;
    label: string;
    dataType: ComputedFieldDataTypes;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  enum ComputedFieldDataTypes {
    boolean = 'boolean',
    string = 'string',
    number = 'number'
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

  interface IScreeningTool {
    id: string;
    title: string;
    riskAreaId: string;
    screeningToolScoreRanges: Array<IScreeningToolScoreRange>;
    patientScreeningToolSubmissions: Array<
      IPatientScreeningToolSubmissionShort
    >;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  interface IScreeningToolScoreRange {
    id: string;
    description: string;
    screeningToolId: string;
    riskAdjustmentType: RiskAdjustmentTypeOptions;
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

  interface ICarePlanSuggestion {
    id: string;
    patientId: string;
    patient: IPatient;
    suggestionType: CarePlanSuggestionType;
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
    riskAreaAssessmentSubmissionId: string | null;
    computedFieldId: string | null;
    screeningTool: IScreeningToolShort | null;
    riskArea: IRiskAreaShort | null;
    computedField: IComputedFieldForSuggestion | null;
  }

  enum CarePlanSuggestionType {
    concern = 'concern',
    goal = 'goal'
  }

  interface IComputedFieldForSuggestion {
    id: string;
    label: string;
    riskArea: IRiskAreaShort;
  }

  interface IScreeningToolScoreRangeForPatientScreeningToolSubmission {
    id: string;
    description: string;
    riskAdjustmentType: RiskAdjustmentTypeOptions;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

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
    riskArea: IRiskArea | null;
  }

  /**
   * Risk Area
   */
  interface IRiskArea {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    title: string;
    assessmentType: AssessmentType;
    riskAreaGroupId: string;
    order: number;
    mediumRiskThreshold: number;
    highRiskThreshold: number;
    questions: Array<IQuestion>;
    screeningTools: Array<IScreeningTool>;
  }

  interface IScreeningToolForPatient {
    id: string;
    title: string;
    patientScreeningToolSubmissions: Array<IPatientScreeningToolSubmission>;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  interface IFullRiskAreaGroupForPatient {
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
    automatedSummaryText: Array<string>;
    manualSummaryText: Array<string>;
    screeningToolResultSummaries: Array<IScreeningToolResultSummary>;
    lastUpdated: string | null;
    forceHighRisk: boolean;
    totalScore: number | null;
    riskScore: Priority | null;
  }

  interface IScreeningToolResultSummary {
    title: string;
    score: number | null;
    description: string;
  }

  enum QuestionFilterType {
    progressNoteTemplate = 'progressNoteTemplate',
    riskArea = 'riskArea',
    screeningTool = 'screeningTool'
  }

  enum AnswerFilterType {
    question = 'question',
    progressNote = 'progressNote',
    riskArea = 'riskArea',
    screeningTool = 'screeningTool'
  }

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
   * Event Notification edges
   */
  interface IEventNotificationEdges {
    edges: Array<IEventNotificationNode>;
    pageInfo: IPageInfo;
  }

  /**
   * Event Notification node
   */
  interface IEventNotificationNode {
    node: IEventNotification | null;
    cursor: string;
  }

  /**
   * Event Notification
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
   * Task Event
   */
  interface ITaskEvent {
    id: string;
    taskId: string;
    task: ITask;
    userId: string;
    user: IUser;
    eventType: TaskEventTypes | null;
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

  enum TaskEventTypes {
    create_task = 'create_task',
    add_follower = 'add_follower',
    remove_follower = 'remove_follower',
    complete_task = 'complete_task',
    uncomplete_task = 'uncomplete_task',
    delete_task = 'delete_task',
    add_comment = 'add_comment',
    edit_comment = 'edit_comment',
    delete_comment = 'delete_comment',
    edit_priority = 'edit_priority',
    edit_due_date = 'edit_due_date',
    edit_assignee = 'edit_assignee',
    edit_title = 'edit_title',
    edit_description = 'edit_description',
    cbo_referral_edit_sent_at = 'cbo_referral_edit_sent_at',
    cbo_referral_edit_acknowledged_at = 'cbo_referral_edit_acknowledged_at'
  }

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
    worryScore: number | null;
  }

  interface IProgressNoteTemplate {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  enum ConcernOrderOptions {
    createdAtDesc = 'createdAtDesc',
    createdAtAsc = 'createdAtAsc',
    titleDesc = 'titleDesc',
    titleAsc = 'titleAsc',
    updatedAtDesc = 'updatedAtDesc',
    updatedAtAsc = 'updatedAtAsc'
  }

  enum GoalSuggestionOrderOptions {
    createdAtDesc = 'createdAtDesc',
    createdAtAsc = 'createdAtAsc',
    titleDesc = 'titleDesc',
    titleAsc = 'titleAsc',
    updatedAtDesc = 'updatedAtDesc',
    updatedAtAsc = 'updatedAtAsc'
  }

  interface ICarePlan {
    goals: Array<IPatientGoal>;
    concerns: Array<IPatientConcern>;
  }

  /**
   * PatientProgressNoteId
   */
  interface IPatientProgressNoteId {
    id: string;
    createdAt: string;
  }

  interface IProgressNoteActivity {
    taskEvents: Array<ITaskEvent>;
    patientAnswerEvents: Array<IPatientAnswerEvent>;
    carePlanUpdateEvents: Array<ICarePlanUpdateEvent>;
    quickCallEvents: Array<IQuickCall>;
    patientScreeningToolSubmissions: Array<IPatientScreeningToolSubmission>;
  }

  /**
   * Patient Answer Event
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
    eventType: PatientAnswerEventTypes;
    progressNoteId: string | null;
    progressNote: IProgressNote | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  enum PatientAnswerEventTypes {
    create_patient_answer = 'create_patient_answer'
  }

  /**
   * Care Plan Update Event
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
    eventType: CarePlanUpdateEventTypes;
    progressNoteId: string | null;
    progressNote: IProgressNote | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  enum CarePlanUpdateEventTypes {
    create_patient_concern = 'create_patient_concern',
    edit_patient_concern = 'edit_patient_concern',
    delete_patient_concern = 'delete_patient_concern',
    create_patient_goal = 'create_patient_goal',
    edit_patient_goal = 'edit_patient_goal',
    delete_patient_goal = 'delete_patient_goal'
  }

  interface IQuickCall {
    id: string;
    progressNoteId: string;
    progressNote: IProgressNote;
    userId: string;
    user: IUser;
    reason: string;
    summary: string;
    direction: QuickCallDirection;
    callRecipient: string;
    wasSuccessful: boolean;
    startTime: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  enum QuickCallDirection {
    Inbound = 'Inbound',
    Outbound = 'Outbound'
  }

  enum ComputedFieldOrderOptions {
    labelDesc = 'labelDesc',
    labelAsc = 'labelAsc',
    slugDesc = 'slugDesc',
    slugAsc = 'slugAsc'
  }

  interface IComputedFieldsSchema {
    computedFields: Array<IComputedFieldSchema>;
  }

  interface IComputedFieldSchema {
    slug: string;
    dataType: ComputedFieldDataTypes;
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
   * Patient Glass Break
   */
  interface IPatientGlassBreak {
    id: string;
    userId: string;
    patientId: string;
    reason: string;
    note: string | null;
  }

  /**
   * Progress Note Glass Break
   */
  interface IProgressNoteGlassBreak {
    id: string;
    userId: string;
    progressNoteId: string;
    reason: string;
    note: string | null;
  }

  /**
   * Patient Glass Break - not needed check
   */
  interface IPatientGlassBreakCheck {
    patientId: string;
    isGlassBreakNotNeeded: boolean;
  }

  /**
   * Progress Note Glass Break - not needed check
   */
  interface IProgressNoteGlassBreakCheck {
    progressNoteId: string;
    isGlassBreakNotNeeded: boolean;
  }

  /**
   * Patient Consent Form
   */
  interface IPatientConsentForm {
    patientConsentFormId: string | null;
    patientId: string;
    userId: string | null;
    formId: string;
    title: string;
    signedAt: string | null;
  }

  /**
   * Patient Advanced Directive Form
   */
  interface IPatientAdvancedDirectiveForm {
    patientAdvancedDirectiveFormId: string | null;
    patientId: string;
    userId: string | null;
    formId: string;
    title: string;
    signedAt: string | null;
  }

  /**
   * Patient Scratch Pad
   */
  interface IPatientScratchPad {
    id: string;
    patientId: string;
    userId: string;
    body: string;
  }

  /**
   * PatientProblem
   */
  interface IPatientDiagnosis {
    id: string;
    name: string;
    code: string;
    startDate: string;
    endDate: string;
  }

  /**
   * PatientMedication
   */
  interface IPatientMedication {
    id: string;
    name: string;
    dosage: string;
    startDate: string;
    endDate: string;
  }

  /**
   * PatientEncounter
   */
  interface IPatientEncounter {
    id: string;
    location: string | null;
    source: string | null;
    date: string;
    title: string | null;
    notes: string | null;
    progressNoteId: string | null;
  }

  /**
   * Patient Full Social Security Number
   */
  interface IPatientSocialSecurity {
    id: string;
    ssn: string | null;
  }

  /**
   * google calendar id and url for current user calendar
   */
  interface ICalendar {
    googleCalendarId: string;
    googleCalendarUrl: string | null;
  }

  /**
   * google calendar id and url for patient calendar
   */
  interface IPatientCalendar {
    patientId: string;
    googleCalendarId: string | null;
    googleCalendarUrl: string | null;
    isCurrentUserPermissioned: boolean | null;
  }

  /**
   * Google calendar event list
   */
  interface ICalendarEventEdges {
    events: Array<ICalendarEvent>;
    pageInfo: IGooglePageInfo | null;
  }

  interface ICalendarEvent {
    id: string;
    startDate: string;
    startTime: string | null;
    endDate: string;
    endTime: string | null;
    title: string;
    htmlLink: string;
    description: string | null;
    location: string | null;
    guests: Array<string>;
    eventType: GoogleCalendarEventType | null;
    providerName: string | null;
    providerCredentials: string | null;
  }

  enum GoogleCalendarEventType {
    cityblock = 'cityblock',
    siu = 'siu'
  }

  /**
   * Google API page info
   */
  interface IGooglePageInfo {
    nextPageToken: string | null;
    previousPageToken: string | null;
  }

  /**
   * Patient table row edges
   */
  interface ISmsMessageEdges {
    edges: Array<ISmsMessageNode>;
    pageInfo: IPageInfo;
    totalCount: number;
  }

  /**
   * Patient table row node
   */
  interface ISmsMessageNode {
    node: ISmsMessage;
    cursor: string;
  }

  /**
   * SMS message
   */
  interface ISmsMessage {
    id: string;
    userId: string;
    contactNumber: string;
    patientId: string | null;
    direction: SmsMessageDirection;
    body: string;
    createdAt: string;
  }

  enum SmsMessageDirection {
    toUser = 'toUser',
    fromUser = 'fromUser'
  }

  /**
   * User Hours
   */
  interface IUserHours {
    id: string;
    userId: string;
    weekday: number;
    startTime: number;
    endTime: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  interface IRootMutationType {

    /**
     * Create a new user
     */
    userCreate: IUser | null;

    /**
     * Login user
     */
    userLogin: IUserWithAuthToken | null;

    /**
     * Edit user - role
     */
    userEditRole: IUser | null;

    /**
     * Edit user - permissions
     */
    userEditPermissions: IUser | null;

    /**
     * Delete user
     */
    userDelete: IUser | null;

    /**
     * Edit current user
     */
    currentUserEdit: IUser | null;

    /**
     * Create a new clinic
     */
    clinicCreate: IClinic | null;

    /**
     * Add user to careTeam
     */
    careTeamAddUser: IUser | null;

    /**
     * Reassign a user on a careTeam
     */
    careTeamReassignUser: IUser | null;

    /**
     * Add multiple patients to careTeam
     */
    careTeamAssignPatients: IUserWithCount | null;

    /**
     * Make user team lead of careTeam
     */
    careTeamMakeTeamLead: IUser | null;

    /**
     * Create an address
     */
    addressCreate: IAddress | null;

    /**
     * Create an address for a Patient
     */
    addressCreateForPatient: IAddress | null;

    /**
     * Delete an address for a Patient
     */
    addressDeleteForPatient: IAddress | null;

    /**
     * Edit an address
     */
    addressEdit: IAddress | null;

    /**
     * Create a phone number for a Patient
     */
    phoneCreateForPatient: IPhone | null;

    /**
     * Create a phone number
     */
    phoneCreate: IPhone | null;

    /**
     * Delete a phone number for a Patient
     */
    phoneDeleteForPatient: IPhone | null;

    /**
     * Create an email for a Patient
     */
    emailCreateForPatient: IEmail | null;

    /**
     * Create an email
     */
    emailCreate: IEmail | null;

    /**
     * Delete an email for a Patient
     */
    emailDeleteForPatient: IEmail | null;

    /**
     * Edit an email
     */
    emailEdit: IEmail | null;

    /**
     * mark core identity verified on patient stored in the db
     */
    patientCoreIdentityVerify: IPatient | null;

    /**
     * Edit fields on patient info stored in the db
     */
    patientInfoEdit: IPatientInfo | null;

    /**
     * Create patient contact
     */
    patientContactCreate: IPatientContact | null;

    /**
     * Delete patient contact
     */
    patientContactDelete: IPatientContact | null;

    /**
     * Edit fields on patient contact stored in the db
     */
    patientContactEdit: IPatientContact | null;

    /**
     * Create patient external provider
     */
    patientExternalProviderCreate: IPatientExternalProvider | null;

    /**
     * Delete patient external provider
     */
    patientExternalProviderDelete: IPatientExternalProvider | null;

    /**
     * Edit fields on patient external provider stored in the db
     */
    patientExternalProviderEdit: IPatientExternalProvider | null;

    /**
     * Create patient external organization
     */
    patientExternalOrganizationCreate: IPatientExternalOrganization | null;

    /**
     * Delete patient external organization
     */
    patientExternalOrganizationDelete: IPatientExternalOrganization | null;

    /**
     * Edit fields on patient external organization stored in the db
     */
    patientExternalOrganizationEdit: IPatientExternalOrganization | null;

    /**
     * Create patient document
     */
    patientDocumentCreate: IPatientDocument | null;

    /**
     * Delete patient document
     */
    patientDocumentDelete: IPatientDocument | null;

    /**
     * generate a signed URL for patient document
     */
    patientDocumentSignedUrlCreate: ISignedUrl;

    /**
     * Edit a patient need to know
     */
    patientNeedToKnowEdit: IPatientNeedToKnow | null;

    /**
     * Create a task
     */
    taskCreate: ITask | null;

    /**
     * Delete a task
     */
    taskDelete: ITask | null;

    /**
     * Edit a task
     */
    taskEdit: ITask | null;

    /**
     * Complete a task
     */
    taskComplete: ITask | null;

    /**
     * Uncomplete a task
     */
    taskUncomplete: ITask | null;

    /**
     * Add user to task followers
     */
    taskUserFollow: ITask | null;

    /**
     * Remove user from task followers
     */
    taskUserUnfollow: ITask | null;

    /**
     * Create a task
     */
    taskCommentCreate: ITaskComment | null;

    /**
     * Edit a task
     */
    taskCommentEdit: ITaskComment | null;

    /**
     * Delete a task
     */
    taskCommentDelete: ITaskComment | null;

    /**
     * Create a RiskAreaGroup
     */
    riskAreaGroupCreate: IRiskAreaGroup | null;

    /**
     * Edit a RiskAreaGroup
     */
    riskAreaGroupEdit: IRiskAreaGroup | null;

    /**
     * Delete a RiskAreaGroup
     */
    riskAreaGroupDelete: IRiskAreaGroup | null;

    /**
     * Create a RiskArea
     */
    riskAreaCreate: IRiskArea | null;

    /**
     * Edit a RiskArea
     */
    riskAreaEdit: IRiskArea | null;

    /**
     * Deletes a RiskArea
     */
    riskAreaDelete: IRiskArea | null;

    /**
     * Create a Question
     */
    questionCreate: IQuestion | null;

    /**
     * Edit a Question
     */
    questionEdit: IQuestion | null;

    /**
     * Delete a question
     */
    questionDelete: IQuestion | null;

    /**
     * Create an Answer
     */
    answerCreate: IAnswer | null;

    /**
     * Edit an Answer
     */
    answerEdit: IAnswer | null;

    /**
     * Deletes an Answer
     */
    answerDelete: IAnswer | null;

    /**
     * Create a patient answer
     */
    patientAnswersCreate: Array<IPatientAnswer> | null;

    /**
     * Edit a patient answer
     */
    patientAnswerEdit: IPatientAnswer | null;

    /**
     * Deletes a patient Answer
     */
    patientAnswerDelete: IPatientAnswer | null;

    /**
     * Create a QuestionCondition
     */
    questionConditionCreate: IQuestionCondition | null;

    /**
     * Edit a QuestionCondition
     */
    questionConditionEdit: IQuestionCondition | null;

    /**
     * Deletes a QuestionCondition
     */
    questionConditionDelete: IQuestionCondition | null;

    /**
     * Dismisses (marks as seen) an EventNotification
     */
    eventNotificationDismiss: IEventNotification | null;

    /**
     * Dismisses (marks as seen) all of the EventNotifications on a Task for a the current user
     */
    eventNotificationsForTaskDismiss: Array<IEventNotification> | null;

    /**
     * Create a concern
     */
    concernCreate: IConcern | null;

    /**
     * Edit a concern
     */
    concernEdit: IConcern | null;

    /**
     * Deletes a concern
     */
    concernDelete: IConcern | null;

    /**
     * Add a diagnosis code to a concern
     */
    concernAddDiagnosisCode: IConcern | null;

    /**
     * Remove a diagnosis code from a concern
     */
    concernRemoveDiagnosisCode: IConcern | null;

    /**
     * suggest a concern for an answer
     */
    concernSuggestionCreate: Array<IConcern> | null;

    /**
     * delete suggestion a concern for an answer
     */
    concernSuggestionDelete: Array<IConcern> | null;

    /**
     * goal suggestion template create
     */
    goalSuggestionTemplateCreate: IGoalSuggestionTemplate | null;

    /**
     * Edit a goal suggestion template
     */
    goalSuggestionTemplateEdit: IGoalSuggestionTemplate | null;

    /**
     * Deletes a goal suggestion template
     */
    goalSuggestionTemplateDelete: IGoalSuggestionTemplate | null;

    /**
     * Suggest a goal suggestion template for an answer
     */
    goalSuggestionCreate: Array<IGoalSuggestionTemplate> | null;

    /**
     * unsuggest a goal suggestion template for an answer
     */
    goalSuggestionDelete: Array<IGoalSuggestionTemplate> | null;

    /**
     * task template create
     */
    taskTemplateCreate: ITaskTemplate | null;

    /**
     * Edit a task template
     */
    taskTemplateEdit: ITaskTemplate | null;

    /**
     * Deletes a task template
     */
    taskTemplateDelete: ITaskTemplate | null;

    /**
     * Suggest a task template for an answer
     */
    taskSuggestionCreate: Array<ITaskTemplate> | null;

    /**
     * unsuggest a task template for an answer
     */
    taskSuggestionDelete: Array<ITaskTemplate> | null;

    /**
     * patient goal create
     */
    patientGoalCreate: IPatientGoal | null;

    /**
     * patient goal edit
     */
    patientGoalEdit: IPatientGoal | null;

    /**
     * patient goal delete
     */
    patientGoalDelete: IPatientGoal | null;

    /**
     * patient concern create
     */
    patientConcernCreate: IPatientConcern | null;

    /**
     * patient concern edit
     */
    patientConcernEdit: IPatientConcern | null;

    /**
     * patient concern bulk edit
     */
    patientConcernBulkEdit: Array<IPatientConcern> | null;

    /**
     * patient concern delete
     */
    patientConcernDelete: IPatientConcern | null;

    /**
     * care plan suggestion accept
     */
    carePlanSuggestionAccept: ICarePlanSuggestion | null;

    /**
     * care plan suggestion dismiss
     */
    carePlanSuggestionDismiss: ICarePlanSuggestion | null;

    /**
     * screening tool create
     */
    screeningToolCreate: IScreeningTool | null;

    /**
     * screening tool edit
     */
    screeningToolEdit: IScreeningTool | null;

    /**
     * screening tool delete
     */
    screeningToolDelete: IScreeningTool | null;

    /**
     * screening tool score range create
     */
    screeningToolScoreRangeCreate: IScreeningToolScoreRange | null;

    /**
     * screening tool score range edit
     */
    screeningToolScoreRangeEdit: IScreeningToolScoreRange | null;

    /**
     * screening tool score range delete
     */
    screeningToolScoreRangeDelete: IScreeningToolScoreRange | null;

    /**
     * patient screening tool submission create
     */
    patientScreeningToolSubmissionCreate: IPatientScreeningToolSubmission | null;

    /**
     * patient screening tool submission score
     */
    patientScreeningToolSubmissionScore: IPatientScreeningToolSubmission | null;

    /**
     * create a progress note template
     */
    progressNoteTemplateCreate: IProgressNoteTemplate | null;

    /**
     * edits a progress note template
     */
    progressNoteTemplateEdit: IProgressNoteTemplate | null;

    /**
     * deletes a progress note template
     */
    progressNoteTemplateDelete: IProgressNoteTemplate | null;

    /**
     * creates a progress note
     */
    progressNoteCreate: IProgressNote | null;

    /**
     * completes a progress note
     */
    progressNoteComplete: IProgressNote | null;

    /**
     * edits a progress note
     */
    progressNoteEdit: IProgressNote | null;

    /**
     * add or edit supervisor notes
     */
    progressNoteAddSupervisorNotes: IProgressNote | null;

    /**
     * closes out supervisor review
     */
    progressNoteCompleteSupervisorReview: IProgressNote | null;

    /**
     * creates a quick call
     */
    quickCallCreate: IQuickCall | null;

    /**
     * Create a computed field
     */
    computedFieldCreate: IComputedField | null;

    /**
     * Delete a computed field
     */
    computedFieldDelete: IComputedField | null;

    /**
     * risk area assessment submission create
     */
    riskAreaAssessmentSubmissionCreate: IRiskAreaAssessmentSubmission | null;

    /**
     * risk area assessment submission complete
     */
    riskAreaAssessmentSubmissionComplete: IRiskAreaAssessmentSubmission | null;
    computedFieldFlagCreate: IComputedFieldFlag | null;

    /**
     * Create a PatientList
     */
    patientListCreate: IPatientList | null;

    /**
     * Edit a PatientList
     */
    patientListEdit: IPatientList | null;

    /**
     * Delete a PatientList
     */
    patientListDelete: IPatientList | null;

    /**
     * Create a CBO
     */
    CBOCreate: ICBO | null;

    /**
     * Edit a CBO
     */
    CBOEdit: ICBO | null;

    /**
     * Delete a CBO
     */
    CBODelete: ICBO | null;

    /**
     * Create a CBO Referral
     */
    CBOReferralCreate: ICBOReferral | null;

    /**
     * Edit a CBO Referral
     */
    CBOReferralEdit: ICBOReferral | null;

    /**
     * Jwt token to view a PDF
     */
    JwtForPdfCreate: IJwtForPdf;

    /**
     * creates a patient data flag
     */
    patientDataFlagCreate: IPatientDataFlag | null;

    /**
     * creates a patient glass break
     */
    patientGlassBreakCreate: IPatientGlassBreak | null;

    /**
     * creates a progress note glass break
     */
    progressNoteGlassBreakCreate: IProgressNoteGlassBreak | null;

    /**
     * creates a patient consent form
     */
    patientConsentFormCreate: IPatientConsentForm | null;

    /**
     * deletes a patient consent form
     */
    patientConsentFormDelete: IPatientConsentForm | null;

    /**
     * creates a patient advanced directive form
     */
    patientAdvancedDirectiveFormCreate: IPatientAdvancedDirectiveForm | null;

    /**
     * deletes a patient advanced directive form
     */
    patientAdvancedDirectiveFormDelete: IPatientAdvancedDirectiveForm | null;

    /**
     * edits a patient scratch pad
     */
    patientScratchPadEdit: IPatientScratchPad | null;

    /**
     * generate a signed URL for patient photo
     */
    patientPhotoSignedUrlCreate: ISignedUrl;

    /**
     * create a SMS message (returns node so fits into paginated results)
     */
    smsMessageCreate: ISmsMessageNode;

    /**
     * creates a calendar for a patient
     */
    calendarCreateForPatient: IPatientCalendar;

    /**
     * creates a calendar event for a patient
     */
    calendarCreateEventForPatient: ICalendarUrl;

    /**
     * creates a calendar event for current user
     */
    calendarCreateEventForCurrentUser: ICalendarUrl;

    /**
     * creates a JWT to download VCF
     */
    JwtForVcfCreate: IJwtForVcf;

    /**
     * generate a signed URL for voicemail
     */
    userVoicemailSignedUrlCreate: ISignedUrl;

    /**
     * mattermost url to DM user
     */
    mattermostUrlForUserCreate: IMattermostUrl;

    /**
     * mattermost url for patient channel
     */
    mattermostUrlForPatientCreate: IMattermostUrl;

    /**
     * create user hours
     */
    userHoursCreate: IUserHours;

    /**
     * edit user hours
     */
    userHoursEdit: IUserHours;

    /**
     * delete user hours
     */
    userHoursDelete: IUserHours;

    /**
     * create hello sign
     */
    helloSignCreate: IHelloSignUrl;

    /**
     * transfer hello sign
     */
    helloSignTransfer: boolean;
  }

  interface IUserCreateOnRootMutationTypeArguments {
    input?: IUserCreateInput | null;
  }

  interface IUserLoginOnRootMutationTypeArguments {
    input?: IUserLoginInput | null;
  }

  interface IUserEditRoleOnRootMutationTypeArguments {
    input?: IUserEditRoleInput | null;
  }

  interface IUserEditPermissionsOnRootMutationTypeArguments {
    input?: IUserEditPermissionsInput | null;
  }

  interface IUserDeleteOnRootMutationTypeArguments {
    input?: IUserDeleteInput | null;
  }

  interface ICurrentUserEditOnRootMutationTypeArguments {
    input?: ICurrentUserEditInput | null;
  }

  interface IClinicCreateOnRootMutationTypeArguments {
    input?: IClinicCreateInput | null;
  }

  interface ICareTeamAddUserOnRootMutationTypeArguments {
    input?: ICareTeamInput | null;
  }

  interface ICareTeamReassignUserOnRootMutationTypeArguments {
    input?: ICareTeamReassignInput | null;
  }

  interface ICareTeamAssignPatientsOnRootMutationTypeArguments {
    input?: ICareTeamAssignInput | null;
  }

  interface ICareTeamMakeTeamLeadOnRootMutationTypeArguments {
    input?: ICareTeamMakeTeamLeadInput | null;
  }

  interface IAddressCreateOnRootMutationTypeArguments {
    input?: IAddressCreateInput | null;
  }

  interface IAddressCreateForPatientOnRootMutationTypeArguments {
    input?: IAddressCreateForPatientInput | null;
  }

  interface IAddressDeleteForPatientOnRootMutationTypeArguments {
    input?: IAddressDeleteForPatientInput | null;
  }

  interface IAddressEditOnRootMutationTypeArguments {
    input?: IAddressEditInput | null;
  }

  interface IPhoneCreateForPatientOnRootMutationTypeArguments {
    input?: IPhoneCreateForPatientInput | null;
  }

  interface IPhoneCreateOnRootMutationTypeArguments {
    input?: IPhoneCreateInput | null;
  }

  interface IPhoneDeleteForPatientOnRootMutationTypeArguments {
    input?: IPhoneDeleteForPatientInput | null;
  }

  interface IEmailCreateForPatientOnRootMutationTypeArguments {
    input?: IEmailCreateForPatientInput | null;
  }

  interface IEmailCreateOnRootMutationTypeArguments {
    input?: IEmailCreateInput | null;
  }

  interface IEmailDeleteForPatientOnRootMutationTypeArguments {
    input?: IEmailDeleteForPatientInput | null;
  }

  interface IEmailEditOnRootMutationTypeArguments {
    input?: IEmailEditInput | null;
  }

  interface IPatientCoreIdentityVerifyOnRootMutationTypeArguments {
    input?: IPatientCoreIdentityVerifyInput | null;
  }

  interface IPatientInfoEditOnRootMutationTypeArguments {
    input?: IPatientInfoEditInput | null;
  }

  interface IPatientContactCreateOnRootMutationTypeArguments {
    input?: IPatientContactCreateInput | null;
  }

  interface IPatientContactDeleteOnRootMutationTypeArguments {
    input?: IPatientContactDeleteInput | null;
  }

  interface IPatientContactEditOnRootMutationTypeArguments {
    input?: IPatientContactEditInput | null;
  }

  interface IPatientExternalProviderCreateOnRootMutationTypeArguments {
    input?: IPatientExternalProviderCreateInput | null;
  }

  interface IPatientExternalProviderDeleteOnRootMutationTypeArguments {
    input?: IPatientExternalProviderDeleteInput | null;
  }

  interface IPatientExternalProviderEditOnRootMutationTypeArguments {
    input?: IPatientExternalProviderEditInput | null;
  }

  interface IPatientExternalOrganizationCreateOnRootMutationTypeArguments {
    input?: IPatientExternalOrganizationCreateInput | null;
  }

  interface IPatientExternalOrganizationDeleteOnRootMutationTypeArguments {
    input?: IPatientExternalOrganizationDeleteInput | null;
  }

  interface IPatientExternalOrganizationEditOnRootMutationTypeArguments {
    input?: IPatientExternalOrganizationEditInput | null;
  }

  interface IPatientDocumentCreateOnRootMutationTypeArguments {
    input?: IPatientDocumentCreateInput | null;
  }

  interface IPatientDocumentDeleteOnRootMutationTypeArguments {
    input?: IPatientDocumentDeleteInput | null;
  }

  interface IPatientDocumentSignedUrlCreateOnRootMutationTypeArguments {
    input?: IPatientDocumentSignedUrlCreateInput | null;
  }

  interface IPatientNeedToKnowEditOnRootMutationTypeArguments {
    input?: IPatientNeedToKnowEditInput | null;
  }

  interface ITaskCreateOnRootMutationTypeArguments {
    input?: ITaskCreateInput | null;
  }

  interface ITaskDeleteOnRootMutationTypeArguments {
    input?: ITaskDeleteInput | null;
  }

  interface ITaskEditOnRootMutationTypeArguments {
    input?: ITaskEditInput | null;
  }

  interface ITaskCompleteOnRootMutationTypeArguments {
    input?: ITaskCompleteInput | null;
  }

  interface ITaskUncompleteOnRootMutationTypeArguments {
    input?: ITaskCompleteInput | null;
  }

  interface ITaskUserFollowOnRootMutationTypeArguments {
    input?: ITaskFollowInput | null;
  }

  interface ITaskUserUnfollowOnRootMutationTypeArguments {
    input?: ITaskFollowInput | null;
  }

  interface ITaskCommentCreateOnRootMutationTypeArguments {
    input?: ITaskCommentCreateInput | null;
  }

  interface ITaskCommentEditOnRootMutationTypeArguments {
    input?: ITaskCommentEditInput | null;
  }

  interface ITaskCommentDeleteOnRootMutationTypeArguments {
    input?: ITaskCommentDeleteInput | null;
  }

  interface IRiskAreaGroupCreateOnRootMutationTypeArguments {
    input?: IRiskAreaGroupCreateInput | null;
  }

  interface IRiskAreaGroupEditOnRootMutationTypeArguments {
    input?: IRiskAreaGroupEditInput | null;
  }

  interface IRiskAreaGroupDeleteOnRootMutationTypeArguments {
    input?: IRiskAreaGroupDeleteInput | null;
  }

  interface IRiskAreaCreateOnRootMutationTypeArguments {
    input?: IRiskAreaCreateInput | null;
  }

  interface IRiskAreaEditOnRootMutationTypeArguments {
    input?: IRiskAreaEditInput | null;
  }

  interface IRiskAreaDeleteOnRootMutationTypeArguments {
    input?: IRiskAreaDeleteInput | null;
  }

  interface IQuestionCreateOnRootMutationTypeArguments {
    input?: IQuestionCreateInput | null;
  }

  interface IQuestionEditOnRootMutationTypeArguments {
    input?: IQuestionEditInput | null;
  }

  interface IQuestionDeleteOnRootMutationTypeArguments {
    input?: IQuestionDeleteInput | null;
  }

  interface IAnswerCreateOnRootMutationTypeArguments {
    input?: IAnswerCreateInput | null;
  }

  interface IAnswerEditOnRootMutationTypeArguments {
    input?: IAnswerEditInput | null;
  }

  interface IAnswerDeleteOnRootMutationTypeArguments {
    input?: IAnswerDeleteInput | null;
  }

  interface IPatientAnswersCreateOnRootMutationTypeArguments {
    input?: IPatientAnswersCreateInput | null;
  }

  interface IPatientAnswerEditOnRootMutationTypeArguments {
    input?: IPatientAnswerEditInput | null;
  }

  interface IPatientAnswerDeleteOnRootMutationTypeArguments {
    input?: IPatientAnswerDeleteInput | null;
  }

  interface IQuestionConditionCreateOnRootMutationTypeArguments {
    input?: IQuestionConditionCreateInput | null;
  }

  interface IQuestionConditionEditOnRootMutationTypeArguments {
    input?: IQuestionConditionEditInput | null;
  }

  interface IQuestionConditionDeleteOnRootMutationTypeArguments {
    input?: IQuestionConditionDeleteInput | null;
  }

  interface IEventNotificationDismissOnRootMutationTypeArguments {
    input?: IEventNotificationEditInput | null;
  }

  interface IEventNotificationsForTaskDismissOnRootMutationTypeArguments {
    input?: IUserTaskNotificationsEditInput | null;
  }

  interface IConcernCreateOnRootMutationTypeArguments {
    input?: IConcernCreateInput | null;
  }

  interface IConcernEditOnRootMutationTypeArguments {
    input?: IConcernEditInput | null;
  }

  interface IConcernDeleteOnRootMutationTypeArguments {
    input?: IConcernDeleteInput | null;
  }

  interface IConcernAddDiagnosisCodeOnRootMutationTypeArguments {
    input?: IConcernAddDiagnosisCodeInput | null;
  }

  interface IConcernRemoveDiagnosisCodeOnRootMutationTypeArguments {
    input?: IConcernRemoveDiagnosisCodeInput | null;
  }

  interface IConcernSuggestionCreateOnRootMutationTypeArguments {
    input?: IConcernSuggestInput | null;
  }

  interface IConcernSuggestionDeleteOnRootMutationTypeArguments {
    input?: IConcernSuggestInput | null;
  }

  interface IGoalSuggestionTemplateCreateOnRootMutationTypeArguments {
    input?: IGoalSuggestionTemplateCreateInput | null;
  }

  interface IGoalSuggestionTemplateEditOnRootMutationTypeArguments {
    input?: IGoalSuggestionTemplateEditInput | null;
  }

  interface IGoalSuggestionTemplateDeleteOnRootMutationTypeArguments {
    input?: IGoalSuggestionTemplateDeleteInput | null;
  }

  interface IGoalSuggestionCreateOnRootMutationTypeArguments {
    input?: IGoalSuggestInput | null;
  }

  interface IGoalSuggestionDeleteOnRootMutationTypeArguments {
    input?: IGoalSuggestInput | null;
  }

  interface ITaskTemplateCreateOnRootMutationTypeArguments {
    input?: ITaskTemplateCreateInput | null;
  }

  interface ITaskTemplateEditOnRootMutationTypeArguments {
    input?: ITaskTemplateEditInput | null;
  }

  interface ITaskTemplateDeleteOnRootMutationTypeArguments {
    input?: ITaskTemplateDeleteInput | null;
  }

  interface ITaskSuggestionCreateOnRootMutationTypeArguments {
    input?: ITaskSuggestInput | null;
  }

  interface ITaskSuggestionDeleteOnRootMutationTypeArguments {
    input?: ITaskSuggestInput | null;
  }

  interface IPatientGoalCreateOnRootMutationTypeArguments {
    input?: IPatientGoalCreateInput | null;
  }

  interface IPatientGoalEditOnRootMutationTypeArguments {
    input?: IPatientGoalEditInput | null;
  }

  interface IPatientGoalDeleteOnRootMutationTypeArguments {
    input?: IPatientGoalDeleteInput | null;
  }

  interface IPatientConcernCreateOnRootMutationTypeArguments {
    input?: IPatientConcernCreateInput | null;
  }

  interface IPatientConcernEditOnRootMutationTypeArguments {
    input?: IPatientConcernEditInput | null;
  }

  interface IPatientConcernBulkEditOnRootMutationTypeArguments {
    input?: IPatientConcernBulkEditInput | null;
  }

  interface IPatientConcernDeleteOnRootMutationTypeArguments {
    input?: IPatientConcernDeleteInput | null;
  }

  interface ICarePlanSuggestionAcceptOnRootMutationTypeArguments {
    input?: ICarePlanSuggestionAcceptInput | null;
  }

  interface ICarePlanSuggestionDismissOnRootMutationTypeArguments {
    input?: ICarePlanSuggestionDismissInput | null;
  }

  interface IScreeningToolCreateOnRootMutationTypeArguments {
    input?: IScreeningToolCreateInput | null;
  }

  interface IScreeningToolEditOnRootMutationTypeArguments {
    input?: IScreeningToolEditInput | null;
  }

  interface IScreeningToolDeleteOnRootMutationTypeArguments {
    input?: IScreeningToolDeleteInput | null;
  }

  interface IScreeningToolScoreRangeCreateOnRootMutationTypeArguments {
    input?: IScreeningToolScoreRangeCreateInput | null;
  }

  interface IScreeningToolScoreRangeEditOnRootMutationTypeArguments {
    input?: IScreeningToolScoreRangeEditInput | null;
  }

  interface IScreeningToolScoreRangeDeleteOnRootMutationTypeArguments {
    input?: IScreeningToolScoreRangeDeleteInput | null;
  }

  interface IPatientScreeningToolSubmissionCreateOnRootMutationTypeArguments {
    input?: IPatientScreeningToolSubmissionCreateInput | null;
  }

  interface IPatientScreeningToolSubmissionScoreOnRootMutationTypeArguments {
    input?: IPatientScreeningToolSubmissionScoreInput | null;
  }

  interface IProgressNoteTemplateCreateOnRootMutationTypeArguments {
    input?: IProgressNoteTemplateCreateInput | null;
  }

  interface IProgressNoteTemplateEditOnRootMutationTypeArguments {
    input?: IProgressNoteTemplateEditInput | null;
  }

  interface IProgressNoteTemplateDeleteOnRootMutationTypeArguments {
    input?: IProgressNoteTemplateDeleteInput | null;
  }

  interface IProgressNoteCreateOnRootMutationTypeArguments {
    input?: IProgressNoteCreateInput | null;
  }

  interface IProgressNoteCompleteOnRootMutationTypeArguments {
    input?: IProgressNoteCompleteInput | null;
  }

  interface IProgressNoteEditOnRootMutationTypeArguments {
    input?: IProgressNoteEditInput | null;
  }

  interface IProgressNoteAddSupervisorNotesOnRootMutationTypeArguments {
    input?: IProgressNoteAddSupervisorNotesInput | null;
  }

  interface IProgressNoteCompleteSupervisorReviewOnRootMutationTypeArguments {
    input?: IProgressNoteCompleteSupervisorReviewInput | null;
  }

  interface IQuickCallCreateOnRootMutationTypeArguments {
    input?: IQuickCallCreateInput | null;
  }

  interface IComputedFieldCreateOnRootMutationTypeArguments {
    input?: IComputedFieldCreateInput | null;
  }

  interface IComputedFieldDeleteOnRootMutationTypeArguments {
    input?: IComputedFieldDeleteInput | null;
  }

  interface IRiskAreaAssessmentSubmissionCreateOnRootMutationTypeArguments {
    input?: IRiskAreaAssessmentSubmissionCreateInput | null;
  }

  interface IRiskAreaAssessmentSubmissionCompleteOnRootMutationTypeArguments {
    input?: IRiskAreaAssessmentSubmissionCompleteInput | null;
  }

  interface IComputedFieldFlagCreateOnRootMutationTypeArguments {
    input?: IComputedFieldFlagCreateInput | null;
  }

  interface IPatientListCreateOnRootMutationTypeArguments {
    input?: IPatientListCreateInput | null;
  }

  interface IPatientListEditOnRootMutationTypeArguments {
    input?: IPatientListEditInput | null;
  }

  interface IPatientListDeleteOnRootMutationTypeArguments {
    input?: IPatientListDeleteInput | null;
  }

  interface ICBOCreateOnRootMutationTypeArguments {
    input?: ICBOCreateInput | null;
  }

  interface ICBOEditOnRootMutationTypeArguments {
    input?: ICBOEditInput | null;
  }

  interface ICBODeleteOnRootMutationTypeArguments {
    input?: ICBODeleteInput | null;
  }

  interface ICBOReferralCreateOnRootMutationTypeArguments {
    input?: ICBOReferralCreateInput | null;
  }

  interface ICBOReferralEditOnRootMutationTypeArguments {
    input?: ICBOReferralEditInput | null;
  }

  interface IJwtForPdfCreateOnRootMutationTypeArguments {
    input?: IJwtForPdfCreateInput | null;
  }

  interface IPatientDataFlagCreateOnRootMutationTypeArguments {
    input?: IPatientDataFlagCreateInput | null;
  }

  interface IPatientGlassBreakCreateOnRootMutationTypeArguments {
    input?: IPatientGlassBreakCreateInput | null;
  }

  interface IProgressNoteGlassBreakCreateOnRootMutationTypeArguments {
    input?: IProgressNoteGlassBreakCreateInput | null;
  }

  interface IPatientConsentFormCreateOnRootMutationTypeArguments {
    input?: IPatientConsentFormCreateInput | null;
  }

  interface IPatientConsentFormDeleteOnRootMutationTypeArguments {
    input?: IPatientConsentFormDeleteInput | null;
  }

  interface IPatientAdvancedDirectiveFormCreateOnRootMutationTypeArguments {
    input?: IPatientAdvancedDirectiveFormCreateInput | null;
  }

  interface IPatientAdvancedDirectiveFormDeleteOnRootMutationTypeArguments {
    input?: IPatientAdvancedDirectiveFormDeleteInput | null;
  }

  interface IPatientScratchPadEditOnRootMutationTypeArguments {
    input?: IPatientScratchPadEditInput | null;
  }

  interface IPatientPhotoSignedUrlCreateOnRootMutationTypeArguments {
    input?: IPatientPhotoSignedUrlCreateInput | null;
  }

  interface ISmsMessageCreateOnRootMutationTypeArguments {
    input?: ISmsMessageCreateInput | null;
  }

  interface ICalendarCreateForPatientOnRootMutationTypeArguments {
    input?: ICalendarCreateForPatientInput | null;
  }

  interface ICalendarCreateEventForPatientOnRootMutationTypeArguments {
    input?: ICalendarCreateEventForPatientInput | null;
  }

  interface ICalendarCreateEventForCurrentUserOnRootMutationTypeArguments {
    input?: ICalendarCreateEventForCurrentUserInput | null;
  }

  interface IUserVoicemailSignedUrlCreateOnRootMutationTypeArguments {
    input?: IUserVoicemailSignedUrlCreateInput | null;
  }

  interface IMattermostUrlForUserCreateOnRootMutationTypeArguments {
    input?: IMattermostUrlForUserInput | null;
  }

  interface IMattermostUrlForPatientCreateOnRootMutationTypeArguments {
    input?: IMattermostUrlForPatientInput | null;
  }

  interface IUserHoursCreateOnRootMutationTypeArguments {
    input?: IUserHoursCreateInput | null;
  }

  interface IUserHoursEditOnRootMutationTypeArguments {
    input?: IUserHoursEditInput | null;
  }

  interface IUserHoursDeleteOnRootMutationTypeArguments {
    input?: IUserHoursDeleteInput | null;
  }

  interface IHelloSignCreateOnRootMutationTypeArguments {
    input?: IHelloSignCreateInput | null;
  }

  interface IHelloSignTransferOnRootMutationTypeArguments {
    input?: IHelloSignTransferInput | null;
  }

  /**
   * params for creating a user
   */
  interface IUserCreateInput {
    email: string;
    homeClinicId: string;
  }

  /**
   * params for logging in a user
   */
  interface IUserLoginInput {
    googleAuthCode: string;
  }

  /**
   * The user account with an optional auth token
   */
  interface IUserWithAuthToken {
    user: IUser;

    /**
     * The auth token to allow for quick login. JWT passed back in via headers for further requests
     */
    authToken: string | null;
  }

  /**
   * params for editing a user - only supports user role
   */
  interface IUserEditRoleInput {
    userRole: string;
    email: string;
  }

  /**
   * params for editing a user - only supports permissions
   */
  interface IUserEditPermissionsInput {
    permissions: Permissions;
    email: string;
  }

  /**
   * params for deleting a user
   */
  interface IUserDeleteInput {
    email: string;
  }

  /**
   * params for editing a current user
   */
  interface ICurrentUserEditInput {
    locale?: string | null;
    isAvailable?: boolean | null;
    awayMessage?: string | null;
  }

  /**
   * params for creating a clinic
   */
  interface IClinicCreateInput {
    departmentId: number;
    name: string;
  }

  /**
   * params for adding or removing patient from care team
   */
  interface ICareTeamInput {
    userId: string;
    patientId: string;
  }

  interface ICareTeamReassignInput {
    userId: string;
    patientId: string;
    reassignedToId?: string | null;
  }

  /**
   * params for adding multiple patients to a user's care team
   */
  interface ICareTeamAssignInput {
    userId: string;
    patientIds: Array<string>;
  }

  interface ICareTeamMakeTeamLeadInput {
    userId: string;
    patientId: string;
  }

  /**
   * params for creating an address in the db
   */
  interface IAddressCreateInput {
    zip?: string | null;
    street1?: string | null;
    street2?: string | null;
    state?: string | null;
    city?: string | null;
    description?: string | null;
  }

  /**
   * params for creating and address for a patient in the db
   */
  interface IAddressCreateForPatientInput {
    patientId: string;
    zip?: string | null;
    street1?: string | null;
    street2?: string | null;
    state?: string | null;
    city?: string | null;
    description?: string | null;
    isPrimary?: boolean | null;
  }

  /**
   * params for deleting an address for a patient in the db
   */
  interface IAddressDeleteForPatientInput {
    patientId: string;
    addressId: string;
    isPrimary?: boolean | null;
  }

  /**
   * Editable fields on an address
   */
  interface IAddressEditInput {
    addressId: string;
    patientId: string;
    zip?: string | null;
    street1?: string | null;
    street2?: string | null;
    state?: string | null;
    city?: string | null;
    description?: string | null;
  }

  /**
   * params for creating a phone for a patient in the db
   */
  interface IPhoneCreateForPatientInput {
    patientId: string;
    phoneNumber: string;
    type: PhoneTypeOptions;
    description?: string | null;
    isPrimary?: boolean | null;
  }

  /**
   * params for creating a phone
   */
  interface IPhoneCreateInput {
    phoneNumber: string;
    type: PhoneTypeOptions;
    description?: string | null;
  }

  /**
   * params for deleting a phone for a patient in the db
   */
  interface IPhoneDeleteForPatientInput {
    patientId: string;
    phoneId: string;
    isPrimary?: boolean | null;
  }

  /**
   * params for creating and email for a patient in the db
   */
  interface IEmailCreateForPatientInput {
    patientId: string;
    emailAddress: string;
    description?: string | null;
    isPrimary?: boolean | null;
  }

  /**
   * params for creating an email
   */
  interface IEmailCreateInput {
    emailAddress: string;
    description?: string | null;
  }

  /**
   * params for deleting an email for a patient in the db
   */
  interface IEmailDeleteForPatientInput {
    patientId: string;
    emailId: string;
    isPrimary?: boolean | null;
  }

  /**
   * Editable fields on an email
   */
  interface IEmailEditInput {
    emailId: string;
    patientId: string;
    emailAddress: string;
    description?: string | null;
  }

  /**
   * params for editing a patient in the db
   */
  interface IPatientCoreIdentityVerifyInput {
    patientId: string;
  }

  /**
   * params for editing a patient in the db
   */
  interface IPatientInfoEditInput {
    patientInfoId: string;
    preferredName?: string | null;
    gender?: Gender | null;
    genderFreeText?: string | null;
    transgender?: Transgender | null;
    maritalStatus?: MaritalStatus | null;
    language?: string | null;
    isMarginallyHoused?: boolean | null;
    primaryAddressId?: string | null;
    hasEmail?: boolean | null;
    primaryEmailId?: string | null;
    primaryPhoneId?: string | null;
    preferredContactMethod?: ContactMethodOptions | null;
    preferredContactTime?: ContactTimeOptions | null;
    canReceiveCalls?: boolean | null;
    hasHealthcareProxy?: boolean | null;
    hasMolst?: boolean | null;
    hasDeclinedPhotoUpload?: boolean | null;
    hasUploadedPhoto?: boolean | null;
    isWhite?: boolean | null;
    isBlack?: boolean | null;
    isAmericanIndianAlaskan?: boolean | null;
    isAsian?: boolean | null;
    isHawaiianPacific?: boolean | null;
    isOtherRace?: boolean | null;
    isHispanic?: boolean | null;
    raceFreeText?: string | null;
  }

  /**
   * params for creating a patient contact in the db
   */
  interface IPatientContactCreateInput {
    patientId: string;
    relationToPatient: PatientRelationOptions;
    relationFreeText?: string | null;
    firstName: string;
    lastName: string;
    phone: IPhoneCreateInput;
    isEmergencyContact?: boolean | null;
    isHealthcareProxy?: boolean | null;
    description?: string | null;
    address?: IAddressCreateInput | null;
    email?: IEmailCreateInput | null;
    isConsentedForSubstanceUse?: boolean | null;
    isConsentedForHiv?: boolean | null;
    isConsentedForStd?: boolean | null;
    isConsentedForGeneticTesting?: boolean | null;
    isConsentedForFamilyPlanning?: boolean | null;
    isConsentedForMentalHealth?: boolean | null;
  }

  /**
   * params for deleting a patient contact and all associated models in the db
   */
  interface IPatientContactDeleteInput {
    patientContactId: string;
  }

  /**
   * params for editing a patient contact in the db
   */
  interface IPatientContactEditInput {
    patientContactId: string;
    relationToPatient?: PatientRelationOptions | null;
    relationFreeText?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    isEmergencyContact?: boolean | null;
    isHealthcareProxy?: boolean | null;
    description?: string | null;
    address?: IAddressInput | null;
    email?: IEmailInput | null;
    phone?: IPhoneInput | null;
    isConsentedForSubstanceUse?: boolean | null;
    isConsentedForHiv?: boolean | null;
    isConsentedForStd?: boolean | null;
    isConsentedForGeneticTesting?: boolean | null;
    isConsentedForFamilyPlanning?: boolean | null;
    isConsentedForMentalHealth?: boolean | null;
    consentDocumentId?: string | null;
  }

  /**
   * params for creating or editing address in the db
   */
  interface IAddressInput {
    addressId?: string | null;
    zip?: string | null;
    street1?: string | null;
    street2?: string | null;
    state?: string | null;
    city?: string | null;
    description?: string | null;
  }

  /**
   * params for creating or editing an email in the db
   */
  interface IEmailInput {
    emailAddress: string;
    description?: string | null;
  }

  /**
   * params for creating or editing phone in the db
   */
  interface IPhoneInput {
    phoneId?: string | null;
    phoneNumber: string;
    type?: PhoneTypeOptions | null;
    description?: string | null;
  }

  /**
   * params for creating a patient external provider in the db
   */
  interface IPatientExternalProviderCreateInput {
    patientId: string;
    role: ExternalProviderOptions;
    roleFreeText?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phone: IPhoneCreateInput;
    patientExternalOrganizationId: string;
    description?: string | null;
    email?: IEmailCreateInput | null;
  }

  /**
   * params for deleting a patient external provider and all associated models in the db
   */
  interface IPatientExternalProviderDeleteInput {
    patientExternalProviderId: string;
  }

  /**
   * params for editing a patient external provider in the db
   */
  interface IPatientExternalProviderEditInput {
    patientExternalProviderId: string;
    role?: ExternalProviderOptions | null;
    roleFreeText?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    patientExternalOrganizationId?: string | null;
    description?: string | null;
    email?: IEmailInput | null;
    phone?: IPhoneInput | null;
  }

  /**
   * params for creating a patient external organization in the db
   */
  interface IPatientExternalOrganizationCreateInput {
    patientId: string;
    name: string;
    description?: string | null;
    phoneNumber?: string | null;
    faxNumber?: string | null;
    address?: IAddressCreateInput | null;
    isConsentedForSubstanceUse?: boolean | null;
    isConsentedForHiv?: boolean | null;
    isConsentedForStd?: boolean | null;
    isConsentedForGeneticTesting?: boolean | null;
    isConsentedForFamilyPlanning?: boolean | null;
    isConsentedForMentalHealth?: boolean | null;
  }

  /**
   * params for deleting a patient external organization and all associated models in the db
   */
  interface IPatientExternalOrganizationDeleteInput {
    patientExternalOrganizationId: string;
  }

  /**
   * params for editing a patient external organization in the db
   */
  interface IPatientExternalOrganizationEditInput {
    patientExternalOrganizationId: string;
    name?: string | null;
    description?: string | null;
    phoneNumber?: string | null;
    faxNumber?: string | null;
    address?: IAddressInput | null;
    isConsentedForSubstanceUse?: boolean | null;
    isConsentedForHiv?: boolean | null;
    isConsentedForStd?: boolean | null;
    isConsentedForGeneticTesting?: boolean | null;
    isConsentedForFamilyPlanning?: boolean | null;
    isConsentedForMentalHealth?: boolean | null;
    consentDocumentId?: string | null;
  }

  /**
   * params for creating a patient document in the db
   */
  interface IPatientDocumentCreateInput {
    id?: string | null;
    patientId: string;
    filename: string;
    description?: string | null;
    documentType?: DocumentTypeOptions | null;
  }

  /**
   * params for deleting a patient document in the db
   */
  interface IPatientDocumentDeleteInput {
    patientDocumentId: string;
  }

  /**
   * params for generating a signed url for documents
   */
  interface IPatientDocumentSignedUrlCreateInput {
    patientId: string;
    action: PatientSignedUrlAction;
    documentId: string;
    contentType?: string | null;
  }

  enum PatientSignedUrlAction {
    read = 'read',
    write = 'write',
    delete = 'delete'
  }

  /**
   * signed url for patient photo or documents
   */
  interface ISignedUrl {
    signedUrl: string;
  }

  /**
   * params for editing a patient need to know
   */
  interface IPatientNeedToKnowEditInput {
    patientInfoId: string;
    text: string;
  }

  /**
   * params for creating a task
   */
  interface ITaskCreateInput {
    title: string;
    description?: string | null;
    dueAt?: string | null;
    patientId: string;
    assignedToId?: string | null;
    patientGoalId: string;
    priority?: Priority | null;
    CBOReferralId?: string | null;
  }

  /**
   * params for deleting a task
   */
  interface ITaskDeleteInput {
    taskId: string;
  }

  /**
   * params for creating a task
   */
  interface ITaskEditInput {
    taskId: string;
    title?: string | null;
    description?: string | null;
    dueAt?: string | null;
    assignedToId?: string | null;
    priority?: Priority | null;
    patientGoalId?: string | null;
  }

  /**
   * params for completing a task
   */
  interface ITaskCompleteInput {
    taskId: string;
  }

  /**
   * params for adding user to a task's followers
   */
  interface ITaskFollowInput {
    userId: string;
    taskId: string;
  }

  /**
   * params for creating a task comment
   */
  interface ITaskCommentCreateInput {
    taskId: string;
    body: string;
  }

  /**
   * params for editing a task comment
   */
  interface ITaskCommentEditInput {
    taskCommentId: string;
    body: string;
  }

  /**
   * params for deleting a task comment
   */
  interface ITaskCommentDeleteInput {
    taskCommentId: string;
  }

  /**
   * params for creating a risk area group
   */
  interface IRiskAreaGroupCreateInput {
    title: string;
    shortTitle: string;
    order: number;
    mediumRiskThreshold: number;
    highRiskThreshold: number;
  }

  /**
   * params for editing a risk area group
   */
  interface IRiskAreaGroupEditInput {
    riskAreaGroupId: string;
    title?: string | null;
    shortTitle?: string | null;
    order?: number | null;
    mediumRiskThreshold?: number | null;
    highRiskThreshold?: number | null;
  }

  /**
   * params for deleting a risk area group
   */
  interface IRiskAreaGroupDeleteInput {
    riskAreaGroupId: string;
  }

  interface IRiskAreaCreateInput {
    title: string;
    assessmentType: AssessmentType;
    riskAreaGroupId: string;
    order: number;
    mediumRiskThreshold: number;
    highRiskThreshold: number;
  }

  interface IRiskAreaEditInput {
    riskAreaId: string;
    title?: string | null;
    order?: number | null;
    mediumRiskThreshold?: number | null;
    highRiskThreshold?: number | null;
  }

  interface IRiskAreaDeleteInput {
    riskAreaId: string;
  }

  interface IQuestionCreateInput {
    title: string;
    answerType: AnswerTypeOptions;
    validatedSource?: string | null;
    riskAreaId?: string | null;
    screeningToolId?: string | null;
    progressNoteTemplateId?: string | null;
    order: number;
    applicableIfType?: QuestionConditionTypeOptions | null;
    computedFieldId?: string | null;
    hasOtherTextAnswer?: boolean | null;
  }

  interface IQuestionEditInput {
    questionId: string;
    title?: string | null;
    answerType?: AnswerTypeOptions | null;
    validatedSource?: string | null;
    order?: number | null;
    applicableIfType?: QuestionConditionTypeOptions | null;
    hasOtherTextAnswer?: boolean | null;
  }

  interface IQuestionDeleteInput {
    questionId: string;
  }

  interface IAnswerCreateInput {
    displayValue: string;
    value: string;
    valueType: AnswerValueTypeOptions;
    riskAdjustmentType?: RiskAdjustmentTypeOptions | null;
    inSummary?: boolean | null;
    summaryText?: string | null;
    questionId: string;
    order: number;
  }

  interface IAnswerEditInput {
    displayValue?: string | null;
    value?: string | null;
    valueType?: AnswerValueTypeOptions | null;
    riskAdjustmentType?: RiskAdjustmentTypeOptions | null;
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
    patientScreeningToolSubmissionId?: string | null;
    riskAreaAssessmentSubmissionId?: string | null;
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

  interface IQuestionConditionCreateInput {
    questionId: string;
    answerId: string;
  }

  /**
   * QuestionCondition edit input - for validation, need to edit question and answer at the same time
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
   * EventNotification edit input
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
    priority?: Priority | null;
    careTeamAssigneeRole?: string | null;
    CBOCategoryId?: string | null;
  }

  interface ITaskTemplateEditInput {
    title: string;
    completedWithinNumber?: number | null;
    completedWithinInterval?: string | null;
    repeating?: boolean | null;
    goalSuggestionTemplateId?: string | null;
    priority?: Priority | null;
    careTeamAssigneeRole?: string | null;
    CBOCategoryId?: string | null;
    taskTemplateId: string;
  }

  interface ITaskTemplateDeleteInput {
    taskTemplateId: string;
  }

  interface ITaskSuggestInput {
    answerId: string;
    taskTemplateId: string;
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
    patientConcernId: string;
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
    riskAdjustmentType: RiskAdjustmentTypeOptions;
  }

  interface IScreeningToolScoreRangeEditInput {
    screeningToolScoreRangeId: string;
    description?: string | null;
    screeningToolId?: string | null;
    minimumScore?: number | null;
    maximumScore?: number | null;
    deletedAt?: string | null;
    riskAdjustmentType?: RiskAdjustmentTypeOptions | null;
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
    progressNoteTemplateId?: string | null;
    startedAt?: string | null;
    location?: string | null;
    summary?: string | null;
    memberConcern?: string | null;
    supervisorId?: string | null;
    needsSupervisorReview?: boolean | null;
    worryScore?: number | null;
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
    direction: QuickCallDirection;
    callRecipient: string;
    wasSuccessful: boolean;
    startTime: string;
  }

  interface IComputedFieldCreateInput {
    label: string;
    dataType: ComputedFieldDataTypes;
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
   * params for creating a computed field flag
   */
  interface IComputedFieldFlagCreateInput {
    patientAnswerId: string;
    reason?: string | null;
  }

  interface IComputedFieldFlag {
    id: string;
    patientAnswerId: string;
    userId: string;
    reason: string | null;
  }

  /**
   * params for creating a patient list
   */
  interface IPatientListCreateInput {
    title: string;
    answerId: string;
    order: number;
  }

  /**
   * params for editing a patient list
   */
  interface IPatientListEditInput {
    patientListId: string;
    title?: string | null;
    answerId?: string | null;
    order?: number | null;
  }

  /**
   * params for deleting a patient list
   */
  interface IPatientListDeleteInput {
    patientListId: string;
  }

  /**
   * params for creating a CBO
   */
  interface ICBOCreateInput {
    name: string;
    categoryId: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    fax?: string | null;
    phone: string;
    url?: string | null;
  }

  /**
   * params for editing a CBO
   */
  interface ICBOEditInput {
    CBOId: string;
    name?: string | null;
    categoryId?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    fax?: string | null;
    phone?: string | null;
    url?: string | null;
  }

  /**
   * params for deleting a CBO
   */
  interface ICBODeleteInput {
    CBOId: string;
  }

  /**
   * params for creating a CBO referral
   */
  interface ICBOReferralCreateInput {
    categoryId: string;
    CBOId?: string | null;
    name?: string | null;
    url?: string | null;
    diagnosis?: string | null;
  }

  /**
   * params for editing a CBO referral
   */
  interface ICBOReferralEditInput {
    CBOReferralId: string;
    taskId: string;
    categoryId?: string | null;
    CBOId?: string | null;
    name?: string | null;
    url?: string | null;
    diagnosis?: string | null;
    sentAt?: string | null;
    acknowledgedAt?: string | null;
  }

  /**
   * check patient id for permissioning generating JWT for PDF
   */
  interface IJwtForPdfCreateInput {
    patientId: string;
  }

  /**
   * JWT token for PDF viewing
   */
  interface IJwtForPdf {
    authToken: string;
  }

  interface IPatientDataFlagCreateInput {
    patientId: string;
    fieldName: DataFlagOptions;
    suggestedValue?: string | null;
    notes?: string | null;
  }

  /**
   * params for creating a patient glass break
   */
  interface IPatientGlassBreakCreateInput {
    patientId: string;
    reason: string;
    note?: string | null;
  }

  /**
   * params for creating a progress note glass break
   */
  interface IProgressNoteGlassBreakCreateInput {
    progressNoteId: string;
    reason: string;
    note?: string | null;
  }

  /**
   * params for creating a patient consent form
   */
  interface IPatientConsentFormCreateInput {
    patientId: string;
    formId: string;
    signedAt: string;
  }

  /**
   * params for deleting a patient consent form
   */
  interface IPatientConsentFormDeleteInput {
    patientConsentFormId: string;
  }

  /**
   * params for creating a patient advanced directive form
   */
  interface IPatientAdvancedDirectiveFormCreateInput {
    patientId: string;
    formId: string;
    signedAt: string;
  }

  /**
   * params for deleting a patient advanced directive form
   */
  interface IPatientAdvancedDirectiveFormDeleteInput {
    patientAdvancedDirectiveFormId: string;
  }

  /**
   * params for editing patinet scratch pad
   */
  interface IPatientScratchPadEditInput {
    patientScratchPadId: string;
    body: string;
  }

  /**
   * generate signed url for patient photo
   */
  interface IPatientPhotoSignedUrlCreateInput {
    patientId: string;
    action: PatientSignedUrlAction;
  }

  interface ISmsMessageCreateInput {
    patientId: string;
    body: string;
  }

  /**
   * params for creating a patient calendar
   */
  interface ICalendarCreateForPatientInput {
    patientId: string;
  }

  /**
   * params for creating a patient calendar event
   */
  interface ICalendarCreateEventForPatientInput {
    patientId: string;
    googleCalendarId: string;
    startDatetime: string;
    endDatetime: string;
    inviteeEmails: Array<string>;
    location: string;
    title: string;
    reason: string;
  }

  /**
   * google calendar url for patient calendar event
   */
  interface ICalendarUrl {
    eventCreateUrl: string;
  }

  /**
   * params for creating a current user calendar event
   */
  interface ICalendarCreateEventForCurrentUserInput {
    startDatetime: string;
    endDatetime: string;
    inviteeEmails: Array<string>;
    location: string;
    title: string;
    reason: string;
  }

  /**
   * JWT for downloading vCard
   */
  interface IJwtForVcf {
    authToken: string;
  }

  /**
   * params for generating a signed url for voicemail
   */
  interface IUserVoicemailSignedUrlCreateInput {
    voicemailId: string;
  }

  /**
   * params for getting Mattermost url to specific user
   */
  interface IMattermostUrlForUserInput {
    email: string;
  }

  /**
   * Deep link to mattermost
   */
  interface IMattermostUrl {
    url: string;
  }

  /**
   * params for getting Mattermost url to patient channel
   */
  interface IMattermostUrlForPatientInput {
    patientId: string;
  }

  /**
   * params for creating user hours
   */
  interface IUserHoursCreateInput {
    weekday: number;
    startTime: number;
    endTime: number;
  }

  /**
   * params for editing user hours
   */
  interface IUserHoursEditInput {
    userHoursId: string;
    startTime: number;
    endTime: number;
  }

  /**
   * params for deleting user hours
   */
  interface IUserHoursDeleteInput {
    userHoursId: string;
  }

  /**
   * params for signing document via HelloSign
   */
  interface IHelloSignCreateInput {
    patientId: string;
    documentType: DocumentTypeOptions;
  }

  /**
   * HelloSign URL
   */
  interface IHelloSignUrl {
    url: string;
    requestId: string;
  }

  /**
   * params for storing copy of HelloSign document on GCS
   */
  interface IHelloSignTransferInput {
    patientId: string;
    documentType: DocumentTypeOptions;
    requestId: string;
  }

  interface IRootSubscriptionType {
    smsMessageCreated: ISmsMessageNode;
    patientDocumentCreated: IPatientDocument;
  }

  interface ISmsMessageCreatedOnRootSubscriptionTypeArguments {
    patientId: string;
  }

  interface IPatientDocumentCreatedOnRootSubscriptionTypeArguments {
    patientId: string;
  }

  enum UserSignedUrlAction {
    read = 'read',
    write = 'write'
  }

  /**
   * Patient node
   */
  interface IPatientNode {
    node: IPatient | null;
    cursor: string;
  }

  /**
   * Patient edges
   */
  interface IPatientEdges {
    edges: Array<IPatientNode>;
    pageInfo: IPageInfo;
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
   * ConcernDiagnosisCode
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

