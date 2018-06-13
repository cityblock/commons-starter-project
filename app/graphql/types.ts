/* tslint:disable */
//  This file was automatically generated and should not be edited.

export enum AnswerValueTypeOptions {
  boolean = "boolean",
  number = "number",
  string = "string",
}


export enum RiskAdjustmentTypeOptions {
  forceHighRisk = "forceHighRisk",
  inactive = "inactive",
  increment = "increment",
}


export enum GoogleCalendarEventType {
  cityblock = "cityblock",
  siu = "siu",
}


export enum CarePlanSuggestionType {
  concern = "concern",
  goal = "goal",
}


export enum CarePlanUpdateEventTypes {
  create_patient_concern = "create_patient_concern",
  create_patient_goal = "create_patient_goal",
  delete_patient_concern = "delete_patient_concern",
  delete_patient_goal = "delete_patient_goal",
  edit_patient_concern = "edit_patient_concern",
  edit_patient_goal = "edit_patient_goal",
}


export enum UserRole {
  admin = "admin",
  anonymousUser = "anonymousUser",
  communityHealthPartner = "communityHealthPartner",
  familyMember = "familyMember",
  healthCoach = "healthCoach",
  nurseCareManager = "nurseCareManager",
  outreachSpecialist = "outreachSpecialist",
  physician = "physician",
  primaryCarePhysician = "primaryCarePhysician",
  psychiatrist = "psychiatrist",
}


export enum Permissions {
  black = "black",
  blue = "blue",
  green = "green",
  orange = "orange",
  pink = "pink",
  red = "red",
  yellow = "yellow",
}


export enum ComputedFieldDataTypes {
  boolean = "boolean",
  number = "number",
  string = "string",
}


export enum PatientAnswerEventTypes {
  create_patient_answer = "create_patient_answer",
}


export enum AnswerTypeOptions {
  dropdown = "dropdown",
  freetext = "freetext",
  multiselect = "multiselect",
  radio = "radio",
}


export enum PatientRelationOptions {
  child = "child",
  friend = "friend",
  grandchild = "grandchild",
  grandparent = "grandparent",
  neighbor = "neighbor",
  other = "other",
  parent = "parent",
  partner = "partner",
  roommate = "roommate",
  sibling = "sibling",
  spouse = "spouse",
}


export enum PhoneTypeOptions {
  home = "home",
  mobile = "mobile",
  other = "other",
  work = "work",
}


export enum CoreIdentityOptions {
  dateOfBirth = "dateOfBirth",
  firstName = "firstName",
  lastName = "lastName",
  middleName = "middleName",
}


export enum DocumentTypeOptions {
  cityblockConsent = "cityblockConsent",
  hcp = "hcp",
  hieHealthixConsent = "hieHealthixConsent",
  hipaaConsent = "hipaaConsent",
  molst = "molst",
}


export enum ExternalProviderOptions {
  cardiology = "cardiology",
  dermatology = "dermatology",
  dialysis = "dialysis",
  durableMedicalEquipment = "durableMedicalEquipment",
  endocrinology = "endocrinology",
  ent = "ent",
  formalCaregiver = "formalCaregiver",
  gastroenterology = "gastroenterology",
  hasaCaseManager = "hasaCaseManager",
  healthHomeCareManager = "healthHomeCareManager",
  hematology = "hematology",
  hepatology = "hepatology",
  homeAttendant = "homeAttendant",
  housingCaseManager = "housingCaseManager",
  infectiousDisease = "infectiousDisease",
  insurancePlanCareManager = "insurancePlanCareManager",
  nephrology = "nephrology",
  obgyn = "obgyn",
  oncology = "oncology",
  ophthalmology = "ophthalmology",
  orthopedics = "orthopedics",
  other = "other",
  otherCaseManagement = "otherCaseManagement",
  otherMedicalSpecialist = "otherMedicalSpecialist",
  pharmacy = "pharmacy",
  podiatry = "podiatry",
  psychiatrist = "psychiatrist",
  pulmonology = "pulmonology",
  substanceUseCounselor = "substanceUseCounselor",
  therapistMentalHealth = "therapistMentalHealth",
  therapistPhysical = "therapistPhysical",
  urology = "urology",
  vascular = "vascular",
  visitingNurse = "visitingNurse",
}


export enum Gender {
  female = "female",
  male = "male",
  nonbinary = "nonbinary",
  pass = "pass",
  selfDescribed = "selfDescribed",
}


export enum Transgender {
  no = "no",
  pass = "pass",
  yes = "yes",
}


export enum MaritalStatus {
  currentlyMarried = "currentlyMarried",
  divorced = "divorced",
  neverMarried = "neverMarried",
  separated = "separated",
  widowed = "widowed",
}


export enum ContactMethodOptions {
  email = "email",
  phone = "phone",
  text = "text",
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
  high = "high",
  low = "low",
  medium = "medium",
}


export enum SmsMessageDirection {
  fromUser = "fromUser",
  toUser = "toUser",
}


export enum TaskEventTypes {
  add_comment = "add_comment",
  add_follower = "add_follower",
  cbo_referral_edit_acknowledged_at = "cbo_referral_edit_acknowledged_at",
  cbo_referral_edit_sent_at = "cbo_referral_edit_sent_at",
  complete_task = "complete_task",
  create_task = "create_task",
  delete_comment = "delete_comment",
  delete_task = "delete_task",
  edit_assignee = "edit_assignee",
  edit_comment = "edit_comment",
  edit_description = "edit_description",
  edit_due_date = "edit_due_date",
  edit_priority = "edit_priority",
  edit_title = "edit_title",
  remove_follower = "remove_follower",
  uncomplete_task = "uncomplete_task",
}


export enum CompletedWithinInterval {
  day = "day",
  hour = "hour",
  month = "month",
  week = "week",
  year = "year",
}


export enum CurrentPatientState {
  assigned = "assigned",
  attributed = "attributed",
  consented = "consented",
  disenrolled = "disenrolled",
  enrolled = "enrolled",
  ineligible = "ineligible",
  outreach = "outreach",
}


export enum ComputedFieldOrderOptions {
  labelAsc = "labelAsc",
  labelDesc = "labelDesc",
  slugAsc = "slugAsc",
  slugDesc = "slugDesc",
}


export enum ConcernOrderOptions {
  createdAtAsc = "createdAtAsc",
  createdAtDesc = "createdAtDesc",
  titleAsc = "titleAsc",
  titleDesc = "titleDesc",
  updatedAtAsc = "updatedAtAsc",
  updatedAtDesc = "updatedAtDesc",
}


export enum GoalSuggestionOrderOptions {
  createdAtAsc = "createdAtAsc",
  createdAtDesc = "createdAtDesc",
  titleAsc = "titleAsc",
  titleDesc = "titleDesc",
  updatedAtAsc = "updatedAtAsc",
  updatedAtDesc = "updatedAtDesc",
}


export enum AnswerFilterType {
  progressNote = "progressNote",
  question = "question",
  riskArea = "riskArea",
  screeningTool = "screeningTool",
}


export interface PatientFilterOptions {
  ageMin?: number | null,
  ageMax?: number | null,
  gender?: Gender | null,
  zip?: string | null,
  careWorkerId?: string | null,
  patientState?: CurrentPatientState | null,
};

export enum TaskOrderOptions {
  createdAtAsc = "createdAtAsc",
  createdAtDesc = "createdAtDesc",
  dueAtAsc = "dueAtAsc",
  dueAtDesc = "dueAtDesc",
  titleAsc = "titleAsc",
  titleDesc = "titleDesc",
  updatedAtAsc = "updatedAtAsc",
  updatedAtDesc = "updatedAtDesc",
}


export enum QuestionFilterType {
  progressNoteTemplate = "progressNoteTemplate",
  riskArea = "riskArea",
  screeningTool = "screeningTool",
}


export enum UserOrderOptions {
  createdAtAsc = "createdAtAsc",
  createdAtDesc = "createdAtDesc",
  emailAsc = "emailAsc",
  lastLoginAtAsc = "lastLoginAtAsc",
  lastLoginAtDesc = "lastLoginAtDesc",
  updatedAtAsc = "updatedAtAsc",
  updatedAtDesc = "updatedAtDesc",
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

export interface PhoneCreateInput {
  phoneNumber: string,
  type: PhoneTypeOptions,
  description?: string | null,
};

export interface AddressCreateInput {
  zip?: string | null,
  street1?: string | null,
  street2?: string | null,
  state?: string | null,
  city?: string | null,
  description?: string | null,
};

export interface EmailCreateInput {
  emailAddress: string,
  description?: string | null,
};

export interface AddressInput {
  addressId?: string | null,
  zip?: string | null,
  street1?: string | null,
  street2?: string | null,
  state?: string | null,
  city?: string | null,
  description?: string | null,
};

export interface EmailInput {
  emailAddress: string,
  description?: string | null,
};

export interface PhoneInput {
  phoneId?: string | null,
  phoneNumber: string,
  type?: PhoneTypeOptions | null,
  description?: string | null,
};

export enum PatientSignedUrlAction {
  delete = "delete",
  read = "read",
  write = "write",
}


export enum UserTaskOrderOptions {
  dueAtAsc = "dueAtAsc",
  patientAsc = "patientAsc",
  priorityDesc = "priorityDesc",
}


export interface addressCreateForPatientMutationVariables {
  patientId: string,
  zip: string,
  street1?: string | null,
  street2?: string | null,
  city?: string | null,
  state?: string | null,
  description?: string | null,
  isPrimary?: boolean | null,
};

export interface addressCreateForPatientMutation {
  // Create an address for a Patient
  addressCreateForPatient:  {
    id: string,
    city: string | null,
    state: string | null,
    street1: string | null,
    street2: string | null,
    zip: string | null,
    description: string | null,
  } | null,
};

export interface addressCreateMutationVariables {
  zip: string,
  street1?: string | null,
  street2?: string | null,
  city?: string | null,
  state?: string | null,
  description?: string | null,
};

export interface addressCreateMutation {
  // Create an address
  addressCreate:  {
    id: string,
    city: string | null,
    state: string | null,
    street1: string | null,
    street2: string | null,
    zip: string | null,
    description: string | null,
  } | null,
};

export interface addressDeleteForPatientMutationVariables {
  addressId: string,
  patientId: string,
  isPrimary?: boolean | null,
};

export interface addressDeleteForPatientMutation {
  // Delete an address for a Patient
  addressDeleteForPatient:  {
    id: string,
    city: string | null,
    state: string | null,
    street1: string | null,
    street2: string | null,
    zip: string | null,
    description: string | null,
  } | null,
};

export interface addressEditMutationVariables {
  addressId: string,
  patientId: string,
  zip?: string | null,
  street1?: string | null,
  street2?: string | null,
  city?: string | null,
  state?: string | null,
  description?: string | null,
};

export interface addressEditMutation {
  // Edit an address
  addressEdit:  {
    id: string,
    city: string | null,
    state: string | null,
    street1: string | null,
    street2: string | null,
    zip: string | null,
    description: string | null,
  } | null,
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

export interface calendarCreateEventForCurrentUserMutationVariables {
  startDatetime: string,
  endDatetime: string,
  inviteeEmails: Array< string >,
  location: string,
  title: string,
  reason: string,
};

export interface calendarCreateEventForCurrentUserMutation {
  // creates a calendar event for current user
  calendarCreateEventForCurrentUser:  {
    eventCreateUrl: string,
  },
};

export interface calendarCreateEventForPatientMutationVariables {
  patientId: string,
  startDatetime: string,
  endDatetime: string,
  inviteeEmails: Array< string >,
  location: string,
  title: string,
  reason: string,
  googleCalendarId: string,
};

export interface calendarCreateEventForPatientMutation {
  // creates a calendar event for a patient
  calendarCreateEventForPatient:  {
    eventCreateUrl: string,
  },
};

export interface calendarCreateForPatientMutationVariables {
  patientId: string,
};

export interface calendarCreateForPatientMutation {
  // creates a calendar for a patient
  calendarCreateForPatient:  {
    googleCalendarId: string | null,
    patientId: string,
  },
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
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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

export interface careTeamAssignPatientsMutationVariables {
  patientIds: Array< string >,
  userId: string,
};

export interface careTeamAssignPatientsMutation {
  // Add multiple patients to careTeam
  careTeamAssignPatients:  {
    id: string,
    firstName: string | null,
    lastName: string | null,
    patientCount: number | null,
  } | null,
};

export interface careTeamMakeTeamLeadMutationVariables {
  userId: string,
  patientId: string,
};

export interface careTeamMakeTeamLeadMutation {
  // Make user team lead of careTeam
  careTeamMakeTeamLead:  {
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
  } | null,
};

export interface careTeamReassignUserMutationVariables {
  userId: string,
  patientId: string,
  reassignedToId?: string | null,
};

export interface careTeamReassignUserMutation {
  // Reassign a user on a careTeam
  careTeamReassignUser:  {
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
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
    url: string | null,
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
    url: string | null,
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
    url: string | null,
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
      url: string | null,
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
      url: string | null,
    } | null,
    name: string | null,
    url: string | null,
    diagnosis: string | null,
    sentAt: string | null,
    acknowledgedAt: string | null,
  } | null,
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
  locale?: string | null,
  isAvailable?: boolean | null,
  awayMessage?: string | null,
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
  } | null,
};

export interface emailCreateForPatientMutationVariables {
  patientId: string,
  emailAddress: string,
  description?: string | null,
  isPrimary?: boolean | null,
};

export interface emailCreateForPatientMutation {
  // Create an email for a Patient
  emailCreateForPatient:  {
    id: string,
    emailAddress: string,
    description: string | null,
  } | null,
};

export interface emailCreateMutationVariables {
  emailAddress: string,
  description?: string | null,
};

export interface emailCreateMutation {
  // Create an email
  emailCreate:  {
    id: string,
    emailAddress: string,
    description: string | null,
  } | null,
};

export interface emailDeleteForPatientMutationVariables {
  emailId: string,
  patientId: string,
  isPrimary?: boolean | null,
};

export interface emailDeleteForPatientMutation {
  // Delete an email for a Patient
  emailDeleteForPatient:  {
    id: string,
    emailAddress: string,
    description: string | null,
  } | null,
};

export interface emailEditMutationVariables {
  emailId: string,
  patientId: string,
  emailAddress: string,
  description?: string | null,
};

export interface emailEditMutation {
  // Edit an email
  emailEdit:  {
    id: string,
    emailAddress: string,
    description: string | null,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
    },
    taskEvent:  {
      id: string,
      taskId: string,
      task:  {
        id: string,
        title: string,
        priority: Priority | null,
        patientId: string,
        patientGoalId: string,
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
        permissions: Permissions,
        isAvailable: boolean,
        awayMessage: string,
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
          permissions: Permissions,
          isAvailable: boolean,
          awayMessage: string,
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
        permissions: Permissions,
        isAvailable: boolean,
        awayMessage: string,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
    },
    taskEvent:  {
      id: string,
      taskId: string,
      task:  {
        id: string,
        title: string,
        priority: Priority | null,
        patientId: string,
        patientGoalId: string,
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
        permissions: Permissions,
        isAvailable: boolean,
        awayMessage: string,
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
          permissions: Permissions,
          isAvailable: boolean,
          awayMessage: string,
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
        permissions: Permissions,
        isAvailable: boolean,
        awayMessage: string,
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

export interface getCalendarEventsForCurrentUserQueryVariables {
  timeMin: string,
  pageSize: number,
  pageToken?: string | null,
};

export interface getCalendarEventsForCurrentUserQuery {
  // List of google calendar events for the logged in user
  calendarEventsForCurrentUser:  {
    events:  Array< {
      id: string,
      title: string,
      startDate: string,
      startTime: string | null,
      endDate: string,
      endTime: string | null,
      htmlLink: string,
      description: string | null,
      location: string | null,
      guests: Array< string > | null,
      eventType: GoogleCalendarEventType | null,
      providerName: string | null,
      providerCredentials: string | null,
    } >,
    pageInfo:  {
      nextPageToken: string | null,
      previousPageToken: string | null,
    } | null,
  },
};

export interface getCalendarEventsForPatientQueryVariables {
  patientId: string,
  timeMin: string,
  pageSize: number,
  pageToken?: string | null,
};

export interface getCalendarEventsForPatientQuery {
  // List of google calendar events for a patient
  calendarEventsForPatient:  {
    events:  Array< {
      id: string,
      title: string,
      startDate: string,
      startTime: string | null,
      endDate: string,
      endTime: string | null,
      htmlLink: string,
      description: string | null,
      location: string | null,
      guests: Array< string > | null,
      eventType: GoogleCalendarEventType | null,
      providerName: string | null,
      providerCredentials: string | null,
    } >,
    pageInfo:  {
      nextPageToken: string | null,
      previousPageToken: string | null,
    } | null,
  },
};

export interface getCalendarForCurrentUserQuery {
  // Google calendar id and url for the current user
  calendarForCurrentUser:  {
    googleCalendarId: string,
    googleCalendarUrl: string | null,
  },
};

export interface getCalendarForPatientQueryVariables {
  patientId: string,
};

export interface getCalendarForPatientQuery {
  // Google calendar id and url for a patient calendar
  calendarForPatient:  {
    patientId: string,
    googleCalendarId: string | null,
    googleCalendarUrl: string | null,
  },
};

export interface getCarePlanSuggestionsFromComputedFieldsForPatientQueryVariables {
  patientId: string,
  glassBreakId?: string | null,
};

export interface getCarePlanSuggestionsFromComputedFieldsForPatientQuery {
  // Care Plan Suggestions From Computed Fields
  carePlanSuggestionsFromComputedFieldsForPatient:  Array< {
    id: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
    computedField:  {
      id: string,
      label: string,
      riskArea:  {
        id: string,
        title: string,
      },
    } | null,
    riskArea:  {
      id: string,
      title: string,
    } | null,
    screeningTool:  {
      id: string,
      title: string,
    } | null,
  } >,
};

export interface getCarePlanSuggestionsFromRiskAreaAssessmentsForPatientQueryVariables {
  patientId: string,
  glassBreakId?: string | null,
};

export interface getCarePlanSuggestionsFromRiskAreaAssessmentsForPatientQuery {
  // Care Plan Suggestions From Risk Area Assessments
  carePlanSuggestionsFromRiskAreaAssessmentsForPatient:  Array< {
    id: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
    computedField:  {
      id: string,
      label: string,
      riskArea:  {
        id: string,
        title: string,
      },
    } | null,
    riskArea:  {
      id: string,
      title: string,
    } | null,
    screeningTool:  {
      id: string,
      title: string,
    } | null,
  } >,
};

export interface getCarePlanSuggestionsFromScreeningToolsForPatientQueryVariables {
  patientId: string,
  glassBreakId?: string | null,
};

export interface getCarePlanSuggestionsFromScreeningToolsForPatientQuery {
  // Care Plan Suggestions From Screening Tools
  carePlanSuggestionsFromScreeningToolsForPatient:  Array< {
    id: string,
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
    computedField:  {
      id: string,
      label: string,
      riskArea:  {
        id: string,
        title: string,
      },
    } | null,
    riskArea:  {
      id: string,
      title: string,
    } | null,
    screeningTool:  {
      id: string,
      title: string,
    } | null,
  } >,
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
    url: string | null,
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
    url: string | null,
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
    url: string | null,
    createdAt: string,
  } >,
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

export interface getCurrentUserHoursQuery {
  // get user hours for current user
  currentUserHours:  Array< {
    id: string,
    userId: string,
    weekday: number,
    startTime: number,
    endTime: number,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } >,
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
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
          permissions: Permissions,
          isAvailable: boolean,
          awayMessage: string,
        },
        taskEvent:  {
          id: string,
          taskId: string,
          task:  {
            id: string,
            title: string,
            priority: Priority | null,
            patientId: string,
            patientGoalId: string,
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
            permissions: Permissions,
            isAvailable: boolean,
            awayMessage: string,
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
              permissions: Permissions,
              isAvailable: boolean,
              awayMessage: string,
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
            permissions: Permissions,
            isAvailable: boolean,
            awayMessage: string,
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

export interface getPatientAddressesQueryVariables {
  patientId: string,
};

export interface getPatientAddressesQuery {
  // get all addresses for a patient
  patientAddresses:  Array< {
    id: string,
    city: string | null,
    state: string | null,
    street1: string | null,
    street2: string | null,
    zip: string | null,
    description: string | null,
  } > | null,
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
      answerType: AnswerTypeOptions,
    } | null,
    patientScreeningToolSubmissionId: string | null,
  } >,
};

export interface getPatientCarePlanQueryVariables {
  patientId: string,
  glassBreakId?: string | null,
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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
          dateOfBirth: string | null,
          createdAt: string,
          coreIdentityVerifiedAt: string | null,
          patientInfo:  {
            id: string,
            gender: Gender | null,
            language: string | null,
            preferredName: string | null,
            hasUploadedPhoto: boolean | null,
          },
          patientState:  {
            id: string,
            currentState: CurrentPatientState,
          },
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
          assignedToId: string | null,
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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
        assignedToId: string | null,
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
    permissions: Permissions,
    isCareTeamLead: boolean,
  } >,
};

export interface getPatientComputedPatientStatusQueryVariables {
  patientId: string,
};

export interface getPatientComputedPatientStatusQuery {
  // computed patient status for a patient
  patientComputedPatientStatus:  {
    id: string,
    patientId: string,
    updatedById: string,
    isCoreIdentityVerified: boolean,
    isDemographicInfoUpdated: boolean,
    isEmergencyContactAdded: boolean,
    isAdvancedDirectivesAdded: boolean,
    isConsentSigned: boolean,
    isPhotoAddedOrDeclined: boolean,
    isIneligible: boolean,
    isDisenrolled: boolean,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  },
};

export interface getPatientContactHealthcareProxiesQueryVariables {
  patientId: string,
};

export interface getPatientContactHealthcareProxiesQuery {
  // Patient contact healthcare proxies
  patientContactHealthcareProxies:  Array< {
    id: string,
    patientId: string,
    relationToPatient: PatientRelationOptions,
    relationFreeText: string | null,
    firstName: string,
    lastName: string,
    isEmergencyContact: boolean,
    isHealthcareProxy: boolean,
    description: string | null,
    address:  {
      id: string,
      city: string | null,
      state: string | null,
      street1: string | null,
      street2: string | null,
      zip: string | null,
      description: string | null,
    } | null,
    email:  {
      id: string,
      emailAddress: string,
    } | null,
    phone:  {
      id: string,
      phoneNumber: string,
      type: PhoneTypeOptions,
    },
    createdAt: string | null,
    updatedAt: string | null,
    deletedAt: string | null,
  } > | null,
};

export interface getPatientContactsQueryVariables {
  patientId: string,
};

export interface getPatientContactsQuery {
  // Patient contacts for patient
  patientContacts:  Array< {
    id: string,
    patientId: string,
    relationToPatient: PatientRelationOptions,
    relationFreeText: string | null,
    firstName: string,
    lastName: string,
    isEmergencyContact: boolean,
    isHealthcareProxy: boolean,
    description: string | null,
    address:  {
      id: string,
      city: string | null,
      state: string | null,
      street1: string | null,
      street2: string | null,
      zip: string | null,
      description: string | null,
    } | null,
    email:  {
      id: string,
      emailAddress: string,
    } | null,
    phone:  {
      id: string,
      phoneNumber: string,
      type: PhoneTypeOptions,
    },
    createdAt: string | null,
    updatedAt: string | null,
    deletedAt: string | null,
  } > | null,
};

export interface getPatientDocumentsQueryVariables {
  patientId: string,
};

export interface getPatientDocumentsQuery {
  // Patient documents for patient
  patientDocuments:  Array< {
    id: string,
    patientId: string,
    uploadedBy:  {
      firstName: string | null,
      lastName: string | null,
    },
    filename: string,
    description: string | null,
    documentType: DocumentTypeOptions | null,
    createdAt: string,
  } > | null,
};

export interface getPatientEmailsQueryVariables {
  patientId: string,
};

export interface getPatientEmailsQuery {
  // get all emails for a patient
  patientEmails:  Array< {
    id: string,
    emailAddress: string,
    description: string | null,
  } > | null,
};

export interface getPatientEncountersQueryVariables {
  patientId: string,
  glassBreakId?: string | null,
};

export interface getPatientEncountersQuery {
  // gets patient encounters (external to Commons)
  patientEncounters:  Array< {
    id: string,
    location: string | null,
    source: string | null,
    date: string,
    title: string | null,
    notes: string | null,
    progressNoteId: string | null,
  } >,
};

export interface getPatientExternalProvidersQueryVariables {
  patientId: string,
};

export interface getPatientExternalProvidersQuery {
  // Patient external providers for patient
  patientExternalProviders:  Array< {
    id: string,
    patientId: string,
    role: ExternalProviderOptions,
    roleFreeText: string | null,
    firstName: string | null,
    lastName: string | null,
    agencyName: string,
    description: string | null,
    email:  {
      id: string,
      emailAddress: string,
    } | null,
    phone:  {
      id: string,
      phoneNumber: string,
      type: PhoneTypeOptions,
    },
    createdAt: string | null,
    updatedAt: string | null,
    deletedAt: string | null,
  } > | null,
};

export interface getPatientGlassBreakCheckQueryVariables {
  patientId: string,
};

export interface getPatientGlassBreakCheckQuery {
  // check if don't need to break glass for given patient
  patientGlassBreakCheck:  {
    patientId: string,
    isGlassBreakNotNeeded: boolean,
  },
};

export interface getPatientGlassBreaksForUserQuery {
  // patient glass breaks for user during current session
  patientGlassBreaksForUser:  Array< {
    id: string,
    patientId: string,
  } >,
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

export interface getPatientMedicationsQueryVariables {
  patientId: string,
};

export interface getPatientMedicationsQuery {
  // gets patient medications
  patientMedications:  Array< {
    id: string,
    name: string,
    dosage: string,
  } >,
};

export interface getPatientNeedToKnowQueryVariables {
  patientInfoId: string,
};

export interface getPatientNeedToKnowQuery {
  // Patient need to know
  patientNeedToKnow:  {
    text: string | null,
  },
};

export interface getPatientPanelQueryVariables {
  pageNumber: number,
  pageSize: number,
  filters: PatientFilterOptions,
  showAllPatients?: boolean | null,
};

export interface getPatientPanelQuery {
  // Patients filtered by options
  patientPanel:  {
    edges:  Array< {
      node:  {
        id: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string | null,
        cityblockId: number,
        userCareTeam: boolean | null,
        patientInfo:  {
          gender: Gender | null,
          primaryAddress:  {
            id: string,
            city: string | null,
            state: string | null,
            street1: string | null,
            street2: string | null,
            zip: string | null,
            description: string | null,
          } | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
    totalCount: number,
  },
};

export interface getPatientPhonesQueryVariables {
  patientId: string,
};

export interface getPatientPhonesQuery {
  // get all phones for a patient
  patientPhones:  Array< {
    id: string,
    phoneNumber: string,
    type: PhoneTypeOptions,
    description: string | null,
  } > | null,
};

export interface getPatientProblemListQueryVariables {
  patientId: string,
};

export interface getPatientProblemListQuery {
  // gets a patient problem list
  patientProblemList:  Array< {
    id: string,
    name: string,
    code: string,
  } >,
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
  glassBreakId?: string | null,
};

export interface getPatientScratchPadQuery {
  // gets a patient scratch pad for given user and patient
  patientScratchPad:  {
    id: string,
    patientId: string,
    userId: string,
    body: string,
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
      id: string,
      title: string,
      riskAreaId: string,
    },
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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
  glassBreakId?: string | null,
};

export interface getPatientScreeningToolSubmissionsFor360Query {
  // patient screening tool submissions for patient 360 (history tab)
  patientScreeningToolSubmissionsFor360:  Array< {
    id: string,
    score: number | null,
    createdAt: string,
    user:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
    },
    screeningTool:  {
      id: string,
      title: string,
      riskAreaId: string,
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
      id: string,
      title: string,
      riskAreaId: string,
    },
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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
        cityblockId: number,
        userCareTeam: boolean | null,
        patientInfo:  {
          gender: Gender | null,
          primaryAddress:  {
            id: string,
            city: string | null,
            state: string | null,
            street1: string | null,
            street2: string | null,
            zip: string | null,
            description: string | null,
          } | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
    totalCount: number,
  },
};

export interface getPatientSocialSecurityQueryVariables {
  patientId: string,
  glassBreakId?: string | null,
};

export interface getPatientSocialSecurityQuery {
  // gets a patients full social security number and records a log of the view by user
  patientSocialSecurity:  {
    id: string,
    ssn: string | null,
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
          patientInfo:  {
            id: string,
            gender: Gender | null,
            hasUploadedPhoto: boolean | null,
          },
        },
        assignedToId: string | null,
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
            url: string | null,
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
    cityblockId: number,
    dateOfBirth: string | null,
    ssnEnd: string | null,
    nmi: string | null,
    mrn: string | null,
    createdAt: string,
    coreIdentityVerifiedAt: string | null,
    coreIdentityVerifiedById: string | null,
    patientInfo:  {
      id: string,
      preferredName: string | null,
      gender: Gender | null,
      genderFreeText: string | null,
      transgender: Transgender | null,
      maritalStatus: MaritalStatus | null,
      language: string | null,
      isMarginallyHoused: boolean | null,
      primaryAddress:  {
        id: string,
        city: string | null,
        state: string | null,
        street1: string | null,
        street2: string | null,
        zip: string | null,
        description: string | null,
      } | null,
      hasEmail: boolean | null,
      primaryEmail:  {
        id: string,
        emailAddress: string,
        description: string | null,
      } | null,
      primaryPhone:  {
        id: string,
        phoneNumber: string,
        type: PhoneTypeOptions,
        description: string | null,
      } | null,
      preferredContactMethod: ContactMethodOptions | null,
      canReceiveCalls: boolean | null,
      canReceiveTexts: boolean | null,
      hasHealthcareProxy: boolean | null,
      hasMolst: boolean | null,
      hasDeclinedPhotoUpload: boolean | null,
      hasUploadedPhoto: boolean | null,
      googleCalendarId: string | null,
    },
    patientDataFlags:  Array< {
      id: string,
      patientId: string,
      userId: string,
      fieldName: CoreIdentityOptions,
      suggestedValue: string | null,
      notes: string | null,
      updatedAt: string | null,
    } > | null,
    patientState:  {
      id: string,
      currentState: CurrentPatientState,
    },
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
        cityblockId: number,
        patientInfo:  {
          gender: Gender | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
        computedPatientStatus:  {
          isCoreIdentityVerified: boolean,
          isDemographicInfoUpdated: boolean,
          isEmergencyContactAdded: boolean,
          isAdvancedDirectivesAdded: boolean,
          isConsentSigned: boolean,
          isPhotoAddedOrDeclined: boolean,
        },
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
        cityblockId: number,
        patientInfo:  {
          gender: Gender | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
        computedPatientStatus:  {
          isCoreIdentityVerified: boolean,
          isDemographicInfoUpdated: boolean,
          isEmergencyContactAdded: boolean,
          isAdvancedDirectivesAdded: boolean,
          isConsentSigned: boolean,
          isPhotoAddedOrDeclined: boolean,
        },
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
    totalCount: number,
  },
};

export interface getPatientsWithAssignedStateQueryVariables {
  pageNumber: number,
  pageSize: number,
};

export interface getPatientsWithAssignedStateQuery {
  // Patient dashboard - assigned state
  patientsWithAssignedState:  {
    edges:  Array< {
      node:  {
        id: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string | null,
        cityblockId: number,
        patientInfo:  {
          gender: Gender | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
        computedPatientStatus:  {
          isCoreIdentityVerified: boolean,
          isDemographicInfoUpdated: boolean,
          isEmergencyContactAdded: boolean,
          isAdvancedDirectivesAdded: boolean,
          isConsentSigned: boolean,
          isPhotoAddedOrDeclined: boolean,
        },
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
    totalCount: number,
  },
};

export interface getPatientsWithIntakeInProgressQueryVariables {
  pageNumber: number,
  pageSize: number,
};

export interface getPatientsWithIntakeInProgressQuery {
  // Patient dashboard - intake in progress
  patientsWithIntakeInProgress:  {
    edges:  Array< {
      node:  {
        id: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string | null,
        cityblockId: number,
        patientInfo:  {
          gender: Gender | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
        computedPatientStatus:  {
          isCoreIdentityVerified: boolean,
          isDemographicInfoUpdated: boolean,
          isEmergencyContactAdded: boolean,
          isAdvancedDirectivesAdded: boolean,
          isConsentSigned: boolean,
          isPhotoAddedOrDeclined: boolean,
        },
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
        cityblockId: number,
        patientInfo:  {
          gender: Gender | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
        computedPatientStatus:  {
          isCoreIdentityVerified: boolean,
          isDemographicInfoUpdated: boolean,
          isEmergencyContactAdded: boolean,
          isAdvancedDirectivesAdded: boolean,
          isConsentSigned: boolean,
          isPhotoAddedOrDeclined: boolean,
        },
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
        cityblockId: number,
        patientInfo:  {
          gender: Gender | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
        computedPatientStatus:  {
          isCoreIdentityVerified: boolean,
          isDemographicInfoUpdated: boolean,
          isEmergencyContactAdded: boolean,
          isAdvancedDirectivesAdded: boolean,
          isConsentSigned: boolean,
          isPhotoAddedOrDeclined: boolean,
        },
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
    totalCount: number,
  },
};

export interface getPatientsWithOpenCBOReferralsQueryVariables {
  pageNumber: number,
  pageSize: number,
};

export interface getPatientsWithOpenCBOReferralsQuery {
  // Patient dashboard - open CBO referrals
  patientsWithOpenCBOReferrals:  {
    edges:  Array< {
      node:  {
        id: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string | null,
        cityblockId: number,
        patientInfo:  {
          gender: Gender | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
        computedPatientStatus:  {
          isCoreIdentityVerified: boolean,
          isDemographicInfoUpdated: boolean,
          isEmergencyContactAdded: boolean,
          isAdvancedDirectivesAdded: boolean,
          isConsentSigned: boolean,
          isPhotoAddedOrDeclined: boolean,
        },
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
        cityblockId: number,
        patientInfo:  {
          gender: Gender | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
        computedPatientStatus:  {
          isCoreIdentityVerified: boolean,
          isDemographicInfoUpdated: boolean,
          isEmergencyContactAdded: boolean,
          isAdvancedDirectivesAdded: boolean,
          isConsentSigned: boolean,
          isPhotoAddedOrDeclined: boolean,
        },
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
        cityblockId: number,
        patientInfo:  {
          gender: Gender | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
        computedPatientStatus:  {
          isCoreIdentityVerified: boolean,
          isDemographicInfoUpdated: boolean,
          isEmergencyContactAdded: boolean,
          isAdvancedDirectivesAdded: boolean,
          isConsentSigned: boolean,
          isPhotoAddedOrDeclined: boolean,
        },
      } | null,
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
    totalCount: number,
  },
};

export interface getPatientsWithRecentConversationsQueryVariables {
  pageNumber: number,
  pageSize: number,
};

export interface getPatientsWithRecentConversationsQuery {
  // Patient dashboard - recent conversations
  patientsWithRecentConversations:  {
    edges:  Array< {
      node:  {
        id: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string | null,
        cityblockId: number,
        patientInfo:  {
          gender: Gender | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
        computedPatientStatus:  {
          isCoreIdentityVerified: boolean,
          isDemographicInfoUpdated: boolean,
          isEmergencyContactAdded: boolean,
          isAdvancedDirectivesAdded: boolean,
          isConsentSigned: boolean,
          isPhotoAddedOrDeclined: boolean,
        },
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
        cityblockId: number,
        patientInfo:  {
          gender: Gender | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
        computedPatientStatus:  {
          isCoreIdentityVerified: boolean,
          isDemographicInfoUpdated: boolean,
          isEmergencyContactAdded: boolean,
          isAdvancedDirectivesAdded: boolean,
          isConsentSigned: boolean,
          isPhotoAddedOrDeclined: boolean,
        },
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
        patientId: string,
        patientGoalId: string,
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
        permissions: Permissions,
        isAvailable: boolean,
        awayMessage: string,
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
          permissions: Permissions,
          isAvailable: boolean,
          awayMessage: string,
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
        permissions: Permissions,
        isAvailable: boolean,
        awayMessage: string,
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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
        permissions: Permissions,
        isAvailable: boolean,
        awayMessage: string,
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
          answerType: AnswerTypeOptions,
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
          answerType: AnswerTypeOptions,
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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
        permissions: Permissions,
        isAvailable: boolean,
        awayMessage: string,
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
          dateOfBirth: string | null,
          createdAt: string,
          coreIdentityVerifiedAt: string | null,
          patientInfo:  {
            id: string,
            gender: Gender | null,
            language: string | null,
            preferredName: string | null,
            hasUploadedPhoto: boolean | null,
          },
          patientState:  {
            id: string,
            currentState: CurrentPatientState,
          },
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
            dateOfBirth: string | null,
            createdAt: string,
            coreIdentityVerifiedAt: string | null,
            patientInfo:  {
              id: string,
              gender: Gender | null,
              language: string | null,
              preferredName: string | null,
              hasUploadedPhoto: boolean | null,
            },
            patientState:  {
              id: string,
              currentState: CurrentPatientState,
            },
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
            assignedToId: string | null,
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
          dateOfBirth: string | null,
          createdAt: string,
          coreIdentityVerifiedAt: string | null,
          patientInfo:  {
            id: string,
            gender: Gender | null,
            language: string | null,
            preferredName: string | null,
            hasUploadedPhoto: boolean | null,
          },
          patientState:  {
            id: string,
            currentState: CurrentPatientState,
          },
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
          assignedToId: string | null,
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
        permissions: Permissions,
        isAvailable: boolean,
        awayMessage: string,
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
        id: string,
        title: string,
        riskAreaId: string,
      },
      patientId: string,
      patient:  {
        id: string,
        firstName: string,
        middleName: string | null,
        lastName: string,
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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
          dateOfBirth: string | null,
          createdAt: string,
          coreIdentityVerifiedAt: string | null,
          patientInfo:  {
            id: string,
            gender: Gender | null,
            language: string | null,
            preferredName: string | null,
            hasUploadedPhoto: boolean | null,
          },
          patientState:  {
            id: string,
            currentState: CurrentPatientState,
          },
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

export interface getProgressNoteGlassBreakCheckQueryVariables {
  progressNoteId: string,
};

export interface getProgressNoteGlassBreakCheckQuery {
  // check if don't need to break glass for given progress note
  progressNoteGlassBreakCheck:  {
    progressNoteId: string,
    isGlassBreakNotNeeded: boolean,
  },
};

export interface getProgressNoteGlassBreaksForUserQuery {
  // progress note glass breaks for a user during current session
  progressNoteGlassBreaksForUser:  Array< {
    id: string,
    progressNoteId: string,
  } >,
};

export interface getProgressNoteIdsForPatientQueryVariables {
  patientId: string,
  completed: boolean,
  glassBreakId?: string | null,
};

export interface getProgressNoteIdsForPatientQuery {
  // progress note ids for patient
  progressNoteIdsForPatient:  Array< {
    id: string,
    createdAt: string,
  } >,
};

export interface getProgressNoteLatestForPatientQueryVariables {
  patientId: string,
};

export interface getProgressNoteLatestForPatientQuery {
  // latest progress note for patient
  progressNoteLatestForPatient:  {
    id: string,
    worryScore: number | null,
  } | null,
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
  glassBreakId?: string | null,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
    },
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
    worryScore: number | null,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
    },
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
    worryScore: number | null,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
    },
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
    worryScore: number | null,
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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
  glassBreakId?: string | null,
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
      riskAreaAssessmentSubmissions:  Array< {
        id: string,
        createdAt: string,
      } >,
      lastUpdated: string | null,
      forceHighRisk: boolean,
      totalScore: number | null,
      riskScore: Priority | null,
      summaryText: Array< string >,
    } >,
  },
};

export interface getRiskAreaGroupShortQueryVariables {
  riskAreaGroupId: string,
};

export interface getRiskAreaGroupShortQuery {
  // RiskAreaGroup
  riskAreaGroup:  {
    id: string,
    title: string,
    shortTitle: string,
  },
};

export interface getRiskAreaGroupsForPatientQueryVariables {
  patientId: string,
  glassBreakId?: string | null,
};

export interface getRiskAreaGroupsForPatientQuery {
  // RiskAreaGroupsForPatient
  riskAreaGroupsForPatient:  Array< {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
    title: string,
    shortTitle: string,
    order: number,
    mediumRiskThreshold: number,
    highRiskThreshold: number,
    automatedSummaryText: Array< string >,
    manualSummaryText: Array< string >,
    screeningToolResultSummaries:  Array< {
      title: string,
      score: number | null,
      description: string,
    } >,
    lastUpdated: string | null,
    forceHighRisk: boolean,
    totalScore: number | null,
    riskScore: Priority | null,
    riskAreas:  Array< {
      id: string,
      assessmentType: AssessmentType,
    } >,
  } >,
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
    riskAreas:  Array< {
      id: string,
      title: string,
      assessmentType: AssessmentType,
    } > | null,
  } >,
};

export interface getRiskAreaShortQueryVariables {
  riskAreaId: string,
};

export interface getRiskAreaShortQuery {
  // RiskArea
  riskArea:  {
    id: string,
    title: string,
  },
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
    riskAreaGroupId: string,
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
    riskAreaGroupId: string,
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
    } > | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  },
};

export interface getScreeningToolsQuery {
  // screening tools
  screeningTools:  Array< {
    id: string,
    title: string,
    riskAreaId: string,
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
    } > | null,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  } | null >,
};

export interface getSmsMessageLatestQueryVariables {
  patientId: string,
};

export interface getSmsMessageLatestQuery {
  // latest SMS message between given user and patient
  smsMessageLatest:  {
    id: string,
    userId: string,
    contactNumber: string,
    patientId: string | null,
    direction: SmsMessageDirection,
    body: string,
    createdAt: string,
  } | null,
};

export interface getSmsMessagesQueryVariables {
  patientId: string,
  pageNumber: number,
  pageSize: number,
};

export interface getSmsMessagesQuery {
  // SMS messages for given user and patient
  smsMessages:  {
    edges:  Array< {
      node:  {
        id: string,
        userId: string,
        contactNumber: string,
        patientId: string | null,
        direction: SmsMessageDirection,
        body: string,
        createdAt: string,
      },
    } >,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
    totalCount: number,
  },
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
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
          permissions: Permissions,
          isAvailable: boolean,
          awayMessage: string,
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
      patientInfo:  {
        id: string,
        gender: Gender | null,
        hasUploadedPhoto: boolean | null,
      },
    },
    assignedToId: string | null,
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
        url: string | null,
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

export interface getTasksForUserForPatientQueryVariables {
  userId: string,
  patientId: string,
};

export interface getTasksForUserForPatientQuery {
  // Tasks assigned to or followed by a user for a patient
  tasksForUserForPatient:  Array< {
    id: string,
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
    patientCount: number | null,
    email: string | null,
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
        permissions: Permissions,
        isAvailable: boolean,
        awayMessage: string,
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

export interface JwtForPdfCreateMutationVariables {
  patientId: string,
};

export interface JwtForPdfCreateMutation {
  // Jwt token to view a PDF
  JwtForPdfCreate:  {
    authToken: string,
  },
};

export interface JwtForVcfCreateMutation {
  // creates a JWT to download VCF
  JwtForVcfCreate:  {
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
    },
  } | null,
};

export interface mattermostUrlForPatientCreateMutationVariables {
  patientId: string,
};

export interface mattermostUrlForPatientCreateMutation {
  // mattermost url for patient channel
  mattermostUrlForPatientCreate:  {
    url: string,
  },
};

export interface mattermostUrlForUserCreateMutationVariables {
  email: string,
};

export interface mattermostUrlForUserCreateMutation {
  // mattermost url to DM user
  mattermostUrlForUserCreate:  {
    url: string,
  },
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
      answerType: AnswerTypeOptions,
    } | null,
    patientScreeningToolSubmissionId: string | null,
  } | null > | null,
};

export interface patientCareTeamAddUserMutationVariables {
  patientId: string,
  userId: string,
};

export interface patientCareTeamAddUserMutation {
  // Add user to careTeam
  careTeamAddUser:  {
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
  } | null,
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
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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
        assignedToId: string | null,
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
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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
        assignedToId: string | null,
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
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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
        assignedToId: string | null,
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

export interface patientContactCreateMutationVariables {
  patientId: string,
  relationToPatient: PatientRelationOptions,
  relationFreeText?: string | null,
  firstName: string,
  lastName: string,
  phone: PhoneCreateInput,
  isEmergencyContact?: boolean | null,
  isHealthcareProxy?: boolean | null,
  description?: string | null,
  address?: AddressCreateInput | null,
  email?: EmailCreateInput | null,
};

export interface patientContactCreateMutation {
  // Create patient contact
  patientContactCreate:  {
    id: string,
    patientId: string,
    relationToPatient: PatientRelationOptions,
    relationFreeText: string | null,
    firstName: string,
    lastName: string,
    isEmergencyContact: boolean,
    isHealthcareProxy: boolean,
    description: string | null,
    address:  {
      id: string,
      city: string | null,
      state: string | null,
      street1: string | null,
      street2: string | null,
      zip: string | null,
      description: string | null,
    } | null,
    email:  {
      id: string,
      emailAddress: string,
    } | null,
    phone:  {
      id: string,
      phoneNumber: string,
      type: PhoneTypeOptions,
    },
    createdAt: string | null,
    updatedAt: string | null,
    deletedAt: string | null,
  } | null,
};

export interface patientContactDeleteMutationVariables {
  patientContactId: string,
};

export interface patientContactDeleteMutation {
  // Delete patient contact
  patientContactDelete:  {
    id: string,
    patientId: string,
    relationToPatient: PatientRelationOptions,
    relationFreeText: string | null,
    firstName: string,
    lastName: string,
    isEmergencyContact: boolean,
    isHealthcareProxy: boolean,
    description: string | null,
    address:  {
      id: string,
      city: string | null,
      state: string | null,
      street1: string | null,
      street2: string | null,
      zip: string | null,
      description: string | null,
    } | null,
    email:  {
      id: string,
      emailAddress: string,
    } | null,
    phone:  {
      id: string,
      phoneNumber: string,
      type: PhoneTypeOptions,
    },
    createdAt: string | null,
    updatedAt: string | null,
    deletedAt: string | null,
  } | null,
};

export interface patientContactEditMutationVariables {
  patientContactId: string,
  relationToPatient?: PatientRelationOptions | null,
  relationFreeText?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  isEmergencyContact?: boolean | null,
  isHealthcareProxy?: boolean | null,
  description?: string | null,
  address?: AddressInput | null,
  email?: EmailInput | null,
  phone?: PhoneInput | null,
};

export interface patientContactEditMutation {
  // Edit fields on patient contact stored in the db
  patientContactEdit:  {
    id: string,
    patientId: string,
    relationToPatient: PatientRelationOptions,
    relationFreeText: string | null,
    firstName: string,
    lastName: string,
    isEmergencyContact: boolean,
    isHealthcareProxy: boolean,
    description: string | null,
    address:  {
      id: string,
      city: string | null,
      state: string | null,
      street1: string | null,
      street2: string | null,
      zip: string | null,
      description: string | null,
    } | null,
    email:  {
      id: string,
      emailAddress: string,
    } | null,
    phone:  {
      id: string,
      phoneNumber: string,
      type: PhoneTypeOptions,
    },
    createdAt: string | null,
    updatedAt: string | null,
    deletedAt: string | null,
  } | null,
};

export interface patientCoreIdentityVerifyMutationVariables {
  patientId: string,
};

export interface patientCoreIdentityVerifyMutation {
  // mark core identity verified on patient stored in the db
  patientCoreIdentityVerify:  {
    id: string,
    firstName: string,
    middleName: string | null,
    lastName: string,
    dateOfBirth: string | null,
    createdAt: string,
    coreIdentityVerifiedAt: string | null,
    patientInfo:  {
      id: string,
      gender: Gender | null,
      language: string | null,
      preferredName: string | null,
      hasUploadedPhoto: boolean | null,
    },
    patientState:  {
      id: string,
      currentState: CurrentPatientState,
    },
  } | null,
};

export interface patientDataFlagCreateMutationVariables {
  patientId: string,
  fieldName: CoreIdentityOptions,
  suggestedValue?: string | null,
  notes?: string | null,
};

export interface patientDataFlagCreateMutation {
  // creates a patient data flag
  patientDataFlagCreate:  {
    id: string,
    patientId: string,
    userId: string,
    fieldName: CoreIdentityOptions,
    suggestedValue: string | null,
    notes: string | null,
    updatedAt: string | null,
  } | null,
};

export interface patientDocumentCreateMutationVariables {
  id?: string | null,
  patientId: string,
  filename: string,
  description?: string | null,
  documentType?: DocumentTypeOptions | null,
};

export interface patientDocumentCreateMutation {
  // Create patient document
  patientDocumentCreate:  {
    id: string,
    patientId: string,
    uploadedBy:  {
      firstName: string | null,
      lastName: string | null,
    },
    filename: string,
    description: string | null,
    documentType: DocumentTypeOptions | null,
    createdAt: string,
  } | null,
};

export interface patientDocumentDeleteMutationVariables {
  patientDocumentId: string,
};

export interface patientDocumentDeleteMutation {
  // Delete patient document
  patientDocumentDelete:  {
    id: string,
    patientId: string,
    uploadedBy:  {
      firstName: string | null,
      lastName: string | null,
    },
    filename: string,
    description: string | null,
    documentType: DocumentTypeOptions | null,
    createdAt: string,
  } | null,
};

export interface patientDocumentSignedUrlCreateMutationVariables {
  patientId: string,
  documentId: string,
  action: PatientSignedUrlAction,
  contentType?: string | null,
};

export interface patientDocumentSignedUrlCreateMutation {
  // generate a signed URL for patient document
  patientDocumentSignedUrlCreate:  {
    signedUrl: string,
  },
};

export interface patientExternalProviderCreateMutationVariables {
  patientId: string,
  role: ExternalProviderOptions,
  roleFreeText?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  agencyName: string,
  description?: string | null,
  email?: EmailCreateInput | null,
  phone: PhoneCreateInput,
};

export interface patientExternalProviderCreateMutation {
  // Create patient external provider
  patientExternalProviderCreate:  {
    id: string,
    patientId: string,
    role: ExternalProviderOptions,
    roleFreeText: string | null,
    firstName: string | null,
    lastName: string | null,
    agencyName: string,
    description: string | null,
    email:  {
      id: string,
      emailAddress: string,
    } | null,
    phone:  {
      id: string,
      phoneNumber: string,
      type: PhoneTypeOptions,
    },
    createdAt: string | null,
    updatedAt: string | null,
    deletedAt: string | null,
  } | null,
};

export interface patientExternalProviderDeleteMutationVariables {
  patientExternalProviderId: string,
};

export interface patientExternalProviderDeleteMutation {
  // Delete patient external provider
  patientExternalProviderDelete:  {
    id: string,
    patientId: string,
    role: ExternalProviderOptions,
    roleFreeText: string | null,
    firstName: string | null,
    lastName: string | null,
    agencyName: string,
    description: string | null,
    email:  {
      id: string,
      emailAddress: string,
    } | null,
    phone:  {
      id: string,
      phoneNumber: string,
      type: PhoneTypeOptions,
    },
    createdAt: string | null,
    updatedAt: string | null,
    deletedAt: string | null,
  } | null,
};

export interface patientExternalProviderEditMutationVariables {
  patientExternalProviderId: string,
  role?: ExternalProviderOptions | null,
  roleFreeText?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  agencyName?: string | null,
  description?: string | null,
  email?: EmailInput | null,
  phone?: PhoneInput | null,
};

export interface patientExternalProviderEditMutation {
  // Edit fields on patient external provider stored in the db
  patientExternalProviderEdit:  {
    id: string,
    patientId: string,
    role: ExternalProviderOptions,
    roleFreeText: string | null,
    firstName: string | null,
    lastName: string | null,
    agencyName: string,
    description: string | null,
    email:  {
      id: string,
      emailAddress: string,
    } | null,
    phone:  {
      id: string,
      phoneNumber: string,
      type: PhoneTypeOptions,
    },
    createdAt: string | null,
    updatedAt: string | null,
    deletedAt: string | null,
  } | null,
};

export interface patientGlassBreakCreateMutationVariables {
  patientId: string,
  reason: string,
  note?: string | null,
};

export interface patientGlassBreakCreateMutation {
  // creates a patient glass break
  patientGlassBreakCreate:  {
    id: string,
    patientId: string,
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
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
      assignedToId: string | null,
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
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
      assignedToId: string | null,
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

export interface patientInfoEditMutationVariables {
  patientInfoId: string,
  preferredName?: string | null,
  gender?: Gender | null,
  genderFreeText?: string | null,
  transgender?: Transgender | null,
  maritalStatus?: MaritalStatus | null,
  language?: string | null,
  isMarginallyHoused?: boolean | null,
  primaryAddressId?: string | null,
  hasEmail?: boolean | null,
  primaryEmailId?: string | null,
  primaryPhoneId?: string | null,
  preferredContactMethod?: ContactMethodOptions | null,
  canReceiveCalls?: boolean | null,
  canReceiveTexts?: boolean | null,
  hasHealthcareProxy?: boolean | null,
  hasMolst?: boolean | null,
  hasDeclinedPhotoUpload?: boolean | null,
  hasUploadedPhoto?: boolean | null,
};

export interface patientInfoEditMutation {
  // Edit fields on patient info stored in the db
  patientInfoEdit:  {
    id: string,
    preferredName: string | null,
    gender: Gender | null,
    genderFreeText: string | null,
    transgender: Transgender | null,
    maritalStatus: MaritalStatus | null,
    language: string | null,
    isMarginallyHoused: boolean | null,
    primaryAddress:  {
      id: string,
      city: string | null,
      state: string | null,
      street1: string | null,
      street2: string | null,
      zip: string | null,
      description: string | null,
    } | null,
    hasEmail: boolean | null,
    primaryEmail:  {
      id: string,
      emailAddress: string,
      description: string | null,
    } | null,
    primaryPhone:  {
      id: string,
      phoneNumber: string,
      type: PhoneTypeOptions,
      description: string | null,
    } | null,
    preferredContactMethod: ContactMethodOptions | null,
    canReceiveCalls: boolean | null,
    canReceiveTexts: boolean | null,
    hasHealthcareProxy: boolean | null,
    hasMolst: boolean | null,
    hasDeclinedPhotoUpload: boolean | null,
    hasUploadedPhoto: boolean | null,
    googleCalendarId: string | null,
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

export interface patientNeedToKnowEditMutationVariables {
  patientInfoId: string,
  text: string,
};

export interface patientNeedToKnowEditMutation {
  // Edit a patient need to know
  patientNeedToKnowEdit:  {
    text: string | null,
  } | null,
};

export interface patientPhotoSignedUrlCreateMutationVariables {
  patientId: string,
  action: PatientSignedUrlAction,
};

export interface patientPhotoSignedUrlCreateMutation {
  // generate a signed URL for patient photo
  patientPhotoSignedUrlCreate:  {
    signedUrl: string,
  },
};

export interface patientScratchPadEditMutationVariables {
  patientScratchPadId: string,
  body: string,
};

export interface patientScratchPadEditMutation {
  // edits a patient scratch pad
  patientScratchPadEdit:  {
    id: string,
    patientId: string,
    userId: string,
    body: string,
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
      id: string,
      title: string,
      riskAreaId: string,
    },
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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
      id: string,
      title: string,
      riskAreaId: string,
    },
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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

export interface phoneCreateForPatientMutationVariables {
  patientId: string,
  phoneNumber: string,
  type: PhoneTypeOptions,
  description?: string | null,
  isPrimary?: boolean | null,
};

export interface phoneCreateForPatientMutation {
  // Create a phone number for a Patient
  phoneCreateForPatient:  {
    id: string,
    phoneNumber: string,
    type: PhoneTypeOptions,
    description: string | null,
  } | null,
};

export interface phoneCreateMutationVariables {
  phoneNumber: string,
  type: PhoneTypeOptions,
  description?: string | null,
};

export interface phoneCreateMutation {
  // Create a phone number
  phoneCreate:  {
    id: string,
    phoneNumber: string,
    type: PhoneTypeOptions,
    description: string | null,
  } | null,
};

export interface phoneDeleteForPatientMutationVariables {
  phoneId: string,
  patientId: string,
  isPrimary?: boolean | null,
};

export interface phoneDeleteForPatientMutation {
  // Delete a phone number for a Patient
  phoneDeleteForPatient:  {
    id: string,
    phoneNumber: string,
    type: PhoneTypeOptions,
    description: string | null,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
    },
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
    worryScore: number | null,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
    },
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
    worryScore: number | null,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
    },
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
    worryScore: number | null,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
    },
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
    worryScore: number | null,
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
  worryScore?: number | null,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
    },
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
    worryScore: number | null,
  } | null,
};

export interface progressNoteGlassBreakCreateMutationVariables {
  progressNoteId: string,
  reason: string,
  note?: string | null,
};

export interface progressNoteGlassBreakCreateMutation {
  // creates a progress note glass break
  progressNoteGlassBreakCreate:  {
    id: string,
    progressNoteId: string,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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
    riskAreaGroupId: string,
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
    riskAreaGroupId: string,
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
    riskAreaGroupId: string,
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

export interface smsMessageCreateMutationVariables {
  patientId: string,
  body: string,
};

export interface smsMessageCreateMutation {
  // create a SMS message (returns node so fits into paginated results)
  smsMessageCreate:  {
    node:  {
      id: string,
      userId: string,
      contactNumber: string,
      patientId: string | null,
      direction: SmsMessageDirection,
      body: string,
      createdAt: string,
    },
  },
};

export interface smsMessageCreatedSubscriptionVariables {
  patientId: string,
};

export interface smsMessageCreatedSubscription {
  smsMessageCreated:  {
    node:  {
      id: string,
      userId: string,
      contactNumber: string,
      patientId: string | null,
      direction: SmsMessageDirection,
      body: string,
      createdAt: string,
    },
  },
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
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
      patientInfo:  {
        id: string,
        gender: Gender | null,
        hasUploadedPhoto: boolean | null,
      },
    },
    assignedToId: string | null,
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
        url: string | null,
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
  dueAt?: string | null,
  patientId: string,
  priority?: Priority | null,
  assignedToId?: string | null,
  patientGoalId: string,
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
      patientInfo:  {
        id: string,
        gender: Gender | null,
        hasUploadedPhoto: boolean | null,
      },
    },
    assignedToId: string | null,
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
        url: string | null,
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
      patientInfo:  {
        id: string,
        gender: Gender | null,
        hasUploadedPhoto: boolean | null,
      },
    },
    assignedToId: string | null,
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
        url: string | null,
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
      patientInfo:  {
        id: string,
        gender: Gender | null,
        hasUploadedPhoto: boolean | null,
      },
    },
    assignedToId: string | null,
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
        url: string | null,
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
      patientInfo:  {
        id: string,
        gender: Gender | null,
        hasUploadedPhoto: boolean | null,
      },
    },
    assignedToId: string | null,
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
        url: string | null,
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
      patientInfo:  {
        id: string,
        gender: Gender | null,
        hasUploadedPhoto: boolean | null,
      },
    },
    assignedToId: string | null,
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
        url: string | null,
      } | null,
      name: string | null,
      url: string | null,
      diagnosis: string | null,
      sentAt: string | null,
      acknowledgedAt: string | null,
    } | null,
  } | null,
};

export interface taskUserUnfollowMutationVariables {
  taskId: string,
  userId: string,
};

export interface taskUserUnfollowMutation {
  // Remove user from task followers
  taskUserUnfollow:  {
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
      patientInfo:  {
        id: string,
        gender: Gender | null,
        hasUploadedPhoto: boolean | null,
      },
    },
    assignedToId: string | null,
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
        url: string | null,
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
  orderBy?: UserTaskOrderOptions | null,
  isFollowingTasks?: boolean | null,
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
          patientInfo:  {
            id: string,
            gender: Gender | null,
            hasUploadedPhoto: boolean | null,
          },
        },
        assignedToId: string | null,
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
            url: string | null,
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
  } | null,
};

export interface userEditPermissionsMutationVariables {
  email: string,
  permissions: Permissions,
};

export interface userEditPermissionsMutation {
  // Edit user - permissions
  userEditPermissions:  {
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
  } | null,
};

export interface userEditRoleMutationVariables {
  email: string,
  userRole: string,
};

export interface userEditRoleMutation {
  // Edit user - role
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
  } | null,
};

export interface userHoursCreateMutationVariables {
  weekday: number,
  startTime: number,
  endTime: number,
};

export interface userHoursCreateMutation {
  // create user hours
  userHoursCreate:  {
    id: string,
    userId: string,
    weekday: number,
    startTime: number,
    endTime: number,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  },
};

export interface userHoursDeleteMutationVariables {
  userHoursId: string,
};

export interface userHoursDeleteMutation {
  // delete user hours
  userHoursDelete:  {
    id: string,
    userId: string,
    weekday: number,
    startTime: number,
    endTime: number,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  },
};

export interface userHoursEditMutationVariables {
  userHoursId: string,
  startTime: number,
  endTime: number,
};

export interface userHoursEditMutation {
  // edit user hours
  userHoursEdit:  {
    id: string,
    userId: string,
    weekday: number,
    startTime: number,
    endTime: number,
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null,
  },
};

export interface userVoicemailSignedUrlCreateMutationVariables {
  voicemailId: string,
};

export interface userVoicemailSignedUrlCreateMutation {
  // generate a signed URL for voicemail
  userVoicemailSignedUrlCreate:  {
    signedUrl: string,
  },
};

export interface FullAddressFragment {
  id: string,
  city: string | null,
  state: string | null,
  street1: string | null,
  street2: string | null,
  zip: string | null,
  description: string | null,
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

export interface FullCalendarEventFragment {
  id: string,
  title: string,
  startDate: string,
  startTime: string | null,
  endDate: string,
  endTime: string | null,
  htmlLink: string,
  description: string | null,
  location: string | null,
  guests: Array< string > | null,
  eventType: GoogleCalendarEventType | null,
  providerName: string | null,
  providerCredentials: string | null,
};

export interface FullCarePlanSuggestionForPatientFragment {
  id: string,
  patientId: string,
  patient:  {
    id: string,
    firstName: string,
    middleName: string | null,
    lastName: string,
    dateOfBirth: string | null,
    createdAt: string,
    coreIdentityVerifiedAt: string | null,
    patientInfo:  {
      id: string,
      gender: Gender | null,
      language: string | null,
      preferredName: string | null,
      hasUploadedPhoto: boolean | null,
    },
    patientState:  {
      id: string,
      currentState: CurrentPatientState,
    },
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
  computedField:  {
    id: string,
    label: string,
    riskArea:  {
      id: string,
      title: string,
    },
  } | null,
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
    dateOfBirth: string | null,
    createdAt: string,
    coreIdentityVerifiedAt: string | null,
    patientInfo:  {
      id: string,
      gender: Gender | null,
      language: string | null,
      preferredName: string | null,
      hasUploadedPhoto: boolean | null,
    },
    patientState:  {
      id: string,
      currentState: CurrentPatientState,
    },
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
    dateOfBirth: string | null,
    createdAt: string,
    coreIdentityVerifiedAt: string | null,
    patientInfo:  {
      id: string,
      gender: Gender | null,
      language: string | null,
      preferredName: string | null,
      hasUploadedPhoto: boolean | null,
    },
    patientState:  {
      id: string,
      currentState: CurrentPatientState,
    },
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
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
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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
        assignedToId: string | null,
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
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
      assignedToId: string | null,
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

export interface FullCareTeamUserFragment {
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
  permissions: Permissions,
  isCareTeamLead: boolean,
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
    url: string | null,
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
  url: string | null,
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

export interface FullComputedPatientStatusFragment {
  id: string,
  patientId: string,
  updatedById: string,
  isCoreIdentityVerified: boolean,
  isDemographicInfoUpdated: boolean,
  isEmergencyContactAdded: boolean,
  isAdvancedDirectivesAdded: boolean,
  isConsentSigned: boolean,
  isPhotoAddedOrDeclined: boolean,
  isIneligible: boolean,
  isDisenrolled: boolean,
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

export interface FullEmailFragment {
  id: string,
  emailAddress: string,
  description: string | null,
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
  },
  taskEvent:  {
    id: string,
    taskId: string,
    task:  {
      id: string,
      title: string,
      priority: Priority | null,
      patientId: string,
      patientGoalId: string,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
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
        permissions: Permissions,
        isAvailable: boolean,
        awayMessage: string,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
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
    dateOfBirth: string | null,
    createdAt: string,
    coreIdentityVerifiedAt: string | null,
    patientInfo:  {
      id: string,
      gender: Gender | null,
      language: string | null,
      preferredName: string | null,
      hasUploadedPhoto: boolean | null,
    },
    patientState:  {
      id: string,
      currentState: CurrentPatientState,
    },
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
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
      answerType: AnswerTypeOptions,
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
      answerType: AnswerTypeOptions,
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
    answerType: AnswerTypeOptions,
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
    dateOfBirth: string | null,
    createdAt: string,
    coreIdentityVerifiedAt: string | null,
    patientInfo:  {
      id: string,
      gender: Gender | null,
      language: string | null,
      preferredName: string | null,
      hasUploadedPhoto: boolean | null,
    },
    patientState:  {
      id: string,
      currentState: CurrentPatientState,
    },
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
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
      assignedToId: string | null,
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

export interface FullPatientContactFragment {
  id: string,
  patientId: string,
  relationToPatient: PatientRelationOptions,
  relationFreeText: string | null,
  firstName: string,
  lastName: string,
  isEmergencyContact: boolean,
  isHealthcareProxy: boolean,
  description: string | null,
  address:  {
    id: string,
    city: string | null,
    state: string | null,
    street1: string | null,
    street2: string | null,
    zip: string | null,
    description: string | null,
  } | null,
  email:  {
    id: string,
    emailAddress: string,
  } | null,
  phone:  {
    id: string,
    phoneNumber: string,
    type: PhoneTypeOptions,
  },
  createdAt: string | null,
  updatedAt: string | null,
  deletedAt: string | null,
};

export interface FullPatientDataFlagFragment {
  id: string,
  patientId: string,
  userId: string,
  fieldName: CoreIdentityOptions,
  suggestedValue: string | null,
  notes: string | null,
  updatedAt: string | null,
};

export interface FullPatientDocumentFragment {
  id: string,
  patientId: string,
  uploadedBy:  {
    firstName: string | null,
    lastName: string | null,
  },
  filename: string,
  description: string | null,
  documentType: DocumentTypeOptions | null,
  createdAt: string,
};

export interface FullPatientEncounterFragment {
  id: string,
  location: string | null,
  source: string | null,
  date: string,
  title: string | null,
  notes: string | null,
  progressNoteId: string | null,
};

export interface FullPatientExternalProviderFragment {
  id: string,
  patientId: string,
  role: ExternalProviderOptions,
  roleFreeText: string | null,
  firstName: string | null,
  lastName: string | null,
  agencyName: string,
  description: string | null,
  email:  {
    id: string,
    emailAddress: string,
  } | null,
  phone:  {
    id: string,
    phoneNumber: string,
    type: PhoneTypeOptions,
  },
  createdAt: string | null,
  updatedAt: string | null,
  deletedAt: string | null,
};

export interface FullPatientForCBOReferralFormPDFFragment {
  id: string,
  createdAt: string,
  firstName: string,
  lastName: string,
  cityblockId: number,
  dateOfBirth: string | null,
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
  } > | null,
  patientInfo:  {
    gender: Gender | null,
    language: string | null,
    primaryAddress:  {
      id: string,
      city: string | null,
      state: string | null,
      street1: string | null,
      street2: string | null,
      zip: string | null,
      description: string | null,
    } | null,
    primaryPhone:  {
      id: string,
      phoneNumber: string,
      type: PhoneTypeOptions,
      description: string | null,
    } | null,
  },
};

export interface FullPatientForDashboardFragment {
  id: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string | null,
  cityblockId: number,
  patientInfo:  {
    gender: Gender | null,
    hasUploadedPhoto: boolean | null,
  },
  patientState:  {
    id: string,
    currentState: CurrentPatientState,
  },
  computedPatientStatus:  {
    isCoreIdentityVerified: boolean,
    isDemographicInfoUpdated: boolean,
    isEmergencyContactAdded: boolean,
    isAdvancedDirectivesAdded: boolean,
    isConsentSigned: boolean,
    isPhotoAddedOrDeclined: boolean,
  },
};

export interface FullPatientForProfileFragment {
  id: string,
  firstName: string,
  middleName: string | null,
  lastName: string,
  cityblockId: number,
  dateOfBirth: string | null,
  ssnEnd: string | null,
  nmi: string | null,
  mrn: string | null,
  createdAt: string,
  coreIdentityVerifiedAt: string | null,
  coreIdentityVerifiedById: string | null,
  patientInfo:  {
    id: string,
    preferredName: string | null,
    gender: Gender | null,
    genderFreeText: string | null,
    transgender: Transgender | null,
    maritalStatus: MaritalStatus | null,
    language: string | null,
    isMarginallyHoused: boolean | null,
    primaryAddress:  {
      id: string,
      city: string | null,
      state: string | null,
      street1: string | null,
      street2: string | null,
      zip: string | null,
      description: string | null,
    } | null,
    hasEmail: boolean | null,
    primaryEmail:  {
      id: string,
      emailAddress: string,
      description: string | null,
    } | null,
    primaryPhone:  {
      id: string,
      phoneNumber: string,
      type: PhoneTypeOptions,
      description: string | null,
    } | null,
    preferredContactMethod: ContactMethodOptions | null,
    canReceiveCalls: boolean | null,
    canReceiveTexts: boolean | null,
    hasHealthcareProxy: boolean | null,
    hasMolst: boolean | null,
    hasDeclinedPhotoUpload: boolean | null,
    hasUploadedPhoto: boolean | null,
    googleCalendarId: string | null,
  },
  patientDataFlags:  Array< {
    id: string,
    patientId: string,
    userId: string,
    fieldName: CoreIdentityOptions,
    suggestedValue: string | null,
    notes: string | null,
    updatedAt: string | null,
  } > | null,
  patientState:  {
    id: string,
    currentState: CurrentPatientState,
  },
};

export interface FullPatientGlassBreakCheckFragment {
  patientId: string,
  isGlassBreakNotNeeded: boolean,
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
    dateOfBirth: string | null,
    createdAt: string,
    coreIdentityVerifiedAt: string | null,
    patientInfo:  {
      id: string,
      gender: Gender | null,
      language: string | null,
      preferredName: string | null,
      hasUploadedPhoto: boolean | null,
    },
    patientState:  {
      id: string,
      currentState: CurrentPatientState,
    },
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
    assignedToId: string | null,
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

export interface FullPatientInfoFragment {
  id: string,
  preferredName: string | null,
  gender: Gender | null,
  genderFreeText: string | null,
  transgender: Transgender | null,
  maritalStatus: MaritalStatus | null,
  language: string | null,
  isMarginallyHoused: boolean | null,
  primaryAddress:  {
    id: string,
    city: string | null,
    state: string | null,
    street1: string | null,
    street2: string | null,
    zip: string | null,
    description: string | null,
  } | null,
  hasEmail: boolean | null,
  primaryEmail:  {
    id: string,
    emailAddress: string,
    description: string | null,
  } | null,
  primaryPhone:  {
    id: string,
    phoneNumber: string,
    type: PhoneTypeOptions,
    description: string | null,
  } | null,
  preferredContactMethod: ContactMethodOptions | null,
  canReceiveCalls: boolean | null,
  canReceiveTexts: boolean | null,
  hasHealthcareProxy: boolean | null,
  hasMolst: boolean | null,
  hasDeclinedPhotoUpload: boolean | null,
  hasUploadedPhoto: boolean | null,
  googleCalendarId: string | null,
};

export interface FullPatientListFragment {
  id: string,
  title: string,
  answerId: string,
  order: number,
  createdAt: string,
};

export interface FullPatientNeedToKnowFragment {
  text: string | null,
};

export interface FullPatientScratchPadFragment {
  id: string,
  patientId: string,
  userId: string,
  body: string,
};

export interface FullPatientScreeningToolSubmissionFragment {
  id: string,
  screeningToolId: string,
  screeningTool:  {
    id: string,
    title: string,
    riskAreaId: string,
  },
  patientId: string,
  patient:  {
    id: string,
    firstName: string,
    middleName: string | null,
    lastName: string,
    dateOfBirth: string | null,
    createdAt: string,
    coreIdentityVerifiedAt: string | null,
    patientInfo:  {
      id: string,
      gender: Gender | null,
      language: string | null,
      preferredName: string | null,
      hasUploadedPhoto: boolean | null,
    },
    patientState:  {
      id: string,
      currentState: CurrentPatientState,
    },
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
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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

export interface FullPatientTableRowFragment {
  id: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string | null,
  cityblockId: number,
  userCareTeam: boolean | null,
  patientInfo:  {
    gender: Gender | null,
    primaryAddress:  {
      id: string,
      city: string | null,
      state: string | null,
      street1: string | null,
      street2: string | null,
      zip: string | null,
      description: string | null,
    } | null,
  },
  patientState:  {
    id: string,
    currentState: CurrentPatientState,
  },
};

export interface FullPhoneFragment {
  id: string,
  phoneNumber: string,
  type: PhoneTypeOptions,
  description: string | null,
};

export interface FullProgressNoteActivityFragment {
  taskEvents:  Array< {
    id: string,
    taskId: string,
    task:  {
      id: string,
      title: string,
      priority: Priority | null,
      patientId: string,
      patientGoalId: string,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
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
        permissions: Permissions,
        isAvailable: boolean,
        awayMessage: string,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
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
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
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
        answerType: AnswerTypeOptions,
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
        answerType: AnswerTypeOptions,
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
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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
          dateOfBirth: string | null,
          createdAt: string,
          coreIdentityVerifiedAt: string | null,
          patientInfo:  {
            id: string,
            gender: Gender | null,
            language: string | null,
            preferredName: string | null,
            hasUploadedPhoto: boolean | null,
          },
          patientState:  {
            id: string,
            currentState: CurrentPatientState,
          },
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
          assignedToId: string | null,
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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
        assignedToId: string | null,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
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
      id: string,
      title: string,
      riskAreaId: string,
    },
    patientId: string,
    patient:  {
      id: string,
      firstName: string,
      middleName: string | null,
      lastName: string,
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
        dateOfBirth: string | null,
        createdAt: string,
        coreIdentityVerifiedAt: string | null,
        patientInfo:  {
          id: string,
          gender: Gender | null,
          language: string | null,
          preferredName: string | null,
          hasUploadedPhoto: boolean | null,
        },
        patientState:  {
          id: string,
          currentState: CurrentPatientState,
        },
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

export interface FullProgressNoteGlassBreakCheckFragment {
  progressNoteId: string,
  isGlassBreakNotNeeded: boolean,
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
  },
  patient:  {
    id: string,
    firstName: string,
    middleName: string | null,
    lastName: string,
    dateOfBirth: string | null,
    createdAt: string,
    coreIdentityVerifiedAt: string | null,
    patientInfo:  {
      id: string,
      gender: Gender | null,
      language: string | null,
      preferredName: string | null,
      hasUploadedPhoto: boolean | null,
    },
    patientState:  {
      id: string,
      currentState: CurrentPatientState,
    },
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
  worryScore: number | null,
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
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
      dateOfBirth: string | null,
      createdAt: string,
      coreIdentityVerifiedAt: string | null,
      patientInfo:  {
        id: string,
        gender: Gender | null,
        language: string | null,
        preferredName: string | null,
        hasUploadedPhoto: boolean | null,
      },
      patientState:  {
        id: string,
        currentState: CurrentPatientState,
      },
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
  riskAreaAssessmentSubmissions:  Array< {
    id: string,
    createdAt: string,
  } >,
  lastUpdated: string | null,
  forceHighRisk: boolean,
  totalScore: number | null,
  riskScore: Priority | null,
  summaryText: Array< string >,
};

export interface FullRiskAreaGroupForPatientFragment {
  id: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
  title: string,
  shortTitle: string,
  order: number,
  mediumRiskThreshold: number,
  highRiskThreshold: number,
  automatedSummaryText: Array< string >,
  manualSummaryText: Array< string >,
  screeningToolResultSummaries:  Array< {
    title: string,
    score: number | null,
    description: string,
  } >,
  lastUpdated: string | null,
  forceHighRisk: boolean,
  totalScore: number | null,
  riskScore: Priority | null,
  riskAreas:  Array< {
    id: string,
    assessmentType: AssessmentType,
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
  riskAreaGroupId: string,
};

export interface FullRiskScoreFragment {
  score: number,
  forceHighRisk: boolean,
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
  } > | null,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
};

export interface FullSmsMessageFragment {
  id: string,
  userId: string,
  contactNumber: string,
  patientId: string | null,
  direction: SmsMessageDirection,
  body: string,
  createdAt: string,
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
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
    patientId: string,
    patientGoalId: string,
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
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
    cityblockId: number,
    dateOfBirth: string | null,
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
      permissions: Permissions,
      isAvailable: boolean,
      awayMessage: string,
    } > | null,
    patientInfo:  {
      gender: Gender | null,
      language: string | null,
      primaryAddress:  {
        id: string,
        city: string | null,
        state: string | null,
        street1: string | null,
        street2: string | null,
        zip: string | null,
        description: string | null,
      } | null,
      primaryPhone:  {
        id: string,
        phoneNumber: string,
        type: PhoneTypeOptions,
        description: string | null,
      } | null,
    },
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
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
    permissions: Permissions,
    isAvailable: boolean,
    awayMessage: string,
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
      url: string | null,
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
    patientInfo:  {
      id: string,
      gender: Gender | null,
      hasUploadedPhoto: boolean | null,
    },
  },
  assignedToId: string | null,
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
      url: string | null,
    } | null,
    name: string | null,
    url: string | null,
    diagnosis: string | null,
    sentAt: string | null,
    acknowledgedAt: string | null,
  } | null,
};

export interface FullUserHoursFragment {
  id: string,
  userId: string,
  weekday: number,
  startTime: number,
  endTime: number,
  createdAt: string,
  updatedAt: string,
  deletedAt: string | null,
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
  permissions: Permissions,
  isAvailable: boolean,
  awayMessage: string,
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
  url: string | null,
};

export interface ShortEventNotificationsForUserTaskFragment {
  id: string,
  title: string | null,
  createdAt: string,
};

export interface ShortPatientGlassBreakFragment {
  id: string,
  patientId: string,
};

export interface ShortPatientInfoFragment {
  id: string,
  gender: Gender | null,
  language: string | null,
  preferredName: string | null,
  hasUploadedPhoto: boolean | null,
};

export interface ShortPatientScreeningToolSubmission360Fragment {
  id: string,
  score: number | null,
  createdAt: string,
  user:  {
    id: string,
    firstName: string | null,
    lastName: string | null,
  },
  screeningTool:  {
    id: string,
    title: string,
    riskAreaId: string,
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
      id: string,
      riskAdjustmentType: RiskAdjustmentTypeOptions | null,
      inSummary: boolean | null,
      summaryText: string | null,
    },
  } > | null,
};

export interface ShortPatientStateFragment {
  id: string,
  currentState: CurrentPatientState,
};

export interface ShortPatientFragment {
  id: string,
  firstName: string,
  middleName: string | null,
  lastName: string,
  dateOfBirth: string | null,
  createdAt: string,
  coreIdentityVerifiedAt: string | null,
  patientInfo:  {
    id: string,
    gender: Gender | null,
    language: string | null,
    preferredName: string | null,
    hasUploadedPhoto: boolean | null,
  },
  patientState:  {
    id: string,
    currentState: CurrentPatientState,
  },
};

export interface ShortProgressNoteGlassBreakFragment {
  id: string,
  progressNoteId: string,
};

export interface ShortTaskForUserForPatientFragment {
  id: string,
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
  assignedToId: string | null,
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

export interface ShortUserWithCountFragment {
  id: string,
  firstName: string | null,
  lastName: string | null,
  userRole: UserRole,
  googleProfileImageUrl: string | null,
  patientCount: number | null,
  email: string | null,
};

export interface ShortUserFragment {
  id: string,
  firstName: string | null,
  lastName: string | null,
  userRole: UserRole,
  googleProfileImageUrl: string | null,
};
