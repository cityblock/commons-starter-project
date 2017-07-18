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
    patientScratchPad: IPatientScratchPad | null;
    clinic: IClinic | null;
    clinics: IClinicEdges | null;
    patientEncounters: Array<IPatientEncounter> | null;
    patientMedications: IPatientMedications | null;
    task: ITask | null;
    tasksForPatient: ITaskEdges | null;
    tasksForCurrentUser: ITaskEdges | null;
    taskComments: ITaskCommentEdges | null;
    taskComment: ITaskComment | null;
  }

  /*
    description: User account model
  */
  interface IUser {
    id: string;
    locale: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    userRole: IUserRoleEnum;
    createdAt: string;
    homeClinicId: string;
    googleProfileImageUrl: string | null;
  }

  /*
    description: An object with a Globally Unique ID
  */
  type uniqueId = IUser | IPatient | IClinic | ITask | ITaskComment;

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
    middleName: string | null;
    language: string | null;
    lastName: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    zip: number | null;
    homeClinicId: string | null;
    createdAt: string | null;
    scratchPad: string | null;
    consentToCall: boolean | null;
    consentToText: boolean | null;
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
    description: Patient Scratch Pad
  */
  interface IPatientScratchPad {
    text: string | null;
  }

  /*
    description: Clinic
  */
  interface IClinic {
    id: string;
    name: string;
    departmentId: number;
    createdAt: string;
    updatedAt: string;
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
    description: PatientEncounter
  */
  interface IPatientEncounter {
    encounterType: string;
    providerName: string;
    providerRole: string;
    location: string;
    diagnoses: Array<IPatientDiagnosis>;
    reasons: Array<string>;
    dateTime: string;
  }

  /*
    description: PatientDiagnosis
  */
  interface IPatientDiagnosis {
    code: string;
    codeSystem: string;
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
    medicationId: string;
    quantity: string | null;
    quantityUnit: string | null;
    dosageInstructions: string | null;
    startDate: string | null;
  }

  /*
    description: Task
  */
  interface ITask {
    id: string;
    title: string;
    description: string | null;
    patient: IPatient | null;
    patientId: string | null;
    dueAt: string | null;
    priority: string | null;
    createdBy: IUser | null;
    createdAt: string | null;
    updatedAt: string | null;
    completedBy: IUser | null;
    completedAt: string | null;
    assignedTo: IUser | null;
    followers: Array<IUser> | null;
  }

  /*
    description: 
  */
  type ITaskOrderOptionsEnum = 'createdAtDesc' | 'createdAtAsc' | 'dueAtDesc' | 'dueAtAsc' | 'updatedAtDesc' | 'updatedAtAsc';

  /*
    description: Task edges
  */
  interface ITaskEdges {
    edges: Array<ITaskNode> | null;
    pageInfo: IPageInfo;
  }

  /*
    description: Task node
  */
  interface ITaskNode {
    node: ITask | null;
    cursor: string;
  }

  /*
    description: Task comment edges
  */
  interface ITaskCommentEdges {
    edges: Array<ITaskCommentNode> | null;
    pageInfo: IPageInfo;
  }

  /*
    description: Task comment node
  */
  interface ITaskCommentNode {
    node: ITaskComment | null;
    cursor: string;
  }

  /*
    description: Task comment
  */
  interface ITaskComment {
    id: string;
    body: string;
    user: IUser;
    taskId: string;
    createdAt: string | null;
    updatedAt: string | null;
  }

  /*
    description: 
  */
  interface IRootMutationType {
    userCreate: IUserWithAuthToken | null;
    userLogin: IUserWithAuthToken | null;
    currentUserEdit: IUser | null;
    clinicCreate: IClinic | null;
    careTeamAddUser: Array<IUser> | null;
    careTeamRemoveUser: Array<IUser> | null;
    appointmentAddNote: IAppointmentAddNoteResult | null;
    appointmentStart: IAppointment | null;
    appointmentEnd: IAppointmentEndResult | null;
    patientEdit: IPatient | null;
    patientSetup: IPatient | null;
    patientScratchPadEdit: IPatientScratchPad | null;
    taskCreate: ITask | null;
    taskEdit: ITask | null;
    taskComplete: ITask | null;
    taskUncomplete: ITask | null;
    taskUserFollow: ITask | null;
    taskUserUnfollow: ITask | null;
    taskCommentCreate: ITaskComment | null;
    taskCommentEdit: ITaskComment | null;
    taskCommentDelete: ITaskComment | null;
  }

  /*
    description: params for creating a user
  */
  interface IUserCreateInput {
    email: string;
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
    description: params for editing a current user
  */
  interface ICurrentUserEditInput {
    locale?: string | null;
    firstName?: string | null;
    lastName?: string | null;
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
    middleName?: string | null;
    lastName?: string | null;
    dateOfBirth?: string | null;
    gender?: string | null;
    zip?: number | null;
    language?: string | null;
    consentToCall?: boolean | null;
    consentToText?: boolean | null;
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
    race: string;
    ssn: string;
    language: string;
    maritalStatus: string;
    email?: string | null;
    homePhone?: string | null;
    mobilePhone?: string | null;
    consentToCall: boolean;
    consentToText: boolean;
    city?: string | null;
    address1?: string | null;
    county?: string | null;
    country?: string | null;
    state?: string | null;
    insuranceType?: string | null;
    patientRelationshipToPolicyHolder?: string | null;
    memberId?: string | null;
    policyGroupNumber?: string | null;
    issueDate?: string | null;
    expirationDate?: string | null;
  }

  /*
    description: params for editing a patient scratch pad
  */
  interface IPatientScratchPadEditInput {
    patientId: string;
    text: string;
  }

  /*
    description: params for creating a task
  */
  interface ITaskCreateInput {
    title: string;
    description?: string | null;
    dueAt?: string | null;
    patientId: string;
    assignedToId?: string | null;
  }

  /*
    description: params for creating a task
  */
  interface ITaskEditInput {
    taskId: string;
    title: string;
    description?: string | null;
    dueAt?: string | null;
    assignedToId?: string | null;
  }

  /*
    description: params for completing a task
  */
  interface ITaskCompleteInput {
    taskId: string;
  }

  /*
    description: params for adding user to a task's followers
  */
  interface ITaskFollowInput {
    userId: string;
    taskId: string;
  }

  /*
    description: params for creating a task comment
  */
  interface ITaskCommentCreateInput {
    taskId: string;
    body: string;
  }

  /*
    description: params for editing a task comment
  */
  interface ITaskCommentEditInput {
    taskCommentId: string;
    body: string;
  }

  /*
    description: params for deleting a task comment
  */
  interface ITaskCommentDeleteInput {
    taskCommentId: string;
  }
}
