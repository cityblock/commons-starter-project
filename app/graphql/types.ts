/* tslint:disable */
//  This file was automatically generated and should not be edited.

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


export type AppointmentEndMutationVariables = {
  patientId: string,
  appointmentId: string,
  appointmentNote: string,
};

export type AppointmentEndMutation = {
  // End an appointment
  appointmentEnd:  {
    success: boolean,
  } | null,
};

export type AppointmentStartMutationVariables = {
  patientId: string,
};

export type AppointmentStartMutation = {
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

export type GetClinicsQueryVariables = {
  pageNumber?: number | null,
  pageSize?: number | null,
};

export type GetClinicsQuery = {
  // Clinics
  clinics:  {
    edges:  Array< {
      node:  {
        id: string,
        name: string,
      } | null,
    } > | null,
  } | null,
};

export type CurrentUserEditMutationVariables = {
  firstName?: string | null,
  lastName?: string | null,
  locale?: string | null,
};

export type CurrentUserEditMutation = {
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

export type GetCurrentUserQuery = {
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

export type GetPatientCareTeamQueryVariables = {
  patientId: string,
};

export type GetPatientCareTeamQuery = {
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
  } > | null,
};

export type GetPatientEncountersQueryVariables = {
  patientId: string,
};

export type GetPatientEncountersQuery = {
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
    } >,
    reasons: Array< string | null >,
    dateTime: string,
  } > | null,
};

export type GetPatientMedicationsQueryVariables = {
  patientId: string,
};

export type GetPatientMedicationsQuery = {
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
      } >,
    },
  } | null,
};

export type GetPatientPanelQueryVariables = {
  pageNumber?: number | null,
  pageSize?: number | null,
};

export type GetPatientPanelQuery = {
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
    } > | null,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
  } | null,
};

export type GetPatientScratchPadQueryVariables = {
  patientId: string,
};

export type GetPatientScratchPadQuery = {
  // Patient scratch pad
  patientScratchPad:  {
    text: string | null,
  } | null,
};

export type GetPatientQueryVariables = {
  patientId: string,
};

export type GetPatientQuery = {
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

export type GetTaskQueryVariables = {
  taskId: string,
};

export type GetTaskQuery = {
  // Task
  task:  {
    id: string,
    title: string,
    description: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    dueAt: string | null,
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
    } | null,
    createdBy:  {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
    } | null,
    followers:  Array< {
      id: string,
      firstName: string | null,
      lastName: string | null,
      googleProfileImageUrl: string | null,
    } > | null,
  } | null,
};

export type LogInUserMutationVariables = {
  googleAuthCode: string,
};

export type LogInUserMutation = {
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

export type PatientEditMutationVariables = {
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

export type PatientEditMutation = {
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

export type PatientHealthRecordQueryVariables = {
  patientId: string,
};

export type PatientHealthRecordQuery = {
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

export type PatientScratchPadEditMutationVariables = {
  patientId: string,
  text: string,
};

export type PatientScratchPadEditMutation = {
  // Edit a patient scratch pad
  patientScratchPadEdit:  {
    text: string | null,
  } | null,
};

export type PatientSetupMutationVariables = {
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

export type PatientSetupMutation = {
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

export type GetTasksForCurrentUserQueryVariables = {
  pageNumber?: number | null,
  pageSize?: number | null,
};

export type GetTasksForCurrentUserQuery = {
  // Current user's Tasks
  tasksForCurrentUser:  {
    edges:  Array< {
      node:  {
        id: string,
        title: string,
        description: string | null,
        createdAt: string | null,
        dueAt: string | null,
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
        } | null,
        followers:  Array< {
          id: string,
          firstName: string | null,
          lastName: string | null,
          googleProfileImageUrl: string | null,
        } > | null,
      } | null,
    } > | null,
    pageInfo:  {
      hasPreviousPage: boolean,
      hasNextPage: boolean,
    },
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
  } >,
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

export type FullTaskFragment = {
  id: string,
  title: string,
  description: string | null,
  createdAt: string | null,
  updatedAt: string | null,
  dueAt: string | null,
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
  } | null,
  createdBy:  {
    id: string,
    firstName: string | null,
    lastName: string | null,
    googleProfileImageUrl: string | null,
  } | null,
  followers:  Array< {
    id: string,
    firstName: string | null,
    lastName: string | null,
    googleProfileImageUrl: string | null,
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

export type ShortTaskFragment = {
  id: string,
  title: string,
  description: string | null,
  createdAt: string | null,
  dueAt: string | null,
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
  } | null,
  followers:  Array< {
    id: string,
    firstName: string | null,
    lastName: string | null,
    googleProfileImageUrl: string | null,
  } > | null,
};
/* tslint:enable */
