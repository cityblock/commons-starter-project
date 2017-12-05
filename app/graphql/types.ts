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


export enum AppointmentStatus {
  cancelled = "cancelled",
  future = "future",
  open = "open",
  checkedIn = "checkedIn",
  checkedOut = "checkedOut",
  chargeEntered = "chargeEntered",
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
}


export enum CompletedWithinInterval {
  hour = "hour",
  day = "day",
  week = "week",
  month = "month",
  year = "year",
}


export enum Priority {
  low = "low",
  medium = "medium",
  high = "high",
}


export enum UserRole {
  physician = "physician",
  nurseCareManager = "nurseCareManager",
  healthCoach = "healthCoach",
  familyMember = "familyMember",
  anonymousUser = "anonymousUser",
  admin = "admin",
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
}


export enum TaskOrderOptions {
  createdAtDesc = "createdAtDesc",
  createdAtAsc = "createdAtAsc",
  dueAtDesc = "dueAtDesc",
  dueAtAsc = "dueAtAsc",
  updatedAtDesc = "updatedAtDesc",
  updatedAtAsc = "updatedAtAsc",
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
}


export type PatientAnswerInput = {
  answerId: string,
  answerValue: string,
  patientId: string,
  applicable: boolean,
  questionId: string,
};

export type PatientConcernBulkEditFields = {
  id: string,
  order?: number | null,
  startedAt?: string | null,
  completedAt?: string | null,
};

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
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
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
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      order: number,
    } | null,
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
        order: number,
      },
      screeningToolScoreRanges:  Array< {
        id: string,
        description: string,
        minimumScore: number,
        maximumScore: number,
        screeningToolId: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        concernSuggestions:  Array< {
          id: string,
          title: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null > | null,
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
          } >,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null > | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
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
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
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
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      order: number,
    } | null,
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
        order: number,
      },
      screeningToolScoreRanges:  Array< {
        id: string,
        description: string,
        minimumScore: number,
        maximumScore: number,
        screeningToolId: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        concernSuggestions:  Array< {
          id: string,
          title: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null > | null,
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
          } >,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null > | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
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
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
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
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      order: number,
    } | null,
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
        order: number,
      },
      screeningToolScoreRanges:  Array< {
        id: string,
        description: string,
        minimumScore: number,
        maximumScore: number,
        screeningToolId: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        concernSuggestions:  Array< {
          id: string,
          title: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null > | null,
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
          } >,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null > | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
  } | null,
};

export type carePlanSuggestionAcceptMutationVariables = {
  carePlanSuggestionId: string,
  patientConcernId?: string | null,
  concernId?: string | null,
  startedAt?: string | null,
  taskTemplateIds?: Array< string | null > | null,
};

export type carePlanSuggestionAcceptMutation = {
  // care plan suggestion accept
  carePlanSuggestionAccept:  {
    id: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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

export type carePlanSuggestionDismissMutationVariables = {
  carePlanSuggestionId: string,
  dismissedReason: string,
};

export type carePlanSuggestionDismissMutation = {
  // care plan suggestion dismiss
  carePlanSuggestionDismiss:  {
    id: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
      },
    } >,
  } | null,
};

export type concernCreateMutationVariables = {
  title: string,
};

export type concernCreateMutation = {
  // Create a concern
  concernCreate:  {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export type concernDeleteMutationVariables = {
  concernId: string,
};

export type concernDeleteMutation = {
  // Deletes a concern
  concernDelete:  {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export type concernEditMutationVariables = {
  concernId: string,
  title: string,
};

export type concernEditMutation = {
  // Edit a concern
  concernEdit:  {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export type concernSuggestionCreateMutationVariables = {
  answerId?: string | null,
  screeningToolScoreRangeId?: string | null,
  concernId: string,
};

export type concernSuggestionCreateMutation = {
  // suggest a concern for an answer
  concernSuggestionCreate:  Array< {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
};

export type concernSuggestionDeleteMutationVariables = {
  answerId?: string | null,
  screeningToolScoreRangeId?: string | null,
  concernId: string,
};

export type concernSuggestionDeleteMutation = {
  // delete suggestion a concern for an answer
  concernSuggestionDelete:  Array< {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
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
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type eventNotificationDismissMutationVariables = {
  eventNotificationId: string,
};

export type eventNotificationDismissMutation = {
  // Dismisses (marks as seen) an EventNotification
  eventNotificationDismiss:  {
    id: string,
    title: string | null,
    userId: string,
    user:  {
      id: string,
      locale: string | null,
      firstName: string | null,
      lastName: string | null,
      userRole: UserRole,
      email: string | null,
      homeClinicId: string,
      googleProfileImageUrl: string | null,
      createdAt: string,
      updatedAt: string,
    },
    taskEventId: string | null,
    taskEvent:  {
      id: string,
      taskId: string,
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
        followers:  Array< {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } > | null,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } | null,
        patientGoal:  {
          id: string,
          title: string,
          patientConcern:  {
            concern:  {
              id: string,
              title: string,
            },
          } | null,
        } | null,
      },
      userId: string,
      user:  {
        id: string,
        locale: string | null,
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
      followers:  Array< {
        id: string,
        firstName: string | null,
        lastName: string | null,
        googleProfileImageUrl: string | null,
        userRole: UserRole,
      } > | null,
      createdBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        googleProfileImageUrl: string | null,
        userRole: UserRole,
      } | null,
      patientGoal:  {
        id: string,
        title: string,
        patientConcern:  {
          concern:  {
            id: string,
            title: string,
          },
        } | null,
      } | null,
    } | null,
    seenAt: string | null,
    emailSentAt: string | null,
    deliveredAt: string | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
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
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
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
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      order: number,
    } | null,
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
        order: number,
      },
      screeningToolScoreRanges:  Array< {
        id: string,
        description: string,
        minimumScore: number,
        maximumScore: number,
        screeningToolId: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        concernSuggestions:  Array< {
          id: string,
          title: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null > | null,
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
          } >,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null > | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
  } | null,
};

export type getConcernSuggestionsForAnswerQueryVariables = {
  answerId: string,
};

export type getConcernSuggestionsForAnswerQuery = {
  // Concerns for answer
  concernsForAnswer:  Array< {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
};

export type getConcernQueryVariables = {
  concernId: string,
};

export type getConcernQuery = {
  // Concern
  concern:  {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export type getConcernsQueryVariables = {
  orderBy?: ConcernOrderOptions | null,
};

export type getConcernsQuery = {
  // Concerns
  concerns:  Array< {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
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
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type getEventNotificationsForCurrentUserQueryVariables = {
  pageNumber?: number | null,
  pageSize?: number | null,
  taskEventNotificationsOnly?: boolean | null,
};

export type getEventNotificationsForCurrentUserQuery = {
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
          firstName: string | null,
          lastName: string | null,
          userRole: UserRole,
          email: string | null,
          homeClinicId: string,
          googleProfileImageUrl: string | null,
          createdAt: string,
          updatedAt: string,
        },
        taskEventId: string | null,
        taskEvent:  {
          id: string,
          taskId: string,
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
            followers:  Array< {
              id: string,
              firstName: string | null,
              lastName: string | null,
              googleProfileImageUrl: string | null,
              userRole: UserRole,
            } > | null,
            createdBy:  {
              id: string,
              firstName: string | null,
              lastName: string | null,
              googleProfileImageUrl: string | null,
              userRole: UserRole,
            } | null,
            patientGoal:  {
              id: string,
              title: string,
              patientConcern:  {
                concern:  {
                  id: string,
                  title: string,
                },
              } | null,
            } | null,
          },
          userId: string,
          user:  {
            id: string,
            locale: string | null,
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
          followers:  Array< {
            id: string,
            firstName: string | null,
            lastName: string | null,
            googleProfileImageUrl: string | null,
            userRole: UserRole,
          } > | null,
          createdBy:  {
            id: string,
            firstName: string | null,
            lastName: string | null,
            googleProfileImageUrl: string | null,
            userRole: UserRole,
          } | null,
          patientGoal:  {
            id: string,
            title: string,
            patientConcern:  {
              concern:  {
                id: string,
                title: string,
              },
            } | null,
          } | null,
        } | null,
        seenAt: string | null,
        emailSentAt: string | null,
        deliveredAt: string | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null,
    } | null > | null,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
  } | null,
};

export type getGoalSuggestionTemplateQueryVariables = {
  goalSuggestionTemplateId: string,
};

export type getGoalSuggestionTemplateQuery = {
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
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export type getGoalSuggestionTemplatesQueryVariables = {
  orderBy?: GoalSuggestionOrderOptions | null,
};

export type getGoalSuggestionTemplatesQuery = {
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
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
};

export type getGoalSuggestionsForAnswerQueryVariables = {
  answerId: string,
};

export type getGoalSuggestionsForAnswerQuery = {
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
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
};

export type getPatientAnswersQueryVariables = {
  filterType: AnswerFilterType,
  filterId: string,
  patientId: string,
};

export type getPatientAnswersQuery = {
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
      } | null > | null,
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
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        title: string,
        order: number,
      } | null,
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
          order: number,
        },
        screeningToolScoreRanges:  Array< {
          id: string,
          description: string,
          minimumScore: number,
          maximumScore: number,
          screeningToolId: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          concernSuggestions:  Array< {
            id: string,
            title: string,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
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
            } >,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
        } | null > | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
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

export type getPatientCarePlanSuggestionsQueryVariables = {
  patientId: string,
};

export type getPatientCarePlanSuggestionsQuery = {
  // Care Plan Suggestions
  carePlanSuggestionsForPatient:  Array< {
    id: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
  } | null > | null,
};

export type getPatientCarePlanQueryVariables = {
  patientId: string,
};

export type getPatientCarePlanQuery = {
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
      },
      patientId: string,
      patient:  {
        id: string,
        firstName: string | null,
        middleName: string | null,
        lastName: string | null,
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
          firstName: string | null,
          middleName: string | null,
          lastName: string | null,
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
          } > | null,
          createdBy:  {
            id: string,
            firstName: string | null,
            lastName: string | null,
            googleProfileImageUrl: string | null,
            userRole: UserRole,
          } | null,
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
        firstName: string | null,
        middleName: string | null,
        lastName: string | null,
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
        } > | null,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } | null,
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } >,
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
    createdAt: string,
    updatedAt: string,
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
        zip: string | null,
        createdAt: string,
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

export type getPatientRiskScoreForRiskAreaQueryVariables = {
  riskAreaId: string,
  patientId: string,
};

export type getPatientRiskScoreForRiskAreaQuery = {
  // PatientRiskAreaRiskScore
  patientRiskAreaRiskScore:  {
    score: number,
    forceHighRisk: boolean,
  } | null,
};

export type getPatientRiskSummaryForRiskAreaQueryVariables = {
  riskAreaId: string,
  patientId: string,
};

export type getPatientRiskSummaryForRiskAreaQuery = {
  // PatientRiskAreaSummary
  patientRiskAreaSummary:  {
    summary: Array< string >,
    started: boolean,
    lastUpdated: string | null,
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

export type getPatientScreeningToolSubmissionForPatientAndScreeningToolQueryVariables = {
  screeningToolId: string,
  patientId: string,
};

export type getPatientScreeningToolSubmissionForPatientAndScreeningToolQuery = {
  // latest patient sreening tool submission for a screening tool
  patientScreeningToolSubmissionForPatientAndScreeningTool:  {
    id: string,
    screeningToolId: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
    score: number,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      order: number,
    },
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    carePlanSuggestions:  Array< {
      id: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string | null,
        middleName: string | null,
        lastName: string | null,
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
    screeningToolScoreRangeId: string | null,
    screeningToolScoreRange:  {
      description: string,
    } | null,
  } | null,
};

export type getPatientScreeningToolSubmissionQueryVariables = {
  patientScreeningToolSubmissionId: string,
};

export type getPatientScreeningToolSubmissionQuery = {
  // patient screening tool submission
  patientScreeningToolSubmission:  {
    id: string,
    screeningToolId: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
    score: number,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      order: number,
    },
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    carePlanSuggestions:  Array< {
      id: string,
      patientId: string,
      patient:  {
        id: string,
        firstName: string | null,
        middleName: string | null,
        lastName: string | null,
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
    screeningToolScoreRangeId: string | null,
    screeningToolScoreRange:  {
      description: string,
    } | null,
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
        createdAt: string,
        updatedAt: string,
        completedAt: string | null,
        deletedAt: string | null,
        dueAt: string | null,
        patientId: string,
        priority: Priority | null,
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
        followers:  Array< {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } > | null,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } | null,
        patientGoal:  {
          id: string,
          title: string,
          patientConcern:  {
            concern:  {
              id: string,
              title: string,
            },
          } | null,
        } | null,
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
    zip: string | null,
    createdAt: string,
    consentToText: boolean | null,
    consentToCall: boolean | null,
  } | null,
};

export type getProgressNoteActivityForProgressNoteQueryVariables = {
  progressNoteId: string,
};

export type getProgressNoteActivityForProgressNoteQuery = {
  // progress note activities for progress note
  progressNoteActivityForProgressNote:  {
    taskEvents:  Array< {
      id: string,
      taskId: string,
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
        followers:  Array< {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } > | null,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } | null,
        patientGoal:  {
          id: string,
          title: string,
          patientConcern:  {
            concern:  {
              id: string,
              title: string,
            },
          } | null,
        } | null,
      },
      userId: string,
      user:  {
        id: string,
        locale: string | null,
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
        firstName: string | null,
        middleName: string | null,
        lastName: string | null,
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
          } | null > | null,
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
            } >,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
          riskArea:  {
            id: string,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
            title: string,
            order: number,
          } | null,
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
              order: number,
            },
            screeningToolScoreRanges:  Array< {
              id: string,
              description: string,
              minimumScore: number,
              maximumScore: number,
              screeningToolId: string,
              createdAt: string,
              updatedAt: string,
              deletedAt: string | null,
              concernSuggestions:  Array< {
                id: string,
                title: string,
                createdAt: string,
                updatedAt: string,
                deletedAt: string | null,
              } | null > | null,
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
                } >,
                createdAt: string,
                updatedAt: string,
                deletedAt: string | null,
              } | null > | null,
            } | null > | null,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
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
          } | null > | null,
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
            } >,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
          riskArea:  {
            id: string,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
            title: string,
            order: number,
          } | null,
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
              order: number,
            },
            screeningToolScoreRanges:  Array< {
              id: string,
              description: string,
              minimumScore: number,
              maximumScore: number,
              screeningToolId: string,
              createdAt: string,
              updatedAt: string,
              deletedAt: string | null,
              concernSuggestions:  Array< {
                id: string,
                title: string,
                createdAt: string,
                updatedAt: string,
                deletedAt: string | null,
              } | null > | null,
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
                } >,
                createdAt: string,
                updatedAt: string,
                deletedAt: string | null,
              } | null > | null,
            } | null > | null,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
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
        firstName: string | null,
        middleName: string | null,
        lastName: string | null,
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
        },
        patientId: string,
        patient:  {
          id: string,
          firstName: string | null,
          middleName: string | null,
          lastName: string | null,
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
            firstName: string | null,
            middleName: string | null,
            lastName: string | null,
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
            } > | null,
            createdBy:  {
              id: string,
              firstName: string | null,
              lastName: string | null,
              googleProfileImageUrl: string | null,
              userRole: UserRole,
            } | null,
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
          firstName: string | null,
          middleName: string | null,
          lastName: string | null,
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
          } > | null,
          createdBy:  {
            id: string,
            firstName: string | null,
            lastName: string | null,
            googleProfileImageUrl: string | null,
            userRole: UserRole,
          } | null,
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
  } | null,
};

export type getProgressNoteTemplateQueryVariables = {
  progressNoteTemplateId: string,
};

export type getProgressNoteTemplateQuery = {
  // progress note template
  progressNoteTemplate:  {
    id: string,
    title: string,
    createdAt: string,
    deletedAt: string | null,
  } | null,
};

export type getProgressNoteTemplatesQuery = {
  // progress note templates
  progressNoteTemplates:  Array< {
    id: string,
    title: string,
    createdAt: string,
    deletedAt: string | null,
  } | null > | null,
};

export type getProgressNotesForCurrentUserQueryVariables = {
  completed: boolean,
};

export type getProgressNotesForCurrentUserQuery = {
  // progress notes for current user
  progressNotesForCurrentUser:  Array< {
    id: string,
    patientId: string,
    user:  {
      id: string,
      locale: string | null,
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
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
    startedAt: string | null,
    location: string | null,
    deletedAt: string | null,
    progressNoteTemplate:  {
      id: string,
      title: string,
      createdAt: string,
      deletedAt: string | null,
    } | null,
  } | null > | null,
};

export type getProgressNotesForPatientQueryVariables = {
  patientId: string,
  completed: boolean,
};

export type getProgressNotesForPatientQuery = {
  // progress notes for patient
  progressNotesForPatient:  Array< {
    id: string,
    patientId: string,
    user:  {
      id: string,
      locale: string | null,
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
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
    startedAt: string | null,
    location: string | null,
    deletedAt: string | null,
    progressNoteTemplate:  {
      id: string,
      title: string,
      createdAt: string,
      deletedAt: string | null,
    } | null,
  } | null > | null,
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
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
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
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      order: number,
    } | null,
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
        order: number,
      },
      screeningToolScoreRanges:  Array< {
        id: string,
        description: string,
        minimumScore: number,
        maximumScore: number,
        screeningToolId: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        concernSuggestions:  Array< {
          id: string,
          title: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null > | null,
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
          } >,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null > | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
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
    riskAreaId: string | null,
    screeningToolId: string | null,
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
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
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
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        title: string,
        order: number,
      } | null,
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
          order: number,
        },
        screeningToolScoreRanges:  Array< {
          id: string,
          description: string,
          minimumScore: number,
          maximumScore: number,
          screeningToolId: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          concernSuggestions:  Array< {
            id: string,
            title: string,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
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
            } >,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
        } | null > | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null,
    } > | null,
    applicableIfQuestionConditions:  Array< {
      id: string,
      questionId: string,
      answerId: string,
    } > | null,
  } | null,
};

export type getQuestionsQueryVariables = {
  filterId: string,
  filterType: QuestionFilterType,
};

export type getQuestionsQuery = {
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
      } | null > | null,
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
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        title: string,
        order: number,
      } | null,
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
          order: number,
        },
        screeningToolScoreRanges:  Array< {
          id: string,
          description: string,
          minimumScore: number,
          maximumScore: number,
          screeningToolId: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          concernSuggestions:  Array< {
            id: string,
            title: string,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
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
            } >,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
        } | null > | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null,
    } > | null,
    applicableIfQuestionConditions:  Array< {
      id: string,
      questionId: string,
      answerId: string,
    } > | null,
  } >,
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

export type getScreeningToolQueryVariables = {
  screeningToolId: string,
};

export type getScreeningToolQuery = {
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
      order: number,
    },
    screeningToolScoreRanges:  Array< {
      id: string,
      description: string,
      minimumScore: number,
      maximumScore: number,
      screeningToolId: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
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
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export type getScreeningToolsForRiskAreaQueryVariables = {
  riskAreaId: string,
};

export type getScreeningToolsForRiskAreaQuery = {
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
      order: number,
    },
    screeningToolScoreRanges:  Array< {
      id: string,
      description: string,
      minimumScore: number,
      maximumScore: number,
      screeningToolId: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
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
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
};

export type getScreeningToolsQuery = {
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
      order: number,
    },
    screeningToolScoreRanges:  Array< {
      id: string,
      description: string,
      minimumScore: number,
      maximumScore: number,
      screeningToolId: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
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
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
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
      createdAt: string,
      updatedAt: string,
    },
    taskId: string,
    createdAt: string,
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
          createdAt: string,
          updatedAt: string,
        },
        taskId: string,
        createdAt: string,
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
    createdAt: string,
    updatedAt: string,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: Priority | null,
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
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } > | null,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    patientGoal:  {
      id: string,
      title: string,
      patientConcern:  {
        concern:  {
          id: string,
          title: string,
        },
      } | null,
    } | null,
  } | null,
};

export type getUsersQueryVariables = {
  pageNumber?: number | null,
  pageSize?: number | null,
  orderBy?: UserOrderOptions | null,
  hasLoggedIn?: boolean | null,
};

export type getUsersQuery = {
  // All Users (admin only)
  users:  {
    edges:  Array< {
      node:  {
        id: string,
        locale: string | null,
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
  } | null,
};

export type goalSuggestionCreateMutationVariables = {
  answerId?: string | null,
  screeningToolScoreRangeId?: string | null,
  goalSuggestionTemplateId: string,
};

export type goalSuggestionCreateMutation = {
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
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
};

export type goalSuggestionDeleteMutationVariables = {
  answerId?: string | null,
  screeningToolScoreRangeId?: string | null,
  goalSuggestionTemplateId: string,
};

export type goalSuggestionDeleteMutation = {
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
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
};

export type goalSuggestionTemplateCreateMutationVariables = {
  title: string,
};

export type goalSuggestionTemplateCreateMutation = {
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
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export type goalSuggestionTemplateDeleteMutationVariables = {
  goalSuggestionTemplateId: string,
};

export type goalSuggestionTemplateDeleteMutation = {
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
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export type goalSuggestionTemplateEditMutationVariables = {
  goalSuggestionTemplateId: string,
  title: string,
};

export type goalSuggestionTemplateEditMutation = {
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
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
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
      createdAt: string,
      updatedAt: string,
    },
  } | null,
};

export type patientAnswersCreateMutationVariables = {
  patientId: string,
  patientAnswers: Array< PatientAnswerInput | null >,
  questionIds: Array< string | null >,
  screeningToolId?: string | null,
  progressNoteId?: string | null,
};

export type patientAnswersCreateMutation = {
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
      } | null > | null,
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
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        title: string,
        order: number,
      } | null,
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
          order: number,
        },
        screeningToolScoreRanges:  Array< {
          id: string,
          description: string,
          minimumScore: number,
          maximumScore: number,
          screeningToolId: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          concernSuggestions:  Array< {
            id: string,
            title: string,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
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
            } >,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
        } | null > | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
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

export type patientAnswersUpdateApplicableMutationVariables = {
  patientId: string,
  riskAreaId: string,
};

export type patientAnswersUpdateApplicableMutation = {
  // Updates applicable for Patient Answers in risk area
  patientAnswersUpdateApplicable:  Array< {
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
      } | null > | null,
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
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        title: string,
        order: number,
      } | null,
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
          order: number,
        },
        screeningToolScoreRanges:  Array< {
          id: string,
          description: string,
          minimumScore: number,
          maximumScore: number,
          screeningToolId: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          concernSuggestions:  Array< {
            id: string,
            title: string,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
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
            } >,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
        } | null > | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
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

export type patientConcernBulkEditMutationVariables = {
  patientConcerns: Array< PatientConcernBulkEditFields | null >,
  patientId: string,
};

export type patientConcernBulkEditMutation = {
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
    },
    patientId: string,
    patient:  {
      id: string,
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
        firstName: string | null,
        middleName: string | null,
        lastName: string | null,
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
        } > | null,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } | null,
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

export type patientConcernCreateMutationVariables = {
  patientId: string,
  concernId: string,
  startedAt?: string | null,
};

export type patientConcernCreateMutation = {
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
    },
    patientId: string,
    patient:  {
      id: string,
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
        firstName: string | null,
        middleName: string | null,
        lastName: string | null,
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
        } > | null,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } | null,
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

export type patientEditMutationVariables = {
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
    zip: string | null,
    createdAt: string,
    consentToText: boolean | null,
    consentToCall: boolean | null,
  } | null,
};

export type patientGoalCreateMutationVariables = {
  title?: string | null,
  patientId: string,
  patientConcernId?: string | null,
  goalSuggestionTemplateId?: string | null,
  taskTemplateIds?: Array< string | null > | null,
  concernId?: string | null,
  concernTitle?: string | null,
  startedAt?: string | null,
};

export type patientGoalCreateMutation = {
  // patient goal create
  patientGoalCreate:  {
    id: string,
    title: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
      } > | null,
      createdBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        googleProfileImageUrl: string | null,
        userRole: UserRole,
      } | null,
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export type patientGoalDeleteMutationVariables = {
  patientGoalId: string,
};

export type patientGoalDeleteMutation = {
  // patient goal delete
  patientGoalDelete:  {
    id: string,
    title: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
      } > | null,
      createdBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        googleProfileImageUrl: string | null,
        userRole: UserRole,
      } | null,
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
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
    zip: string | null,
    createdAt: string,
    consentToText: boolean | null,
    consentToCall: boolean | null,
  } | null,
};

export type progressNoteCompleteMutationVariables = {
  progressNoteId: string,
};

export type progressNoteCompleteMutation = {
  // completes a progress note
  progressNoteComplete:  {
    id: string,
    patientId: string,
    user:  {
      id: string,
      locale: string | null,
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
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
    startedAt: string | null,
    location: string | null,
    deletedAt: string | null,
    progressNoteTemplate:  {
      id: string,
      title: string,
      createdAt: string,
      deletedAt: string | null,
    } | null,
  } | null,
};

export type progressNoteCreateMutationVariables = {
  patientId: string,
};

export type progressNoteCreateMutation = {
  // creates a progress note
  progressNoteCreate:  {
    id: string,
    patientId: string,
    user:  {
      id: string,
      locale: string | null,
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
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
    startedAt: string | null,
    location: string | null,
    deletedAt: string | null,
    progressNoteTemplate:  {
      id: string,
      title: string,
      createdAt: string,
      deletedAt: string | null,
    } | null,
  } | null,
};

export type progressNoteEditMutationVariables = {
  progressNoteId: string,
  progressNoteTemplateId: string,
  startedAt?: string | null,
  location?: string | null,
  summary?: string | null,
};

export type progressNoteEditMutation = {
  // edits a progress note
  progressNoteEdit:  {
    id: string,
    patientId: string,
    user:  {
      id: string,
      locale: string | null,
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
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
    startedAt: string | null,
    location: string | null,
    deletedAt: string | null,
    progressNoteTemplate:  {
      id: string,
      title: string,
      createdAt: string,
      deletedAt: string | null,
    } | null,
  } | null,
};

export type progressNoteTemplateCreateMutationVariables = {
  title: string,
};

export type progressNoteTemplateCreateMutation = {
  // create a progress note template
  progressNoteTemplateCreate:  {
    id: string,
    title: string,
    createdAt: string,
    deletedAt: string | null,
  } | null,
};

export type progressNoteTemplateDeleteMutationVariables = {
  progressNoteTemplateId: string,
};

export type progressNoteTemplateDeleteMutation = {
  // deletes a progress note template
  progressNoteTemplateDelete:  {
    id: string,
    title: string,
    createdAt: string,
    deletedAt: string | null,
  } | null,
};

export type progressNoteTemplateEditMutationVariables = {
  title: string,
  progressNoteTemplateId: string,
};

export type progressNoteTemplateEditMutation = {
  // edits a progress note template
  progressNoteTemplateEdit:  {
    id: string,
    title: string,
    createdAt: string,
    deletedAt: string | null,
  } | null,
};

export type questionConditionCreateMutationVariables = {
  answerId: string,
  questionId: string,
};

export type questionConditionCreateMutation = {
  // Create a QuestionCondition
  questionConditionCreate:  {
    id: string,
    questionId: string,
    answerId: string,
  } | null,
};

export type questionConditionDeleteMutationVariables = {
  questionConditionId: string,
};

export type questionConditionDeleteMutation = {
  // Deletes a QuestionCondition
  questionConditionDelete:  {
    id: string,
    questionId: string,
    answerId: string,
  } | null,
};

export type questionConditionEditMutationVariables = {
  questionConditionId: string,
  answerId: string,
  questionId: string,
};

export type questionConditionEditMutation = {
  // Edit a QuestionCondition
  questionConditionEdit:  {
    id: string,
    questionId: string,
    answerId: string,
  } | null,
};

export type questionCreateMutationVariables = {
  title: string,
  answerType: AnswerTypeOptions,
  validatedSource?: string | null,
  riskAreaId?: string | null,
  screeningToolId?: string | null,
  progressNoteTemplateId?: string | null,
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
    riskAreaId: string | null,
    screeningToolId: string | null,
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
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
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
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        title: string,
        order: number,
      } | null,
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
          order: number,
        },
        screeningToolScoreRanges:  Array< {
          id: string,
          description: string,
          minimumScore: number,
          maximumScore: number,
          screeningToolId: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          concernSuggestions:  Array< {
            id: string,
            title: string,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
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
            } >,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
        } | null > | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null,
    } > | null,
    applicableIfQuestionConditions:  Array< {
      id: string,
      questionId: string,
      answerId: string,
    } > | null,
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
    riskAreaId: string | null,
    screeningToolId: string | null,
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
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
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
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        title: string,
        order: number,
      } | null,
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
          order: number,
        },
        screeningToolScoreRanges:  Array< {
          id: string,
          description: string,
          minimumScore: number,
          maximumScore: number,
          screeningToolId: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          concernSuggestions:  Array< {
            id: string,
            title: string,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
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
            } >,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
        } | null > | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null,
    } > | null,
    applicableIfQuestionConditions:  Array< {
      id: string,
      questionId: string,
      answerId: string,
    } > | null,
  } | null,
};

export type questionEditMutationVariables = {
  questionId: string,
  title?: string | null,
  answerType?: AnswerTypeOptions | null,
  validatedSource?: string | null,
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
    riskAreaId: string | null,
    screeningToolId: string | null,
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
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
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
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        title: string,
        order: number,
      } | null,
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
          order: number,
        },
        screeningToolScoreRanges:  Array< {
          id: string,
          description: string,
          minimumScore: number,
          maximumScore: number,
          screeningToolId: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          concernSuggestions:  Array< {
            id: string,
            title: string,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
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
            } >,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
        } | null > | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null,
    } > | null,
    applicableIfQuestionConditions:  Array< {
      id: string,
      questionId: string,
      answerId: string,
    } > | null,
  } | null,
};

export type quickCallCreateMutationVariables = {
  patientId: string,
  reason: string,
  summary: string,
  direction: QuickCallDirection,
  callRecipient: string,
  wasSuccessful: boolean,
  startTime: string,
};

export type quickCallCreateMutation = {
  // creates a quick call
  quickCallCreate:  {
    id: string,
    userId: string,
    user:  {
      id: string,
      locale: string | null,
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

export type screeningToolCreateMutationVariables = {
  title: string,
  riskAreaId: string,
};

export type screeningToolCreateMutation = {
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
      order: number,
    },
    screeningToolScoreRanges:  Array< {
      id: string,
      description: string,
      minimumScore: number,
      maximumScore: number,
      screeningToolId: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
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
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export type screeningToolDeleteMutationVariables = {
  screeningToolId: string,
};

export type screeningToolDeleteMutation = {
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
      order: number,
    },
    screeningToolScoreRanges:  Array< {
      id: string,
      description: string,
      minimumScore: number,
      maximumScore: number,
      screeningToolId: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
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
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export type screeningToolEditMutationVariables = {
  screeningToolId: string,
  title?: string | null,
  riskAreaId?: string | null,
};

export type screeningToolEditMutation = {
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
      order: number,
    },
    screeningToolScoreRanges:  Array< {
      id: string,
      description: string,
      minimumScore: number,
      maximumScore: number,
      screeningToolId: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
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
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
};

export type screeningToolScoreRangeCreateMutationVariables = {
  description: string,
  screeningToolId: string,
  minimumScore: number,
  maximumScore: number,
};

export type screeningToolScoreRangeCreateMutation = {
  // screening tool score range create
  screeningToolScoreRangeCreate:  {
    id: string,
    description: string,
    minimumScore: number,
    maximumScore: number,
    screeningToolId: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
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
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
  } | null,
};

export type screeningToolScoreRangeDeleteMutationVariables = {
  screeningToolScoreRangeId: string,
};

export type screeningToolScoreRangeDeleteMutation = {
  // screening tool score range delete
  screeningToolScoreRangeDelete:  {
    id: string,
    description: string,
    minimumScore: number,
    maximumScore: number,
    screeningToolId: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
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
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
  } | null,
};

export type screeningToolScoreRangeEditMutationVariables = {
  screeningToolScoreRangeId: string,
  description?: string | null,
  screeningToolId?: string | null,
  minimumScore?: number | null,
  maximumScore?: number | null,
};

export type screeningToolScoreRangeEditMutation = {
  // screening tool score range edit
  screeningToolScoreRangeEdit:  {
    id: string,
    description: string,
    minimumScore: number,
    maximumScore: number,
    screeningToolId: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
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
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
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
      createdAt: string,
      updatedAt: string,
    },
    taskId: string,
    createdAt: string,
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
      createdAt: string,
      updatedAt: string,
    },
    taskId: string,
    createdAt: string,
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
    createdAt: string,
    updatedAt: string,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: Priority | null,
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
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } > | null,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    patientGoal:  {
      id: string,
      title: string,
      patientConcern:  {
        concern:  {
          id: string,
          title: string,
        },
      } | null,
    } | null,
  } | null,
};

export type taskCreateMutationVariables = {
  title: string,
  description: string,
  dueAt: string,
  patientId: string,
  priority?: Priority | null,
  assignedToId?: string | null,
  patientGoalId?: string | null,
};

export type taskCreateMutation = {
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
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } > | null,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    patientGoal:  {
      id: string,
      title: string,
      patientConcern:  {
        concern:  {
          id: string,
          title: string,
        },
      } | null,
    } | null,
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
    createdAt: string,
    updatedAt: string,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: Priority | null,
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
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } > | null,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    patientGoal:  {
      id: string,
      title: string,
      patientConcern:  {
        concern:  {
          id: string,
          title: string,
        },
      } | null,
    } | null,
  } | null,
};

export type taskEditMutationVariables = {
  taskId: string,
  assignedToId?: string | null,
  title?: string | null,
  description?: string | null,
  priority?: Priority | null,
  dueAt?: string | null,
  patientGoalId?: string | null,
};

export type taskEditMutation = {
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
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } > | null,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    patientGoal:  {
      id: string,
      title: string,
      patientConcern:  {
        concern:  {
          id: string,
          title: string,
        },
      } | null,
    } | null,
  } | null,
};

export type taskTemplateCreateMutationVariables = {
  title: string,
  goalSuggestionTemplateId: string,
  completedWithinNumber?: number | null,
  completedWithinInterval?: string | null,
  repeating?: boolean | null,
  priority?: Priority | null,
  careTeamAssigneeRole?: string | null,
};

export type taskTemplateCreateMutation = {
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
  } | null,
};

export type taskTemplateDeleteMutationVariables = {
  taskTemplateId: string,
};

export type taskTemplateDeleteMutation = {
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
  } | null,
};

export type taskTemplateEditMutationVariables = {
  title: string,
  taskTemplateId: string,
  goalSuggestionTemplateId?: string | null,
  completedWithinNumber?: number | null,
  completedWithinInterval?: string | null,
  repeating?: boolean | null,
  priority?: Priority | null,
  careTeamAssigneeRole?: string | null,
};

export type taskTemplateEditMutation = {
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
    createdAt: string,
    updatedAt: string,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: Priority | null,
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
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } > | null,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    patientGoal:  {
      id: string,
      title: string,
      patientConcern:  {
        concern:  {
          id: string,
          title: string,
        },
      } | null,
    } | null,
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
    createdAt: string,
    updatedAt: string,
    completedAt: string | null,
    deletedAt: string | null,
    dueAt: string | null,
    patientId: string,
    priority: Priority | null,
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
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } > | null,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    patientGoal:  {
      id: string,
      title: string,
      patientConcern:  {
        concern:  {
          id: string,
          title: string,
        },
      } | null,
    } | null,
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
        createdAt: string,
        updatedAt: string,
        completedAt: string | null,
        deletedAt: string | null,
        dueAt: string | null,
        patientId: string,
        priority: Priority | null,
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
        followers:  Array< {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } > | null,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } | null,
        patientGoal:  {
          id: string,
          title: string,
          patientConcern:  {
            concern:  {
              id: string,
              title: string,
            },
          } | null,
        } | null,
      } | null,
    } | null > | null,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
  } | null,
};

export type userCreateMutationVariables = {
  email: string,
  homeClinicId: string,
};

export type userCreateMutation = {
  // Create a new user
  userCreate:  {
    id: string,
    locale: string | null,
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

export type userDeleteMutationVariables = {
  email: string,
};

export type userDeleteMutation = {
  // Delete user
  userDelete:  {
    id: string,
    locale: string | null,
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

export type userEditRoleMutationVariables = {
  email: string,
  userRole: string,
};

export type userEditRoleMutation = {
  // Edit user
  userEditRole:  {
    id: string,
    locale: string | null,
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
  concernSuggestions:  Array< {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
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
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
  riskArea:  {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    order: number,
  } | null,
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
      order: number,
    },
    screeningToolScoreRanges:  Array< {
      id: string,
      description: string,
      minimumScore: number,
      maximumScore: number,
      screeningToolId: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      concernSuggestions:  Array< {
        id: string,
        title: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
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
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null,
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

export type FullCarePlanSuggestionFragment = {
  id: string,
  patientId: string,
  patient:  {
    id: string,
    firstName: string | null,
    middleName: string | null,
    lastName: string | null,
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

export type FullCarePlanUpdateEventFragment = {
  id: string,
  patientId: string,
  patient:  {
    id: string,
    firstName: string | null,
    middleName: string | null,
    lastName: string | null,
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
    },
    patientId: string,
    patient:  {
      id: string,
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
        firstName: string | null,
        middleName: string | null,
        lastName: string | null,
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
        } > | null,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } | null,
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
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
      } > | null,
      createdBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        googleProfileImageUrl: string | null,
        userRole: UserRole,
      } | null,
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

export type FullClinicFragment = {
  id: string,
  name: string,
};

export type FullConcernFragment = {
  id: string,
  title: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
};

export type FullEventNotificationFragment = {
  id: string,
  title: string | null,
  userId: string,
  user:  {
    id: string,
    locale: string | null,
    firstName: string | null,
    lastName: string | null,
    userRole: UserRole,
    email: string | null,
    homeClinicId: string,
    googleProfileImageUrl: string | null,
    createdAt: string,
    updatedAt: string,
  },
  taskEventId: string | null,
  taskEvent:  {
    id: string,
    taskId: string,
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
      followers:  Array< {
        id: string,
        firstName: string | null,
        lastName: string | null,
        googleProfileImageUrl: string | null,
        userRole: UserRole,
      } > | null,
      createdBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        googleProfileImageUrl: string | null,
        userRole: UserRole,
      } | null,
      patientGoal:  {
        id: string,
        title: string,
        patientConcern:  {
          concern:  {
            id: string,
            title: string,
          },
        } | null,
      } | null,
    },
    userId: string,
    user:  {
      id: string,
      locale: string | null,
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
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } > | null,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    patientGoal:  {
      id: string,
      title: string,
      patientConcern:  {
        concern:  {
          id: string,
          title: string,
        },
      } | null,
    } | null,
  } | null,
  seenAt: string | null,
  emailSentAt: string | null,
  deliveredAt: string | null,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
};

export type FullGoalSuggestionTemplateFragment = {
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
  } >,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
};

export type FullPatientAnswerEventFragment = {
  id: string,
  patientId: string,
  patient:  {
    id: string,
    firstName: string | null,
    middleName: string | null,
    lastName: string | null,
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
      } | null > | null,
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
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        title: string,
        order: number,
      } | null,
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
          order: number,
        },
        screeningToolScoreRanges:  Array< {
          id: string,
          description: string,
          minimumScore: number,
          maximumScore: number,
          screeningToolId: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          concernSuggestions:  Array< {
            id: string,
            title: string,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
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
            } >,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
        } | null > | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
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
      } | null > | null,
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
        } >,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
      } | null > | null,
      riskArea:  {
        id: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        title: string,
        order: number,
      } | null,
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
          order: number,
        },
        screeningToolScoreRanges:  Array< {
          id: string,
          description: string,
          minimumScore: number,
          maximumScore: number,
          screeningToolId: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          concernSuggestions:  Array< {
            id: string,
            title: string,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
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
            } >,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
          } | null > | null,
        } | null > | null,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
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

export type FullPatientAnswerFragment = {
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
    } | null > | null,
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
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      order: number,
    } | null,
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
        order: number,
      },
      screeningToolScoreRanges:  Array< {
        id: string,
        description: string,
        minimumScore: number,
        maximumScore: number,
        screeningToolId: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        concernSuggestions:  Array< {
          id: string,
          title: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null > | null,
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
          } >,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null > | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
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

export type FullPatientConcernFragment = {
  id: string,
  order: number,
  concernId: string,
  concern:  {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  },
  patientId: string,
  patient:  {
    id: string,
    firstName: string | null,
    middleName: string | null,
    lastName: string | null,
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
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
      } > | null,
      createdBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        googleProfileImageUrl: string | null,
        userRole: UserRole,
      } | null,
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

export type FullPatientGoalFragment = {
  id: string,
  title: string,
  patientId: string,
  patient:  {
    id: string,
    firstName: string | null,
    middleName: string | null,
    lastName: string | null,
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
    } > | null,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
  } >,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
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

export type FullPatientScreeningToolSubmissionFragment = {
  id: string,
  screeningToolId: string,
  patientId: string,
  patient:  {
    id: string,
    firstName: string | null,
    middleName: string | null,
    lastName: string | null,
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
  score: number,
  riskArea:  {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    order: number,
  },
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
  carePlanSuggestions:  Array< {
    id: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
  screeningToolScoreRangeId: string | null,
  screeningToolScoreRange:  {
    description: string,
  } | null,
};

export type FullProgressNoteActivityFragment = {
  taskEvents:  Array< {
    id: string,
    taskId: string,
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
      followers:  Array< {
        id: string,
        firstName: string | null,
        lastName: string | null,
        googleProfileImageUrl: string | null,
        userRole: UserRole,
      } > | null,
      createdBy:  {
        id: string,
        firstName: string | null,
        lastName: string | null,
        googleProfileImageUrl: string | null,
        userRole: UserRole,
      } | null,
      patientGoal:  {
        id: string,
        title: string,
        patientConcern:  {
          concern:  {
            id: string,
            title: string,
          },
        } | null,
      } | null,
    },
    userId: string,
    user:  {
      id: string,
      locale: string | null,
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
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
        } | null > | null,
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
          } >,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null > | null,
        riskArea:  {
          id: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          title: string,
          order: number,
        } | null,
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
            order: number,
          },
          screeningToolScoreRanges:  Array< {
            id: string,
            description: string,
            minimumScore: number,
            maximumScore: number,
            screeningToolId: string,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
            concernSuggestions:  Array< {
              id: string,
              title: string,
              createdAt: string,
              updatedAt: string,
              deletedAt: string | null,
            } | null > | null,
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
              } >,
              createdAt: string,
              updatedAt: string,
              deletedAt: string | null,
            } | null > | null,
          } | null > | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
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
        } | null > | null,
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
          } >,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null > | null,
        riskArea:  {
          id: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
          title: string,
          order: number,
        } | null,
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
            order: number,
          },
          screeningToolScoreRanges:  Array< {
            id: string,
            description: string,
            minimumScore: number,
            maximumScore: number,
            screeningToolId: string,
            createdAt: string,
            updatedAt: string,
            deletedAt: string | null,
            concernSuggestions:  Array< {
              id: string,
              title: string,
              createdAt: string,
              updatedAt: string,
              deletedAt: string | null,
            } | null > | null,
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
              } >,
              createdAt: string,
              updatedAt: string,
              deletedAt: string | null,
            } | null > | null,
          } | null > | null,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
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
      firstName: string | null,
      middleName: string | null,
      lastName: string | null,
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
      },
      patientId: string,
      patient:  {
        id: string,
        firstName: string | null,
        middleName: string | null,
        lastName: string | null,
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
          firstName: string | null,
          middleName: string | null,
          lastName: string | null,
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
          } > | null,
          createdBy:  {
            id: string,
            firstName: string | null,
            lastName: string | null,
            googleProfileImageUrl: string | null,
            userRole: UserRole,
          } | null,
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
        firstName: string | null,
        middleName: string | null,
        lastName: string | null,
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
        } > | null,
        createdBy:  {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
          userRole: UserRole,
        } | null,
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
};

export type FullProgressNoteTemplateFragment = {
  id: string,
  title: string,
  createdAt: string,
  deletedAt: string | null,
};

export type FullProgressNoteFragment = {
  id: string,
  patientId: string,
  user:  {
    id: string,
    locale: string | null,
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
    firstName: string | null,
    middleName: string | null,
    lastName: string | null,
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
  startedAt: string | null,
  location: string | null,
  deletedAt: string | null,
  progressNoteTemplate:  {
    id: string,
    title: string,
    createdAt: string,
    deletedAt: string | null,
  } | null,
};

export type FullQuestionConditionFragment = {
  id: string,
  questionId: string,
  answerId: string,
};

export type FullQuestionFragment = {
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
    } | null > | null,
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
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
    riskArea:  {
      id: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
      title: string,
      order: number,
    } | null,
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
        order: number,
      },
      screeningToolScoreRanges:  Array< {
        id: string,
        description: string,
        minimumScore: number,
        maximumScore: number,
        screeningToolId: string,
        createdAt: string,
        updatedAt: string,
        deletedAt: string | null,
        concernSuggestions:  Array< {
          id: string,
          title: string,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null > | null,
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
          } >,
          createdAt: string,
          updatedAt: string,
          deletedAt: string | null,
        } | null > | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null,
  } > | null,
  applicableIfQuestionConditions:  Array< {
    id: string,
    questionId: string,
    answerId: string,
  } > | null,
};

export type FullQuickCallFragment = {
  id: string,
  userId: string,
  user:  {
    id: string,
    locale: string | null,
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

export type FullRiskAreaSummaryFragment = {
  summary: Array< string >,
  started: boolean,
  lastUpdated: string | null,
};

export type FullRiskAreaFragment = {
  id: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
  title: string,
  order: number,
};

export type FullRiskScoreFragment = {
  score: number,
  forceHighRisk: boolean,
};

export type FullScreeningToolScoreRangeFragment = {
  id: string,
  description: string,
  minimumScore: number,
  maximumScore: number,
  screeningToolId: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
  concernSuggestions:  Array< {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
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
    } >,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null > | null,
};

export type FullScreeningToolFragment = {
  id: string,
  title: string,
  riskAreaId: string,
  riskArea:  {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    order: number,
  },
  screeningToolScoreRanges:  Array< {
    id: string,
    description: string,
    minimumScore: number,
    maximumScore: number,
    screeningToolId: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    concernSuggestions:  Array< {
      id: string,
      title: string,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
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
      } >,
      createdAt: string,
      updatedAt: string,
      deletedAt: string | null,
    } | null > | null,
  } | null > | null,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
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
    createdAt: string,
    updatedAt: string,
  },
  taskId: string,
  createdAt: string,
  updatedAt: string | null,
};

export type FullTaskEventFragment = {
  id: string,
  taskId: string,
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
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } > | null,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
      userRole: UserRole,
    } | null,
    patientGoal:  {
      id: string,
      title: string,
      patientConcern:  {
        concern:  {
          id: string,
          title: string,
        },
      } | null,
    } | null,
  },
  userId: string,
  user:  {
    id: string,
    locale: string | null,
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

export type FullTaskTemplateFragment = {
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
};

export type FullTaskFragment = {
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
  followers:  Array< {
    id: string,
    firstName: string | null,
    lastName: string | null,
    googleProfileImageUrl: string | null,
    userRole: UserRole,
  } > | null,
  createdBy:  {
    id: string,
    firstName: string | null,
    lastName: string | null,
    googleProfileImageUrl: string | null,
    userRole: UserRole,
  } | null,
  patientGoal:  {
    id: string,
    title: string,
    patientConcern:  {
      concern:  {
        id: string,
        title: string,
      },
    } | null,
  } | null,
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
  createdAt: string,
  updatedAt: string,
};

export type ShortPatientFragment = {
  id: string,
  firstName: string | null,
  middleName: string | null,
  lastName: string | null,
  language: string | null,
  gender: string | null,
  dateOfBirth: string | null,
  zip: string | null,
  createdAt: string,
  consentToText: boolean | null,
  consentToCall: boolean | null,
};

export type ShortTaskFragment = {
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
  } > | null,
  createdBy:  {
    id: string,
    firstName: string | null,
    lastName: string | null,
    googleProfileImageUrl: string | null,
    userRole: UserRole,
  } | null,
};

export type ShortUserFragment = {
  id: string,
  firstName: string | null,
  lastName: string | null,
  userRole: UserRole,
  googleProfileImageUrl: string | null,
};
