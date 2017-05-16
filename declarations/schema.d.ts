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
  }

  /*
    description: 
  */
  interface IUser {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    userRole: IUserRoleEnum | null;
    createdAt: any;
    slackId: string | null;
  }

  /*
    description: An object with a Globally Unique ID
  */
  type uniqueUserId = IUser | IPatient;

  /*
    description: An object with a Globally Unique ID
  */
  interface IUniqueUserId {
    id: string;
  }

  /*
    description: 
  */
  type IUserRoleEnum = 'physician' | 'nurseCareManager' | 'healthCoach' | 'familyMember' | 'anonymousUser';

  /*
    description: 
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
  }

  /*
    description: 
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
    description: 
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
    description: 
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
    description: 
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
    description: 
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
    description: 
  */
  interface IPovertyLevel {
    povertyLevelIncomeDeclined: boolean | null;
    povertyLevelIncomeRangeDeclined: boolean | null;
    povertyLevelFamilySizeDeclined: boolean | null;
  }

  /*
    description: 
  */
  interface IRootMutationType {
    createUser: IUserWithAuthToken | null;
    login: IUserWithAuthToken | null;
  }

  /*
    description: Create a user input
  */
  interface ICreateUserInputType {
    email: any;
    password: any;
  }

  /*
    description: The user account with an optional auth token
  */
  interface IUserWithAuthToken {
    user: IUser;
    authToken: string | null;
  }

  /*
    description: 
  */
  interface ILoginUserInputType {
    email: string;
    password: string;
  }
}
