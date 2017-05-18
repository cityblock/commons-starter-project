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
    currentUser: IUser | null;
    patient: IPatient | null;
    clinic: IClinic | null;
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
    userRole: IUserRoleEnum | null;
    createdAt: any;
    homeClinicId: string | null;
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
    description: Patient combining data in athena and our database
  */
  interface IPatient {
    id: string;
    athenaPatientId: number;
    firstName: string | null;
    lastName: string | null;
    suffix: string | null;
    preferredName: string | null;
    raceName: string | null;
    dob: string | null;
    sex: string | null;
    race: Array<string> | null;
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
    povertyLevel: IPovertyLevel | null;
    homeClinicId: string | null;
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
    DOB: string | null;
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
    description: Patient poverty level response
  */
  interface IPovertyLevel {
    povertyLevelIncomeDeclined: boolean | null;
    povertyLevelIncomeRangeDeclined: boolean | null;
    povertyLevelFamilySizeDeclined: boolean | null;
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
    quantity: number | null;
    quantityUnit: string;
    refillsAllowed: number | null;
    renewable: boolean;
    dosageInstructions: string | null;
    source: string;
    status: string;
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
    createUser: IUserWithAuthToken | null;
    login: IUserWithAuthToken | null;
    createClinic: IClinic | null;
  }

  /*
    description: params for creating a user
  */
  interface ICreateUserInputType {
    email: any;
    password: any;
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
  interface ILoginUserInputType {
    email: string;
    password: string;
  }

  /*
    description: params for creating a clinic
  */
  interface ICreateClinicInputType {
    departmentId: number;
    name: string;
  }
}
