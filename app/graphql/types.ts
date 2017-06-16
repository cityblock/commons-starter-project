//  This file was automatically generated and should not be edited.
/* tslint:disable */

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


export interface AppointmentEndMutationVariables {
  patientId: string;
  appointmentId: string;
  appointmentNote: string;
}

export interface AppointmentEndMutation {
  // End an appointment
  appointmentEnd: {
    success: boolean,
  } | null;
}

export interface AppointmentStartMutationVariables {
  patientId: string;
}

export interface AppointmentStartMutation {
  // Start an appointment
  appointmentStart: FullAppointmentFragment;
}

export interface GetClinicsQueryVariables {
  pageNumber: number | null;
  pageSize: number | null;
}

export interface GetClinicsQuery {
  // Clinics
  clinics: {
    edges: Array< {
      node: FullClinicFragment,
    } > | null,
  } | null;
}

export interface GetCurrentUserQuery {
  // The current User
  currentUser: FullUserFragment;
}

export interface GetPatientCareTeamQueryVariables {
  patientId: string;
}

export interface GetPatientCareTeamQuery {
  // Users on a care team
  patientCareTeam: Array<FullUserFragment>;
}

export interface GetPatientEncountersQueryVariables {
  patientId: string;
}

export interface GetPatientEncountersQuery {
  // Patient encounters
  patientEncounters: Array<FullPatientEncounterFragment>;
}

export interface GetPatientMedicationsQueryVariables {
  patientId: string;
}

export interface GetPatientMedicationsQuery {
  // Patient medications
  patientMedications: {
    medications: {
      active: Array<FullPatientMedicationFragment>,
    },
  } | null;
}

export interface GetPatientPanelQueryVariables {
  pageNumber: number | null;
  pageSize: number | null;
}

export interface GetPatientPanelQuery {
  // List of patients the user is on the care team for (their 'patient panel')
  userPatientPanel: {
    edges: Array< {
      node: ShortPatientFragment,
    } > | null,
    pageInfo: {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
  } | null;
}

export interface GetPatientScratchPadQueryVariables {
  patientId: string;
}

export interface GetPatientScratchPadQuery {
  // Patient scratch pad
  patientScratchPad: FullPatientScratchPadFragment;
}

export interface GetPatientQueryVariables {
  patientId: string;
}

export interface GetPatientQuery {
  // A single Patient
  patient: ShortPatientFragment;
}

export interface LogInUserMutationVariables {
  googleAuthCode: string;
}

export interface LogInUserMutation {
  // Login user
  userLogin: {
    // The auth token to allow for quick login. JWT passed back in via headers for further requests
    authToken: string | null,
    user: FullUserFragment,
  } | null;
}

export interface PatientHealthRecordQueryVariables {
  patientId: string;
}

export interface PatientHealthRecordQuery {
  // Patient's Athena health record
  patientHealthRecord: FullPatientHealthRecordFragment;
}

export interface PatientScratchPadEditMutationVariables {
  patientId: string;
  text: string;
}

export interface PatientScratchPadEditMutation {
  // Edit a patient scratch pad
  patientScratchPadEdit: FullPatientScratchPadFragment;
}

export interface PatientSetupMutationVariables {
  homeClinicId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  race: string;
  zip: number;
  ssn: string;
  language: string;
  email: string | null;
  homePhone: string | null;
  mobilePhone: string | null;
  consentToCall: boolean;
  consentToText: boolean;
  issueDate: string | null;
  expirationDate: string | null;
  insuranceType: string | null;
  patientRelationshipToPolicyHolder: string | null;
  memberId: string | null;
  policyGroupNumber: string | null;
}

export interface PatientSetupMutation {
  // Setup patient creates the patient in the db AND in athena
  patientSetup: ShortPatientFragment;
}

export interface FullAppointmentFragment {
  athenaAppointmentId: string;
  dateTime: string;
  athenaDepartmentId: number;
  status: AppointmentStatus;
  athenaPatientId: number;
  duration: number;
  appointmentTypeId: number;
  appointmentType: string;
  athenaProviderId: number;
  userId: string;
  patientId: string;
  clinicId: string;
}

export interface FullClinicFragment {
  id: string;
  name: string;
}

export interface FullPatientEncounterFragment {
  encounterType: string;
  providerName: string;
  providerRole: string;
  location: string;
  diagnoses: Array< {
    code: string,
    codeSystem: string,
    description: string,
  } >;
  reasons: Array< string | null >;
  dateTime: string;
}

export interface FullPatientHealthRecordFragment {
  id: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  suffix: string | null;
  preferredName: string | null;
  raceName: string | null;
  race: string | null;
  status: string | null;
  ssn: string | null;
  homebound: boolean | null;
  language6392code: string | null;
  maritalStatus: string | null;
  maritalStatusName: string | null;
  patientPhoto: boolean | null;
  patientPhotoUrl: string | null;
}

export interface FullPatientMedicationFragment {
  medicationId: string;
  name: string;
  quantity: string | null;
  quantityUnit: string | null;
  dosageInstructions: string | null;
  startDate: string | null;
}

export interface FullPatientScratchPadFragment {
  text: string | null;
}

export interface FullUserFragment {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userRole: UserRole;
  email: string | null;
  homeClinicId: string;
  googleProfileImageUrl: string | null;
}

export interface ShortPatientFragment {
  id: string;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  language: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  zip: number | null;
  createdAt: string | null;
}
/* tslint:enable */
