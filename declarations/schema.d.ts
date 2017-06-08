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
    patientHealthRecord: IPatientHealthRecord | null;
    patientCareTeam: Array<IUser> | null;
    clinic: IClinic | null;
    clinics: IClinicEdges | null;
    patientEncounters: IPatientEncounterEdges | null;
    patientMedications: IPatientMedications | null;
  }

  /*
    description: User account model
  */
  interface IUser {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    userRole: IUserRoleEnum;
    createdAt: any;
    homeClinicId: string;
    googleProfileImageUrl: string | null;
  }

  /*
    description: An object with a Globally Unique ID
  */
  type uniqueId = IUser | IPatient | IClinic;

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
    lastName: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    zip: number | null;
    homeClinicId: string | null;
    createdAt: string | null;
    scratchPad: string | null;
  }

  /*
    description: Patient Athena health record
  */
  interface IPatientHealthRecord {
    id: string;
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    suffix: string | null;
    preferredName: string | null;
    raceName: string | null;
    race: string | null;
    ethnicityCode: string | null;
    status: string | null;
    ssn: string | null;
    homebound: boolean | null;
    language6392code: string | null;
    maritalStatus: string | null;
    maritalStatusName: string | null;
    patientPhoto: boolean | null;
    patientPhotoUrl: string | null;
    contact: IContact | null;
    guarantor: IGarantor | null;
    employer: IEmployer | null;
    address: IAddress | null;
  }

  /*
    description: Patient contact
  */
  interface IContact {
    email: string | null;
    lastEmail: string | null;
    emailExists: boolean | null;
    homePhone: string | null;
    mobilePhone: string | null;
    hasMobile: boolean | null;
    consentToCall: boolean | null;
    consentToText: boolean | null;
  }

  /*
    description: Patient Garantor (for payment)
  */
  interface IGarantor {
    firstName: string | null;
    lastName: string | null;
    suffix: string | null;
    SSN: string | null;
    dateOfBirth: string | null;
    phone: string | null;
    email: string | null;
    relationshipToPatient: string | null;
    employerId: string | null;
    address: IGarantorAddress | null;
  }

  /*
    description: Patient Garantor Address (for payment)
  */
  interface IGarantorAddress {
    addressSameAsPatient: boolean | null;
    address1: string | null;
    city: string | null;
    zip: string | null;
    state: string | null;
    countryCode: string | null;
    countryCode3166: string | null;
  }

  /*
    description: Patient employer
  */
  interface IEmployer {
    id: string | null;
    phone: string | null;
    city: string | null;
    state: string | null;
    name: string | null;
    address: string | null;
    zip: string | null;
  }

  /*
    description: Patient address
  */
  interface IAddress {
    city: string | null;
    address1: string | null;
    countryCode: string | null;
    countryCode3166: string | null;
    state: string | null;
    zip: string | null;
  }

  /*
    description: Clinic
  */
  interface IClinic {
    id: string;
    name: string;
    departmentId: number;
    createdAt: any;
    updatedAt: any;
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
    description: PatientEnounterEdges
  */
  interface IPatientEncounterEdges {
    edges: Array<IPatientEncounterNode> | null;
    pageInfo: IPageInfo;
  }

  /*
    description: PatientEncounter node
  */
  interface IPatientEncounterNode {
    node: IPatientEncounter | null;
    cursor: string;
  }

  /*
    description: PatientEncounter
  */
  interface IPatientEncounter {
    encounterType: string;
    encounterId: number;
    status: string;
    patientStatusId: number | null;
    appointmentId: number;
    stage: string | null;
    patientLocationId: number | null;
    providerId: number | null;
    encounterDate: string;
    encounterVisitName: string;
    patientLocation: string | null;
    diagnoses: Array<IPatientDiagnosis> | null;
    patientStatus: string | null;
    providerPhone: string | null;
    providerFirstName: string | null;
    providerLastName: string | null;
    lastUpdated: string;
  }

  /*
    description: PatientDiagnosis
  */
  interface IPatientDiagnosis {
    diagnosisId: number;
    icdCodes: Array<string>;
    snomedCode: number;
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
    medicationId: number;
    medicationEntryId: string;
    quantity: number | null;
    quantityUnit: string | null;
    refillsAllowed: number | null;
    renewable: boolean;
    dosageInstructions: string | null;
    stopReason: string | null;
    source: string;
    status: string;
    historical: boolean;
    lastUpdated: string;
    history: IPatientMedicationHistory;
  }

  /*
    description: PatientMedicationHistory
  */
  interface IPatientMedicationHistory {
    events: Array<IPatientMedicationHistoryEvent>;
  }

  /*
    description: PatientMedicationHistoryEvent
  */
  interface IPatientMedicationHistoryEvent {
    date: string;
    event: string;
  }

  /*
    description: 
  */
  interface IRootMutationType {
    userCreate: IUserWithAuthToken | null;
    userLogin: IUserWithAuthToken | null;
    clinicCreate: IClinic | null;
    careTeamAddUser: Array<IUser> | null;
    careTeamRemoveUser: Array<IUser> | null;
    appointmentAddNote: IAppointmentAddNoteResult | null;
    appointmentStart: IAppointment | null;
    appointmentEnd: IAppointmentEndResult | null;
    patientEdit: IPatient | null;
    patientHealthRecordEdit: IPatientHealthRecord | null;
    patientSetup: IPatient | null;
  }

  /*
    description: params for creating a user
  */
  interface IUserCreateInput {
    email: any;
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
    lastName?: string | null;
    dob?: string | null;
    gender?: string | null;
  }

  /*
    description: params for editing a patient health record in athena
  */
  interface IPatientHealthRecordEditInput {
    patientId: string;
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
    gender?: string | null;
    zip?: number | null;
    dateOfBirth?: string | null;
    suffix?: string | null;
    preferredName?: string | null;
    race?: string | null;
    ethnicityCode?: string | null;
    status?: string | null;
    ssn?: string | null;
    homebound?: boolean | null;
    language6392code?: string | null;
    maritalStatus?: string | null;
    email?: string | null;
    homePhone?: string | null;
    mobilePhone?: string | null;
    consentToCall?: boolean | null;
    consentToText?: boolean | null;
    city?: string | null;
    address1?: string | null;
    countryCode?: string | null;
    countryCode3166?: string | null;
    state?: string | null;
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
    zip: number;
    homeClinicId: string;
    suffix?: string | null;
    preferredName?: string | null;
    race?: string | null;
    ethnicityCode?: string | null;
    status?: string | null;
    ssn?: string | null;
    homebound?: boolean | null;
    language6392code?: string | null;
    maritalStatus?: string | null;
    email?: string | null;
    homePhone?: string | null;
    mobilePhone?: string | null;
    consentToCall?: boolean | null;
    consentToText?: boolean | null;
    city?: string | null;
    address1?: string | null;
    countryCode?: string | null;
    countryCode3166?: string | null;
    state?: string | null;
  }
}
