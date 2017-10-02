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

  /*
    description: 
  */
  interface IRootQueryType {
    user: IUser | null;
    users: IUserEdges | null;
    userPatientPanel: IPatientEdges | null;
    currentUser: IUser | null;
    patient: IPatient | null;
    patientCareTeam: Array<IUser> | null;
    patientScratchPad: IPatientScratchPad | null;
    clinic: IClinic | null;
    clinics: IClinicEdges | null;
    patientEncounters: Array<IPatientEncounter> | null;
    patientMedications: IPatientMedications | null;
    task: ITask | null;
    tasksForPatient: ITaskEdges | null;
    tasksForCurrentUser: ITaskEdges | null;
    taskComments: ITaskCommentEdges | null;
    taskComment: ITaskComment | null;
    riskArea: IRiskArea | null;
    riskAreas: Array<IRiskArea> | null;
    question: IQuestion | null;
    questionsForRiskArea: Array<IQuestion>;
    answer: IAnswer | null;
    answersForQuestion: Array<IAnswer>;
    patientAnswer: IPatientAnswer | null;
    patientAnswersForQuestion: Array<IPatientAnswer> | null;
    patientPreviousAnswersForQuestion: Array<IPatientAnswer> | null;
    patientAnswersForRiskArea: Array<IPatientAnswer> | null;
    patientRiskAreaSummary: IRiskAreaSummary | null;
    patientRiskAreaRiskScore: IRiskScore | null;
    questionCondition: IQuestionCondition | null;
    eventNotificationsForCurrentUser: IEventNotificationEdges | null;
    eventNotificationsForTask: IEventNotificationEdges | null;
    taskTemplate: ITaskTemplate | null;
    concern: IConcern | null;
    concerns: Array<IConcern> | null;
    concernsForAnswer: Array<IConcern> | null;
    patientConcern: IPatientConcern | null;
    patientConcerns: Array<IPatientConcern> | null;
    patientGoal: IPatientGoal | null;
    patientGoals: Array<IPatientGoal> | null;
    goalSuggestionTemplate: IGoalSuggestionTemplate | null;
    goalSuggestionTemplates: Array<IGoalSuggestionTemplate> | null;
    goalSuggestionTemplatesForAnswer: Array<IGoalSuggestionTemplate> | null;
    taskTemplates: Array<ITaskTemplate> | null;
    carePlanSuggestionsForPatient: Array<ICarePlanSuggestion> | null;
    carePlanForPatient: ICarePlan | null;
  }

  /*
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
  }

  /*
    description: An object with a Globally Unique ID
  */
  type uniqueId = IUser | IPatient | IClinic | ITask | IPatientGoal | IGoalSuggestionTemplate | ITaskTemplate | ITaskComment | IRiskArea | IQuestion | IAnswer | IConcern | IQuestionCondition | IPatientAnswer | IEventNotification | ITaskEvent | IPatientConcern | ICarePlanSuggestion;

  /*
    description: An object with a Globally Unique ID
  */
  interface IUniqueId {
    id: string;
  }

  /*
    description: 
  */
  type IUserRoleEnum = 'physician' | 'nurseCareManager' | 'healthCoach' | 'familyMember' | 'anonymousUser' | 'admin';

  /*
    description: 
  */
  type IUserOrderOptionsEnum = 'createdAtDesc' | 'createdAtAsc' | 'lastLoginAtDesc' | 'lastLoginAtAsc' | 'updatedAtDesc' | 'updatedAtAsc';

  /*
    description: User edges
  */
  interface IUserEdges {
    edges: Array<IUserNode> | null;
    pageInfo: IPageInfo;
  }

  /*
    description: User node
  */
  interface IUserNode {
    node: IUser | null;
    cursor: string;
  }

  /*
    description: Page info for paginated responses
  */
  interface IPageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }

  /*
    description: Patient edges
  */
  interface IPatientEdges {
    edges: Array<IPatientNode> | null;
    pageInfo: IPageInfo;
  }

  /*
    description: Patient node
  */
  interface IPatientNode {
    node: IPatient | null;
    cursor: string;
  }

  /*
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

  /*
    description: Patient Scratch Pad
  */
  interface IPatientScratchPad {
    text: string | null;
  }

  /*
    description: Clinic
  */
  interface IClinic {
    id: string;
    name: string;
    departmentId: number;
    createdAt: string;
    updatedAt: string;
  }

  /*
    description: Clinic edges
  */
  interface IClinicEdges {
    edges: Array<IClinicNode> | null;
    pageInfo: IPageInfo;
  }

  /*
    description: Clinic node
  */
  interface IClinicNode {
    node: IClinic | null;
    cursor: string;
  }

  /*
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

  /*
    description: PatientDiagnosis
  */
  interface IPatientDiagnosis {
    code: string;
    codeSystem: string;
    description: string;
  }

  /*
    description: PatientMedications
  */
  interface IPatientMedications {
    medications: IPatientMedicationsDetails;
  }

  /*
    description: PatientMedicationsDetails
  */
  interface IPatientMedicationsDetails {
    active: Array<IPatientMedication>;
    inactive: Array<IPatientMedication>;
  }

  /*
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

  /*
    description: Task
  */
  interface ITask {
    id: string;
    title: string;
    description: string | null;
    patient: IPatient | null;
    patientId: string;
    dueAt: string | null;
    priority: IPriorityEnum | null;
    createdBy: IUser | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    completedBy: IUser | null;
    completedAt: string | null;
    assignedTo: IUser | null;
    followers: Array<IUser>;
    patientGoalId: string | null;
    patientGoal: IPatientGoal | null;
  }

  /*
    description: 
  */
  type IPriorityEnum = 'low' | 'medium' | 'high';

  /*
    description: 
  */
  interface IPatientGoal {
    id: string;
    title: string;
    patientId: string;
    patient: IPatient;
    patientConcernId: string | null;
    goalSuggestionTemplateId: string | null;
    goalSuggestionTemplate: IGoalSuggestionTemplate | null;
    tasks: Array<ITask>;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  /*
    description: 
  */
  interface IGoalSuggestionTemplate {
    id: string;
    title: string;
    taskTemplates: Array<ITaskTemplate> | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  /*
    description: 
  */
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

  /*
    description: 
  */
  type ICompletedWithinIntervalEnum = 'hour' | 'day' | 'week' | 'month' | 'year';

  /*
    description: 
  */
  type ITaskOrderOptionsEnum = 'createdAtDesc' | 'createdAtAsc' | 'dueAtDesc' | 'dueAtAsc' | 'updatedAtDesc' | 'updatedAtAsc';

  /*
    description: Task edges
  */
  interface ITaskEdges {
    edges: Array<ITaskNode> | null;
    pageInfo: IPageInfo;
  }

  /*
    description: Task node
  */
  interface ITaskNode {
    node: ITask | null;
    cursor: string;
  }

  /*
    description: Task comment edges
  */
  interface ITaskCommentEdges {
    edges: Array<ITaskCommentNode> | null;
    pageInfo: IPageInfo;
  }

  /*
    description: Task comment node
  */
  interface ITaskCommentNode {
    node: ITaskComment | null;
    cursor: string;
  }

  /*
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

  /*
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

  /*
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
    riskAreaId: string;
    applicableIfQuestionConditions: Array<IQuestionCondition>;
    applicableIfType: IQuestionConditionTypeOptionsEnum | null;
    order: number;
  }

  /*
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
    concernSuggestions: Array<IConcern> | null;
    goalSuggestions: Array<IGoalSuggestionTemplate> | null;
  }

  /*
    description: 
  */
  type IAnswerValueTypeOptionsEnum = 'string' | 'boolean' | 'number';

  /*
    description: 
  */
  type IRiskAdjustmentTypeOptionsEnum = 'inactive' | 'increment' | 'forceHighRisk';

  /*
    description: Concern
  */
  interface IConcern {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  /*
    description: 
  */
  type IAnswerTypeOptionsEnum = 'dropdown' | 'radio' | 'freetext' | 'multiselect';

  /*
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

  /*
    description: 
  */
  type IQuestionConditionTypeOptionsEnum = 'allTrue' | 'oneTrue';

  /*
    description: PatientAnswer
  */
  interface IPatientAnswer {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    answerId: string;
    answerValue: string;
    patientId: string;
    applicable: boolean | null;
    question: IQuestion | null;
  }

  /*
    description: 
  */
  interface IRiskAreaSummary {
    summary: Array<string>;
    started: boolean;
    lastUpdated: string | null;
  }

  /*
    description: 
  */
  interface IRiskScore {
    score: number;
    forceHighRisk: boolean;
  }

  /*
    description: Event Notification edges
  */
  interface IEventNotificationEdges {
    edges: Array<IEventNotificationNode> | null;
    pageInfo: IPageInfo;
  }

  /*
    description: Event Notification node
  */
  interface IEventNotificationNode {
    node: IEventNotification | null;
    cursor: string;
  }

  /*
    description: Event Notification
  */
  interface IEventNotification {
    id: string;
    title: string | null;
    userId: string;
    user: IUser;
    taskEventId: string | null;
    taskEvent: ITaskEvent | null;
    task: ITask | null;
    seenAt: string | null;
    emailSentAt: string | null;
    deliveredAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  /*
    description: Task Event
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
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }

  /*
    description: 
  */
  type ITaskEventTypesEnum = 'create_task' | 'add_follower' | 'remove_follower' | 'complete_task' | 'uncomplete_task' | 'delete_task' | 'add_comment' | 'edit_comment' | 'delete_comment' | 'edit_priority' | 'edit_due_date' | 'edit_assignee' | 'edit_title' | 'edit_description';

  /*
    description: 
  */
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

  /*
    description: 
  */
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
  }

  /*
    description: 
  */
  type ICarePlanSuggestionTypeEnum = 'concern' | 'goal';

  /*
    description: 
  */
  interface ICarePlan {
    goals: Array<IPatientGoal>;
    concerns: Array<IPatientConcern>;
  }

  /*
    description: 
  */
  interface IRootMutationType {
    userCreate: IUserWithAuthToken | null;
    userLogin: IUserWithAuthToken | null;
    userEditRole: IUser | null;
    userDelete: IUser | null;
    currentUserEdit: IUser | null;
    clinicCreate: IClinic | null;
    careTeamAddUser: Array<IUser> | null;
    careTeamRemoveUser: Array<IUser> | null;
    appointmentAddNote: IAppointmentAddNoteResult | null;
    appointmentStart: IAppointment | null;
    appointmentEnd: IAppointmentEndResult | null;
    patientEdit: IPatient | null;
    patientSetup: IPatient | null;
    patientScratchPadEdit: IPatientScratchPad | null;
    taskCreate: ITask | null;
    taskDelete: ITask | null;
    taskEdit: ITask | null;
    taskComplete: ITask | null;
    taskUncomplete: ITask | null;
    taskUserFollow: ITask | null;
    taskUserUnfollow: ITask | null;
    taskCommentCreate: ITaskComment | null;
    taskCommentEdit: ITaskComment | null;
    taskCommentDelete: ITaskComment | null;
    riskAreaCreate: IRiskArea | null;
    riskAreaEdit: IRiskArea | null;
    riskAreaDelete: IRiskArea | null;
    questionCreate: IQuestion | null;
    questionEdit: IQuestion | null;
    questionDelete: IQuestion | null;
    answerCreate: IAnswer | null;
    answerEdit: IAnswer | null;
    answerDelete: IAnswer | null;
    patientAnswersCreate: Array<IPatientAnswer> | null;
    patientAnswerEdit: IPatientAnswer | null;
    patientAnswerDelete: IPatientAnswer | null;
    patientAnswersUpdateApplicable: Array<IPatientAnswer> | null;
    questionConditionCreate: IQuestionCondition | null;
    questionConditionEdit: IQuestionCondition | null;
    questionConditionDelete: IQuestionCondition | null;
    eventNotificationDismiss: IEventNotification | null;
    concernCreate: IConcern | null;
    concernEdit: IConcern | null;
    concernDelete: IConcern | null;
    concernSuggestionCreate: Array<IConcern> | null;
    concernSuggestionDelete: Array<IConcern> | null;
    goalSuggestionTemplateCreate: IGoalSuggestionTemplate | null;
    goalSuggestionTemplateEdit: IGoalSuggestionTemplate | null;
    goalSuggestionTemplateDelete: IGoalSuggestionTemplate | null;
    goalSuggestionCreate: Array<IGoalSuggestionTemplate> | null;
    goalSuggestionDelete: Array<IGoalSuggestionTemplate> | null;
    taskTemplateCreate: ITaskTemplate | null;
    taskTemplateEdit: ITaskTemplate | null;
    taskTemplateDelete: ITaskTemplate | null;
    patientGoalCreate: IPatientGoal | null;
    patientGoalEdit: IPatientGoal | null;
    patientGoalDelete: IPatientGoal | null;
    patientConcernCreate: IPatientConcern | null;
    patientConcernEdit: IPatientConcern | null;
    patientConcernDelete: IPatientConcern | null;
    carePlanSuggestionAccept: ICarePlanSuggestion | null;
    carePlanSuggestionDismiss: ICarePlanSuggestion | null;
  }

  /*
    description: params for creating a user
  */
  interface IUserCreateInput {
    email: string;
    homeClinicId: string;
  }

  /*
    description: The user account with an optional auth token
  */
  interface IUserWithAuthToken {
    user: IUser;
    authToken: string | null;
  }

  /*
    description: params for logging in a user
  */
  interface IUserLoginInput {
    googleAuthCode: string;
  }

  /*
    description: params for editing a user - only supports user role
  */
  interface IUserEditRoleInput {
    userRole: string;
    email: string;
  }

  /*
    description: params for deleting a user
  */
  interface IUserDeleteInput {
    email: string;
  }

  /*
    description: params for editing a current user
  */
  interface ICurrentUserEditInput {
    locale?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  }

  /*
    description: params for creating a clinic
  */
  interface IClinicCreateInput {
    departmentId: number;
    name: string;
  }

  /*
    description: params for adding or removing patient from care team
  */
  interface ICareTeamInput {
    userId: string;
    patientId: string;
  }

  /*
    description: params for adding a note to an appointment
  */
  interface IAppointmentAddNoteInput {
    patientId: string;
    appointmentId: string;
    appointmentNote: string;
  }

  /*
    description: Appointment Add Note Result
  */
  interface IAppointmentAddNoteResult {
    success: boolean;
    appointmentNote: string;
  }

  /*
    description: params for starting an appointment
  */
  interface IAppointmentStartInput {
    patientId: string;
    appointmentTypeId?: number | null;
  }

  /*
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

  /*
    description: 
  */
  type IAppointmentStatusEnum = 'cancelled' | 'future' | 'open' | 'checkedIn' | 'checkedOut' | 'chargeEntered';

  /*
    description: params for ending an appointment
  */
  interface IAppointmentEndInput {
    patientId: string;
    appointmentId: string;
    appointmentNote?: string | null;
  }

  /*
    description: Appointment End Result
  */
  interface IAppointmentEndResult {
    success: boolean;
  }

  /*
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

  /*
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

  /*
    description: params for editing a patient scratch pad
  */
  interface IPatientScratchPadEditInput {
    patientId: string;
    text: string;
  }

  /*
    description: params for creating a task
  */
  interface ITaskCreateInput {
    title: string;
    description?: string | null;
    dueAt?: string | null;
    patientId: string;
    assignedToId?: string | null;
    patientGoalId?: string | null;
  }

  /*
    description: params for deleting a task
  */
  interface ITaskDeleteInput {
    taskId: string;
  }

  /*
    description: params for creating a task
  */
  interface ITaskEditInput {
    taskId: string;
    title?: string | null;
    description?: string | null;
    dueAt?: string | null;
    assignedToId?: string | null;
    priority?: string | null;
    patientGoalId?: string | null;
  }

  /*
    description: params for completing a task
  */
  interface ITaskCompleteInput {
    taskId: string;
  }

  /*
    description: params for adding user to a task's followers
  */
  interface ITaskFollowInput {
    userId: string;
    taskId: string;
  }

  /*
    description: params for creating a task comment
  */
  interface ITaskCommentCreateInput {
    taskId: string;
    body: string;
  }

  /*
    description: params for editing a task comment
  */
  interface ITaskCommentEditInput {
    taskCommentId: string;
    body: string;
  }

  /*
    description: params for deleting a task comment
  */
  interface ITaskCommentDeleteInput {
    taskCommentId: string;
  }

  /*
    description: 
  */
  interface IRiskAreaCreateInput {
    title: string;
    order: number;
  }

  /*
    description: 
  */
  interface IRiskAreaEditInput {
    riskAreaId: string;
    title?: string | null;
    order?: number | null;
  }

  /*
    description: 
  */
  interface IRiskAreaDeleteInput {
    riskAreaId: string;
  }

  /*
    description: 
  */
  interface IQuestionCreateInput {
    title: string;
    answerType: IAnswerTypeOptionsEnum;
    validatedSource?: string | null;
    riskAreaId: string;
    order: number;
    applicableIfType?: IQuestionConditionTypeOptionsEnum | null;
  }

  /*
    description: 
  */
  interface IQuestionEditInput {
    questionId: string;
    title?: string | null;
    answerType?: IAnswerTypeOptionsEnum | null;
    validatedSource?: string | null;
    riskAreaId?: string | null;
    order?: number | null;
    applicableIfType?: IQuestionConditionTypeOptionsEnum | null;
  }

  /*
    description: 
  */
  interface IQuestionDeleteInput {
    questionId: string;
  }

  /*
    description: 
  */
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

  /*
    description: 
  */
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

  /*
    description: 
  */
  interface IAnswerDeleteInput {
    answerId: string;
  }

  /*
    description: 
  */
  interface IPatientAnswersCreateInput {
    patientId: string;
    patientAnswers: Array<IPatientAnswerInput>;
    questionIds: Array<string>;
  }

  /*
    description: 
  */
  interface IPatientAnswerInput {
    answerId: string;
    answerValue: string;
    patientId: string;
    applicable: boolean;
    questionId: string;
  }

  /*
    description: 
  */
  interface IPatientAnswerEditInput {
    applicable: boolean;
    patientAnswerId: string;
  }

  /*
    description: 
  */
  interface IPatientAnswerDeleteInput {
    patientAnswerId: string;
  }

  /*
    description: 
  */
  interface IPatientAnswersUpdateApplicableInput {
    patientId: string;
    riskAreaId: string;
  }

  /*
    description: 
  */
  interface IQuestionConditionCreateInput {
    questionId: string;
    answerId: string;
  }

  /*
    description: QuestionCondition edit input - for validation, need to edit question and answer at the same time
  */
  interface IQuestionConditionEditInput {
    questionConditionId: string;
    questionId: string;
    answerId: string;
  }

  /*
    description: 
  */
  interface IQuestionConditionDeleteInput {
    questionConditionId: string;
  }

  /*
    description: EventNotification edit input
  */
  interface IEventNotificationEditInput {
    eventNotificationId: string;
  }

  /*
    description: 
  */
  interface IConcernCreateInput {
    title: string;
  }

  /*
    description: 
  */
  interface IConcernEditInput {
    title: string;
    concernId: string;
  }

  /*
    description: 
  */
  interface IConcernDeleteInput {
    concernId: string;
  }

  /*
    description: 
  */
  interface IConcernSuggestInput {
    concernId: string;
    answerId: string;
  }

  /*
    description: 
  */
  interface IGoalSuggestionTemplateCreateInput {
    title: string;
  }

  /*
    description: 
  */
  interface IGoalSuggestionTemplateEditInput {
    title: string;
    goalSuggestionTemplateId: string;
  }

  /*
    description: 
  */
  interface IGoalSuggestionTemplateDeleteInput {
    goalSuggestionTemplateId: string;
  }

  /*
    description: 
  */
  interface IGoalSuggestInput {
    answerId: string;
    goalSuggestionTemplateId: string;
  }

  /*
    description: 
  */
  interface ITaskTemplateCreateInput {
    title: string;
    completedWithinNumber?: number | null;
    completedWithinInterval?: string | null;
    repeating?: boolean | null;
    goalSuggestionTemplateId: string;
    priority?: string | null;
    careTeamAssigneeRole?: string | null;
  }

  /*
    description: 
  */
  interface ITaskTemplateEditInput {
    title: string;
    completedWithinNumber?: number | null;
    completedWithinInterval?: string | null;
    repeating?: boolean | null;
    goalSuggestionTemplateId?: string | null;
    priority?: string | null;
    careTeamAssigneeRole?: string | null;
    taskTemplateId: string;
  }

  /*
    description: 
  */
  interface ITaskTemplateDeleteInput {
    taskTemplateId: string;
  }

  /*
    description: 
  */
  interface IPatientGoalCreateInput {
    title: string;
    patientId: string;
    patientConcernId?: string | null;
    goalSuggestionTemplateId?: string | null;
    taskTemplateIds?: Array<string> | null;
    concernId?: string | null;
    concernTitle?: string | null;
    startedAt?: string | null;
  }

  /*
    description: 
  */
  interface IPatientGoalEditInput {
    patientGoalId: string;
    title: string;
    patientConcernId?: string | null;
    goalSuggestionTemplateId?: string | null;
  }

  /*
    description: 
  */
  interface IPatientGoalDeleteInput {
    patientGoalId: string;
  }

  /*
    description: 
  */
  interface IPatientConcernCreateInput {
    concernId: string;
    patientId: string;
    startedAt?: string | null;
    completedAt?: string | null;
  }

  /*
    description: 
  */
  interface IPatientConcernEditInput {
    order?: number | null;
    concernId?: string | null;
    patientId?: string | null;
    startedAt?: string | null;
    completedAt?: string | null;
    patientConcernId: string;
  }

  /*
    description: 
  */
  interface IPatientConcernDeleteInput {
    patientConcernId: string;
  }

  /*
    description: 
  */
  interface ICarePlanSuggestionAcceptInput {
    carePlanSuggestionId: string;
    patientConcernId?: string | null;
    concernId?: string | null;
    concernTitle?: string | null;
    startedAt?: string | null;
    taskTemplateIds?: Array<string> | null;
  }

  /*
    description: 
  */
  interface ICarePlanSuggestionDismissInput {
    carePlanSuggestionId: string;
    dismissedReason: string;
  }

  /*
    description: 
  */
  interface IRiskAreaStatistic {
    riskArea: IRiskArea;
    summaryData: IRiskAreaSummary;
    scoreData: IRiskScore;
  }

  /*
    description: 
  */
  interface IThreeSixtySummary {
    riskAreas: Array<IRiskAreaStatistic>;
  }
}
