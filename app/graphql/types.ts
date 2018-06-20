

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addressCreateForPatient
// ====================================================

export interface addressCreateForPatient_addressCreateForPatient {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface addressCreateForPatient {
  addressCreateForPatient: addressCreateForPatient_addressCreateForPatient | null;  // Create an address for a Patient
}

export interface addressCreateForPatientVariables {
  patientId: string;
  zip: string;
  street1?: string | null;
  street2?: string | null;
  city?: string | null;
  state?: string | null;
  description?: string | null;
  isPrimary?: boolean | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addressCreate
// ====================================================

export interface addressCreate_addressCreate {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface addressCreate {
  addressCreate: addressCreate_addressCreate | null;  // Create an address
}

export interface addressCreateVariables {
  zip: string;
  street1?: string | null;
  street2?: string | null;
  city?: string | null;
  state?: string | null;
  description?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addressDeleteForPatient
// ====================================================

export interface addressDeleteForPatient_addressDeleteForPatient {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface addressDeleteForPatient {
  addressDeleteForPatient: addressDeleteForPatient_addressDeleteForPatient | null;  // Delete an address for a Patient
}

export interface addressDeleteForPatientVariables {
  addressId: string;
  patientId: string;
  isPrimary?: boolean | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addressEdit
// ====================================================

export interface addressEdit_addressEdit {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface addressEdit {
  addressEdit: addressEdit_addressEdit | null;  // Edit an address
}

export interface addressEditVariables {
  addressId: string;
  patientId: string;
  zip?: string | null;
  street1?: string | null;
  street2?: string | null;
  city?: string | null;
  state?: string | null;
  description?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: answerCreate
// ====================================================

export interface answerCreate_answerCreate_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface answerCreate_answerCreate_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: answerCreate_answerCreate_concernSuggestions_diagnosisCodes[] | null;
}

export interface answerCreate_answerCreate_goalSuggestions_taskTemplates {
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

export interface answerCreate_answerCreate_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: answerCreate_answerCreate_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface answerCreate_answerCreate_riskArea {
  id: string;
  title: string;
}

export interface answerCreate_answerCreate_screeningTool {
  id: string;
  title: string;
}

export interface answerCreate_answerCreate {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: answerCreate_answerCreate_concernSuggestions[] | null;
  goalSuggestions: (answerCreate_answerCreate_goalSuggestions | null)[] | null;
  riskArea: answerCreate_answerCreate_riskArea | null;
  screeningTool: answerCreate_answerCreate_screeningTool | null;
}

export interface answerCreate {
  answerCreate: answerCreate_answerCreate | null;  // Create an Answer
}

export interface answerCreateVariables {
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType?: RiskAdjustmentTypeOptions | null;
  inSummary?: boolean | null;
  summaryText?: string | null;
  questionId: string;
  order: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: answerDelete
// ====================================================

export interface answerDelete_answerDelete_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface answerDelete_answerDelete_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: answerDelete_answerDelete_concernSuggestions_diagnosisCodes[] | null;
}

export interface answerDelete_answerDelete_goalSuggestions_taskTemplates {
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

export interface answerDelete_answerDelete_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: answerDelete_answerDelete_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface answerDelete_answerDelete_riskArea {
  id: string;
  title: string;
}

export interface answerDelete_answerDelete_screeningTool {
  id: string;
  title: string;
}

export interface answerDelete_answerDelete {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: answerDelete_answerDelete_concernSuggestions[] | null;
  goalSuggestions: (answerDelete_answerDelete_goalSuggestions | null)[] | null;
  riskArea: answerDelete_answerDelete_riskArea | null;
  screeningTool: answerDelete_answerDelete_screeningTool | null;
}

export interface answerDelete {
  answerDelete: answerDelete_answerDelete | null;  // Deletes an Answer
}

export interface answerDeleteVariables {
  answerId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: answerEdit
// ====================================================

export interface answerEdit_answerEdit_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface answerEdit_answerEdit_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: answerEdit_answerEdit_concernSuggestions_diagnosisCodes[] | null;
}

export interface answerEdit_answerEdit_goalSuggestions_taskTemplates {
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

export interface answerEdit_answerEdit_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: answerEdit_answerEdit_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface answerEdit_answerEdit_riskArea {
  id: string;
  title: string;
}

export interface answerEdit_answerEdit_screeningTool {
  id: string;
  title: string;
}

export interface answerEdit_answerEdit {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: answerEdit_answerEdit_concernSuggestions[] | null;
  goalSuggestions: (answerEdit_answerEdit_goalSuggestions | null)[] | null;
  riskArea: answerEdit_answerEdit_riskArea | null;
  screeningTool: answerEdit_answerEdit_screeningTool | null;
}

export interface answerEdit {
  answerEdit: answerEdit_answerEdit | null;  // Edit an Answer
}

export interface answerEditVariables {
  answerId: string;
  displayValue?: string | null;
  value?: string | null;
  valueType?: AnswerValueTypeOptions | null;
  riskAdjustmentType?: RiskAdjustmentTypeOptions | null;
  inSummary?: boolean | null;
  summaryText?: string | null;
  order?: number | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: calendarCreateEventForCurrentUser
// ====================================================

export interface calendarCreateEventForCurrentUser_calendarCreateEventForCurrentUser {
  eventCreateUrl: string;
}

export interface calendarCreateEventForCurrentUser {
  calendarCreateEventForCurrentUser: calendarCreateEventForCurrentUser_calendarCreateEventForCurrentUser;  // creates a calendar event for current user
}

export interface calendarCreateEventForCurrentUserVariables {
  startDatetime: string;
  endDatetime: string;
  inviteeEmails: string[];
  location: string;
  title: string;
  reason: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: calendarCreateEventForPatient
// ====================================================

export interface calendarCreateEventForPatient_calendarCreateEventForPatient {
  eventCreateUrl: string;
}

export interface calendarCreateEventForPatient {
  calendarCreateEventForPatient: calendarCreateEventForPatient_calendarCreateEventForPatient;  // creates a calendar event for a patient
}

export interface calendarCreateEventForPatientVariables {
  patientId: string;
  startDatetime: string;
  endDatetime: string;
  inviteeEmails: string[];
  location: string;
  title: string;
  reason: string;
  googleCalendarId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: calendarCreateForPatient
// ====================================================

export interface calendarCreateForPatient_calendarCreateForPatient {
  googleCalendarId: string | null;
  patientId: string;
}

export interface calendarCreateForPatient {
  calendarCreateForPatient: calendarCreateForPatient_calendarCreateForPatient;  // creates a calendar for a patient
}

export interface calendarCreateForPatientVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: carePlanSuggestionAccept
// ====================================================

export interface carePlanSuggestionAccept_carePlanSuggestionAccept_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface carePlanSuggestionAccept_carePlanSuggestionAccept_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface carePlanSuggestionAccept_carePlanSuggestionAccept_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: carePlanSuggestionAccept_carePlanSuggestionAccept_patient_patientInfo;
  patientState: carePlanSuggestionAccept_carePlanSuggestionAccept_patient_patientState;
}

export interface carePlanSuggestionAccept_carePlanSuggestionAccept_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface carePlanSuggestionAccept_carePlanSuggestionAccept_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: carePlanSuggestionAccept_carePlanSuggestionAccept_concern_diagnosisCodes[] | null;
}

export interface carePlanSuggestionAccept_carePlanSuggestionAccept_goalSuggestionTemplate_taskTemplates {
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

export interface carePlanSuggestionAccept_carePlanSuggestionAccept_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: carePlanSuggestionAccept_carePlanSuggestionAccept_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface carePlanSuggestionAccept_carePlanSuggestionAccept_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface carePlanSuggestionAccept_carePlanSuggestionAccept_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface carePlanSuggestionAccept_carePlanSuggestionAccept {
  id: string;
  patientId: string;
  patient: carePlanSuggestionAccept_carePlanSuggestionAccept_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: carePlanSuggestionAccept_carePlanSuggestionAccept_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: carePlanSuggestionAccept_carePlanSuggestionAccept_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: carePlanSuggestionAccept_carePlanSuggestionAccept_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: carePlanSuggestionAccept_carePlanSuggestionAccept_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface carePlanSuggestionAccept {
  carePlanSuggestionAccept: carePlanSuggestionAccept_carePlanSuggestionAccept | null;  // care plan suggestion accept
}

export interface carePlanSuggestionAcceptVariables {
  carePlanSuggestionId: string;
  patientConcernId?: string | null;
  concernId?: string | null;
  startedAt?: string | null;
  taskTemplateIds?: (string | null)[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: carePlanSuggestionDismiss
// ====================================================

export interface carePlanSuggestionDismiss_carePlanSuggestionDismiss_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface carePlanSuggestionDismiss_carePlanSuggestionDismiss_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface carePlanSuggestionDismiss_carePlanSuggestionDismiss_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: carePlanSuggestionDismiss_carePlanSuggestionDismiss_patient_patientInfo;
  patientState: carePlanSuggestionDismiss_carePlanSuggestionDismiss_patient_patientState;
}

export interface carePlanSuggestionDismiss_carePlanSuggestionDismiss_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface carePlanSuggestionDismiss_carePlanSuggestionDismiss_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: carePlanSuggestionDismiss_carePlanSuggestionDismiss_concern_diagnosisCodes[] | null;
}

export interface carePlanSuggestionDismiss_carePlanSuggestionDismiss_goalSuggestionTemplate_taskTemplates {
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

export interface carePlanSuggestionDismiss_carePlanSuggestionDismiss_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: carePlanSuggestionDismiss_carePlanSuggestionDismiss_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface carePlanSuggestionDismiss_carePlanSuggestionDismiss_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface carePlanSuggestionDismiss_carePlanSuggestionDismiss_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface carePlanSuggestionDismiss_carePlanSuggestionDismiss {
  id: string;
  patientId: string;
  patient: carePlanSuggestionDismiss_carePlanSuggestionDismiss_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: carePlanSuggestionDismiss_carePlanSuggestionDismiss_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: carePlanSuggestionDismiss_carePlanSuggestionDismiss_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: carePlanSuggestionDismiss_carePlanSuggestionDismiss_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: carePlanSuggestionDismiss_carePlanSuggestionDismiss_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface carePlanSuggestionDismiss {
  carePlanSuggestionDismiss: carePlanSuggestionDismiss_carePlanSuggestionDismiss | null;  // care plan suggestion dismiss
}

export interface carePlanSuggestionDismissVariables {
  carePlanSuggestionId: string;
  dismissedReason: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: careTeamAssignPatients
// ====================================================

export interface careTeamAssignPatients_careTeamAssignPatients {
  id: string;
  firstName: string | null;
  lastName: string | null;
  patientCount: number | null;
}

export interface careTeamAssignPatients {
  careTeamAssignPatients: careTeamAssignPatients_careTeamAssignPatients | null;  // Add multiple patients to careTeam
}

export interface careTeamAssignPatientsVariables {
  patientIds: string[];
  userId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: careTeamMakeTeamLead
// ====================================================

export interface careTeamMakeTeamLead_careTeamMakeTeamLead {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface careTeamMakeTeamLead {
  careTeamMakeTeamLead: careTeamMakeTeamLead_careTeamMakeTeamLead | null;  // Make user team lead of careTeam
}

export interface careTeamMakeTeamLeadVariables {
  userId: string;
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: careTeamReassignUser
// ====================================================

export interface careTeamReassignUser_careTeamReassignUser {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface careTeamReassignUser {
  careTeamReassignUser: careTeamReassignUser_careTeamReassignUser | null;  // Reassign a user on a careTeam
}

export interface careTeamReassignUserVariables {
  userId: string;
  patientId: string;
  reassignedToId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CBOCreate
// ====================================================

export interface CBOCreate_CBOCreate_category {
  id: string;
  title: string;
}

export interface CBOCreate_CBOCreate {
  id: string;
  name: string;
  categoryId: string;
  category: CBOCreate_CBOCreate_category;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
  createdAt: string;
}

export interface CBOCreate {
  CBOCreate: CBOCreate_CBOCreate | null;  // Create a CBO
}

export interface CBOCreateVariables {
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax?: string | null;
  phone: string;
  url: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CBODelete
// ====================================================

export interface CBODelete_CBODelete_category {
  id: string;
  title: string;
}

export interface CBODelete_CBODelete {
  id: string;
  name: string;
  categoryId: string;
  category: CBODelete_CBODelete_category;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
  createdAt: string;
}

export interface CBODelete {
  CBODelete: CBODelete_CBODelete | null;  // Delete a CBO
}

export interface CBODeleteVariables {
  CBOId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CBOEdit
// ====================================================

export interface CBOEdit_CBOEdit_category {
  id: string;
  title: string;
}

export interface CBOEdit_CBOEdit {
  id: string;
  name: string;
  categoryId: string;
  category: CBOEdit_CBOEdit_category;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
  createdAt: string;
}

export interface CBOEdit {
  CBOEdit: CBOEdit_CBOEdit | null;  // Edit a CBO
}

export interface CBOEditVariables {
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


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CBOReferralCreate
// ====================================================

export interface CBOReferralCreate_CBOReferralCreate_category {
  id: string;
  title: string;
}

export interface CBOReferralCreate_CBOReferralCreate_CBO {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
}

export interface CBOReferralCreate_CBOReferralCreate {
  id: string;
  categoryId: string;
  category: CBOReferralCreate_CBOReferralCreate_category;
  CBOId: string | null;
  CBO: CBOReferralCreate_CBOReferralCreate_CBO | null;
  name: string | null;
  url: string | null;
  diagnosis: string | null;
  sentAt: string | null;
  acknowledgedAt: string | null;
}

export interface CBOReferralCreate {
  CBOReferralCreate: CBOReferralCreate_CBOReferralCreate | null;  // Create a CBO Referral
}

export interface CBOReferralCreateVariables {
  categoryId: string;
  CBOId?: string | null;
  name?: string | null;
  url?: string | null;
  diagnosis?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CBOReferralEdit
// ====================================================

export interface CBOReferralEdit_CBOReferralEdit_category {
  id: string;
  title: string;
}

export interface CBOReferralEdit_CBOReferralEdit_CBO {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
}

export interface CBOReferralEdit_CBOReferralEdit {
  id: string;
  categoryId: string;
  category: CBOReferralEdit_CBOReferralEdit_category;
  CBOId: string | null;
  CBO: CBOReferralEdit_CBOReferralEdit_CBO | null;
  name: string | null;
  url: string | null;
  diagnosis: string | null;
  sentAt: string | null;
  acknowledgedAt: string | null;
}

export interface CBOReferralEdit {
  CBOReferralEdit: CBOReferralEdit_CBOReferralEdit | null;  // Edit a CBO Referral
}

export interface CBOReferralEditVariables {
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


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: computedFieldCreate
// ====================================================

export interface computedFieldCreate_computedFieldCreate {
  id: string;
  label: string;
  slug: string;
  dataType: ComputedFieldDataTypes;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface computedFieldCreate {
  computedFieldCreate: computedFieldCreate_computedFieldCreate | null;  // Create a computed field
}

export interface computedFieldCreateVariables {
  label: string;
  dataType: ComputedFieldDataTypes;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: computedFieldDelete
// ====================================================

export interface computedFieldDelete_computedFieldDelete {
  id: string;
  label: string;
  slug: string;
  dataType: ComputedFieldDataTypes;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface computedFieldDelete {
  computedFieldDelete: computedFieldDelete_computedFieldDelete | null;  // Delete a computed field
}

export interface computedFieldDeleteVariables {
  computedFieldId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: computedFieldFlagCreate
// ====================================================

export interface computedFieldFlagCreate_computedFieldFlagCreate {
  id: string;
}

export interface computedFieldFlagCreate {
  computedFieldFlagCreate: computedFieldFlagCreate_computedFieldFlagCreate | null;
}

export interface computedFieldFlagCreateVariables {
  patientAnswerId: string;
  reason?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: concernAddDiagnosisCode
// ====================================================

export interface concernAddDiagnosisCode_concernAddDiagnosisCode_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface concernAddDiagnosisCode_concernAddDiagnosisCode {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: concernAddDiagnosisCode_concernAddDiagnosisCode_diagnosisCodes[] | null;
}

export interface concernAddDiagnosisCode {
  concernAddDiagnosisCode: concernAddDiagnosisCode_concernAddDiagnosisCode | null;  // Add a diagnosis code to a concern
}

export interface concernAddDiagnosisCodeVariables {
  concernId: string;
  codesetName: string;
  code: string;
  version: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: concernCreate
// ====================================================

export interface concernCreate_concernCreate_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface concernCreate_concernCreate {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: concernCreate_concernCreate_diagnosisCodes[] | null;
}

export interface concernCreate {
  concernCreate: concernCreate_concernCreate | null;  // Create a concern
}

export interface concernCreateVariables {
  title: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: concernDelete
// ====================================================

export interface concernDelete_concernDelete_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface concernDelete_concernDelete {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: concernDelete_concernDelete_diagnosisCodes[] | null;
}

export interface concernDelete {
  concernDelete: concernDelete_concernDelete | null;  // Deletes a concern
}

export interface concernDeleteVariables {
  concernId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: concernEdit
// ====================================================

export interface concernEdit_concernEdit_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface concernEdit_concernEdit {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: concernEdit_concernEdit_diagnosisCodes[] | null;
}

export interface concernEdit {
  concernEdit: concernEdit_concernEdit | null;  // Edit a concern
}

export interface concernEditVariables {
  concernId: string;
  title: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: concernRemoveDiagnosisCode
// ====================================================

export interface concernRemoveDiagnosisCode_concernRemoveDiagnosisCode_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface concernRemoveDiagnosisCode_concernRemoveDiagnosisCode {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: concernRemoveDiagnosisCode_concernRemoveDiagnosisCode_diagnosisCodes[] | null;
}

export interface concernRemoveDiagnosisCode {
  concernRemoveDiagnosisCode: concernRemoveDiagnosisCode_concernRemoveDiagnosisCode | null;  // Remove a diagnosis code from a concern
}

export interface concernRemoveDiagnosisCodeVariables {
  concernId: string;
  diagnosisCodeId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: concernSuggestionCreate
// ====================================================

export interface concernSuggestionCreate_concernSuggestionCreate_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface concernSuggestionCreate_concernSuggestionCreate {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: concernSuggestionCreate_concernSuggestionCreate_diagnosisCodes[] | null;
}

export interface concernSuggestionCreate {
  concernSuggestionCreate: (concernSuggestionCreate_concernSuggestionCreate | null)[] | null;  // suggest a concern for an answer
}

export interface concernSuggestionCreateVariables {
  answerId?: string | null;
  screeningToolScoreRangeId?: string | null;
  concernId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: concernSuggestionDelete
// ====================================================

export interface concernSuggestionDelete_concernSuggestionDelete_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface concernSuggestionDelete_concernSuggestionDelete {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: concernSuggestionDelete_concernSuggestionDelete_diagnosisCodes[] | null;
}

export interface concernSuggestionDelete {
  concernSuggestionDelete: (concernSuggestionDelete_concernSuggestionDelete | null)[] | null;  // delete suggestion a concern for an answer
}

export interface concernSuggestionDeleteVariables {
  answerId?: string | null;
  screeningToolScoreRangeId?: string | null;
  concernId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: currentUserEdit
// ====================================================

export interface currentUserEdit_currentUserEdit {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface currentUserEdit {
  currentUserEdit: currentUserEdit_currentUserEdit | null;  // Edit current user
}

export interface currentUserEditVariables {
  locale?: string | null;
  isAvailable?: boolean | null;
  awayMessage?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: emailCreateForPatient
// ====================================================

export interface emailCreateForPatient_emailCreateForPatient {
  id: string;
  emailAddress: string;
  description: string | null;
}

export interface emailCreateForPatient {
  emailCreateForPatient: emailCreateForPatient_emailCreateForPatient | null;  // Create an email for a Patient
}

export interface emailCreateForPatientVariables {
  patientId: string;
  emailAddress: string;
  description?: string | null;
  isPrimary?: boolean | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: emailCreate
// ====================================================

export interface emailCreate_emailCreate {
  id: string;
  emailAddress: string;
  description: string | null;
}

export interface emailCreate {
  emailCreate: emailCreate_emailCreate | null;  // Create an email
}

export interface emailCreateVariables {
  emailAddress: string;
  description?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: emailDeleteForPatient
// ====================================================

export interface emailDeleteForPatient_emailDeleteForPatient {
  id: string;
  emailAddress: string;
  description: string | null;
}

export interface emailDeleteForPatient {
  emailDeleteForPatient: emailDeleteForPatient_emailDeleteForPatient | null;  // Delete an email for a Patient
}

export interface emailDeleteForPatientVariables {
  emailId: string;
  patientId: string;
  isPrimary?: boolean | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: emailEdit
// ====================================================

export interface emailEdit_emailEdit {
  id: string;
  emailAddress: string;
  description: string | null;
}

export interface emailEdit {
  emailEdit: emailEdit_emailEdit | null;  // Edit an email
}

export interface emailEditVariables {
  emailId: string;
  patientId: string;
  emailAddress: string;
  description?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: eventNotificationDismiss
// ====================================================

export interface eventNotificationDismiss_eventNotificationDismiss_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface eventNotificationDismiss_eventNotificationDismiss_taskEvent_task {
  id: string;
  title: string;
  priority: Priority | null;
  patientId: string;
  patientGoalId: string;
}

export interface eventNotificationDismiss_eventNotificationDismiss_taskEvent_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface eventNotificationDismiss_eventNotificationDismiss_taskEvent_eventComment_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface eventNotificationDismiss_eventNotificationDismiss_taskEvent_eventComment {
  id: string;
  body: string;
  user: eventNotificationDismiss_eventNotificationDismiss_taskEvent_eventComment_user;
  taskId: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface eventNotificationDismiss_eventNotificationDismiss_taskEvent_eventUser {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface eventNotificationDismiss_eventNotificationDismiss_taskEvent {
  id: string;
  taskId: string;
  task: eventNotificationDismiss_eventNotificationDismiss_taskEvent_task;
  userId: string;
  user: eventNotificationDismiss_eventNotificationDismiss_taskEvent_user;
  eventType: TaskEventTypes | null;
  eventCommentId: string | null;
  eventComment: eventNotificationDismiss_eventNotificationDismiss_taskEvent_eventComment | null;
  eventUserId: string | null;
  eventUser: eventNotificationDismiss_eventNotificationDismiss_taskEvent_eventUser | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface eventNotificationDismiss_eventNotificationDismiss {
  id: string;
  title: string | null;
  userId: string;
  user: eventNotificationDismiss_eventNotificationDismiss_user;
  taskEvent: eventNotificationDismiss_eventNotificationDismiss_taskEvent | null;
  seenAt: string | null;
  emailSentAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface eventNotificationDismiss {
  eventNotificationDismiss: eventNotificationDismiss_eventNotificationDismiss | null;  // Dismisses (marks as seen) an EventNotification
}

export interface eventNotificationDismissVariables {
  eventNotificationId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: eventNotificationsForTaskDismiss
// ====================================================

export interface eventNotificationsForTaskDismiss_eventNotificationsForTaskDismiss_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface eventNotificationsForTaskDismiss_eventNotificationsForTaskDismiss_taskEvent_task {
  id: string;
  title: string;
  priority: Priority | null;
  patientId: string;
  patientGoalId: string;
}

export interface eventNotificationsForTaskDismiss_eventNotificationsForTaskDismiss_taskEvent_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface eventNotificationsForTaskDismiss_eventNotificationsForTaskDismiss_taskEvent_eventComment_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface eventNotificationsForTaskDismiss_eventNotificationsForTaskDismiss_taskEvent_eventComment {
  id: string;
  body: string;
  user: eventNotificationsForTaskDismiss_eventNotificationsForTaskDismiss_taskEvent_eventComment_user;
  taskId: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface eventNotificationsForTaskDismiss_eventNotificationsForTaskDismiss_taskEvent_eventUser {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface eventNotificationsForTaskDismiss_eventNotificationsForTaskDismiss_taskEvent {
  id: string;
  taskId: string;
  task: eventNotificationsForTaskDismiss_eventNotificationsForTaskDismiss_taskEvent_task;
  userId: string;
  user: eventNotificationsForTaskDismiss_eventNotificationsForTaskDismiss_taskEvent_user;
  eventType: TaskEventTypes | null;
  eventCommentId: string | null;
  eventComment: eventNotificationsForTaskDismiss_eventNotificationsForTaskDismiss_taskEvent_eventComment | null;
  eventUserId: string | null;
  eventUser: eventNotificationsForTaskDismiss_eventNotificationsForTaskDismiss_taskEvent_eventUser | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface eventNotificationsForTaskDismiss_eventNotificationsForTaskDismiss {
  id: string;
  title: string | null;
  userId: string;
  user: eventNotificationsForTaskDismiss_eventNotificationsForTaskDismiss_user;
  taskEvent: eventNotificationsForTaskDismiss_eventNotificationsForTaskDismiss_taskEvent | null;
  seenAt: string | null;
  emailSentAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface eventNotificationsForTaskDismiss {
  eventNotificationsForTaskDismiss: (eventNotificationsForTaskDismiss_eventNotificationsForTaskDismiss | null)[] | null;  // Dismisses (marks as seen) all of the EventNotifications on a Task for a the current user
}

export interface eventNotificationsForTaskDismissVariables {
  taskId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAnswer
// ====================================================

export interface getAnswer_answer_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getAnswer_answer_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getAnswer_answer_concernSuggestions_diagnosisCodes[] | null;
}

export interface getAnswer_answer_goalSuggestions_taskTemplates {
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

export interface getAnswer_answer_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: getAnswer_answer_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getAnswer_answer_riskArea {
  id: string;
  title: string;
}

export interface getAnswer_answer_screeningTool {
  id: string;
  title: string;
}

export interface getAnswer_answer {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: getAnswer_answer_concernSuggestions[] | null;
  goalSuggestions: (getAnswer_answer_goalSuggestions | null)[] | null;
  riskArea: getAnswer_answer_riskArea | null;
  screeningTool: getAnswer_answer_screeningTool | null;
}

export interface getAnswer {
  answer: getAnswer_answer | null;  // Answer
}

export interface getAnswerVariables {
  answerId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCalendarEventsForCurrentUser
// ====================================================

export interface getCalendarEventsForCurrentUser_calendarEventsForCurrentUser_events {
  id: string;
  title: string;
  startDate: string;
  startTime: string | null;
  endDate: string;
  endTime: string | null;
  htmlLink: string;
  description: string | null;
  location: string | null;
  guests: string[] | null;
  eventType: GoogleCalendarEventType | null;
  providerName: string | null;
  providerCredentials: string | null;
}

export interface getCalendarEventsForCurrentUser_calendarEventsForCurrentUser_pageInfo {
  nextPageToken: string | null;
  previousPageToken: string | null;
}

export interface getCalendarEventsForCurrentUser_calendarEventsForCurrentUser {
  events: getCalendarEventsForCurrentUser_calendarEventsForCurrentUser_events[];
  pageInfo: getCalendarEventsForCurrentUser_calendarEventsForCurrentUser_pageInfo | null;
}

export interface getCalendarEventsForCurrentUser {
  calendarEventsForCurrentUser: getCalendarEventsForCurrentUser_calendarEventsForCurrentUser;  // List of google calendar events for the logged in user
}

export interface getCalendarEventsForCurrentUserVariables {
  timeMin: string;
  pageSize: number;
  pageToken?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCalendarEventsForPatient
// ====================================================

export interface getCalendarEventsForPatient_calendarEventsForPatient_events {
  id: string;
  title: string;
  startDate: string;
  startTime: string | null;
  endDate: string;
  endTime: string | null;
  htmlLink: string;
  description: string | null;
  location: string | null;
  guests: string[] | null;
  eventType: GoogleCalendarEventType | null;
  providerName: string | null;
  providerCredentials: string | null;
}

export interface getCalendarEventsForPatient_calendarEventsForPatient_pageInfo {
  nextPageToken: string | null;
  previousPageToken: string | null;
}

export interface getCalendarEventsForPatient_calendarEventsForPatient {
  events: getCalendarEventsForPatient_calendarEventsForPatient_events[];
  pageInfo: getCalendarEventsForPatient_calendarEventsForPatient_pageInfo | null;
}

export interface getCalendarEventsForPatient {
  calendarEventsForPatient: getCalendarEventsForPatient_calendarEventsForPatient;  // List of google calendar events for a patient
}

export interface getCalendarEventsForPatientVariables {
  patientId: string;
  timeMin: string;
  pageSize: number;
  pageToken?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCalendarForCurrentUser
// ====================================================

export interface getCalendarForCurrentUser_calendarForCurrentUser {
  googleCalendarId: string;
  googleCalendarUrl: string | null;
}

export interface getCalendarForCurrentUser {
  calendarForCurrentUser: getCalendarForCurrentUser_calendarForCurrentUser;  // Google calendar id and url for the current user
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCalendarForPatient
// ====================================================

export interface getCalendarForPatient_calendarForPatient {
  patientId: string;
  googleCalendarId: string | null;
  googleCalendarUrl: string | null;
}

export interface getCalendarForPatient {
  calendarForPatient: getCalendarForPatient_calendarForPatient;  // Google calendar id and url for a patient calendar
}

export interface getCalendarForPatientVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCarePlanSuggestionsFromComputedFieldsForPatient
// ====================================================

export interface getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_patient_patientInfo;
  patientState: getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_patient_patientState;
}

export interface getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_concern_diagnosisCodes[] | null;
}

export interface getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_goalSuggestionTemplate_taskTemplates {
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

export interface getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_computedField_riskArea {
  id: string;
  title: string;
}

export interface getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_computedField {
  id: string;
  label: string;
  riskArea: getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_computedField_riskArea;
}

export interface getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_riskArea {
  id: string;
  title: string;
}

export interface getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_screeningTool {
  id: string;
  title: string;
}

export interface getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient {
  id: string;
  patientId: string;
  patient: getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
  computedField: getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_computedField | null;
  riskArea: getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_riskArea | null;
  screeningTool: getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient_screeningTool | null;
}

export interface getCarePlanSuggestionsFromComputedFieldsForPatient {
  carePlanSuggestionsFromComputedFieldsForPatient: getCarePlanSuggestionsFromComputedFieldsForPatient_carePlanSuggestionsFromComputedFieldsForPatient[];  // Care Plan Suggestions From Computed Fields
}

export interface getCarePlanSuggestionsFromComputedFieldsForPatientVariables {
  patientId: string;
  glassBreakId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient
// ====================================================

export interface getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_patient_patientInfo;
  patientState: getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_patient_patientState;
}

export interface getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_concern_diagnosisCodes[] | null;
}

export interface getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_goalSuggestionTemplate_taskTemplates {
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

export interface getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_computedField_riskArea {
  id: string;
  title: string;
}

export interface getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_computedField {
  id: string;
  label: string;
  riskArea: getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_computedField_riskArea;
}

export interface getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_riskArea {
  id: string;
  title: string;
}

export interface getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_screeningTool {
  id: string;
  title: string;
}

export interface getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient {
  id: string;
  patientId: string;
  patient: getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
  computedField: getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_computedField | null;
  riskArea: getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_riskArea | null;
  screeningTool: getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient_screeningTool | null;
}

export interface getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient {
  carePlanSuggestionsFromRiskAreaAssessmentsForPatient: getCarePlanSuggestionsFromRiskAreaAssessmentsForPatient_carePlanSuggestionsFromRiskAreaAssessmentsForPatient[];  // Care Plan Suggestions From Risk Area Assessments
}

export interface getCarePlanSuggestionsFromRiskAreaAssessmentsForPatientVariables {
  patientId: string;
  glassBreakId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCarePlanSuggestionsFromScreeningToolsForPatient
// ====================================================

export interface getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_patient_patientInfo;
  patientState: getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_patient_patientState;
}

export interface getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_concern_diagnosisCodes[] | null;
}

export interface getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_goalSuggestionTemplate_taskTemplates {
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

export interface getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_computedField_riskArea {
  id: string;
  title: string;
}

export interface getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_computedField {
  id: string;
  label: string;
  riskArea: getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_computedField_riskArea;
}

export interface getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_riskArea {
  id: string;
  title: string;
}

export interface getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_screeningTool {
  id: string;
  title: string;
}

export interface getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient {
  id: string;
  patientId: string;
  patient: getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
  computedField: getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_computedField | null;
  riskArea: getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_riskArea | null;
  screeningTool: getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient_screeningTool | null;
}

export interface getCarePlanSuggestionsFromScreeningToolsForPatient {
  carePlanSuggestionsFromScreeningToolsForPatient: getCarePlanSuggestionsFromScreeningToolsForPatient_carePlanSuggestionsFromScreeningToolsForPatient[];  // Care Plan Suggestions From Screening Tools
}

export interface getCarePlanSuggestionsFromScreeningToolsForPatientVariables {
  patientId: string;
  glassBreakId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCBOCategories
// ====================================================

export interface getCBOCategories_CBOCategories {
  id: string;
  title: string;
}

export interface getCBOCategories {
  CBOCategories: getCBOCategories_CBOCategories[];  // all CBO categories
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCBO
// ====================================================

export interface getCBO_CBO_category {
  id: string;
  title: string;
}

export interface getCBO_CBO {
  id: string;
  name: string;
  categoryId: string;
  category: getCBO_CBO_category;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
  createdAt: string;
}

export interface getCBO {
  CBO: getCBO_CBO;  // CBO
}

export interface getCBOVariables {
  CBOId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCBOsForCategory
// ====================================================

export interface getCBOsForCategory_CBOsForCategory_category {
  id: string;
  title: string;
}

export interface getCBOsForCategory_CBOsForCategory {
  id: string;
  name: string;
  categoryId: string;
  category: getCBOsForCategory_CBOsForCategory_category;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
  createdAt: string;
}

export interface getCBOsForCategory {
  CBOsForCategory: getCBOsForCategory_CBOsForCategory[];  // all CBOs for given category
}

export interface getCBOsForCategoryVariables {
  categoryId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCBOs
// ====================================================

export interface getCBOs_CBOs_category {
  id: string;
  title: string;
}

export interface getCBOs_CBOs {
  id: string;
  name: string;
  categoryId: string;
  category: getCBOs_CBOs_category;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
  createdAt: string;
}

export interface getCBOs {
  CBOs: getCBOs_CBOs[];  // all CBOs
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getClinics
// ====================================================

export interface getClinics_clinics_edges_node {
  id: string;
  name: string;
}

export interface getClinics_clinics_edges {
  node: getClinics_clinics_edges_node;
}

export interface getClinics_clinics {
  edges: getClinics_clinics_edges[];
}

export interface getClinics {
  clinics: getClinics_clinics;  // Clinics
}

export interface getClinicsVariables {
  pageNumber?: number | null;
  pageSize?: number | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getComputedField
// ====================================================

export interface getComputedField_computedField {
  id: string;
  label: string;
  slug: string;
  dataType: ComputedFieldDataTypes;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getComputedField {
  computedField: getComputedField_computedField;  // computed field
}

export interface getComputedFieldVariables {
  computedFieldId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getComputedFields
// ====================================================

export interface getComputedFields_computedFields {
  id: string;
  label: string;
  slug: string;
  dataType: ComputedFieldDataTypes;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getComputedFields {
  computedFields: (getComputedFields_computedFields | null)[];  // computed fields
}

export interface getComputedFieldsVariables {
  orderBy?: ComputedFieldOrderOptions | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getConcernSuggestionsForAnswer
// ====================================================

export interface getConcernSuggestionsForAnswer_concernsForAnswer_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getConcernSuggestionsForAnswer_concernsForAnswer {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getConcernSuggestionsForAnswer_concernsForAnswer_diagnosisCodes[] | null;
}

export interface getConcernSuggestionsForAnswer {
  concernsForAnswer: (getConcernSuggestionsForAnswer_concernsForAnswer | null)[];  // Concerns for answer
}

export interface getConcernSuggestionsForAnswerVariables {
  answerId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getConcern
// ====================================================

export interface getConcern_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getConcern_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getConcern_concern_diagnosisCodes[] | null;
}

export interface getConcern {
  concern: getConcern_concern;  // Concern
}

export interface getConcernVariables {
  concernId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getConcerns
// ====================================================

export interface getConcerns_concerns_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getConcerns_concerns {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getConcerns_concerns_diagnosisCodes[] | null;
}

export interface getConcerns {
  concerns: (getConcerns_concerns | null)[];  // Concerns
}

export interface getConcernsVariables {
  orderBy?: ConcernOrderOptions | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCurrentUserHours
// ====================================================

export interface getCurrentUserHours_currentUserHours {
  id: string;
  userId: string;
  weekday: number;
  startTime: number;
  endTime: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getCurrentUserHours {
  currentUserHours: getCurrentUserHours_currentUserHours[];  // get user hours for current user
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getCurrentUser
// ====================================================

export interface getCurrentUser_currentUser {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface getCurrentUser {
  currentUser: getCurrentUser_currentUser | null;  // The current User
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getEventNotificationsForCurrentUser
// ====================================================

export interface getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_edges_node_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_edges_node_taskEvent_task {
  id: string;
  title: string;
  priority: Priority | null;
  patientId: string;
  patientGoalId: string;
}

export interface getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_edges_node_taskEvent_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_edges_node_taskEvent_eventComment_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_edges_node_taskEvent_eventComment {
  id: string;
  body: string;
  user: getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_edges_node_taskEvent_eventComment_user;
  taskId: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_edges_node_taskEvent_eventUser {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_edges_node_taskEvent {
  id: string;
  taskId: string;
  task: getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_edges_node_taskEvent_task;
  userId: string;
  user: getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_edges_node_taskEvent_user;
  eventType: TaskEventTypes | null;
  eventCommentId: string | null;
  eventComment: getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_edges_node_taskEvent_eventComment | null;
  eventUserId: string | null;
  eventUser: getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_edges_node_taskEvent_eventUser | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_edges_node {
  id: string;
  title: string | null;
  userId: string;
  user: getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_edges_node_user;
  taskEvent: getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_edges_node_taskEvent | null;
  seenAt: string | null;
  emailSentAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_edges {
  node: getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_edges_node | null;
}

export interface getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser {
  edges: getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_edges[];
  pageInfo: getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser_pageInfo;
}

export interface getEventNotificationsForCurrentUser {
  eventNotificationsForCurrentUser: getEventNotificationsForCurrentUser_eventNotificationsForCurrentUser;  // Event notifications for a user
}

export interface getEventNotificationsForCurrentUserVariables {
  pageNumber?: number | null;
  pageSize?: number | null;
  taskEventNotificationsOnly?: boolean | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getEventNotificationsForUserTask
// ====================================================

export interface getEventNotificationsForUserTask_eventNotificationsForUserTask {
  id: string;
  title: string | null;
  createdAt: string;
}

export interface getEventNotificationsForUserTask {
  eventNotificationsForUserTask: getEventNotificationsForUserTask_eventNotificationsForUserTask[];  // Event notifications for a user's task - on dashboard
}

export interface getEventNotificationsForUserTaskVariables {
  taskId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getGoalSuggestionTemplate
// ====================================================

export interface getGoalSuggestionTemplate_goalSuggestionTemplate_taskTemplates {
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

export interface getGoalSuggestionTemplate_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: getGoalSuggestionTemplate_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getGoalSuggestionTemplate {
  goalSuggestionTemplate: getGoalSuggestionTemplate_goalSuggestionTemplate;  // Goal suggestion templates
}

export interface getGoalSuggestionTemplateVariables {
  goalSuggestionTemplateId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getGoalSuggestionTemplates
// ====================================================

export interface getGoalSuggestionTemplates_goalSuggestionTemplates_taskTemplates {
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

export interface getGoalSuggestionTemplates_goalSuggestionTemplates {
  id: string;
  title: string;
  taskTemplates: getGoalSuggestionTemplates_goalSuggestionTemplates_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getGoalSuggestionTemplates {
  goalSuggestionTemplates: (getGoalSuggestionTemplates_goalSuggestionTemplates | null)[];  // Goal suggestion templates
}

export interface getGoalSuggestionTemplatesVariables {
  orderBy?: GoalSuggestionOrderOptions | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getGoalSuggestionsForAnswer
// ====================================================

export interface getGoalSuggestionsForAnswer_goalSuggestionTemplatesForAnswer_taskTemplates {
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

export interface getGoalSuggestionsForAnswer_goalSuggestionTemplatesForAnswer {
  id: string;
  title: string;
  taskTemplates: getGoalSuggestionsForAnswer_goalSuggestionTemplatesForAnswer_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getGoalSuggestionsForAnswer {
  goalSuggestionTemplatesForAnswer: (getGoalSuggestionsForAnswer_goalSuggestionTemplatesForAnswer | null)[];  // Goal suggestion for template for answer
}

export interface getGoalSuggestionsForAnswerVariables {
  answerId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientAddresses
// ====================================================

export interface getPatientAddresses_patientAddresses {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface getPatientAddresses {
  patientAddresses: getPatientAddresses_patientAddresses[] | null;  // get all addresses for a patient
}

export interface getPatientAddressesVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientAnswers
// ====================================================

export interface getPatientAnswers_patientAnswers_answer_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getPatientAnswers_patientAnswers_answer_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getPatientAnswers_patientAnswers_answer_concernSuggestions_diagnosisCodes[] | null;
}

export interface getPatientAnswers_patientAnswers_answer_goalSuggestions_taskTemplates {
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

export interface getPatientAnswers_patientAnswers_answer_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: getPatientAnswers_patientAnswers_answer_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getPatientAnswers_patientAnswers_answer_riskArea {
  id: string;
  title: string;
}

export interface getPatientAnswers_patientAnswers_answer_screeningTool {
  id: string;
  title: string;
}

export interface getPatientAnswers_patientAnswers_answer {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: getPatientAnswers_patientAnswers_answer_concernSuggestions[] | null;
  goalSuggestions: (getPatientAnswers_patientAnswers_answer_goalSuggestions | null)[] | null;
  riskArea: getPatientAnswers_patientAnswers_answer_riskArea | null;
  screeningTool: getPatientAnswers_patientAnswers_answer_screeningTool | null;
}

export interface getPatientAnswers_patientAnswers_question {
  id: string;
  title: string;
  answerType: AnswerTypeOptions;
}

export interface getPatientAnswers_patientAnswers {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  answerId: string;
  answer: getPatientAnswers_patientAnswers_answer;
  answerValue: string;
  patientId: string;
  applicable: boolean | null;
  question: getPatientAnswers_patientAnswers_question | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface getPatientAnswers {
  patientAnswers: getPatientAnswers_patientAnswers[];  // PatientAnswersForQuestion
}

export interface getPatientAnswersVariables {
  filterType: AnswerFilterType;
  filterId: string;
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientCarePlan
// ====================================================

export interface getPatientCarePlan_carePlanForPatient_concerns_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getPatientCarePlan_carePlanForPatient_concerns_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getPatientCarePlan_carePlanForPatient_concerns_concern_diagnosisCodes[] | null;
}

export interface getPatientCarePlan_carePlanForPatient_concerns_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientCarePlan_carePlanForPatient_concerns_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientCarePlan_carePlanForPatient_concerns_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getPatientCarePlan_carePlanForPatient_concerns_patient_patientInfo;
  patientState: getPatientCarePlan_carePlanForPatient_concerns_patient_patientState;
}

export interface getPatientCarePlan_carePlanForPatient_concerns_patientGoals_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientCarePlan_carePlanForPatient_concerns_patientGoals_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientCarePlan_carePlanForPatient_concerns_patientGoals_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getPatientCarePlan_carePlanForPatient_concerns_patientGoals_patient_patientInfo;
  patientState: getPatientCarePlan_carePlanForPatient_concerns_patientGoals_patient_patientState;
}

export interface getPatientCarePlan_carePlanForPatient_concerns_patientGoals_tasks_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface getPatientCarePlan_carePlanForPatient_concerns_patientGoals_tasks_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface getPatientCarePlan_carePlanForPatient_concerns_patientGoals_tasks_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface getPatientCarePlan_carePlanForPatient_concerns_patientGoals_tasks {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  assignedTo: getPatientCarePlan_carePlanForPatient_concerns_patientGoals_tasks_assignedTo | null;
  assignedToId: string | null;
  followers: getPatientCarePlan_carePlanForPatient_concerns_patientGoals_tasks_followers[];
  createdBy: getPatientCarePlan_carePlanForPatient_concerns_patientGoals_tasks_createdBy;
}

export interface getPatientCarePlan_carePlanForPatient_concerns_patientGoals {
  id: string;
  title: string;
  patientId: string;
  patient: getPatientCarePlan_carePlanForPatient_concerns_patientGoals_patient;
  patientConcernId: string | null;
  goalSuggestionTemplateId: string | null;
  tasks: getPatientCarePlan_carePlanForPatient_concerns_patientGoals_tasks[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getPatientCarePlan_carePlanForPatient_concerns {
  id: string;
  order: number;
  concernId: string;
  concern: getPatientCarePlan_carePlanForPatient_concerns_concern;
  patientId: string;
  patient: getPatientCarePlan_carePlanForPatient_concerns_patient;
  patientGoals: getPatientCarePlan_carePlanForPatient_concerns_patientGoals[] | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getPatientCarePlan_carePlanForPatient_goals_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientCarePlan_carePlanForPatient_goals_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientCarePlan_carePlanForPatient_goals_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getPatientCarePlan_carePlanForPatient_goals_patient_patientInfo;
  patientState: getPatientCarePlan_carePlanForPatient_goals_patient_patientState;
}

export interface getPatientCarePlan_carePlanForPatient_goals_tasks_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface getPatientCarePlan_carePlanForPatient_goals_tasks_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface getPatientCarePlan_carePlanForPatient_goals_tasks_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface getPatientCarePlan_carePlanForPatient_goals_tasks {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  assignedTo: getPatientCarePlan_carePlanForPatient_goals_tasks_assignedTo | null;
  assignedToId: string | null;
  followers: getPatientCarePlan_carePlanForPatient_goals_tasks_followers[];
  createdBy: getPatientCarePlan_carePlanForPatient_goals_tasks_createdBy;
}

export interface getPatientCarePlan_carePlanForPatient_goals {
  id: string;
  title: string;
  patientId: string;
  patient: getPatientCarePlan_carePlanForPatient_goals_patient;
  patientConcernId: string | null;
  goalSuggestionTemplateId: string | null;
  tasks: getPatientCarePlan_carePlanForPatient_goals_tasks[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getPatientCarePlan_carePlanForPatient {
  concerns: getPatientCarePlan_carePlanForPatient_concerns[];
  goals: getPatientCarePlan_carePlanForPatient_goals[];
}

export interface getPatientCarePlan {
  carePlanForPatient: getPatientCarePlan_carePlanForPatient;  // Care Plan
}

export interface getPatientCarePlanVariables {
  patientId: string;
  glassBreakId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientCareTeam
// ====================================================

export interface getPatientCareTeam_patientCareTeam {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isCareTeamLead: boolean;
}

export interface getPatientCareTeam {
  patientCareTeam: getPatientCareTeam_patientCareTeam[];  // Users on a care team
}

export interface getPatientCareTeamVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientComputedPatientStatus
// ====================================================

export interface getPatientComputedPatientStatus_patientComputedPatientStatus {
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

export interface getPatientComputedPatientStatus {
  patientComputedPatientStatus: getPatientComputedPatientStatus_patientComputedPatientStatus;  // computed patient status for a patient
}

export interface getPatientComputedPatientStatusVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientContactHealthcareProxies
// ====================================================

export interface getPatientContactHealthcareProxies_patientContactHealthcareProxies_address {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface getPatientContactHealthcareProxies_patientContactHealthcareProxies_email {
  id: string;
  emailAddress: string;
}

export interface getPatientContactHealthcareProxies_patientContactHealthcareProxies_phone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
}

export interface getPatientContactHealthcareProxies_patientContactHealthcareProxies {
  id: string;
  patientId: string;
  relationToPatient: PatientRelationOptions;
  relationFreeText: string | null;
  firstName: string;
  lastName: string;
  isEmergencyContact: boolean;
  isHealthcareProxy: boolean;
  description: string | null;
  address: getPatientContactHealthcareProxies_patientContactHealthcareProxies_address | null;
  email: getPatientContactHealthcareProxies_patientContactHealthcareProxies_email | null;
  phone: getPatientContactHealthcareProxies_patientContactHealthcareProxies_phone;
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

export interface getPatientContactHealthcareProxies {
  patientContactHealthcareProxies: getPatientContactHealthcareProxies_patientContactHealthcareProxies[] | null;  // Patient contact healthcare proxies
}

export interface getPatientContactHealthcareProxiesVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientContacts
// ====================================================

export interface getPatientContacts_patientContacts_address {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface getPatientContacts_patientContacts_email {
  id: string;
  emailAddress: string;
}

export interface getPatientContacts_patientContacts_phone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
}

export interface getPatientContacts_patientContacts {
  id: string;
  patientId: string;
  relationToPatient: PatientRelationOptions;
  relationFreeText: string | null;
  firstName: string;
  lastName: string;
  isEmergencyContact: boolean;
  isHealthcareProxy: boolean;
  description: string | null;
  address: getPatientContacts_patientContacts_address | null;
  email: getPatientContacts_patientContacts_email | null;
  phone: getPatientContacts_patientContacts_phone;
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

export interface getPatientContacts {
  patientContacts: getPatientContacts_patientContacts[] | null;  // Patient contacts for patient
}

export interface getPatientContactsVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientDocumentsByType
// ====================================================

export interface getPatientDocumentsByType_patientDocumentsByType_uploadedBy {
  firstName: string | null;
  lastName: string | null;
}

export interface getPatientDocumentsByType_patientDocumentsByType {
  id: string;
  patientId: string;
  uploadedBy: getPatientDocumentsByType_patientDocumentsByType_uploadedBy;
  filename: string;
  description: string | null;
  documentType: DocumentTypeOptions | null;
  createdAt: string;
}

export interface getPatientDocumentsByType {
  patientDocumentsByType: getPatientDocumentsByType_patientDocumentsByType[];  // Patient documents by type
}

export interface getPatientDocumentsByTypeVariables {
  patientId: string;
  documentType: DocumentTypeOptions;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientDocuments
// ====================================================

export interface getPatientDocuments_patientDocuments_uploadedBy {
  firstName: string | null;
  lastName: string | null;
}

export interface getPatientDocuments_patientDocuments {
  id: string;
  patientId: string;
  uploadedBy: getPatientDocuments_patientDocuments_uploadedBy;
  filename: string;
  description: string | null;
  documentType: DocumentTypeOptions | null;
  createdAt: string;
}

export interface getPatientDocuments {
  patientDocuments: getPatientDocuments_patientDocuments[] | null;  // Patient documents for patient
}

export interface getPatientDocumentsVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientEmails
// ====================================================

export interface getPatientEmails_patientEmails {
  id: string;
  emailAddress: string;
  description: string | null;
}

export interface getPatientEmails {
  patientEmails: getPatientEmails_patientEmails[] | null;  // get all emails for a patient
}

export interface getPatientEmailsVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientEncounters
// ====================================================

export interface getPatientEncounters_patientEncounters {
  id: string;
  location: string | null;
  source: string | null;
  date: string;
  title: string | null;
  notes: string | null;
  progressNoteId: string | null;
}

export interface getPatientEncounters {
  patientEncounters: getPatientEncounters_patientEncounters[];  // gets patient encounters (external to Commons)
}

export interface getPatientEncountersVariables {
  patientId: string;
  glassBreakId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientExternalOrganizations
// ====================================================

export interface getPatientExternalOrganizations_patientExternalOrganizations_address {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface getPatientExternalOrganizations_patientExternalOrganizations {
  id: string;
  patientId: string;
  name: string;
  description: string | null;
  phoneNumber: string | null;
  faxNumber: string | null;
  address: getPatientExternalOrganizations_patientExternalOrganizations_address | null;
  isConsentedForSubstanceUse: boolean | null;
  isConsentedForHiv: boolean | null;
  isConsentedForStd: boolean | null;
  isConsentedForGeneticTesting: boolean | null;
  isConsentedForFamilyPlanning: boolean | null;
  isConsentedForMentalHealth: boolean | null;
  consentDocumentId: string | null;
}

export interface getPatientExternalOrganizations {
  patientExternalOrganizations: getPatientExternalOrganizations_patientExternalOrganizations[] | null;  // Patient external organizations for patient
}

export interface getPatientExternalOrganizationsVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientExternalProviders
// ====================================================

export interface getPatientExternalProviders_patientExternalProviders_patientExternalOrganization {
  id: string;
  name: string;
  isConsentedForSubstanceUse: boolean | null;
  isConsentedForHiv: boolean | null;
  isConsentedForStd: boolean | null;
  isConsentedForGeneticTesting: boolean | null;
  isConsentedForFamilyPlanning: boolean | null;
  consentDocumentId: string | null;
}

export interface getPatientExternalProviders_patientExternalProviders_email {
  id: string;
  emailAddress: string;
}

export interface getPatientExternalProviders_patientExternalProviders_phone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
}

export interface getPatientExternalProviders_patientExternalProviders {
  id: string;
  patientId: string;
  role: ExternalProviderOptions;
  roleFreeText: string | null;
  firstName: string | null;
  lastName: string | null;
  patientExternalOrganizationId: string;
  patientExternalOrganization: getPatientExternalProviders_patientExternalProviders_patientExternalOrganization;
  description: string | null;
  email: getPatientExternalProviders_patientExternalProviders_email | null;
  phone: getPatientExternalProviders_patientExternalProviders_phone;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface getPatientExternalProviders {
  patientExternalProviders: getPatientExternalProviders_patientExternalProviders[] | null;  // Patient external providers for patient
}

export interface getPatientExternalProvidersVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientGlassBreakCheck
// ====================================================

export interface getPatientGlassBreakCheck_patientGlassBreakCheck {
  patientId: string;
  isGlassBreakNotNeeded: boolean;
}

export interface getPatientGlassBreakCheck {
  patientGlassBreakCheck: getPatientGlassBreakCheck_patientGlassBreakCheck;  // check if don't need to break glass for given patient
}

export interface getPatientGlassBreakCheckVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientGlassBreaksForUser
// ====================================================

export interface getPatientGlassBreaksForUser_patientGlassBreaksForUser {
  id: string;
  patientId: string;
}

export interface getPatientGlassBreaksForUser {
  patientGlassBreaksForUser: getPatientGlassBreaksForUser_patientGlassBreaksForUser[];  // patient glass breaks for user during current session
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientList
// ====================================================

export interface getPatientList_patientList {
  id: string;
  title: string;
  answerId: string;
  order: number;
  createdAt: string;
}

export interface getPatientList {
  patientList: getPatientList_patientList;  // patient list
}

export interface getPatientListVariables {
  patientListId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientLists
// ====================================================

export interface getPatientLists_patientLists {
  id: string;
  title: string;
  answerId: string;
  order: number;
  createdAt: string;
}

export interface getPatientLists {
  patientLists: getPatientLists_patientLists[];  // all patient lists
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientMedications
// ====================================================

export interface getPatientMedications_patientMedications {
  id: string;
  name: string;
  dosage: string;
}

export interface getPatientMedications {
  patientMedications: getPatientMedications_patientMedications[];  // gets patient medications
}

export interface getPatientMedicationsVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientNeedToKnow
// ====================================================

export interface getPatientNeedToKnow_patientNeedToKnow {
  text: string | null;
}

export interface getPatientNeedToKnow {
  patientNeedToKnow: getPatientNeedToKnow_patientNeedToKnow;  // Patient need to know
}

export interface getPatientNeedToKnowVariables {
  patientInfoId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientPanel
// ====================================================

export interface getPatientPanel_patientPanel_edges_node_patientInfo_primaryAddress {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface getPatientPanel_patientPanel_edges_node_patientInfo {
  gender: Gender | null;
  primaryAddress: getPatientPanel_patientPanel_edges_node_patientInfo_primaryAddress | null;
}

export interface getPatientPanel_patientPanel_edges_node_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientPanel_patientPanel_edges_node {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  cityblockId: number;
  userCareTeam: boolean | null;
  patientInfo: getPatientPanel_patientPanel_edges_node_patientInfo;
  patientState: getPatientPanel_patientPanel_edges_node_patientState;
}

export interface getPatientPanel_patientPanel_edges {
  node: getPatientPanel_patientPanel_edges_node | null;
}

export interface getPatientPanel_patientPanel_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getPatientPanel_patientPanel {
  edges: getPatientPanel_patientPanel_edges[];
  pageInfo: getPatientPanel_patientPanel_pageInfo;
  totalCount: number;
}

export interface getPatientPanel {
  patientPanel: getPatientPanel_patientPanel;  // Patients filtered by options
}

export interface getPatientPanelVariables {
  pageNumber: number;
  pageSize: number;
  filters: PatientFilterOptions;
  showAllPatients?: boolean | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientPhones
// ====================================================

export interface getPatientPhones_patientPhones {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
  description: string | null;
}

export interface getPatientPhones {
  patientPhones: getPatientPhones_patientPhones[] | null;  // get all phones for a patient
}

export interface getPatientPhonesVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientProblemList
// ====================================================

export interface getPatientProblemList_patientProblemList {
  id: string;
  name: string;
  code: string;
}

export interface getPatientProblemList {
  patientProblemList: getPatientProblemList_patientProblemList[];  // gets a patient problem list
}

export interface getPatientProblemListVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientRiskScoreForRiskArea
// ====================================================

export interface getPatientRiskScoreForRiskArea_patientRiskAreaRiskScore {
  score: number;
  forceHighRisk: boolean;
}

export interface getPatientRiskScoreForRiskArea {
  patientRiskAreaRiskScore: getPatientRiskScoreForRiskArea_patientRiskAreaRiskScore;  // PatientRiskAreaRiskScore
}

export interface getPatientRiskScoreForRiskAreaVariables {
  riskAreaId: string;
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientRiskSummaryForRiskArea
// ====================================================

export interface getPatientRiskSummaryForRiskArea_patientRiskAreaSummary {
  summary: string[];
  started: boolean;
  lastUpdated: string | null;
}

export interface getPatientRiskSummaryForRiskArea {
  patientRiskAreaSummary: getPatientRiskSummaryForRiskArea_patientRiskAreaSummary;  // PatientRiskAreaSummary
}

export interface getPatientRiskSummaryForRiskAreaVariables {
  riskAreaId: string;
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientScratchPad
// ====================================================

export interface getPatientScratchPad_patientScratchPad {
  id: string;
  patientId: string;
  userId: string;
  body: string;
}

export interface getPatientScratchPad {
  patientScratchPad: getPatientScratchPad_patientScratchPad;  // gets a patient scratch pad for given user and patient
}

export interface getPatientScratchPadVariables {
  patientId: string;
  glassBreakId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientScreeningToolSubmissionForPatientAndScreeningTool
// ====================================================

export interface getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_screeningTool {
  id: string;
  title: string;
  riskAreaId: string;
}

export interface getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_patient_patientInfo;
  patientState: getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_patient_patientState;
}

export interface getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_user {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions_patient_patientInfo;
  patientState: getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions_patient_patientState;
}

export interface getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions_concern_diagnosisCodes[] | null;
}

export interface getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions_goalSuggestionTemplate_taskTemplates {
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

export interface getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions {
  id: string;
  patientId: string;
  patient: getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_screeningToolScoreRange {
  id: string;
  description: string;
}

export interface getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool {
  id: string;
  screeningToolId: string;
  screeningTool: getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_screeningTool;
  patientId: string;
  patient: getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_patient;
  userId: string;
  user: getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_user;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  scoredAt: string | null;
  carePlanSuggestions: getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_carePlanSuggestions[];
  screeningToolScoreRangeId: string | null;
  screeningToolScoreRange: getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool_screeningToolScoreRange | null;
}

export interface getPatientScreeningToolSubmissionForPatientAndScreeningTool {
  patientScreeningToolSubmissionForPatientAndScreeningTool: getPatientScreeningToolSubmissionForPatientAndScreeningTool_patientScreeningToolSubmissionForPatientAndScreeningTool | null;  // latest patient sreening tool submission for a screening tool
}

export interface getPatientScreeningToolSubmissionForPatientAndScreeningToolVariables {
  screeningToolId: string;
  patientId: string;
  scored: boolean;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientScreeningToolSubmissionsFor360
// ====================================================

export interface getPatientScreeningToolSubmissionsFor360_patientScreeningToolSubmissionsFor360_user {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

export interface getPatientScreeningToolSubmissionsFor360_patientScreeningToolSubmissionsFor360_screeningTool {
  id: string;
  title: string;
  riskAreaId: string;
}

export interface getPatientScreeningToolSubmissionsFor360_patientScreeningToolSubmissionsFor360_screeningToolScoreRange {
  id: string;
  description: string;
  riskAdjustmentType: RiskAdjustmentTypeOptions;
}

export interface getPatientScreeningToolSubmissionsFor360_patientScreeningToolSubmissionsFor360 {
  id: string;
  score: number | null;
  createdAt: string;
  user: getPatientScreeningToolSubmissionsFor360_patientScreeningToolSubmissionsFor360_user;
  screeningTool: getPatientScreeningToolSubmissionsFor360_patientScreeningToolSubmissionsFor360_screeningTool;
  screeningToolScoreRange: getPatientScreeningToolSubmissionsFor360_patientScreeningToolSubmissionsFor360_screeningToolScoreRange | null;
}

export interface getPatientScreeningToolSubmissionsFor360 {
  patientScreeningToolSubmissionsFor360: getPatientScreeningToolSubmissionsFor360_patientScreeningToolSubmissionsFor360[];  // patient screening tool submissions for patient 360 (history tab)
}

export interface getPatientScreeningToolSubmissionsFor360Variables {
  patientId: string;
  glassBreakId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientScreeningToolSubmission
// ====================================================

export interface getPatientScreeningToolSubmission_patientScreeningToolSubmission_screeningTool {
  id: string;
  title: string;
  riskAreaId: string;
}

export interface getPatientScreeningToolSubmission_patientScreeningToolSubmission_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientScreeningToolSubmission_patientScreeningToolSubmission_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientScreeningToolSubmission_patientScreeningToolSubmission_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getPatientScreeningToolSubmission_patientScreeningToolSubmission_patient_patientInfo;
  patientState: getPatientScreeningToolSubmission_patientScreeningToolSubmission_patient_patientState;
}

export interface getPatientScreeningToolSubmission_patientScreeningToolSubmission_user {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions_patient_patientInfo;
  patientState: getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions_patient_patientState;
}

export interface getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions_concern_diagnosisCodes[] | null;
}

export interface getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions_goalSuggestionTemplate_taskTemplates {
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

export interface getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions {
  id: string;
  patientId: string;
  patient: getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface getPatientScreeningToolSubmission_patientScreeningToolSubmission_screeningToolScoreRange {
  id: string;
  description: string;
}

export interface getPatientScreeningToolSubmission_patientScreeningToolSubmission {
  id: string;
  screeningToolId: string;
  screeningTool: getPatientScreeningToolSubmission_patientScreeningToolSubmission_screeningTool;
  patientId: string;
  patient: getPatientScreeningToolSubmission_patientScreeningToolSubmission_patient;
  userId: string;
  user: getPatientScreeningToolSubmission_patientScreeningToolSubmission_user;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  scoredAt: string | null;
  carePlanSuggestions: getPatientScreeningToolSubmission_patientScreeningToolSubmission_carePlanSuggestions[];
  screeningToolScoreRangeId: string | null;
  screeningToolScoreRange: getPatientScreeningToolSubmission_patientScreeningToolSubmission_screeningToolScoreRange | null;
}

export interface getPatientScreeningToolSubmission {
  patientScreeningToolSubmission: getPatientScreeningToolSubmission_patientScreeningToolSubmission;  // patient screening tool submission
}

export interface getPatientScreeningToolSubmissionVariables {
  patientScreeningToolSubmissionId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientSearch
// ====================================================

export interface getPatientSearch_patientSearch_edges_node_patientInfo_primaryAddress {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface getPatientSearch_patientSearch_edges_node_patientInfo {
  gender: Gender | null;
  primaryAddress: getPatientSearch_patientSearch_edges_node_patientInfo_primaryAddress | null;
}

export interface getPatientSearch_patientSearch_edges_node_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientSearch_patientSearch_edges_node {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  cityblockId: number;
  userCareTeam: boolean | null;
  patientInfo: getPatientSearch_patientSearch_edges_node_patientInfo;
  patientState: getPatientSearch_patientSearch_edges_node_patientState;
}

export interface getPatientSearch_patientSearch_edges {
  node: getPatientSearch_patientSearch_edges_node | null;
}

export interface getPatientSearch_patientSearch_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getPatientSearch_patientSearch {
  edges: getPatientSearch_patientSearch_edges[];
  pageInfo: getPatientSearch_patientSearch_pageInfo;
  totalCount: number;
}

export interface getPatientSearch {
  patientSearch: getPatientSearch_patientSearch;  // Patient search
}

export interface getPatientSearchVariables {
  query: string;
  pageNumber: number;
  pageSize: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientSocialSecurity
// ====================================================

export interface getPatientSocialSecurity_patientSocialSecurity {
  id: string;
  ssn: string | null;
}

export interface getPatientSocialSecurity {
  patientSocialSecurity: getPatientSocialSecurity_patientSocialSecurity;  // gets a patients full social security number and records a log of the view by user
}

export interface getPatientSocialSecurityVariables {
  patientId: string;
  glassBreakId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientTasks
// ====================================================

export interface getPatientTasks_tasksForPatient_edges_node_patient_patientInfo {
  id: string;
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientTasks_tasksForPatient_edges_node_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  patientInfo: getPatientTasks_tasksForPatient_edges_node_patient_patientInfo;
}

export interface getPatientTasks_tasksForPatient_edges_node_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getPatientTasks_tasksForPatient_edges_node_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getPatientTasks_tasksForPatient_edges_node_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getPatientTasks_tasksForPatient_edges_node_patientGoal_patientConcern_concern {
  id: string;
  title: string;
}

export interface getPatientTasks_tasksForPatient_edges_node_patientGoal_patientConcern {
  concern: getPatientTasks_tasksForPatient_edges_node_patientGoal_patientConcern_concern;
}

export interface getPatientTasks_tasksForPatient_edges_node_patientGoal {
  id: string;
  title: string;
  patientConcern: getPatientTasks_tasksForPatient_edges_node_patientGoal_patientConcern | null;
}

export interface getPatientTasks_tasksForPatient_edges_node_CBOReferral_category {
  id: string;
  title: string;
}

export interface getPatientTasks_tasksForPatient_edges_node_CBOReferral_CBO {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
}

export interface getPatientTasks_tasksForPatient_edges_node_CBOReferral {
  id: string;
  categoryId: string;
  category: getPatientTasks_tasksForPatient_edges_node_CBOReferral_category;
  CBOId: string | null;
  CBO: getPatientTasks_tasksForPatient_edges_node_CBOReferral_CBO | null;
  name: string | null;
  url: string | null;
  diagnosis: string | null;
  sentAt: string | null;
  acknowledgedAt: string | null;
}

export interface getPatientTasks_tasksForPatient_edges_node {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  patient: getPatientTasks_tasksForPatient_edges_node_patient;
  assignedToId: string | null;
  assignedTo: getPatientTasks_tasksForPatient_edges_node_assignedTo | null;
  followers: getPatientTasks_tasksForPatient_edges_node_followers[];
  createdBy: getPatientTasks_tasksForPatient_edges_node_createdBy;
  patientGoal: getPatientTasks_tasksForPatient_edges_node_patientGoal;
  CBOReferralId: string | null;
  CBOReferral: getPatientTasks_tasksForPatient_edges_node_CBOReferral | null;
}

export interface getPatientTasks_tasksForPatient_edges {
  node: getPatientTasks_tasksForPatient_edges_node | null;
}

export interface getPatientTasks_tasksForPatient_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getPatientTasks_tasksForPatient {
  edges: getPatientTasks_tasksForPatient_edges[];
  pageInfo: getPatientTasks_tasksForPatient_pageInfo;
}

export interface getPatientTasks {
  tasksForPatient: getPatientTasks_tasksForPatient;  // Patient's Tasks
}

export interface getPatientTasksVariables {
  patientId: string;
  pageNumber?: number | null;
  pageSize?: number | null;
  orderBy?: TaskOrderOptions | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatient
// ====================================================

export interface getPatient_patient_patientInfo_primaryAddress {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface getPatient_patient_patientInfo_primaryEmail {
  id: string;
  emailAddress: string;
  description: string | null;
}

export interface getPatient_patient_patientInfo_primaryPhone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
  description: string | null;
}

export interface getPatient_patient_patientInfo {
  id: string;
  preferredName: string | null;
  gender: Gender | null;
  genderFreeText: string | null;
  transgender: Transgender | null;
  maritalStatus: MaritalStatus | null;
  language: string | null;
  isMarginallyHoused: boolean | null;
  primaryAddress: getPatient_patient_patientInfo_primaryAddress | null;
  hasEmail: boolean | null;
  primaryEmail: getPatient_patient_patientInfo_primaryEmail | null;
  primaryPhone: getPatient_patient_patientInfo_primaryPhone | null;
  preferredContactMethod: ContactMethodOptions | null;
  preferredContactTime: ContactTimeOptions | null;
  canReceiveCalls: boolean | null;
  hasHealthcareProxy: boolean | null;
  hasMolst: boolean | null;
  hasDeclinedPhotoUpload: boolean | null;
  hasUploadedPhoto: boolean | null;
  googleCalendarId: string | null;
}

export interface getPatient_patient_patientDataFlags {
  id: string;
  patientId: string;
  userId: string;
  fieldName: CoreIdentityOptions;
  suggestedValue: string | null;
  notes: string | null;
  updatedAt: string | null;
}

export interface getPatient_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatient_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  cityblockId: number;
  dateOfBirth: string | null;
  ssnEnd: string | null;
  nmi: string | null;
  mrn: string | null;
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
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  coreIdentityVerifiedById: string | null;
  patientInfo: getPatient_patient_patientInfo;
  patientDataFlags: getPatient_patient_patientDataFlags[] | null;
  patientState: getPatient_patient_patientState;
}

export interface getPatient {
  patient: getPatient_patient;  // A single Patient
}

export interface getPatientVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientsForComputedList
// ====================================================

export interface getPatientsForComputedList_patientsForComputedList_edges_node_patientInfo {
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientsForComputedList_patientsForComputedList_edges_node_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientsForComputedList_patientsForComputedList_edges_node_computedPatientStatus {
  isCoreIdentityVerified: boolean;
  isDemographicInfoUpdated: boolean;
  isEmergencyContactAdded: boolean;
  isAdvancedDirectivesAdded: boolean;
  isConsentSigned: boolean;
  isPhotoAddedOrDeclined: boolean;
}

export interface getPatientsForComputedList_patientsForComputedList_edges_node {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  cityblockId: number;
  patientInfo: getPatientsForComputedList_patientsForComputedList_edges_node_patientInfo;
  patientState: getPatientsForComputedList_patientsForComputedList_edges_node_patientState;
  computedPatientStatus: getPatientsForComputedList_patientsForComputedList_edges_node_computedPatientStatus;
}

export interface getPatientsForComputedList_patientsForComputedList_edges {
  node: getPatientsForComputedList_patientsForComputedList_edges_node | null;
}

export interface getPatientsForComputedList_patientsForComputedList_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getPatientsForComputedList_patientsForComputedList {
  edges: getPatientsForComputedList_patientsForComputedList_edges[];
  pageInfo: getPatientsForComputedList_patientsForComputedList_pageInfo;
  totalCount: number;
}

export interface getPatientsForComputedList {
  patientsForComputedList: getPatientsForComputedList_patientsForComputedList;  // Patient dashboard - computed list for answer
}

export interface getPatientsForComputedListVariables {
  answerId: string;
  pageNumber: number;
  pageSize: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientsNewToCareTeam
// ====================================================

export interface getPatientsNewToCareTeam_patientsNewToCareTeam_edges_node_patientInfo {
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientsNewToCareTeam_patientsNewToCareTeam_edges_node_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientsNewToCareTeam_patientsNewToCareTeam_edges_node_computedPatientStatus {
  isCoreIdentityVerified: boolean;
  isDemographicInfoUpdated: boolean;
  isEmergencyContactAdded: boolean;
  isAdvancedDirectivesAdded: boolean;
  isConsentSigned: boolean;
  isPhotoAddedOrDeclined: boolean;
}

export interface getPatientsNewToCareTeam_patientsNewToCareTeam_edges_node {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  cityblockId: number;
  patientInfo: getPatientsNewToCareTeam_patientsNewToCareTeam_edges_node_patientInfo;
  patientState: getPatientsNewToCareTeam_patientsNewToCareTeam_edges_node_patientState;
  computedPatientStatus: getPatientsNewToCareTeam_patientsNewToCareTeam_edges_node_computedPatientStatus;
}

export interface getPatientsNewToCareTeam_patientsNewToCareTeam_edges {
  node: getPatientsNewToCareTeam_patientsNewToCareTeam_edges_node | null;
}

export interface getPatientsNewToCareTeam_patientsNewToCareTeam_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getPatientsNewToCareTeam_patientsNewToCareTeam {
  edges: getPatientsNewToCareTeam_patientsNewToCareTeam_edges[];
  pageInfo: getPatientsNewToCareTeam_patientsNewToCareTeam_pageInfo;
  totalCount: number;
}

export interface getPatientsNewToCareTeam {
  patientsNewToCareTeam: getPatientsNewToCareTeam_patientsNewToCareTeam;  // Patient dashboard - new to user care team
}

export interface getPatientsNewToCareTeamVariables {
  pageNumber: number;
  pageSize: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientsWithAssignedState
// ====================================================

export interface getPatientsWithAssignedState_patientsWithAssignedState_edges_node_patientInfo {
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientsWithAssignedState_patientsWithAssignedState_edges_node_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientsWithAssignedState_patientsWithAssignedState_edges_node_computedPatientStatus {
  isCoreIdentityVerified: boolean;
  isDemographicInfoUpdated: boolean;
  isEmergencyContactAdded: boolean;
  isAdvancedDirectivesAdded: boolean;
  isConsentSigned: boolean;
  isPhotoAddedOrDeclined: boolean;
}

export interface getPatientsWithAssignedState_patientsWithAssignedState_edges_node {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  cityblockId: number;
  patientInfo: getPatientsWithAssignedState_patientsWithAssignedState_edges_node_patientInfo;
  patientState: getPatientsWithAssignedState_patientsWithAssignedState_edges_node_patientState;
  computedPatientStatus: getPatientsWithAssignedState_patientsWithAssignedState_edges_node_computedPatientStatus;
}

export interface getPatientsWithAssignedState_patientsWithAssignedState_edges {
  node: getPatientsWithAssignedState_patientsWithAssignedState_edges_node | null;
}

export interface getPatientsWithAssignedState_patientsWithAssignedState_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getPatientsWithAssignedState_patientsWithAssignedState {
  edges: getPatientsWithAssignedState_patientsWithAssignedState_edges[];
  pageInfo: getPatientsWithAssignedState_patientsWithAssignedState_pageInfo;
  totalCount: number;
}

export interface getPatientsWithAssignedState {
  patientsWithAssignedState: getPatientsWithAssignedState_patientsWithAssignedState;  // Patient dashboard - assigned state
}

export interface getPatientsWithAssignedStateVariables {
  pageNumber: number;
  pageSize: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientsWithIntakeInProgress
// ====================================================

export interface getPatientsWithIntakeInProgress_patientsWithIntakeInProgress_edges_node_patientInfo {
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientsWithIntakeInProgress_patientsWithIntakeInProgress_edges_node_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientsWithIntakeInProgress_patientsWithIntakeInProgress_edges_node_computedPatientStatus {
  isCoreIdentityVerified: boolean;
  isDemographicInfoUpdated: boolean;
  isEmergencyContactAdded: boolean;
  isAdvancedDirectivesAdded: boolean;
  isConsentSigned: boolean;
  isPhotoAddedOrDeclined: boolean;
}

export interface getPatientsWithIntakeInProgress_patientsWithIntakeInProgress_edges_node {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  cityblockId: number;
  patientInfo: getPatientsWithIntakeInProgress_patientsWithIntakeInProgress_edges_node_patientInfo;
  patientState: getPatientsWithIntakeInProgress_patientsWithIntakeInProgress_edges_node_patientState;
  computedPatientStatus: getPatientsWithIntakeInProgress_patientsWithIntakeInProgress_edges_node_computedPatientStatus;
}

export interface getPatientsWithIntakeInProgress_patientsWithIntakeInProgress_edges {
  node: getPatientsWithIntakeInProgress_patientsWithIntakeInProgress_edges_node | null;
}

export interface getPatientsWithIntakeInProgress_patientsWithIntakeInProgress_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getPatientsWithIntakeInProgress_patientsWithIntakeInProgress {
  edges: getPatientsWithIntakeInProgress_patientsWithIntakeInProgress_edges[];
  pageInfo: getPatientsWithIntakeInProgress_patientsWithIntakeInProgress_pageInfo;
  totalCount: number;
}

export interface getPatientsWithIntakeInProgress {
  patientsWithIntakeInProgress: getPatientsWithIntakeInProgress_patientsWithIntakeInProgress;  // Patient dashboard - intake in progress
}

export interface getPatientsWithIntakeInProgressVariables {
  pageNumber: number;
  pageSize: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientsWithMissingInfo
// ====================================================

export interface getPatientsWithMissingInfo_patientsWithMissingInfo_edges_node_patientInfo {
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientsWithMissingInfo_patientsWithMissingInfo_edges_node_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientsWithMissingInfo_patientsWithMissingInfo_edges_node_computedPatientStatus {
  isCoreIdentityVerified: boolean;
  isDemographicInfoUpdated: boolean;
  isEmergencyContactAdded: boolean;
  isAdvancedDirectivesAdded: boolean;
  isConsentSigned: boolean;
  isPhotoAddedOrDeclined: boolean;
}

export interface getPatientsWithMissingInfo_patientsWithMissingInfo_edges_node {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  cityblockId: number;
  patientInfo: getPatientsWithMissingInfo_patientsWithMissingInfo_edges_node_patientInfo;
  patientState: getPatientsWithMissingInfo_patientsWithMissingInfo_edges_node_patientState;
  computedPatientStatus: getPatientsWithMissingInfo_patientsWithMissingInfo_edges_node_computedPatientStatus;
}

export interface getPatientsWithMissingInfo_patientsWithMissingInfo_edges {
  node: getPatientsWithMissingInfo_patientsWithMissingInfo_edges_node | null;
}

export interface getPatientsWithMissingInfo_patientsWithMissingInfo_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getPatientsWithMissingInfo_patientsWithMissingInfo {
  edges: getPatientsWithMissingInfo_patientsWithMissingInfo_edges[];
  pageInfo: getPatientsWithMissingInfo_patientsWithMissingInfo_pageInfo;
  totalCount: number;
}

export interface getPatientsWithMissingInfo {
  patientsWithMissingInfo: getPatientsWithMissingInfo_patientsWithMissingInfo;  // Patient dashboard - lacking demographic information
}

export interface getPatientsWithMissingInfoVariables {
  pageNumber: number;
  pageSize: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientsWithNoRecentEngagement
// ====================================================

export interface getPatientsWithNoRecentEngagement_patientsWithNoRecentEngagement_edges_node_patientInfo {
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientsWithNoRecentEngagement_patientsWithNoRecentEngagement_edges_node_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientsWithNoRecentEngagement_patientsWithNoRecentEngagement_edges_node_computedPatientStatus {
  isCoreIdentityVerified: boolean;
  isDemographicInfoUpdated: boolean;
  isEmergencyContactAdded: boolean;
  isAdvancedDirectivesAdded: boolean;
  isConsentSigned: boolean;
  isPhotoAddedOrDeclined: boolean;
}

export interface getPatientsWithNoRecentEngagement_patientsWithNoRecentEngagement_edges_node {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  cityblockId: number;
  patientInfo: getPatientsWithNoRecentEngagement_patientsWithNoRecentEngagement_edges_node_patientInfo;
  patientState: getPatientsWithNoRecentEngagement_patientsWithNoRecentEngagement_edges_node_patientState;
  computedPatientStatus: getPatientsWithNoRecentEngagement_patientsWithNoRecentEngagement_edges_node_computedPatientStatus;
}

export interface getPatientsWithNoRecentEngagement_patientsWithNoRecentEngagement_edges {
  node: getPatientsWithNoRecentEngagement_patientsWithNoRecentEngagement_edges_node | null;
}

export interface getPatientsWithNoRecentEngagement_patientsWithNoRecentEngagement_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getPatientsWithNoRecentEngagement_patientsWithNoRecentEngagement {
  edges: getPatientsWithNoRecentEngagement_patientsWithNoRecentEngagement_edges[];
  pageInfo: getPatientsWithNoRecentEngagement_patientsWithNoRecentEngagement_pageInfo;
  totalCount: number;
}

export interface getPatientsWithNoRecentEngagement {
  patientsWithNoRecentEngagement: getPatientsWithNoRecentEngagement_patientsWithNoRecentEngagement;  // Patient dashboard - no recent engagement
}

export interface getPatientsWithNoRecentEngagementVariables {
  pageNumber: number;
  pageSize: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientsWithOpenCBOReferrals
// ====================================================

export interface getPatientsWithOpenCBOReferrals_patientsWithOpenCBOReferrals_edges_node_patientInfo {
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientsWithOpenCBOReferrals_patientsWithOpenCBOReferrals_edges_node_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientsWithOpenCBOReferrals_patientsWithOpenCBOReferrals_edges_node_computedPatientStatus {
  isCoreIdentityVerified: boolean;
  isDemographicInfoUpdated: boolean;
  isEmergencyContactAdded: boolean;
  isAdvancedDirectivesAdded: boolean;
  isConsentSigned: boolean;
  isPhotoAddedOrDeclined: boolean;
}

export interface getPatientsWithOpenCBOReferrals_patientsWithOpenCBOReferrals_edges_node {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  cityblockId: number;
  patientInfo: getPatientsWithOpenCBOReferrals_patientsWithOpenCBOReferrals_edges_node_patientInfo;
  patientState: getPatientsWithOpenCBOReferrals_patientsWithOpenCBOReferrals_edges_node_patientState;
  computedPatientStatus: getPatientsWithOpenCBOReferrals_patientsWithOpenCBOReferrals_edges_node_computedPatientStatus;
}

export interface getPatientsWithOpenCBOReferrals_patientsWithOpenCBOReferrals_edges {
  node: getPatientsWithOpenCBOReferrals_patientsWithOpenCBOReferrals_edges_node | null;
}

export interface getPatientsWithOpenCBOReferrals_patientsWithOpenCBOReferrals_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getPatientsWithOpenCBOReferrals_patientsWithOpenCBOReferrals {
  edges: getPatientsWithOpenCBOReferrals_patientsWithOpenCBOReferrals_edges[];
  pageInfo: getPatientsWithOpenCBOReferrals_patientsWithOpenCBOReferrals_pageInfo;
  totalCount: number;
}

export interface getPatientsWithOpenCBOReferrals {
  patientsWithOpenCBOReferrals: getPatientsWithOpenCBOReferrals_patientsWithOpenCBOReferrals;  // Patient dashboard - open CBO referrals
}

export interface getPatientsWithOpenCBOReferralsVariables {
  pageNumber: number;
  pageSize: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientsWithOutOfDateMAP
// ====================================================

export interface getPatientsWithOutOfDateMAP_patientsWithOutOfDateMAP_edges_node_patientInfo {
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientsWithOutOfDateMAP_patientsWithOutOfDateMAP_edges_node_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientsWithOutOfDateMAP_patientsWithOutOfDateMAP_edges_node_computedPatientStatus {
  isCoreIdentityVerified: boolean;
  isDemographicInfoUpdated: boolean;
  isEmergencyContactAdded: boolean;
  isAdvancedDirectivesAdded: boolean;
  isConsentSigned: boolean;
  isPhotoAddedOrDeclined: boolean;
}

export interface getPatientsWithOutOfDateMAP_patientsWithOutOfDateMAP_edges_node {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  cityblockId: number;
  patientInfo: getPatientsWithOutOfDateMAP_patientsWithOutOfDateMAP_edges_node_patientInfo;
  patientState: getPatientsWithOutOfDateMAP_patientsWithOutOfDateMAP_edges_node_patientState;
  computedPatientStatus: getPatientsWithOutOfDateMAP_patientsWithOutOfDateMAP_edges_node_computedPatientStatus;
}

export interface getPatientsWithOutOfDateMAP_patientsWithOutOfDateMAP_edges {
  node: getPatientsWithOutOfDateMAP_patientsWithOutOfDateMAP_edges_node | null;
}

export interface getPatientsWithOutOfDateMAP_patientsWithOutOfDateMAP_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getPatientsWithOutOfDateMAP_patientsWithOutOfDateMAP {
  edges: getPatientsWithOutOfDateMAP_patientsWithOutOfDateMAP_edges[];
  pageInfo: getPatientsWithOutOfDateMAP_patientsWithOutOfDateMAP_pageInfo;
  totalCount: number;
}

export interface getPatientsWithOutOfDateMAP {
  patientsWithOutOfDateMAP: getPatientsWithOutOfDateMAP_patientsWithOutOfDateMAP;  // Patient dashboard - out of date MAP
}

export interface getPatientsWithOutOfDateMAPVariables {
  pageNumber: number;
  pageSize: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientsWithPendingSuggestions
// ====================================================

export interface getPatientsWithPendingSuggestions_patientsWithPendingSuggestions_edges_node_patientInfo {
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientsWithPendingSuggestions_patientsWithPendingSuggestions_edges_node_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientsWithPendingSuggestions_patientsWithPendingSuggestions_edges_node_computedPatientStatus {
  isCoreIdentityVerified: boolean;
  isDemographicInfoUpdated: boolean;
  isEmergencyContactAdded: boolean;
  isAdvancedDirectivesAdded: boolean;
  isConsentSigned: boolean;
  isPhotoAddedOrDeclined: boolean;
}

export interface getPatientsWithPendingSuggestions_patientsWithPendingSuggestions_edges_node {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  cityblockId: number;
  patientInfo: getPatientsWithPendingSuggestions_patientsWithPendingSuggestions_edges_node_patientInfo;
  patientState: getPatientsWithPendingSuggestions_patientsWithPendingSuggestions_edges_node_patientState;
  computedPatientStatus: getPatientsWithPendingSuggestions_patientsWithPendingSuggestions_edges_node_computedPatientStatus;
}

export interface getPatientsWithPendingSuggestions_patientsWithPendingSuggestions_edges {
  node: getPatientsWithPendingSuggestions_patientsWithPendingSuggestions_edges_node | null;
}

export interface getPatientsWithPendingSuggestions_patientsWithPendingSuggestions_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getPatientsWithPendingSuggestions_patientsWithPendingSuggestions {
  edges: getPatientsWithPendingSuggestions_patientsWithPendingSuggestions_edges[];
  pageInfo: getPatientsWithPendingSuggestions_patientsWithPendingSuggestions_pageInfo;
  totalCount: number;
}

export interface getPatientsWithPendingSuggestions {
  patientsWithPendingSuggestions: getPatientsWithPendingSuggestions_patientsWithPendingSuggestions;  // Patient dashboard - pending MAP suggestions
}

export interface getPatientsWithPendingSuggestionsVariables {
  pageNumber: number;
  pageSize: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientsWithRecentConversations
// ====================================================

export interface getPatientsWithRecentConversations_patientsWithRecentConversations_edges_node_patientInfo {
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientsWithRecentConversations_patientsWithRecentConversations_edges_node_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientsWithRecentConversations_patientsWithRecentConversations_edges_node_computedPatientStatus {
  isCoreIdentityVerified: boolean;
  isDemographicInfoUpdated: boolean;
  isEmergencyContactAdded: boolean;
  isAdvancedDirectivesAdded: boolean;
  isConsentSigned: boolean;
  isPhotoAddedOrDeclined: boolean;
}

export interface getPatientsWithRecentConversations_patientsWithRecentConversations_edges_node {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  cityblockId: number;
  patientInfo: getPatientsWithRecentConversations_patientsWithRecentConversations_edges_node_patientInfo;
  patientState: getPatientsWithRecentConversations_patientsWithRecentConversations_edges_node_patientState;
  computedPatientStatus: getPatientsWithRecentConversations_patientsWithRecentConversations_edges_node_computedPatientStatus;
}

export interface getPatientsWithRecentConversations_patientsWithRecentConversations_edges {
  node: getPatientsWithRecentConversations_patientsWithRecentConversations_edges_node | null;
}

export interface getPatientsWithRecentConversations_patientsWithRecentConversations_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getPatientsWithRecentConversations_patientsWithRecentConversations {
  edges: getPatientsWithRecentConversations_patientsWithRecentConversations_edges[];
  pageInfo: getPatientsWithRecentConversations_patientsWithRecentConversations_pageInfo;
  totalCount: number;
}

export interface getPatientsWithRecentConversations {
  patientsWithRecentConversations: getPatientsWithRecentConversations_patientsWithRecentConversations;  // Patient dashboard - recent conversations
}

export interface getPatientsWithRecentConversationsVariables {
  pageNumber: number;
  pageSize: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientsWithUrgentTasks
// ====================================================

export interface getPatientsWithUrgentTasks_patientsWithUrgentTasks_edges_node_patientInfo {
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface getPatientsWithUrgentTasks_patientsWithUrgentTasks_edges_node_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getPatientsWithUrgentTasks_patientsWithUrgentTasks_edges_node_computedPatientStatus {
  isCoreIdentityVerified: boolean;
  isDemographicInfoUpdated: boolean;
  isEmergencyContactAdded: boolean;
  isAdvancedDirectivesAdded: boolean;
  isConsentSigned: boolean;
  isPhotoAddedOrDeclined: boolean;
}

export interface getPatientsWithUrgentTasks_patientsWithUrgentTasks_edges_node {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  cityblockId: number;
  patientInfo: getPatientsWithUrgentTasks_patientsWithUrgentTasks_edges_node_patientInfo;
  patientState: getPatientsWithUrgentTasks_patientsWithUrgentTasks_edges_node_patientState;
  computedPatientStatus: getPatientsWithUrgentTasks_patientsWithUrgentTasks_edges_node_computedPatientStatus;
}

export interface getPatientsWithUrgentTasks_patientsWithUrgentTasks_edges {
  node: getPatientsWithUrgentTasks_patientsWithUrgentTasks_edges_node | null;
}

export interface getPatientsWithUrgentTasks_patientsWithUrgentTasks_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getPatientsWithUrgentTasks_patientsWithUrgentTasks {
  edges: getPatientsWithUrgentTasks_patientsWithUrgentTasks_edges[];
  pageInfo: getPatientsWithUrgentTasks_patientsWithUrgentTasks_pageInfo;
  totalCount: number;
}

export interface getPatientsWithUrgentTasks {
  patientsWithUrgentTasks: getPatientsWithUrgentTasks_patientsWithUrgentTasks;  // Patient dashboard - tasks due and notifications
}

export interface getPatientsWithUrgentTasksVariables {
  pageNumber: number;
  pageSize: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getProgressNoteActivityForProgressNote
// ====================================================

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_taskEvents_task {
  id: string;
  title: string;
  priority: Priority | null;
  patientId: string;
  patientGoalId: string;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_taskEvents_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_taskEvents_eventComment_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_taskEvents_eventComment {
  id: string;
  body: string;
  user: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_taskEvents_eventComment_user;
  taskId: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_taskEvents_eventUser {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_taskEvents {
  id: string;
  taskId: string;
  task: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_taskEvents_task;
  userId: string;
  user: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_taskEvents_user;
  eventType: TaskEventTypes | null;
  eventCommentId: string | null;
  eventComment: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_taskEvents_eventComment | null;
  eventUserId: string | null;
  eventUser: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_taskEvents_eventUser | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patient_patientInfo;
  patientState: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patient_patientState;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patientAnswer_answer_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patientAnswer_answer_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patientAnswer_answer_concernSuggestions_diagnosisCodes[] | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patientAnswer_answer_goalSuggestions_taskTemplates {
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

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patientAnswer_answer_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patientAnswer_answer_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patientAnswer_answer_riskArea {
  id: string;
  title: string;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patientAnswer_answer_screeningTool {
  id: string;
  title: string;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patientAnswer_answer {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patientAnswer_answer_concernSuggestions[] | null;
  goalSuggestions: (getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patientAnswer_answer_goalSuggestions | null)[] | null;
  riskArea: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patientAnswer_answer_riskArea | null;
  screeningTool: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patientAnswer_answer_screeningTool | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patientAnswer_question {
  id: string;
  title: string;
  answerType: AnswerTypeOptions;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patientAnswer {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  answerId: string;
  answer: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patientAnswer_answer;
  answerValue: string;
  patientId: string;
  applicable: boolean | null;
  question: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patientAnswer_question | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_previousPatientAnswer_answer_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_previousPatientAnswer_answer_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_previousPatientAnswer_answer_concernSuggestions_diagnosisCodes[] | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_previousPatientAnswer_answer_goalSuggestions_taskTemplates {
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

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_previousPatientAnswer_answer_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_previousPatientAnswer_answer_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_previousPatientAnswer_answer_riskArea {
  id: string;
  title: string;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_previousPatientAnswer_answer_screeningTool {
  id: string;
  title: string;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_previousPatientAnswer_answer {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_previousPatientAnswer_answer_concernSuggestions[] | null;
  goalSuggestions: (getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_previousPatientAnswer_answer_goalSuggestions | null)[] | null;
  riskArea: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_previousPatientAnswer_answer_riskArea | null;
  screeningTool: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_previousPatientAnswer_answer_screeningTool | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_previousPatientAnswer_question {
  id: string;
  title: string;
  answerType: AnswerTypeOptions;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_previousPatientAnswer {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  answerId: string;
  answer: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_previousPatientAnswer_answer;
  answerValue: string;
  patientId: string;
  applicable: boolean | null;
  question: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_previousPatientAnswer_question | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents {
  id: string;
  patientId: string;
  patient: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patient;
  userId: string;
  user: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_user;
  patientAnswerId: string;
  patientAnswer: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_patientAnswer;
  previousPatientAnswerId: string | null;
  previousPatientAnswer: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents_previousPatientAnswer | null;
  eventType: PatientAnswerEventTypes;
  progressNoteId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patient_patientInfo;
  patientState: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patient_patientState;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_concern_diagnosisCodes[] | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patient_patientInfo;
  patientState: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patient_patientState;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patientGoals_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patientGoals_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patientGoals_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patientGoals_patient_patientInfo;
  patientState: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patientGoals_patient_patientState;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patientGoals_tasks_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patientGoals_tasks_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patientGoals_tasks_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patientGoals_tasks {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  assignedTo: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patientGoals_tasks_assignedTo | null;
  assignedToId: string | null;
  followers: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patientGoals_tasks_followers[];
  createdBy: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patientGoals_tasks_createdBy;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patientGoals {
  id: string;
  title: string;
  patientId: string;
  patient: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patientGoals_patient;
  patientConcernId: string | null;
  goalSuggestionTemplateId: string | null;
  tasks: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patientGoals_tasks[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern {
  id: string;
  order: number;
  concernId: string;
  concern: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_concern;
  patientId: string;
  patient: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patient;
  patientGoals: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern_patientGoals[] | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientGoal_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientGoal_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientGoal_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientGoal_patient_patientInfo;
  patientState: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientGoal_patient_patientState;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientGoal_tasks_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientGoal_tasks_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientGoal_tasks_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientGoal_tasks {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  assignedTo: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientGoal_tasks_assignedTo | null;
  assignedToId: string | null;
  followers: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientGoal_tasks_followers[];
  createdBy: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientGoal_tasks_createdBy;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientGoal {
  id: string;
  title: string;
  patientId: string;
  patient: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientGoal_patient;
  patientConcernId: string | null;
  goalSuggestionTemplateId: string | null;
  tasks: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientGoal_tasks[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents {
  id: string;
  patientId: string;
  patient: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patient;
  userId: string;
  user: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_user;
  patientConcernId: string | null;
  patientConcern: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientConcern | null;
  patientGoalId: string | null;
  patientGoal: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents_patientGoal | null;
  eventType: CarePlanUpdateEventTypes;
  progressNoteId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_quickCallEvents_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_quickCallEvents {
  id: string;
  userId: string;
  user: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_quickCallEvents_user;
  progressNoteId: string;
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

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_screeningTool {
  id: string;
  title: string;
  riskAreaId: string;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_patient_patientInfo;
  patientState: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_patient_patientState;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_user {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions_patient_patientInfo;
  patientState: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions_patient_patientState;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions_concern_diagnosisCodes[] | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions_goalSuggestionTemplate_taskTemplates {
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

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions {
  id: string;
  patientId: string;
  patient: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_screeningToolScoreRange {
  id: string;
  description: string;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions {
  id: string;
  screeningToolId: string;
  screeningTool: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_screeningTool;
  patientId: string;
  patient: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_patient;
  userId: string;
  user: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_user;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  scoredAt: string | null;
  carePlanSuggestions: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_carePlanSuggestions[];
  screeningToolScoreRangeId: string | null;
  screeningToolScoreRange: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions_screeningToolScoreRange | null;
}

export interface getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote {
  taskEvents: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_taskEvents[];
  patientAnswerEvents: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientAnswerEvents[];
  carePlanUpdateEvents: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_carePlanUpdateEvents[];
  quickCallEvents: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_quickCallEvents[];
  patientScreeningToolSubmissions: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote_patientScreeningToolSubmissions[];
}

export interface getProgressNoteActivityForProgressNote {
  progressNoteActivityForProgressNote: getProgressNoteActivityForProgressNote_progressNoteActivityForProgressNote;  // progress note activities for progress note
}

export interface getProgressNoteActivityForProgressNoteVariables {
  progressNoteId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getProgressNoteGlassBreakCheck
// ====================================================

export interface getProgressNoteGlassBreakCheck_progressNoteGlassBreakCheck {
  progressNoteId: string;
  isGlassBreakNotNeeded: boolean;
}

export interface getProgressNoteGlassBreakCheck {
  progressNoteGlassBreakCheck: getProgressNoteGlassBreakCheck_progressNoteGlassBreakCheck;  // check if don't need to break glass for given progress note
}

export interface getProgressNoteGlassBreakCheckVariables {
  progressNoteId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getProgressNoteGlassBreaksForUser
// ====================================================

export interface getProgressNoteGlassBreaksForUser_progressNoteGlassBreaksForUser {
  id: string;
  progressNoteId: string;
}

export interface getProgressNoteGlassBreaksForUser {
  progressNoteGlassBreaksForUser: getProgressNoteGlassBreaksForUser_progressNoteGlassBreaksForUser[];  // progress note glass breaks for a user during current session
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getProgressNoteIdsForPatient
// ====================================================

export interface getProgressNoteIdsForPatient_progressNoteIdsForPatient {
  id: string;
  createdAt: string;
}

export interface getProgressNoteIdsForPatient {
  progressNoteIdsForPatient: getProgressNoteIdsForPatient_progressNoteIdsForPatient[];  // progress note ids for patient
}

export interface getProgressNoteIdsForPatientVariables {
  patientId: string;
  completed: boolean;
  glassBreakId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getProgressNoteLatestForPatient
// ====================================================

export interface getProgressNoteLatestForPatient_progressNoteLatestForPatient {
  id: string;
  worryScore: number | null;
}

export interface getProgressNoteLatestForPatient {
  progressNoteLatestForPatient: getProgressNoteLatestForPatient_progressNoteLatestForPatient | null;  // latest progress note for patient
}

export interface getProgressNoteLatestForPatientVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getProgressNoteTemplate
// ====================================================

export interface getProgressNoteTemplate_progressNoteTemplate {
  id: string;
  title: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface getProgressNoteTemplate {
  progressNoteTemplate: getProgressNoteTemplate_progressNoteTemplate;  // progress note template
}

export interface getProgressNoteTemplateVariables {
  progressNoteTemplateId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getProgressNoteTemplates
// ====================================================

export interface getProgressNoteTemplates_progressNoteTemplates {
  id: string;
  title: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface getProgressNoteTemplates {
  progressNoteTemplates: (getProgressNoteTemplates_progressNoteTemplates | null)[];  // progress note templates
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getProgressNote
// ====================================================

export interface getProgressNote_progressNote_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface getProgressNote_progressNote_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getProgressNote_progressNote_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getProgressNote_progressNote_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getProgressNote_progressNote_patient_patientInfo;
  patientState: getProgressNote_progressNote_patient_patientState;
}

export interface getProgressNote_progressNote_supervisor {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getProgressNote_progressNote_progressNoteTemplate {
  id: string;
  title: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface getProgressNote_progressNote {
  id: string;
  patientId: string;
  user: getProgressNote_progressNote_user;
  patient: getProgressNote_progressNote_patient;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  summary: string | null;
  memberConcern: string | null;
  startedAt: string | null;
  location: string | null;
  deletedAt: string | null;
  needsSupervisorReview: boolean | null;
  reviewedBySupervisorAt: string | null;
  supervisorNotes: string | null;
  supervisor: getProgressNote_progressNote_supervisor | null;
  progressNoteTemplate: getProgressNote_progressNote_progressNoteTemplate | null;
  worryScore: number | null;
}

export interface getProgressNote {
  progressNote: getProgressNote_progressNote;  // progress note
}

export interface getProgressNoteVariables {
  progressNoteId: string;
  glassBreakId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getProgressNotesForCurrentUser
// ====================================================

export interface getProgressNotesForCurrentUser_progressNotesForCurrentUser_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface getProgressNotesForCurrentUser_progressNotesForCurrentUser_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getProgressNotesForCurrentUser_progressNotesForCurrentUser_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getProgressNotesForCurrentUser_progressNotesForCurrentUser_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getProgressNotesForCurrentUser_progressNotesForCurrentUser_patient_patientInfo;
  patientState: getProgressNotesForCurrentUser_progressNotesForCurrentUser_patient_patientState;
}

export interface getProgressNotesForCurrentUser_progressNotesForCurrentUser_supervisor {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getProgressNotesForCurrentUser_progressNotesForCurrentUser_progressNoteTemplate {
  id: string;
  title: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface getProgressNotesForCurrentUser_progressNotesForCurrentUser {
  id: string;
  patientId: string;
  user: getProgressNotesForCurrentUser_progressNotesForCurrentUser_user;
  patient: getProgressNotesForCurrentUser_progressNotesForCurrentUser_patient;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  summary: string | null;
  memberConcern: string | null;
  startedAt: string | null;
  location: string | null;
  deletedAt: string | null;
  needsSupervisorReview: boolean | null;
  reviewedBySupervisorAt: string | null;
  supervisorNotes: string | null;
  supervisor: getProgressNotesForCurrentUser_progressNotesForCurrentUser_supervisor | null;
  progressNoteTemplate: getProgressNotesForCurrentUser_progressNotesForCurrentUser_progressNoteTemplate | null;
  worryScore: number | null;
}

export interface getProgressNotesForCurrentUser {
  progressNotesForCurrentUser: (getProgressNotesForCurrentUser_progressNotesForCurrentUser | null)[];  // progress notes for current user
}

export interface getProgressNotesForCurrentUserVariables {
  completed: boolean;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getProgressNotesForSupervisorReview
// ====================================================

export interface getProgressNotesForSupervisorReview_progressNotesForSupervisorReview_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface getProgressNotesForSupervisorReview_progressNotesForSupervisorReview_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getProgressNotesForSupervisorReview_progressNotesForSupervisorReview_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getProgressNotesForSupervisorReview_progressNotesForSupervisorReview_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getProgressNotesForSupervisorReview_progressNotesForSupervisorReview_patient_patientInfo;
  patientState: getProgressNotesForSupervisorReview_progressNotesForSupervisorReview_patient_patientState;
}

export interface getProgressNotesForSupervisorReview_progressNotesForSupervisorReview_supervisor {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getProgressNotesForSupervisorReview_progressNotesForSupervisorReview_progressNoteTemplate {
  id: string;
  title: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface getProgressNotesForSupervisorReview_progressNotesForSupervisorReview {
  id: string;
  patientId: string;
  user: getProgressNotesForSupervisorReview_progressNotesForSupervisorReview_user;
  patient: getProgressNotesForSupervisorReview_progressNotesForSupervisorReview_patient;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  summary: string | null;
  memberConcern: string | null;
  startedAt: string | null;
  location: string | null;
  deletedAt: string | null;
  needsSupervisorReview: boolean | null;
  reviewedBySupervisorAt: string | null;
  supervisorNotes: string | null;
  supervisor: getProgressNotesForSupervisorReview_progressNotesForSupervisorReview_supervisor | null;
  progressNoteTemplate: getProgressNotesForSupervisorReview_progressNotesForSupervisorReview_progressNoteTemplate | null;
  worryScore: number | null;
}

export interface getProgressNotesForSupervisorReview {
  progressNotesForSupervisorReview: (getProgressNotesForSupervisorReview_progressNotesForSupervisorReview | null)[];  // progress notes for supervisor review
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getQuestionAnswers
// ====================================================

export interface getQuestionAnswers_answersForQuestion_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getQuestionAnswers_answersForQuestion_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getQuestionAnswers_answersForQuestion_concernSuggestions_diagnosisCodes[] | null;
}

export interface getQuestionAnswers_answersForQuestion_goalSuggestions_taskTemplates {
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

export interface getQuestionAnswers_answersForQuestion_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: getQuestionAnswers_answersForQuestion_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getQuestionAnswers_answersForQuestion_riskArea {
  id: string;
  title: string;
}

export interface getQuestionAnswers_answersForQuestion_screeningTool {
  id: string;
  title: string;
}

export interface getQuestionAnswers_answersForQuestion {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: getQuestionAnswers_answersForQuestion_concernSuggestions[] | null;
  goalSuggestions: (getQuestionAnswers_answersForQuestion_goalSuggestions | null)[] | null;
  riskArea: getQuestionAnswers_answersForQuestion_riskArea | null;
  screeningTool: getQuestionAnswers_answersForQuestion_screeningTool | null;
}

export interface getQuestionAnswers {
  answersForQuestion: (getQuestionAnswers_answersForQuestion | null)[];  // Answers
}

export interface getQuestionAnswersVariables {
  questionId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getQuestion
// ====================================================

export interface getQuestion_question_answers_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getQuestion_question_answers_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getQuestion_question_answers_concernSuggestions_diagnosisCodes[] | null;
}

export interface getQuestion_question_answers_goalSuggestions_taskTemplates {
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

export interface getQuestion_question_answers_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: getQuestion_question_answers_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getQuestion_question_answers_riskArea {
  id: string;
  title: string;
}

export interface getQuestion_question_answers_screeningTool {
  id: string;
  title: string;
}

export interface getQuestion_question_answers {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: getQuestion_question_answers_concernSuggestions[] | null;
  goalSuggestions: (getQuestion_question_answers_goalSuggestions | null)[] | null;
  riskArea: getQuestion_question_answers_riskArea | null;
  screeningTool: getQuestion_question_answers_screeningTool | null;
}

export interface getQuestion_question_applicableIfQuestionConditions {
  id: string;
  questionId: string;
  answerId: string;
}

export interface getQuestion_question_computedField {
  id: string;
  label: string;
  slug: string;
  dataType: ComputedFieldDataTypes;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getQuestion_question {
  id: string;
  createdAt: string;
  deletedAt: string | null;
  title: string;
  validatedSource: string | null;
  answerType: AnswerTypeOptions;
  riskAreaId: string | null;
  screeningToolId: string | null;
  order: number;
  applicableIfType: QuestionConditionTypeOptions | null;
  otherTextAnswerId: string | null;
  answers: getQuestion_question_answers[] | null;
  applicableIfQuestionConditions: getQuestion_question_applicableIfQuestionConditions[];
  computedFieldId: string | null;
  computedField: getQuestion_question_computedField | null;
}

export interface getQuestion {
  question: getQuestion_question;  // Question
}

export interface getQuestionVariables {
  questionId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getQuestions
// ====================================================

export interface getQuestions_questions_answers_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getQuestions_questions_answers_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getQuestions_questions_answers_concernSuggestions_diagnosisCodes[] | null;
}

export interface getQuestions_questions_answers_goalSuggestions_taskTemplates {
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

export interface getQuestions_questions_answers_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: getQuestions_questions_answers_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getQuestions_questions_answers_riskArea {
  id: string;
  title: string;
}

export interface getQuestions_questions_answers_screeningTool {
  id: string;
  title: string;
}

export interface getQuestions_questions_answers {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: getQuestions_questions_answers_concernSuggestions[] | null;
  goalSuggestions: (getQuestions_questions_answers_goalSuggestions | null)[] | null;
  riskArea: getQuestions_questions_answers_riskArea | null;
  screeningTool: getQuestions_questions_answers_screeningTool | null;
}

export interface getQuestions_questions_applicableIfQuestionConditions {
  id: string;
  questionId: string;
  answerId: string;
}

export interface getQuestions_questions_computedField {
  id: string;
  label: string;
  slug: string;
  dataType: ComputedFieldDataTypes;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getQuestions_questions {
  id: string;
  createdAt: string;
  deletedAt: string | null;
  title: string;
  validatedSource: string | null;
  answerType: AnswerTypeOptions;
  riskAreaId: string | null;
  screeningToolId: string | null;
  order: number;
  applicableIfType: QuestionConditionTypeOptions | null;
  otherTextAnswerId: string | null;
  answers: getQuestions_questions_answers[] | null;
  applicableIfQuestionConditions: getQuestions_questions_applicableIfQuestionConditions[];
  computedFieldId: string | null;
  computedField: getQuestions_questions_computedField | null;
}

export interface getQuestions {
  questions: getQuestions_questions[];  // Questions for risk area, progress note template or screening tool
}

export interface getQuestionsVariables {
  filterId: string;
  filterType: QuestionFilterType;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getRiskAreaAssessmentSubmissionForPatient
// ====================================================

export interface getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions_patient_patientInfo;
  patientState: getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions_patient_patientState;
}

export interface getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions_concern_diagnosisCodes[] | null;
}

export interface getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions_goalSuggestionTemplate_taskTemplates {
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

export interface getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions {
  id: string;
  patientId: string;
  patient: getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient {
  id: string;
  riskAreaId: string;
  patientId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  completedAt: string | null;
  carePlanSuggestions: getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient_carePlanSuggestions[];
}

export interface getRiskAreaAssessmentSubmissionForPatient {
  riskAreaAssessmentSubmissionForPatient: getRiskAreaAssessmentSubmissionForPatient_riskAreaAssessmentSubmissionForPatient | null;  // latest risk area assessment submission for a screening tool
}

export interface getRiskAreaAssessmentSubmissionForPatientVariables {
  riskAreaId: string;
  patientId: string;
  completed: boolean;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getRiskAreaAssessmentSubmission
// ====================================================

export interface getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions_patient_patientInfo;
  patientState: getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions_patient_patientState;
}

export interface getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions_concern_diagnosisCodes[] | null;
}

export interface getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions_goalSuggestionTemplate_taskTemplates {
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

export interface getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions {
  id: string;
  patientId: string;
  patient: getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission {
  id: string;
  riskAreaId: string;
  patientId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  completedAt: string | null;
  carePlanSuggestions: getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission_carePlanSuggestions[];
}

export interface getRiskAreaAssessmentSubmission {
  riskAreaAssessmentSubmission: getRiskAreaAssessmentSubmission_riskAreaAssessmentSubmission;  // risk area assessment submission
}

export interface getRiskAreaAssessmentSubmissionVariables {
  riskAreaAssessmentSubmissionId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getRiskAreaGroupForPatient
// ====================================================

export interface getRiskAreaGroupForPatient_riskAreaGroupForPatient_riskAreas_riskAreaAssessmentSubmissions {
  id: string;
  createdAt: string;
}

export interface getRiskAreaGroupForPatient_riskAreaGroupForPatient_riskAreas {
  id: string;
  title: string;
  assessmentType: AssessmentType;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  riskAreaAssessmentSubmissions: getRiskAreaGroupForPatient_riskAreaGroupForPatient_riskAreas_riskAreaAssessmentSubmissions[];
  lastUpdated: string | null;
  forceHighRisk: boolean;
  totalScore: number | null;
  riskScore: Priority | null;
  summaryText: string[];
}

export interface getRiskAreaGroupForPatient_riskAreaGroupForPatient {
  id: string;
  title: string;
  shortTitle: string;
  riskAreas: getRiskAreaGroupForPatient_riskAreaGroupForPatient_riskAreas[];
}

export interface getRiskAreaGroupForPatient {
  riskAreaGroupForPatient: getRiskAreaGroupForPatient_riskAreaGroupForPatient;  // Risk Area Group with associated patient answers
}

export interface getRiskAreaGroupForPatientVariables {
  riskAreaGroupId: string;
  patientId: string;
  glassBreakId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getRiskAreaGroupShort
// ====================================================

export interface getRiskAreaGroupShort_riskAreaGroup {
  id: string;
  title: string;
  shortTitle: string;
}

export interface getRiskAreaGroupShort {
  riskAreaGroup: getRiskAreaGroupShort_riskAreaGroup;  // RiskAreaGroup
}

export interface getRiskAreaGroupShortVariables {
  riskAreaGroupId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getRiskAreaGroupsForPatient
// ====================================================

export interface getRiskAreaGroupsForPatient_riskAreaGroupsForPatient_screeningToolResultSummaries {
  title: string;
  score: number | null;
  description: string;
}

export interface getRiskAreaGroupsForPatient_riskAreaGroupsForPatient_riskAreas {
  id: string;
  assessmentType: AssessmentType;
}

export interface getRiskAreaGroupsForPatient_riskAreaGroupsForPatient {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  shortTitle: string;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  automatedSummaryText: string[];
  manualSummaryText: string[];
  screeningToolResultSummaries: getRiskAreaGroupsForPatient_riskAreaGroupsForPatient_screeningToolResultSummaries[];
  lastUpdated: string | null;
  forceHighRisk: boolean;
  totalScore: number | null;
  riskScore: Priority | null;
  riskAreas: getRiskAreaGroupsForPatient_riskAreaGroupsForPatient_riskAreas[];
}

export interface getRiskAreaGroupsForPatient {
  riskAreaGroupsForPatient: getRiskAreaGroupsForPatient_riskAreaGroupsForPatient[];  // RiskAreaGroupsForPatient
}

export interface getRiskAreaGroupsForPatientVariables {
  patientId: string;
  glassBreakId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getRiskAreaGroups
// ====================================================

export interface getRiskAreaGroups_riskAreaGroups_riskAreas {
  id: string;
  title: string;
  assessmentType: AssessmentType;
}

export interface getRiskAreaGroups_riskAreaGroups {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  shortTitle: string;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  riskAreas: getRiskAreaGroups_riskAreaGroups_riskAreas[] | null;
}

export interface getRiskAreaGroups {
  riskAreaGroups: getRiskAreaGroups_riskAreaGroups[];  // RiskAreaGroups
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getRiskAreaShort
// ====================================================

export interface getRiskAreaShort_riskArea {
  id: string;
  title: string;
}

export interface getRiskAreaShort {
  riskArea: getRiskAreaShort_riskArea;  // RiskArea
}

export interface getRiskAreaShortVariables {
  riskAreaId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getRiskArea
// ====================================================

export interface getRiskArea_riskArea {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  assessmentType: AssessmentType;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  riskAreaGroupId: string;
}

export interface getRiskArea {
  riskArea: getRiskArea_riskArea;  // RiskArea
}

export interface getRiskAreaVariables {
  riskAreaId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getRiskAreas
// ====================================================

export interface getRiskAreas_riskAreas {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  assessmentType: AssessmentType;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  riskAreaGroupId: string;
}

export interface getRiskAreas {
  riskAreas: (getRiskAreas_riskAreas | null)[];  // RiskAreas
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getScreeningTool
// ====================================================

export interface getScreeningTool_screeningTool_screeningToolScoreRanges_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getScreeningTool_screeningTool_screeningToolScoreRanges_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getScreeningTool_screeningTool_screeningToolScoreRanges_concernSuggestions_diagnosisCodes[] | null;
}

export interface getScreeningTool_screeningTool_screeningToolScoreRanges_goalSuggestions_taskTemplates {
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

export interface getScreeningTool_screeningTool_screeningToolScoreRanges_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: getScreeningTool_screeningTool_screeningToolScoreRanges_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getScreeningTool_screeningTool_screeningToolScoreRanges {
  id: string;
  description: string;
  minimumScore: number;
  maximumScore: number;
  screeningToolId: string;
  riskAdjustmentType: RiskAdjustmentTypeOptions;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  concernSuggestions: getScreeningTool_screeningTool_screeningToolScoreRanges_concernSuggestions[];
  goalSuggestions: (getScreeningTool_screeningTool_screeningToolScoreRanges_goalSuggestions | null)[] | null;
}

export interface getScreeningTool_screeningTool_patientScreeningToolSubmissions {
  id: string;
  screeningToolId: string;
  patientId: string;
  userId: string;
  score: number | null;
  screeningToolScoreRangeId: string | null;
}

export interface getScreeningTool_screeningTool {
  id: string;
  title: string;
  riskAreaId: string;
  screeningToolScoreRanges: getScreeningTool_screeningTool_screeningToolScoreRanges[];
  patientScreeningToolSubmissions: getScreeningTool_screeningTool_patientScreeningToolSubmissions[] | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getScreeningTool {
  screeningTool: getScreeningTool_screeningTool;  // screening tool
}

export interface getScreeningToolVariables {
  screeningToolId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getScreeningTools
// ====================================================

export interface getScreeningTools_screeningTools_screeningToolScoreRanges_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface getScreeningTools_screeningTools_screeningToolScoreRanges_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: getScreeningTools_screeningTools_screeningToolScoreRanges_concernSuggestions_diagnosisCodes[] | null;
}

export interface getScreeningTools_screeningTools_screeningToolScoreRanges_goalSuggestions_taskTemplates {
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

export interface getScreeningTools_screeningTools_screeningToolScoreRanges_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: getScreeningTools_screeningTools_screeningToolScoreRanges_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getScreeningTools_screeningTools_screeningToolScoreRanges {
  id: string;
  description: string;
  minimumScore: number;
  maximumScore: number;
  screeningToolId: string;
  riskAdjustmentType: RiskAdjustmentTypeOptions;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  concernSuggestions: getScreeningTools_screeningTools_screeningToolScoreRanges_concernSuggestions[];
  goalSuggestions: (getScreeningTools_screeningTools_screeningToolScoreRanges_goalSuggestions | null)[] | null;
}

export interface getScreeningTools_screeningTools_patientScreeningToolSubmissions {
  id: string;
  screeningToolId: string;
  patientId: string;
  userId: string;
  score: number | null;
  screeningToolScoreRangeId: string | null;
}

export interface getScreeningTools_screeningTools {
  id: string;
  title: string;
  riskAreaId: string;
  screeningToolScoreRanges: getScreeningTools_screeningTools_screeningToolScoreRanges[];
  patientScreeningToolSubmissions: getScreeningTools_screeningTools_patientScreeningToolSubmissions[] | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface getScreeningTools {
  screeningTools: (getScreeningTools_screeningTools | null)[];  // screening tools
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getSmsMessageLatest
// ====================================================

export interface getSmsMessageLatest_smsMessageLatest {
  id: string;
  userId: string;
  contactNumber: string;
  patientId: string | null;
  direction: SmsMessageDirection;
  body: string;
  createdAt: string;
}

export interface getSmsMessageLatest {
  smsMessageLatest: getSmsMessageLatest_smsMessageLatest | null;  // latest SMS message between given user and patient
}

export interface getSmsMessageLatestVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getSmsMessages
// ====================================================

export interface getSmsMessages_smsMessages_edges_node {
  id: string;
  userId: string;
  contactNumber: string;
  patientId: string | null;
  direction: SmsMessageDirection;
  body: string;
  createdAt: string;
}

export interface getSmsMessages_smsMessages_edges {
  node: getSmsMessages_smsMessages_edges_node;
}

export interface getSmsMessages_smsMessages_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getSmsMessages_smsMessages {
  edges: getSmsMessages_smsMessages_edges[];
  pageInfo: getSmsMessages_smsMessages_pageInfo;
  totalCount: number;
}

export interface getSmsMessages {
  smsMessages: getSmsMessages_smsMessages;  // SMS messages for given user and patient
}

export interface getSmsMessagesVariables {
  patientId: string;
  pageNumber: number;
  pageSize: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTaskComment
// ====================================================

export interface getTaskComment_taskComment_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface getTaskComment_taskComment {
  id: string;
  body: string;
  user: getTaskComment_taskComment_user;
  taskId: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface getTaskComment {
  taskComment: getTaskComment_taskComment;  // Single task comment
}

export interface getTaskCommentVariables {
  taskCommentId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTaskComments
// ====================================================

export interface getTaskComments_taskComments_edges_node_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface getTaskComments_taskComments_edges_node {
  id: string;
  body: string;
  user: getTaskComments_taskComments_edges_node_user;
  taskId: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface getTaskComments_taskComments_edges {
  node: getTaskComments_taskComments_edges_node | null;
}

export interface getTaskComments_taskComments_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getTaskComments_taskComments {
  edges: getTaskComments_taskComments_edges[];
  pageInfo: getTaskComments_taskComments_pageInfo;
}

export interface getTaskComments {
  taskComments: getTaskComments_taskComments;  // List of task comments
}

export interface getTaskCommentsVariables {
  taskId: string;
  pageNumber?: number | null;
  pageSize?: number | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTaskIdsWithNotifications
// ====================================================

export interface getTaskIdsWithNotifications_taskIdsWithNotifications {
  id: string;
}

export interface getTaskIdsWithNotifications {
  taskIdsWithNotifications: getTaskIdsWithNotifications_taskIdsWithNotifications[];  // Task IDs with notifications for current user - in care plan MAP and tasks panel
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTask
// ====================================================

export interface getTask_task_patient_patientInfo {
  id: string;
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface getTask_task_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  patientInfo: getTask_task_patient_patientInfo;
}

export interface getTask_task_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getTask_task_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getTask_task_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getTask_task_patientGoal_patientConcern_concern {
  id: string;
  title: string;
}

export interface getTask_task_patientGoal_patientConcern {
  concern: getTask_task_patientGoal_patientConcern_concern;
}

export interface getTask_task_patientGoal {
  id: string;
  title: string;
  patientConcern: getTask_task_patientGoal_patientConcern | null;
}

export interface getTask_task_CBOReferral_category {
  id: string;
  title: string;
}

export interface getTask_task_CBOReferral_CBO {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
}

export interface getTask_task_CBOReferral {
  id: string;
  categoryId: string;
  category: getTask_task_CBOReferral_category;
  CBOId: string | null;
  CBO: getTask_task_CBOReferral_CBO | null;
  name: string | null;
  url: string | null;
  diagnosis: string | null;
  sentAt: string | null;
  acknowledgedAt: string | null;
}

export interface getTask_task {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  patient: getTask_task_patient;
  assignedToId: string | null;
  assignedTo: getTask_task_assignedTo | null;
  followers: getTask_task_followers[];
  createdBy: getTask_task_createdBy;
  patientGoal: getTask_task_patientGoal;
  CBOReferralId: string | null;
  CBOReferral: getTask_task_CBOReferral | null;
}

export interface getTask {
  task: getTask_task;  // Task
}

export interface getTaskVariables {
  taskId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTasksDueSoonForPatient
// ====================================================

export interface getTasksDueSoonForPatient_tasksDueSoonForPatient_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getTasksDueSoonForPatient_tasksDueSoonForPatient {
  id: string;
  title: string;
  dueAt: string | null;
  priority: Priority | null;
  patientId: string;
  followers: getTasksDueSoonForPatient_tasksDueSoonForPatient_followers[];
}

export interface getTasksDueSoonForPatient {
  tasksDueSoonForPatient: getTasksDueSoonForPatient_tasksDueSoonForPatient[];  // Tasks due soon for patient - in dashboard
}

export interface getTasksDueSoonForPatientVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTasksForUserForPatient
// ====================================================

export interface getTasksForUserForPatient_tasksForUserForPatient {
  id: string;
}

export interface getTasksForUserForPatient {
  tasksForUserForPatient: getTasksForUserForPatient_tasksForUserForPatient[];  // Tasks assigned to or followed by a user for a patient
}

export interface getTasksForUserForPatientVariables {
  userId: string;
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTasksWithNotificationsForPatient
// ====================================================

export interface getTasksWithNotificationsForPatient_tasksWithNotificationsForPatient_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getTasksWithNotificationsForPatient_tasksWithNotificationsForPatient {
  id: string;
  title: string;
  dueAt: string | null;
  priority: Priority | null;
  patientId: string;
  followers: getTasksWithNotificationsForPatient_tasksWithNotificationsForPatient_followers[];
}

export interface getTasksWithNotificationsForPatient {
  tasksWithNotificationsForPatient: getTasksWithNotificationsForPatient_tasksWithNotificationsForPatient[];  // Tasks with notifications for patient - in dashboard
}

export interface getTasksWithNotificationsForPatientVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUserSummaryList
// ====================================================

export interface getUserSummaryList_userSummaryList {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
  patientCount: number | null;
  email: string | null;
}

export interface getUserSummaryList {
  userSummaryList: getUserSummaryList_userSummaryList[];  // List of all Users with care roles
}

export interface getUserSummaryListVariables {
  userRoleFilters?: UserRole[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUsers
// ====================================================

export interface getUsers_users_edges_node {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface getUsers_users_edges {
  node: getUsers_users_edges_node | null;
}

export interface getUsers_users_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getUsers_users {
  edges: (getUsers_users_edges | null)[] | null;
  pageInfo: getUsers_users_pageInfo;
}

export interface getUsers {
  users: getUsers_users;  // All Users (admin only)
}

export interface getUsersVariables {
  pageNumber?: number | null;
  pageSize?: number | null;
  orderBy?: UserOrderOptions | null;
  hasLoggedIn?: boolean | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: goalSuggestionCreate
// ====================================================

export interface goalSuggestionCreate_goalSuggestionCreate_taskTemplates {
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

export interface goalSuggestionCreate_goalSuggestionCreate {
  id: string;
  title: string;
  taskTemplates: goalSuggestionCreate_goalSuggestionCreate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface goalSuggestionCreate {
  goalSuggestionCreate: (goalSuggestionCreate_goalSuggestionCreate | null)[] | null;  // Suggest a goal suggestion template for an answer
}

export interface goalSuggestionCreateVariables {
  answerId?: string | null;
  screeningToolScoreRangeId?: string | null;
  goalSuggestionTemplateId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: goalSuggestionDelete
// ====================================================

export interface goalSuggestionDelete_goalSuggestionDelete_taskTemplates {
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

export interface goalSuggestionDelete_goalSuggestionDelete {
  id: string;
  title: string;
  taskTemplates: goalSuggestionDelete_goalSuggestionDelete_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface goalSuggestionDelete {
  goalSuggestionDelete: (goalSuggestionDelete_goalSuggestionDelete | null)[] | null;  // unsuggest a goal suggestion template for an answer
}

export interface goalSuggestionDeleteVariables {
  answerId?: string | null;
  screeningToolScoreRangeId?: string | null;
  goalSuggestionTemplateId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: goalSuggestionTemplateCreate
// ====================================================

export interface goalSuggestionTemplateCreate_goalSuggestionTemplateCreate_taskTemplates {
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

export interface goalSuggestionTemplateCreate_goalSuggestionTemplateCreate {
  id: string;
  title: string;
  taskTemplates: goalSuggestionTemplateCreate_goalSuggestionTemplateCreate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface goalSuggestionTemplateCreate {
  goalSuggestionTemplateCreate: goalSuggestionTemplateCreate_goalSuggestionTemplateCreate | null;  // goal suggestion template create
}

export interface goalSuggestionTemplateCreateVariables {
  title: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: goalSuggestionTemplateDelete
// ====================================================

export interface goalSuggestionTemplateDelete_goalSuggestionTemplateDelete_taskTemplates {
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

export interface goalSuggestionTemplateDelete_goalSuggestionTemplateDelete {
  id: string;
  title: string;
  taskTemplates: goalSuggestionTemplateDelete_goalSuggestionTemplateDelete_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface goalSuggestionTemplateDelete {
  goalSuggestionTemplateDelete: goalSuggestionTemplateDelete_goalSuggestionTemplateDelete | null;  // Deletes a goal suggestion template
}

export interface goalSuggestionTemplateDeleteVariables {
  goalSuggestionTemplateId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: goalSuggestionTemplateEdit
// ====================================================

export interface goalSuggestionTemplateEdit_goalSuggestionTemplateEdit_taskTemplates {
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

export interface goalSuggestionTemplateEdit_goalSuggestionTemplateEdit {
  id: string;
  title: string;
  taskTemplates: goalSuggestionTemplateEdit_goalSuggestionTemplateEdit_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface goalSuggestionTemplateEdit {
  goalSuggestionTemplateEdit: goalSuggestionTemplateEdit_goalSuggestionTemplateEdit | null;  // Edit a goal suggestion template
}

export interface goalSuggestionTemplateEditVariables {
  goalSuggestionTemplateId: string;
  title: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: helloSignCreate
// ====================================================

export interface helloSignCreate_helloSignCreate {
  url: string;
}

export interface helloSignCreate {
  helloSignCreate: helloSignCreate_helloSignCreate;  // create hello sign
}

export interface helloSignCreateVariables {
  patientId: string;
  documentType: DocumentTypeOptions;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: JwtForPdfCreate
// ====================================================

export interface JwtForPdfCreate_JwtForPdfCreate {
  authToken: string;
}

export interface JwtForPdfCreate {
  JwtForPdfCreate: JwtForPdfCreate_JwtForPdfCreate;  // Jwt token to view a PDF
}

export interface JwtForPdfCreateVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: JwtForVcfCreate
// ====================================================

export interface JwtForVcfCreate_JwtForVcfCreate {
  authToken: string;
}

export interface JwtForVcfCreate {
  JwtForVcfCreate: JwtForVcfCreate_JwtForVcfCreate;  // creates a JWT to download VCF
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: logInUser
// ====================================================

export interface logInUser_userLogin_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface logInUser_userLogin {
  authToken: string | null;  // The auth token to allow for quick login. JWT passed back in via headers for further requests
  user: logInUser_userLogin_user;
}

export interface logInUser {
  userLogin: logInUser_userLogin | null;  // Login user
}

export interface logInUserVariables {
  googleAuthCode: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: mattermostUrlForPatientCreate
// ====================================================

export interface mattermostUrlForPatientCreate_mattermostUrlForPatientCreate {
  url: string;
}

export interface mattermostUrlForPatientCreate {
  mattermostUrlForPatientCreate: mattermostUrlForPatientCreate_mattermostUrlForPatientCreate;  // mattermost url for patient channel
}

export interface mattermostUrlForPatientCreateVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: mattermostUrlForUserCreate
// ====================================================

export interface mattermostUrlForUserCreate_mattermostUrlForUserCreate {
  url: string;
}

export interface mattermostUrlForUserCreate {
  mattermostUrlForUserCreate: mattermostUrlForUserCreate_mattermostUrlForUserCreate;  // mattermost url to DM user
}

export interface mattermostUrlForUserCreateVariables {
  email: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientAnswersCreate
// ====================================================

export interface patientAnswersCreate_patientAnswersCreate_answer_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface patientAnswersCreate_patientAnswersCreate_answer_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: patientAnswersCreate_patientAnswersCreate_answer_concernSuggestions_diagnosisCodes[] | null;
}

export interface patientAnswersCreate_patientAnswersCreate_answer_goalSuggestions_taskTemplates {
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

export interface patientAnswersCreate_patientAnswersCreate_answer_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: patientAnswersCreate_patientAnswersCreate_answer_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface patientAnswersCreate_patientAnswersCreate_answer_riskArea {
  id: string;
  title: string;
}

export interface patientAnswersCreate_patientAnswersCreate_answer_screeningTool {
  id: string;
  title: string;
}

export interface patientAnswersCreate_patientAnswersCreate_answer {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: patientAnswersCreate_patientAnswersCreate_answer_concernSuggestions[] | null;
  goalSuggestions: (patientAnswersCreate_patientAnswersCreate_answer_goalSuggestions | null)[] | null;
  riskArea: patientAnswersCreate_patientAnswersCreate_answer_riskArea | null;
  screeningTool: patientAnswersCreate_patientAnswersCreate_answer_screeningTool | null;
}

export interface patientAnswersCreate_patientAnswersCreate_question {
  id: string;
  title: string;
  answerType: AnswerTypeOptions;
}

export interface patientAnswersCreate_patientAnswersCreate {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  answerId: string;
  answer: patientAnswersCreate_patientAnswersCreate_answer;
  answerValue: string;
  patientId: string;
  applicable: boolean | null;
  question: patientAnswersCreate_patientAnswersCreate_question | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface patientAnswersCreate {
  patientAnswersCreate: (patientAnswersCreate_patientAnswersCreate | null)[] | null;  // Create a patient answer
}

export interface patientAnswersCreateVariables {
  patientId: string;
  patientAnswers: (PatientAnswerInput | null)[];
  questionIds: (string | null)[];
  patientScreeningToolSubmissionId?: string | null;
  riskAreaAssessmentSubmissionId?: string | null;
  progressNoteId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientCareTeamAddUser
// ====================================================

export interface patientCareTeamAddUser_careTeamAddUser {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface patientCareTeamAddUser {
  careTeamAddUser: patientCareTeamAddUser_careTeamAddUser | null;  // Add user to careTeam
}

export interface patientCareTeamAddUserVariables {
  patientId: string;
  userId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientConcernBulkEdit
// ====================================================

export interface patientConcernBulkEdit_patientConcernBulkEdit_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface patientConcernBulkEdit_patientConcernBulkEdit_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: patientConcernBulkEdit_patientConcernBulkEdit_concern_diagnosisCodes[] | null;
}

export interface patientConcernBulkEdit_patientConcernBulkEdit_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface patientConcernBulkEdit_patientConcernBulkEdit_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface patientConcernBulkEdit_patientConcernBulkEdit_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: patientConcernBulkEdit_patientConcernBulkEdit_patient_patientInfo;
  patientState: patientConcernBulkEdit_patientConcernBulkEdit_patient_patientState;
}

export interface patientConcernBulkEdit_patientConcernBulkEdit_patientGoals_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface patientConcernBulkEdit_patientConcernBulkEdit_patientGoals_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface patientConcernBulkEdit_patientConcernBulkEdit_patientGoals_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: patientConcernBulkEdit_patientConcernBulkEdit_patientGoals_patient_patientInfo;
  patientState: patientConcernBulkEdit_patientConcernBulkEdit_patientGoals_patient_patientState;
}

export interface patientConcernBulkEdit_patientConcernBulkEdit_patientGoals_tasks_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface patientConcernBulkEdit_patientConcernBulkEdit_patientGoals_tasks_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface patientConcernBulkEdit_patientConcernBulkEdit_patientGoals_tasks_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface patientConcernBulkEdit_patientConcernBulkEdit_patientGoals_tasks {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  assignedTo: patientConcernBulkEdit_patientConcernBulkEdit_patientGoals_tasks_assignedTo | null;
  assignedToId: string | null;
  followers: patientConcernBulkEdit_patientConcernBulkEdit_patientGoals_tasks_followers[];
  createdBy: patientConcernBulkEdit_patientConcernBulkEdit_patientGoals_tasks_createdBy;
}

export interface patientConcernBulkEdit_patientConcernBulkEdit_patientGoals {
  id: string;
  title: string;
  patientId: string;
  patient: patientConcernBulkEdit_patientConcernBulkEdit_patientGoals_patient;
  patientConcernId: string | null;
  goalSuggestionTemplateId: string | null;
  tasks: patientConcernBulkEdit_patientConcernBulkEdit_patientGoals_tasks[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface patientConcernBulkEdit_patientConcernBulkEdit {
  id: string;
  order: number;
  concernId: string;
  concern: patientConcernBulkEdit_patientConcernBulkEdit_concern;
  patientId: string;
  patient: patientConcernBulkEdit_patientConcernBulkEdit_patient;
  patientGoals: patientConcernBulkEdit_patientConcernBulkEdit_patientGoals[] | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface patientConcernBulkEdit {
  patientConcernBulkEdit: (patientConcernBulkEdit_patientConcernBulkEdit | null)[] | null;  // patient concern bulk edit
}

export interface patientConcernBulkEditVariables {
  patientConcerns: (PatientConcernBulkEditFields | null)[];
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientConcernCreate
// ====================================================

export interface patientConcernCreate_patientConcernCreate_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface patientConcernCreate_patientConcernCreate_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: patientConcernCreate_patientConcernCreate_concern_diagnosisCodes[] | null;
}

export interface patientConcernCreate_patientConcernCreate_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface patientConcernCreate_patientConcernCreate_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface patientConcernCreate_patientConcernCreate_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: patientConcernCreate_patientConcernCreate_patient_patientInfo;
  patientState: patientConcernCreate_patientConcernCreate_patient_patientState;
}

export interface patientConcernCreate_patientConcernCreate_patientGoals_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface patientConcernCreate_patientConcernCreate_patientGoals_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface patientConcernCreate_patientConcernCreate_patientGoals_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: patientConcernCreate_patientConcernCreate_patientGoals_patient_patientInfo;
  patientState: patientConcernCreate_patientConcernCreate_patientGoals_patient_patientState;
}

export interface patientConcernCreate_patientConcernCreate_patientGoals_tasks_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface patientConcernCreate_patientConcernCreate_patientGoals_tasks_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface patientConcernCreate_patientConcernCreate_patientGoals_tasks_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface patientConcernCreate_patientConcernCreate_patientGoals_tasks {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  assignedTo: patientConcernCreate_patientConcernCreate_patientGoals_tasks_assignedTo | null;
  assignedToId: string | null;
  followers: patientConcernCreate_patientConcernCreate_patientGoals_tasks_followers[];
  createdBy: patientConcernCreate_patientConcernCreate_patientGoals_tasks_createdBy;
}

export interface patientConcernCreate_patientConcernCreate_patientGoals {
  id: string;
  title: string;
  patientId: string;
  patient: patientConcernCreate_patientConcernCreate_patientGoals_patient;
  patientConcernId: string | null;
  goalSuggestionTemplateId: string | null;
  tasks: patientConcernCreate_patientConcernCreate_patientGoals_tasks[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface patientConcernCreate_patientConcernCreate {
  id: string;
  order: number;
  concernId: string;
  concern: patientConcernCreate_patientConcernCreate_concern;
  patientId: string;
  patient: patientConcernCreate_patientConcernCreate_patient;
  patientGoals: patientConcernCreate_patientConcernCreate_patientGoals[] | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface patientConcernCreate {
  patientConcernCreate: patientConcernCreate_patientConcernCreate | null;  // patient concern create
}

export interface patientConcernCreateVariables {
  patientId: string;
  concernId: string;
  startedAt?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientConcernDelete
// ====================================================

export interface patientConcernDelete_patientConcernDelete_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface patientConcernDelete_patientConcernDelete_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: patientConcernDelete_patientConcernDelete_concern_diagnosisCodes[] | null;
}

export interface patientConcernDelete_patientConcernDelete_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface patientConcernDelete_patientConcernDelete_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface patientConcernDelete_patientConcernDelete_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: patientConcernDelete_patientConcernDelete_patient_patientInfo;
  patientState: patientConcernDelete_patientConcernDelete_patient_patientState;
}

export interface patientConcernDelete_patientConcernDelete_patientGoals_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface patientConcernDelete_patientConcernDelete_patientGoals_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface patientConcernDelete_patientConcernDelete_patientGoals_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: patientConcernDelete_patientConcernDelete_patientGoals_patient_patientInfo;
  patientState: patientConcernDelete_patientConcernDelete_patientGoals_patient_patientState;
}

export interface patientConcernDelete_patientConcernDelete_patientGoals_tasks_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface patientConcernDelete_patientConcernDelete_patientGoals_tasks_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface patientConcernDelete_patientConcernDelete_patientGoals_tasks_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface patientConcernDelete_patientConcernDelete_patientGoals_tasks {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  assignedTo: patientConcernDelete_patientConcernDelete_patientGoals_tasks_assignedTo | null;
  assignedToId: string | null;
  followers: patientConcernDelete_patientConcernDelete_patientGoals_tasks_followers[];
  createdBy: patientConcernDelete_patientConcernDelete_patientGoals_tasks_createdBy;
}

export interface patientConcernDelete_patientConcernDelete_patientGoals {
  id: string;
  title: string;
  patientId: string;
  patient: patientConcernDelete_patientConcernDelete_patientGoals_patient;
  patientConcernId: string | null;
  goalSuggestionTemplateId: string | null;
  tasks: patientConcernDelete_patientConcernDelete_patientGoals_tasks[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface patientConcernDelete_patientConcernDelete {
  id: string;
  order: number;
  concernId: string;
  concern: patientConcernDelete_patientConcernDelete_concern;
  patientId: string;
  patient: patientConcernDelete_patientConcernDelete_patient;
  patientGoals: patientConcernDelete_patientConcernDelete_patientGoals[] | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface patientConcernDelete {
  patientConcernDelete: patientConcernDelete_patientConcernDelete | null;  // patient concern delete
}

export interface patientConcernDeleteVariables {
  patientConcernId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientContactCreate
// ====================================================

export interface patientContactCreate_patientContactCreate_address {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface patientContactCreate_patientContactCreate_email {
  id: string;
  emailAddress: string;
}

export interface patientContactCreate_patientContactCreate_phone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
}

export interface patientContactCreate_patientContactCreate {
  id: string;
  patientId: string;
  relationToPatient: PatientRelationOptions;
  relationFreeText: string | null;
  firstName: string;
  lastName: string;
  isEmergencyContact: boolean;
  isHealthcareProxy: boolean;
  description: string | null;
  address: patientContactCreate_patientContactCreate_address | null;
  email: patientContactCreate_patientContactCreate_email | null;
  phone: patientContactCreate_patientContactCreate_phone;
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

export interface patientContactCreate {
  patientContactCreate: patientContactCreate_patientContactCreate | null;  // Create patient contact
}

export interface patientContactCreateVariables {
  patientId: string;
  relationToPatient: PatientRelationOptions;
  relationFreeText?: string | null;
  firstName: string;
  lastName: string;
  phone: PhoneCreateInput;
  isEmergencyContact?: boolean | null;
  isHealthcareProxy?: boolean | null;
  description?: string | null;
  address?: AddressCreateInput | null;
  email?: EmailCreateInput | null;
  isConsentedForSubstanceUse?: boolean | null;
  isConsentedForHiv?: boolean | null;
  isConsentedForStd?: boolean | null;
  isConsentedForGeneticTesting?: boolean | null;
  isConsentedForFamilyPlanning?: boolean | null;
  isConsentedForMentalHealth?: boolean | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientContactDelete
// ====================================================

export interface patientContactDelete_patientContactDelete_address {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface patientContactDelete_patientContactDelete_email {
  id: string;
  emailAddress: string;
}

export interface patientContactDelete_patientContactDelete_phone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
}

export interface patientContactDelete_patientContactDelete {
  id: string;
  patientId: string;
  relationToPatient: PatientRelationOptions;
  relationFreeText: string | null;
  firstName: string;
  lastName: string;
  isEmergencyContact: boolean;
  isHealthcareProxy: boolean;
  description: string | null;
  address: patientContactDelete_patientContactDelete_address | null;
  email: patientContactDelete_patientContactDelete_email | null;
  phone: patientContactDelete_patientContactDelete_phone;
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

export interface patientContactDelete {
  patientContactDelete: patientContactDelete_patientContactDelete | null;  // Delete patient contact
}

export interface patientContactDeleteVariables {
  patientContactId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientContactEdit
// ====================================================

export interface patientContactEdit_patientContactEdit_address {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface patientContactEdit_patientContactEdit_email {
  id: string;
  emailAddress: string;
}

export interface patientContactEdit_patientContactEdit_phone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
}

export interface patientContactEdit_patientContactEdit {
  id: string;
  patientId: string;
  relationToPatient: PatientRelationOptions;
  relationFreeText: string | null;
  firstName: string;
  lastName: string;
  isEmergencyContact: boolean;
  isHealthcareProxy: boolean;
  description: string | null;
  address: patientContactEdit_patientContactEdit_address | null;
  email: patientContactEdit_patientContactEdit_email | null;
  phone: patientContactEdit_patientContactEdit_phone;
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

export interface patientContactEdit {
  patientContactEdit: patientContactEdit_patientContactEdit | null;  // Edit fields on patient contact stored in the db
}

export interface patientContactEditVariables {
  patientContactId: string;
  relationToPatient?: PatientRelationOptions | null;
  relationFreeText?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  isEmergencyContact?: boolean | null;
  isHealthcareProxy?: boolean | null;
  description?: string | null;
  address?: AddressInput | null;
  email?: EmailInput | null;
  phone?: PhoneInput | null;
  isConsentedForSubstanceUse?: boolean | null;
  isConsentedForHiv?: boolean | null;
  isConsentedForStd?: boolean | null;
  isConsentedForGeneticTesting?: boolean | null;
  isConsentedForFamilyPlanning?: boolean | null;
  isConsentedForMentalHealth?: boolean | null;
  consentDocumentId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientCoreIdentityVerify
// ====================================================

export interface patientCoreIdentityVerify_patientCoreIdentityVerify_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface patientCoreIdentityVerify_patientCoreIdentityVerify_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface patientCoreIdentityVerify_patientCoreIdentityVerify {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: patientCoreIdentityVerify_patientCoreIdentityVerify_patientInfo;
  patientState: patientCoreIdentityVerify_patientCoreIdentityVerify_patientState;
}

export interface patientCoreIdentityVerify {
  patientCoreIdentityVerify: patientCoreIdentityVerify_patientCoreIdentityVerify | null;  // mark core identity verified on patient stored in the db
}

export interface patientCoreIdentityVerifyVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientDataFlagCreate
// ====================================================

export interface patientDataFlagCreate_patientDataFlagCreate {
  id: string;
  patientId: string;
  userId: string;
  fieldName: CoreIdentityOptions;
  suggestedValue: string | null;
  notes: string | null;
  updatedAt: string | null;
}

export interface patientDataFlagCreate {
  patientDataFlagCreate: patientDataFlagCreate_patientDataFlagCreate | null;  // creates a patient data flag
}

export interface patientDataFlagCreateVariables {
  patientId: string;
  fieldName: CoreIdentityOptions;
  suggestedValue?: string | null;
  notes?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientDocumentCreate
// ====================================================

export interface patientDocumentCreate_patientDocumentCreate_uploadedBy {
  firstName: string | null;
  lastName: string | null;
}

export interface patientDocumentCreate_patientDocumentCreate {
  id: string;
  patientId: string;
  uploadedBy: patientDocumentCreate_patientDocumentCreate_uploadedBy;
  filename: string;
  description: string | null;
  documentType: DocumentTypeOptions | null;
  createdAt: string;
}

export interface patientDocumentCreate {
  patientDocumentCreate: patientDocumentCreate_patientDocumentCreate | null;  // Create patient document
}

export interface patientDocumentCreateVariables {
  id?: string | null;
  patientId: string;
  filename: string;
  description?: string | null;
  documentType?: DocumentTypeOptions | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientDocumentDelete
// ====================================================

export interface patientDocumentDelete_patientDocumentDelete_uploadedBy {
  firstName: string | null;
  lastName: string | null;
}

export interface patientDocumentDelete_patientDocumentDelete {
  id: string;
  patientId: string;
  uploadedBy: patientDocumentDelete_patientDocumentDelete_uploadedBy;
  filename: string;
  description: string | null;
  documentType: DocumentTypeOptions | null;
  createdAt: string;
}

export interface patientDocumentDelete {
  patientDocumentDelete: patientDocumentDelete_patientDocumentDelete | null;  // Delete patient document
}

export interface patientDocumentDeleteVariables {
  patientDocumentId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientDocumentSignedUrlCreate
// ====================================================

export interface patientDocumentSignedUrlCreate_patientDocumentSignedUrlCreate {
  signedUrl: string;
}

export interface patientDocumentSignedUrlCreate {
  patientDocumentSignedUrlCreate: patientDocumentSignedUrlCreate_patientDocumentSignedUrlCreate;  // generate a signed URL for patient document
}

export interface patientDocumentSignedUrlCreateVariables {
  patientId: string;
  documentId: string;
  action: PatientSignedUrlAction;
  contentType?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientExternalOrganizationCreate
// ====================================================

export interface patientExternalOrganizationCreate_patientExternalOrganizationCreate_address {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface patientExternalOrganizationCreate_patientExternalOrganizationCreate {
  id: string;
  patientId: string;
  name: string;
  description: string | null;
  phoneNumber: string | null;
  faxNumber: string | null;
  address: patientExternalOrganizationCreate_patientExternalOrganizationCreate_address | null;
  isConsentedForSubstanceUse: boolean | null;
  isConsentedForHiv: boolean | null;
  isConsentedForStd: boolean | null;
  isConsentedForGeneticTesting: boolean | null;
  isConsentedForFamilyPlanning: boolean | null;
  isConsentedForMentalHealth: boolean | null;
  consentDocumentId: string | null;
}

export interface patientExternalOrganizationCreate {
  patientExternalOrganizationCreate: patientExternalOrganizationCreate_patientExternalOrganizationCreate | null;  // Create patient external organization
}

export interface patientExternalOrganizationCreateVariables {
  patientId: string;
  name: string;
  description?: string | null;
  phoneNumber?: string | null;
  faxNumber?: string | null;
  address?: AddressCreateInput | null;
  isConsentedForSubstanceUse?: boolean | null;
  isConsentedForHiv?: boolean | null;
  isConsentedForStd?: boolean | null;
  isConsentedForGeneticTesting?: boolean | null;
  isConsentedForFamilyPlanning?: boolean | null;
  isConsentedForMentalHealth?: boolean | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientExternalOrganizationDelete
// ====================================================

export interface patientExternalOrganizationDelete_patientExternalOrganizationDelete_address {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface patientExternalOrganizationDelete_patientExternalOrganizationDelete {
  id: string;
  patientId: string;
  name: string;
  description: string | null;
  phoneNumber: string | null;
  faxNumber: string | null;
  address: patientExternalOrganizationDelete_patientExternalOrganizationDelete_address | null;
  isConsentedForSubstanceUse: boolean | null;
  isConsentedForHiv: boolean | null;
  isConsentedForStd: boolean | null;
  isConsentedForGeneticTesting: boolean | null;
  isConsentedForFamilyPlanning: boolean | null;
  isConsentedForMentalHealth: boolean | null;
  consentDocumentId: string | null;
  deletedAt: string | null;
}

export interface patientExternalOrganizationDelete {
  patientExternalOrganizationDelete: patientExternalOrganizationDelete_patientExternalOrganizationDelete | null;  // Delete patient external organization
}

export interface patientExternalOrganizationDeleteVariables {
  patientExternalOrganizationId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientExternalOrganizationEdit
// ====================================================

export interface patientExternalOrganizationEdit_patientExternalOrganizationEdit_address {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface patientExternalOrganizationEdit_patientExternalOrganizationEdit {
  id: string;
  patientId: string;
  name: string;
  description: string | null;
  phoneNumber: string | null;
  faxNumber: string | null;
  address: patientExternalOrganizationEdit_patientExternalOrganizationEdit_address | null;
  isConsentedForSubstanceUse: boolean | null;
  isConsentedForHiv: boolean | null;
  isConsentedForStd: boolean | null;
  isConsentedForGeneticTesting: boolean | null;
  isConsentedForFamilyPlanning: boolean | null;
  isConsentedForMentalHealth: boolean | null;
  consentDocumentId: string | null;
}

export interface patientExternalOrganizationEdit {
  patientExternalOrganizationEdit: patientExternalOrganizationEdit_patientExternalOrganizationEdit | null;  // Edit fields on patient external organization stored in the db
}

export interface patientExternalOrganizationEditVariables {
  patientExternalOrganizationId: string;
  name?: string | null;
  description?: string | null;
  phoneNumber?: string | null;
  faxNumber?: string | null;
  address?: AddressInput | null;
  isConsentedForSubstanceUse?: boolean | null;
  isConsentedForHiv?: boolean | null;
  isConsentedForStd?: boolean | null;
  isConsentedForGeneticTesting?: boolean | null;
  isConsentedForFamilyPlanning?: boolean | null;
  isConsentedForMentalHealth?: boolean | null;
  consentDocumentId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientExternalProviderCreate
// ====================================================

export interface patientExternalProviderCreate_patientExternalProviderCreate_patientExternalOrganization {
  id: string;
  name: string;
  isConsentedForSubstanceUse: boolean | null;
  isConsentedForHiv: boolean | null;
  isConsentedForStd: boolean | null;
  isConsentedForGeneticTesting: boolean | null;
  isConsentedForFamilyPlanning: boolean | null;
  consentDocumentId: string | null;
}

export interface patientExternalProviderCreate_patientExternalProviderCreate_email {
  id: string;
  emailAddress: string;
}

export interface patientExternalProviderCreate_patientExternalProviderCreate_phone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
}

export interface patientExternalProviderCreate_patientExternalProviderCreate {
  id: string;
  patientId: string;
  role: ExternalProviderOptions;
  roleFreeText: string | null;
  firstName: string | null;
  lastName: string | null;
  patientExternalOrganizationId: string;
  patientExternalOrganization: patientExternalProviderCreate_patientExternalProviderCreate_patientExternalOrganization;
  description: string | null;
  email: patientExternalProviderCreate_patientExternalProviderCreate_email | null;
  phone: patientExternalProviderCreate_patientExternalProviderCreate_phone;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface patientExternalProviderCreate {
  patientExternalProviderCreate: patientExternalProviderCreate_patientExternalProviderCreate | null;  // Create patient external provider
}

export interface patientExternalProviderCreateVariables {
  patientId: string;
  role: ExternalProviderOptions;
  roleFreeText?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  patientExternalOrganizationId: string;
  description?: string | null;
  email?: EmailCreateInput | null;
  phone: PhoneCreateInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientExternalProviderDelete
// ====================================================

export interface patientExternalProviderDelete_patientExternalProviderDelete_patientExternalOrganization {
  id: string;
  name: string;
  isConsentedForSubstanceUse: boolean | null;
  isConsentedForHiv: boolean | null;
  isConsentedForStd: boolean | null;
  isConsentedForGeneticTesting: boolean | null;
  isConsentedForFamilyPlanning: boolean | null;
  consentDocumentId: string | null;
}

export interface patientExternalProviderDelete_patientExternalProviderDelete_email {
  id: string;
  emailAddress: string;
}

export interface patientExternalProviderDelete_patientExternalProviderDelete_phone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
}

export interface patientExternalProviderDelete_patientExternalProviderDelete {
  id: string;
  patientId: string;
  role: ExternalProviderOptions;
  roleFreeText: string | null;
  firstName: string | null;
  lastName: string | null;
  patientExternalOrganizationId: string;
  patientExternalOrganization: patientExternalProviderDelete_patientExternalProviderDelete_patientExternalOrganization;
  description: string | null;
  email: patientExternalProviderDelete_patientExternalProviderDelete_email | null;
  phone: patientExternalProviderDelete_patientExternalProviderDelete_phone;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface patientExternalProviderDelete {
  patientExternalProviderDelete: patientExternalProviderDelete_patientExternalProviderDelete | null;  // Delete patient external provider
}

export interface patientExternalProviderDeleteVariables {
  patientExternalProviderId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientExternalProviderEdit
// ====================================================

export interface patientExternalProviderEdit_patientExternalProviderEdit_patientExternalOrganization {
  id: string;
  name: string;
  isConsentedForSubstanceUse: boolean | null;
  isConsentedForHiv: boolean | null;
  isConsentedForStd: boolean | null;
  isConsentedForGeneticTesting: boolean | null;
  isConsentedForFamilyPlanning: boolean | null;
  consentDocumentId: string | null;
}

export interface patientExternalProviderEdit_patientExternalProviderEdit_email {
  id: string;
  emailAddress: string;
}

export interface patientExternalProviderEdit_patientExternalProviderEdit_phone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
}

export interface patientExternalProviderEdit_patientExternalProviderEdit {
  id: string;
  patientId: string;
  role: ExternalProviderOptions;
  roleFreeText: string | null;
  firstName: string | null;
  lastName: string | null;
  patientExternalOrganizationId: string;
  patientExternalOrganization: patientExternalProviderEdit_patientExternalProviderEdit_patientExternalOrganization;
  description: string | null;
  email: patientExternalProviderEdit_patientExternalProviderEdit_email | null;
  phone: patientExternalProviderEdit_patientExternalProviderEdit_phone;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface patientExternalProviderEdit {
  patientExternalProviderEdit: patientExternalProviderEdit_patientExternalProviderEdit | null;  // Edit fields on patient external provider stored in the db
}

export interface patientExternalProviderEditVariables {
  patientExternalProviderId: string;
  role?: ExternalProviderOptions | null;
  roleFreeText?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  patientExternalOrganizationId?: string | null;
  description?: string | null;
  email?: EmailInput | null;
  phone?: PhoneInput | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientGlassBreakCreate
// ====================================================

export interface patientGlassBreakCreate_patientGlassBreakCreate {
  id: string;
  patientId: string;
}

export interface patientGlassBreakCreate {
  patientGlassBreakCreate: patientGlassBreakCreate_patientGlassBreakCreate | null;  // creates a patient glass break
}

export interface patientGlassBreakCreateVariables {
  patientId: string;
  reason: string;
  note?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientGoalCreate
// ====================================================

export interface patientGoalCreate_patientGoalCreate_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface patientGoalCreate_patientGoalCreate_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface patientGoalCreate_patientGoalCreate_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: patientGoalCreate_patientGoalCreate_patient_patientInfo;
  patientState: patientGoalCreate_patientGoalCreate_patient_patientState;
}

export interface patientGoalCreate_patientGoalCreate_tasks_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface patientGoalCreate_patientGoalCreate_tasks_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface patientGoalCreate_patientGoalCreate_tasks_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface patientGoalCreate_patientGoalCreate_tasks {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  assignedTo: patientGoalCreate_patientGoalCreate_tasks_assignedTo | null;
  assignedToId: string | null;
  followers: patientGoalCreate_patientGoalCreate_tasks_followers[];
  createdBy: patientGoalCreate_patientGoalCreate_tasks_createdBy;
}

export interface patientGoalCreate_patientGoalCreate {
  id: string;
  title: string;
  patientId: string;
  patient: patientGoalCreate_patientGoalCreate_patient;
  patientConcernId: string | null;
  goalSuggestionTemplateId: string | null;
  tasks: patientGoalCreate_patientGoalCreate_tasks[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface patientGoalCreate {
  patientGoalCreate: patientGoalCreate_patientGoalCreate | null;  // patient goal create
}

export interface patientGoalCreateVariables {
  title?: string | null;
  patientId: string;
  patientConcernId?: string | null;
  goalSuggestionTemplateId?: string | null;
  taskTemplateIds?: (string | null)[] | null;
  concernId?: string | null;
  concernTitle?: string | null;
  startedAt?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientGoalDelete
// ====================================================

export interface patientGoalDelete_patientGoalDelete_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface patientGoalDelete_patientGoalDelete_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface patientGoalDelete_patientGoalDelete_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: patientGoalDelete_patientGoalDelete_patient_patientInfo;
  patientState: patientGoalDelete_patientGoalDelete_patient_patientState;
}

export interface patientGoalDelete_patientGoalDelete_tasks_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface patientGoalDelete_patientGoalDelete_tasks_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface patientGoalDelete_patientGoalDelete_tasks_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface patientGoalDelete_patientGoalDelete_tasks {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  assignedTo: patientGoalDelete_patientGoalDelete_tasks_assignedTo | null;
  assignedToId: string | null;
  followers: patientGoalDelete_patientGoalDelete_tasks_followers[];
  createdBy: patientGoalDelete_patientGoalDelete_tasks_createdBy;
}

export interface patientGoalDelete_patientGoalDelete {
  id: string;
  title: string;
  patientId: string;
  patient: patientGoalDelete_patientGoalDelete_patient;
  patientConcernId: string | null;
  goalSuggestionTemplateId: string | null;
  tasks: patientGoalDelete_patientGoalDelete_tasks[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface patientGoalDelete {
  patientGoalDelete: patientGoalDelete_patientGoalDelete | null;  // patient goal delete
}

export interface patientGoalDeleteVariables {
  patientGoalId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientInfoEdit
// ====================================================

export interface patientInfoEdit_patientInfoEdit_primaryAddress {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface patientInfoEdit_patientInfoEdit_primaryEmail {
  id: string;
  emailAddress: string;
  description: string | null;
}

export interface patientInfoEdit_patientInfoEdit_primaryPhone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
  description: string | null;
}

export interface patientInfoEdit_patientInfoEdit {
  id: string;
  preferredName: string | null;
  gender: Gender | null;
  genderFreeText: string | null;
  transgender: Transgender | null;
  maritalStatus: MaritalStatus | null;
  language: string | null;
  isMarginallyHoused: boolean | null;
  primaryAddress: patientInfoEdit_patientInfoEdit_primaryAddress | null;
  hasEmail: boolean | null;
  primaryEmail: patientInfoEdit_patientInfoEdit_primaryEmail | null;
  primaryPhone: patientInfoEdit_patientInfoEdit_primaryPhone | null;
  preferredContactMethod: ContactMethodOptions | null;
  preferredContactTime: ContactTimeOptions | null;
  canReceiveCalls: boolean | null;
  hasHealthcareProxy: boolean | null;
  hasMolst: boolean | null;
  hasDeclinedPhotoUpload: boolean | null;
  hasUploadedPhoto: boolean | null;
  googleCalendarId: string | null;
}

export interface patientInfoEdit {
  patientInfoEdit: patientInfoEdit_patientInfoEdit | null;  // Edit fields on patient info stored in the db
}

export interface patientInfoEditVariables {
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
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientListCreate
// ====================================================

export interface patientListCreate_patientListCreate {
  id: string;
  title: string;
  answerId: string;
  order: number;
  createdAt: string;
}

export interface patientListCreate {
  patientListCreate: patientListCreate_patientListCreate | null;  // Create a PatientList
}

export interface patientListCreateVariables {
  title: string;
  answerId: string;
  order: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientListDelete
// ====================================================

export interface patientListDelete_patientListDelete {
  id: string;
  title: string;
  answerId: string;
  order: number;
  createdAt: string;
}

export interface patientListDelete {
  patientListDelete: patientListDelete_patientListDelete | null;  // Delete a PatientList
}

export interface patientListDeleteVariables {
  patientListId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientListEdit
// ====================================================

export interface patientListEdit_patientListEdit {
  id: string;
  title: string;
  answerId: string;
  order: number;
  createdAt: string;
}

export interface patientListEdit {
  patientListEdit: patientListEdit_patientListEdit | null;  // Edit a PatientList
}

export interface patientListEditVariables {
  patientListId: string;
  title?: string | null;
  answerId?: string | null;
  order?: number | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientNeedToKnowEdit
// ====================================================

export interface patientNeedToKnowEdit_patientNeedToKnowEdit {
  text: string | null;
}

export interface patientNeedToKnowEdit {
  patientNeedToKnowEdit: patientNeedToKnowEdit_patientNeedToKnowEdit | null;  // Edit a patient need to know
}

export interface patientNeedToKnowEditVariables {
  patientInfoId: string;
  text: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientPhotoSignedUrlCreate
// ====================================================

export interface patientPhotoSignedUrlCreate_patientPhotoSignedUrlCreate {
  signedUrl: string;
}

export interface patientPhotoSignedUrlCreate {
  patientPhotoSignedUrlCreate: patientPhotoSignedUrlCreate_patientPhotoSignedUrlCreate;  // generate a signed URL for patient photo
}

export interface patientPhotoSignedUrlCreateVariables {
  patientId: string;
  action: PatientSignedUrlAction;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientScratchPadEdit
// ====================================================

export interface patientScratchPadEdit_patientScratchPadEdit {
  id: string;
  patientId: string;
  userId: string;
  body: string;
}

export interface patientScratchPadEdit {
  patientScratchPadEdit: patientScratchPadEdit_patientScratchPadEdit | null;  // edits a patient scratch pad
}

export interface patientScratchPadEditVariables {
  patientScratchPadId: string;
  body: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientScreeningToolSubmissionCreate
// ====================================================

export interface patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_screeningTool {
  id: string;
  title: string;
  riskAreaId: string;
}

export interface patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_patient_patientInfo;
  patientState: patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_patient_patientState;
}

export interface patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_user {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions_patient_patientInfo;
  patientState: patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions_patient_patientState;
}

export interface patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions_concern_diagnosisCodes[] | null;
}

export interface patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions_goalSuggestionTemplate_taskTemplates {
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

export interface patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions {
  id: string;
  patientId: string;
  patient: patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_screeningToolScoreRange {
  id: string;
  description: string;
}

export interface patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate {
  id: string;
  screeningToolId: string;
  screeningTool: patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_screeningTool;
  patientId: string;
  patient: patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_patient;
  userId: string;
  user: patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_user;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  scoredAt: string | null;
  carePlanSuggestions: patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_carePlanSuggestions[];
  screeningToolScoreRangeId: string | null;
  screeningToolScoreRange: patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate_screeningToolScoreRange | null;
}

export interface patientScreeningToolSubmissionCreate {
  patientScreeningToolSubmissionCreate: patientScreeningToolSubmissionCreate_patientScreeningToolSubmissionCreate | null;  // patient screening tool submission create
}

export interface patientScreeningToolSubmissionCreateVariables {
  patientId: string;
  screeningToolId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: patientScreeningToolSubmissionScore
// ====================================================

export interface patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_screeningTool {
  id: string;
  title: string;
  riskAreaId: string;
}

export interface patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_patient_patientInfo;
  patientState: patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_patient_patientState;
}

export interface patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_user {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions_patient_patientInfo;
  patientState: patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions_patient_patientState;
}

export interface patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions_concern_diagnosisCodes[] | null;
}

export interface patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions_goalSuggestionTemplate_taskTemplates {
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

export interface patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions {
  id: string;
  patientId: string;
  patient: patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_screeningToolScoreRange {
  id: string;
  description: string;
}

export interface patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore {
  id: string;
  screeningToolId: string;
  screeningTool: patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_screeningTool;
  patientId: string;
  patient: patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_patient;
  userId: string;
  user: patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_user;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  scoredAt: string | null;
  carePlanSuggestions: patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_carePlanSuggestions[];
  screeningToolScoreRangeId: string | null;
  screeningToolScoreRange: patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore_screeningToolScoreRange | null;
}

export interface patientScreeningToolSubmissionScore {
  patientScreeningToolSubmissionScore: patientScreeningToolSubmissionScore_patientScreeningToolSubmissionScore | null;  // patient screening tool submission score
}

export interface patientScreeningToolSubmissionScoreVariables {
  patientScreeningToolSubmissionId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: phoneCreateForPatient
// ====================================================

export interface phoneCreateForPatient_phoneCreateForPatient {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
  description: string | null;
}

export interface phoneCreateForPatient {
  phoneCreateForPatient: phoneCreateForPatient_phoneCreateForPatient | null;  // Create a phone number for a Patient
}

export interface phoneCreateForPatientVariables {
  patientId: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
  description?: string | null;
  isPrimary?: boolean | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: phoneCreate
// ====================================================

export interface phoneCreate_phoneCreate {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
  description: string | null;
}

export interface phoneCreate {
  phoneCreate: phoneCreate_phoneCreate | null;  // Create a phone number
}

export interface phoneCreateVariables {
  phoneNumber: string;
  type: PhoneTypeOptions;
  description?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: phoneDeleteForPatient
// ====================================================

export interface phoneDeleteForPatient_phoneDeleteForPatient {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
  description: string | null;
}

export interface phoneDeleteForPatient {
  phoneDeleteForPatient: phoneDeleteForPatient_phoneDeleteForPatient | null;  // Delete a phone number for a Patient
}

export interface phoneDeleteForPatientVariables {
  phoneId: string;
  patientId: string;
  isPrimary?: boolean | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: progressNoteAddSupervisorNotes
// ====================================================

export interface progressNoteAddSupervisorNotes_progressNoteAddSupervisorNotes_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface progressNoteAddSupervisorNotes_progressNoteAddSupervisorNotes_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface progressNoteAddSupervisorNotes_progressNoteAddSupervisorNotes_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface progressNoteAddSupervisorNotes_progressNoteAddSupervisorNotes_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: progressNoteAddSupervisorNotes_progressNoteAddSupervisorNotes_patient_patientInfo;
  patientState: progressNoteAddSupervisorNotes_progressNoteAddSupervisorNotes_patient_patientState;
}

export interface progressNoteAddSupervisorNotes_progressNoteAddSupervisorNotes_supervisor {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface progressNoteAddSupervisorNotes_progressNoteAddSupervisorNotes_progressNoteTemplate {
  id: string;
  title: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface progressNoteAddSupervisorNotes_progressNoteAddSupervisorNotes {
  id: string;
  patientId: string;
  user: progressNoteAddSupervisorNotes_progressNoteAddSupervisorNotes_user;
  patient: progressNoteAddSupervisorNotes_progressNoteAddSupervisorNotes_patient;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  summary: string | null;
  memberConcern: string | null;
  startedAt: string | null;
  location: string | null;
  deletedAt: string | null;
  needsSupervisorReview: boolean | null;
  reviewedBySupervisorAt: string | null;
  supervisorNotes: string | null;
  supervisor: progressNoteAddSupervisorNotes_progressNoteAddSupervisorNotes_supervisor | null;
  progressNoteTemplate: progressNoteAddSupervisorNotes_progressNoteAddSupervisorNotes_progressNoteTemplate | null;
  worryScore: number | null;
}

export interface progressNoteAddSupervisorNotes {
  progressNoteAddSupervisorNotes: progressNoteAddSupervisorNotes_progressNoteAddSupervisorNotes | null;  // add or edit supervisor notes
}

export interface progressNoteAddSupervisorNotesVariables {
  progressNoteId: string;
  supervisorNotes: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: progressNoteComplete
// ====================================================

export interface progressNoteComplete_progressNoteComplete_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface progressNoteComplete_progressNoteComplete_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface progressNoteComplete_progressNoteComplete_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface progressNoteComplete_progressNoteComplete_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: progressNoteComplete_progressNoteComplete_patient_patientInfo;
  patientState: progressNoteComplete_progressNoteComplete_patient_patientState;
}

export interface progressNoteComplete_progressNoteComplete_supervisor {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface progressNoteComplete_progressNoteComplete_progressNoteTemplate {
  id: string;
  title: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface progressNoteComplete_progressNoteComplete {
  id: string;
  patientId: string;
  user: progressNoteComplete_progressNoteComplete_user;
  patient: progressNoteComplete_progressNoteComplete_patient;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  summary: string | null;
  memberConcern: string | null;
  startedAt: string | null;
  location: string | null;
  deletedAt: string | null;
  needsSupervisorReview: boolean | null;
  reviewedBySupervisorAt: string | null;
  supervisorNotes: string | null;
  supervisor: progressNoteComplete_progressNoteComplete_supervisor | null;
  progressNoteTemplate: progressNoteComplete_progressNoteComplete_progressNoteTemplate | null;
  worryScore: number | null;
}

export interface progressNoteComplete {
  progressNoteComplete: progressNoteComplete_progressNoteComplete | null;  // completes a progress note
}

export interface progressNoteCompleteVariables {
  progressNoteId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: progressNoteCompleteSupervisorReview
// ====================================================

export interface progressNoteCompleteSupervisorReview_progressNoteCompleteSupervisorReview_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface progressNoteCompleteSupervisorReview_progressNoteCompleteSupervisorReview_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface progressNoteCompleteSupervisorReview_progressNoteCompleteSupervisorReview_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface progressNoteCompleteSupervisorReview_progressNoteCompleteSupervisorReview_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: progressNoteCompleteSupervisorReview_progressNoteCompleteSupervisorReview_patient_patientInfo;
  patientState: progressNoteCompleteSupervisorReview_progressNoteCompleteSupervisorReview_patient_patientState;
}

export interface progressNoteCompleteSupervisorReview_progressNoteCompleteSupervisorReview_supervisor {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface progressNoteCompleteSupervisorReview_progressNoteCompleteSupervisorReview_progressNoteTemplate {
  id: string;
  title: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface progressNoteCompleteSupervisorReview_progressNoteCompleteSupervisorReview {
  id: string;
  patientId: string;
  user: progressNoteCompleteSupervisorReview_progressNoteCompleteSupervisorReview_user;
  patient: progressNoteCompleteSupervisorReview_progressNoteCompleteSupervisorReview_patient;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  summary: string | null;
  memberConcern: string | null;
  startedAt: string | null;
  location: string | null;
  deletedAt: string | null;
  needsSupervisorReview: boolean | null;
  reviewedBySupervisorAt: string | null;
  supervisorNotes: string | null;
  supervisor: progressNoteCompleteSupervisorReview_progressNoteCompleteSupervisorReview_supervisor | null;
  progressNoteTemplate: progressNoteCompleteSupervisorReview_progressNoteCompleteSupervisorReview_progressNoteTemplate | null;
  worryScore: number | null;
}

export interface progressNoteCompleteSupervisorReview {
  progressNoteCompleteSupervisorReview: progressNoteCompleteSupervisorReview_progressNoteCompleteSupervisorReview | null;  // closes out supervisor review
}

export interface progressNoteCompleteSupervisorReviewVariables {
  progressNoteId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: progressNoteCreate
// ====================================================

export interface progressNoteCreate_progressNoteCreate_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface progressNoteCreate_progressNoteCreate_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface progressNoteCreate_progressNoteCreate_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface progressNoteCreate_progressNoteCreate_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: progressNoteCreate_progressNoteCreate_patient_patientInfo;
  patientState: progressNoteCreate_progressNoteCreate_patient_patientState;
}

export interface progressNoteCreate_progressNoteCreate_supervisor {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface progressNoteCreate_progressNoteCreate_progressNoteTemplate {
  id: string;
  title: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface progressNoteCreate_progressNoteCreate {
  id: string;
  patientId: string;
  user: progressNoteCreate_progressNoteCreate_user;
  patient: progressNoteCreate_progressNoteCreate_patient;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  summary: string | null;
  memberConcern: string | null;
  startedAt: string | null;
  location: string | null;
  deletedAt: string | null;
  needsSupervisorReview: boolean | null;
  reviewedBySupervisorAt: string | null;
  supervisorNotes: string | null;
  supervisor: progressNoteCreate_progressNoteCreate_supervisor | null;
  progressNoteTemplate: progressNoteCreate_progressNoteCreate_progressNoteTemplate | null;
  worryScore: number | null;
}

export interface progressNoteCreate {
  progressNoteCreate: progressNoteCreate_progressNoteCreate | null;  // creates a progress note
}

export interface progressNoteCreateVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: progressNoteEdit
// ====================================================

export interface progressNoteEdit_progressNoteEdit_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface progressNoteEdit_progressNoteEdit_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface progressNoteEdit_progressNoteEdit_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface progressNoteEdit_progressNoteEdit_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: progressNoteEdit_progressNoteEdit_patient_patientInfo;
  patientState: progressNoteEdit_progressNoteEdit_patient_patientState;
}

export interface progressNoteEdit_progressNoteEdit_supervisor {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface progressNoteEdit_progressNoteEdit_progressNoteTemplate {
  id: string;
  title: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface progressNoteEdit_progressNoteEdit {
  id: string;
  patientId: string;
  user: progressNoteEdit_progressNoteEdit_user;
  patient: progressNoteEdit_progressNoteEdit_patient;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  summary: string | null;
  memberConcern: string | null;
  startedAt: string | null;
  location: string | null;
  deletedAt: string | null;
  needsSupervisorReview: boolean | null;
  reviewedBySupervisorAt: string | null;
  supervisorNotes: string | null;
  supervisor: progressNoteEdit_progressNoteEdit_supervisor | null;
  progressNoteTemplate: progressNoteEdit_progressNoteEdit_progressNoteTemplate | null;
  worryScore: number | null;
}

export interface progressNoteEdit {
  progressNoteEdit: progressNoteEdit_progressNoteEdit | null;  // edits a progress note
}

export interface progressNoteEditVariables {
  progressNoteId: string;
  progressNoteTemplateId?: string | null;
  startedAt?: string | null;
  location?: string | null;
  summary?: string | null;
  memberConcern?: string | null;
  needsSupervisorReview?: boolean | null;
  supervisorId?: string | null;
  worryScore?: number | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: progressNoteGlassBreakCreate
// ====================================================

export interface progressNoteGlassBreakCreate_progressNoteGlassBreakCreate {
  id: string;
  progressNoteId: string;
}

export interface progressNoteGlassBreakCreate {
  progressNoteGlassBreakCreate: progressNoteGlassBreakCreate_progressNoteGlassBreakCreate | null;  // creates a progress note glass break
}

export interface progressNoteGlassBreakCreateVariables {
  progressNoteId: string;
  reason: string;
  note?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: progressNoteTemplateCreate
// ====================================================

export interface progressNoteTemplateCreate_progressNoteTemplateCreate {
  id: string;
  title: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface progressNoteTemplateCreate {
  progressNoteTemplateCreate: progressNoteTemplateCreate_progressNoteTemplateCreate | null;  // create a progress note template
}

export interface progressNoteTemplateCreateVariables {
  title: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: progressNoteTemplateDelete
// ====================================================

export interface progressNoteTemplateDelete_progressNoteTemplateDelete {
  id: string;
  title: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface progressNoteTemplateDelete {
  progressNoteTemplateDelete: progressNoteTemplateDelete_progressNoteTemplateDelete | null;  // deletes a progress note template
}

export interface progressNoteTemplateDeleteVariables {
  progressNoteTemplateId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: progressNoteTemplateEdit
// ====================================================

export interface progressNoteTemplateEdit_progressNoteTemplateEdit {
  id: string;
  title: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface progressNoteTemplateEdit {
  progressNoteTemplateEdit: progressNoteTemplateEdit_progressNoteTemplateEdit | null;  // edits a progress note template
}

export interface progressNoteTemplateEditVariables {
  title: string;
  progressNoteTemplateId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: questionConditionCreate
// ====================================================

export interface questionConditionCreate_questionConditionCreate {
  id: string;
  questionId: string;
  answerId: string;
}

export interface questionConditionCreate {
  questionConditionCreate: questionConditionCreate_questionConditionCreate | null;  // Create a QuestionCondition
}

export interface questionConditionCreateVariables {
  answerId: string;
  questionId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: questionConditionDelete
// ====================================================

export interface questionConditionDelete_questionConditionDelete {
  id: string;
  questionId: string;
  answerId: string;
}

export interface questionConditionDelete {
  questionConditionDelete: questionConditionDelete_questionConditionDelete | null;  // Deletes a QuestionCondition
}

export interface questionConditionDeleteVariables {
  questionConditionId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: questionConditionEdit
// ====================================================

export interface questionConditionEdit_questionConditionEdit {
  id: string;
  questionId: string;
  answerId: string;
}

export interface questionConditionEdit {
  questionConditionEdit: questionConditionEdit_questionConditionEdit | null;  // Edit a QuestionCondition
}

export interface questionConditionEditVariables {
  questionConditionId: string;
  answerId: string;
  questionId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: questionCreate
// ====================================================

export interface questionCreate_questionCreate_answers_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface questionCreate_questionCreate_answers_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: questionCreate_questionCreate_answers_concernSuggestions_diagnosisCodes[] | null;
}

export interface questionCreate_questionCreate_answers_goalSuggestions_taskTemplates {
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

export interface questionCreate_questionCreate_answers_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: questionCreate_questionCreate_answers_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface questionCreate_questionCreate_answers_riskArea {
  id: string;
  title: string;
}

export interface questionCreate_questionCreate_answers_screeningTool {
  id: string;
  title: string;
}

export interface questionCreate_questionCreate_answers {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: questionCreate_questionCreate_answers_concernSuggestions[] | null;
  goalSuggestions: (questionCreate_questionCreate_answers_goalSuggestions | null)[] | null;
  riskArea: questionCreate_questionCreate_answers_riskArea | null;
  screeningTool: questionCreate_questionCreate_answers_screeningTool | null;
}

export interface questionCreate_questionCreate_applicableIfQuestionConditions {
  id: string;
  questionId: string;
  answerId: string;
}

export interface questionCreate_questionCreate_computedField {
  id: string;
  label: string;
  slug: string;
  dataType: ComputedFieldDataTypes;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface questionCreate_questionCreate {
  id: string;
  createdAt: string;
  deletedAt: string | null;
  title: string;
  validatedSource: string | null;
  answerType: AnswerTypeOptions;
  riskAreaId: string | null;
  screeningToolId: string | null;
  order: number;
  applicableIfType: QuestionConditionTypeOptions | null;
  otherTextAnswerId: string | null;
  answers: questionCreate_questionCreate_answers[] | null;
  applicableIfQuestionConditions: questionCreate_questionCreate_applicableIfQuestionConditions[];
  computedFieldId: string | null;
  computedField: questionCreate_questionCreate_computedField | null;
}

export interface questionCreate {
  questionCreate: questionCreate_questionCreate | null;  // Create a Question
}

export interface questionCreateVariables {
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


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: questionDelete
// ====================================================

export interface questionDelete_questionDelete_answers_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface questionDelete_questionDelete_answers_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: questionDelete_questionDelete_answers_concernSuggestions_diagnosisCodes[] | null;
}

export interface questionDelete_questionDelete_answers_goalSuggestions_taskTemplates {
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

export interface questionDelete_questionDelete_answers_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: questionDelete_questionDelete_answers_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface questionDelete_questionDelete_answers_riskArea {
  id: string;
  title: string;
}

export interface questionDelete_questionDelete_answers_screeningTool {
  id: string;
  title: string;
}

export interface questionDelete_questionDelete_answers {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: questionDelete_questionDelete_answers_concernSuggestions[] | null;
  goalSuggestions: (questionDelete_questionDelete_answers_goalSuggestions | null)[] | null;
  riskArea: questionDelete_questionDelete_answers_riskArea | null;
  screeningTool: questionDelete_questionDelete_answers_screeningTool | null;
}

export interface questionDelete_questionDelete_applicableIfQuestionConditions {
  id: string;
  questionId: string;
  answerId: string;
}

export interface questionDelete_questionDelete_computedField {
  id: string;
  label: string;
  slug: string;
  dataType: ComputedFieldDataTypes;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface questionDelete_questionDelete {
  id: string;
  createdAt: string;
  deletedAt: string | null;
  title: string;
  validatedSource: string | null;
  answerType: AnswerTypeOptions;
  riskAreaId: string | null;
  screeningToolId: string | null;
  order: number;
  applicableIfType: QuestionConditionTypeOptions | null;
  otherTextAnswerId: string | null;
  answers: questionDelete_questionDelete_answers[] | null;
  applicableIfQuestionConditions: questionDelete_questionDelete_applicableIfQuestionConditions[];
  computedFieldId: string | null;
  computedField: questionDelete_questionDelete_computedField | null;
}

export interface questionDelete {
  questionDelete: questionDelete_questionDelete | null;  // Delete a question
}

export interface questionDeleteVariables {
  questionId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: questionEdit
// ====================================================

export interface questionEdit_questionEdit_answers_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface questionEdit_questionEdit_answers_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: questionEdit_questionEdit_answers_concernSuggestions_diagnosisCodes[] | null;
}

export interface questionEdit_questionEdit_answers_goalSuggestions_taskTemplates {
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

export interface questionEdit_questionEdit_answers_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: questionEdit_questionEdit_answers_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface questionEdit_questionEdit_answers_riskArea {
  id: string;
  title: string;
}

export interface questionEdit_questionEdit_answers_screeningTool {
  id: string;
  title: string;
}

export interface questionEdit_questionEdit_answers {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: questionEdit_questionEdit_answers_concernSuggestions[] | null;
  goalSuggestions: (questionEdit_questionEdit_answers_goalSuggestions | null)[] | null;
  riskArea: questionEdit_questionEdit_answers_riskArea | null;
  screeningTool: questionEdit_questionEdit_answers_screeningTool | null;
}

export interface questionEdit_questionEdit_applicableIfQuestionConditions {
  id: string;
  questionId: string;
  answerId: string;
}

export interface questionEdit_questionEdit_computedField {
  id: string;
  label: string;
  slug: string;
  dataType: ComputedFieldDataTypes;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface questionEdit_questionEdit {
  id: string;
  createdAt: string;
  deletedAt: string | null;
  title: string;
  validatedSource: string | null;
  answerType: AnswerTypeOptions;
  riskAreaId: string | null;
  screeningToolId: string | null;
  order: number;
  applicableIfType: QuestionConditionTypeOptions | null;
  otherTextAnswerId: string | null;
  answers: questionEdit_questionEdit_answers[] | null;
  applicableIfQuestionConditions: questionEdit_questionEdit_applicableIfQuestionConditions[];
  computedFieldId: string | null;
  computedField: questionEdit_questionEdit_computedField | null;
}

export interface questionEdit {
  questionEdit: questionEdit_questionEdit | null;  // Edit a Question
}

export interface questionEditVariables {
  questionId: string;
  title?: string | null;
  answerType?: AnswerTypeOptions | null;
  validatedSource?: string | null;
  order?: number | null;
  applicableIfType?: QuestionConditionTypeOptions | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: quickCallCreate
// ====================================================

export interface quickCallCreate_quickCallCreate_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface quickCallCreate_quickCallCreate {
  id: string;
  userId: string;
  user: quickCallCreate_quickCallCreate_user;
  progressNoteId: string;
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

export interface quickCallCreate {
  quickCallCreate: quickCallCreate_quickCallCreate | null;  // creates a quick call
}

export interface quickCallCreateVariables {
  patientId: string;
  reason: string;
  summary: string;
  direction: QuickCallDirection;
  callRecipient: string;
  wasSuccessful: boolean;
  startTime: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: riskAreaAssessmentSubmissionComplete
// ====================================================

export interface riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions_patient_patientInfo;
  patientState: riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions_patient_patientState;
}

export interface riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions_concern_diagnosisCodes[] | null;
}

export interface riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions_goalSuggestionTemplate_taskTemplates {
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

export interface riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions {
  id: string;
  patientId: string;
  patient: riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete {
  id: string;
  riskAreaId: string;
  patientId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  completedAt: string | null;
  carePlanSuggestions: riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete_carePlanSuggestions[];
}

export interface riskAreaAssessmentSubmissionComplete {
  riskAreaAssessmentSubmissionComplete: riskAreaAssessmentSubmissionComplete_riskAreaAssessmentSubmissionComplete | null;  // risk area assessment submission complete
}

export interface riskAreaAssessmentSubmissionCompleteVariables {
  riskAreaAssessmentSubmissionId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: riskAreaAssessmentSubmissionCreate
// ====================================================

export interface riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions_patient_patientInfo;
  patientState: riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions_patient_patientState;
}

export interface riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions_concern_diagnosisCodes[] | null;
}

export interface riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions_goalSuggestionTemplate_taskTemplates {
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

export interface riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions {
  id: string;
  patientId: string;
  patient: riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate {
  id: string;
  riskAreaId: string;
  patientId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  completedAt: string | null;
  carePlanSuggestions: riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate_carePlanSuggestions[];
}

export interface riskAreaAssessmentSubmissionCreate {
  riskAreaAssessmentSubmissionCreate: riskAreaAssessmentSubmissionCreate_riskAreaAssessmentSubmissionCreate | null;  // risk area assessment submission create
}

export interface riskAreaAssessmentSubmissionCreateVariables {
  riskAreaId: string;
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: riskAreaCreate
// ====================================================

export interface riskAreaCreate_riskAreaCreate {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  assessmentType: AssessmentType;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  riskAreaGroupId: string;
}

export interface riskAreaCreate {
  riskAreaCreate: riskAreaCreate_riskAreaCreate | null;  // Create a RiskArea
}

export interface riskAreaCreateVariables {
  title: string;
  assessmentType: AssessmentType;
  riskAreaGroupId: string;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: riskAreaDelete
// ====================================================

export interface riskAreaDelete_riskAreaDelete {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  assessmentType: AssessmentType;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  riskAreaGroupId: string;
}

export interface riskAreaDelete {
  riskAreaDelete: riskAreaDelete_riskAreaDelete | null;  // Deletes a RiskArea
}

export interface riskAreaDeleteVariables {
  riskAreaId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: riskAreaEdit
// ====================================================

export interface riskAreaEdit_riskAreaEdit {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  assessmentType: AssessmentType;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  riskAreaGroupId: string;
}

export interface riskAreaEdit {
  riskAreaEdit: riskAreaEdit_riskAreaEdit | null;  // Edit a RiskArea
}

export interface riskAreaEditVariables {
  riskAreaId: string;
  title?: string | null;
  order?: number | null;
  mediumRiskThreshold?: number | null;
  highRiskThreshold?: number | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: riskAreaGroupCreate
// ====================================================

export interface riskAreaGroupCreate_riskAreaGroupCreate {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  shortTitle: string;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
}

export interface riskAreaGroupCreate {
  riskAreaGroupCreate: riskAreaGroupCreate_riskAreaGroupCreate | null;  // Create a RiskAreaGroup
}

export interface riskAreaGroupCreateVariables {
  title: string;
  shortTitle: string;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: riskAreaGroupDelete
// ====================================================

export interface riskAreaGroupDelete_riskAreaGroupDelete {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  shortTitle: string;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
}

export interface riskAreaGroupDelete {
  riskAreaGroupDelete: riskAreaGroupDelete_riskAreaGroupDelete | null;  // Delete a RiskAreaGroup
}

export interface riskAreaGroupDeleteVariables {
  riskAreaGroupId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: riskAreaGroupEdit
// ====================================================

export interface riskAreaGroupEdit_riskAreaGroupEdit {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  shortTitle: string;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
}

export interface riskAreaGroupEdit {
  riskAreaGroupEdit: riskAreaGroupEdit_riskAreaGroupEdit | null;  // Edit a RiskAreaGroup
}

export interface riskAreaGroupEditVariables {
  riskAreaGroupId: string;
  title?: string | null;
  shortTitle?: string | null;
  order?: number | null;
  mediumRiskThreshold?: number | null;
  highRiskThreshold?: number | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: screeningToolCreate
// ====================================================

export interface screeningToolCreate_screeningToolCreate_screeningToolScoreRanges_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface screeningToolCreate_screeningToolCreate_screeningToolScoreRanges_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: screeningToolCreate_screeningToolCreate_screeningToolScoreRanges_concernSuggestions_diagnosisCodes[] | null;
}

export interface screeningToolCreate_screeningToolCreate_screeningToolScoreRanges_goalSuggestions_taskTemplates {
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

export interface screeningToolCreate_screeningToolCreate_screeningToolScoreRanges_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: screeningToolCreate_screeningToolCreate_screeningToolScoreRanges_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface screeningToolCreate_screeningToolCreate_screeningToolScoreRanges {
  id: string;
  description: string;
  minimumScore: number;
  maximumScore: number;
  screeningToolId: string;
  riskAdjustmentType: RiskAdjustmentTypeOptions;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  concernSuggestions: screeningToolCreate_screeningToolCreate_screeningToolScoreRanges_concernSuggestions[];
  goalSuggestions: (screeningToolCreate_screeningToolCreate_screeningToolScoreRanges_goalSuggestions | null)[] | null;
}

export interface screeningToolCreate_screeningToolCreate_patientScreeningToolSubmissions {
  id: string;
  screeningToolId: string;
  patientId: string;
  userId: string;
  score: number | null;
  screeningToolScoreRangeId: string | null;
}

export interface screeningToolCreate_screeningToolCreate {
  id: string;
  title: string;
  riskAreaId: string;
  screeningToolScoreRanges: screeningToolCreate_screeningToolCreate_screeningToolScoreRanges[];
  patientScreeningToolSubmissions: screeningToolCreate_screeningToolCreate_patientScreeningToolSubmissions[] | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface screeningToolCreate {
  screeningToolCreate: screeningToolCreate_screeningToolCreate | null;  // screening tool create
}

export interface screeningToolCreateVariables {
  title: string;
  riskAreaId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: screeningToolDelete
// ====================================================

export interface screeningToolDelete_screeningToolDelete_screeningToolScoreRanges_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface screeningToolDelete_screeningToolDelete_screeningToolScoreRanges_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: screeningToolDelete_screeningToolDelete_screeningToolScoreRanges_concernSuggestions_diagnosisCodes[] | null;
}

export interface screeningToolDelete_screeningToolDelete_screeningToolScoreRanges_goalSuggestions_taskTemplates {
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

export interface screeningToolDelete_screeningToolDelete_screeningToolScoreRanges_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: screeningToolDelete_screeningToolDelete_screeningToolScoreRanges_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface screeningToolDelete_screeningToolDelete_screeningToolScoreRanges {
  id: string;
  description: string;
  minimumScore: number;
  maximumScore: number;
  screeningToolId: string;
  riskAdjustmentType: RiskAdjustmentTypeOptions;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  concernSuggestions: screeningToolDelete_screeningToolDelete_screeningToolScoreRanges_concernSuggestions[];
  goalSuggestions: (screeningToolDelete_screeningToolDelete_screeningToolScoreRanges_goalSuggestions | null)[] | null;
}

export interface screeningToolDelete_screeningToolDelete_patientScreeningToolSubmissions {
  id: string;
  screeningToolId: string;
  patientId: string;
  userId: string;
  score: number | null;
  screeningToolScoreRangeId: string | null;
}

export interface screeningToolDelete_screeningToolDelete {
  id: string;
  title: string;
  riskAreaId: string;
  screeningToolScoreRanges: screeningToolDelete_screeningToolDelete_screeningToolScoreRanges[];
  patientScreeningToolSubmissions: screeningToolDelete_screeningToolDelete_patientScreeningToolSubmissions[] | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface screeningToolDelete {
  screeningToolDelete: screeningToolDelete_screeningToolDelete | null;  // screening tool delete
}

export interface screeningToolDeleteVariables {
  screeningToolId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: screeningToolEdit
// ====================================================

export interface screeningToolEdit_screeningToolEdit_screeningToolScoreRanges_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface screeningToolEdit_screeningToolEdit_screeningToolScoreRanges_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: screeningToolEdit_screeningToolEdit_screeningToolScoreRanges_concernSuggestions_diagnosisCodes[] | null;
}

export interface screeningToolEdit_screeningToolEdit_screeningToolScoreRanges_goalSuggestions_taskTemplates {
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

export interface screeningToolEdit_screeningToolEdit_screeningToolScoreRanges_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: screeningToolEdit_screeningToolEdit_screeningToolScoreRanges_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface screeningToolEdit_screeningToolEdit_screeningToolScoreRanges {
  id: string;
  description: string;
  minimumScore: number;
  maximumScore: number;
  screeningToolId: string;
  riskAdjustmentType: RiskAdjustmentTypeOptions;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  concernSuggestions: screeningToolEdit_screeningToolEdit_screeningToolScoreRanges_concernSuggestions[];
  goalSuggestions: (screeningToolEdit_screeningToolEdit_screeningToolScoreRanges_goalSuggestions | null)[] | null;
}

export interface screeningToolEdit_screeningToolEdit_patientScreeningToolSubmissions {
  id: string;
  screeningToolId: string;
  patientId: string;
  userId: string;
  score: number | null;
  screeningToolScoreRangeId: string | null;
}

export interface screeningToolEdit_screeningToolEdit {
  id: string;
  title: string;
  riskAreaId: string;
  screeningToolScoreRanges: screeningToolEdit_screeningToolEdit_screeningToolScoreRanges[];
  patientScreeningToolSubmissions: screeningToolEdit_screeningToolEdit_patientScreeningToolSubmissions[] | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface screeningToolEdit {
  screeningToolEdit: screeningToolEdit_screeningToolEdit | null;  // screening tool edit
}

export interface screeningToolEditVariables {
  screeningToolId: string;
  title?: string | null;
  riskAreaId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: screeningToolScoreRangeCreate
// ====================================================

export interface screeningToolScoreRangeCreate_screeningToolScoreRangeCreate_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface screeningToolScoreRangeCreate_screeningToolScoreRangeCreate_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: screeningToolScoreRangeCreate_screeningToolScoreRangeCreate_concernSuggestions_diagnosisCodes[] | null;
}

export interface screeningToolScoreRangeCreate_screeningToolScoreRangeCreate_goalSuggestions_taskTemplates {
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

export interface screeningToolScoreRangeCreate_screeningToolScoreRangeCreate_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: screeningToolScoreRangeCreate_screeningToolScoreRangeCreate_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface screeningToolScoreRangeCreate_screeningToolScoreRangeCreate {
  id: string;
  description: string;
  minimumScore: number;
  maximumScore: number;
  screeningToolId: string;
  riskAdjustmentType: RiskAdjustmentTypeOptions;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  concernSuggestions: screeningToolScoreRangeCreate_screeningToolScoreRangeCreate_concernSuggestions[];
  goalSuggestions: (screeningToolScoreRangeCreate_screeningToolScoreRangeCreate_goalSuggestions | null)[] | null;
}

export interface screeningToolScoreRangeCreate {
  screeningToolScoreRangeCreate: screeningToolScoreRangeCreate_screeningToolScoreRangeCreate | null;  // screening tool score range create
}

export interface screeningToolScoreRangeCreateVariables {
  description: string;
  screeningToolId: string;
  minimumScore: number;
  maximumScore: number;
  riskAdjustmentType: RiskAdjustmentTypeOptions;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: screeningToolScoreRangeDelete
// ====================================================

export interface screeningToolScoreRangeDelete_screeningToolScoreRangeDelete_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface screeningToolScoreRangeDelete_screeningToolScoreRangeDelete_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: screeningToolScoreRangeDelete_screeningToolScoreRangeDelete_concernSuggestions_diagnosisCodes[] | null;
}

export interface screeningToolScoreRangeDelete_screeningToolScoreRangeDelete_goalSuggestions_taskTemplates {
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

export interface screeningToolScoreRangeDelete_screeningToolScoreRangeDelete_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: screeningToolScoreRangeDelete_screeningToolScoreRangeDelete_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface screeningToolScoreRangeDelete_screeningToolScoreRangeDelete {
  id: string;
  description: string;
  minimumScore: number;
  maximumScore: number;
  screeningToolId: string;
  riskAdjustmentType: RiskAdjustmentTypeOptions;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  concernSuggestions: screeningToolScoreRangeDelete_screeningToolScoreRangeDelete_concernSuggestions[];
  goalSuggestions: (screeningToolScoreRangeDelete_screeningToolScoreRangeDelete_goalSuggestions | null)[] | null;
}

export interface screeningToolScoreRangeDelete {
  screeningToolScoreRangeDelete: screeningToolScoreRangeDelete_screeningToolScoreRangeDelete | null;  // screening tool score range delete
}

export interface screeningToolScoreRangeDeleteVariables {
  screeningToolScoreRangeId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: screeningToolScoreRangeEdit
// ====================================================

export interface screeningToolScoreRangeEdit_screeningToolScoreRangeEdit_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface screeningToolScoreRangeEdit_screeningToolScoreRangeEdit_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: screeningToolScoreRangeEdit_screeningToolScoreRangeEdit_concernSuggestions_diagnosisCodes[] | null;
}

export interface screeningToolScoreRangeEdit_screeningToolScoreRangeEdit_goalSuggestions_taskTemplates {
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

export interface screeningToolScoreRangeEdit_screeningToolScoreRangeEdit_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: screeningToolScoreRangeEdit_screeningToolScoreRangeEdit_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface screeningToolScoreRangeEdit_screeningToolScoreRangeEdit {
  id: string;
  description: string;
  minimumScore: number;
  maximumScore: number;
  screeningToolId: string;
  riskAdjustmentType: RiskAdjustmentTypeOptions;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  concernSuggestions: screeningToolScoreRangeEdit_screeningToolScoreRangeEdit_concernSuggestions[];
  goalSuggestions: (screeningToolScoreRangeEdit_screeningToolScoreRangeEdit_goalSuggestions | null)[] | null;
}

export interface screeningToolScoreRangeEdit {
  screeningToolScoreRangeEdit: screeningToolScoreRangeEdit_screeningToolScoreRangeEdit | null;  // screening tool score range edit
}

export interface screeningToolScoreRangeEditVariables {
  screeningToolScoreRangeId: string;
  description?: string | null;
  screeningToolId?: string | null;
  minimumScore?: number | null;
  maximumScore?: number | null;
  riskAdjustmentType?: RiskAdjustmentTypeOptions | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: smsMessageCreate
// ====================================================

export interface smsMessageCreate_smsMessageCreate_node {
  id: string;
  userId: string;
  contactNumber: string;
  patientId: string | null;
  direction: SmsMessageDirection;
  body: string;
  createdAt: string;
}

export interface smsMessageCreate_smsMessageCreate {
  node: smsMessageCreate_smsMessageCreate_node;
}

export interface smsMessageCreate {
  smsMessageCreate: smsMessageCreate_smsMessageCreate;  // create a SMS message (returns node so fits into paginated results)
}

export interface smsMessageCreateVariables {
  patientId: string;
  body: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: smsMessageCreated
// ====================================================

export interface smsMessageCreated_smsMessageCreated_node {
  id: string;
  userId: string;
  contactNumber: string;
  patientId: string | null;
  direction: SmsMessageDirection;
  body: string;
  createdAt: string;
}

export interface smsMessageCreated_smsMessageCreated {
  node: smsMessageCreated_smsMessageCreated_node;
}

export interface smsMessageCreated {
  smsMessageCreated: smsMessageCreated_smsMessageCreated;
}

export interface smsMessageCreatedVariables {
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: taskCommentCreate
// ====================================================

export interface taskCommentCreate_taskCommentCreate_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface taskCommentCreate_taskCommentCreate {
  id: string;
  body: string;
  user: taskCommentCreate_taskCommentCreate_user;
  taskId: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface taskCommentCreate {
  taskCommentCreate: taskCommentCreate_taskCommentCreate | null;  // Create a task
}

export interface taskCommentCreateVariables {
  taskId: string;
  body: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: taskCommentEdit
// ====================================================

export interface taskCommentEdit_taskCommentEdit_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface taskCommentEdit_taskCommentEdit {
  id: string;
  body: string;
  user: taskCommentEdit_taskCommentEdit_user;
  taskId: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface taskCommentEdit {
  taskCommentEdit: taskCommentEdit_taskCommentEdit | null;  // Edit a task
}

export interface taskCommentEditVariables {
  taskCommentId: string;
  body: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: taskComplete
// ====================================================

export interface taskComplete_taskComplete_patient_patientInfo {
  id: string;
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface taskComplete_taskComplete_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  patientInfo: taskComplete_taskComplete_patient_patientInfo;
}

export interface taskComplete_taskComplete_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskComplete_taskComplete_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskComplete_taskComplete_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskComplete_taskComplete_patientGoal_patientConcern_concern {
  id: string;
  title: string;
}

export interface taskComplete_taskComplete_patientGoal_patientConcern {
  concern: taskComplete_taskComplete_patientGoal_patientConcern_concern;
}

export interface taskComplete_taskComplete_patientGoal {
  id: string;
  title: string;
  patientConcern: taskComplete_taskComplete_patientGoal_patientConcern | null;
}

export interface taskComplete_taskComplete_CBOReferral_category {
  id: string;
  title: string;
}

export interface taskComplete_taskComplete_CBOReferral_CBO {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
}

export interface taskComplete_taskComplete_CBOReferral {
  id: string;
  categoryId: string;
  category: taskComplete_taskComplete_CBOReferral_category;
  CBOId: string | null;
  CBO: taskComplete_taskComplete_CBOReferral_CBO | null;
  name: string | null;
  url: string | null;
  diagnosis: string | null;
  sentAt: string | null;
  acknowledgedAt: string | null;
}

export interface taskComplete_taskComplete {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  patient: taskComplete_taskComplete_patient;
  assignedToId: string | null;
  assignedTo: taskComplete_taskComplete_assignedTo | null;
  followers: taskComplete_taskComplete_followers[];
  createdBy: taskComplete_taskComplete_createdBy;
  patientGoal: taskComplete_taskComplete_patientGoal;
  CBOReferralId: string | null;
  CBOReferral: taskComplete_taskComplete_CBOReferral | null;
}

export interface taskComplete {
  taskComplete: taskComplete_taskComplete | null;  // Complete a task
}

export interface taskCompleteVariables {
  taskId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: taskCreate
// ====================================================

export interface taskCreate_taskCreate_patient_patientInfo {
  id: string;
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface taskCreate_taskCreate_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  patientInfo: taskCreate_taskCreate_patient_patientInfo;
}

export interface taskCreate_taskCreate_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskCreate_taskCreate_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskCreate_taskCreate_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskCreate_taskCreate_patientGoal_patientConcern_concern {
  id: string;
  title: string;
}

export interface taskCreate_taskCreate_patientGoal_patientConcern {
  concern: taskCreate_taskCreate_patientGoal_patientConcern_concern;
}

export interface taskCreate_taskCreate_patientGoal {
  id: string;
  title: string;
  patientConcern: taskCreate_taskCreate_patientGoal_patientConcern | null;
}

export interface taskCreate_taskCreate_CBOReferral_category {
  id: string;
  title: string;
}

export interface taskCreate_taskCreate_CBOReferral_CBO {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
}

export interface taskCreate_taskCreate_CBOReferral {
  id: string;
  categoryId: string;
  category: taskCreate_taskCreate_CBOReferral_category;
  CBOId: string | null;
  CBO: taskCreate_taskCreate_CBOReferral_CBO | null;
  name: string | null;
  url: string | null;
  diagnosis: string | null;
  sentAt: string | null;
  acknowledgedAt: string | null;
}

export interface taskCreate_taskCreate {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  patient: taskCreate_taskCreate_patient;
  assignedToId: string | null;
  assignedTo: taskCreate_taskCreate_assignedTo | null;
  followers: taskCreate_taskCreate_followers[];
  createdBy: taskCreate_taskCreate_createdBy;
  patientGoal: taskCreate_taskCreate_patientGoal;
  CBOReferralId: string | null;
  CBOReferral: taskCreate_taskCreate_CBOReferral | null;
}

export interface taskCreate {
  taskCreate: taskCreate_taskCreate | null;  // Create a task
}

export interface taskCreateVariables {
  title: string;
  description: string;
  dueAt?: string | null;
  patientId: string;
  priority?: Priority | null;
  assignedToId?: string | null;
  patientGoalId: string;
  CBOReferralId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: taskDelete
// ====================================================

export interface taskDelete_taskDelete_patient_patientInfo {
  id: string;
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface taskDelete_taskDelete_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  patientInfo: taskDelete_taskDelete_patient_patientInfo;
}

export interface taskDelete_taskDelete_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskDelete_taskDelete_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskDelete_taskDelete_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskDelete_taskDelete_patientGoal_patientConcern_concern {
  id: string;
  title: string;
}

export interface taskDelete_taskDelete_patientGoal_patientConcern {
  concern: taskDelete_taskDelete_patientGoal_patientConcern_concern;
}

export interface taskDelete_taskDelete_patientGoal {
  id: string;
  title: string;
  patientConcern: taskDelete_taskDelete_patientGoal_patientConcern | null;
}

export interface taskDelete_taskDelete_CBOReferral_category {
  id: string;
  title: string;
}

export interface taskDelete_taskDelete_CBOReferral_CBO {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
}

export interface taskDelete_taskDelete_CBOReferral {
  id: string;
  categoryId: string;
  category: taskDelete_taskDelete_CBOReferral_category;
  CBOId: string | null;
  CBO: taskDelete_taskDelete_CBOReferral_CBO | null;
  name: string | null;
  url: string | null;
  diagnosis: string | null;
  sentAt: string | null;
  acknowledgedAt: string | null;
}

export interface taskDelete_taskDelete {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  patient: taskDelete_taskDelete_patient;
  assignedToId: string | null;
  assignedTo: taskDelete_taskDelete_assignedTo | null;
  followers: taskDelete_taskDelete_followers[];
  createdBy: taskDelete_taskDelete_createdBy;
  patientGoal: taskDelete_taskDelete_patientGoal;
  CBOReferralId: string | null;
  CBOReferral: taskDelete_taskDelete_CBOReferral | null;
}

export interface taskDelete {
  taskDelete: taskDelete_taskDelete | null;  // Delete a task
}

export interface taskDeleteVariables {
  taskId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: taskEdit
// ====================================================

export interface taskEdit_taskEdit_patient_patientInfo {
  id: string;
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface taskEdit_taskEdit_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  patientInfo: taskEdit_taskEdit_patient_patientInfo;
}

export interface taskEdit_taskEdit_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskEdit_taskEdit_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskEdit_taskEdit_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskEdit_taskEdit_patientGoal_patientConcern_concern {
  id: string;
  title: string;
}

export interface taskEdit_taskEdit_patientGoal_patientConcern {
  concern: taskEdit_taskEdit_patientGoal_patientConcern_concern;
}

export interface taskEdit_taskEdit_patientGoal {
  id: string;
  title: string;
  patientConcern: taskEdit_taskEdit_patientGoal_patientConcern | null;
}

export interface taskEdit_taskEdit_CBOReferral_category {
  id: string;
  title: string;
}

export interface taskEdit_taskEdit_CBOReferral_CBO {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
}

export interface taskEdit_taskEdit_CBOReferral {
  id: string;
  categoryId: string;
  category: taskEdit_taskEdit_CBOReferral_category;
  CBOId: string | null;
  CBO: taskEdit_taskEdit_CBOReferral_CBO | null;
  name: string | null;
  url: string | null;
  diagnosis: string | null;
  sentAt: string | null;
  acknowledgedAt: string | null;
}

export interface taskEdit_taskEdit {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  patient: taskEdit_taskEdit_patient;
  assignedToId: string | null;
  assignedTo: taskEdit_taskEdit_assignedTo | null;
  followers: taskEdit_taskEdit_followers[];
  createdBy: taskEdit_taskEdit_createdBy;
  patientGoal: taskEdit_taskEdit_patientGoal;
  CBOReferralId: string | null;
  CBOReferral: taskEdit_taskEdit_CBOReferral | null;
}

export interface taskEdit {
  taskEdit: taskEdit_taskEdit | null;  // Edit a task
}

export interface taskEditVariables {
  taskId: string;
  assignedToId?: string | null;
  title?: string | null;
  description?: string | null;
  priority?: Priority | null;
  dueAt?: string | null;
  patientGoalId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: taskTemplateCreate
// ====================================================

export interface taskTemplateCreate_taskTemplateCreate {
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

export interface taskTemplateCreate {
  taskTemplateCreate: taskTemplateCreate_taskTemplateCreate | null;  // task template create
}

export interface taskTemplateCreateVariables {
  title: string;
  goalSuggestionTemplateId: string;
  completedWithinNumber?: number | null;
  completedWithinInterval?: string | null;
  repeating?: boolean | null;
  priority?: Priority | null;
  careTeamAssigneeRole?: string | null;
  CBOCategoryId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: taskTemplateDelete
// ====================================================

export interface taskTemplateDelete_taskTemplateDelete {
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

export interface taskTemplateDelete {
  taskTemplateDelete: taskTemplateDelete_taskTemplateDelete | null;  // Deletes a task template
}

export interface taskTemplateDeleteVariables {
  taskTemplateId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: taskTemplateEdit
// ====================================================

export interface taskTemplateEdit_taskTemplateEdit {
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

export interface taskTemplateEdit {
  taskTemplateEdit: taskTemplateEdit_taskTemplateEdit | null;  // Edit a task template
}

export interface taskTemplateEditVariables {
  title: string;
  taskTemplateId: string;
  goalSuggestionTemplateId?: string | null;
  completedWithinNumber?: number | null;
  completedWithinInterval?: string | null;
  repeating?: boolean | null;
  priority?: Priority | null;
  careTeamAssigneeRole?: string | null;
  CBOCategoryId?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: taskUncomplete
// ====================================================

export interface taskUncomplete_taskUncomplete_patient_patientInfo {
  id: string;
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface taskUncomplete_taskUncomplete_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  patientInfo: taskUncomplete_taskUncomplete_patient_patientInfo;
}

export interface taskUncomplete_taskUncomplete_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskUncomplete_taskUncomplete_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskUncomplete_taskUncomplete_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskUncomplete_taskUncomplete_patientGoal_patientConcern_concern {
  id: string;
  title: string;
}

export interface taskUncomplete_taskUncomplete_patientGoal_patientConcern {
  concern: taskUncomplete_taskUncomplete_patientGoal_patientConcern_concern;
}

export interface taskUncomplete_taskUncomplete_patientGoal {
  id: string;
  title: string;
  patientConcern: taskUncomplete_taskUncomplete_patientGoal_patientConcern | null;
}

export interface taskUncomplete_taskUncomplete_CBOReferral_category {
  id: string;
  title: string;
}

export interface taskUncomplete_taskUncomplete_CBOReferral_CBO {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
}

export interface taskUncomplete_taskUncomplete_CBOReferral {
  id: string;
  categoryId: string;
  category: taskUncomplete_taskUncomplete_CBOReferral_category;
  CBOId: string | null;
  CBO: taskUncomplete_taskUncomplete_CBOReferral_CBO | null;
  name: string | null;
  url: string | null;
  diagnosis: string | null;
  sentAt: string | null;
  acknowledgedAt: string | null;
}

export interface taskUncomplete_taskUncomplete {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  patient: taskUncomplete_taskUncomplete_patient;
  assignedToId: string | null;
  assignedTo: taskUncomplete_taskUncomplete_assignedTo | null;
  followers: taskUncomplete_taskUncomplete_followers[];
  createdBy: taskUncomplete_taskUncomplete_createdBy;
  patientGoal: taskUncomplete_taskUncomplete_patientGoal;
  CBOReferralId: string | null;
  CBOReferral: taskUncomplete_taskUncomplete_CBOReferral | null;
}

export interface taskUncomplete {
  taskUncomplete: taskUncomplete_taskUncomplete | null;  // Uncomplete a task
}

export interface taskUncompleteVariables {
  taskId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: taskUserFollow
// ====================================================

export interface taskUserFollow_taskUserFollow_patient_patientInfo {
  id: string;
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface taskUserFollow_taskUserFollow_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  patientInfo: taskUserFollow_taskUserFollow_patient_patientInfo;
}

export interface taskUserFollow_taskUserFollow_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskUserFollow_taskUserFollow_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskUserFollow_taskUserFollow_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskUserFollow_taskUserFollow_patientGoal_patientConcern_concern {
  id: string;
  title: string;
}

export interface taskUserFollow_taskUserFollow_patientGoal_patientConcern {
  concern: taskUserFollow_taskUserFollow_patientGoal_patientConcern_concern;
}

export interface taskUserFollow_taskUserFollow_patientGoal {
  id: string;
  title: string;
  patientConcern: taskUserFollow_taskUserFollow_patientGoal_patientConcern | null;
}

export interface taskUserFollow_taskUserFollow_CBOReferral_category {
  id: string;
  title: string;
}

export interface taskUserFollow_taskUserFollow_CBOReferral_CBO {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
}

export interface taskUserFollow_taskUserFollow_CBOReferral {
  id: string;
  categoryId: string;
  category: taskUserFollow_taskUserFollow_CBOReferral_category;
  CBOId: string | null;
  CBO: taskUserFollow_taskUserFollow_CBOReferral_CBO | null;
  name: string | null;
  url: string | null;
  diagnosis: string | null;
  sentAt: string | null;
  acknowledgedAt: string | null;
}

export interface taskUserFollow_taskUserFollow {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  patient: taskUserFollow_taskUserFollow_patient;
  assignedToId: string | null;
  assignedTo: taskUserFollow_taskUserFollow_assignedTo | null;
  followers: taskUserFollow_taskUserFollow_followers[];
  createdBy: taskUserFollow_taskUserFollow_createdBy;
  patientGoal: taskUserFollow_taskUserFollow_patientGoal;
  CBOReferralId: string | null;
  CBOReferral: taskUserFollow_taskUserFollow_CBOReferral | null;
}

export interface taskUserFollow {
  taskUserFollow: taskUserFollow_taskUserFollow | null;  // Add user to task followers
}

export interface taskUserFollowVariables {
  taskId: string;
  userId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: taskUserUnfollow
// ====================================================

export interface taskUserUnfollow_taskUserUnfollow_patient_patientInfo {
  id: string;
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface taskUserUnfollow_taskUserUnfollow_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  patientInfo: taskUserUnfollow_taskUserUnfollow_patient_patientInfo;
}

export interface taskUserUnfollow_taskUserUnfollow_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskUserUnfollow_taskUserUnfollow_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskUserUnfollow_taskUserUnfollow_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface taskUserUnfollow_taskUserUnfollow_patientGoal_patientConcern_concern {
  id: string;
  title: string;
}

export interface taskUserUnfollow_taskUserUnfollow_patientGoal_patientConcern {
  concern: taskUserUnfollow_taskUserUnfollow_patientGoal_patientConcern_concern;
}

export interface taskUserUnfollow_taskUserUnfollow_patientGoal {
  id: string;
  title: string;
  patientConcern: taskUserUnfollow_taskUserUnfollow_patientGoal_patientConcern | null;
}

export interface taskUserUnfollow_taskUserUnfollow_CBOReferral_category {
  id: string;
  title: string;
}

export interface taskUserUnfollow_taskUserUnfollow_CBOReferral_CBO {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
}

export interface taskUserUnfollow_taskUserUnfollow_CBOReferral {
  id: string;
  categoryId: string;
  category: taskUserUnfollow_taskUserUnfollow_CBOReferral_category;
  CBOId: string | null;
  CBO: taskUserUnfollow_taskUserUnfollow_CBOReferral_CBO | null;
  name: string | null;
  url: string | null;
  diagnosis: string | null;
  sentAt: string | null;
  acknowledgedAt: string | null;
}

export interface taskUserUnfollow_taskUserUnfollow {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  patient: taskUserUnfollow_taskUserUnfollow_patient;
  assignedToId: string | null;
  assignedTo: taskUserUnfollow_taskUserUnfollow_assignedTo | null;
  followers: taskUserUnfollow_taskUserUnfollow_followers[];
  createdBy: taskUserUnfollow_taskUserUnfollow_createdBy;
  patientGoal: taskUserUnfollow_taskUserUnfollow_patientGoal;
  CBOReferralId: string | null;
  CBOReferral: taskUserUnfollow_taskUserUnfollow_CBOReferral | null;
}

export interface taskUserUnfollow {
  taskUserUnfollow: taskUserUnfollow_taskUserUnfollow | null;  // Remove user from task followers
}

export interface taskUserUnfollowVariables {
  taskId: string;
  userId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTasksForCurrentUser
// ====================================================

export interface getTasksForCurrentUser_tasksForCurrentUser_edges_node_patient_patientInfo {
  id: string;
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface getTasksForCurrentUser_tasksForCurrentUser_edges_node_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  patientInfo: getTasksForCurrentUser_tasksForCurrentUser_edges_node_patient_patientInfo;
}

export interface getTasksForCurrentUser_tasksForCurrentUser_edges_node_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getTasksForCurrentUser_tasksForCurrentUser_edges_node_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getTasksForCurrentUser_tasksForCurrentUser_edges_node_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface getTasksForCurrentUser_tasksForCurrentUser_edges_node_patientGoal_patientConcern_concern {
  id: string;
  title: string;
}

export interface getTasksForCurrentUser_tasksForCurrentUser_edges_node_patientGoal_patientConcern {
  concern: getTasksForCurrentUser_tasksForCurrentUser_edges_node_patientGoal_patientConcern_concern;
}

export interface getTasksForCurrentUser_tasksForCurrentUser_edges_node_patientGoal {
  id: string;
  title: string;
  patientConcern: getTasksForCurrentUser_tasksForCurrentUser_edges_node_patientGoal_patientConcern | null;
}

export interface getTasksForCurrentUser_tasksForCurrentUser_edges_node_CBOReferral_category {
  id: string;
  title: string;
}

export interface getTasksForCurrentUser_tasksForCurrentUser_edges_node_CBOReferral_CBO {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
}

export interface getTasksForCurrentUser_tasksForCurrentUser_edges_node_CBOReferral {
  id: string;
  categoryId: string;
  category: getTasksForCurrentUser_tasksForCurrentUser_edges_node_CBOReferral_category;
  CBOId: string | null;
  CBO: getTasksForCurrentUser_tasksForCurrentUser_edges_node_CBOReferral_CBO | null;
  name: string | null;
  url: string | null;
  diagnosis: string | null;
  sentAt: string | null;
  acknowledgedAt: string | null;
}

export interface getTasksForCurrentUser_tasksForCurrentUser_edges_node {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  patient: getTasksForCurrentUser_tasksForCurrentUser_edges_node_patient;
  assignedToId: string | null;
  assignedTo: getTasksForCurrentUser_tasksForCurrentUser_edges_node_assignedTo | null;
  followers: getTasksForCurrentUser_tasksForCurrentUser_edges_node_followers[];
  createdBy: getTasksForCurrentUser_tasksForCurrentUser_edges_node_createdBy;
  patientGoal: getTasksForCurrentUser_tasksForCurrentUser_edges_node_patientGoal;
  CBOReferralId: string | null;
  CBOReferral: getTasksForCurrentUser_tasksForCurrentUser_edges_node_CBOReferral | null;
}

export interface getTasksForCurrentUser_tasksForCurrentUser_edges {
  node: getTasksForCurrentUser_tasksForCurrentUser_edges_node | null;
}

export interface getTasksForCurrentUser_tasksForCurrentUser_pageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface getTasksForCurrentUser_tasksForCurrentUser {
  edges: getTasksForCurrentUser_tasksForCurrentUser_edges[];
  pageInfo: getTasksForCurrentUser_tasksForCurrentUser_pageInfo;
}

export interface getTasksForCurrentUser {
  tasksForCurrentUser: getTasksForCurrentUser_tasksForCurrentUser;  // Current user's Tasks
}

export interface getTasksForCurrentUserVariables {
  pageNumber?: number | null;
  pageSize?: number | null;
  orderBy?: UserTaskOrderOptions | null;
  isFollowingTasks?: boolean | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: userCreate
// ====================================================

export interface userCreate_userCreate {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface userCreate {
  userCreate: userCreate_userCreate | null;  // Create a new user
}

export interface userCreateVariables {
  email: string;
  homeClinicId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: userDelete
// ====================================================

export interface userDelete_userDelete {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface userDelete {
  userDelete: userDelete_userDelete | null;  // Delete user
}

export interface userDeleteVariables {
  email: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: userEditPermissions
// ====================================================

export interface userEditPermissions_userEditPermissions {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface userEditPermissions {
  userEditPermissions: userEditPermissions_userEditPermissions | null;  // Edit user - permissions
}

export interface userEditPermissionsVariables {
  email: string;
  permissions: Permissions;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: userEditRole
// ====================================================

export interface userEditRole_userEditRole {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface userEditRole {
  userEditRole: userEditRole_userEditRole | null;  // Edit user - role
}

export interface userEditRoleVariables {
  email: string;
  userRole: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: userHoursCreate
// ====================================================

export interface userHoursCreate_userHoursCreate {
  id: string;
  userId: string;
  weekday: number;
  startTime: number;
  endTime: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface userHoursCreate {
  userHoursCreate: userHoursCreate_userHoursCreate;  // create user hours
}

export interface userHoursCreateVariables {
  weekday: number;
  startTime: number;
  endTime: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: userHoursDelete
// ====================================================

export interface userHoursDelete_userHoursDelete {
  id: string;
  userId: string;
  weekday: number;
  startTime: number;
  endTime: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface userHoursDelete {
  userHoursDelete: userHoursDelete_userHoursDelete;  // delete user hours
}

export interface userHoursDeleteVariables {
  userHoursId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: userHoursEdit
// ====================================================

export interface userHoursEdit_userHoursEdit {
  id: string;
  userId: string;
  weekday: number;
  startTime: number;
  endTime: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface userHoursEdit {
  userHoursEdit: userHoursEdit_userHoursEdit;  // edit user hours
}

export interface userHoursEditVariables {
  userHoursId: string;
  startTime: number;
  endTime: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: userVoicemailSignedUrlCreate
// ====================================================

export interface userVoicemailSignedUrlCreate_userVoicemailSignedUrlCreate {
  signedUrl: string;
}

export interface userVoicemailSignedUrlCreate {
  userVoicemailSignedUrlCreate: userVoicemailSignedUrlCreate_userVoicemailSignedUrlCreate;  // generate a signed URL for voicemail
}

export interface userVoicemailSignedUrlCreateVariables {
  voicemailId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullAddress
// ====================================================

export interface FullAddress {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullAnswer
// ====================================================

export interface FullAnswer_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface FullAnswer_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: FullAnswer_concernSuggestions_diagnosisCodes[] | null;
}

export interface FullAnswer_goalSuggestions_taskTemplates {
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

export interface FullAnswer_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: FullAnswer_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullAnswer_riskArea {
  id: string;
  title: string;
}

export interface FullAnswer_screeningTool {
  id: string;
  title: string;
}

export interface FullAnswer {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: FullAnswer_concernSuggestions[] | null;
  goalSuggestions: (FullAnswer_goalSuggestions | null)[] | null;
  riskArea: FullAnswer_riskArea | null;
  screeningTool: FullAnswer_screeningTool | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullCalendarEvent
// ====================================================

export interface FullCalendarEvent {
  id: string;
  title: string;
  startDate: string;
  startTime: string | null;
  endDate: string;
  endTime: string | null;
  htmlLink: string;
  description: string | null;
  location: string | null;
  guests: string[] | null;
  eventType: GoogleCalendarEventType | null;
  providerName: string | null;
  providerCredentials: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullCarePlanSuggestionForPatient
// ====================================================

export interface FullCarePlanSuggestionForPatient_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullCarePlanSuggestionForPatient_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullCarePlanSuggestionForPatient_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullCarePlanSuggestionForPatient_patient_patientInfo;
  patientState: FullCarePlanSuggestionForPatient_patient_patientState;
}

export interface FullCarePlanSuggestionForPatient_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface FullCarePlanSuggestionForPatient_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: FullCarePlanSuggestionForPatient_concern_diagnosisCodes[] | null;
}

export interface FullCarePlanSuggestionForPatient_goalSuggestionTemplate_taskTemplates {
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

export interface FullCarePlanSuggestionForPatient_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: FullCarePlanSuggestionForPatient_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullCarePlanSuggestionForPatient_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface FullCarePlanSuggestionForPatient_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface FullCarePlanSuggestionForPatient_computedField_riskArea {
  id: string;
  title: string;
}

export interface FullCarePlanSuggestionForPatient_computedField {
  id: string;
  label: string;
  riskArea: FullCarePlanSuggestionForPatient_computedField_riskArea;
}

export interface FullCarePlanSuggestionForPatient_riskArea {
  id: string;
  title: string;
}

export interface FullCarePlanSuggestionForPatient_screeningTool {
  id: string;
  title: string;
}

export interface FullCarePlanSuggestionForPatient {
  id: string;
  patientId: string;
  patient: FullCarePlanSuggestionForPatient_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: FullCarePlanSuggestionForPatient_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: FullCarePlanSuggestionForPatient_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: FullCarePlanSuggestionForPatient_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: FullCarePlanSuggestionForPatient_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
  computedField: FullCarePlanSuggestionForPatient_computedField | null;
  riskArea: FullCarePlanSuggestionForPatient_riskArea | null;
  screeningTool: FullCarePlanSuggestionForPatient_screeningTool | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullCarePlanSuggestion
// ====================================================

export interface FullCarePlanSuggestion_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullCarePlanSuggestion_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullCarePlanSuggestion_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullCarePlanSuggestion_patient_patientInfo;
  patientState: FullCarePlanSuggestion_patient_patientState;
}

export interface FullCarePlanSuggestion_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface FullCarePlanSuggestion_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: FullCarePlanSuggestion_concern_diagnosisCodes[] | null;
}

export interface FullCarePlanSuggestion_goalSuggestionTemplate_taskTemplates {
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

export interface FullCarePlanSuggestion_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: FullCarePlanSuggestion_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullCarePlanSuggestion_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface FullCarePlanSuggestion_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface FullCarePlanSuggestion {
  id: string;
  patientId: string;
  patient: FullCarePlanSuggestion_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: FullCarePlanSuggestion_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: FullCarePlanSuggestion_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: FullCarePlanSuggestion_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: FullCarePlanSuggestion_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullCarePlanUpdateEvent
// ====================================================

export interface FullCarePlanUpdateEvent_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullCarePlanUpdateEvent_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullCarePlanUpdateEvent_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullCarePlanUpdateEvent_patient_patientInfo;
  patientState: FullCarePlanUpdateEvent_patient_patientState;
}

export interface FullCarePlanUpdateEvent_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullCarePlanUpdateEvent_patientConcern_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface FullCarePlanUpdateEvent_patientConcern_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: FullCarePlanUpdateEvent_patientConcern_concern_diagnosisCodes[] | null;
}

export interface FullCarePlanUpdateEvent_patientConcern_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullCarePlanUpdateEvent_patientConcern_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullCarePlanUpdateEvent_patientConcern_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullCarePlanUpdateEvent_patientConcern_patient_patientInfo;
  patientState: FullCarePlanUpdateEvent_patientConcern_patient_patientState;
}

export interface FullCarePlanUpdateEvent_patientConcern_patientGoals_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullCarePlanUpdateEvent_patientConcern_patientGoals_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullCarePlanUpdateEvent_patientConcern_patientGoals_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullCarePlanUpdateEvent_patientConcern_patientGoals_patient_patientInfo;
  patientState: FullCarePlanUpdateEvent_patientConcern_patientGoals_patient_patientState;
}

export interface FullCarePlanUpdateEvent_patientConcern_patientGoals_tasks_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface FullCarePlanUpdateEvent_patientConcern_patientGoals_tasks_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface FullCarePlanUpdateEvent_patientConcern_patientGoals_tasks_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface FullCarePlanUpdateEvent_patientConcern_patientGoals_tasks {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  assignedTo: FullCarePlanUpdateEvent_patientConcern_patientGoals_tasks_assignedTo | null;
  assignedToId: string | null;
  followers: FullCarePlanUpdateEvent_patientConcern_patientGoals_tasks_followers[];
  createdBy: FullCarePlanUpdateEvent_patientConcern_patientGoals_tasks_createdBy;
}

export interface FullCarePlanUpdateEvent_patientConcern_patientGoals {
  id: string;
  title: string;
  patientId: string;
  patient: FullCarePlanUpdateEvent_patientConcern_patientGoals_patient;
  patientConcernId: string | null;
  goalSuggestionTemplateId: string | null;
  tasks: FullCarePlanUpdateEvent_patientConcern_patientGoals_tasks[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullCarePlanUpdateEvent_patientConcern {
  id: string;
  order: number;
  concernId: string;
  concern: FullCarePlanUpdateEvent_patientConcern_concern;
  patientId: string;
  patient: FullCarePlanUpdateEvent_patientConcern_patient;
  patientGoals: FullCarePlanUpdateEvent_patientConcern_patientGoals[] | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullCarePlanUpdateEvent_patientGoal_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullCarePlanUpdateEvent_patientGoal_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullCarePlanUpdateEvent_patientGoal_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullCarePlanUpdateEvent_patientGoal_patient_patientInfo;
  patientState: FullCarePlanUpdateEvent_patientGoal_patient_patientState;
}

export interface FullCarePlanUpdateEvent_patientGoal_tasks_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface FullCarePlanUpdateEvent_patientGoal_tasks_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface FullCarePlanUpdateEvent_patientGoal_tasks_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface FullCarePlanUpdateEvent_patientGoal_tasks {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  assignedTo: FullCarePlanUpdateEvent_patientGoal_tasks_assignedTo | null;
  assignedToId: string | null;
  followers: FullCarePlanUpdateEvent_patientGoal_tasks_followers[];
  createdBy: FullCarePlanUpdateEvent_patientGoal_tasks_createdBy;
}

export interface FullCarePlanUpdateEvent_patientGoal {
  id: string;
  title: string;
  patientId: string;
  patient: FullCarePlanUpdateEvent_patientGoal_patient;
  patientConcernId: string | null;
  goalSuggestionTemplateId: string | null;
  tasks: FullCarePlanUpdateEvent_patientGoal_tasks[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullCarePlanUpdateEvent {
  id: string;
  patientId: string;
  patient: FullCarePlanUpdateEvent_patient;
  userId: string;
  user: FullCarePlanUpdateEvent_user;
  patientConcernId: string | null;
  patientConcern: FullCarePlanUpdateEvent_patientConcern | null;
  patientGoalId: string | null;
  patientGoal: FullCarePlanUpdateEvent_patientGoal | null;
  eventType: CarePlanUpdateEventTypes;
  progressNoteId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullCareTeamUser
// ====================================================

export interface FullCareTeamUser {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isCareTeamLead: boolean;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullCBOCategory
// ====================================================

export interface FullCBOCategory {
  id: string;
  title: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullCBOReferral
// ====================================================

export interface FullCBOReferral_category {
  id: string;
  title: string;
}

export interface FullCBOReferral_CBO {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
}

export interface FullCBOReferral {
  id: string;
  categoryId: string;
  category: FullCBOReferral_category;
  CBOId: string | null;
  CBO: FullCBOReferral_CBO | null;
  name: string | null;
  url: string | null;
  diagnosis: string | null;
  sentAt: string | null;
  acknowledgedAt: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullCBO
// ====================================================

export interface FullCBO_category {
  id: string;
  title: string;
}

export interface FullCBO {
  id: string;
  name: string;
  categoryId: string;
  category: FullCBO_category;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
  createdAt: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullClinic
// ====================================================

export interface FullClinic {
  id: string;
  name: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullComputedField
// ====================================================

export interface FullComputedField {
  id: string;
  label: string;
  slug: string;
  dataType: ComputedFieldDataTypes;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullComputedPatientStatus
// ====================================================

export interface FullComputedPatientStatus {
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


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullConcern
// ====================================================

export interface FullConcern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface FullConcern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: FullConcern_diagnosisCodes[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullDiagnosisCode
// ====================================================

export interface FullDiagnosisCode {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullEmail
// ====================================================

export interface FullEmail {
  id: string;
  emailAddress: string;
  description: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullEventNotification
// ====================================================

export interface FullEventNotification_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullEventNotification_taskEvent_task {
  id: string;
  title: string;
  priority: Priority | null;
  patientId: string;
  patientGoalId: string;
}

export interface FullEventNotification_taskEvent_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullEventNotification_taskEvent_eventComment_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullEventNotification_taskEvent_eventComment {
  id: string;
  body: string;
  user: FullEventNotification_taskEvent_eventComment_user;
  taskId: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface FullEventNotification_taskEvent_eventUser {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullEventNotification_taskEvent {
  id: string;
  taskId: string;
  task: FullEventNotification_taskEvent_task;
  userId: string;
  user: FullEventNotification_taskEvent_user;
  eventType: TaskEventTypes | null;
  eventCommentId: string | null;
  eventComment: FullEventNotification_taskEvent_eventComment | null;
  eventUserId: string | null;
  eventUser: FullEventNotification_taskEvent_eventUser | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullEventNotification {
  id: string;
  title: string | null;
  userId: string;
  user: FullEventNotification_user;
  taskEvent: FullEventNotification_taskEvent | null;
  seenAt: string | null;
  emailSentAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullGoalSuggestionTemplate
// ====================================================

export interface FullGoalSuggestionTemplate_taskTemplates {
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

export interface FullGoalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: FullGoalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientAnswerEvent
// ====================================================

export interface FullPatientAnswerEvent_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullPatientAnswerEvent_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullPatientAnswerEvent_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullPatientAnswerEvent_patient_patientInfo;
  patientState: FullPatientAnswerEvent_patient_patientState;
}

export interface FullPatientAnswerEvent_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullPatientAnswerEvent_patientAnswer_answer_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface FullPatientAnswerEvent_patientAnswer_answer_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: FullPatientAnswerEvent_patientAnswer_answer_concernSuggestions_diagnosisCodes[] | null;
}

export interface FullPatientAnswerEvent_patientAnswer_answer_goalSuggestions_taskTemplates {
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

export interface FullPatientAnswerEvent_patientAnswer_answer_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: FullPatientAnswerEvent_patientAnswer_answer_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullPatientAnswerEvent_patientAnswer_answer_riskArea {
  id: string;
  title: string;
}

export interface FullPatientAnswerEvent_patientAnswer_answer_screeningTool {
  id: string;
  title: string;
}

export interface FullPatientAnswerEvent_patientAnswer_answer {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: FullPatientAnswerEvent_patientAnswer_answer_concernSuggestions[] | null;
  goalSuggestions: (FullPatientAnswerEvent_patientAnswer_answer_goalSuggestions | null)[] | null;
  riskArea: FullPatientAnswerEvent_patientAnswer_answer_riskArea | null;
  screeningTool: FullPatientAnswerEvent_patientAnswer_answer_screeningTool | null;
}

export interface FullPatientAnswerEvent_patientAnswer_question {
  id: string;
  title: string;
  answerType: AnswerTypeOptions;
}

export interface FullPatientAnswerEvent_patientAnswer {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  answerId: string;
  answer: FullPatientAnswerEvent_patientAnswer_answer;
  answerValue: string;
  patientId: string;
  applicable: boolean | null;
  question: FullPatientAnswerEvent_patientAnswer_question | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface FullPatientAnswerEvent_previousPatientAnswer_answer_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface FullPatientAnswerEvent_previousPatientAnswer_answer_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: FullPatientAnswerEvent_previousPatientAnswer_answer_concernSuggestions_diagnosisCodes[] | null;
}

export interface FullPatientAnswerEvent_previousPatientAnswer_answer_goalSuggestions_taskTemplates {
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

export interface FullPatientAnswerEvent_previousPatientAnswer_answer_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: FullPatientAnswerEvent_previousPatientAnswer_answer_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullPatientAnswerEvent_previousPatientAnswer_answer_riskArea {
  id: string;
  title: string;
}

export interface FullPatientAnswerEvent_previousPatientAnswer_answer_screeningTool {
  id: string;
  title: string;
}

export interface FullPatientAnswerEvent_previousPatientAnswer_answer {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: FullPatientAnswerEvent_previousPatientAnswer_answer_concernSuggestions[] | null;
  goalSuggestions: (FullPatientAnswerEvent_previousPatientAnswer_answer_goalSuggestions | null)[] | null;
  riskArea: FullPatientAnswerEvent_previousPatientAnswer_answer_riskArea | null;
  screeningTool: FullPatientAnswerEvent_previousPatientAnswer_answer_screeningTool | null;
}

export interface FullPatientAnswerEvent_previousPatientAnswer_question {
  id: string;
  title: string;
  answerType: AnswerTypeOptions;
}

export interface FullPatientAnswerEvent_previousPatientAnswer {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  answerId: string;
  answer: FullPatientAnswerEvent_previousPatientAnswer_answer;
  answerValue: string;
  patientId: string;
  applicable: boolean | null;
  question: FullPatientAnswerEvent_previousPatientAnswer_question | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface FullPatientAnswerEvent {
  id: string;
  patientId: string;
  patient: FullPatientAnswerEvent_patient;
  userId: string;
  user: FullPatientAnswerEvent_user;
  patientAnswerId: string;
  patientAnswer: FullPatientAnswerEvent_patientAnswer;
  previousPatientAnswerId: string | null;
  previousPatientAnswer: FullPatientAnswerEvent_previousPatientAnswer | null;
  eventType: PatientAnswerEventTypes;
  progressNoteId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientAnswer
// ====================================================

export interface FullPatientAnswer_answer_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface FullPatientAnswer_answer_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: FullPatientAnswer_answer_concernSuggestions_diagnosisCodes[] | null;
}

export interface FullPatientAnswer_answer_goalSuggestions_taskTemplates {
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

export interface FullPatientAnswer_answer_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: FullPatientAnswer_answer_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullPatientAnswer_answer_riskArea {
  id: string;
  title: string;
}

export interface FullPatientAnswer_answer_screeningTool {
  id: string;
  title: string;
}

export interface FullPatientAnswer_answer {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: FullPatientAnswer_answer_concernSuggestions[] | null;
  goalSuggestions: (FullPatientAnswer_answer_goalSuggestions | null)[] | null;
  riskArea: FullPatientAnswer_answer_riskArea | null;
  screeningTool: FullPatientAnswer_answer_screeningTool | null;
}

export interface FullPatientAnswer_question {
  id: string;
  title: string;
  answerType: AnswerTypeOptions;
}

export interface FullPatientAnswer {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  answerId: string;
  answer: FullPatientAnswer_answer;
  answerValue: string;
  patientId: string;
  applicable: boolean | null;
  question: FullPatientAnswer_question | null;
  patientScreeningToolSubmissionId: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientConcern
// ====================================================

export interface FullPatientConcern_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface FullPatientConcern_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: FullPatientConcern_concern_diagnosisCodes[] | null;
}

export interface FullPatientConcern_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullPatientConcern_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullPatientConcern_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullPatientConcern_patient_patientInfo;
  patientState: FullPatientConcern_patient_patientState;
}

export interface FullPatientConcern_patientGoals_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullPatientConcern_patientGoals_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullPatientConcern_patientGoals_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullPatientConcern_patientGoals_patient_patientInfo;
  patientState: FullPatientConcern_patientGoals_patient_patientState;
}

export interface FullPatientConcern_patientGoals_tasks_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface FullPatientConcern_patientGoals_tasks_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface FullPatientConcern_patientGoals_tasks_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface FullPatientConcern_patientGoals_tasks {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  assignedTo: FullPatientConcern_patientGoals_tasks_assignedTo | null;
  assignedToId: string | null;
  followers: FullPatientConcern_patientGoals_tasks_followers[];
  createdBy: FullPatientConcern_patientGoals_tasks_createdBy;
}

export interface FullPatientConcern_patientGoals {
  id: string;
  title: string;
  patientId: string;
  patient: FullPatientConcern_patientGoals_patient;
  patientConcernId: string | null;
  goalSuggestionTemplateId: string | null;
  tasks: FullPatientConcern_patientGoals_tasks[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullPatientConcern {
  id: string;
  order: number;
  concernId: string;
  concern: FullPatientConcern_concern;
  patientId: string;
  patient: FullPatientConcern_patient;
  patientGoals: FullPatientConcern_patientGoals[] | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientContact
// ====================================================

export interface FullPatientContact_address {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface FullPatientContact_email {
  id: string;
  emailAddress: string;
}

export interface FullPatientContact_phone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
}

export interface FullPatientContact {
  id: string;
  patientId: string;
  relationToPatient: PatientRelationOptions;
  relationFreeText: string | null;
  firstName: string;
  lastName: string;
  isEmergencyContact: boolean;
  isHealthcareProxy: boolean;
  description: string | null;
  address: FullPatientContact_address | null;
  email: FullPatientContact_email | null;
  phone: FullPatientContact_phone;
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


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientDataFlag
// ====================================================

export interface FullPatientDataFlag {
  id: string;
  patientId: string;
  userId: string;
  fieldName: CoreIdentityOptions;
  suggestedValue: string | null;
  notes: string | null;
  updatedAt: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientDocument
// ====================================================

export interface FullPatientDocument_uploadedBy {
  firstName: string | null;
  lastName: string | null;
}

export interface FullPatientDocument {
  id: string;
  patientId: string;
  uploadedBy: FullPatientDocument_uploadedBy;
  filename: string;
  description: string | null;
  documentType: DocumentTypeOptions | null;
  createdAt: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientEncounter
// ====================================================

export interface FullPatientEncounter {
  id: string;
  location: string | null;
  source: string | null;
  date: string;
  title: string | null;
  notes: string | null;
  progressNoteId: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientExternalOrganization
// ====================================================

export interface FullPatientExternalOrganization_address {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface FullPatientExternalOrganization {
  id: string;
  patientId: string;
  name: string;
  description: string | null;
  phoneNumber: string | null;
  faxNumber: string | null;
  address: FullPatientExternalOrganization_address | null;
  isConsentedForSubstanceUse: boolean | null;
  isConsentedForHiv: boolean | null;
  isConsentedForStd: boolean | null;
  isConsentedForGeneticTesting: boolean | null;
  isConsentedForFamilyPlanning: boolean | null;
  isConsentedForMentalHealth: boolean | null;
  consentDocumentId: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientExternalProvider
// ====================================================

export interface FullPatientExternalProvider_patientExternalOrganization {
  id: string;
  name: string;
  isConsentedForSubstanceUse: boolean | null;
  isConsentedForHiv: boolean | null;
  isConsentedForStd: boolean | null;
  isConsentedForGeneticTesting: boolean | null;
  isConsentedForFamilyPlanning: boolean | null;
  consentDocumentId: string | null;
}

export interface FullPatientExternalProvider_email {
  id: string;
  emailAddress: string;
}

export interface FullPatientExternalProvider_phone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
}

export interface FullPatientExternalProvider {
  id: string;
  patientId: string;
  role: ExternalProviderOptions;
  roleFreeText: string | null;
  firstName: string | null;
  lastName: string | null;
  patientExternalOrganizationId: string;
  patientExternalOrganization: FullPatientExternalProvider_patientExternalOrganization;
  description: string | null;
  email: FullPatientExternalProvider_email | null;
  phone: FullPatientExternalProvider_phone;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientForCBOReferralFormPDF
// ====================================================

export interface FullPatientForCBOReferralFormPDF_careTeam {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullPatientForCBOReferralFormPDF_patientInfo_primaryAddress {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface FullPatientForCBOReferralFormPDF_patientInfo_primaryPhone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
  description: string | null;
}

export interface FullPatientForCBOReferralFormPDF_patientInfo {
  gender: Gender | null;
  language: string | null;
  primaryAddress: FullPatientForCBOReferralFormPDF_patientInfo_primaryAddress | null;
  primaryPhone: FullPatientForCBOReferralFormPDF_patientInfo_primaryPhone | null;
}

export interface FullPatientForCBOReferralFormPDF {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  cityblockId: number;
  dateOfBirth: string | null;
  careTeam: FullPatientForCBOReferralFormPDF_careTeam[] | null;
  patientInfo: FullPatientForCBOReferralFormPDF_patientInfo;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientForDashboard
// ====================================================

export interface FullPatientForDashboard_patientInfo {
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullPatientForDashboard_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullPatientForDashboard_computedPatientStatus {
  isCoreIdentityVerified: boolean;
  isDemographicInfoUpdated: boolean;
  isEmergencyContactAdded: boolean;
  isAdvancedDirectivesAdded: boolean;
  isConsentSigned: boolean;
  isPhotoAddedOrDeclined: boolean;
}

export interface FullPatientForDashboard {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  cityblockId: number;
  patientInfo: FullPatientForDashboard_patientInfo;
  patientState: FullPatientForDashboard_patientState;
  computedPatientStatus: FullPatientForDashboard_computedPatientStatus;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientForProfile
// ====================================================

export interface FullPatientForProfile_patientInfo_primaryAddress {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface FullPatientForProfile_patientInfo_primaryEmail {
  id: string;
  emailAddress: string;
  description: string | null;
}

export interface FullPatientForProfile_patientInfo_primaryPhone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
  description: string | null;
}

export interface FullPatientForProfile_patientInfo {
  id: string;
  preferredName: string | null;
  gender: Gender | null;
  genderFreeText: string | null;
  transgender: Transgender | null;
  maritalStatus: MaritalStatus | null;
  language: string | null;
  isMarginallyHoused: boolean | null;
  primaryAddress: FullPatientForProfile_patientInfo_primaryAddress | null;
  hasEmail: boolean | null;
  primaryEmail: FullPatientForProfile_patientInfo_primaryEmail | null;
  primaryPhone: FullPatientForProfile_patientInfo_primaryPhone | null;
  preferredContactMethod: ContactMethodOptions | null;
  preferredContactTime: ContactTimeOptions | null;
  canReceiveCalls: boolean | null;
  hasHealthcareProxy: boolean | null;
  hasMolst: boolean | null;
  hasDeclinedPhotoUpload: boolean | null;
  hasUploadedPhoto: boolean | null;
  googleCalendarId: string | null;
}

export interface FullPatientForProfile_patientDataFlags {
  id: string;
  patientId: string;
  userId: string;
  fieldName: CoreIdentityOptions;
  suggestedValue: string | null;
  notes: string | null;
  updatedAt: string | null;
}

export interface FullPatientForProfile_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullPatientForProfile {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  cityblockId: number;
  dateOfBirth: string | null;
  ssnEnd: string | null;
  nmi: string | null;
  mrn: string | null;
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
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  coreIdentityVerifiedById: string | null;
  patientInfo: FullPatientForProfile_patientInfo;
  patientDataFlags: FullPatientForProfile_patientDataFlags[] | null;
  patientState: FullPatientForProfile_patientState;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientGlassBreakCheck
// ====================================================

export interface FullPatientGlassBreakCheck {
  patientId: string;
  isGlassBreakNotNeeded: boolean;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientGoal
// ====================================================

export interface FullPatientGoal_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullPatientGoal_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullPatientGoal_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullPatientGoal_patient_patientInfo;
  patientState: FullPatientGoal_patient_patientState;
}

export interface FullPatientGoal_tasks_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface FullPatientGoal_tasks_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface FullPatientGoal_tasks_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface FullPatientGoal_tasks {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  assignedTo: FullPatientGoal_tasks_assignedTo | null;
  assignedToId: string | null;
  followers: FullPatientGoal_tasks_followers[];
  createdBy: FullPatientGoal_tasks_createdBy;
}

export interface FullPatientGoal {
  id: string;
  title: string;
  patientId: string;
  patient: FullPatientGoal_patient;
  patientConcernId: string | null;
  goalSuggestionTemplateId: string | null;
  tasks: FullPatientGoal_tasks[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientInfo
// ====================================================

export interface FullPatientInfo_primaryAddress {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface FullPatientInfo_primaryEmail {
  id: string;
  emailAddress: string;
  description: string | null;
}

export interface FullPatientInfo_primaryPhone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
  description: string | null;
}

export interface FullPatientInfo {
  id: string;
  preferredName: string | null;
  gender: Gender | null;
  genderFreeText: string | null;
  transgender: Transgender | null;
  maritalStatus: MaritalStatus | null;
  language: string | null;
  isMarginallyHoused: boolean | null;
  primaryAddress: FullPatientInfo_primaryAddress | null;
  hasEmail: boolean | null;
  primaryEmail: FullPatientInfo_primaryEmail | null;
  primaryPhone: FullPatientInfo_primaryPhone | null;
  preferredContactMethod: ContactMethodOptions | null;
  preferredContactTime: ContactTimeOptions | null;
  canReceiveCalls: boolean | null;
  hasHealthcareProxy: boolean | null;
  hasMolst: boolean | null;
  hasDeclinedPhotoUpload: boolean | null;
  hasUploadedPhoto: boolean | null;
  googleCalendarId: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientList
// ====================================================

export interface FullPatientList {
  id: string;
  title: string;
  answerId: string;
  order: number;
  createdAt: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientNeedToKnow
// ====================================================

export interface FullPatientNeedToKnow {
  text: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientScratchPad
// ====================================================

export interface FullPatientScratchPad {
  id: string;
  patientId: string;
  userId: string;
  body: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientScreeningToolSubmission
// ====================================================

export interface FullPatientScreeningToolSubmission_screeningTool {
  id: string;
  title: string;
  riskAreaId: string;
}

export interface FullPatientScreeningToolSubmission_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullPatientScreeningToolSubmission_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullPatientScreeningToolSubmission_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullPatientScreeningToolSubmission_patient_patientInfo;
  patientState: FullPatientScreeningToolSubmission_patient_patientState;
}

export interface FullPatientScreeningToolSubmission_user {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface FullPatientScreeningToolSubmission_carePlanSuggestions_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullPatientScreeningToolSubmission_carePlanSuggestions_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullPatientScreeningToolSubmission_carePlanSuggestions_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullPatientScreeningToolSubmission_carePlanSuggestions_patient_patientInfo;
  patientState: FullPatientScreeningToolSubmission_carePlanSuggestions_patient_patientState;
}

export interface FullPatientScreeningToolSubmission_carePlanSuggestions_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface FullPatientScreeningToolSubmission_carePlanSuggestions_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: FullPatientScreeningToolSubmission_carePlanSuggestions_concern_diagnosisCodes[] | null;
}

export interface FullPatientScreeningToolSubmission_carePlanSuggestions_goalSuggestionTemplate_taskTemplates {
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

export interface FullPatientScreeningToolSubmission_carePlanSuggestions_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: FullPatientScreeningToolSubmission_carePlanSuggestions_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullPatientScreeningToolSubmission_carePlanSuggestions_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface FullPatientScreeningToolSubmission_carePlanSuggestions_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface FullPatientScreeningToolSubmission_carePlanSuggestions {
  id: string;
  patientId: string;
  patient: FullPatientScreeningToolSubmission_carePlanSuggestions_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: FullPatientScreeningToolSubmission_carePlanSuggestions_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: FullPatientScreeningToolSubmission_carePlanSuggestions_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: FullPatientScreeningToolSubmission_carePlanSuggestions_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: FullPatientScreeningToolSubmission_carePlanSuggestions_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface FullPatientScreeningToolSubmission_screeningToolScoreRange {
  id: string;
  description: string;
}

export interface FullPatientScreeningToolSubmission {
  id: string;
  screeningToolId: string;
  screeningTool: FullPatientScreeningToolSubmission_screeningTool;
  patientId: string;
  patient: FullPatientScreeningToolSubmission_patient;
  userId: string;
  user: FullPatientScreeningToolSubmission_user;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  scoredAt: string | null;
  carePlanSuggestions: FullPatientScreeningToolSubmission_carePlanSuggestions[];
  screeningToolScoreRangeId: string | null;
  screeningToolScoreRange: FullPatientScreeningToolSubmission_screeningToolScoreRange | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPatientTableRow
// ====================================================

export interface FullPatientTableRow_patientInfo_primaryAddress {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface FullPatientTableRow_patientInfo {
  gender: Gender | null;
  primaryAddress: FullPatientTableRow_patientInfo_primaryAddress | null;
}

export interface FullPatientTableRow_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullPatientTableRow {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  cityblockId: number;
  userCareTeam: boolean | null;
  patientInfo: FullPatientTableRow_patientInfo;
  patientState: FullPatientTableRow_patientState;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullPhone
// ====================================================

export interface FullPhone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
  description: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullProgressNoteActivity
// ====================================================

export interface FullProgressNoteActivity_taskEvents_task {
  id: string;
  title: string;
  priority: Priority | null;
  patientId: string;
  patientGoalId: string;
}

export interface FullProgressNoteActivity_taskEvents_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullProgressNoteActivity_taskEvents_eventComment_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullProgressNoteActivity_taskEvents_eventComment {
  id: string;
  body: string;
  user: FullProgressNoteActivity_taskEvents_eventComment_user;
  taskId: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface FullProgressNoteActivity_taskEvents_eventUser {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullProgressNoteActivity_taskEvents {
  id: string;
  taskId: string;
  task: FullProgressNoteActivity_taskEvents_task;
  userId: string;
  user: FullProgressNoteActivity_taskEvents_user;
  eventType: TaskEventTypes | null;
  eventCommentId: string | null;
  eventComment: FullProgressNoteActivity_taskEvents_eventComment | null;
  eventUserId: string | null;
  eventUser: FullProgressNoteActivity_taskEvents_eventUser | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullProgressNoteActivity_patientAnswerEvents_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullProgressNoteActivity_patientAnswerEvents_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullProgressNoteActivity_patientAnswerEvents_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullProgressNoteActivity_patientAnswerEvents_patient_patientInfo;
  patientState: FullProgressNoteActivity_patientAnswerEvents_patient_patientState;
}

export interface FullProgressNoteActivity_patientAnswerEvents_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullProgressNoteActivity_patientAnswerEvents_patientAnswer_answer_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface FullProgressNoteActivity_patientAnswerEvents_patientAnswer_answer_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: FullProgressNoteActivity_patientAnswerEvents_patientAnswer_answer_concernSuggestions_diagnosisCodes[] | null;
}

export interface FullProgressNoteActivity_patientAnswerEvents_patientAnswer_answer_goalSuggestions_taskTemplates {
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

export interface FullProgressNoteActivity_patientAnswerEvents_patientAnswer_answer_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: FullProgressNoteActivity_patientAnswerEvents_patientAnswer_answer_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullProgressNoteActivity_patientAnswerEvents_patientAnswer_answer_riskArea {
  id: string;
  title: string;
}

export interface FullProgressNoteActivity_patientAnswerEvents_patientAnswer_answer_screeningTool {
  id: string;
  title: string;
}

export interface FullProgressNoteActivity_patientAnswerEvents_patientAnswer_answer {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: FullProgressNoteActivity_patientAnswerEvents_patientAnswer_answer_concernSuggestions[] | null;
  goalSuggestions: (FullProgressNoteActivity_patientAnswerEvents_patientAnswer_answer_goalSuggestions | null)[] | null;
  riskArea: FullProgressNoteActivity_patientAnswerEvents_patientAnswer_answer_riskArea | null;
  screeningTool: FullProgressNoteActivity_patientAnswerEvents_patientAnswer_answer_screeningTool | null;
}

export interface FullProgressNoteActivity_patientAnswerEvents_patientAnswer_question {
  id: string;
  title: string;
  answerType: AnswerTypeOptions;
}

export interface FullProgressNoteActivity_patientAnswerEvents_patientAnswer {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  answerId: string;
  answer: FullProgressNoteActivity_patientAnswerEvents_patientAnswer_answer;
  answerValue: string;
  patientId: string;
  applicable: boolean | null;
  question: FullProgressNoteActivity_patientAnswerEvents_patientAnswer_question | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface FullProgressNoteActivity_patientAnswerEvents_previousPatientAnswer_answer_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface FullProgressNoteActivity_patientAnswerEvents_previousPatientAnswer_answer_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: FullProgressNoteActivity_patientAnswerEvents_previousPatientAnswer_answer_concernSuggestions_diagnosisCodes[] | null;
}

export interface FullProgressNoteActivity_patientAnswerEvents_previousPatientAnswer_answer_goalSuggestions_taskTemplates {
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

export interface FullProgressNoteActivity_patientAnswerEvents_previousPatientAnswer_answer_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: FullProgressNoteActivity_patientAnswerEvents_previousPatientAnswer_answer_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullProgressNoteActivity_patientAnswerEvents_previousPatientAnswer_answer_riskArea {
  id: string;
  title: string;
}

export interface FullProgressNoteActivity_patientAnswerEvents_previousPatientAnswer_answer_screeningTool {
  id: string;
  title: string;
}

export interface FullProgressNoteActivity_patientAnswerEvents_previousPatientAnswer_answer {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: FullProgressNoteActivity_patientAnswerEvents_previousPatientAnswer_answer_concernSuggestions[] | null;
  goalSuggestions: (FullProgressNoteActivity_patientAnswerEvents_previousPatientAnswer_answer_goalSuggestions | null)[] | null;
  riskArea: FullProgressNoteActivity_patientAnswerEvents_previousPatientAnswer_answer_riskArea | null;
  screeningTool: FullProgressNoteActivity_patientAnswerEvents_previousPatientAnswer_answer_screeningTool | null;
}

export interface FullProgressNoteActivity_patientAnswerEvents_previousPatientAnswer_question {
  id: string;
  title: string;
  answerType: AnswerTypeOptions;
}

export interface FullProgressNoteActivity_patientAnswerEvents_previousPatientAnswer {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  answerId: string;
  answer: FullProgressNoteActivity_patientAnswerEvents_previousPatientAnswer_answer;
  answerValue: string;
  patientId: string;
  applicable: boolean | null;
  question: FullProgressNoteActivity_patientAnswerEvents_previousPatientAnswer_question | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface FullProgressNoteActivity_patientAnswerEvents {
  id: string;
  patientId: string;
  patient: FullProgressNoteActivity_patientAnswerEvents_patient;
  userId: string;
  user: FullProgressNoteActivity_patientAnswerEvents_user;
  patientAnswerId: string;
  patientAnswer: FullProgressNoteActivity_patientAnswerEvents_patientAnswer;
  previousPatientAnswerId: string | null;
  previousPatientAnswer: FullProgressNoteActivity_patientAnswerEvents_previousPatientAnswer | null;
  eventType: PatientAnswerEventTypes;
  progressNoteId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullProgressNoteActivity_carePlanUpdateEvents_patient_patientInfo;
  patientState: FullProgressNoteActivity_carePlanUpdateEvents_patient_patientState;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_concern_diagnosisCodes[] | null;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patient_patientInfo;
  patientState: FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patient_patientState;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patientGoals_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patientGoals_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patientGoals_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patientGoals_patient_patientInfo;
  patientState: FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patientGoals_patient_patientState;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patientGoals_tasks_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patientGoals_tasks_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patientGoals_tasks_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patientGoals_tasks {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  assignedTo: FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patientGoals_tasks_assignedTo | null;
  assignedToId: string | null;
  followers: FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patientGoals_tasks_followers[];
  createdBy: FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patientGoals_tasks_createdBy;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patientGoals {
  id: string;
  title: string;
  patientId: string;
  patient: FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patientGoals_patient;
  patientConcernId: string | null;
  goalSuggestionTemplateId: string | null;
  tasks: FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patientGoals_tasks[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientConcern {
  id: string;
  order: number;
  concernId: string;
  concern: FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_concern;
  patientId: string;
  patient: FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patient;
  patientGoals: FullProgressNoteActivity_carePlanUpdateEvents_patientConcern_patientGoals[] | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientGoal_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientGoal_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientGoal_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullProgressNoteActivity_carePlanUpdateEvents_patientGoal_patient_patientInfo;
  patientState: FullProgressNoteActivity_carePlanUpdateEvents_patientGoal_patient_patientState;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientGoal_tasks_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientGoal_tasks_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientGoal_tasks_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientGoal_tasks {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  assignedTo: FullProgressNoteActivity_carePlanUpdateEvents_patientGoal_tasks_assignedTo | null;
  assignedToId: string | null;
  followers: FullProgressNoteActivity_carePlanUpdateEvents_patientGoal_tasks_followers[];
  createdBy: FullProgressNoteActivity_carePlanUpdateEvents_patientGoal_tasks_createdBy;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents_patientGoal {
  id: string;
  title: string;
  patientId: string;
  patient: FullProgressNoteActivity_carePlanUpdateEvents_patientGoal_patient;
  patientConcernId: string | null;
  goalSuggestionTemplateId: string | null;
  tasks: FullProgressNoteActivity_carePlanUpdateEvents_patientGoal_tasks[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullProgressNoteActivity_carePlanUpdateEvents {
  id: string;
  patientId: string;
  patient: FullProgressNoteActivity_carePlanUpdateEvents_patient;
  userId: string;
  user: FullProgressNoteActivity_carePlanUpdateEvents_user;
  patientConcernId: string | null;
  patientConcern: FullProgressNoteActivity_carePlanUpdateEvents_patientConcern | null;
  patientGoalId: string | null;
  patientGoal: FullProgressNoteActivity_carePlanUpdateEvents_patientGoal | null;
  eventType: CarePlanUpdateEventTypes;
  progressNoteId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullProgressNoteActivity_quickCallEvents_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullProgressNoteActivity_quickCallEvents {
  id: string;
  userId: string;
  user: FullProgressNoteActivity_quickCallEvents_user;
  progressNoteId: string;
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

export interface FullProgressNoteActivity_patientScreeningToolSubmissions_screeningTool {
  id: string;
  title: string;
  riskAreaId: string;
}

export interface FullProgressNoteActivity_patientScreeningToolSubmissions_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullProgressNoteActivity_patientScreeningToolSubmissions_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullProgressNoteActivity_patientScreeningToolSubmissions_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullProgressNoteActivity_patientScreeningToolSubmissions_patient_patientInfo;
  patientState: FullProgressNoteActivity_patientScreeningToolSubmissions_patient_patientState;
}

export interface FullProgressNoteActivity_patientScreeningToolSubmissions_user {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions_patient_patientInfo;
  patientState: FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions_patient_patientState;
}

export interface FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions_concern_diagnosisCodes[] | null;
}

export interface FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions_goalSuggestionTemplate_taskTemplates {
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

export interface FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions {
  id: string;
  patientId: string;
  patient: FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface FullProgressNoteActivity_patientScreeningToolSubmissions_screeningToolScoreRange {
  id: string;
  description: string;
}

export interface FullProgressNoteActivity_patientScreeningToolSubmissions {
  id: string;
  screeningToolId: string;
  screeningTool: FullProgressNoteActivity_patientScreeningToolSubmissions_screeningTool;
  patientId: string;
  patient: FullProgressNoteActivity_patientScreeningToolSubmissions_patient;
  userId: string;
  user: FullProgressNoteActivity_patientScreeningToolSubmissions_user;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  scoredAt: string | null;
  carePlanSuggestions: FullProgressNoteActivity_patientScreeningToolSubmissions_carePlanSuggestions[];
  screeningToolScoreRangeId: string | null;
  screeningToolScoreRange: FullProgressNoteActivity_patientScreeningToolSubmissions_screeningToolScoreRange | null;
}

export interface FullProgressNoteActivity {
  taskEvents: FullProgressNoteActivity_taskEvents[];
  patientAnswerEvents: FullProgressNoteActivity_patientAnswerEvents[];
  carePlanUpdateEvents: FullProgressNoteActivity_carePlanUpdateEvents[];
  quickCallEvents: FullProgressNoteActivity_quickCallEvents[];
  patientScreeningToolSubmissions: FullProgressNoteActivity_patientScreeningToolSubmissions[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullProgressNoteGlassBreakCheck
// ====================================================

export interface FullProgressNoteGlassBreakCheck {
  progressNoteId: string;
  isGlassBreakNotNeeded: boolean;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullProgressNoteTemplate
// ====================================================

export interface FullProgressNoteTemplate {
  id: string;
  title: string;
  createdAt: string;
  deletedAt: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullProgressNote
// ====================================================

export interface FullProgressNote_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullProgressNote_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullProgressNote_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullProgressNote_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullProgressNote_patient_patientInfo;
  patientState: FullProgressNote_patient_patientState;
}

export interface FullProgressNote_supervisor {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface FullProgressNote_progressNoteTemplate {
  id: string;
  title: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface FullProgressNote {
  id: string;
  patientId: string;
  user: FullProgressNote_user;
  patient: FullProgressNote_patient;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  summary: string | null;
  memberConcern: string | null;
  startedAt: string | null;
  location: string | null;
  deletedAt: string | null;
  needsSupervisorReview: boolean | null;
  reviewedBySupervisorAt: string | null;
  supervisorNotes: string | null;
  supervisor: FullProgressNote_supervisor | null;
  progressNoteTemplate: FullProgressNote_progressNoteTemplate | null;
  worryScore: number | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullQuestionCondition
// ====================================================

export interface FullQuestionCondition {
  id: string;
  questionId: string;
  answerId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullQuestion
// ====================================================

export interface FullQuestion_answers_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface FullQuestion_answers_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: FullQuestion_answers_concernSuggestions_diagnosisCodes[] | null;
}

export interface FullQuestion_answers_goalSuggestions_taskTemplates {
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

export interface FullQuestion_answers_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: FullQuestion_answers_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullQuestion_answers_riskArea {
  id: string;
  title: string;
}

export interface FullQuestion_answers_screeningTool {
  id: string;
  title: string;
}

export interface FullQuestion_answers {
  id: string;
  displayValue: string;
  value: string;
  valueType: AnswerValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
  questionId: string;
  order: number;
  concernSuggestions: FullQuestion_answers_concernSuggestions[] | null;
  goalSuggestions: (FullQuestion_answers_goalSuggestions | null)[] | null;
  riskArea: FullQuestion_answers_riskArea | null;
  screeningTool: FullQuestion_answers_screeningTool | null;
}

export interface FullQuestion_applicableIfQuestionConditions {
  id: string;
  questionId: string;
  answerId: string;
}

export interface FullQuestion_computedField {
  id: string;
  label: string;
  slug: string;
  dataType: ComputedFieldDataTypes;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullQuestion {
  id: string;
  createdAt: string;
  deletedAt: string | null;
  title: string;
  validatedSource: string | null;
  answerType: AnswerTypeOptions;
  riskAreaId: string | null;
  screeningToolId: string | null;
  order: number;
  applicableIfType: QuestionConditionTypeOptions | null;
  otherTextAnswerId: string | null;
  answers: FullQuestion_answers[] | null;
  applicableIfQuestionConditions: FullQuestion_applicableIfQuestionConditions[];
  computedFieldId: string | null;
  computedField: FullQuestion_computedField | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullQuickCall
// ====================================================

export interface FullQuickCall_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullQuickCall {
  id: string;
  userId: string;
  user: FullQuickCall_user;
  progressNoteId: string;
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


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullRiskAreaAssessmentSubmission
// ====================================================

export interface FullRiskAreaAssessmentSubmission_carePlanSuggestions_patient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullRiskAreaAssessmentSubmission_carePlanSuggestions_patient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface FullRiskAreaAssessmentSubmission_carePlanSuggestions_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: FullRiskAreaAssessmentSubmission_carePlanSuggestions_patient_patientInfo;
  patientState: FullRiskAreaAssessmentSubmission_carePlanSuggestions_patient_patientState;
}

export interface FullRiskAreaAssessmentSubmission_carePlanSuggestions_concern_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface FullRiskAreaAssessmentSubmission_carePlanSuggestions_concern {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: FullRiskAreaAssessmentSubmission_carePlanSuggestions_concern_diagnosisCodes[] | null;
}

export interface FullRiskAreaAssessmentSubmission_carePlanSuggestions_goalSuggestionTemplate_taskTemplates {
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

export interface FullRiskAreaAssessmentSubmission_carePlanSuggestions_goalSuggestionTemplate {
  id: string;
  title: string;
  taskTemplates: FullRiskAreaAssessmentSubmission_carePlanSuggestions_goalSuggestionTemplate_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullRiskAreaAssessmentSubmission_carePlanSuggestions_acceptedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface FullRiskAreaAssessmentSubmission_carePlanSuggestions_dismissedBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface FullRiskAreaAssessmentSubmission_carePlanSuggestions {
  id: string;
  patientId: string;
  patient: FullRiskAreaAssessmentSubmission_carePlanSuggestions_patient;
  suggestionType: CarePlanSuggestionType;
  concernId: string | null;
  concern: FullRiskAreaAssessmentSubmission_carePlanSuggestions_concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: FullRiskAreaAssessmentSubmission_carePlanSuggestions_goalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: FullRiskAreaAssessmentSubmission_carePlanSuggestions_acceptedBy | null;
  dismissedById: string | null;
  dismissedBy: FullRiskAreaAssessmentSubmission_carePlanSuggestions_dismissedBy | null;
  dismissedReason: string | null;
  createdAt: string;
  updatedAt: string;
  dismissedAt: string | null;
  acceptedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
}

export interface FullRiskAreaAssessmentSubmission {
  id: string;
  riskAreaId: string;
  patientId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  completedAt: string | null;
  carePlanSuggestions: FullRiskAreaAssessmentSubmission_carePlanSuggestions[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullRiskAreaForPatient
// ====================================================

export interface FullRiskAreaForPatient_riskAreaAssessmentSubmissions {
  id: string;
  createdAt: string;
}

export interface FullRiskAreaForPatient {
  id: string;
  title: string;
  assessmentType: AssessmentType;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  riskAreaAssessmentSubmissions: FullRiskAreaForPatient_riskAreaAssessmentSubmissions[];
  lastUpdated: string | null;
  forceHighRisk: boolean;
  totalScore: number | null;
  riskScore: Priority | null;
  summaryText: string[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullRiskAreaGroupForPatient
// ====================================================

export interface FullRiskAreaGroupForPatient_screeningToolResultSummaries {
  title: string;
  score: number | null;
  description: string;
}

export interface FullRiskAreaGroupForPatient_riskAreas {
  id: string;
  assessmentType: AssessmentType;
}

export interface FullRiskAreaGroupForPatient {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  shortTitle: string;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  automatedSummaryText: string[];
  manualSummaryText: string[];
  screeningToolResultSummaries: FullRiskAreaGroupForPatient_screeningToolResultSummaries[];
  lastUpdated: string | null;
  forceHighRisk: boolean;
  totalScore: number | null;
  riskScore: Priority | null;
  riskAreas: FullRiskAreaGroupForPatient_riskAreas[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullRiskAreaGroup
// ====================================================

export interface FullRiskAreaGroup {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  shortTitle: string;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullRiskAreaSummary
// ====================================================

export interface FullRiskAreaSummary {
  summary: string[];
  started: boolean;
  lastUpdated: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullRiskArea
// ====================================================

export interface FullRiskArea {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  assessmentType: AssessmentType;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  riskAreaGroupId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullRiskScore
// ====================================================

export interface FullRiskScore {
  score: number;
  forceHighRisk: boolean;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullScreeningToolScoreRange
// ====================================================

export interface FullScreeningToolScoreRange_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface FullScreeningToolScoreRange_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: FullScreeningToolScoreRange_concernSuggestions_diagnosisCodes[] | null;
}

export interface FullScreeningToolScoreRange_goalSuggestions_taskTemplates {
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

export interface FullScreeningToolScoreRange_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: FullScreeningToolScoreRange_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullScreeningToolScoreRange {
  id: string;
  description: string;
  minimumScore: number;
  maximumScore: number;
  screeningToolId: string;
  riskAdjustmentType: RiskAdjustmentTypeOptions;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  concernSuggestions: FullScreeningToolScoreRange_concernSuggestions[];
  goalSuggestions: (FullScreeningToolScoreRange_goalSuggestions | null)[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullScreeningTool
// ====================================================

export interface FullScreeningTool_screeningToolScoreRanges_concernSuggestions_diagnosisCodes {
  id: string;
  code: string;
  codesetName: string;
  label: string;
  version: string;
}

export interface FullScreeningTool_screeningToolScoreRanges_concernSuggestions {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  diagnosisCodes: FullScreeningTool_screeningToolScoreRanges_concernSuggestions_diagnosisCodes[] | null;
}

export interface FullScreeningTool_screeningToolScoreRanges_goalSuggestions_taskTemplates {
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

export interface FullScreeningTool_screeningToolScoreRanges_goalSuggestions {
  id: string;
  title: string;
  taskTemplates: FullScreeningTool_screeningToolScoreRanges_goalSuggestions_taskTemplates[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FullScreeningTool_screeningToolScoreRanges {
  id: string;
  description: string;
  minimumScore: number;
  maximumScore: number;
  screeningToolId: string;
  riskAdjustmentType: RiskAdjustmentTypeOptions;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  concernSuggestions: FullScreeningTool_screeningToolScoreRanges_concernSuggestions[];
  goalSuggestions: (FullScreeningTool_screeningToolScoreRanges_goalSuggestions | null)[] | null;
}

export interface FullScreeningTool_patientScreeningToolSubmissions {
  id: string;
  screeningToolId: string;
  patientId: string;
  userId: string;
  score: number | null;
  screeningToolScoreRangeId: string | null;
}

export interface FullScreeningTool {
  id: string;
  title: string;
  riskAreaId: string;
  screeningToolScoreRanges: FullScreeningTool_screeningToolScoreRanges[];
  patientScreeningToolSubmissions: FullScreeningTool_patientScreeningToolSubmissions[] | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullSmsMessage
// ====================================================

export interface FullSmsMessage {
  id: string;
  userId: string;
  contactNumber: string;
  patientId: string | null;
  direction: SmsMessageDirection;
  body: string;
  createdAt: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullTaskComment
// ====================================================

export interface FullTaskComment_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullTaskComment {
  id: string;
  body: string;
  user: FullTaskComment_user;
  taskId: string;
  createdAt: string;
  updatedAt: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullTaskEvent
// ====================================================

export interface FullTaskEvent_task {
  id: string;
  title: string;
  priority: Priority | null;
  patientId: string;
  patientGoalId: string;
}

export interface FullTaskEvent_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullTaskEvent_eventComment_user {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullTaskEvent_eventComment {
  id: string;
  body: string;
  user: FullTaskEvent_eventComment_user;
  taskId: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface FullTaskEvent_eventUser {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullTaskEvent {
  id: string;
  taskId: string;
  task: FullTaskEvent_task;
  userId: string;
  user: FullTaskEvent_user;
  eventType: TaskEventTypes | null;
  eventCommentId: string | null;
  eventComment: FullTaskEvent_eventComment | null;
  eventUserId: string | null;
  eventUser: FullTaskEvent_eventUser | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullTaskForCBOReferralFormPDF
// ====================================================

export interface FullTaskForCBOReferralFormPDF_patient_careTeam {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullTaskForCBOReferralFormPDF_patient_patientInfo_primaryAddress {
  id: string;
  city: string | null;
  state: string | null;
  street1: string | null;
  street2: string | null;
  zip: string | null;
  description: string | null;
}

export interface FullTaskForCBOReferralFormPDF_patient_patientInfo_primaryPhone {
  id: string;
  phoneNumber: string;
  type: PhoneTypeOptions;
  description: string | null;
}

export interface FullTaskForCBOReferralFormPDF_patient_patientInfo {
  gender: Gender | null;
  language: string | null;
  primaryAddress: FullTaskForCBOReferralFormPDF_patient_patientInfo_primaryAddress | null;
  primaryPhone: FullTaskForCBOReferralFormPDF_patient_patientInfo_primaryPhone | null;
}

export interface FullTaskForCBOReferralFormPDF_patient {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  cityblockId: number;
  dateOfBirth: string | null;
  careTeam: FullTaskForCBOReferralFormPDF_patient_careTeam[] | null;
  patientInfo: FullTaskForCBOReferralFormPDF_patient_patientInfo;
}

export interface FullTaskForCBOReferralFormPDF_assignedTo {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullTaskForCBOReferralFormPDF_createdBy {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}

export interface FullTaskForCBOReferralFormPDF_CBOReferral_category {
  id: string;
  title: string;
}

export interface FullTaskForCBOReferralFormPDF_CBOReferral_CBO {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
}

export interface FullTaskForCBOReferralFormPDF_CBOReferral {
  id: string;
  categoryId: string;
  category: FullTaskForCBOReferralFormPDF_CBOReferral_category;
  CBOId: string | null;
  CBO: FullTaskForCBOReferralFormPDF_CBOReferral_CBO | null;
  name: string | null;
  url: string | null;
  diagnosis: string | null;
  sentAt: string | null;
  acknowledgedAt: string | null;
}

export interface FullTaskForCBOReferralFormPDF {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  patient: FullTaskForCBOReferralFormPDF_patient;
  priority: Priority | null;
  assignedTo: FullTaskForCBOReferralFormPDF_assignedTo | null;
  createdBy: FullTaskForCBOReferralFormPDF_createdBy;
  CBOReferralId: string | null;
  CBOReferral: FullTaskForCBOReferralFormPDF_CBOReferral | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullTaskTemplate
// ====================================================

export interface FullTaskTemplate {
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


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullTask
// ====================================================

export interface FullTask_patient_patientInfo {
  id: string;
  gender: Gender | null;
  hasUploadedPhoto: boolean | null;
}

export interface FullTask_patient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  patientInfo: FullTask_patient_patientInfo;
}

export interface FullTask_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface FullTask_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface FullTask_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface FullTask_patientGoal_patientConcern_concern {
  id: string;
  title: string;
}

export interface FullTask_patientGoal_patientConcern {
  concern: FullTask_patientGoal_patientConcern_concern;
}

export interface FullTask_patientGoal {
  id: string;
  title: string;
  patientConcern: FullTask_patientGoal_patientConcern | null;
}

export interface FullTask_CBOReferral_category {
  id: string;
  title: string;
}

export interface FullTask_CBOReferral_CBO {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
}

export interface FullTask_CBOReferral {
  id: string;
  categoryId: string;
  category: FullTask_CBOReferral_category;
  CBOId: string | null;
  CBO: FullTask_CBOReferral_CBO | null;
  name: string | null;
  url: string | null;
  diagnosis: string | null;
  sentAt: string | null;
  acknowledgedAt: string | null;
}

export interface FullTask {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  patient: FullTask_patient;
  assignedToId: string | null;
  assignedTo: FullTask_assignedTo | null;
  followers: FullTask_followers[];
  createdBy: FullTask_createdBy;
  patientGoal: FullTask_patientGoal;
  CBOReferralId: string | null;
  CBOReferral: FullTask_CBOReferral | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullUserHours
// ====================================================

export interface FullUserHours {
  id: string;
  userId: string;
  weekday: number;
  startTime: number;
  endTime: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullUser
// ====================================================

export interface FullUser {
  id: string;
  locale: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permissions;
  isAvailable: boolean;
  awayMessage: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShortCBO
// ====================================================

export interface ShortCBO {
  id: string;
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string | null;
  phone: string;
  url: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShortEventNotificationsForUserTask
// ====================================================

export interface ShortEventNotificationsForUserTask {
  id: string;
  title: string | null;
  createdAt: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShortPatientGlassBreak
// ====================================================

export interface ShortPatientGlassBreak {
  id: string;
  patientId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShortPatientInfo
// ====================================================

export interface ShortPatientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShortPatientScreeningToolSubmission360
// ====================================================

export interface ShortPatientScreeningToolSubmission360_user {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

export interface ShortPatientScreeningToolSubmission360_screeningTool {
  id: string;
  title: string;
  riskAreaId: string;
}

export interface ShortPatientScreeningToolSubmission360_screeningToolScoreRange {
  id: string;
  description: string;
  riskAdjustmentType: RiskAdjustmentTypeOptions;
}

export interface ShortPatientScreeningToolSubmission360 {
  id: string;
  score: number | null;
  createdAt: string;
  user: ShortPatientScreeningToolSubmission360_user;
  screeningTool: ShortPatientScreeningToolSubmission360_screeningTool;
  screeningToolScoreRange: ShortPatientScreeningToolSubmission360_screeningToolScoreRange | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShortPatientScreeningToolSubmission
// ====================================================

export interface ShortPatientScreeningToolSubmission_screeningToolScoreRange {
  id: string;
  riskAdjustmentType: RiskAdjustmentTypeOptions;
  description: string;
}

export interface ShortPatientScreeningToolSubmission_patientAnswers_answer {
  id: string;
  riskAdjustmentType: RiskAdjustmentTypeOptions | null;
  inSummary: boolean | null;
  summaryText: string | null;
}

export interface ShortPatientScreeningToolSubmission_patientAnswers {
  updatedAt: string;
  answer: ShortPatientScreeningToolSubmission_patientAnswers_answer;
}

export interface ShortPatientScreeningToolSubmission {
  id: string;
  screeningToolId: string;
  patientId: string;
  userId: string;
  score: number | null;
  screeningToolScoreRangeId: string | null;
  screeningToolScoreRange: ShortPatientScreeningToolSubmission_screeningToolScoreRange | null;
  patientAnswers: ShortPatientScreeningToolSubmission_patientAnswers[] | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShortPatientState
// ====================================================

export interface ShortPatientState {
  id: string;
  currentState: CurrentPatientState;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShortPatient
// ====================================================

export interface ShortPatient_patientInfo {
  id: string;
  gender: Gender | null;
  language: string | null;
  preferredName: string | null;
  hasUploadedPhoto: boolean | null;
}

export interface ShortPatient_patientState {
  id: string;
  currentState: CurrentPatientState;
}

export interface ShortPatient {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdAt: string;
  coreIdentityVerifiedAt: string | null;
  patientInfo: ShortPatient_patientInfo;
  patientState: ShortPatient_patientState;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShortProgressNoteGlassBreak
// ====================================================

export interface ShortProgressNoteGlassBreak {
  id: string;
  progressNoteId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShortTaskForUserForPatient
// ====================================================

export interface ShortTaskForUserForPatient {
  id: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShortTask
// ====================================================

export interface ShortTask_assignedTo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface ShortTask_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface ShortTask_createdBy {
  id: string;
  firstName: string | null;
  lastName: string | null;
  googleProfileImageUrl: string | null;
  userRole: UserRole;
}

export interface ShortTask {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  deletedAt: string | null;
  dueAt: string | null;
  patientId: string;
  priority: Priority | null;
  assignedTo: ShortTask_assignedTo | null;
  assignedToId: string | null;
  followers: ShortTask_followers[];
  createdBy: ShortTask_createdBy;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShortUrgentTaskForPatient
// ====================================================

export interface ShortUrgentTaskForPatient_followers {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

export interface ShortUrgentTaskForPatient {
  id: string;
  title: string;
  dueAt: string | null;
  priority: Priority | null;
  patientId: string;
  followers: ShortUrgentTaskForPatient_followers[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShortUserWithCount
// ====================================================

export interface ShortUserWithCount {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
  patientCount: number | null;
  email: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ShortUser
// ====================================================

export interface ShortUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  googleProfileImageUrl: string | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

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
  textConsent = "textConsent",
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

export enum ContactTimeOptions {
  afternoon = "afternoon",
  evening = "evening",
  morning = "morning",
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

export enum LinesOfBusiness {
  hmo = "hmo",
  medicaid = "medicaid",
  medicare = "medicare",
  ppo = "ppo",
  ps = "ps",
}

export enum PatientInNetwork {
  no = "no",
  yes = "yes",
}

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

// 
export interface PatientFilterOptions {
  ageMin?: number | null;
  ageMax?: number | null;
  gender?: Gender | null;
  zip?: string | null;
  careWorkerId?: string | null;
  patientState?: CurrentPatientState | null;
  lineOfBusiness?: LinesOfBusiness | null;
  inNetwork?: PatientInNetwork | null;
}

// 
export interface PatientAnswerInput {
  answerId: string;
  answerValue: string;
  patientId: string;
  applicable: boolean;
  questionId: string;
}

// 
export interface PatientConcernBulkEditFields {
  id: string;
  order?: number | null;
  startedAt?: string | null;
  completedAt?: string | null;
}

// params for creating a phone
export interface PhoneCreateInput {
  phoneNumber: string;
  type: PhoneTypeOptions;
  description?: string | null;
}

// params for creating an address in the db
export interface AddressCreateInput {
  zip?: string | null;
  street1?: string | null;
  street2?: string | null;
  state?: string | null;
  city?: string | null;
  description?: string | null;
}

// params for creating an email
export interface EmailCreateInput {
  emailAddress: string;
  description?: string | null;
}

// params for creating or editing address in the db
export interface AddressInput {
  addressId?: string | null;
  zip?: string | null;
  street1?: string | null;
  street2?: string | null;
  state?: string | null;
  city?: string | null;
  description?: string | null;
}

// params for creating or editing an email in the db
export interface EmailInput {
  emailAddress: string;
  description?: string | null;
}

// params for creating or editing phone in the db
export interface PhoneInput {
  phoneId?: string | null;
  phoneNumber: string;
  type?: PhoneTypeOptions | null;
  description?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================