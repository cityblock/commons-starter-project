/* tslint:disable */
//  This file was automatically generated and should not be edited.

export enum AnswerValueTypeOptions {
  string = "string",
  boolean = "boolean",
  number = "number",
}


export enum RiskAdjustmentTypeOptions {
  inactive = "inactive",
  increment = "increment",
  forceHighRisk = "forceHighRisk",
}


export enum CarePlanSuggestionType {
  concern = "concern",
  goal = "goal",
}


export enum CarePlanUpdateEventTypes {
  create_patient_concern = "create_patient_concern",
  edit_patient_concern = "edit_patient_concern",
  delete_patient_concern = "delete_patient_concern",
  create_patient_goal = "create_patient_goal",
  edit_patient_goal = "edit_patient_goal",
  delete_patient_goal = "delete_patient_goal",
}


export enum ComputedFieldDataTypes {
  boolean = "boolean",
  string = "string",
  number = "number",
}


export enum PatientAnswerEventTypes {
  create_patient_answer = "create_patient_answer",
}


export enum AnswerTypeOptions {
  dropdown = "dropdown",
  radio = "radio",
  freetext = "freetext",
  multiselect = "multiselect",
}


export enum QuestionConditionTypeOptions {
  allTrue = "allTrue",
  oneTrue = "oneTrue",
}


export enum QuickCallDirection {
  Inbound = "Inbound",
  Outbound = "Outbound",
}


export enum AssessmentType {
  automated = "automated",
  manual = "manual",
}


export enum Priority {
  low = "low",
  medium = "medium",
  high = "high",
}


export enum TaskEventTypes {
  create_task = "create_task",
  add_follower = "add_follower",
  remove_follower = "remove_follower",
  complete_task = "complete_task",
  uncomplete_task = "uncomplete_task",
  delete_task = "delete_task",
  add_comment = "add_comment",
  edit_comment = "edit_comment",
  delete_comment = "delete_comment",
  edit_priority = "edit_priority",
  edit_due_date = "edit_due_date",
  edit_assignee = "edit_assignee",
  edit_title = "edit_title",
  edit_description = "edit_description",
  cbo_referral_edit_sent_at = "cbo_referral_edit_sent_at",
  cbo_referral_edit_acknowledged_at = "cbo_referral_edit_acknowledged_at",
}


export enum CompletedWithinInterval {
  hour = "hour",
  day = "day",
  week = "week",
  month = "month",
  year = "year",
}


export enum UserRole {
  physician = "physician",
  nurseCareManager = "nurseCareManager",
  primaryCarePhysician = "primaryCarePhysician",
  communityHealthPartner = "communityHealthPartner",
  psychiatrist = "psychiatrist",
  healthCoach = "healthCoach",
  familyMember = "familyMember",
  anonymousUser = "anonymousUser",
  admin = "admin",
}


export enum ComputedFieldOrderOptions {
  labelDesc = "labelDesc",
  labelAsc = "labelAsc",
  slugDesc = "slugDesc",
  slugAsc = "slugAsc",
}


export enum ConcernOrderOptions {
  createdAtDesc = "createdAtDesc",
  createdAtAsc = "createdAtAsc",
  titleDesc = "titleDesc",
  titleAsc = "titleAsc",
  updatedAtDesc = "updatedAtDesc",
  updatedAtAsc = "updatedAtAsc",
}


export enum GoalSuggestionOrderOptions {
  createdAtDesc = "createdAtDesc",
  createdAtAsc = "createdAtAsc",
  titleDesc = "titleDesc",
  titleAsc = "titleAsc",
  updatedAtDesc = "updatedAtDesc",
  updatedAtAsc = "updatedAtAsc",
}


export enum AnswerFilterType {
  question = "question",
  progressNote = "progressNote",
  riskArea = "riskArea",
  screeningTool = "screeningTool",
  patientScreeningToolSubmission = "patientScreeningToolSubmission",
  riskAreaAssessmentSubmission = "riskAreaAssessmentSubmission",
}


export enum TaskOrderOptions {
  createdAtDesc = "createdAtDesc",
  createdAtAsc = "createdAtAsc",
  dueAtDesc = "dueAtDesc",
  dueAtAsc = "dueAtAsc",
  updatedAtDesc = "updatedAtDesc",
  updatedAtAsc = "updatedAtAsc",
  titleAsc = "titleAsc",
  titleDesc = "titleDesc",
}


export enum QuestionFilterType {
  progressNoteTemplate = "progressNoteTemplate",
  riskArea = "riskArea",
  screeningTool = "screeningTool",
}


export enum UserOrderOptions {
  createdAtDesc = "createdAtDesc",
  createdAtAsc = "createdAtAsc",
  lastLoginAtDesc = "lastLoginAtDesc",
  lastLoginAtAsc = "lastLoginAtAsc",
  updatedAtDesc = "updatedAtDesc",
  updatedAtAsc = "updatedAtAsc",
  emailAsc = "emailAsc",
}


export interface PatientAnswerInput {
  answerId: string,
  answerValue: string,
  patientId: string,
  applicable: boolean,
  questionId: string,
};

export interface PatientConcernBulkEditFields {
  id: string,
  order?: number | null,
  startedAt?: string | null,
  completedAt?: string | null,
};

export interface answerCreateMutationVariables {
  displayValue: string,
  value: string,
  valueType: AnswerValueTypeOptions,
  riskAdjustmentType?: RiskAdjustmentTypeOptions | null,
  inSummary?: boolean | null,
  summaryText?: string | null,
  questionId: string,
  order: number,
};

export interface answerCreateMutation {
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
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    } > | null,
    goalSuggestions:  Array< {
      id: string,
      title: string,
      taskTemplates:  Array< {
        id: string,
        title: string,
        completedWithinNumber: number | null,
        completedWithinInterval: CompletedWithinInterval | null,
        repeating: boolean | null,
        goalSuggestionTemplateId: string,
        priority: Priority | null,
        careTeamAssigneeRole: UserRole | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        CBOCategoryId: string | null,
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
    riskArea:  {
      id: string,
      title: string,
    } | null,
    screeningTool:  {
      id: string,
      title: string,
    } | null,
  } | null,
};

export interface answerDeleteMutationVariables {
  answerId: string,
};

export interface answerDeleteMutation {
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
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    } > | null,
    goalSuggestions:  Array< {
      id: string,
      title: string,
      taskTemplates:  Array< {
        id: string,
        title: string,
        completedWithinNumber: number | null,
        completedWithinInterval: CompletedWithinInterval | null,
        repeating: boolean | null,
        goalSuggestionTemplateId: string,
        priority: Priority | null,
        careTeamAssigneeRole: UserRole | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        CBOCategoryId: string | null,
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
    riskArea:  {
      id: string,
      title: string,
    } | null,
    screeningTool:  {
      id: string,
      title: string,
    } | null,
  } | null,
};

export interface answerEditMutationVariables {
  answerId: string,
  displayValue?: string | null,
  value?: string | null,
  valueType?: AnswerValueTypeOptions | null,
  riskAdjustmentType?: RiskAdjustmentTypeOptions | null,
  inSummary?: boolean | null,
  summaryText?: string | null,
  order?: number | null,
};

export interface answerEditMutation {
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
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    } > | null,
    goalSuggestions:  Array< {
      id: string,
      title: string,
      taskTemplates:  Array< {
        id: string,
        title: string,
        completedWithinNumber: number | null,
        completedWithinInterval: CompletedWithinInterval | null,
        repeating: boolean | null,
        goalSuggestionTemplateId: string,
        priority: Priority | null,
        careTeamAssigneeRole: UserRole | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        CBOCategoryId: string | null,
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
    riskArea:  {
      id: string,
      title: string,
    } | null,
    screeningTool:  {
      id: string,
      title: string,
    } | null,
  } | null,
};

export interface carePlanSuggestionAcceptMutationVariables {
  carePlanSuggestionId: string,
  patientConcernId?: string | null,
  concernId?: string | null,
  startedAt?: string | null,
  taskTemplateIds?: Array< string | null > | null,
};

export interface carePlanSuggestionAcceptMutation {
  // care plan suggestion accept
  carePlanSuggestionAccept:  {
    id: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    suggestionType: CarePlanSuggestionType,
    concernId: string | null,
    concern:  {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    } | null,
    goalSuggestionTemplateId: string | null,
    goalSuggestionTemplate:  {
      id: string,
      title: string,
      taskTemplates:  Array< {
        id: string,
        title: string,
        completedWithinNumber: number | null,
        completedWithinInterval: CompletedWithinInterval | null,
        repeating: boolean | null,
        goalSuggestionTemplateId: string,
        priority: Priority | null,
        careTeamAssigneeRole: UserRole | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        CBOCategoryId: string | null,
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
    acceptedById: string | null,
    acceptedBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    dismissedById: string | null,
    dismissedBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    dismissedReason: string | null,
    createdAt: string,
    updatedAt: string,
    dismissedAt: string | null,
    acceptedAt: string | null,
    patientScreeningToolSubmissionId: string | null,
  } | null,
};

export interface carePlanSuggestionDismissMutationVariables {
  carePlanSuggestionId: string,
  dismissedReason: string,
};

export interface carePlanSuggestionDismissMutation {
  // care plan suggestion dismiss
  carePlanSuggestionDismiss:  {
    id: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    suggestionType: CarePlanSuggestionType,
    concernId: string | null,
    concern:  {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    } | null,
    goalSuggestionTemplateId: string | null,
    goalSuggestionTemplate:  {
      id: string,
      title: string,
      taskTemplates:  Array< {
        id: string,
        title: string,
        completedWithinNumber: number | null,
        completedWithinInterval: CompletedWithinInterval | null,
        repeating: boolean | null,
        goalSuggestionTemplateId: string,
        priority: Priority | null,
        careTeamAssigneeRole: UserRole | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        CBOCategoryId: string | null,
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
    acceptedById: string | null,
    acceptedBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    dismissedById: string | null,
    dismissedBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    dismissedReason: string | null,
    createdAt: string,
    updatedAt: string,
    dismissedAt: string | null,
    acceptedAt: string | null,
    patientScreeningToolSubmissionId: string | null,
  } | null,
};

export interface CBOCreateMutationVariables {
  name: string,
  categoryId: string,
  address: string,
  city: string,
  state: string,
  zip: string,
  fax?: string | null,
  phone: string,
  url: string,
};

export interface CBOCreateMutation {
  // Create a CBO
  CBOCreate:  {
    id: string,
    name: string,
    categoryId: string,
    category:  {
      id: string,
      title: string,
    },
    address: string,
    city: string,
    state: string,
    zip: string,
    fax: string | null,
    phone: string,
    url: string,
    createdAt: string,
  } | null,
};

export interface CBODeleteMutationVariables {
  CBOId: string,
};

export interface CBODeleteMutation {
  // Delete a CBO
  CBODelete:  {
    id: string,
    name: string,
    categoryId: string,
    category:  {
      id: string,
      title: string,
    },
    address: string,
    city: string,
    state: string,
    zip: string,
    fax: string | null,
    phone: string,
    url: string,
    createdAt: string,
  } | null,
};

export interface CBOEditMutationVariables {
  CBOId: string,
  name?: string | null,
  categoryId?: string | null,
  address?: string | null,
  city?: string | null,
  state?: string | null,
  zip?: string | null,
  fax?: string | null,
  phone?: string | null,
  url?: string | null,
};

export interface CBOEditMutation {
  // Edit a CBO
  CBOEdit:  {
    id: string,
    name: string,
    categoryId: string,
    category:  {
      id: string,
      title: string,
    },
    address: string,
    city: string,
    state: string,
    zip: string,
    fax: string | null,
    phone: string,
    url: string,
    createdAt: string,
  } | null,
};

export interface CBOReferralCreateMutationVariables {
  categoryId: string,
  CBOId?: string | null,
  name?: string | null,
  url?: string | null,
  diagnosis?: string | null,
};

export interface CBOReferralCreateMutation {
  // Create a CBO Referral
  CBOReferralCreate:  {
    id: string,
    categoryId: string,
    category:  {
      id: string,
      title: string,
    },
    CBOId: string | null,
    CBO:  {
      id: string,
      name: string,
      categoryId: string,
      address: string,
      city: string,
      state: string,
      zip: string,
      fax: string | null,
      phone: string,
      url: string,
    } | null,
    name: string | null,
    url: string | null,
    diagnosis: string | null,
    sentAt: string | null,
    acknowledgedAt: string | null,
  } | null,
};

export interface CBOReferralEditMutationVariables {
  CBOReferralId: string,
  taskId: string,
  categoryId?: string | null,
  CBOId?: string | null,
  name?: string | null,
  url?: string | null,
  diagnosis?: string | null,
  sentAt?: string | null,
  acknowledgedAt?: string | null,
};

export interface CBOReferralEditMutation {
  // Edit a CBO Referral
  CBOReferralEdit:  {
    id: string,
    categoryId: string,
    category:  {
      id: string,
      title: string,
    },
    CBOId: string | null,
    CBO:  {
      id: string,
      name: string,
      categoryId: string,
      address: string,
      city: string,
      state: string,
      zip: string,
      fax: string | null,
      phone: string,
      url: string,
    } | null,
    name: string | null,
    url: string | null,
    diagnosis: string | null,
    sentAt: string | null,
    acknowledgedAt: string | null,
  } | null,
};

export interface getClinicsQueryVariables {
  pageNumber?: number | null,
  pageSize?: number | null,
};

export interface getClinicsQuery {
  // Clinics
  clinics:  {
    edges:  Array< {
      node:  {
        id: string,
        name: string,
      },
    } >,
  },
};

export interface computedFieldCreateMutationVariables {
  label: string,
  dataType: ComputedFieldDataTypes,
};

export interface computedFieldCreateMutation {
  // Create a computed field
  computedFieldCreate:  {
    id: string,
    label: string,
    slug: string,
    dataType: ComputedFieldDataTypes,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export interface computedFieldDeleteMutationVariables {
  computedFieldId: string,
};

export interface computedFieldDeleteMutation {
  // Delete a computed field
  computedFieldDelete:  {
    id: string,
    label: string,
    slug: string,
    dataType: ComputedFieldDataTypes,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export interface computedFieldFlagCreateMutationVariables {
  patientAnswerId: string,
  reason?: string | null,
};

export interface computedFieldFlagCreateMutation {
  computedFieldFlagCreate:  {
    id: string,
  } | null,
};

export interface concernAddDiagnosisCodeMutationVariables {
  concernId: string,
  codesetName: string,
  code: string,
  version: string,
};

export interface concernAddDiagnosisCodeMutation {
  // Add a diagnosis code to a concern
  concernAddDiagnosisCode:  {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    diagnosisCodes:  Array< {
      id: string,
      code: string,
      codesetName: string,
      label: string,
      version: string,
    } > | null,
  } | null,
};

export interface concernCreateMutationVariables {
  title: string,
};

export interface concernCreateMutation {
  // Create a concern
  concernCreate:  {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    diagnosisCodes:  Array< {
      id: string,
      code: string,
      codesetName: string,
      label: string,
      version: string,
    } > | null,
  } | null,
};

export interface concernDeleteMutationVariables {
  concernId: string,
};

export interface concernDeleteMutation {
  // Deletes a concern
  concernDelete:  {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    diagnosisCodes:  Array< {
      id: string,
      code: string,
      codesetName: string,
      label: string,
      version: string,
    } > | null,
  } | null,
};

export interface concernEditMutationVariables {
  concernId: string,
  title: string,
};

export interface concernEditMutation {
  // Edit a concern
  concernEdit:  {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    diagnosisCodes:  Array< {
      id: string,
      code: string,
      codesetName: string,
      label: string,
      version: string,
    } > | null,
  } | null,
};

export interface concernRemoveDiagnosisCodeMutationVariables {
  concernId: string,
  diagnosisCodeId: string,
};

export interface concernRemoveDiagnosisCodeMutation {
  // Remove a diagnosis code from a concern
  concernRemoveDiagnosisCode:  {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    diagnosisCodes:  Array< {
      id: string,
      code: string,
      codesetName: string,
      label: string,
      version: string,
    } > | null,
  } | null,
};

export interface concernSuggestionCreateMutationVariables {
  answerId?: string | null,
  screeningToolScoreRangeId?: string | null,
  concernId: string,
};

export interface concernSuggestionCreateMutation {
  // suggest a concern for an answer
  concernSuggestionCreate:  Array< {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    diagnosisCodes:  Array< {
      id: string,
      code: string,
      codesetName: string,
      label: string,
      version: string,
    } > | null,
  } | null > | null,
};

export interface concernSuggestionDeleteMutationVariables {
  answerId?: string | null,
  screeningToolScoreRangeId?: string | null,
  concernId: string,
};

export interface concernSuggestionDeleteMutation {
  // delete suggestion a concern for an answer
  concernSuggestionDelete:  Array< {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    diagnosisCodes:  Array< {
      id: string,
      code: string,
      codesetName: string,
      label: string,
      version: string,
    } > | null,
  } | null > | null,
};

export interface currentUserEditMutationVariables {
  firstName?: string | null,
  lastName?: string | null,
  locale?: string | null,
  phone?: string | null,
};

export interface currentUserEditMutation {
  // Edit current user
  currentUserEdit:  {
    id: string,
    locale: string | null,
    phone: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export interface eventNotificationDismissMutationVariables {
  eventNotificationId: string,
};

export interface eventNotificationDismissMutation {
  // Dismisses (marks as seen) an EventNotification
  eventNotificationDismiss:  {
    id: string,
    title: string | null,
    userId: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    taskEvent:  {
      id: string,
      taskId: string,
      task:  {
        id: string,
        title: string,
        priority: Priority | null,
      },
      userId: string,
      user:  {
        id: string,
        locale: string | null,
        phone: string | null,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        email: string | null,
        homeClinicId: string,
        googleProfileImageUrl: string | null,
        createdAt: string,
        updatedAt: string,
      },
      eventType: TaskEventTypes | null,
      eventCommentId: string | null,
      eventComment:  {
        id: string,
        body: string,
        user:  {
          id: string,
          locale: string | null,
          phone: string | null,
          firstName: string | null,
          lastName: string | null,
          userRole: UserRole,
          email: string | null,
          homeClinicId: string,
          googleProfileImageUrl: string | null,
          createdAt: string,
          updatedAt: string,
        },
        taskId: string,
        createdAt: string,
        updatedAt: string | null,
      } | null,
      eventUserId: string | null,
      eventUser:  {
        id: string,
        locale: string | null,
        phone: string | null,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        email: string | null,
        homeClinicId: string,
        googleProfileImageUrl: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
    seenAt: string | null,
    emailSentAt: string | null,
    deliveredAt: string | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export interface eventNotificationsForTaskDismissMutationVariables {
  taskId: string,
};

export interface eventNotificationsForTaskDismissMutation {
  // Dismisses (marks as seen) all of the EventNotifications on a Task for a the current user
  eventNotificationsForTaskDismiss:  Array< {
    id: string,
    title: string | null,
    userId: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    taskEvent:  {
      id: string,
      taskId: string,
      task:  {
        id: string,
        title: string,
        priority: Priority | null,
      },
      userId: string,
      user:  {
        id: string,
        locale: string | null,
        phone: string | null,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        email: string | null,
        homeClinicId: string,
        googleProfileImageUrl: string | null,
        createdAt: string,
        updatedAt: string,
      },
      eventType: TaskEventTypes | null,
      eventCommentId: string | null,
      eventComment:  {
        id: string,
        body: string,
        user:  {
          id: string,
          locale: string | null,
          phone: string | null,
          firstName: string | null,
          lastName: string | null,
          userRole: UserRole,
          email: string | null,
          homeClinicId: string,
          googleProfileImageUrl: string | null,
          createdAt: string,
          updatedAt: string,
        },
        taskId: string,
        createdAt: string,
        updatedAt: string | null,
      } | null,
      eventUserId: string | null,
      eventUser:  {
        id: string,
        locale: string | null,
        phone: string | null,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        email: string | null,
        homeClinicId: string,
        googleProfileImageUrl: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
    seenAt: string | null,
    emailSentAt: string | null,
    deliveredAt: string | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
};

export interface getAnswerQueryVariables {
  answerId: string,
};

export interface getAnswerQuery {
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
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    } > | null,
    goalSuggestions:  Array< {
      id: string,
      title: string,
      taskTemplates:  Array< {
        id: string,
        title: string,
        completedWithinNumber: number | null,
        completedWithinInterval: CompletedWithinInterval | null,
        repeating: boolean | null,
        goalSuggestionTemplateId: string,
        priority: Priority | null,
        careTeamAssigneeRole: UserRole | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        CBOCategoryId: string | null,
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
    riskArea:  {
      id: string,
      title: string,
    } | null,
    screeningTool:  {
      id: string,
      title: string,
    } | null,
  } | null,
};

export interface getCBOCategoriesQuery {
  // all CBO categories
  CBOCategories:  Array< {
    id: string,
    title: string,
  } >,
};

export interface getCBOQueryVariables {
  CBOId: string,
};

export interface getCBOQuery {
  // CBO
  CBO:  {
    id: string,
    name: string,
    categoryId: string,
    category:  {
      id: string,
      title: string,
    },
    address: string,
    city: string,
    state: string,
    zip: string,
    fax: string | null,
    phone: string,
    url: string,
    createdAt: string,
  },
};

export interface getCBOsForCategoryQueryVariables {
  categoryId: string,
};

export interface getCBOsForCategoryQuery {
  // all CBOs for given category
  CBOsForCategory:  Array< {
    id: string,
    name: string,
    categoryId: string,
    category:  {
      id: string,
      title: string,
    },
    address: string,
    city: string,
    state: string,
    zip: string,
    fax: string | null,
    phone: string,
    url: string,
    createdAt: string,
  } >,
};

export interface getCBOsQuery {
  // all CBOs
  CBOs:  Array< {
    id: string,
    name: string,
    categoryId: string,
    category:  {
      id: string,
      title: string,
    },
    address: string,
    city: string,
    state: string,
    zip: string,
    fax: string | null,
    phone: string,
    url: string,
    createdAt: string,
  } >,
};

export interface getComputedFieldQueryVariables {
  computedFieldId: string,
};

export interface getComputedFieldQuery {
  // computed field
  computedField:  {
    id: string,
    label: string,
    slug: string,
    dataType: ComputedFieldDataTypes,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  },
};

export interface getComputedFieldsQueryVariables {
  orderBy?: ComputedFieldOrderOptions | null,
};

export interface getComputedFieldsQuery {
  // computed fields
  computedFields:  Array< {
    id: string,
    label: string,
    slug: string,
    dataType: ComputedFieldDataTypes,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null >,
};

export interface getConcernSuggestionsForAnswerQueryVariables {
  answerId: string,
};

export interface getConcernSuggestionsForAnswerQuery {
  // Concerns for answer
  concernsForAnswer:  Array< {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    diagnosisCodes:  Array< {
      id: string,
      code: string,
      codesetName: string,
      label: string,
      version: string,
    } > | null,
  } | null >,
};

export interface getConcernQueryVariables {
  concernId: string,
};

export interface getConcernQuery {
  // Concern
  concern:  {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    diagnosisCodes:  Array< {
      id: string,
      code: string,
      codesetName: string,
      label: string,
      version: string,
    } > | null,
  },
};

export interface getConcernsQueryVariables {
  orderBy?: ConcernOrderOptions | null,
};

export interface getConcernsQuery {
  // Concerns
  concerns:  Array< {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    diagnosisCodes:  Array< {
      id: string,
      code: string,
      codesetName: string,
      label: string,
      version: string,
    } > | null,
  } | null >,
};

export interface getCurrentUserQuery {
  // The current User
  currentUser:  {
    id: string,
    locale: string | null,
    phone: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export interface getEventNotificationsForCurrentUserQueryVariables {
  pageNumber?: number | null,
  pageSize?: number | null,
  taskEventNotificationsOnly?: boolean | null,
};

export interface getEventNotificationsForCurrentUserQuery {
  // Event notifications for a user
  eventNotificationsForCurrentUser:  {
    edges:  Array< {
      node:  {
        id: string,
        title: string | null,
        userId: string,
        user:  {
          id: string,
          locale: string | null,
          phone: string | null,
          firstName: string | null,
          lastName: string | null,
          userRole: UserRole,
          email: string | null,
          homeClinicId: string,
          googleProfileImageUrl: string | null,
          createdAt: string,
          updatedAt: string,
        },
        taskEvent:  {
          id: string,
          taskId: string,
          task:  {
            id: string,
            title: string,
            priority: Priority | null,
          },
          userId: string,
          user:  {
            id: string,
            locale: string | null,
            phone: string | null,
            firstName: string | null,
            lastName: string | null,
            userRole: UserRole,
            email: string | null,
            homeClinicId: string,
            googleProfileImageUrl: string | null,
            createdAt: string,
            updatedAt: string,
          },
          eventType: TaskEventTypes | null,
          eventCommentId: string | null,
          eventComment:  {
            id: string,
            body: string,
            user:  {
              id: string,
              locale: string | null,
              phone: string | null,
              firstName: string | null,
              lastName: string | null,
              userRole: UserRole,
              email: string | null,
              homeClinicId: string,
              googleProfileImageUrl: string | null,
              createdAt: string,
              updatedAt: string,
            },
            taskId: string,
            createdAt: string,
            updatedAt: string | null,
          } | null,
          eventUserId: string | null,
          eventUser:  {
            id: string,
            locale: string | null,
            phone: string | null,
            firstName: string | null,
            lastName: string | null,
            userRole: UserRole,
            email: string | null,
            homeClinicId: string,
            googleProfileImageUrl: string | null,
            createdAt: string,
            updatedAt: string,
          } | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null,
        seenAt: string | null,
        emailSentAt: string | null,
        deliveredAt: string | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
  },
};

export interface getEventNotificationsForUserTaskQueryVariables {
  taskId: string,
};

export interface getEventNotificationsForUserTaskQuery {
  // Event notifications for a user's task - on dashboard
  eventNotificationsForUserTask:  Array< {
    id: string,
    title: string | null,
    createdAt: string,
  } >,
};

export interface getGoalSuggestionTemplateQueryVariables {
  goalSuggestionTemplateId: string,
};

export interface getGoalSuggestionTemplateQuery {
  // Goal suggestion templates
  goalSuggestionTemplate:  {
    id: string,
    title: string,
    taskTemplates:  Array< {
      id: string,
      title: string,
      completedWithinNumber: number | null,
      completedWithinInterval: CompletedWithinInterval | null,
      repeating: boolean | null,
      goalSuggestionTemplateId: string,
      priority: Priority | null,
      careTeamAssigneeRole: UserRole | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      CBOCategoryId: string | null,
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  },
};

export interface getGoalSuggestionTemplatesQueryVariables {
  orderBy?: GoalSuggestionOrderOptions | null,
};

export interface getGoalSuggestionTemplatesQuery {
  // Goal suggestion templates
  goalSuggestionTemplates:  Array< {
    id: string,
    title: string,
    taskTemplates:  Array< {
      id: string,
      title: string,
      completedWithinNumber: number | null,
      completedWithinInterval: CompletedWithinInterval | null,
      repeating: boolean | null,
      goalSuggestionTemplateId: string,
      priority: Priority | null,
      careTeamAssigneeRole: UserRole | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      CBOCategoryId: string | null,
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null >,
};

export interface getGoalSuggestionsForAnswerQueryVariables {
  answerId: string,
};

export interface getGoalSuggestionsForAnswerQuery {
  // Goal suggestion for template for answer
  goalSuggestionTemplatesForAnswer:  Array< {
    id: string,
    title: string,
    taskTemplates:  Array< {
      id: string,
      title: string,
      completedWithinNumber: number | null,
      completedWithinInterval: CompletedWithinInterval | null,
      repeating: boolean | null,
      goalSuggestionTemplateId: string,
      priority: Priority | null,
      careTeamAssigneeRole: UserRole | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      CBOCategoryId: string | null,
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null >,
};

export interface getPatientAnswersQueryVariables {
  filterType: AnswerFilterType,
  filterId: string,
  patientId: string,
};

export interface getPatientAnswersQuery {
  // PatientAnswersForQuestion
  patientAnswers:  Array< {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    answerId: string,
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
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } > | null,
      goalSuggestions:  Array< {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        title: string,
      } | null,
      screeningTool:  {
        id: string,
        title: string,
      } | null,
    },
    answerValue: string,
    patientId: string,
    applicable: boolean | null,
    question:  {
      id: string,
      title: string,
    } | null,
    patientScreeningToolSubmissionId: string | null,
  } >,
};

export interface getPatientCarePlanSuggestionsQueryVariables {
  patientId: string,
};

export interface getPatientCarePlanSuggestionsQuery {
  // Care Plan Suggestions
  carePlanSuggestionsForPatient:  Array< {
    id: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    suggestionType: CarePlanSuggestionType,
    concernId: string | null,
    concern:  {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    } | null,
    goalSuggestionTemplateId: string | null,
    goalSuggestionTemplate:  {
      id: string,
      title: string,
      taskTemplates:  Array< {
        id: string,
        title: string,
        completedWithinNumber: number | null,
        completedWithinInterval: CompletedWithinInterval | null,
        repeating: boolean | null,
        goalSuggestionTemplateId: string,
        priority: Priority | null,
        careTeamAssigneeRole: UserRole | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        CBOCategoryId: string | null,
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
    acceptedById: string | null,
    acceptedBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    dismissedById: string | null,
    dismissedBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    dismissedReason: string | null,
    createdAt: string,
    updatedAt: string,
    dismissedAt: string | null,
    acceptedAt: string | null,
    patientScreeningToolSubmissionId: string | null,
  } | null >,
};

export interface getPatientCarePlanQueryVariables {
  patientId: string,
};

export interface getPatientCarePlanQuery {
  // Care Plan
  carePlanForPatient:  {
    concerns:  Array< {
      id: string,
      order: number,
      concernId: string,
      concern:  {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      },
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      patientGoals:  Array< {
        id: string,
        title: string,
        patientId: string,
        patient:  {
          id: string,
          firstName: string,
          middleName: string | null,
          lastName: string,
          language: string | null,
          gender: string | null,
          dateOfBirth: string | null,
          zip: string | null,
          createdAt: string,
          consentToText: boolean | null,
          consentToCall: boolean | null,
        },
        patientConcernId: string | null,
        goalSuggestionTemplateId: string | null,
        tasks:  Array< {
          id: string,
          title: string,
          description: string | null,
          createdAt: string,
          updatedAt: string,
          completedAt: string | null,
          deletedAt: string | null,
          dueAt: string | null,
          patientId: string,
          priority: Priority | null,
          assignedTo:  {
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
          } >,
          createdBy:  {
            id: string,
            firstName: string | null,
            lastName: string | null,
            googleProfileImageUrl: string | null,
            userRole: UserRole,
          },
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } > | null,
      startedAt: string | null,
      completedAt: string | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } >,
    goals:  Array< {
      id: string,
      title: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      patientConcernId: string | null,
      goalSuggestionTemplateId: string | null,
      tasks:  Array< {
        id: string,
        title: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
        completedAt: string | null,
        deletedAt: string | null,
        dueAt: string | null,
        patientId: string,
        priority: Priority | null,
        assignedTo:  {
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
        } >,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        },
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } >,
  },
};

export interface getPatientCareTeamQueryVariables {
  patientId: string,
};

export interface getPatientCareTeamQuery {
  // Users on a care team
  patientCareTeam:  Array< {
    id: string,
    locale: string | null,
    phone: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
    createdAt: string,
    updatedAt: string,
  } | null >,
};

export interface getPatientListQueryVariables {
  patientListId: string,
};

export interface getPatientListQuery {
  // patient list
  patientList:  {
    id: string,
    title: string,
    answerId: string,
    order: number,
    createdAt: string,
  },
};

export interface getPatientListsQuery {
  // all patient lists
  patientLists:  Array< {
    id: string,
    title: string,
    answerId: string,
    order: number,
    createdAt: string,
  } >,
};

export interface getPatientPanelQueryVariables {
  pageNumber?: number | null,
  pageSize?: number | null,
};

export interface getPatientPanelQuery {
  // List of patients the user is on the care team for (their 'patient panel')
  userPatientPanel:  {
    edges:  Array< {
      node:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
  },
};

export interface getPatientRiskScoreForRiskAreaQueryVariables {
  riskAreaId: string,
  patientId: string,
};

export interface getPatientRiskScoreForRiskAreaQuery {
  // PatientRiskAreaRiskScore
  patientRiskAreaRiskScore:  {
    score: number,
    forceHighRisk: boolean,
  },
};

export interface getPatientRiskSummaryForRiskAreaQueryVariables {
  riskAreaId: string,
  patientId: string,
};

export interface getPatientRiskSummaryForRiskAreaQuery {
  // PatientRiskAreaSummary
  patientRiskAreaSummary:  {
    summary: Array< string >,
    started: boolean,
    lastUpdated: string | null,
  },
};

export interface getPatientScratchPadQueryVariables {
  patientId: string,
};

export interface getPatientScratchPadQuery {
  // Patient scratch pad
  patientScratchPad:  {
    text: string | null,
  },
};

export interface getPatientScreeningToolSubmissionForPatientAndScreeningToolQueryVariables {
  screeningToolId: string,
  patientId: string,
  scored: boolean,
};

export interface getPatientScreeningToolSubmissionForPatientAndScreeningToolQuery {
  // latest patient sreening tool submission for a screening tool
  patientScreeningToolSubmissionForPatientAndScreeningTool:  {
    id: string,
    screeningToolId: string,
    screeningTool:  {
      title: string,
    },
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    userId: string,
    user:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    },
    score: number | null,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      assessmentType: AssessmentType,
      order: number,
      mediumRiskThreshold: number,
      highRiskThreshold: number,
      riskAreaGroup:  {
        id: string,
        title: string,
      },
    },
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    scoredAt: string | null,
    carePlanSuggestions:  Array< {
      id: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      suggestionType: CarePlanSuggestionType,
      concernId: string | null,
      concern:  {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } | null,
      goalSuggestionTemplateId: string | null,
      goalSuggestionTemplate:  {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null,
      acceptedById: string | null,
      acceptedBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      } | null,
      dismissedById: string | null,
      dismissedBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      } | null,
      dismissedReason: string | null,
      createdAt: string,
      updatedAt: string,
      dismissedAt: string | null,
      acceptedAt: string | null,
      patientScreeningToolSubmissionId: string | null,
    } >,
    screeningToolScoreRangeId: string | null,
    screeningToolScoreRange:  {
      id: string,
      description: string,
    } | null,
  } | null,
};

export interface getPatientScreeningToolSubmissionsFor360QueryVariables {
  patientId: string,
};

export interface getPatientScreeningToolSubmissionsFor360Query {
  // patient screening tool submissions for patient 360 (history tab)
  patientScreeningToolSubmissionsFor360:  Array< {
    id: string,
    score: number | null,
    createdAt: string,
    riskArea:  {
      id: string,
      title: string,
    },
    user:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
    },
    screeningTool:  {
      id: string,
      title: string,
    },
    screeningToolScoreRange:  {
      id: string,
      description: string,
      riskAdjustmentType: RiskAdjustmentTypeOptions,
    } | null,
  } >,
};

export interface getPatientScreeningToolSubmissionQueryVariables {
  patientScreeningToolSubmissionId: string,
};

export interface getPatientScreeningToolSubmissionQuery {
  // patient screening tool submission
  patientScreeningToolSubmission:  {
    id: string,
    screeningToolId: string,
    screeningTool:  {
      title: string,
    },
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    userId: string,
    user:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    },
    score: number | null,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      assessmentType: AssessmentType,
      order: number,
      mediumRiskThreshold: number,
      highRiskThreshold: number,
      riskAreaGroup:  {
        id: string,
        title: string,
      },
    },
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    scoredAt: string | null,
    carePlanSuggestions:  Array< {
      id: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      suggestionType: CarePlanSuggestionType,
      concernId: string | null,
      concern:  {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } | null,
      goalSuggestionTemplateId: string | null,
      goalSuggestionTemplate:  {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null,
      acceptedById: string | null,
      acceptedBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      } | null,
      dismissedById: string | null,
      dismissedBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      } | null,
      dismissedReason: string | null,
      createdAt: string,
      updatedAt: string,
      dismissedAt: string | null,
      acceptedAt: string | null,
      patientScreeningToolSubmissionId: string | null,
    } >,
    screeningToolScoreRangeId: string | null,
    screeningToolScoreRange:  {
      id: string,
      description: string,
    } | null,
  },
};

export interface getPatientSearchQueryVariables {
  query: string,
  pageNumber: number,
  pageSize: number,
};

export interface getPatientSearchQuery {
  // Patient search
  patientSearch:  {
    edges:  Array< {
      node:  {
        id: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string | null,
        gender: string | null,
        userCareTeam: boolean,
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
    totalCount: number,
  },
};

export interface getPatientTasksQueryVariables {
  patientId: string,
  pageNumber?: number | null,
  pageSize?: number | null,
  orderBy?: TaskOrderOptions | null,
};

export interface getPatientTasksQuery {
  // Patient's Tasks
  tasksForPatient:  {
    edges:  Array< {
      node:  {
        id: string,
        title: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
        completedAt: string | null,
        deletedAt: string | null,
        dueAt: string | null,
        patientId: string,
        priority: Priority | null,
        patient:  {
          id: string,
          firstName: string,
          middleName: string | null,
          lastName: string,
        },
        assignedTo:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          userRole: UserRole,
          googleProfileImageUrl: string | null,
        } | null,
        followers:  Array< {
          id: string,
          firstName: string | null,
          lastName: string | null,
          userRole: UserRole,
          googleProfileImageUrl: string | null,
        } >,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          userRole: UserRole,
          googleProfileImageUrl: string | null,
        },
        patientGoal:  {
          id: string,
          title: string,
          patientConcern:  {
            concern:  {
              id: string,
              title: string,
            },
          } | null,
        },
        CBOReferralId: string | null,
        CBOReferral:  {
          id: string,
          categoryId: string,
          category:  {
            id: string,
            title: string,
          },
          CBOId: string | null,
          CBO:  {
            id: string,
            name: string,
            categoryId: string,
            address: string,
            city: string,
            state: string,
            zip: string,
            fax: string | null,
            phone: string,
            url: string,
          } | null,
          name: string | null,
          url: string | null,
          diagnosis: string | null,
          sentAt: string | null,
          acknowledgedAt: string | null,
        } | null,
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
  },
};

export interface getPatientQueryVariables {
  patientId: string,
};

export interface getPatientQuery {
  // A single Patient
  patient:  {
    id: string,
    firstName: string,
    middleName: string | null,
    lastName: string,
    language: string | null,
    gender: string | null,
    dateOfBirth: string | null,
    zip: string | null,
    createdAt: string,
    consentToText: boolean | null,
    consentToCall: boolean | null,
  },
};

export interface getPatientsForComputedListQueryVariables {
  answerId: string,
  pageNumber: number,
  pageSize: number,
};

export interface getPatientsForComputedListQuery {
  // Patient dashboard - computed list for answer
  patientsForComputedList:  {
    edges:  Array< {
      node:  {
        id: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string | null,
        gender: string | null,
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
    totalCount: number,
  },
};

export interface getPatientsNewToCareTeamQueryVariables {
  pageNumber: number,
  pageSize: number,
};

export interface getPatientsNewToCareTeamQuery {
  // Patient dashboard - new to user care team
  patientsNewToCareTeam:  {
    edges:  Array< {
      node:  {
        id: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string | null,
        gender: string | null,
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
    totalCount: number,
  },
};

export interface getPatientsWithMissingInfoQueryVariables {
  pageNumber: number,
  pageSize: number,
};

export interface getPatientsWithMissingInfoQuery {
  // Patient dashboard - lacking demographic information
  patientsWithMissingInfo:  {
    edges:  Array< {
      node:  {
        id: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string | null,
        gender: string | null,
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
    totalCount: number,
  },
};

export interface getPatientsWithNoRecentEngagementQueryVariables {
  pageNumber: number,
  pageSize: number,
};

export interface getPatientsWithNoRecentEngagementQuery {
  // Patient dashboard - no recent engagement
  patientsWithNoRecentEngagement:  {
    edges:  Array< {
      node:  {
        id: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string | null,
        gender: string | null,
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
    totalCount: number,
  },
};

export interface getPatientsWithOutOfDateMAPQueryVariables {
  pageNumber: number,
  pageSize: number,
};

export interface getPatientsWithOutOfDateMAPQuery {
  // Patient dashboard - out of date MAP
  patientsWithOutOfDateMAP:  {
    edges:  Array< {
      node:  {
        id: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string | null,
        gender: string | null,
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
    totalCount: number,
  },
};

export interface getPatientsWithPendingSuggestionsQueryVariables {
  pageNumber: number,
  pageSize: number,
};

export interface getPatientsWithPendingSuggestionsQuery {
  // Patient dashboard - pending MAP suggestions
  patientsWithPendingSuggestions:  {
    edges:  Array< {
      node:  {
        id: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string | null,
        gender: string | null,
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
    totalCount: number,
  },
};

export interface getPatientsWithUrgentTasksQueryVariables {
  pageNumber: number,
  pageSize: number,
};

export interface getPatientsWithUrgentTasksQuery {
  // Patient dashboard - tasks due and notifications
  patientsWithUrgentTasks:  {
    edges:  Array< {
      node:  {
        id: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string | null,
        gender: string | null,
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
    totalCount: number,
  },
};

export interface getProgressNoteActivityForProgressNoteQueryVariables {
  progressNoteId: string,
};

export interface getProgressNoteActivityForProgressNoteQuery {
  // progress note activities for progress note
  progressNoteActivityForProgressNote:  {
    taskEvents:  Array< {
      id: string,
      taskId: string,
      task:  {
        id: string,
        title: string,
        priority: Priority | null,
      },
      userId: string,
      user:  {
        id: string,
        locale: string | null,
        phone: string | null,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        email: string | null,
        homeClinicId: string,
        googleProfileImageUrl: string | null,
        createdAt: string,
        updatedAt: string,
      },
      eventType: TaskEventTypes | null,
      eventCommentId: string | null,
      eventComment:  {
        id: string,
        body: string,
        user:  {
          id: string,
          locale: string | null,
          phone: string | null,
          firstName: string | null,
          lastName: string | null,
          userRole: UserRole,
          email: string | null,
          homeClinicId: string,
          googleProfileImageUrl: string | null,
          createdAt: string,
          updatedAt: string,
        },
        taskId: string,
        createdAt: string,
        updatedAt: string | null,
      } | null,
      eventUserId: string | null,
      eventUser:  {
        id: string,
        locale: string | null,
        phone: string | null,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        email: string | null,
        homeClinicId: string,
        googleProfileImageUrl: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } >,
    patientAnswerEvents:  Array< {
      id: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      userId: string,
      user:  {
        id: string,
        locale: string | null,
        phone: string | null,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        email: string | null,
        homeClinicId: string,
        googleProfileImageUrl: string | null,
        createdAt: string,
        updatedAt: string,
      },
      patientAnswerId: string,
      patientAnswer:  {
        id: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        answerId: string,
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
          concernSuggestions:  Array< {
            id: string,
            title: string,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
            diagnosisCodes:  Array< {
              id: string,
              code: string,
              codesetName: string,
              label: string,
              version: string,
            } > | null,
          } > | null,
          goalSuggestions:  Array< {
            id: string,
            title: string,
            taskTemplates:  Array< {
              id: string,
              title: string,
              completedWithinNumber: number | null,
              completedWithinInterval: CompletedWithinInterval | null,
              repeating: boolean | null,
              goalSuggestionTemplateId: string,
              priority: Priority | null,
              careTeamAssigneeRole: UserRole | null,
              createdAt: string,
              updatedAt: string,
              deletedAt: string | null,
              CBOCategoryId: string | null,
            } >,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
          riskArea:  {
            id: string,
            title: string,
          } | null,
          screeningTool:  {
            id: string,
            title: string,
          } | null,
        },
        answerValue: string,
        patientId: string,
        applicable: boolean | null,
        question:  {
          id: string,
          title: string,
        } | null,
        patientScreeningToolSubmissionId: string | null,
      },
      previousPatientAnswerId: string | null,
      previousPatientAnswer:  {
        id: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        answerId: string,
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
          concernSuggestions:  Array< {
            id: string,
            title: string,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
            diagnosisCodes:  Array< {
              id: string,
              code: string,
              codesetName: string,
              label: string,
              version: string,
            } > | null,
          } > | null,
          goalSuggestions:  Array< {
            id: string,
            title: string,
            taskTemplates:  Array< {
              id: string,
              title: string,
              completedWithinNumber: number | null,
              completedWithinInterval: CompletedWithinInterval | null,
              repeating: boolean | null,
              goalSuggestionTemplateId: string,
              priority: Priority | null,
              careTeamAssigneeRole: UserRole | null,
              createdAt: string,
              updatedAt: string,
              deletedAt: string | null,
              CBOCategoryId: string | null,
            } >,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
          riskArea:  {
            id: string,
            title: string,
          } | null,
          screeningTool:  {
            id: string,
            title: string,
          } | null,
        },
        answerValue: string,
        patientId: string,
        applicable: boolean | null,
        question:  {
          id: string,
          title: string,
        } | null,
        patientScreeningToolSubmissionId: string | null,
      } | null,
      eventType: PatientAnswerEventTypes,
      progressNoteId: string | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } >,
    carePlanUpdateEvents:  Array< {
      id: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      userId: string,
      user:  {
        id: string,
        locale: string | null,
        phone: string | null,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        email: string | null,
        homeClinicId: string,
        googleProfileImageUrl: string | null,
        createdAt: string,
        updatedAt: string,
      },
      patientConcernId: string | null,
      patientConcern:  {
        id: string,
        order: number,
        concernId: string,
        concern:  {
          id: string,
          title: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          diagnosisCodes:  Array< {
            id: string,
            code: string,
            codesetName: string,
            label: string,
            version: string,
          } > | null,
        },
        patientId: string,
        patient:  {
          id: string,
          firstName: string,
          middleName: string | null,
          lastName: string,
          language: string | null,
          gender: string | null,
          dateOfBirth: string | null,
          zip: string | null,
          createdAt: string,
          consentToText: boolean | null,
          consentToCall: boolean | null,
        },
        patientGoals:  Array< {
          id: string,
          title: string,
          patientId: string,
          patient:  {
            id: string,
            firstName: string,
            middleName: string | null,
            lastName: string,
            language: string | null,
            gender: string | null,
            dateOfBirth: string | null,
            zip: string | null,
            createdAt: string,
            consentToText: boolean | null,
            consentToCall: boolean | null,
          },
          patientConcernId: string | null,
          goalSuggestionTemplateId: string | null,
          tasks:  Array< {
            id: string,
            title: string,
            description: string | null,
            createdAt: string,
            updatedAt: string,
            completedAt: string | null,
            deletedAt: string | null,
            dueAt: string | null,
            patientId: string,
            priority: Priority | null,
            assignedTo:  {
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
            } >,
            createdBy:  {
              id: string,
              firstName: string | null,
              lastName: string | null,
              googleProfileImageUrl: string | null,
              userRole: UserRole,
            },
          } >,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } > | null,
        startedAt: string | null,
        completedAt: string | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null,
      patientGoalId: string | null,
      patientGoal:  {
        id: string,
        title: string,
        patientId: string,
        patient:  {
          id: string,
          firstName: string,
          middleName: string | null,
          lastName: string,
          language: string | null,
          gender: string | null,
          dateOfBirth: string | null,
          zip: string | null,
          createdAt: string,
          consentToText: boolean | null,
          consentToCall: boolean | null,
        },
        patientConcernId: string | null,
        goalSuggestionTemplateId: string | null,
        tasks:  Array< {
          id: string,
          title: string,
          description: string | null,
          createdAt: string,
          updatedAt: string,
          completedAt: string | null,
          deletedAt: string | null,
          dueAt: string | null,
          patientId: string,
          priority: Priority | null,
          assignedTo:  {
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
          } >,
          createdBy:  {
            id: string,
            firstName: string | null,
            lastName: string | null,
            googleProfileImageUrl: string | null,
            userRole: UserRole,
          },
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null,
      eventType: CarePlanUpdateEventTypes,
      progressNoteId: string | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } >,
    quickCallEvents:  Array< {
      id: string,
      userId: string,
      user:  {
        id: string,
        locale: string | null,
        phone: string | null,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        email: string | null,
        homeClinicId: string,
        googleProfileImageUrl: string | null,
        createdAt: string,
        updatedAt: string,
      },
      progressNoteId: string,
      reason: string,
      summary: string,
      direction: QuickCallDirection,
      callRecipient: string,
      wasSuccessful: boolean,
      startTime: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } >,
    patientScreeningToolSubmissions:  Array< {
      id: string,
      screeningToolId: string,
      screeningTool:  {
        title: string,
      },
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      userId: string,
      user:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      },
      score: number | null,
      riskArea:  {
        id: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        title: string,
        assessmentType: AssessmentType,
        order: number,
        mediumRiskThreshold: number,
        highRiskThreshold: number,
        riskAreaGroup:  {
          id: string,
          title: string,
        },
      },
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      scoredAt: string | null,
      carePlanSuggestions:  Array< {
        id: string,
        patientId: string,
        patient:  {
          id: string,
          firstName: string,
          middleName: string | null,
          lastName: string,
          language: string | null,
          gender: string | null,
          dateOfBirth: string | null,
          zip: string | null,
          createdAt: string,
          consentToText: boolean | null,
          consentToCall: boolean | null,
        },
        suggestionType: CarePlanSuggestionType,
        concernId: string | null,
        concern:  {
          id: string,
          title: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          diagnosisCodes:  Array< {
            id: string,
            code: string,
            codesetName: string,
            label: string,
            version: string,
          } > | null,
        } | null,
        goalSuggestionTemplateId: string | null,
        goalSuggestionTemplate:  {
          id: string,
          title: string,
          taskTemplates:  Array< {
            id: string,
            title: string,
            completedWithinNumber: number | null,
            completedWithinInterval: CompletedWithinInterval | null,
            repeating: boolean | null,
            goalSuggestionTemplateId: string,
            priority: Priority | null,
            careTeamAssigneeRole: UserRole | null,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
            CBOCategoryId: string | null,
          } >,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null,
        acceptedById: string | null,
        acceptedBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          userRole: UserRole,
          googleProfileImageUrl: string | null,
        } | null,
        dismissedById: string | null,
        dismissedBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          userRole: UserRole,
          googleProfileImageUrl: string | null,
        } | null,
        dismissedReason: string | null,
        createdAt: string,
        updatedAt: string,
        dismissedAt: string | null,
        acceptedAt: string | null,
        patientScreeningToolSubmissionId: string | null,
      } >,
      screeningToolScoreRangeId: string | null,
      screeningToolScoreRange:  {
        id: string,
        description: string,
      } | null,
    } >,
  },
};

export interface getProgressNoteTemplateQueryVariables {
  progressNoteTemplateId: string,
};

export interface getProgressNoteTemplateQuery {
  // progress note template
  progressNoteTemplate:  {
    id: string,
    title: string,
    createdAt: string,
    deletedAt: string | null,
  },
};

export interface getProgressNoteTemplatesQuery {
  // progress note templates
  progressNoteTemplates:  Array< {
    id: string,
    title: string,
    createdAt: string,
    deletedAt: string | null,
  } | null >,
};

export interface getProgressNoteQueryVariables {
  progressNoteId: string,
};

export interface getProgressNoteQuery {
  // progress note
  progressNote:  {
    id: string,
    patientId: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    completedAt: string | null,
    createdAt: string,
    updatedAt: string,
    summary: string | null,
    memberConcern: string | null,
    startedAt: string | null,
    location: string | null,
    deletedAt: string | null,
    needsSupervisorReview: boolean | null,
    reviewedBySupervisorAt: string | null,
    supervisorNotes: string | null,
    supervisor:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    progressNoteTemplate:  {
      id: string,
      title: string,
      createdAt: string,
      deletedAt: string | null,
    } | null,
  },
};

export interface getProgressNotesForCurrentUserQueryVariables {
  completed: boolean,
};

export interface getProgressNotesForCurrentUserQuery {
  // progress notes for current user
  progressNotesForCurrentUser:  Array< {
    id: string,
    patientId: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    completedAt: string | null,
    createdAt: string,
    updatedAt: string,
    summary: string | null,
    memberConcern: string | null,
    startedAt: string | null,
    location: string | null,
    deletedAt: string | null,
    needsSupervisorReview: boolean | null,
    reviewedBySupervisorAt: string | null,
    supervisorNotes: string | null,
    supervisor:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    progressNoteTemplate:  {
      id: string,
      title: string,
      createdAt: string,
      deletedAt: string | null,
    } | null,
  } | null >,
};

export interface getProgressNotesForPatientQueryVariables {
  patientId: string,
  completed: boolean,
};

export interface getProgressNotesForPatientQuery {
  // progress notes for patient
  progressNotesForPatient:  Array< {
    id: string,
    patientId: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    completedAt: string | null,
    createdAt: string,
    updatedAt: string,
    summary: string | null,
    memberConcern: string | null,
    startedAt: string | null,
    location: string | null,
    deletedAt: string | null,
    needsSupervisorReview: boolean | null,
    reviewedBySupervisorAt: string | null,
    supervisorNotes: string | null,
    supervisor:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    progressNoteTemplate:  {
      id: string,
      title: string,
      createdAt: string,
      deletedAt: string | null,
    } | null,
  } | null >,
};

export interface getProgressNotesForSupervisorReviewQuery {
  // progress notes for supervisor review
  progressNotesForSupervisorReview:  Array< {
    id: string,
    patientId: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    completedAt: string | null,
    createdAt: string,
    updatedAt: string,
    summary: string | null,
    memberConcern: string | null,
    startedAt: string | null,
    location: string | null,
    deletedAt: string | null,
    needsSupervisorReview: boolean | null,
    reviewedBySupervisorAt: string | null,
    supervisorNotes: string | null,
    supervisor:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    progressNoteTemplate:  {
      id: string,
      title: string,
      createdAt: string,
      deletedAt: string | null,
    } | null,
  } | null >,
};

export interface getQuestionAnswersQueryVariables {
  questionId: string,
};

export interface getQuestionAnswersQuery {
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
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    } > | null,
    goalSuggestions:  Array< {
      id: string,
      title: string,
      taskTemplates:  Array< {
        id: string,
        title: string,
        completedWithinNumber: number | null,
        completedWithinInterval: CompletedWithinInterval | null,
        repeating: boolean | null,
        goalSuggestionTemplateId: string,
        priority: Priority | null,
        careTeamAssigneeRole: UserRole | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        CBOCategoryId: string | null,
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
    riskArea:  {
      id: string,
      title: string,
    } | null,
    screeningTool:  {
      id: string,
      title: string,
    } | null,
  } | null >,
};

export interface getQuestionQueryVariables {
  questionId: string,
};

export interface getQuestionQuery {
  // Question
  question:  {
    id: string,
    createdAt: string,
    deletedAt: string | null,
    title: string,
    validatedSource: string | null,
    answerType: AnswerTypeOptions,
    riskAreaId: string | null,
    screeningToolId: string | null,
    order: number,
    applicableIfType: QuestionConditionTypeOptions | null,
    otherTextAnswerId: string | null,
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
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } > | null,
      goalSuggestions:  Array< {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        title: string,
      } | null,
      screeningTool:  {
        id: string,
        title: string,
      } | null,
    } > | null,
    applicableIfQuestionConditions:  Array< {
      id: string,
      questionId: string,
      answerId: string,
    } >,
    computedFieldId: string | null,
    computedField:  {
      id: string,
      label: string,
      slug: string,
      dataType: ComputedFieldDataTypes,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
  },
};

export interface getQuestionsQueryVariables {
  filterId: string,
  filterType: QuestionFilterType,
};

export interface getQuestionsQuery {
  // Questions for risk area, progress note template or screening tool
  questions:  Array< {
    id: string,
    createdAt: string,
    deletedAt: string | null,
    title: string,
    validatedSource: string | null,
    answerType: AnswerTypeOptions,
    riskAreaId: string | null,
    screeningToolId: string | null,
    order: number,
    applicableIfType: QuestionConditionTypeOptions | null,
    otherTextAnswerId: string | null,
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
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } > | null,
      goalSuggestions:  Array< {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        title: string,
      } | null,
      screeningTool:  {
        id: string,
        title: string,
      } | null,
    } > | null,
    applicableIfQuestionConditions:  Array< {
      id: string,
      questionId: string,
      answerId: string,
    } >,
    computedFieldId: string | null,
    computedField:  {
      id: string,
      label: string,
      slug: string,
      dataType: ComputedFieldDataTypes,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
  } >,
};

export interface getRiskAreaAssessmentSubmissionForPatientQueryVariables {
  riskAreaId: string,
  patientId: string,
  completed: boolean,
};

export interface getRiskAreaAssessmentSubmissionForPatientQuery {
  // latest risk area assessment submission for a screening tool
  riskAreaAssessmentSubmissionForPatient:  {
    id: string,
    riskAreaId: string,
    patientId: string,
    userId: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    completedAt: string | null,
    carePlanSuggestions:  Array< {
      id: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      suggestionType: CarePlanSuggestionType,
      concernId: string | null,
      concern:  {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } | null,
      goalSuggestionTemplateId: string | null,
      goalSuggestionTemplate:  {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null,
      acceptedById: string | null,
      acceptedBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      } | null,
      dismissedById: string | null,
      dismissedBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      } | null,
      dismissedReason: string | null,
      createdAt: string,
      updatedAt: string,
      dismissedAt: string | null,
      acceptedAt: string | null,
      patientScreeningToolSubmissionId: string | null,
    } >,
  } | null,
};

export interface getRiskAreaAssessmentSubmissionQueryVariables {
  riskAreaAssessmentSubmissionId: string,
};

export interface getRiskAreaAssessmentSubmissionQuery {
  // risk area assessment submission
  riskAreaAssessmentSubmission:  {
    id: string,
    riskAreaId: string,
    patientId: string,
    userId: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    completedAt: string | null,
    carePlanSuggestions:  Array< {
      id: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      suggestionType: CarePlanSuggestionType,
      concernId: string | null,
      concern:  {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } | null,
      goalSuggestionTemplateId: string | null,
      goalSuggestionTemplate:  {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null,
      acceptedById: string | null,
      acceptedBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      } | null,
      dismissedById: string | null,
      dismissedBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      } | null,
      dismissedReason: string | null,
      createdAt: string,
      updatedAt: string,
      dismissedAt: string | null,
      acceptedAt: string | null,
      patientScreeningToolSubmissionId: string | null,
    } >,
  },
};

export interface getRiskAreaGroupForPatientQueryVariables {
  riskAreaGroupId: string,
  patientId: string,
};

export interface getRiskAreaGroupForPatientQuery {
  // Risk Area Group with associated patient answers
  riskAreaGroupForPatient:  {
    id: string,
    title: string,
    shortTitle: string,
    riskAreas:  Array< {
      id: string,
      title: string,
      assessmentType: AssessmentType,
      mediumRiskThreshold: number,
      highRiskThreshold: number,
      questions:  Array< {
        id: string,
        answers:  Array< {
          id: string,
          inSummary: boolean | null,
          riskAdjustmentType: RiskAdjustmentTypeOptions | null,
          summaryText: string | null,
          patientAnswers:  Array< {
            id: string,
            patientId: string,
            createdAt: string,
            updatedAt: string,
            answerValue: string,
          } > | null,
        } > | null,
      } >,
      riskAreaAssessmentSubmissions:  Array< {
        id: string,
        createdAt: string,
      } >,
      screeningTools:  Array< {
        id: string,
        title: string,
        patientScreeningToolSubmissions:  Array< {
          id: string,
          screeningToolId: string,
          patientId: string,
          userId: string,
          score: number | null,
          screeningToolScoreRangeId: string | null,
          screeningToolScoreRange:  {
            id: string,
            riskAdjustmentType: RiskAdjustmentTypeOptions,
            description: string,
          } | null,
          patientAnswers:  Array< {
            updatedAt: string,
            answer:  {
              riskAdjustmentType: RiskAdjustmentTypeOptions | null,
              inSummary: boolean | null,
              summaryText: string | null,
            },
          } > | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } >,
    } >,
  },
};

export interface getRiskAreaGroupsQuery {
  // RiskAreaGroups
  riskAreaGroups:  Array< {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    shortTitle: string,
    order: number,
    mediumRiskThreshold: number,
    highRiskThreshold: number,
  } >,
};

export interface getRiskAreaQueryVariables {
  riskAreaId: string,
};

export interface getRiskAreaQuery {
  // RiskArea
  riskArea:  {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    assessmentType: AssessmentType,
    order: number,
    mediumRiskThreshold: number,
    highRiskThreshold: number,
    riskAreaGroup:  {
      id: string,
      title: string,
    },
  },
};

export interface getRiskAreasQuery {
  // RiskAreas
  riskAreas:  Array< {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    assessmentType: AssessmentType,
    order: number,
    mediumRiskThreshold: number,
    highRiskThreshold: number,
    riskAreaGroup:  {
      id: string,
      title: string,
    },
  } | null >,
};

export interface getScreeningToolQueryVariables {
  screeningToolId: string,
};

export interface getScreeningToolQuery {
  // screening tool
  screeningTool:  {
    id: string,
    title: string,
    riskAreaId: string,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      assessmentType: AssessmentType,
      order: number,
      mediumRiskThreshold: number,
      highRiskThreshold: number,
      riskAreaGroup:  {
        id: string,
        title: string,
      },
    },
    screeningToolScoreRanges:  Array< {
      id: string,
      description: string,
      minimumScore: number,
      maximumScore: number,
      screeningToolId: string,
      riskAdjustmentType: RiskAdjustmentTypeOptions,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } >,
      goalSuggestions:  Array< {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
    } >,
    patientScreeningToolSubmissions:  Array< {
      id: string,
      screeningToolId: string,
      patientId: string,
      userId: string,
      score: number | null,
      screeningToolScoreRangeId: string | null,
      screeningToolScoreRange:  {
        id: string,
        riskAdjustmentType: RiskAdjustmentTypeOptions,
        description: string,
      } | null,
      patientAnswers:  Array< {
        updatedAt: string,
        answer:  {
          riskAdjustmentType: RiskAdjustmentTypeOptions | null,
          inSummary: boolean | null,
          summaryText: string | null,
        },
      } > | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  },
};

export interface getScreeningToolsForRiskAreaQueryVariables {
  riskAreaId: string,
};

export interface getScreeningToolsForRiskAreaQuery {
  // screening tools for risk area
  screeningToolsForRiskArea:  Array< {
    id: string,
    title: string,
    riskAreaId: string,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      assessmentType: AssessmentType,
      order: number,
      mediumRiskThreshold: number,
      highRiskThreshold: number,
      riskAreaGroup:  {
        id: string,
        title: string,
      },
    },
    screeningToolScoreRanges:  Array< {
      id: string,
      description: string,
      minimumScore: number,
      maximumScore: number,
      screeningToolId: string,
      riskAdjustmentType: RiskAdjustmentTypeOptions,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } >,
      goalSuggestions:  Array< {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
    } >,
    patientScreeningToolSubmissions:  Array< {
      id: string,
      screeningToolId: string,
      patientId: string,
      userId: string,
      score: number | null,
      screeningToolScoreRangeId: string | null,
      screeningToolScoreRange:  {
        id: string,
        riskAdjustmentType: RiskAdjustmentTypeOptions,
        description: string,
      } | null,
      patientAnswers:  Array< {
        updatedAt: string,
        answer:  {
          riskAdjustmentType: RiskAdjustmentTypeOptions | null,
          inSummary: boolean | null,
          summaryText: string | null,
        },
      } > | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null >,
};

export interface getScreeningToolsQuery {
  // screening tools
  screeningTools:  Array< {
    id: string,
    title: string,
    riskAreaId: string,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      assessmentType: AssessmentType,
      order: number,
      mediumRiskThreshold: number,
      highRiskThreshold: number,
      riskAreaGroup:  {
        id: string,
        title: string,
      },
    },
    screeningToolScoreRanges:  Array< {
      id: string,
      description: string,
      minimumScore: number,
      maximumScore: number,
      screeningToolId: string,
      riskAdjustmentType: RiskAdjustmentTypeOptions,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } >,
      goalSuggestions:  Array< {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
    } >,
    patientScreeningToolSubmissions:  Array< {
      id: string,
      screeningToolId: string,
      patientId: string,
      userId: string,
      score: number | null,
      screeningToolScoreRangeId: string | null,
      screeningToolScoreRange:  {
        id: string,
        riskAdjustmentType: RiskAdjustmentTypeOptions,
        description: string,
      } | null,
      patientAnswers:  Array< {
        updatedAt: string,
        answer:  {
          riskAdjustmentType: RiskAdjustmentTypeOptions | null,
          inSummary: boolean | null,
          summaryText: string | null,
        },
      } > | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null >,
};

export interface getTaskCommentQueryVariables {
  taskCommentId: string,
};

export interface getTaskCommentQuery {
  // Single task comment
  taskComment:  {
    id: string,
    body: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    taskId: string,
    createdAt: string,
    updatedAt: string | null,
  },
};

export interface getTaskCommentsQueryVariables {
  taskId: string,
  pageNumber?: number | null,
  pageSize?: number | null,
};

export interface getTaskCommentsQuery {
  // List of task comments
  taskComments:  {
    edges:  Array< {
      node:  {
        id: string,
        body: string,
        user:  {
          id: string,
          locale: string | null,
          phone: string | null,
          firstName: string | null,
          lastName: string | null,
          userRole: UserRole,
          email: string | null,
          homeClinicId: string,
          googleProfileImageUrl: string | null,
          createdAt: string,
          updatedAt: string,
        },
        taskId: string,
        createdAt: string,
        updatedAt: string | null,
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
  },
};

export interface getTaskIdsWithNotificationsQuery {
  // Task IDs with notifications for current user - in care plan MAP and tasks panel
  taskIdsWithNotifications:  Array< {
    id: string,
  } >,
};

export interface getTaskQueryVariables {
  taskId: string,
};

export interface getTaskQuery {
  // Task
  task:  {
    id: string,
    title: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: Priority | null,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
    },
    assignedTo:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } >,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    },
    patientGoal:  {
      id: string,
      title: string,
      patientConcern:  {
        concern:  {
          id: string,
          title: string,
        },
      } | null,
    },
    CBOReferralId: string | null,
    CBOReferral:  {
      id: string,
      categoryId: string,
      category:  {
        id: string,
        title: string,
      },
      CBOId: string | null,
      CBO:  {
        id: string,
        name: string,
        categoryId: string,
        address: string,
        city: string,
        state: string,
        zip: string,
        fax: string | null,
        phone: string,
        url: string,
      } | null,
      name: string | null,
      url: string | null,
      diagnosis: string | null,
      sentAt: string | null,
      acknowledgedAt: string | null,
    } | null,
  },
};

export interface getTasksDueSoonForPatientQueryVariables {
  patientId: string,
};

export interface getTasksDueSoonForPatientQuery {
  // Tasks due soon for patient - in dashboard
  tasksDueSoonForPatient:  Array< {
    id: string,
    title: string,
    dueAt: string | null,
    priority: Priority | null,
    patientId: string,
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } >,
  } >,
};

export interface getTasksWithNotificationsForPatientQueryVariables {
  patientId: string,
};

export interface getTasksWithNotificationsForPatientQuery {
  // Tasks with notifications for patient - in dashboard
  tasksWithNotificationsForPatient:  Array< {
    id: string,
    title: string,
    dueAt: string | null,
    priority: Priority | null,
    patientId: string,
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } >,
  } >,
};

export interface getUserSummaryListQueryVariables {
  userRoleFilters?: Array< UserRole > | null,
};

export interface getUserSummaryListQuery {
  // List of all Users with care roles
  userSummaryList:  Array< {
    id: string,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    googleProfileImageUrl: string | null,
  } >,
};

export interface getUsersQueryVariables {
  pageNumber?: number | null,
  pageSize?: number | null,
  orderBy?: UserOrderOptions | null,
  hasLoggedIn?: boolean | null,
};

export interface getUsersQuery {
  // All Users (admin only)
  users:  {
    edges:  Array< {
      node:  {
        id: string,
        locale: string | null,
        phone: string | null,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        email: string | null,
        homeClinicId: string,
        googleProfileImageUrl: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
    } | null > | null,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
  },
};

export interface goalSuggestionCreateMutationVariables {
  answerId?: string | null,
  screeningToolScoreRangeId?: string | null,
  goalSuggestionTemplateId: string,
};

export interface goalSuggestionCreateMutation {
  // Suggest a goal suggestion template for an answer
  goalSuggestionCreate:  Array< {
    id: string,
    title: string,
    taskTemplates:  Array< {
      id: string,
      title: string,
      completedWithinNumber: number | null,
      completedWithinInterval: CompletedWithinInterval | null,
      repeating: boolean | null,
      goalSuggestionTemplateId: string,
      priority: Priority | null,
      careTeamAssigneeRole: UserRole | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      CBOCategoryId: string | null,
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
};

export interface goalSuggestionDeleteMutationVariables {
  answerId?: string | null,
  screeningToolScoreRangeId?: string | null,
  goalSuggestionTemplateId: string,
};

export interface goalSuggestionDeleteMutation {
  // unsuggest a goal suggestion template for an answer
  goalSuggestionDelete:  Array< {
    id: string,
    title: string,
    taskTemplates:  Array< {
      id: string,
      title: string,
      completedWithinNumber: number | null,
      completedWithinInterval: CompletedWithinInterval | null,
      repeating: boolean | null,
      goalSuggestionTemplateId: string,
      priority: Priority | null,
      careTeamAssigneeRole: UserRole | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      CBOCategoryId: string | null,
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
};

export interface goalSuggestionTemplateCreateMutationVariables {
  title: string,
};

export interface goalSuggestionTemplateCreateMutation {
  // goal suggestion template create
  goalSuggestionTemplateCreate:  {
    id: string,
    title: string,
    taskTemplates:  Array< {
      id: string,
      title: string,
      completedWithinNumber: number | null,
      completedWithinInterval: CompletedWithinInterval | null,
      repeating: boolean | null,
      goalSuggestionTemplateId: string,
      priority: Priority | null,
      careTeamAssigneeRole: UserRole | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      CBOCategoryId: string | null,
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export interface goalSuggestionTemplateDeleteMutationVariables {
  goalSuggestionTemplateId: string,
};

export interface goalSuggestionTemplateDeleteMutation {
  // Deletes a goal suggestion template
  goalSuggestionTemplateDelete:  {
    id: string,
    title: string,
    taskTemplates:  Array< {
      id: string,
      title: string,
      completedWithinNumber: number | null,
      completedWithinInterval: CompletedWithinInterval | null,
      repeating: boolean | null,
      goalSuggestionTemplateId: string,
      priority: Priority | null,
      careTeamAssigneeRole: UserRole | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      CBOCategoryId: string | null,
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export interface goalSuggestionTemplateEditMutationVariables {
  goalSuggestionTemplateId: string,
  title: string,
};

export interface goalSuggestionTemplateEditMutation {
  // Edit a goal suggestion template
  goalSuggestionTemplateEdit:  {
    id: string,
    title: string,
    taskTemplates:  Array< {
      id: string,
      title: string,
      completedWithinNumber: number | null,
      completedWithinInterval: CompletedWithinInterval | null,
      repeating: boolean | null,
      goalSuggestionTemplateId: string,
      priority: Priority | null,
      careTeamAssigneeRole: UserRole | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      CBOCategoryId: string | null,
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export interface JWTForPDFCreateMutation {
  // Jwt token to view a PDF
  JWTForPDFCreate:  {
    authToken: string,
  },
};

export interface logInUserMutationVariables {
  googleAuthCode: string,
};

export interface logInUserMutation {
  // Login user
  userLogin:  {
    // The auth token to allow for quick login. JWT passed back in via headers for further requests
    authToken: string | null,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
  } | null,
};

export interface patientAnswersCreateMutationVariables {
  patientId: string,
  patientAnswers: Array< PatientAnswerInput | null >,
  questionIds: Array< string | null >,
  patientScreeningToolSubmissionId?: string | null,
  riskAreaAssessmentSubmissionId?: string | null,
  progressNoteId?: string | null,
};

export interface patientAnswersCreateMutation {
  // Create a patient answer
  patientAnswersCreate:  Array< {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    answerId: string,
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
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } > | null,
      goalSuggestions:  Array< {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        title: string,
      } | null,
      screeningTool:  {
        id: string,
        title: string,
      } | null,
    },
    answerValue: string,
    patientId: string,
    applicable: boolean | null,
    question:  {
      id: string,
      title: string,
    } | null,
    patientScreeningToolSubmissionId: string | null,
  } | null > | null,
};

export interface patientConcernBulkEditMutationVariables {
  patientConcerns: Array< PatientConcernBulkEditFields | null >,
  patientId: string,
};

export interface patientConcernBulkEditMutation {
  // patient concern bulk edit
  patientConcernBulkEdit:  Array< {
    id: string,
    order: number,
    concernId: string,
    concern:  {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    },
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    patientGoals:  Array< {
      id: string,
      title: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      patientConcernId: string | null,
      goalSuggestionTemplateId: string | null,
      tasks:  Array< {
        id: string,
        title: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
        completedAt: string | null,
        deletedAt: string | null,
        dueAt: string | null,
        patientId: string,
        priority: Priority | null,
        assignedTo:  {
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
        } >,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        },
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } > | null,
    startedAt: string | null,
    completedAt: string | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
};

export interface patientConcernCreateMutationVariables {
  patientId: string,
  concernId: string,
  startedAt?: string | null,
};

export interface patientConcernCreateMutation {
  // patient concern create
  patientConcernCreate:  {
    id: string,
    order: number,
    concernId: string,
    concern:  {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    },
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    patientGoals:  Array< {
      id: string,
      title: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      patientConcernId: string | null,
      goalSuggestionTemplateId: string | null,
      tasks:  Array< {
        id: string,
        title: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
        completedAt: string | null,
        deletedAt: string | null,
        dueAt: string | null,
        patientId: string,
        priority: Priority | null,
        assignedTo:  {
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
        } >,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        },
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } > | null,
    startedAt: string | null,
    completedAt: string | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export interface patientConcernDeleteMutationVariables {
  patientConcernId: string,
};

export interface patientConcernDeleteMutation {
  // patient concern delete
  patientConcernDelete:  {
    id: string,
    order: number,
    concernId: string,
    concern:  {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    },
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    patientGoals:  Array< {
      id: string,
      title: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      patientConcernId: string | null,
      goalSuggestionTemplateId: string | null,
      tasks:  Array< {
        id: string,
        title: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
        completedAt: string | null,
        deletedAt: string | null,
        dueAt: string | null,
        patientId: string,
        priority: Priority | null,
        assignedTo:  {
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
        } >,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        },
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } > | null,
    startedAt: string | null,
    completedAt: string | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export interface patientEditMutationVariables {
  patientId: string,
  firstName?: string | null,
  middleName?: string | null,
  lastName?: string | null,
  dateOfBirth?: string | null,
  gender?: string | null,
  zip?: string | null,
  language?: string | null,
  consentToCall?: boolean | null,
  consentToText?: boolean | null,
};

export interface patientEditMutation {
  // Edit fields on patient stored in the db
  patientEdit:  {
    id: string,
    firstName: string,
    middleName: string | null,
    lastName: string,
    language: string | null,
    gender: string | null,
    dateOfBirth: string | null,
    zip: string | null,
    createdAt: string,
    consentToText: boolean | null,
    consentToCall: boolean | null,
  } | null,
};

export interface patientGoalCreateMutationVariables {
  title?: string | null,
  patientId: string,
  patientConcernId?: string | null,
  goalSuggestionTemplateId?: string | null,
  taskTemplateIds?: Array< string | null > | null,
  concernId?: string | null,
  concernTitle?: string | null,
  startedAt?: string | null,
};

export interface patientGoalCreateMutation {
  // patient goal create
  patientGoalCreate:  {
    id: string,
    title: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    patientConcernId: string | null,
    goalSuggestionTemplateId: string | null,
    tasks:  Array< {
      id: string,
      title: string,
      description: string | null,
      createdAt: string,
      updatedAt: string,
      completedAt: string | null,
      deletedAt: string | null,
      dueAt: string | null,
      patientId: string,
      priority: Priority | null,
      assignedTo:  {
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
      } >,
      createdBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        googleProfileImageUrl: string | null,
        userRole: UserRole,
      },
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export interface patientGoalDeleteMutationVariables {
  patientGoalId: string,
};

export interface patientGoalDeleteMutation {
  // patient goal delete
  patientGoalDelete:  {
    id: string,
    title: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    patientConcernId: string | null,
    goalSuggestionTemplateId: string | null,
    tasks:  Array< {
      id: string,
      title: string,
      description: string | null,
      createdAt: string,
      updatedAt: string,
      completedAt: string | null,
      deletedAt: string | null,
      dueAt: string | null,
      patientId: string,
      priority: Priority | null,
      assignedTo:  {
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
      } >,
      createdBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        googleProfileImageUrl: string | null,
        userRole: UserRole,
      },
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export interface patientListCreateMutationVariables {
  title: string,
  answerId: string,
  order: number,
};

export interface patientListCreateMutation {
  // Create a PatientList
  patientListCreate:  {
    id: string,
    title: string,
    answerId: string,
    order: number,
    createdAt: string,
  } | null,
};

export interface patientListDeleteMutationVariables {
  patientListId: string,
};

export interface patientListDeleteMutation {
  // Delete a PatientList
  patientListDelete:  {
    id: string,
    title: string,
    answerId: string,
    order: number,
    createdAt: string,
  } | null,
};

export interface patientListEditMutationVariables {
  patientListId: string,
  title?: string | null,
  answerId?: string | null,
  order?: number | null,
};

export interface patientListEditMutation {
  // Edit a PatientList
  patientListEdit:  {
    id: string,
    title: string,
    answerId: string,
    order: number,
    createdAt: string,
  } | null,
};

export interface patientScratchPadEditMutationVariables {
  patientId: string,
  text: string,
};

export interface patientScratchPadEditMutation {
  // Edit a patient scratch pad
  patientScratchPadEdit:  {
    text: string | null,
  } | null,
};

export interface patientScreeningToolSubmissionCreateMutationVariables {
  patientId: string,
  screeningToolId: string,
};

export interface patientScreeningToolSubmissionCreateMutation {
  // patient screening tool submission create
  patientScreeningToolSubmissionCreate:  {
    id: string,
    screeningToolId: string,
    screeningTool:  {
      title: string,
    },
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    userId: string,
    user:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    },
    score: number | null,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      assessmentType: AssessmentType,
      order: number,
      mediumRiskThreshold: number,
      highRiskThreshold: number,
      riskAreaGroup:  {
        id: string,
        title: string,
      },
    },
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    scoredAt: string | null,
    carePlanSuggestions:  Array< {
      id: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      suggestionType: CarePlanSuggestionType,
      concernId: string | null,
      concern:  {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } | null,
      goalSuggestionTemplateId: string | null,
      goalSuggestionTemplate:  {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null,
      acceptedById: string | null,
      acceptedBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      } | null,
      dismissedById: string | null,
      dismissedBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      } | null,
      dismissedReason: string | null,
      createdAt: string,
      updatedAt: string,
      dismissedAt: string | null,
      acceptedAt: string | null,
      patientScreeningToolSubmissionId: string | null,
    } >,
    screeningToolScoreRangeId: string | null,
    screeningToolScoreRange:  {
      id: string,
      description: string,
    } | null,
  } | null,
};

export interface patientScreeningToolSubmissionScoreMutationVariables {
  patientScreeningToolSubmissionId: string,
};

export interface patientScreeningToolSubmissionScoreMutation {
  // patient screening tool submission score
  patientScreeningToolSubmissionScore:  {
    id: string,
    screeningToolId: string,
    screeningTool:  {
      title: string,
    },
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    userId: string,
    user:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    },
    score: number | null,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      assessmentType: AssessmentType,
      order: number,
      mediumRiskThreshold: number,
      highRiskThreshold: number,
      riskAreaGroup:  {
        id: string,
        title: string,
      },
    },
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    scoredAt: string | null,
    carePlanSuggestions:  Array< {
      id: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      suggestionType: CarePlanSuggestionType,
      concernId: string | null,
      concern:  {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } | null,
      goalSuggestionTemplateId: string | null,
      goalSuggestionTemplate:  {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null,
      acceptedById: string | null,
      acceptedBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      } | null,
      dismissedById: string | null,
      dismissedBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      } | null,
      dismissedReason: string | null,
      createdAt: string,
      updatedAt: string,
      dismissedAt: string | null,
      acceptedAt: string | null,
      patientScreeningToolSubmissionId: string | null,
    } >,
    screeningToolScoreRangeId: string | null,
    screeningToolScoreRange:  {
      id: string,
      description: string,
    } | null,
  } | null,
};

export interface patientSetupMutationVariables {
  homeClinicId: string,
  firstName: string,
  middleName?: string | null,
  lastName: string,
  dateOfBirth: string,
  gender: string,
  maritalStatus: string,
  race: string,
  zip: string,
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

export interface patientSetupMutation {
  // Setup patient creates the patient in the db AND in athena
  patientSetup:  {
    id: string,
    firstName: string,
    middleName: string | null,
    lastName: string,
    language: string | null,
    gender: string | null,
    dateOfBirth: string | null,
    zip: string | null,
    createdAt: string,
    consentToText: boolean | null,
    consentToCall: boolean | null,
  } | null,
};

export interface progressNoteAddSupervisorNotesMutationVariables {
  progressNoteId: string,
  supervisorNotes: string,
};

export interface progressNoteAddSupervisorNotesMutation {
  // add or edit supervisor notes
  progressNoteAddSupervisorNotes:  {
    id: string,
    patientId: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    completedAt: string | null,
    createdAt: string,
    updatedAt: string,
    summary: string | null,
    memberConcern: string | null,
    startedAt: string | null,
    location: string | null,
    deletedAt: string | null,
    needsSupervisorReview: boolean | null,
    reviewedBySupervisorAt: string | null,
    supervisorNotes: string | null,
    supervisor:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    progressNoteTemplate:  {
      id: string,
      title: string,
      createdAt: string,
      deletedAt: string | null,
    } | null,
  } | null,
};

export interface progressNoteCompleteMutationVariables {
  progressNoteId: string,
};

export interface progressNoteCompleteMutation {
  // completes a progress note
  progressNoteComplete:  {
    id: string,
    patientId: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    completedAt: string | null,
    createdAt: string,
    updatedAt: string,
    summary: string | null,
    memberConcern: string | null,
    startedAt: string | null,
    location: string | null,
    deletedAt: string | null,
    needsSupervisorReview: boolean | null,
    reviewedBySupervisorAt: string | null,
    supervisorNotes: string | null,
    supervisor:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    progressNoteTemplate:  {
      id: string,
      title: string,
      createdAt: string,
      deletedAt: string | null,
    } | null,
  } | null,
};

export interface progressNoteCompleteSupervisorReviewMutationVariables {
  progressNoteId: string,
};

export interface progressNoteCompleteSupervisorReviewMutation {
  // closes out supervisor review
  progressNoteCompleteSupervisorReview:  {
    id: string,
    patientId: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    completedAt: string | null,
    createdAt: string,
    updatedAt: string,
    summary: string | null,
    memberConcern: string | null,
    startedAt: string | null,
    location: string | null,
    deletedAt: string | null,
    needsSupervisorReview: boolean | null,
    reviewedBySupervisorAt: string | null,
    supervisorNotes: string | null,
    supervisor:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    progressNoteTemplate:  {
      id: string,
      title: string,
      createdAt: string,
      deletedAt: string | null,
    } | null,
  } | null,
};

export interface progressNoteCreateMutationVariables {
  patientId: string,
};

export interface progressNoteCreateMutation {
  // creates a progress note
  progressNoteCreate:  {
    id: string,
    patientId: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    completedAt: string | null,
    createdAt: string,
    updatedAt: string,
    summary: string | null,
    memberConcern: string | null,
    startedAt: string | null,
    location: string | null,
    deletedAt: string | null,
    needsSupervisorReview: boolean | null,
    reviewedBySupervisorAt: string | null,
    supervisorNotes: string | null,
    supervisor:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    progressNoteTemplate:  {
      id: string,
      title: string,
      createdAt: string,
      deletedAt: string | null,
    } | null,
  } | null,
};

export interface progressNoteEditMutationVariables {
  progressNoteId: string,
  progressNoteTemplateId?: string | null,
  startedAt?: string | null,
  location?: string | null,
  summary?: string | null,
  memberConcern?: string | null,
  needsSupervisorReview?: boolean | null,
  supervisorId?: string | null,
};

export interface progressNoteEditMutation {
  // edits a progress note
  progressNoteEdit:  {
    id: string,
    patientId: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    completedAt: string | null,
    createdAt: string,
    updatedAt: string,
    summary: string | null,
    memberConcern: string | null,
    startedAt: string | null,
    location: string | null,
    deletedAt: string | null,
    needsSupervisorReview: boolean | null,
    reviewedBySupervisorAt: string | null,
    supervisorNotes: string | null,
    supervisor:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    progressNoteTemplate:  {
      id: string,
      title: string,
      createdAt: string,
      deletedAt: string | null,
    } | null,
  } | null,
};

export interface progressNoteTemplateCreateMutationVariables {
  title: string,
};

export interface progressNoteTemplateCreateMutation {
  // create a progress note template
  progressNoteTemplateCreate:  {
    id: string,
    title: string,
    createdAt: string,
    deletedAt: string | null,
  } | null,
};

export interface progressNoteTemplateDeleteMutationVariables {
  progressNoteTemplateId: string,
};

export interface progressNoteTemplateDeleteMutation {
  // deletes a progress note template
  progressNoteTemplateDelete:  {
    id: string,
    title: string,
    createdAt: string,
    deletedAt: string | null,
  } | null,
};

export interface progressNoteTemplateEditMutationVariables {
  title: string,
  progressNoteTemplateId: string,
};

export interface progressNoteTemplateEditMutation {
  // edits a progress note template
  progressNoteTemplateEdit:  {
    id: string,
    title: string,
    createdAt: string,
    deletedAt: string | null,
  } | null,
};

export interface questionConditionCreateMutationVariables {
  answerId: string,
  questionId: string,
};

export interface questionConditionCreateMutation {
  // Create a QuestionCondition
  questionConditionCreate:  {
    id: string,
    questionId: string,
    answerId: string,
  } | null,
};

export interface questionConditionDeleteMutationVariables {
  questionConditionId: string,
};

export interface questionConditionDeleteMutation {
  // Deletes a QuestionCondition
  questionConditionDelete:  {
    id: string,
    questionId: string,
    answerId: string,
  } | null,
};

export interface questionConditionEditMutationVariables {
  questionConditionId: string,
  answerId: string,
  questionId: string,
};

export interface questionConditionEditMutation {
  // Edit a QuestionCondition
  questionConditionEdit:  {
    id: string,
    questionId: string,
    answerId: string,
  } | null,
};

export interface questionCreateMutationVariables {
  title: string,
  answerType: AnswerTypeOptions,
  validatedSource?: string | null,
  riskAreaId?: string | null,
  screeningToolId?: string | null,
  progressNoteTemplateId?: string | null,
  order: number,
  applicableIfType?: QuestionConditionTypeOptions | null,
  computedFieldId?: string | null,
  hasOtherTextAnswer?: boolean | null,
};

export interface questionCreateMutation {
  // Create a Question
  questionCreate:  {
    id: string,
    createdAt: string,
    deletedAt: string | null,
    title: string,
    validatedSource: string | null,
    answerType: AnswerTypeOptions,
    riskAreaId: string | null,
    screeningToolId: string | null,
    order: number,
    applicableIfType: QuestionConditionTypeOptions | null,
    otherTextAnswerId: string | null,
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
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } > | null,
      goalSuggestions:  Array< {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        title: string,
      } | null,
      screeningTool:  {
        id: string,
        title: string,
      } | null,
    } > | null,
    applicableIfQuestionConditions:  Array< {
      id: string,
      questionId: string,
      answerId: string,
    } >,
    computedFieldId: string | null,
    computedField:  {
      id: string,
      label: string,
      slug: string,
      dataType: ComputedFieldDataTypes,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
  } | null,
};

export interface questionDeleteMutationVariables {
  questionId: string,
};

export interface questionDeleteMutation {
  // Delete a question
  questionDelete:  {
    id: string,
    createdAt: string,
    deletedAt: string | null,
    title: string,
    validatedSource: string | null,
    answerType: AnswerTypeOptions,
    riskAreaId: string | null,
    screeningToolId: string | null,
    order: number,
    applicableIfType: QuestionConditionTypeOptions | null,
    otherTextAnswerId: string | null,
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
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } > | null,
      goalSuggestions:  Array< {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        title: string,
      } | null,
      screeningTool:  {
        id: string,
        title: string,
      } | null,
    } > | null,
    applicableIfQuestionConditions:  Array< {
      id: string,
      questionId: string,
      answerId: string,
    } >,
    computedFieldId: string | null,
    computedField:  {
      id: string,
      label: string,
      slug: string,
      dataType: ComputedFieldDataTypes,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
  } | null,
};

export interface questionEditMutationVariables {
  questionId: string,
  title?: string | null,
  answerType?: AnswerTypeOptions | null,
  validatedSource?: string | null,
  order?: number | null,
  applicableIfType?: QuestionConditionTypeOptions | null,
};

export interface questionEditMutation {
  // Edit a Question
  questionEdit:  {
    id: string,
    createdAt: string,
    deletedAt: string | null,
    title: string,
    validatedSource: string | null,
    answerType: AnswerTypeOptions,
    riskAreaId: string | null,
    screeningToolId: string | null,
    order: number,
    applicableIfType: QuestionConditionTypeOptions | null,
    otherTextAnswerId: string | null,
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
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } > | null,
      goalSuggestions:  Array< {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        title: string,
      } | null,
      screeningTool:  {
        id: string,
        title: string,
      } | null,
    } > | null,
    applicableIfQuestionConditions:  Array< {
      id: string,
      questionId: string,
      answerId: string,
    } >,
    computedFieldId: string | null,
    computedField:  {
      id: string,
      label: string,
      slug: string,
      dataType: ComputedFieldDataTypes,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
  } | null,
};

export interface quickCallCreateMutationVariables {
  patientId: string,
  reason: string,
  summary: string,
  direction: QuickCallDirection,
  callRecipient: string,
  wasSuccessful: boolean,
  startTime: string,
};

export interface quickCallCreateMutation {
  // creates a quick call
  quickCallCreate:  {
    id: string,
    userId: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    progressNoteId: string,
    reason: string,
    summary: string,
    direction: QuickCallDirection,
    callRecipient: string,
    wasSuccessful: boolean,
    startTime: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export interface riskAreaAssessmentSubmissionCompleteMutationVariables {
  riskAreaAssessmentSubmissionId: string,
};

export interface riskAreaAssessmentSubmissionCompleteMutation {
  // risk area assessment submission complete
  riskAreaAssessmentSubmissionComplete:  {
    id: string,
    riskAreaId: string,
    patientId: string,
    userId: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    completedAt: string | null,
    carePlanSuggestions:  Array< {
      id: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      suggestionType: CarePlanSuggestionType,
      concernId: string | null,
      concern:  {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } | null,
      goalSuggestionTemplateId: string | null,
      goalSuggestionTemplate:  {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null,
      acceptedById: string | null,
      acceptedBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      } | null,
      dismissedById: string | null,
      dismissedBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      } | null,
      dismissedReason: string | null,
      createdAt: string,
      updatedAt: string,
      dismissedAt: string | null,
      acceptedAt: string | null,
      patientScreeningToolSubmissionId: string | null,
    } >,
  } | null,
};

export interface riskAreaAssessmentSubmissionCreateMutationVariables {
  riskAreaId: string,
  patientId: string,
};

export interface riskAreaAssessmentSubmissionCreateMutation {
  // risk area assessment submission create
  riskAreaAssessmentSubmissionCreate:  {
    id: string,
    riskAreaId: string,
    patientId: string,
    userId: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    completedAt: string | null,
    carePlanSuggestions:  Array< {
      id: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      suggestionType: CarePlanSuggestionType,
      concernId: string | null,
      concern:  {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } | null,
      goalSuggestionTemplateId: string | null,
      goalSuggestionTemplate:  {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null,
      acceptedById: string | null,
      acceptedBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      } | null,
      dismissedById: string | null,
      dismissedBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      } | null,
      dismissedReason: string | null,
      createdAt: string,
      updatedAt: string,
      dismissedAt: string | null,
      acceptedAt: string | null,
      patientScreeningToolSubmissionId: string | null,
    } >,
  } | null,
};

export interface riskAreaCreateMutationVariables {
  title: string,
  assessmentType: AssessmentType,
  riskAreaGroupId: string,
  order: number,
  mediumRiskThreshold: number,
  highRiskThreshold: number,
};

export interface riskAreaCreateMutation {
  // Create a RiskArea
  riskAreaCreate:  {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    assessmentType: AssessmentType,
    order: number,
    mediumRiskThreshold: number,
    highRiskThreshold: number,
    riskAreaGroup:  {
      id: string,
      title: string,
    },
  } | null,
};

export interface riskAreaDeleteMutationVariables {
  riskAreaId: string,
};

export interface riskAreaDeleteMutation {
  // Deletes a RiskArea
  riskAreaDelete:  {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    assessmentType: AssessmentType,
    order: number,
    mediumRiskThreshold: number,
    highRiskThreshold: number,
    riskAreaGroup:  {
      id: string,
      title: string,
    },
  } | null,
};

export interface riskAreaEditMutationVariables {
  riskAreaId: string,
  title?: string | null,
  order?: number | null,
  mediumRiskThreshold?: number | null,
  highRiskThreshold?: number | null,
};

export interface riskAreaEditMutation {
  // Edit a RiskArea
  riskAreaEdit:  {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    assessmentType: AssessmentType,
    order: number,
    mediumRiskThreshold: number,
    highRiskThreshold: number,
    riskAreaGroup:  {
      id: string,
      title: string,
    },
  } | null,
};

export interface riskAreaGroupCreateMutationVariables {
  title: string,
  shortTitle: string,
  order: number,
  mediumRiskThreshold: number,
  highRiskThreshold: number,
};

export interface riskAreaGroupCreateMutation {
  // Create a RiskAreaGroup
  riskAreaGroupCreate:  {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    shortTitle: string,
    order: number,
    mediumRiskThreshold: number,
    highRiskThreshold: number,
  } | null,
};

export interface riskAreaGroupDeleteMutationVariables {
  riskAreaGroupId: string,
};

export interface riskAreaGroupDeleteMutation {
  // Delete a RiskAreaGroup
  riskAreaGroupDelete:  {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    shortTitle: string,
    order: number,
    mediumRiskThreshold: number,
    highRiskThreshold: number,
  } | null,
};

export interface riskAreaGroupEditMutationVariables {
  riskAreaGroupId: string,
  title?: string | null,
  shortTitle?: string | null,
  order?: number | null,
  mediumRiskThreshold?: number | null,
  highRiskThreshold?: number | null,
};

export interface riskAreaGroupEditMutation {
  // Edit a RiskAreaGroup
  riskAreaGroupEdit:  {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    shortTitle: string,
    order: number,
    mediumRiskThreshold: number,
    highRiskThreshold: number,
  } | null,
};

export interface screeningToolCreateMutationVariables {
  title: string,
  riskAreaId: string,
};

export interface screeningToolCreateMutation {
  // screening tool create
  screeningToolCreate:  {
    id: string,
    title: string,
    riskAreaId: string,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      assessmentType: AssessmentType,
      order: number,
      mediumRiskThreshold: number,
      highRiskThreshold: number,
      riskAreaGroup:  {
        id: string,
        title: string,
      },
    },
    screeningToolScoreRanges:  Array< {
      id: string,
      description: string,
      minimumScore: number,
      maximumScore: number,
      screeningToolId: string,
      riskAdjustmentType: RiskAdjustmentTypeOptions,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } >,
      goalSuggestions:  Array< {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
    } >,
    patientScreeningToolSubmissions:  Array< {
      id: string,
      screeningToolId: string,
      patientId: string,
      userId: string,
      score: number | null,
      screeningToolScoreRangeId: string | null,
      screeningToolScoreRange:  {
        id: string,
        riskAdjustmentType: RiskAdjustmentTypeOptions,
        description: string,
      } | null,
      patientAnswers:  Array< {
        updatedAt: string,
        answer:  {
          riskAdjustmentType: RiskAdjustmentTypeOptions | null,
          inSummary: boolean | null,
          summaryText: string | null,
        },
      } > | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export interface screeningToolDeleteMutationVariables {
  screeningToolId: string,
};

export interface screeningToolDeleteMutation {
  // screening tool delete
  screeningToolDelete:  {
    id: string,
    title: string,
    riskAreaId: string,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      assessmentType: AssessmentType,
      order: number,
      mediumRiskThreshold: number,
      highRiskThreshold: number,
      riskAreaGroup:  {
        id: string,
        title: string,
      },
    },
    screeningToolScoreRanges:  Array< {
      id: string,
      description: string,
      minimumScore: number,
      maximumScore: number,
      screeningToolId: string,
      riskAdjustmentType: RiskAdjustmentTypeOptions,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } >,
      goalSuggestions:  Array< {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
    } >,
    patientScreeningToolSubmissions:  Array< {
      id: string,
      screeningToolId: string,
      patientId: string,
      userId: string,
      score: number | null,
      screeningToolScoreRangeId: string | null,
      screeningToolScoreRange:  {
        id: string,
        riskAdjustmentType: RiskAdjustmentTypeOptions,
        description: string,
      } | null,
      patientAnswers:  Array< {
        updatedAt: string,
        answer:  {
          riskAdjustmentType: RiskAdjustmentTypeOptions | null,
          inSummary: boolean | null,
          summaryText: string | null,
        },
      } > | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export interface screeningToolEditMutationVariables {
  screeningToolId: string,
  title?: string | null,
  riskAreaId?: string | null,
};

export interface screeningToolEditMutation {
  // screening tool edit
  screeningToolEdit:  {
    id: string,
    title: string,
    riskAreaId: string,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      assessmentType: AssessmentType,
      order: number,
      mediumRiskThreshold: number,
      highRiskThreshold: number,
      riskAreaGroup:  {
        id: string,
        title: string,
      },
    },
    screeningToolScoreRanges:  Array< {
      id: string,
      description: string,
      minimumScore: number,
      maximumScore: number,
      screeningToolId: string,
      riskAdjustmentType: RiskAdjustmentTypeOptions,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } >,
      goalSuggestions:  Array< {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
    } >,
    patientScreeningToolSubmissions:  Array< {
      id: string,
      screeningToolId: string,
      patientId: string,
      userId: string,
      score: number | null,
      screeningToolScoreRangeId: string | null,
      screeningToolScoreRange:  {
        id: string,
        riskAdjustmentType: RiskAdjustmentTypeOptions,
        description: string,
      } | null,
      patientAnswers:  Array< {
        updatedAt: string,
        answer:  {
          riskAdjustmentType: RiskAdjustmentTypeOptions | null,
          inSummary: boolean | null,
          summaryText: string | null,
        },
      } > | null,
    } > | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export interface screeningToolScoreRangeCreateMutationVariables {
  description: string,
  screeningToolId: string,
  minimumScore: number,
  maximumScore: number,
  riskAdjustmentType: RiskAdjustmentTypeOptions,
};

export interface screeningToolScoreRangeCreateMutation {
  // screening tool score range create
  screeningToolScoreRangeCreate:  {
    id: string,
    description: string,
    minimumScore: number,
    maximumScore: number,
    screeningToolId: string,
    riskAdjustmentType: RiskAdjustmentTypeOptions,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    } >,
    goalSuggestions:  Array< {
      id: string,
      title: string,
      taskTemplates:  Array< {
        id: string,
        title: string,
        completedWithinNumber: number | null,
        completedWithinInterval: CompletedWithinInterval | null,
        repeating: boolean | null,
        goalSuggestionTemplateId: string,
        priority: Priority | null,
        careTeamAssigneeRole: UserRole | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        CBOCategoryId: string | null,
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
  } | null,
};

export interface screeningToolScoreRangeDeleteMutationVariables {
  screeningToolScoreRangeId: string,
};

export interface screeningToolScoreRangeDeleteMutation {
  // screening tool score range delete
  screeningToolScoreRangeDelete:  {
    id: string,
    description: string,
    minimumScore: number,
    maximumScore: number,
    screeningToolId: string,
    riskAdjustmentType: RiskAdjustmentTypeOptions,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    } >,
    goalSuggestions:  Array< {
      id: string,
      title: string,
      taskTemplates:  Array< {
        id: string,
        title: string,
        completedWithinNumber: number | null,
        completedWithinInterval: CompletedWithinInterval | null,
        repeating: boolean | null,
        goalSuggestionTemplateId: string,
        priority: Priority | null,
        careTeamAssigneeRole: UserRole | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        CBOCategoryId: string | null,
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
  } | null,
};

export interface screeningToolScoreRangeEditMutationVariables {
  screeningToolScoreRangeId: string,
  description?: string | null,
  screeningToolId?: string | null,
  minimumScore?: number | null,
  maximumScore?: number | null,
  riskAdjustmentType?: RiskAdjustmentTypeOptions | null,
};

export interface screeningToolScoreRangeEditMutation {
  // screening tool score range edit
  screeningToolScoreRangeEdit:  {
    id: string,
    description: string,
    minimumScore: number,
    maximumScore: number,
    screeningToolId: string,
    riskAdjustmentType: RiskAdjustmentTypeOptions,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    } >,
    goalSuggestions:  Array< {
      id: string,
      title: string,
      taskTemplates:  Array< {
        id: string,
        title: string,
        completedWithinNumber: number | null,
        completedWithinInterval: CompletedWithinInterval | null,
        repeating: boolean | null,
        goalSuggestionTemplateId: string,
        priority: Priority | null,
        careTeamAssigneeRole: UserRole | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        CBOCategoryId: string | null,
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
  } | null,
};

export interface taskCommentCreateMutationVariables {
  taskId: string,
  body: string,
};

export interface taskCommentCreateMutation {
  // Create a task
  taskCommentCreate:  {
    id: string,
    body: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    taskId: string,
    createdAt: string,
    updatedAt: string | null,
  } | null,
};

export interface taskCommentEditMutationVariables {
  taskCommentId: string,
  body: string,
};

export interface taskCommentEditMutation {
  // Edit a task
  taskCommentEdit:  {
    id: string,
    body: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    taskId: string,
    createdAt: string,
    updatedAt: string | null,
  } | null,
};

export interface taskCompleteMutationVariables {
  taskId: string,
};

export interface taskCompleteMutation {
  // Complete a task
  taskComplete:  {
    id: string,
    title: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: Priority | null,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
    },
    assignedTo:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } >,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    },
    patientGoal:  {
      id: string,
      title: string,
      patientConcern:  {
        concern:  {
          id: string,
          title: string,
        },
      } | null,
    },
    CBOReferralId: string | null,
    CBOReferral:  {
      id: string,
      categoryId: string,
      category:  {
        id: string,
        title: string,
      },
      CBOId: string | null,
      CBO:  {
        id: string,
        name: string,
        categoryId: string,
        address: string,
        city: string,
        state: string,
        zip: string,
        fax: string | null,
        phone: string,
        url: string,
      } | null,
      name: string | null,
      url: string | null,
      diagnosis: string | null,
      sentAt: string | null,
      acknowledgedAt: string | null,
    } | null,
  } | null,
};

export interface taskCreateMutationVariables {
  title: string,
  description: string,
  dueAt: string,
  patientId: string,
  priority?: Priority | null,
  assignedToId?: string | null,
  patientGoalId?: string | null,
  CBOReferralId?: string | null,
};

export interface taskCreateMutation {
  // Create a task
  taskCreate:  {
    id: string,
    title: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: Priority | null,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
    },
    assignedTo:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } >,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    },
    patientGoal:  {
      id: string,
      title: string,
      patientConcern:  {
        concern:  {
          id: string,
          title: string,
        },
      } | null,
    },
    CBOReferralId: string | null,
    CBOReferral:  {
      id: string,
      categoryId: string,
      category:  {
        id: string,
        title: string,
      },
      CBOId: string | null,
      CBO:  {
        id: string,
        name: string,
        categoryId: string,
        address: string,
        city: string,
        state: string,
        zip: string,
        fax: string | null,
        phone: string,
        url: string,
      } | null,
      name: string | null,
      url: string | null,
      diagnosis: string | null,
      sentAt: string | null,
      acknowledgedAt: string | null,
    } | null,
  } | null,
};

export interface taskDeleteMutationVariables {
  taskId: string,
};

export interface taskDeleteMutation {
  // Delete a task
  taskDelete:  {
    id: string,
    title: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: Priority | null,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
    },
    assignedTo:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } >,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    },
    patientGoal:  {
      id: string,
      title: string,
      patientConcern:  {
        concern:  {
          id: string,
          title: string,
        },
      } | null,
    },
    CBOReferralId: string | null,
    CBOReferral:  {
      id: string,
      categoryId: string,
      category:  {
        id: string,
        title: string,
      },
      CBOId: string | null,
      CBO:  {
        id: string,
        name: string,
        categoryId: string,
        address: string,
        city: string,
        state: string,
        zip: string,
        fax: string | null,
        phone: string,
        url: string,
      } | null,
      name: string | null,
      url: string | null,
      diagnosis: string | null,
      sentAt: string | null,
      acknowledgedAt: string | null,
    } | null,
  } | null,
};

export interface taskEditMutationVariables {
  taskId: string,
  assignedToId?: string | null,
  title?: string | null,
  description?: string | null,
  priority?: Priority | null,
  dueAt?: string | null,
  patientGoalId?: string | null,
};

export interface taskEditMutation {
  // Edit a task
  taskEdit:  {
    id: string,
    title: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: Priority | null,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
    },
    assignedTo:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } >,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    },
    patientGoal:  {
      id: string,
      title: string,
      patientConcern:  {
        concern:  {
          id: string,
          title: string,
        },
      } | null,
    },
    CBOReferralId: string | null,
    CBOReferral:  {
      id: string,
      categoryId: string,
      category:  {
        id: string,
        title: string,
      },
      CBOId: string | null,
      CBO:  {
        id: string,
        name: string,
        categoryId: string,
        address: string,
        city: string,
        state: string,
        zip: string,
        fax: string | null,
        phone: string,
        url: string,
      } | null,
      name: string | null,
      url: string | null,
      diagnosis: string | null,
      sentAt: string | null,
      acknowledgedAt: string | null,
    } | null,
  } | null,
};

export interface taskTemplateCreateMutationVariables {
  title: string,
  goalSuggestionTemplateId: string,
  completedWithinNumber?: number | null,
  completedWithinInterval?: string | null,
  repeating?: boolean | null,
  priority?: Priority | null,
  careTeamAssigneeRole?: string | null,
  CBOCategoryId?: string | null,
};

export interface taskTemplateCreateMutation {
  // task template create
  taskTemplateCreate:  {
    id: string,
    title: string,
    completedWithinNumber: number | null,
    completedWithinInterval: CompletedWithinInterval | null,
    repeating: boolean | null,
    goalSuggestionTemplateId: string,
    priority: Priority | null,
    careTeamAssigneeRole: UserRole | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    CBOCategoryId: string | null,
  } | null,
};

export interface taskTemplateDeleteMutationVariables {
  taskTemplateId: string,
};

export interface taskTemplateDeleteMutation {
  // Deletes a task template
  taskTemplateDelete:  {
    id: string,
    title: string,
    completedWithinNumber: number | null,
    completedWithinInterval: CompletedWithinInterval | null,
    repeating: boolean | null,
    goalSuggestionTemplateId: string,
    priority: Priority | null,
    careTeamAssigneeRole: UserRole | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    CBOCategoryId: string | null,
  } | null,
};

export interface taskTemplateEditMutationVariables {
  title: string,
  taskTemplateId: string,
  goalSuggestionTemplateId?: string | null,
  completedWithinNumber?: number | null,
  completedWithinInterval?: string | null,
  repeating?: boolean | null,
  priority?: Priority | null,
  careTeamAssigneeRole?: string | null,
  CBOCategoryId?: string | null,
};

export interface taskTemplateEditMutation {
  // Edit a task template
  taskTemplateEdit:  {
    id: string,
    title: string,
    completedWithinNumber: number | null,
    completedWithinInterval: CompletedWithinInterval | null,
    repeating: boolean | null,
    goalSuggestionTemplateId: string,
    priority: Priority | null,
    careTeamAssigneeRole: UserRole | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    CBOCategoryId: string | null,
  } | null,
};

export interface taskUncompleteMutationVariables {
  taskId: string,
};

export interface taskUncompleteMutation {
  // Uncomplete a task
  taskUncomplete:  {
    id: string,
    title: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: Priority | null,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
    },
    assignedTo:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } >,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    },
    patientGoal:  {
      id: string,
      title: string,
      patientConcern:  {
        concern:  {
          id: string,
          title: string,
        },
      } | null,
    },
    CBOReferralId: string | null,
    CBOReferral:  {
      id: string,
      categoryId: string,
      category:  {
        id: string,
        title: string,
      },
      CBOId: string | null,
      CBO:  {
        id: string,
        name: string,
        categoryId: string,
        address: string,
        city: string,
        state: string,
        zip: string,
        fax: string | null,
        phone: string,
        url: string,
      } | null,
      name: string | null,
      url: string | null,
      diagnosis: string | null,
      sentAt: string | null,
      acknowledgedAt: string | null,
    } | null,
  } | null,
};

export interface taskUserFollowMutationVariables {
  taskId: string,
  userId: string,
};

export interface taskUserFollowMutation {
  // Add user to task followers
  taskUserFollow:  {
    id: string,
    title: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: Priority | null,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
    },
    assignedTo:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } >,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    },
    patientGoal:  {
      id: string,
      title: string,
      patientConcern:  {
        concern:  {
          id: string,
          title: string,
        },
      } | null,
    },
    CBOReferralId: string | null,
    CBOReferral:  {
      id: string,
      categoryId: string,
      category:  {
        id: string,
        title: string,
      },
      CBOId: string | null,
      CBO:  {
        id: string,
        name: string,
        categoryId: string,
        address: string,
        city: string,
        state: string,
        zip: string,
        fax: string | null,
        phone: string,
        url: string,
      } | null,
      name: string | null,
      url: string | null,
      diagnosis: string | null,
      sentAt: string | null,
      acknowledgedAt: string | null,
    } | null,
  } | null,
};

export interface getTasksForCurrentUserQueryVariables {
  pageNumber?: number | null,
  pageSize?: number | null,
  orderBy?: TaskOrderOptions | null,
};

export interface getTasksForCurrentUserQuery {
  // Current user's Tasks
  tasksForCurrentUser:  {
    edges:  Array< {
      node:  {
        id: string,
        title: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
        completedAt: string | null,
        deletedAt: string | null,
        dueAt: string | null,
        patientId: string,
        priority: Priority | null,
        patient:  {
          id: string,
          firstName: string,
          middleName: string | null,
          lastName: string,
        },
        assignedTo:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          userRole: UserRole,
          googleProfileImageUrl: string | null,
        } | null,
        followers:  Array< {
          id: string,
          firstName: string | null,
          lastName: string | null,
          userRole: UserRole,
          googleProfileImageUrl: string | null,
        } >,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          userRole: UserRole,
          googleProfileImageUrl: string | null,
        },
        patientGoal:  {
          id: string,
          title: string,
          patientConcern:  {
            concern:  {
              id: string,
              title: string,
            },
          } | null,
        },
        CBOReferralId: string | null,
        CBOReferral:  {
          id: string,
          categoryId: string,
          category:  {
            id: string,
            title: string,
          },
          CBOId: string | null,
          CBO:  {
            id: string,
            name: string,
            categoryId: string,
            address: string,
            city: string,
            state: string,
            zip: string,
            fax: string | null,
            phone: string,
            url: string,
          } | null,
          name: string | null,
          url: string | null,
          diagnosis: string | null,
          sentAt: string | null,
          acknowledgedAt: string | null,
        } | null,
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
  },
};

export interface userCreateMutationVariables {
  email: string,
  homeClinicId: string,
};

export interface userCreateMutation {
  // Create a new user
  userCreate:  {
    id: string,
    locale: string | null,
    phone: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export interface userDeleteMutationVariables {
  email: string,
};

export interface userDeleteMutation {
  // Delete user
  userDelete:  {
    id: string,
    locale: string | null,
    phone: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export interface userEditRoleMutationVariables {
  email: string,
  userRole: string,
};

export interface userEditRoleMutation {
  // Edit user
  userEditRole:  {
    id: string,
    locale: string | null,
    phone: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export interface FullAnswerFragment {
  id: string,
  displayValue: string,
  value: string,
  valueType: AnswerValueTypeOptions,
  riskAdjustmentType: RiskAdjustmentTypeOptions | null,
  inSummary: boolean | null,
  summaryText: string | null,
  questionId: string,
  order: number,
  concernSuggestions:  Array< {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    diagnosisCodes:  Array< {
      id: string,
      code: string,
      codesetName: string,
      label: string,
      version: string,
    } > | null,
  } > | null,
  goalSuggestions:  Array< {
    id: string,
    title: string,
    taskTemplates:  Array< {
      id: string,
      title: string,
      completedWithinNumber: number | null,
      completedWithinInterval: CompletedWithinInterval | null,
      repeating: boolean | null,
      goalSuggestionTemplateId: string,
      priority: Priority | null,
      careTeamAssigneeRole: UserRole | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      CBOCategoryId: string | null,
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
  riskArea:  {
    id: string,
    title: string,
  } | null,
  screeningTool:  {
    id: string,
    title: string,
  } | null,
};

export interface FullCarePlanSuggestionFragment {
  id: string,
  patientId: string,
  patient:  {
    id: string,
    firstName: string,
    middleName: string | null,
    lastName: string,
    language: string | null,
    gender: string | null,
    dateOfBirth: string | null,
    zip: string | null,
    createdAt: string,
    consentToText: boolean | null,
    consentToCall: boolean | null,
  },
  suggestionType: CarePlanSuggestionType,
  concernId: string | null,
  concern:  {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    diagnosisCodes:  Array< {
      id: string,
      code: string,
      codesetName: string,
      label: string,
      version: string,
    } > | null,
  } | null,
  goalSuggestionTemplateId: string | null,
  goalSuggestionTemplate:  {
    id: string,
    title: string,
    taskTemplates:  Array< {
      id: string,
      title: string,
      completedWithinNumber: number | null,
      completedWithinInterval: CompletedWithinInterval | null,
      repeating: boolean | null,
      goalSuggestionTemplateId: string,
      priority: Priority | null,
      careTeamAssigneeRole: UserRole | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      CBOCategoryId: string | null,
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
  acceptedById: string | null,
  acceptedBy:  {
    id: string,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    googleProfileImageUrl: string | null,
  } | null,
  dismissedById: string | null,
  dismissedBy:  {
    id: string,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    googleProfileImageUrl: string | null,
  } | null,
  dismissedReason: string | null,
  createdAt: string,
  updatedAt: string,
  dismissedAt: string | null,
  acceptedAt: string | null,
  patientScreeningToolSubmissionId: string | null,
};

export interface FullCarePlanUpdateEventFragment {
  id: string,
  patientId: string,
  patient:  {
    id: string,
    firstName: string,
    middleName: string | null,
    lastName: string,
    language: string | null,
    gender: string | null,
    dateOfBirth: string | null,
    zip: string | null,
    createdAt: string,
    consentToText: boolean | null,
    consentToCall: boolean | null,
  },
  userId: string,
  user:  {
    id: string,
    locale: string | null,
    phone: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
    createdAt: string,
    updatedAt: string,
  },
  patientConcernId: string | null,
  patientConcern:  {
    id: string,
    order: number,
    concernId: string,
    concern:  {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    },
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    patientGoals:  Array< {
      id: string,
      title: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      patientConcernId: string | null,
      goalSuggestionTemplateId: string | null,
      tasks:  Array< {
        id: string,
        title: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
        completedAt: string | null,
        deletedAt: string | null,
        dueAt: string | null,
        patientId: string,
        priority: Priority | null,
        assignedTo:  {
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
        } >,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        },
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } > | null,
    startedAt: string | null,
    completedAt: string | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
  patientGoalId: string | null,
  patientGoal:  {
    id: string,
    title: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    patientConcernId: string | null,
    goalSuggestionTemplateId: string | null,
    tasks:  Array< {
      id: string,
      title: string,
      description: string | null,
      createdAt: string,
      updatedAt: string,
      completedAt: string | null,
      deletedAt: string | null,
      dueAt: string | null,
      patientId: string,
      priority: Priority | null,
      assignedTo:  {
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
      } >,
      createdBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        googleProfileImageUrl: string | null,
        userRole: UserRole,
      },
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
  eventType: CarePlanUpdateEventTypes,
  progressNoteId: string | null,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
};

export interface FullCBOCategoryFragment {
  id: string,
  title: string,
};

export interface FullCBOReferralFragment {
  id: string,
  categoryId: string,
  category:  {
    id: string,
    title: string,
  },
  CBOId: string | null,
  CBO:  {
    id: string,
    name: string,
    categoryId: string,
    address: string,
    city: string,
    state: string,
    zip: string,
    fax: string | null,
    phone: string,
    url: string,
  } | null,
  name: string | null,
  url: string | null,
  diagnosis: string | null,
  sentAt: string | null,
  acknowledgedAt: string | null,
};

export interface FullCBOFragment {
  id: string,
  name: string,
  categoryId: string,
  category:  {
    id: string,
    title: string,
  },
  address: string,
  city: string,
  state: string,
  zip: string,
  fax: string | null,
  phone: string,
  url: string,
  createdAt: string,
};

export interface FullClinicFragment {
  id: string,
  name: string,
};

export interface FullComputedFieldFragment {
  id: string,
  label: string,
  slug: string,
  dataType: ComputedFieldDataTypes,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
};

export interface FullConcernFragment {
  id: string,
  title: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
  diagnosisCodes:  Array< {
    id: string,
    code: string,
    codesetName: string,
    label: string,
    version: string,
  } > | null,
};

export interface FullDiagnosisCodeFragment {
  id: string,
  code: string,
  codesetName: string,
  label: string,
  version: string,
};

export interface FullEventNotificationFragment {
  id: string,
  title: string | null,
  userId: string,
  user:  {
    id: string,
    locale: string | null,
    phone: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
    createdAt: string,
    updatedAt: string,
  },
  taskEvent:  {
    id: string,
    taskId: string,
    task:  {
      id: string,
      title: string,
      priority: Priority | null,
    },
    userId: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    eventType: TaskEventTypes | null,
    eventCommentId: string | null,
    eventComment:  {
      id: string,
      body: string,
      user:  {
        id: string,
        locale: string | null,
        phone: string | null,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        email: string | null,
        homeClinicId: string,
        googleProfileImageUrl: string | null,
        createdAt: string,
        updatedAt: string,
      },
      taskId: string,
      createdAt: string,
      updatedAt: string | null,
    } | null,
    eventUserId: string | null,
    eventUser:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
  seenAt: string | null,
  emailSentAt: string | null,
  deliveredAt: string | null,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
};

export interface FullGoalSuggestionTemplateFragment {
  id: string,
  title: string,
  taskTemplates:  Array< {
    id: string,
    title: string,
    completedWithinNumber: number | null,
    completedWithinInterval: CompletedWithinInterval | null,
    repeating: boolean | null,
    goalSuggestionTemplateId: string,
    priority: Priority | null,
    careTeamAssigneeRole: UserRole | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    CBOCategoryId: string | null,
  } >,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
};

export interface FullPatientAnswerEventFragment {
  id: string,
  patientId: string,
  patient:  {
    id: string,
    firstName: string,
    middleName: string | null,
    lastName: string,
    language: string | null,
    gender: string | null,
    dateOfBirth: string | null,
    zip: string | null,
    createdAt: string,
    consentToText: boolean | null,
    consentToCall: boolean | null,
  },
  userId: string,
  user:  {
    id: string,
    locale: string | null,
    phone: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
    createdAt: string,
    updatedAt: string,
  },
  patientAnswerId: string,
  patientAnswer:  {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    answerId: string,
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
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } > | null,
      goalSuggestions:  Array< {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        title: string,
      } | null,
      screeningTool:  {
        id: string,
        title: string,
      } | null,
    },
    answerValue: string,
    patientId: string,
    applicable: boolean | null,
    question:  {
      id: string,
      title: string,
    } | null,
    patientScreeningToolSubmissionId: string | null,
  },
  previousPatientAnswerId: string | null,
  previousPatientAnswer:  {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    answerId: string,
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
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } > | null,
      goalSuggestions:  Array< {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        title: string,
      } | null,
      screeningTool:  {
        id: string,
        title: string,
      } | null,
    },
    answerValue: string,
    patientId: string,
    applicable: boolean | null,
    question:  {
      id: string,
      title: string,
    } | null,
    patientScreeningToolSubmissionId: string | null,
  } | null,
  eventType: PatientAnswerEventTypes,
  progressNoteId: string | null,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
};

export interface FullPatientAnswerFragment {
  id: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
  answerId: string,
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
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    } > | null,
    goalSuggestions:  Array< {
      id: string,
      title: string,
      taskTemplates:  Array< {
        id: string,
        title: string,
        completedWithinNumber: number | null,
        completedWithinInterval: CompletedWithinInterval | null,
        repeating: boolean | null,
        goalSuggestionTemplateId: string,
        priority: Priority | null,
        careTeamAssigneeRole: UserRole | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        CBOCategoryId: string | null,
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
    riskArea:  {
      id: string,
      title: string,
    } | null,
    screeningTool:  {
      id: string,
      title: string,
    } | null,
  },
  answerValue: string,
  patientId: string,
  applicable: boolean | null,
  question:  {
    id: string,
    title: string,
  } | null,
  patientScreeningToolSubmissionId: string | null,
};

export interface FullPatientConcernFragment {
  id: string,
  order: number,
  concernId: string,
  concern:  {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    diagnosisCodes:  Array< {
      id: string,
      code: string,
      codesetName: string,
      label: string,
      version: string,
    } > | null,
  },
  patientId: string,
  patient:  {
    id: string,
    firstName: string,
    middleName: string | null,
    lastName: string,
    language: string | null,
    gender: string | null,
    dateOfBirth: string | null,
    zip: string | null,
    createdAt: string,
    consentToText: boolean | null,
    consentToCall: boolean | null,
  },
  patientGoals:  Array< {
    id: string,
    title: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    patientConcernId: string | null,
    goalSuggestionTemplateId: string | null,
    tasks:  Array< {
      id: string,
      title: string,
      description: string | null,
      createdAt: string,
      updatedAt: string,
      completedAt: string | null,
      deletedAt: string | null,
      dueAt: string | null,
      patientId: string,
      priority: Priority | null,
      assignedTo:  {
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
      } >,
      createdBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        googleProfileImageUrl: string | null,
        userRole: UserRole,
      },
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } > | null,
  startedAt: string | null,
  completedAt: string | null,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
};

export interface FullPatientForCBOReferralFormPDFFragment {
  id: string,
  createdAt: string,
  firstName: string,
  lastName: string,
  language: string | null,
  dateOfBirth: string | null,
  gender: string | null,
  careTeam:  Array< {
    id: string,
    locale: string | null,
    phone: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
    createdAt: string,
    updatedAt: string,
  } > | null,
};

export interface FullPatientForDashboardFragment {
  id: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string | null,
  gender: string | null,
};

export interface FullPatientGoalFragment {
  id: string,
  title: string,
  patientId: string,
  patient:  {
    id: string,
    firstName: string,
    middleName: string | null,
    lastName: string,
    language: string | null,
    gender: string | null,
    dateOfBirth: string | null,
    zip: string | null,
    createdAt: string,
    consentToText: boolean | null,
    consentToCall: boolean | null,
  },
  patientConcernId: string | null,
  goalSuggestionTemplateId: string | null,
  tasks:  Array< {
    id: string,
    title: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: Priority | null,
    assignedTo:  {
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
    } >,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    },
  } >,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
};

export interface FullPatientListFragment {
  id: string,
  title: string,
  answerId: string,
  order: number,
  createdAt: string,
};

export interface FullPatientScratchPadFragment {
  text: string | null,
};

export interface FullPatientScreeningToolSubmissionFragment {
  id: string,
  screeningToolId: string,
  screeningTool:  {
    title: string,
  },
  patientId: string,
  patient:  {
    id: string,
    firstName: string,
    middleName: string | null,
    lastName: string,
    language: string | null,
    gender: string | null,
    dateOfBirth: string | null,
    zip: string | null,
    createdAt: string,
    consentToText: boolean | null,
    consentToCall: boolean | null,
  },
  userId: string,
  user:  {
    id: string,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    googleProfileImageUrl: string | null,
  },
  score: number | null,
  riskArea:  {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    assessmentType: AssessmentType,
    order: number,
    mediumRiskThreshold: number,
    highRiskThreshold: number,
    riskAreaGroup:  {
      id: string,
      title: string,
    },
  },
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
  scoredAt: string | null,
  carePlanSuggestions:  Array< {
    id: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    suggestionType: CarePlanSuggestionType,
    concernId: string | null,
    concern:  {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    } | null,
    goalSuggestionTemplateId: string | null,
    goalSuggestionTemplate:  {
      id: string,
      title: string,
      taskTemplates:  Array< {
        id: string,
        title: string,
        completedWithinNumber: number | null,
        completedWithinInterval: CompletedWithinInterval | null,
        repeating: boolean | null,
        goalSuggestionTemplateId: string,
        priority: Priority | null,
        careTeamAssigneeRole: UserRole | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        CBOCategoryId: string | null,
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
    acceptedById: string | null,
    acceptedBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    dismissedById: string | null,
    dismissedBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    dismissedReason: string | null,
    createdAt: string,
    updatedAt: string,
    dismissedAt: string | null,
    acceptedAt: string | null,
    patientScreeningToolSubmissionId: string | null,
  } >,
  screeningToolScoreRangeId: string | null,
  screeningToolScoreRange:  {
    id: string,
    description: string,
  } | null,
};

export interface FullPatientSearchResultFragment {
  id: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string | null,
  gender: string | null,
  userCareTeam: boolean,
};

export interface FullProgressNoteActivityFragment {
  taskEvents:  Array< {
    id: string,
    taskId: string,
    task:  {
      id: string,
      title: string,
      priority: Priority | null,
    },
    userId: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    eventType: TaskEventTypes | null,
    eventCommentId: string | null,
    eventComment:  {
      id: string,
      body: string,
      user:  {
        id: string,
        locale: string | null,
        phone: string | null,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        email: string | null,
        homeClinicId: string,
        googleProfileImageUrl: string | null,
        createdAt: string,
        updatedAt: string,
      },
      taskId: string,
      createdAt: string,
      updatedAt: string | null,
    } | null,
    eventUserId: string | null,
    eventUser:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } >,
  patientAnswerEvents:  Array< {
    id: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    userId: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    patientAnswerId: string,
    patientAnswer:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      answerId: string,
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
        concernSuggestions:  Array< {
          id: string,
          title: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          diagnosisCodes:  Array< {
            id: string,
            code: string,
            codesetName: string,
            label: string,
            version: string,
          } > | null,
        } > | null,
        goalSuggestions:  Array< {
          id: string,
          title: string,
          taskTemplates:  Array< {
            id: string,
            title: string,
            completedWithinNumber: number | null,
            completedWithinInterval: CompletedWithinInterval | null,
            repeating: boolean | null,
            goalSuggestionTemplateId: string,
            priority: Priority | null,
            careTeamAssigneeRole: UserRole | null,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
            CBOCategoryId: string | null,
          } >,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null > | null,
        riskArea:  {
          id: string,
          title: string,
        } | null,
        screeningTool:  {
          id: string,
          title: string,
        } | null,
      },
      answerValue: string,
      patientId: string,
      applicable: boolean | null,
      question:  {
        id: string,
        title: string,
      } | null,
      patientScreeningToolSubmissionId: string | null,
    },
    previousPatientAnswerId: string | null,
    previousPatientAnswer:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      answerId: string,
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
        concernSuggestions:  Array< {
          id: string,
          title: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          diagnosisCodes:  Array< {
            id: string,
            code: string,
            codesetName: string,
            label: string,
            version: string,
          } > | null,
        } > | null,
        goalSuggestions:  Array< {
          id: string,
          title: string,
          taskTemplates:  Array< {
            id: string,
            title: string,
            completedWithinNumber: number | null,
            completedWithinInterval: CompletedWithinInterval | null,
            repeating: boolean | null,
            goalSuggestionTemplateId: string,
            priority: Priority | null,
            careTeamAssigneeRole: UserRole | null,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
            CBOCategoryId: string | null,
          } >,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null > | null,
        riskArea:  {
          id: string,
          title: string,
        } | null,
        screeningTool:  {
          id: string,
          title: string,
        } | null,
      },
      answerValue: string,
      patientId: string,
      applicable: boolean | null,
      question:  {
        id: string,
        title: string,
      } | null,
      patientScreeningToolSubmissionId: string | null,
    } | null,
    eventType: PatientAnswerEventTypes,
    progressNoteId: string | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } >,
  carePlanUpdateEvents:  Array< {
    id: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    userId: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    patientConcernId: string | null,
    patientConcern:  {
      id: string,
      order: number,
      concernId: string,
      concern:  {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      },
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      patientGoals:  Array< {
        id: string,
        title: string,
        patientId: string,
        patient:  {
          id: string,
          firstName: string,
          middleName: string | null,
          lastName: string,
          language: string | null,
          gender: string | null,
          dateOfBirth: string | null,
          zip: string | null,
          createdAt: string,
          consentToText: boolean | null,
          consentToCall: boolean | null,
        },
        patientConcernId: string | null,
        goalSuggestionTemplateId: string | null,
        tasks:  Array< {
          id: string,
          title: string,
          description: string | null,
          createdAt: string,
          updatedAt: string,
          completedAt: string | null,
          deletedAt: string | null,
          dueAt: string | null,
          patientId: string,
          priority: Priority | null,
          assignedTo:  {
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
          } >,
          createdBy:  {
            id: string,
            firstName: string | null,
            lastName: string | null,
            googleProfileImageUrl: string | null,
            userRole: UserRole,
          },
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } > | null,
      startedAt: string | null,
      completedAt: string | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
    patientGoalId: string | null,
    patientGoal:  {
      id: string,
      title: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      patientConcernId: string | null,
      goalSuggestionTemplateId: string | null,
      tasks:  Array< {
        id: string,
        title: string,
        description: string | null,
        createdAt: string,
        updatedAt: string,
        completedAt: string | null,
        deletedAt: string | null,
        dueAt: string | null,
        patientId: string,
        priority: Priority | null,
        assignedTo:  {
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
        } >,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        },
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
    eventType: CarePlanUpdateEventTypes,
    progressNoteId: string | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } >,
  quickCallEvents:  Array< {
    id: string,
    userId: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    progressNoteId: string,
    reason: string,
    summary: string,
    direction: QuickCallDirection,
    callRecipient: string,
    wasSuccessful: boolean,
    startTime: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } >,
  patientScreeningToolSubmissions:  Array< {
    id: string,
    screeningToolId: string,
    screeningTool:  {
      title: string,
    },
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    userId: string,
    user:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    },
    score: number | null,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      assessmentType: AssessmentType,
      order: number,
      mediumRiskThreshold: number,
      highRiskThreshold: number,
      riskAreaGroup:  {
        id: string,
        title: string,
      },
    },
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    scoredAt: string | null,
    carePlanSuggestions:  Array< {
      id: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        language: string | null,
        gender: string | null,
        dateOfBirth: string | null,
        zip: string | null,
        createdAt: string,
        consentToText: boolean | null,
        consentToCall: boolean | null,
      },
      suggestionType: CarePlanSuggestionType,
      concernId: string | null,
      concern:  {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        diagnosisCodes:  Array< {
          id: string,
          code: string,
          codesetName: string,
          label: string,
          version: string,
        } > | null,
      } | null,
      goalSuggestionTemplateId: string | null,
      goalSuggestionTemplate:  {
        id: string,
        title: string,
        taskTemplates:  Array< {
          id: string,
          title: string,
          completedWithinNumber: number | null,
          completedWithinInterval: CompletedWithinInterval | null,
          repeating: boolean | null,
          goalSuggestionTemplateId: string,
          priority: Priority | null,
          careTeamAssigneeRole: UserRole | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          CBOCategoryId: string | null,
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null,
      acceptedById: string | null,
      acceptedBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      } | null,
      dismissedById: string | null,
      dismissedBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        userRole: UserRole,
        googleProfileImageUrl: string | null,
      } | null,
      dismissedReason: string | null,
      createdAt: string,
      updatedAt: string,
      dismissedAt: string | null,
      acceptedAt: string | null,
      patientScreeningToolSubmissionId: string | null,
    } >,
    screeningToolScoreRangeId: string | null,
    screeningToolScoreRange:  {
      id: string,
      description: string,
    } | null,
  } >,
};

export interface FullProgressNoteTemplateFragment {
  id: string,
  title: string,
  createdAt: string,
  deletedAt: string | null,
};

export interface FullProgressNoteFragment {
  id: string,
  patientId: string,
  user:  {
    id: string,
    locale: string | null,
    phone: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
    createdAt: string,
    updatedAt: string,
  },
  patient:  {
    id: string,
    firstName: string,
    middleName: string | null,
    lastName: string,
    language: string | null,
    gender: string | null,
    dateOfBirth: string | null,
    zip: string | null,
    createdAt: string,
    consentToText: boolean | null,
    consentToCall: boolean | null,
  },
  completedAt: string | null,
  createdAt: string,
  updatedAt: string,
  summary: string | null,
  memberConcern: string | null,
  startedAt: string | null,
  location: string | null,
  deletedAt: string | null,
  needsSupervisorReview: boolean | null,
  reviewedBySupervisorAt: string | null,
  supervisorNotes: string | null,
  supervisor:  {
    id: string,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    googleProfileImageUrl: string | null,
  } | null,
  progressNoteTemplate:  {
    id: string,
    title: string,
    createdAt: string,
    deletedAt: string | null,
  } | null,
};

export interface FullQuestionConditionFragment {
  id: string,
  questionId: string,
  answerId: string,
};

export interface FullQuestionFragment {
  id: string,
  createdAt: string,
  deletedAt: string | null,
  title: string,
  validatedSource: string | null,
  answerType: AnswerTypeOptions,
  riskAreaId: string | null,
  screeningToolId: string | null,
  order: number,
  applicableIfType: QuestionConditionTypeOptions | null,
  otherTextAnswerId: string | null,
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
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    } > | null,
    goalSuggestions:  Array< {
      id: string,
      title: string,
      taskTemplates:  Array< {
        id: string,
        title: string,
        completedWithinNumber: number | null,
        completedWithinInterval: CompletedWithinInterval | null,
        repeating: boolean | null,
        goalSuggestionTemplateId: string,
        priority: Priority | null,
        careTeamAssigneeRole: UserRole | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        CBOCategoryId: string | null,
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
    riskArea:  {
      id: string,
      title: string,
    } | null,
    screeningTool:  {
      id: string,
      title: string,
    } | null,
  } > | null,
  applicableIfQuestionConditions:  Array< {
    id: string,
    questionId: string,
    answerId: string,
  } >,
  computedFieldId: string | null,
  computedField:  {
    id: string,
    label: string,
    slug: string,
    dataType: ComputedFieldDataTypes,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export interface FullQuickCallFragment {
  id: string,
  userId: string,
  user:  {
    id: string,
    locale: string | null,
    phone: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
    createdAt: string,
    updatedAt: string,
  },
  progressNoteId: string,
  reason: string,
  summary: string,
  direction: QuickCallDirection,
  callRecipient: string,
  wasSuccessful: boolean,
  startTime: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
};

export interface FullRiskAreaAssessmentSubmissionFragment {
  id: string,
  riskAreaId: string,
  patientId: string,
  userId: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
  completedAt: string | null,
  carePlanSuggestions:  Array< {
    id: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      language: string | null,
      gender: string | null,
      dateOfBirth: string | null,
      zip: string | null,
      createdAt: string,
      consentToText: boolean | null,
      consentToCall: boolean | null,
    },
    suggestionType: CarePlanSuggestionType,
    concernId: string | null,
    concern:  {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    } | null,
    goalSuggestionTemplateId: string | null,
    goalSuggestionTemplate:  {
      id: string,
      title: string,
      taskTemplates:  Array< {
        id: string,
        title: string,
        completedWithinNumber: number | null,
        completedWithinInterval: CompletedWithinInterval | null,
        repeating: boolean | null,
        goalSuggestionTemplateId: string,
        priority: Priority | null,
        careTeamAssigneeRole: UserRole | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        CBOCategoryId: string | null,
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
    acceptedById: string | null,
    acceptedBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    dismissedById: string | null,
    dismissedBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      googleProfileImageUrl: string | null,
    } | null,
    dismissedReason: string | null,
    createdAt: string,
    updatedAt: string,
    dismissedAt: string | null,
    acceptedAt: string | null,
    patientScreeningToolSubmissionId: string | null,
  } >,
};

export interface FullRiskAreaForPatientFragment {
  id: string,
  title: string,
  assessmentType: AssessmentType,
  mediumRiskThreshold: number,
  highRiskThreshold: number,
  questions:  Array< {
    id: string,
    answers:  Array< {
      id: string,
      inSummary: boolean | null,
      riskAdjustmentType: RiskAdjustmentTypeOptions | null,
      summaryText: string | null,
      patientAnswers:  Array< {
        id: string,
        patientId: string,
        createdAt: string,
        updatedAt: string,
        answerValue: string,
      } > | null,
    } > | null,
  } >,
  riskAreaAssessmentSubmissions:  Array< {
    id: string,
    createdAt: string,
  } >,
  screeningTools:  Array< {
    id: string,
    title: string,
    patientScreeningToolSubmissions:  Array< {
      id: string,
      screeningToolId: string,
      patientId: string,
      userId: string,
      score: number | null,
      screeningToolScoreRangeId: string | null,
      screeningToolScoreRange:  {
        id: string,
        riskAdjustmentType: RiskAdjustmentTypeOptions,
        description: string,
      } | null,
      patientAnswers:  Array< {
        updatedAt: string,
        answer:  {
          riskAdjustmentType: RiskAdjustmentTypeOptions | null,
          inSummary: boolean | null,
          summaryText: string | null,
        },
      } > | null,
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } >,
};

export interface FullRiskAreaGroupFragment {
  id: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
  title: string,
  shortTitle: string,
  order: number,
  mediumRiskThreshold: number,
  highRiskThreshold: number,
};

export interface FullRiskAreaSummaryFragment {
  summary: Array< string >,
  started: boolean,
  lastUpdated: string | null,
};

export interface FullRiskAreaFragment {
  id: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
  title: string,
  assessmentType: AssessmentType,
  order: number,
  mediumRiskThreshold: number,
  highRiskThreshold: number,
  riskAreaGroup:  {
    id: string,
    title: string,
  },
};

export interface FullRiskScoreFragment {
  score: number,
  forceHighRisk: boolean,
};

export interface FullScreeningToolForPatientFragment {
  id: string,
  title: string,
  patientScreeningToolSubmissions:  Array< {
    id: string,
    screeningToolId: string,
    patientId: string,
    userId: string,
    score: number | null,
    screeningToolScoreRangeId: string | null,
    screeningToolScoreRange:  {
      id: string,
      riskAdjustmentType: RiskAdjustmentTypeOptions,
      description: string,
    } | null,
    patientAnswers:  Array< {
      updatedAt: string,
      answer:  {
        riskAdjustmentType: RiskAdjustmentTypeOptions | null,
        inSummary: boolean | null,
        summaryText: string | null,
      },
    } > | null,
  } >,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
};

export interface FullScreeningToolScoreRangeFragment {
  id: string,
  description: string,
  minimumScore: number,
  maximumScore: number,
  screeningToolId: string,
  riskAdjustmentType: RiskAdjustmentTypeOptions,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
  concernSuggestions:  Array< {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    diagnosisCodes:  Array< {
      id: string,
      code: string,
      codesetName: string,
      label: string,
      version: string,
    } > | null,
  } >,
  goalSuggestions:  Array< {
    id: string,
    title: string,
    taskTemplates:  Array< {
      id: string,
      title: string,
      completedWithinNumber: number | null,
      completedWithinInterval: CompletedWithinInterval | null,
      repeating: boolean | null,
      goalSuggestionTemplateId: string,
      priority: Priority | null,
      careTeamAssigneeRole: UserRole | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      CBOCategoryId: string | null,
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
};

export interface FullScreeningToolFragment {
  id: string,
  title: string,
  riskAreaId: string,
  riskArea:  {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    assessmentType: AssessmentType,
    order: number,
    mediumRiskThreshold: number,
    highRiskThreshold: number,
    riskAreaGroup:  {
      id: string,
      title: string,
    },
  },
  screeningToolScoreRanges:  Array< {
    id: string,
    description: string,
    minimumScore: number,
    maximumScore: number,
    screeningToolId: string,
    riskAdjustmentType: RiskAdjustmentTypeOptions,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      diagnosisCodes:  Array< {
        id: string,
        code: string,
        codesetName: string,
        label: string,
        version: string,
      } > | null,
    } >,
    goalSuggestions:  Array< {
      id: string,
      title: string,
      taskTemplates:  Array< {
        id: string,
        title: string,
        completedWithinNumber: number | null,
        completedWithinInterval: CompletedWithinInterval | null,
        repeating: boolean | null,
        goalSuggestionTemplateId: string,
        priority: Priority | null,
        careTeamAssigneeRole: UserRole | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        CBOCategoryId: string | null,
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
  } >,
  patientScreeningToolSubmissions:  Array< {
    id: string,
    screeningToolId: string,
    patientId: string,
    userId: string,
    score: number | null,
    screeningToolScoreRangeId: string | null,
    screeningToolScoreRange:  {
      id: string,
      riskAdjustmentType: RiskAdjustmentTypeOptions,
      description: string,
    } | null,
    patientAnswers:  Array< {
      updatedAt: string,
      answer:  {
        riskAdjustmentType: RiskAdjustmentTypeOptions | null,
        inSummary: boolean | null,
        summaryText: string | null,
      },
    } > | null,
  } > | null,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
};

export interface FullTaskCommentFragment {
  id: string,
  body: string,
  user:  {
    id: string,
    locale: string | null,
    phone: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
    createdAt: string,
    updatedAt: string,
  },
  taskId: string,
  createdAt: string,
  updatedAt: string | null,
};

export interface FullTaskEventFragment {
  id: string,
  taskId: string,
  task:  {
    id: string,
    title: string,
    priority: Priority | null,
  },
  userId: string,
  user:  {
    id: string,
    locale: string | null,
    phone: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
    createdAt: string,
    updatedAt: string,
  },
  eventType: TaskEventTypes | null,
  eventCommentId: string | null,
  eventComment:  {
    id: string,
    body: string,
    user:  {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    taskId: string,
    createdAt: string,
    updatedAt: string | null,
  } | null,
  eventUserId: string | null,
  eventUser:  {
    id: string,
    locale: string | null,
    phone: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
};

export interface FullTaskForCBOReferralFormPDFFragment {
  id: string,
  title: string,
  description: string | null,
  createdAt: string,
  updatedAt: string,
  completedAt: string | null,
  deletedAt: string | null,
  dueAt: string | null,
  patientId: string,
  patient:  {
    id: string,
    createdAt: string,
    firstName: string,
    lastName: string,
    language: string | null,
    dateOfBirth: string | null,
    gender: string | null,
    careTeam:  Array< {
      id: string,
      locale: string | null,
      phone: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    } > | null,
  },
  priority: Priority | null,
  assignedTo:  {
    id: string,
    locale: string | null,
    phone: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
  createdBy:  {
    id: string,
    locale: string | null,
    phone: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
    createdAt: string,
    updatedAt: string,
  },
  CBOReferralId: string | null,
  CBOReferral:  {
    id: string,
    categoryId: string,
    category:  {
      id: string,
      title: string,
    },
    CBOId: string | null,
    CBO:  {
      id: string,
      name: string,
      categoryId: string,
      address: string,
      city: string,
      state: string,
      zip: string,
      fax: string | null,
      phone: string,
      url: string,
    } | null,
    name: string | null,
    url: string | null,
    diagnosis: string | null,
    sentAt: string | null,
    acknowledgedAt: string | null,
  } | null,
};

export interface FullTaskTemplateFragment {
  id: string,
  title: string,
  completedWithinNumber: number | null,
  completedWithinInterval: CompletedWithinInterval | null,
  repeating: boolean | null,
  goalSuggestionTemplateId: string,
  priority: Priority | null,
  careTeamAssigneeRole: UserRole | null,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
  CBOCategoryId: string | null,
};

export interface FullTaskFragment {
  id: string,
  title: string,
  description: string | null,
  createdAt: string,
  updatedAt: string,
  completedAt: string | null,
  deletedAt: string | null,
  dueAt: string | null,
  patientId: string,
  priority: Priority | null,
  patient:  {
    id: string,
    firstName: string,
    middleName: string | null,
    lastName: string,
  },
  assignedTo:  {
    id: string,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    googleProfileImageUrl: string | null,
  } | null,
  followers:  Array< {
    id: string,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    googleProfileImageUrl: string | null,
  } >,
  createdBy:  {
    id: string,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    googleProfileImageUrl: string | null,
  },
  patientGoal:  {
    id: string,
    title: string,
    patientConcern:  {
      concern:  {
        id: string,
        title: string,
      },
    } | null,
  },
  CBOReferralId: string | null,
  CBOReferral:  {
    id: string,
    categoryId: string,
    category:  {
      id: string,
      title: string,
    },
    CBOId: string | null,
    CBO:  {
      id: string,
      name: string,
      categoryId: string,
      address: string,
      city: string,
      state: string,
      zip: string,
      fax: string | null,
      phone: string,
      url: string,
    } | null,
    name: string | null,
    url: string | null,
    diagnosis: string | null,
    sentAt: string | null,
    acknowledgedAt: string | null,
  } | null,
};

export interface FullUserFragment {
  id: string,
  locale: string | null,
  phone: string | null,
  firstName: string | null,
  lastName: string | null,
  userRole: UserRole,
  email: string | null,
  homeClinicId: string,
  googleProfileImageUrl: string | null,
  createdAt: string,
  updatedAt: string,
};

export interface ShortCBOFragment {
  id: string,
  name: string,
  categoryId: string,
  address: string,
  city: string,
  state: string,
  zip: string,
  fax: string | null,
  phone: string,
  url: string,
};

export interface ShortEventNotificationsForUserTaskFragment {
  id: string,
  title: string | null,
  createdAt: string,
};

export interface ShortPatientScreeningToolSubmission360Fragment {
  id: string,
  score: number | null,
  createdAt: string,
  riskArea:  {
    id: string,
    title: string,
  },
  user:  {
    id: string,
    firstName: string | null,
    lastName: string | null,
  },
  screeningTool:  {
    id: string,
    title: string,
  },
  screeningToolScoreRange:  {
    id: string,
    description: string,
    riskAdjustmentType: RiskAdjustmentTypeOptions,
  } | null,
};

export interface ShortPatientScreeningToolSubmissionFragment {
  id: string,
  screeningToolId: string,
  patientId: string,
  userId: string,
  score: number | null,
  screeningToolScoreRangeId: string | null,
  screeningToolScoreRange:  {
    id: string,
    riskAdjustmentType: RiskAdjustmentTypeOptions,
    description: string,
  } | null,
  patientAnswers:  Array< {
    updatedAt: string,
    answer:  {
      riskAdjustmentType: RiskAdjustmentTypeOptions | null,
      inSummary: boolean | null,
      summaryText: string | null,
    },
  } > | null,
};

export interface ShortPatientFragment {
  id: string,
  firstName: string,
  middleName: string | null,
  lastName: string,
  language: string | null,
  gender: string | null,
  dateOfBirth: string | null,
  zip: string | null,
  createdAt: string,
  consentToText: boolean | null,
  consentToCall: boolean | null,
};

export interface ShortTaskFragment {
  id: string,
  title: string,
  description: string | null,
  createdAt: string,
  updatedAt: string,
  completedAt: string | null,
  deletedAt: string | null,
  dueAt: string | null,
  patientId: string,
  priority: Priority | null,
  assignedTo:  {
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
  } >,
  createdBy:  {
    id: string,
    firstName: string | null,
    lastName: string | null,
    googleProfileImageUrl: string | null,
    userRole: UserRole,
  },
};

export interface ShortUrgentTaskForPatientFragment {
  id: string,
  title: string,
  dueAt: string | null,
  priority: Priority | null,
  patientId: string,
  followers:  Array< {
    id: string,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    googleProfileImageUrl: string | null,
  } >,
};

export interface ShortUserFragment {
  id: string,
  firstName: string | null,
  lastName: string | null,
  userRole: UserRole,
  googleProfileImageUrl: string | null,
};
