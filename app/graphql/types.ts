/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type AnswerValueTypeOptions =
  "string" |
  "boolean" |
  "number";


export type RiskAdjustmentTypeOptions =
  "increment" |
  "forceHighRisk";


export type AppointmentStatus =
  "cancelled" |
  "future" |
  "open" |
  "checkedIn" |
  "checkedOut" |
  "chargeEntered";


export type UserRole =
  "physician" |
  "nurseCareManager" |
  "healthCoach" |
  "familyMember" |
  "anonymousUser" |
  "admin";


export type TaskOrderOptions =
  "createdAtDesc" |
  "createdAtAsc" |
  "dueAtDesc" |
  "dueAtAsc" |
  "updatedAtDesc" |
  "updatedAtAsc";


export type AnswerTypeOptions =
  "dropdown" |
  "radio" |
  "freetext" |
  "multiselect";


export type QuestionConditionTypeOptions =
  "allTrue" |
  "oneTrue";


export type answerCreateMutationVariables = {
  displayValue: string,
  value: string,
  valueType: AnswerValueTypeOptions,
  riskAdjustmentType?: RiskAdjustmentTypeOptions | null,
  inSummary?: boolean | null,
  summaryText?: string | null,
  questionId: string,
  order: number,
};

export type answerCreateMutation = {
  // Create an Answer
  answerCreate:  {
    id: string,
    displayValue: string,
    value: string,
    valueType: AnswerValueTypeOptions,
    riskAdjustmentType: RiskAdjustmentTypeOptions | null,
    inSummary: boolean | null,
    summaryText: string | null,
    questionId: string,
    order: number,
  } | null,
};

export type answerDeleteMutationVariables = {
  answerId: string,
};

export type answerDeleteMutation = {
  // Deletes an Answer
  answerDelete:  {
    id: string,
    displayValue: string,
    value: string,
    valueType: AnswerValueTypeOptions,
    riskAdjustmentType: RiskAdjustmentTypeOptions | null,
    inSummary: boolean | null,
    summaryText: string | null,
    questionId: string,
    order: number,
  } | null,
};

export type answerEditMutationVariables = {
  answerId: string,
  displayValue?: string | null,
  value?: string | null,
  valueType?: AnswerValueTypeOptions | null,
  riskAdjustmentType?: RiskAdjustmentTypeOptions | null,
  inSummary?: boolean | null,
  summaryText?: string | null,
  questionId?: string | null,
  order?: number | null,
};

export type answerEditMutation = {
  // Edit an Answer
  answerEdit:  {
    id: string,
    displayValue: string,
    value: string,
    valueType: AnswerValueTypeOptions,
    riskAdjustmentType: RiskAdjustmentTypeOptions | null,
    inSummary: boolean | null,
    summaryText: string | null,
    questionId: string,
    order: number,
  } | null,
};

export type appointmentEndMutationVariables = {
  patientId: string,
  appointmentId: string,
  appointmentNote: string,
};

export type appointmentEndMutation = {
  // End an appointment
  appointmentEnd:  {
    success: boolean,
  } | null,
};

export type appointmentStartMutationVariables = {
  patientId: string,
};

export type appointmentStartMutation = {
  // Start an appointment
  appointmentStart:  {
    athenaAppointmentId: string,
    dateTime: string,
    athenaDepartmentId: number,
    status: AppointmentStatus,
    athenaPatientId: number,
    duration: number,
    appointmentTypeId: number,
    appointmentType: string,
    athenaProviderId: number,
    userId: string,
    patientId: string,
    clinicId: string,
  } | null,
};

export type getClinicsQueryVariables = {
  pageNumber?: number | null,
  pageSize?: number | null,
};

export type getClinicsQuery = {
  // Clinics
  clinics:  {
    edges:  Array< {
      node:  {
        id: string,
        name: string,
      } | null,
    } | null > | null,
  } | null,
};

export type currentUserEditMutationVariables = {
  firstName?: string | null,
  lastName?: string | null,
  locale?: string | null,
};

export type currentUserEditMutation = {
  // Edit current user
  currentUserEdit:  {
    id: string,
    locale: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
  } | null,
};

export type getAnswerQueryVariables = {
  answerId: string,
};

export type getAnswerQuery = {
  // Answer
  answer:  {
    id: string,
    displayValue: string,
    value: string,
    valueType: AnswerValueTypeOptions,
    riskAdjustmentType: RiskAdjustmentTypeOptions | null,
    inSummary: boolean | null,
    summaryText: string | null,
    questionId: string,
    order: number,
  } | null,
};

export type getCurrentUserQuery = {
  // The current User
  currentUser:  {
    id: string,
    locale: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
  } | null,
};

export type getPatientCareTeamQueryVariables = {
  patientId: string,
};

export type getPatientCareTeamQuery = {
  // Users on a care team
  patientCareTeam:  Array< {
    id: string,
    locale: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
  } | null > | null,
};

export type getPatientEncountersQueryVariables = {
  patientId: string,
};

export type getPatientEncountersQuery = {
  // Patient encounters
  patientEncounters:  Array< {
    encounterType: string,
    providerName: string,
    providerRole: string,
    location: string,
    diagnoses:  Array< {
      code: string,
      codeSystem: string,
      description: string,
    } | null >,
    reasons: Array< string | null >,
    dateTime: string,
  } | null > | null,
};

export type getPatientMedicationsQueryVariables = {
  patientId: string,
};

export type getPatientMedicationsQuery = {
  // Patient medications
  patientMedications:  {
    medications:  {
      active:  Array< {
        medicationId: string,
        name: string,
        quantity: string | null,
        quantityUnit: string | null,
        dosageInstructions: string | null,
        startDate: string | null,
      } | null >,
    },
  } | null,
};

export type getPatientPanelQueryVariables = {
  pageNumber?: number | null,
  pageSize?: number | null,
};

export type getPatientPanelQuery = {
  // List of patients the user is on the care team for (their 'patient panel')
  userPatientPanel:  {
    edges:  Array< {
      node:  {
        id: string,
        firstName: string | null,
        middleName: string | null,
        lastName: string | null,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: number | null,
        createdAt: string | null,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      } | null,
    } | null > | null,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
  } | null,
};

export type getPatientScratchPadQueryVariables = {
  patientId: string,
};

export type getPatientScratchPadQuery = {
  // Patient scratch pad
  patientScratchPad:  {
    text: string | null,
  } | null,
};

export type getPatientTasksQueryVariables = {
  patientId: string,
  pageNumber?: number | null,
  pageSize?: number | null,
  orderBy?: TaskOrderOptions | null,
};

export type getPatientTasksQuery = {
  // Patient's Tasks
  tasksForPatient:  {
    edges:  Array< {
      node:  {
        id: string,
        title: string,
        description: string | null,
        createdAt: string | null,
        updatedAt: string | null,
        completedAt: string | null,
        deletedAt: string | null,
        dueAt: string | null,
        patientId: string,
        priority: string | null,
        patient:  {
          id: string,
          firstName: string | null,
          middleName: string | null,
          lastName: string | null,
        } | null,
        assignedTo:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } | null,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } | null,
        followers:  Array< {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } > | null,
      } | null,
    } | null > | null,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
  } | null,
};

export type getPatientQueryVariables = {
  patientId: string,
};

export type getPatientQuery = {
  // A single Patient
  patient:  {
    id: string,
    firstName: string | null,
    middleName: string | null,
    lastName: string | null,
    language: string | null,
    gender: string | null,
    dateOfBirth: string | null,
    zip: number | null,
    createdAt: string | null,
    consentToText: boolean | null,
    consentToCall: boolean | null,
  } | null,
};

export type getQuestionAnswersQueryVariables = {
  questionId: string,
};

export type getQuestionAnswersQuery = {
  // Answers
  answersForQuestion:  Array< {
    id: string,
    displayValue: string,
    value: string,
    valueType: AnswerValueTypeOptions,
    riskAdjustmentType: RiskAdjustmentTypeOptions | null,
    inSummary: boolean | null,
    summaryText: string | null,
    questionId: string,
    order: number,
  } | null >,
};

export type getQuestionQueryVariables = {
  questionId: string,
};

export type getQuestionQuery = {
  // Question
  question:  {
    id: string,
    createdAt: string,
    deletedAt: string | null,
    title: string,
    validatedSource: string | null,
    answerType: AnswerTypeOptions,
    riskAreaId: string,
    order: number,
    applicableIfType: QuestionConditionTypeOptions | null,
    answers:  Array< {
      id: string,
      displayValue: string,
      value: string,
      valueType: AnswerValueTypeOptions,
      riskAdjustmentType: RiskAdjustmentTypeOptions | null,
      inSummary: boolean | null,
      summaryText: string | null,
      questionId: string,
      order: number,
    } | null >,
  } | null,
};

export type getQuestionsForRiskAreaQueryVariables = {
  riskAreaId: string,
};

export type getQuestionsForRiskAreaQuery = {
  // Questions
  questionsForRiskArea:  Array< {
    id: string,
    createdAt: string,
    deletedAt: string | null,
    title: string,
    validatedSource: string | null,
    answerType: AnswerTypeOptions,
    riskAreaId: string,
    order: number,
    applicableIfType: QuestionConditionTypeOptions | null,
    answers:  Array< {
      id: string,
      displayValue: string,
      value: string,
      valueType: AnswerValueTypeOptions,
      riskAdjustmentType: RiskAdjustmentTypeOptions | null,
      inSummary: boolean | null,
      summaryText: string | null,
      questionId: string,
      order: number,
    } | null >,
  } | null >,
};

export type getRiskAreaQueryVariables = {
  riskAreaId: string,
};

export type getRiskAreaQuery = {
  // RiskArea
  riskArea:  {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    order: number,
  } | null,
};

export type getRiskAreasQuery = {
  // RiskAreas
  riskAreas:  Array< {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    order: number,
  } | null > | null,
};

export type getTaskCommentQueryVariables = {
  taskCommentId: string,
};

export type getTaskCommentQuery = {
  // Single task comment
  taskComment:  {
    id: string,
    body: string,
    user:  {
      id: string,
      locale: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
    },
    taskId: string,
    createdAt: string | null,
    updatedAt: string | null,
  } | null,
};

export type getTaskCommentsQueryVariables = {
  taskId: string,
  pageNumber?: number | null,
  pageSize?: number | null,
};

export type getTaskCommentsQuery = {
  // List of task comments
  taskComments:  {
    edges:  Array< {
      node:  {
        id: string,
        body: string,
        user:  {
          id: string,
          locale: string | null,
          firstName: string | null,
          lastName: string | null,
          userRole: UserRole,
          email: string | null,
          homeClinicId: string,
          googleProfileImageUrl: string | null,
        },
        taskId: string,
        createdAt: string | null,
        updatedAt: string | null,
      } | null,
    } | null > | null,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
  } | null,
};

export type getTaskQueryVariables = {
  taskId: string,
};

export type getTaskQuery = {
  // Task
  task:  {
    id: string,
    title: string,
    description: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: string | null,
    patient:  {
      id: string,
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
    } | null,
    assignedTo:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } > | null,
  } | null,
};

export type logInUserMutationVariables = {
  googleAuthCode: string,
};

export type logInUserMutation = {
  // Login user
  userLogin:  {
    // The auth token to allow for quick login. JWT passed back in via headers for further requests
    authToken: string | null,
    user:  {
      id: string,
      locale: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
    },
  } | null,
};

export type patientEditMutationVariables = {
  patientId: string,
  firstName?: string | null,
  middleName?: string | null,
  lastName?: string | null,
  dateOfBirth?: string | null,
  gender?: string | null,
  zip?: number | null,
  language?: string | null,
  consentToCall?: boolean | null,
  consentToText?: boolean | null,
};

export type patientEditMutation = {
  // Edit fields on patient stored in the db
  patientEdit:  {
    id: string,
    firstName: string | null,
    middleName: string | null,
    lastName: string | null,
    language: string | null,
    gender: string | null,
    dateOfBirth: string | null,
    zip: number | null,
    createdAt: string | null,
    consentToText: boolean | null,
    consentToCall: boolean | null,
  } | null,
};

export type patientHealthRecordQueryVariables = {
  patientId: string,
};

export type patientHealthRecordQuery = {
  // Patient's Athena health record
  patientHealthRecord:  {
    id: string,
    firstName: string | null,
    lastName: string | null,
    dateOfBirth: string | null,
    gender: string | null,
    suffix: string | null,
    preferredName: string | null,
    raceName: string | null,
    race: string | null,
    status: string | null,
    ssn: string | null,
    homebound: boolean | null,
    language6392code: string | null,
    maritalStatus: string | null,
    maritalStatusName: string | null,
    patientPhoto: boolean | null,
    patientPhotoUrl: string | null,
  } | null,
};

export type patientScratchPadEditMutationVariables = {
  patientId: string,
  text: string,
};

export type patientScratchPadEditMutation = {
  // Edit a patient scratch pad
  patientScratchPadEdit:  {
    text: string | null,
  } | null,
};

export type patientSetupMutationVariables = {
  homeClinicId: string,
  firstName: string,
  middleName?: string | null,
  lastName: string,
  dateOfBirth: string,
  gender: string,
  maritalStatus: string,
  race: string,
  zip: number,
  ssn: string,
  language: string,
  email?: string | null,
  homePhone?: string | null,
  mobilePhone?: string | null,
  consentToCall: boolean,
  consentToText: boolean,
  issueDate?: string | null,
  expirationDate?: string | null,
  insuranceType?: string | null,
  patientRelationshipToPolicyHolder?: string | null,
  memberId?: string | null,
  policyGroupNumber?: string | null,
};

export type patientSetupMutation = {
  // Setup patient creates the patient in the db AND in athena
  patientSetup:  {
    id: string,
    firstName: string | null,
    middleName: string | null,
    lastName: string | null,
    language: string | null,
    gender: string | null,
    dateOfBirth: string | null,
    zip: number | null,
    createdAt: string | null,
    consentToText: boolean | null,
    consentToCall: boolean | null,
  } | null,
};

export type questionCreateMutationVariables = {
  title: string,
  answerType: AnswerTypeOptions,
  validatedSource?: string | null,
  riskAreaId: string,
  order: number,
  applicableIfType?: QuestionConditionTypeOptions | null,
};

export type questionCreateMutation = {
  // Create a Question
  questionCreate:  {
    id: string,
    createdAt: string,
    deletedAt: string | null,
    title: string,
    validatedSource: string | null,
    answerType: AnswerTypeOptions,
    riskAreaId: string,
    order: number,
    applicableIfType: QuestionConditionTypeOptions | null,
    answers:  Array< {
      id: string,
      displayValue: string,
      value: string,
      valueType: AnswerValueTypeOptions,
      riskAdjustmentType: RiskAdjustmentTypeOptions | null,
      inSummary: boolean | null,
      summaryText: string | null,
      questionId: string,
      order: number,
    } | null >,
  } | null,
};

export type questionDeleteMutationVariables = {
  questionId: string,
};

export type questionDeleteMutation = {
  // Delete a question
  questionDelete:  {
    id: string,
    createdAt: string,
    deletedAt: string | null,
    title: string,
    validatedSource: string | null,
    answerType: AnswerTypeOptions,
    riskAreaId: string,
    order: number,
    applicableIfType: QuestionConditionTypeOptions | null,
    answers:  Array< {
      id: string,
      displayValue: string,
      value: string,
      valueType: AnswerValueTypeOptions,
      riskAdjustmentType: RiskAdjustmentTypeOptions | null,
      inSummary: boolean | null,
      summaryText: string | null,
      questionId: string,
      order: number,
    } | null >,
  } | null,
};

export type questionEditMutationVariables = {
  questionId: string,
  title?: string | null,
  answerType?: AnswerTypeOptions | null,
  validatedSource?: string | null,
  riskAreaId?: string | null,
  order?: number | null,
  applicableIfType?: QuestionConditionTypeOptions | null,
};

export type questionEditMutation = {
  // Edit a Question
  questionEdit:  {
    id: string,
    createdAt: string,
    deletedAt: string | null,
    title: string,
    validatedSource: string | null,
    answerType: AnswerTypeOptions,
    riskAreaId: string,
    order: number,
    applicableIfType: QuestionConditionTypeOptions | null,
    answers:  Array< {
      id: string,
      displayValue: string,
      value: string,
      valueType: AnswerValueTypeOptions,
      riskAdjustmentType: RiskAdjustmentTypeOptions | null,
      inSummary: boolean | null,
      summaryText: string | null,
      questionId: string,
      order: number,
    } | null >,
  } | null,
};

export type riskAreaCreateMutationVariables = {
  title: string,
  order: number,
};

export type riskAreaCreateMutation = {
  // Create a RiskArea
  riskAreaCreate:  {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    order: number,
  } | null,
};

export type riskAreaDeleteMutationVariables = {
  riskAreaId: string,
};

export type riskAreaDeleteMutation = {
  // Deletes a RiskArea
  riskAreaDelete:  {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    order: number,
  } | null,
};

export type riskAreaEditMutationVariables = {
  riskAreaId: string,
  title?: string | null,
  order?: number | null,
};

export type riskAreaEditMutation = {
  // Edit a RiskArea
  riskAreaEdit:  {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    order: number,
  } | null,
};

export type taskCommentCreateMutationVariables = {
  taskId: string,
  body: string,
};

export type taskCommentCreateMutation = {
  // Create a task
  taskCommentCreate:  {
    id: string,
    body: string,
    user:  {
      id: string,
      locale: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
    },
    taskId: string,
    createdAt: string | null,
    updatedAt: string | null,
  } | null,
};

export type taskCommentEditMutationVariables = {
  taskCommentId: string,
  body: string,
};

export type taskCommentEditMutation = {
  // Edit a task
  taskCommentEdit:  {
    id: string,
    body: string,
    user:  {
      id: string,
      locale: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
    },
    taskId: string,
    createdAt: string | null,
    updatedAt: string | null,
  } | null,
};

export type taskCompleteMutationVariables = {
  taskId: string,
};

export type taskCompleteMutation = {
  // Complete a task
  taskComplete:  {
    id: string,
    title: string,
    description: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: string | null,
    patient:  {
      id: string,
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
    } | null,
    assignedTo:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } > | null,
  } | null,
};

export type taskCreateMutationVariables = {
  title: string,
  description: string,
  dueAt: string,
  patientId: string,
  assignedToId?: string | null,
};

export type taskCreateMutation = {
  // Create a task
  taskCreate:  {
    id: string,
    title: string,
    description: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: string | null,
    patient:  {
      id: string,
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
    } | null,
    assignedTo:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } > | null,
  } | null,
};

export type taskDeleteMutationVariables = {
  taskId: string,
};

export type taskDeleteMutation = {
  // Delete a task
  taskDelete:  {
    id: string,
    title: string,
    description: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: string | null,
    patient:  {
      id: string,
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
    } | null,
    assignedTo:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } > | null,
  } | null,
};

export type taskEditMutationVariables = {
  taskId: string,
  assignedToId?: string | null,
  title?: string | null,
  description?: string | null,
  priority?: string | null,
  dueAt?: string | null,
};

export type taskEditMutation = {
  // Edit a task
  taskEdit:  {
    id: string,
    title: string,
    description: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: string | null,
    patient:  {
      id: string,
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
    } | null,
    assignedTo:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } > | null,
  } | null,
};

export type taskUncompleteMutationVariables = {
  taskId: string,
};

export type taskUncompleteMutation = {
  // Uncomplete a task
  taskUncomplete:  {
    id: string,
    title: string,
    description: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: string | null,
    patient:  {
      id: string,
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
    } | null,
    assignedTo:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } > | null,
  } | null,
};

export type taskUserFollowMutationVariables = {
  taskId: string,
  userId: string,
};

export type taskUserFollowMutation = {
  // Add user to task followers
  taskUserFollow:  {
    id: string,
    title: string,
    description: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: string | null,
    patient:  {
      id: string,
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
    } | null,
    assignedTo:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } > | null,
  } | null,
};

export type getTasksForCurrentUserQueryVariables = {
  pageNumber?: number | null,
  pageSize?: number | null,
  orderBy?: TaskOrderOptions | null,
};

export type getTasksForCurrentUserQuery = {
  // Current user's Tasks
  tasksForCurrentUser:  {
    edges:  Array< {
      node:  {
        id: string,
        title: string,
        description: string | null,
        createdAt: string | null,
        updatedAt: string | null,
        completedAt: string | null,
        deletedAt: string | null,
        dueAt: string | null,
        patientId: string,
        priority: string | null,
        patient:  {
          id: string,
          firstName: string | null,
          middleName: string | null,
          lastName: string | null,
        } | null,
        assignedTo:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } | null,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } | null,
        followers:  Array< {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } > | null,
      } | null,
    } | null > | null,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
  } | null,
};

export type FullAnswerFragment = {
  id: string,
  displayValue: string,
  value: string,
  valueType: AnswerValueTypeOptions,
  riskAdjustmentType: RiskAdjustmentTypeOptions | null,
  inSummary: boolean | null,
  summaryText: string | null,
  questionId: string,
  order: number,
};

export type FullAppointmentFragment = {
  athenaAppointmentId: string,
  dateTime: string,
  athenaDepartmentId: number,
  status: AppointmentStatus,
  athenaPatientId: number,
  duration: number,
  appointmentTypeId: number,
  appointmentType: string,
  athenaProviderId: number,
  userId: string,
  patientId: string,
  clinicId: string,
};

export type FullClinicFragment = {
  id: string,
  name: string,
};

export type FullPatientEncounterFragment = {
  encounterType: string,
  providerName: string,
  providerRole: string,
  location: string,
  diagnoses:  Array< {
    code: string,
    codeSystem: string,
    description: string,
  } | null >,
  reasons: Array< string | null >,
  dateTime: string,
};

export type FullPatientHealthRecordFragment = {
  id: string,
  firstName: string | null,
  lastName: string | null,
  dateOfBirth: string | null,
  gender: string | null,
  suffix: string | null,
  preferredName: string | null,
  raceName: string | null,
  race: string | null,
  status: string | null,
  ssn: string | null,
  homebound: boolean | null,
  language6392code: string | null,
  maritalStatus: string | null,
  maritalStatusName: string | null,
  patientPhoto: boolean | null,
  patientPhotoUrl: string | null,
};

export type FullPatientMedicationFragment = {
  medicationId: string,
  name: string,
  quantity: string | null,
  quantityUnit: string | null,
  dosageInstructions: string | null,
  startDate: string | null,
};

export type FullPatientScratchPadFragment = {
  text: string | null,
};

export type FullQuestionFragment = {
  id: string,
  createdAt: string,
  deletedAt: string | null,
  title: string,
  validatedSource: string | null,
  answerType: AnswerTypeOptions,
  riskAreaId: string,
  order: number,
  applicableIfType: QuestionConditionTypeOptions | null,
  answers:  Array< {
    id: string,
    displayValue: string,
    value: string,
    valueType: AnswerValueTypeOptions,
    riskAdjustmentType: RiskAdjustmentTypeOptions | null,
    inSummary: boolean | null,
    summaryText: string | null,
    questionId: string,
    order: number,
  } | null >,
};

export type FullRiskAreaFragment = {
  id: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
  title: string,
  order: number,
};

export type FullTaskCommentFragment = {
  id: string,
  body: string,
  user:  {
    id: string,
    locale: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
  },
  taskId: string,
  createdAt: string | null,
  updatedAt: string | null,
};

export type FullTaskFragment = {
  id: string,
  title: string,
  description: string | null,
  createdAt: string | null,
  updatedAt: string | null,
  completedAt: string | null,
  deletedAt: string | null,
  dueAt: string | null,
  patientId: string,
  priority: string | null,
  patient:  {
    id: string,
    firstName: string | null,
    middleName: string | null,
    lastName: string | null,
  } | null,
  assignedTo:  {
    id: string,
    firstName: string | null,
    lastName: string | null,
    googleProfileImageUrl: string | null,
    userRole: UserRole,
  } | null,
  createdBy:  {
    id: string,
    firstName: string | null,
    lastName: string | null,
    googleProfileImageUrl: string | null,
    userRole: UserRole,
  } | null,
  followers:  Array< {
    id: string,
    firstName: string | null,
    lastName: string | null,
    googleProfileImageUrl: string | null,
    userRole: UserRole,
  } > | null,
};

export type FullUserFragment = {
  id: string,
  locale: string | null,
  firstName: string | null,
  lastName: string | null,
  userRole: UserRole,
  email: string | null,
  homeClinicId: string,
  googleProfileImageUrl: string | null,
};

export type ShortPatientFragment = {
  id: string,
  firstName: string | null,
  middleName: string | null,
  lastName: string | null,
  language: string | null,
  gender: string | null,
  dateOfBirth: string | null,
  zip: number | null,
  createdAt: string | null,
  consentToText: boolean | null,
  consentToCall: boolean | null,
};

export type ShortUserFragment = {
  id: string,
  firstName: string | null,
  lastName: string | null,
  googleProfileImageUrl: string | null,
};
/* tslint:enable */
