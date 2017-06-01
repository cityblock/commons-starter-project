//  This file was automatically generated and should not be edited.
/* tslint:disable */

export type UserRole =
  "physician" |
  "nurseCareManager" |
  "healthCoach" |
  "familyMember" |
  "anonymousUser" |
  "admin";


export interface GetCurrentUserQuery {
  // The current User
  currentUser: FullUserFragment;
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
  } | null;
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

export interface PatientHealthRecordEditMutationVariables {
  patientId: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  zip: number | null;
  suffix: string | null;
  preferredName: string | null;
  raceName: string | null;
  race: Array< string | null > | null;
  ethnicityCode: string | null;
  status: string | null;
  ssn: string | null;
  homebound: boolean | null;
  language6392code: string | null;
  maritalStatus: string | null;
  maritalStatusName: string | null;
  email: string | null;
  homePhone: string | null;
  mobilePhone: string | null;
  consentToCall: boolean | null;
  consentToText: boolean | null;
  city: string | null;
  address1: string | null;
  countryCode: string | null;
  countryCode3166: string | null;
  state: string | null;
}

export interface PatientHealthRecordEditMutation {
  // Edit a patient's health record
  patientHealthRecordEdit: FullPatientHealthRecordFragment;
}

export interface PatientHealthRecordQueryVariables {
  patientId: string;
}

export interface PatientHealthRecordQuery {
  // Patient's Athena health record
  patientHealthRecord: FullPatientHealthRecordFragment;
}

export interface PatientSetupMutationVariables {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  zip: number;
  homeClinicId: string;
  suffix: string | null;
  preferredName: string | null;
  raceName: string | null;
  race: Array< string | null > | null;
  ethnicityCode: string | null;
  status: string | null;
  ssn: string | null;
  homebound: boolean | null;
  language6392code: string | null;
  maritalStatus: string | null;
  maritalStatusName: string | null;
  email: string | null;
  homePhone: string | null;
  mobilePhone: string | null;
  consentToCall: boolean | null;
  consentToText: boolean | null;
  city: string | null;
  address1: string | null;
  countryCode: string | null;
  countryCode3166: string | null;
  state: string | null;
}

export interface PatientSetupMutation {
  // Setup patient creates the patient in the db AND in athena
  patientSetup: ShortPatientFragment;
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
  race: Array< string | null > | null;
  ethnicityCode: string | null;
  status: string | null;
  ssn: string | null;
  homebound: boolean | null;
  language6392code: string | null;
  maritalStatus: string | null;
  maritalStatusName: string | null;
  patientPhoto: boolean | null;
  patientPhotoUrl: string | null;
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
  lastName: string | null;
  dateOfBirth: string | null;
  zip: number | null;
  createdAt: string | null;
}
/* tslint:enable */
