import { format } from 'date-fns';
import { get, isNil } from 'lodash';
import nock from 'nock';
import { Transaction } from 'objection';
import {
  AnswerTypeOptions,
  AnswerValueTypeOptions,
  AssessmentType,
  CarePlanSuggestionType,
  ComputedFieldDataTypes,
  CurrentPatientState,
  DocumentTypeOptions,
  ExternalProviderOptions,
  Gender,
  PatientRelationOptions,
  PhoneTypeOptions,
  Priority,
  RiskAdjustmentTypeOptions,
  SmsMessageDirection,
  TaskEventTypes,
  UserRole,
} from 'schema';
import uuid from 'uuid/v4';
import Address from './models/address';
import Answer from './models/answer';
import CarePlanSuggestion from './models/care-plan-suggestion';
import CarePlanUpdateEvent from './models/care-plan-update-event';
import CareTeam from './models/care-team';
import CBO from './models/cbo';
import CBOCategory from './models/cbo-category';
import CBOReferral from './models/cbo-referral';
import Clinic from './models/clinic';
import ComputedField from './models/computed-field';
import ComputedPatientStatus from './models/computed-patient-status';
import Concern from './models/concern';
import EventNotification from './models/event-notification';
import GoalSuggestionTemplate from './models/goal-suggestion-template';
import Patient from './models/patient';
import PatientAddress from './models/patient-address';
import PatientAnswer from './models/patient-answer';
import PatientAnswerEvent from './models/patient-answer-event';
import PatientConcern from './models/patient-concern';
import PatientContact from './models/patient-contact';
import PatientDocument from './models/patient-document';
import PatientGoal from './models/patient-goal';
import PatientInfo from './models/patient-info';
import PatientList from './models/patient-list';
import PatientPhone from './models/patient-phone';
import PatientScreeningToolSubmission from './models/patient-screening-tool-submission';
import PatientState from './models/patient-state';
import Phone from './models/phone';
import ProgressNote from './models/progress-note';
import ProgressNoteTemplate from './models/progress-note-template';
import Question from './models/question';
import RiskArea from './models/risk-area';
import RiskAreaAssessmentSubmission from './models/risk-area-assessment-submission';
import RiskAreaGroup from './models/risk-area-group';
import ScreeningTool from './models/screening-tool';
import ScreeningToolScoreRange from './models/screening-tool-score-range';
import SmsMessage from './models/sms-message';
import Task from './models/task';
import TaskEvent from './models/task-event';
import User from './models/user';

export interface ICreateRiskArea {
  title?: string;
  order?: number;
}

export interface ICreatePatient {
  cityblockId: number;
  homeClinicId: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  userId?: string;
  gender?: Gender;
  language?: string;
  ssn?: string;
  middleName?: string;
  ssnEnd?: string;
}

export async function createPatient(patient: ICreatePatient, txn: Transaction): Promise<Patient> {
  const {
    cityblockId,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    userId,
    homeClinicId,
    ssn,
    middleName,
    ssnEnd,
    language,
  } = patient;

  const mockPatient = await Patient.create(
    createMockPatient(
      cityblockId,
      homeClinicId,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      language,
      ssn,
      ssnEnd,
      middleName,
    ),
    txn,
  );

  // Automatically create the CareTeam association if a userId is passed in
  if (userId) {
    await CareTeam.create({ userId, patientId: mockPatient.id }, txn);
  }

  return mockPatient;
}

export async function createAddressForPatient(
  street1: string,
  zip: string,
  patientId: string,
  userId: string,
  txn: Transaction,
): Promise<Address> {
  const address = await Address.create({ zip, street1, updatedById: userId }, txn);
  await PatientAddress.create({ addressId: address.id, patientId }, txn);
  return address;
}

export async function createPrimaryAddressForPatient(
  zip: string,
  patientId: string,
  patientInfoId: string,
  userId: string,
  txn: Transaction,
): Promise<Address> {
  const address = await Address.create({ zip, updatedById: userId }, txn);
  await PatientAddress.create({ addressId: address.id, patientId }, txn);
  await PatientInfo.edit({ primaryAddressId: address.id, updatedById: userId }, patientInfoId, txn);
  return address;
}

export function createMockAddress(userId: string) {
  return {
    street1: '55 Washington St',
    zip: '11201',
    state: 'NY',
    city: 'Brooklyn',
    description: 'Office',
    updatedById: userId,
  };
}

export function createMockPhone(phoneNumber?: string, phoneType?: PhoneTypeOptions) {
  return {
    phoneNumber: phoneNumber || '123-456-7890',
    type: phoneType || ('home' as PhoneTypeOptions),
    description: 'moms home phone',
  };
}

export function createMockEmail(userId: string) {
  return {
    emailAddress: 'spam@email.com',
    description: 'spam email',
    updatedById: userId,
  };
}

export function createMockPatient(
  cityblockId: number,
  homeClinicId: string,
  firstName?: string,
  lastName?: string,
  dateOfBirth?: string,
  gender?: Gender,
  language?: string,
  ssn?: string,
  ssnEnd?: string,
  middleName?: string,
) {
  return {
    patientId: uuid(),
    cityblockId,
    firstName: firstName || 'dan',
    middleName: middleName || undefined,
    lastName: lastName || 'plant',
    gender: (gender || 'male') as Gender,
    ssn: ssn || '123456789',
    ssnEnd: ssnEnd || '6789',
    language: language || 'en',
    homeClinicId,
    dateOfBirth: dateOfBirth || '01/01/1900',
    zip: '12343',
    addressLine1: '1 Main St',
    addressLine2: '',
    city: 'New York',
    state: 'NY',
    email: '',
    phone: '',
    nmi: '12345',
    mrn: '23456',
    productDescription: 'something',
    lineOfBusiness: 'medicaid',
    medicaidPremiumGroup: null,
    pcpName: null,
    pcpPractice: null,
    pcpPhone: null,
    pcpAddress: null,
    memberId: '12345',
    insurance: 'Company A',
    inNetwork: false,
  };
}

export function createMockPatientContact(
  patientId: string,
  userId: string,
  phone: { phoneNumber: string },
  options?: {
    email?: { emailAddress: string };
    address?: { zip: string; state?: string };
    firstName?: string;
    lastName?: string;
    relationToPatient?: PatientRelationOptions;
    relationFreeText?: string;
    isEmergencyContact?: boolean;
    isHealthcareProxy?: boolean;
    description?: string;
    isConsentedForSubstanceUse?: boolean;
    isConsentedForHiv?: boolean;
    isConsentedForStd?: boolean;
    isConsentedForGeneticTesting?: boolean;
    isConsentedForFamilyPlanning?: boolean;
    isConsentedForMentalHealth?: boolean;
    consentDocumentId?: string;
  },
) {
  const isEmergencyContact = get(options, 'isEmergencyContact');
  const isHealthcareProxy = get(options, 'isHealthcareProxy');

  return {
    phone,
    updatedById: userId,
    patientId,
    firstName: get(options, 'firstName') || 'harry',
    lastName: get(options, 'lastName') || 'potter',
    relationToPatient: get(options, 'relationToPatient') || ('parent' as PatientRelationOptions),
    relationFreeText: get(options, 'relationFreeText') || null,
    isEmergencyContact: isNil(isEmergencyContact) ? false : isEmergencyContact,
    isHealthcareProxy: isNil(isHealthcareProxy) ? false : isHealthcareProxy,
    email: get(options, 'email'),
    address: get(options, 'address'),
    description: get(options, 'description') || 'some contact description',
    isConsentedForSubstanceUse: get(options, 'isConsentedForSubstanceUse'),
    isConsentedForHiv: get(options, 'isConsentedForHiv'),
    isConsentedForStd: get(options, 'isConsentedForStd'),
    isConsentedForGeneticTesting: get(options, 'isConsentedForGeneticTesting'),
    isConsentedForFamilyPlanning: get(options, 'isConsentedForFamilyPlanning'),
    isConsentedForMentalHealth: get(options, 'isConsentedForMentalHealth'),
    consentDocumentId: get(options, 'consentDocumentId'),
  };
}

export function createMockPatientExternalProvider(
  patientId: string,
  userId: string,
  { phoneNumber }: { phoneNumber: string },
  organizationId: string,
  options?: {
    email?: { emailAddress: string };
    firstName?: string;
    lastName?: string;
    role?: ExternalProviderOptions;
    roleFreeText?: string;
    description?: string;
  },
) {
  return {
    phone: { phoneNumber, type: 'mobile' },
    updatedById: userId,
    patientId,
    firstName: get(options, 'firstName') || 'Hermione',
    lastName: get(options, 'lastName') || 'Granger',
    role: get(options, 'role') || ('psychiatrist' as ExternalProviderOptions),
    patientExternalOrganizationId: organizationId,
    roleFreeText: get(options, 'roleFreeText') || null,
    email: get(options, 'email'),
    description: get(options, 'description') || 'some provider description',
  };
}

export function createMockPatientExternalOrganization(
  patientId: string,
  name: string,
  options?: {
    addressId?: string;
    description?: string;
    phoneNumber?: string;
    faxNumber?: string;
    isConsentedForSubstanceUse?: boolean;
    isConsentedForHiv?: boolean;
    isConsentedForStd?: boolean;
    isConsentedForGeneticTesting?: boolean;
    isConsentedForFamilyPlanning?: boolean;
    isConsentedForMentalHealth?: boolean;
    consentDocumentId?: string;
  },
) {
  return {
    patientId,
    name,
    addressId: get(options, 'addressId'),
    description: get(options, 'description') || 'some organization description',
    phoneNumber: get(options, 'phoneNumber') || '+17778884455',
    faxNumber: get(options, 'faxNumber') || '+12223338899',
    isConsentedForSubstanceUse: get(options, 'isConsentedForSubstanceUse'),
    isConsentedForHiv: get(options, 'isConsentedForHiv'),
    isConsentedForStd: get(options, 'isConsentedForStd'),
    isConsentedForGeneticTesting: get(options, 'isConsentedForGeneticTesting'),
    isConsentedForFamilyPlanning: get(options, 'isConsentedForFamilyPlanning'),
    isConsentedForMentalHealth: get(options, 'isConsentedForMentalHealth'),
    consentDocumentId: get(options, 'consentDocumentId'),
  };
}

export function createMockPatientInfo(primaryAddressId?: string) {
  return {
    gender: 'male' as Gender,
    language: 'en',
    primaryAddressId,
  };
}

export function createMockUser(
  athenaProviderId = 1,
  homeClinicId: string,
  userRole: UserRole = 'Pharmacist' as UserRole,
  email: string = 'dan@plant.com',
) {
  return {
    firstName: 'dan',
    lastName: 'plant',
    userRole,
    email,
    homeClinicId,
    athenaProviderId,
  };
}

export function createMockClinic(name = 'The Dan Plant Center', departmentId = 11) {
  return {
    name,
    departmentId,
  };
}

export async function createRiskArea(input: ICreateRiskArea, txn: Transaction): Promise<RiskArea> {
  const title = input.title || 'Viscerion is a zombie dragon';
  const order = input.order || 1;
  const riskAreaGroup = await RiskAreaGroup.create(createMockRiskAreaGroup(), txn);
  return RiskArea.create(
    {
      title,
      assessmentType: 'manual' as AssessmentType,
      riskAreaGroupId: riskAreaGroup.id,
      order,
      mediumRiskThreshold: 5,
      highRiskThreshold: 8,
    },
    txn,
  );
}

export function createMockRiskAreaGroup(
  title = 'Night King Breach of the Wall',
  order = 1,
  mediumRiskThreshold = 50,
  highRiskThreshold = 80,
) {
  return {
    title,
    shortTitle: 'ripViscerion',
    order,
    mediumRiskThreshold,
    highRiskThreshold,
  };
}

export function createMockQuestion(riskAreaId: string) {
  return {
    title: 'Who will win the War for the Dawn?',
    answerType: 'dropdown' as AnswerTypeOptions,
    riskAreaId,
    type: 'riskArea',
    order: 1,
  };
}

export function createMockAnswer(questionId: string) {
  return {
    displayValue: 'Jon Snow <3',
    value: '3',
    valueType: 'number' as AnswerValueTypeOptions,
    riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
    inSummary: false,
    questionId,
    order: 1,
  };
}

// Google Auth
export function mockGoogleOauthAuthorize(idToken: string) {
  nock('https://www.googleapis.com/oauth2/v4/token')
    .post('')
    .reply(200, {
      id_token: idToken,
      expires_in: 3600,
      access_token: 'stub',
      token_type: 'Bearer',
    });
}

export function mockGoogleCredentials() {
  return {
    GCP_CREDS:
      '{"private_key":"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyxrqMnMzxS81l\\n0fbRMDgg2je3wDLBOg96cSnIcb4cq2mmKQwYUQyzSikcVhBF4OwJOuybntOtxlyG\\nDz9f66rW8G4hKdcz0m7Og6fcMP25BT4plVOMNPZPjFu66RJE1ZNqiv6uzZXEgOAn\\na2xlXg+o0ejaqvpxe/meNad4cLjsjM2/pOqy9Pk2sBp3yFggyO1tECVFnitik+Oq\\nRm45796fCmUh8GcvPiJUg+x/u0Url0VZzVBwhiQtdEUYx/tUSWxVggNJGPUcUER2\\nFm+xcfeN5GhaxS5+ZTTZyEWhZJQxeASE17jBl8c7XkDqMQlwotK0GS/hhLluFJvP\\nBAF5B4+dAgMBAAECggEAEcRAK9M1ZtGCsxi/r6BcI5+sI9287YkImsF+RoZPP2gl\\nkrbHle8QFQ1Msp029srYij5J31lUbhOlhEklojG4g63XNAKFeYfzLSDWYMKZpHaJ\\n6/YEHI3y4IrxXszk3ORgxxjTIKobtTCdli1N03Eam0tpGboeM4L/lqJ8ZzLEnfVh\\nXr9A47wgJpB4CZh1ipjmqDQJQ8Ej3JygaXErT04J0mmGs9ZO2M/ijl2PubqibcQs\\njt2MKGMcwVTXxjqES5tjUYKzYpl9IW2528SRUiYH5egQiEr7EUd4m2dWouiQ4UEj\\nJGCbrrOySzMLFcLD7XwuLyze6kkz121MM4vSG8rS4QKBgQD1HvHBuYN4eUd08gkb\\npDZs4zFBjI8okNkZfsvr/o8GFHdm+5in60dXda13ZtrzYT+Bl+ck/jarEZlWgqV6\\nEcti6i58xVP7FLc3bAZg0BMrYAEDYlVeuFZex99nbaawUlY6JyPQppgCX6AY1EhD\\nnfgS1yXl5Ziiom1ASQEiulU7hQKBgQC6tfqsBWRM8l5xUlCz0UJi7+G9kKLbIUQL\\nnJQRP3PTX9/KzUZi5EOzKLp3zEEz3N8fLn9YI9hUu7qAGC/ZLrHORIfOeOL6Tt2C\\nvcrWNlYHzxVp6LG2r6vyYA1XpeDheyMIXuRKPYjAJU91ru70vpPOyQ8xVUKYt2fa\\nhv40zQvDOQKBgE6yhanN1tDqFzALuTLfsP2an6jM6PV8M8eEtxHoo6CvF3q/0k4v\\nMrN4u523LxquoUYJMBPnbkPUHafxwBEF/4edahly/TiCeSRZEV8pzs3BP/IHMyN7\\nCXfasfYx9S9s7/QxtsT5h5pTe0Idfan/4LKj0q4R3cRxY6QdDDlLG6xFAoGAPueQ\\nzOQEJuiBaSyShAK8mxi2tWdFdw5+Hmtid20pWM20WF9Ql4DQTkwqhrIKRa7kfVzt\\nCoUJHYMiEoYTmNhij1wHZUjVL//iIWpQLFuiIH9kd4ouVZ5aEA7Mb/szCMSzyN4v\\ni9Ovfw0S+FM3rr2GjuSuebB//3PLSZSxkJiEngECgYEA416H0a457vjnN6mzTktD\\nXI3Na36Q/VdXmMR5f9GXagpsBIO101XM7U3YY36jD7GzQaOQpZvwiZKy0jVLfx8B\\nXb1Ugj9ljqyWt9K0Fni+LrsvkV2pPURokdT3j+DfcnOklUMAPQzzZZ2FfkFX80do\\ngnIFsJBQxOKRwboOpg2YZtl=\\n-----END PRIVATE KEY-----\\n","client_email":"laura-robot@fake-credentials.iam.gserviceaccount.com"}',
    subject: 'test@faketestorg.cityblock.engineering',
    GCS_PATIENT_BUCKET: 'test-patient-data',
  };
}

export async function cleanPatientAnswerEvents(patientId: string, txn: Transaction) {
  const patientAnswerEvents = await PatientAnswerEvent.getAllForPatient(
    patientId,
    {
      pageNumber: 0,
      pageSize: 10,
    },
    txn,
  );
  const patientAnswerEventDeletions = patientAnswerEvents.results.map(async patientAnswerEvent =>
    PatientAnswerEvent.delete(patientAnswerEvent.id, txn),
  );

  await Promise.all(patientAnswerEventDeletions);
}

export async function cleanCarePlanUpdateEvents(patientId: string, txn: Transaction) {
  const carePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatient(
    patientId,
    {
      pageNumber: 0,
      pageSize: 10,
    },
    txn,
  );

  const carePlanUpdateEventDeletions = carePlanUpdateEvents.results.map(async carePlanUpdateEvent =>
    CarePlanUpdateEvent.delete(carePlanUpdateEvent.id, txn),
  );

  await Promise.all(carePlanUpdateEventDeletions);
}

interface ICreateTaskOptions {
  patientId: string;
  userId: string;
  dueAt: string;
  patientGoalId?: string;
  cboReferralId?: string;
}

export async function createTask(options: ICreateTaskOptions, txn: Transaction) {
  let patientGoalId = options.patientGoalId;
  if (!options.patientGoalId) {
    const concern = await Concern.create({ title: 'Night King brought the Wall down' }, txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: options.patientId,
        userId: options.userId,
      },
      txn,
    );
    const patientGoal = await PatientGoal.create(
      {
        patientId: options.patientId,
        title: 'goal title',
        userId: options.userId,
        patientConcernId: patientConcern.id,
      },
      txn,
    );
    patientGoalId = patientGoal.id;
  }
  return Task.create(
    {
      title: 'Defeat Night King',
      dueAt: options.dueAt,
      patientId: options.patientId,
      createdById: options.userId,
      assignedToId: options.userId,
      patientGoalId: patientGoalId!,
      CBOReferralId: options.cboReferralId,
      priority: 'high' as Priority,
    },
    txn,
  );
}

export async function createCBOReferralTask(
  patientId: string,
  userId: string,
  CBOReferralId: string,
  txn: Transaction,
) {
  const concern = await Concern.create({ title: 'Night King brought the Wall down' }, txn);
  const patientConcern = await PatientConcern.create(
    {
      concernId: concern.id,
      patientId,
      userId,
    },
    txn,
  );
  const patientGoal = await PatientGoal.create(
    { userId, patientId, title: 'CBO referral goal', patientConcernId: patientConcern.id },
    txn,
  );
  return Task.create(
    {
      title: 'Defeat Cersei and Lannister Army',
      dueAt: '02/05/2018',
      patientId,
      createdById: userId,
      assignedToId: userId,
      priority: 'high' as Priority,
      CBOReferralId,
      patientGoalId: patientGoal.id,
    },
    txn,
  );
}

const patient1Name = 'Arya';
const patient2Name = 'Rickon';
const patient3Name = 'Robb';
const patient4Name = 'Bran';
const patient5Name = 'Sansa';

export async function setupPatientsNewToCareTeam(txn: Transaction) {
  const clinic = await Clinic.create(createMockClinic("King's Landing", 13), txn);
  const user = await User.create(createMockUser(211, clinic.id), txn);

  const patient1 = await createPatient(
    {
      cityblockId: 123,
      firstName: patient1Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  await createPatient(
    {
      cityblockId: 234,
      firstName: patient2Name,
      homeClinicId: clinic.id,
    },
    txn,
  );
  const patient3 = await createPatient(
    {
      cityblockId: 345,
      firstName: patient3Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );

  await CareTeam.delete({ userId: user.id, patientId: patient1.id }, txn);
  await CareTeam.create({ userId: user.id, patientId: patient1.id }, txn);

  await CareTeam.query(txn)
    .where({ userId: user.id, patientId: patient3.id })
    .patch({ createdAt: new Date('2017-01-01').toISOString() });

  return { user, patient1 };
}

export async function setupPatientsWithPendingSuggestions(txn: Transaction) {
  const clinic = await Clinic.create(createMockClinic('Dragonstone', 3), txn);
  const user = await User.create(createMockUser(311, clinic.id), txn);
  const user2 = await User.create(createMockUser(411, clinic.id), txn);

  const patient1 = await createPatient(
    {
      cityblockId: 123,
      firstName: patient1Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  const patient2 = await createPatient(
    {
      cityblockId: 234,
      firstName: patient2Name,
      homeClinicId: clinic.id,
      userId: user2.id,
    },
    txn,
  );
  await createPatient(
    {
      cityblockId: 345,
      firstName: patient3Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  const patient4 = await createPatient(
    {
      cityblockId: 456,
      firstName: patient4Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );

  const concern = await Concern.create({ title: 'Cersei lied to Jon Snow' }, txn);
  const computedField = await ComputedField.create(
    {
      slug: 'drogon',
      label: 'Has a massive dragon',
      dataType: 'boolean' as ComputedFieldDataTypes,
    },
    txn,
  );

  await CarePlanSuggestion.create(
    {
      patientId: patient1.id,
      concernId: concern.id,
      suggestionType: 'concern' as CarePlanSuggestionType,
      type: 'computedFieldAnswer',
      computedFieldId: computedField.id,
    },
    txn,
  );
  await CarePlanSuggestion.create(
    {
      patientId: patient2.id,
      concernId: concern.id,
      suggestionType: 'concern' as CarePlanSuggestionType,
      type: 'computedFieldAnswer',
      computedFieldId: computedField.id,
    },
    txn,
  );
  const suggestion4 = await CarePlanSuggestion.create(
    {
      patientId: patient4.id,
      concernId: concern.id,
      suggestionType: 'concern' as CarePlanSuggestionType,
      type: 'computedFieldAnswer',
      computedFieldId: computedField.id,
    },
    txn,
  );
  await CarePlanSuggestion.dismiss(
    {
      carePlanSuggestionId: suggestion4.id,
      dismissedById: user.id,
      dismissedReason: 'Jon Snow got this',
    },
    txn,
  );

  return { patient1, user };
}

export async function setupPatientsWithMissingInfo(txn: Transaction) {
  const clinic = await Clinic.create(createMockClinic('The Wall', 13), txn);
  const user = await User.create(createMockUser(211, clinic.id), txn);
  const user2 = await User.create(createMockUser(311, clinic.id), txn);

  // FOR NOW THESE ARE SPECIAL CASES AND YOU SHOULD NOT USE createPatient
  const patient = await Patient.create(
    {
      patientId: uuid(),
      cityblockId: 5678,
      firstName: patient1Name,
      lastName: 'Stark',
      homeClinicId: clinic.id,
      dateOfBirth: '01/01/1900',
      ssn: '123456789',
      ssnEnd: '6789',
      gender: null as any,
      language: null,
      zip: '12341',
      city: 'New York',
      state: 'NY',
      addressLine1: '1 Main St',
      addressLine2: '',
      nmi: '123123',
      phone: '',
      email: '',
      mrn: '12345',
      productDescription: 'something',
      lineOfBusiness: 'HMO',
      medicaidPremiumGroup: null,
      pcpName: null,
      pcpPractice: null,
      pcpPhone: null,
      pcpAddress: null,
      memberId: 'K0000',
      insurance: 'Company A',
      inNetwork: true,
    },
    txn,
  );
  await CareTeam.create({ userId: user.id, patientId: patient.id }, txn);

  const patient1 = await Patient.create(
    {
      patientId: uuid(),
      cityblockId: 5679,
      firstName: patient2Name,
      lastName: 'Stark',
      homeClinicId: clinic.id,
      dateOfBirth: '01/01/1900',
      ssn: '012345678',
      ssnEnd: '5678',
      gender: null as any,
      language: null,
      zip: '12341',
      city: 'New York',
      state: 'NY',
      addressLine1: '1 Main St',
      addressLine2: '',
      nmi: '321123',
      phone: '',
      email: '',
      mrn: '12345',
      productDescription: 'something',
      lineOfBusiness: 'HMO',
      medicaidPremiumGroup: null,
      pcpName: null,
      pcpPractice: null,
      pcpPhone: null,
      pcpAddress: null,
      memberId: 'K0000',
      insurance: 'Company A',
      inNetwork: true,
    },
    txn,
  );
  await CareTeam.create({ userId: user.id, patientId: patient1.id }, txn);

  const patient2 = await Patient.create(
    {
      patientId: uuid(),
      cityblockId: 6789,
      firstName: patient3Name,
      lastName: 'Stark',
      homeClinicId: clinic.id,
      dateOfBirth: '01/01/1910',
      ssn: '234567890',
      ssnEnd: '7890',
      gender: null as any,
      language: null,
      zip: '12341',
      city: 'New York',
      state: 'NY',
      addressLine1: '1 Main St',
      addressLine2: '',
      nmi: '4532341',
      phone: '',
      email: '',
      mrn: '12345',
      productDescription: 'something',
      lineOfBusiness: 'HMO',
      medicaidPremiumGroup: null,
      pcpName: null,
      pcpPractice: null,
      pcpPhone: null,
      pcpAddress: null,
      memberId: 'K0000',
      insurance: 'Company A',
      inNetwork: true,
    },
    txn,
  );
  await CareTeam.create({ userId: user2.id, patientId: patient2.id }, txn);
  const address = await createAddressForPatient(
    '55 Washington St',
    '11238',
    patient1.id,
    user.id,
    txn,
  );
  await PatientInfo.edit(
    {
      ...createMockPatientInfo(address.id),
      updatedById: user.id,
    },
    patient1.patientInfo.id,
    txn,
  );

  return { user, patient };
}

export async function setupPatientsWithAssignedState(txn: Transaction) {
  const clinic = await Clinic.create(createMockClinic('Pentos', 13), txn);
  const user = await User.create(createMockUser(311, clinic.id), txn);
  const user2 = await User.create(createMockUser(213, clinic.id), txn);

  const patient1 = await createPatient(
    {
      cityblockId: 123,
      firstName: patient1Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  const patient2 = await createPatient(
    {
      cityblockId: 234,
      firstName: patient2Name,
      homeClinicId: clinic.id,
      userId: user2.id,
    },
    txn,
  );
  const patient3 = await createPatient(
    {
      cityblockId: 345,
      firstName: patient3Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );

  await PatientState.updateForPatient(
    {
      patientId: patient1.id,
      updatedById: user.id,
      currentState: 'assigned' as CurrentPatientState,
    },
    txn,
  );

  await PatientState.updateForPatient(
    {
      patientId: patient2.id,
      updatedById: user.id,
      currentState: 'assigned' as CurrentPatientState,
    },
    txn,
  );

  await PatientState.updateForPatient(
    {
      patientId: patient3.id,
      updatedById: user.id,
      currentState: 'enrolled' as CurrentPatientState,
    },
    txn,
  );

  return { patient1, user };
}

export async function setupPatientsWithIntakeInProgress(txn: Transaction) {
  const clinic = await Clinic.create(createMockClinic('Pentos', 13), txn);
  const user = await User.create(createMockUser(311, clinic.id), txn);
  const user2 = await User.create(createMockUser(213, clinic.id), txn);

  const patient1 = await createPatient(
    {
      cityblockId: 123,
      firstName: patient1Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  await ComputedPatientStatus.updateForPatient(patient1.id, user.id, txn);

  // complete checklist for patient2
  const patient2 = await createPatient(
    {
      cityblockId: 234,
      firstName: patient2Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );

  await Patient.query(txn).patchAndFetchById(patient2.id, {
    coreIdentityVerifiedAt: new Date().toISOString(),
    coreIdentityVerifiedById: user.id,
  });
  await PatientInfo.edit(
    {
      gender: 'nonbinary' as Gender,
      hasHealthcareProxy: false,
      hasMolst: false,
      hasDeclinedPhotoUpload: true,
      updatedById: user.id,
    },
    patient2.patientInfo.id,
    txn,
  );
  await PatientContact.create(
    {
      patientId: patient2.id,
      updatedById: user.id,
      relationToPatient: 'sibling' as PatientRelationOptions,
      firstName: 'Aya',
      lastName: 'Stark',
      isEmergencyContact: true,
      isHealthcareProxy: false,
    },
    txn,
  );
  await PatientDocument.create(
    {
      patientId: patient2.id,
      uploadedById: user.id,
      filename: 'test2.txt',
      description: 'some file for consent',
      documentType: 'hipaaConsent' as DocumentTypeOptions,
    },
    txn,
  );
  await PatientDocument.create(
    {
      patientId: patient2.id,
      uploadedById: user.id,
      filename: 'test3.txt',
      description: 'some file for consent',
      documentType: 'hieHealthixConsent' as DocumentTypeOptions,
    },
    txn,
  );
  await PatientDocument.create(
    {
      patientId: patient2.id,
      uploadedById: user.id,
      filename: 'test.txt',
      description: 'some file for consent',
      documentType: 'cityblockConsent' as DocumentTypeOptions,
    },
    txn,
  );
  await ComputedPatientStatus.updateForPatient(patient2.id, user.id, txn);

  // partially complete checklist for patient 3
  const patient3 = await createPatient(
    {
      cityblockId: 345,
      firstName: patient3Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  await PatientInfo.edit(
    {
      gender: 'nonbinary' as Gender,
      hasHealthcareProxy: false,
      hasMolst: false,
      hasDeclinedPhotoUpload: true,
      updatedById: user.id,
    },
    patient3.patientInfo.id,
    txn,
  );
  await ComputedPatientStatus.updateForPatient(patient3.id, user.id, txn);

  // create patient for other user
  const patient4 = await createPatient(
    {
      cityblockId: 456,
      firstName: patient4Name,
      homeClinicId: clinic.id,
      userId: user2.id,
    },
    txn,
  );
  await ComputedPatientStatus.updateForPatient(patient4.id, user.id, txn);

  return { patient1, patient3, user };
}

export async function setupPatientsWithNoRecentEngagement(txn: Transaction) {
  const clinic = await Clinic.create(createMockClinic('The Dothraki Sea', 13), txn);
  const user = await User.create(createMockUser(211, clinic.id), txn);
  const user2 = await User.create(createMockUser(212, clinic.id), txn);

  const patient1 = await createPatient(
    {
      cityblockId: 123,
      firstName: patient1Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  const patient2 = await createPatient(
    {
      cityblockId: 234,
      firstName: patient2Name,
      homeClinicId: clinic.id,
      userId: user2.id,
    },
    txn,
  );
  const patient3 = await createPatient(
    {
      cityblockId: 345,
      firstName: patient3Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );

  const progressNoteTemplate = await ProgressNoteTemplate.create(
    {
      title: 'Join forces with Daenerys',
    },
    txn,
  );

  await ProgressNote.create(
    {
      patientId: patient2.id,
      userId: user2.id,
      progressNoteTemplateId: progressNoteTemplate.id,
    },
    txn,
  );
  await ProgressNote.create(
    {
      patientId: patient3.id,
      userId: user.id,
      progressNoteTemplateId: progressNoteTemplate.id,
    },
    txn,
  );

  return { user, patient1 };
}

export async function setupPatientsWithOutOfDateMAP(txn: Transaction) {
  const clinic = await Clinic.create(createMockClinic('Pentos', 13), txn);
  const user = await User.create(createMockUser(311, clinic.id), txn);
  const user2 = await User.create(createMockUser(213, clinic.id), txn);

  const patient1 = await createPatient(
    {
      cityblockId: 123,
      firstName: patient1Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  const patient2 = await createPatient(
    {
      cityblockId: 234,
      firstName: patient2Name,
      homeClinicId: clinic.id,
      userId: user2.id,
    },
    txn,
  );
  const patient3 = await createPatient(
    {
      cityblockId: 345,
      firstName: patient3Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );

  const concern = await Concern.create({ title: 'Night King brought the Wall down' }, txn);

  await PatientConcern.create(
    {
      concernId: concern.id,
      patientId: patient2.id,
      userId: user2.id,
    },
    txn,
  );

  await PatientConcern.create(
    {
      concernId: concern.id,
      patientId: patient3.id,
      userId: user.id,
    },
    txn,
  );

  return { patient1, user };
}

export async function setupPatientsWithOpenCBOReferrals(txn: Transaction) {
  const clinic = await Clinic.create(createMockClinic('Dorne', 13), txn);
  const user = await User.create(createMockUser(211, clinic.id), txn);
  const user2 = await User.create(createMockUser(311, clinic.id), txn);
  const cbo = await createCBO(txn);

  const patient1 = await createPatient(
    {
      cityblockId: 123,
      firstName: patient1Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  const patient2 = await createPatient(
    {
      cityblockId: 234,
      firstName: patient2Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  await createPatient(
    {
      cityblockId: 235,
      firstName: patient3Name,
      homeClinicId: clinic.id,
      userId: user2.id,
    },
    txn,
  );
  const patient4 = await createPatient(
    {
      cityblockId: 238,
      firstName: patient4Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  const patient5 = await createPatient(
    {
      cityblockId: 237,
      firstName: patient5Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );

  const cboReferral1 = await CBOReferral.create(
    {
      categoryId: cbo.categoryId,
      CBOId: cbo.id,
    },
    txn,
  );
  await createCBOReferralTask(patient1.id, user.id, cboReferral1.id, txn);
  const cboReferral2 = await CBOReferral.create(
    {
      categoryId: cbo.categoryId,
    },
    txn,
    true,
  );
  await createCBOReferralTask(patient5.id, user.id, cboReferral2.id, txn);
  const cboReferral3 = await CBOReferral.create(
    {
      categoryId: cbo.categoryId,
      CBOId: cbo.id,
    },
    txn,
  );
  await createCBOReferralTask(patient4.id, user2.id, cboReferral3.id, txn);
  const cboReferral4 = await CBOReferral.create(
    {
      categoryId: cbo.categoryId,
      CBOId: cbo.id,
    },
    txn,
  );
  await CBOReferral.edit(
    {
      sentAt: '01/01/2018',
      acknowledgedAt: '01/01/2018',
    },
    cboReferral4.id,
    txn,
  );
  await createCBOReferralTask(patient2.id, user.id, cboReferral4.id, txn);

  return { patient1, patient5, user };
}

export async function setupUrgentTasks(txn: Transaction) {
  const clinic = await Clinic.create(createMockClinic('Winterfell', 12), txn);
  const user = await User.create(createMockUser(111, clinic.id), txn);
  const user2 = await User.create(createMockUser(121, clinic.id), txn);

  const patient1 = await createPatient(
    {
      cityblockId: 123,
      firstName: patient1Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  const patient2 = await createPatient(
    {
      cityblockId: 234,
      firstName: patient2Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  await createPatient(
    {
      cityblockId: 345,
      firstName: patient3Name,
      homeClinicId: clinic.id,
      userId: user2.id,
    },
    txn,
  );
  await createPatient(
    {
      cityblockId: 456,
      firstName: patient4Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  const patient5 = await createPatient(
    {
      cityblockId: 567,
      firstName: patient5Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );

  const soonDueDate = '2017-09-07T13:45:14.532Z';
  const laterDueDate = '2050-11-07T13:45:14.532Z';
  const concern = await Concern.create({ title: 'Night King brought the Wall down' }, txn);
  const patientConcern1 = await PatientConcern.create(
    {
      concernId: concern.id,
      patientId: patient1.id,
      userId: user.id,
    },
    txn,
  );

  const patientGoal1 = await PatientGoal.create(
    {
      userId: user.id,
      patientId: patient1.id,
      title: 'urgent tasks goal',
      patientConcernId: patientConcern1.id,
    },
    txn,
  );

  const patientConcern2 = await PatientConcern.create(
    {
      concernId: concern.id,
      patientId: patient2.id,
      userId: user.id,
    },
    txn,
  );

  const patientGoal2 = await PatientGoal.create(
    {
      userId: user.id,
      patientId: patient2.id,
      title: 'urgent tasks goal',
      patientConcernId: patientConcern2.id,
    },
    txn,
  );
  const patientConcern5 = await PatientConcern.create(
    {
      concernId: concern.id,
      patientId: patient5.id,
      userId: user.id,
    },
    txn,
  );

  const patientGoal5 = await PatientGoal.create(
    {
      userId: user.id,
      patientId: patient5.id,
      title: 'urgent tasks goal',
      patientConcernId: patientConcern5.id,
    },
    txn,
  );
  const task1 = await createTask(
    {
      patientId: patient1.id,
      userId: user.id,
      dueAt: soonDueDate,
      patientGoalId: patientGoal1.id,
    },
    txn,
  );
  await createTask(
    {
      patientId: patient1.id,
      userId: user.id,
      dueAt: laterDueDate,
      patientGoalId: patientGoal1.id,
    },
    txn,
  );
  await createTask(
    {
      patientId: patient2.id,
      userId: user.id,
      dueAt: laterDueDate,
      patientGoalId: patientGoal2.id,
    },
    txn,
  );
  const task = await createTask(
    {
      patientId: patient5.id,
      userId: user.id,
      dueAt: laterDueDate,
      patientGoalId: patientGoal5.id,
    },
    txn,
  );
  await createTask(
    {
      patientId: patient5.id,
      userId: user2.id,
      dueAt: soonDueDate,
      patientGoalId: patientGoal5.id,
    },
    txn,
  );

  const taskEvent = await TaskEvent.create(
    {
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_description' as TaskEventTypes,
    },
    txn,
  );
  const eventNotification = await EventNotification.create(
    {
      userId: user.id,
      taskEventId: taskEvent.id,
    },
    txn,
  );
  const taskEvent2 = await TaskEvent.create(
    {
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_description' as TaskEventTypes,
    },
    txn,
  );
  const eventNotification2 = await EventNotification.create(
    {
      userId: user.id,
      taskEventId: taskEvent2.id,
    },
    txn,
  );
  await EventNotification.create(
    {
      userId: user2.id,
      taskEventId: taskEvent2.id,
    },
    txn,
  );
  await EventNotification.dismiss(eventNotification2.id, txn);

  return { user, user2, patient1, patient5, task, task1, eventNotification };
}

export async function setupRecentConversations(txn: Transaction) {
  const clinic = await Clinic.create(createMockClinic('Winterfell', 12), txn);
  const user = await User.create(createMockUser(111, clinic.id), txn);
  const user2 = await User.create(createMockUser(121, clinic.id), txn);
  const phone1 = await Phone.create(createMockPhone('(123) 456-1111'), txn);
  const phone2 = await Phone.create(createMockPhone('(123) 456-2222'), txn);
  const phone3 = await Phone.create(createMockPhone('(123) 456-3333'), txn);
  const phone4 = await Phone.create(createMockPhone('(123) 456-4444'), txn);
  const phone5 = await Phone.create(createMockPhone('(123) 456-5555'), txn);

  const patient1 = await createPatient(
    {
      cityblockId: 123,
      firstName: patient1Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  const patient2 = await createPatient(
    {
      cityblockId: 234,
      firstName: patient2Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  const patient3 = await await createPatient(
    {
      cityblockId: 345,
      firstName: patient3Name,
      homeClinicId: clinic.id,
      userId: user2.id,
    },
    txn,
  );
  const patient4 = await createPatient(
    {
      cityblockId: 456,
      firstName: patient4Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  const patient5 = await createPatient(
    {
      cityblockId: 567,
      firstName: patient5Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );

  await PatientPhone.create({ patientId: patient1.id, phoneId: phone1.id }, txn);
  await PatientPhone.create({ patientId: patient2.id, phoneId: phone2.id }, txn);
  await PatientPhone.create({ patientId: patient3.id, phoneId: phone3.id }, txn);
  await PatientPhone.create({ patientId: patient4.id, phoneId: phone4.id }, txn);
  await PatientPhone.create({ patientId: patient5.id, phoneId: phone5.id }, txn);

  await SmsMessage.create(
    {
      userId: user.id,
      contactNumber: phone1.phoneNumber,
      direction: 'toUser' as SmsMessageDirection,
      body: 'Winter is coming',
      twilioPayload: {},
      messageSid: 'ABfbe57a569adc67124a71a10f965BOGUS',
    },
    txn,
  );

  await SmsMessage.create(
    {
      userId: user.id,
      contactNumber: phone5.phoneNumber,
      direction: 'fromUser' as SmsMessageDirection,
      body: 'All men must die. But we are not men.',
      twilioPayload: {},
      messageSid: 'BCfbe57a569adc67124a71a10f965BOGUS',
    },
    txn,
  );

  await SmsMessage.create(
    {
      userId: user2.id,
      contactNumber: phone3.phoneNumber,
      direction: 'fromUser' as SmsMessageDirection,
      body: 'All men must die. But we are not men.',
      twilioPayload: {},
      messageSid: 'CDfbe57a569adc67124a71a10f965BOGUS',
    },
    txn,
  );

  await SmsMessage.create(
    {
      userId: user.id,
      contactNumber: phone3.phoneNumber,
      direction: 'fromUser' as SmsMessageDirection,
      body: 'You know nothing Jon Snow.',
      twilioPayload: {},
      messageSid: 'DEfbe57a569adc67124a71a10f965BOGUS',
    },
    txn,
  );

  await SmsMessage.create(
    {
      userId: user.id,
      contactNumber: phone1.phoneNumber,
      direction: 'fromUser' as SmsMessageDirection,
      body: 'Winter is here',
      twilioPayload: {},
      messageSid: 'EFfbe57a569adc67124a71a10f965BOGUS',
    },
    txn,
  );

  await SmsMessage.create(
    {
      userId: user2.id,
      contactNumber: phone5.phoneNumber,
      direction: 'fromUser' as SmsMessageDirection,
      body: 'Where are my dragons?!',
      twilioPayload: {},
      messageSid: 'FGfbe57a569adc67124a71a10f965BOGUS',
    },
    txn,
  );

  const sms = await SmsMessage.create(
    {
      userId: user.id,
      contactNumber: phone4.phoneNumber,
      direction: 'fromUser' as SmsMessageDirection,
      body: 'I drink and I know things.',
      twilioPayload: {},
      messageSid: 'GHfbe57a569adc67124a71a10f965BOGUS',
    },
    txn,
  );

  await SmsMessage.query(txn).patchAndFetchById(sms.id, {
    createdAt: new Date('2017-01-01').toISOString(),
  });

  return { user, patient1, patient5 };
}

function getDateOfBirthForAge(age: number) {
  const dateOfBirth = new Date();
  dateOfBirth.setFullYear(dateOfBirth.getFullYear() - age);
  return format(dateOfBirth, 'MM/DD/YYYY');
}

export async function setupPatientsForPanelFilter(txn: Transaction) {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id), txn);
  const user2 = await User.create(createMockUser(12, clinic.id), txn);
  const user3 = await User.create(createMockUser(13, clinic.id), txn);

  const patient1 = await createPatient(
    {
      cityblockId: 14,
      firstName: 'Robb',
      lastName: 'Stark',
      homeClinicId: clinic.id,
      dateOfBirth: getDateOfBirthForAge(19),
      userId: user.id,
    },
    txn,
  );
  await createPrimaryAddressForPatient('11211', patient1.id, patient1.patientInfo.id, user.id, txn);

  const patient2 = await createPatient(
    {
      cityblockId: 15,
      firstName: 'Mark',
      lastName: 'Man',
      homeClinicId: clinic.id,
      dateOfBirth: getDateOfBirthForAge(80),
      userId: user.id,
    },
    txn,
  );
  await createPrimaryAddressForPatient('10001', patient2.id, patient2.patientInfo.id, user.id, txn);

  const patient3 = await createPatient(
    {
      cityblockId: 16,
      firstName: 'Jane',
      lastName: 'Jacobs',
      homeClinicId: clinic.id,
      dateOfBirth: getDateOfBirthForAge(20),
      userId: user.id,
      gender: 'female' as Gender,
    },
    txn,
  );
  await createPrimaryAddressForPatient('11211', patient3.id, patient3.patientInfo.id, user.id, txn);

  const patient4 = await createPatient(
    {
      cityblockId: 17,
      firstName: 'Maxie',
      lastName: 'Jacobs',
      homeClinicId: clinic.id,
      dateOfBirth: getDateOfBirthForAge(23),
      userId: user.id,
      gender: 'female' as Gender,
    },
    txn,
  );
  await createPrimaryAddressForPatient('10055', patient4.id, patient4.patientInfo.id, user.id, txn);

  const patient5 = await createPatient(
    {
      cityblockId: 18,
      firstName: 'Juanita',
      lastName: 'Jacobs',
      homeClinicId: clinic.id,
      dateOfBirth: getDateOfBirthForAge(73),
      userId: user2.id,
      gender: 'female' as Gender,
    },
    txn,
  );
  await createPrimaryAddressForPatient('11211', patient5.id, patient5.patientInfo.id, user.id, txn);
  await CareTeam.create({ patientId: patient5.id, userId: user3.id }, txn);
  await PatientState.updateForPatient(
    {
      patientId: patient5.id,
      updatedById: user.id,
      currentState: 'enrolled' as CurrentPatientState,
    },
    txn,
  );

  return { user, user2, user3, patient5 };
}

export async function createAnswerAssociations(txn: Transaction) {
  const riskAreaGroup = await RiskAreaGroup.create(createMockRiskAreaGroup(), txn);
  const riskArea = await RiskArea.create(
    {
      title: 'Night King Destroyed the Wall',
      riskAreaGroupId: riskAreaGroup.id,
      assessmentType: 'manual' as AssessmentType,
      order: 1,
      mediumRiskThreshold: 4,
      highRiskThreshold: 8,
    },
    txn,
  );

  const question = await Question.create(
    {
      title: 'Who will win the war for the dawn?',
      answerType: 'dropdown' as AnswerTypeOptions,
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    },
    txn,
  );

  const answer1 = await Answer.create(
    {
      displayValue: 'zombieViscerion',
      value: '3',
      valueType: 'number' as AnswerValueTypeOptions,
      riskAdjustmentType: 'increment' as RiskAdjustmentTypeOptions,
      inSummary: true,
      summaryText: 'Dragon has blue eyes',
      questionId: question.id,
      order: 1,
    },
    txn,
  );
  const answer2 = await Answer.create(
    {
      displayValue: 'nightKingMagic',
      value: '4',
      valueType: 'number' as AnswerValueTypeOptions,
      riskAdjustmentType: 'increment' as RiskAdjustmentTypeOptions,
      inSummary: true,
      summaryText: 'Dragon breathes blue fire',
      questionId: question.id,
      order: 1,
    },
    txn,
  );
  const answer3 = await Answer.create(
    {
      displayValue: 'theDragonHasThreeHeads',
      value: '5',
      valueType: 'number' as AnswerValueTypeOptions,
      riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
      inSummary: true,
      summaryText: 'Dragon is ridden by Night King',
      questionId: question.id,
      order: 1,
    },
    txn,
  );

  return { answer1, answer2, answer3 };
}

export async function setupComputedPatientList(txn: Transaction) {
  const clinic = await Clinic.create(createMockClinic('Winterfell', 12), txn);
  const user = await User.create(createMockUser(111, clinic.id), txn);
  const user2 = await User.create(createMockUser(211, clinic.id), txn);

  const patient1 = await createPatient(
    {
      cityblockId: 123,
      firstName: patient1Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  const patient2 = await createPatient(
    {
      cityblockId: 234,
      firstName: patient2Name,
      homeClinicId: clinic.id,
      userId: user2.id,
    },
    txn,
  );
  const patient3 = await createPatient(
    {
      cityblockId: 345,
      firstName: patient3Name,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );

  const riskAreaGroup = await RiskAreaGroup.create(createMockRiskAreaGroup(), txn);
  const riskArea = await RiskArea.create(
    {
      title: 'Night King Destroyed the Wall',
      riskAreaGroupId: riskAreaGroup.id,
      assessmentType: 'manual' as AssessmentType,
      order: 1,
      mediumRiskThreshold: 4,
      highRiskThreshold: 8,
    },
    txn,
  );

  const question = await Question.create(
    {
      title: 'Who will win the war for the dawn?',
      answerType: 'dropdown' as AnswerTypeOptions,
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    },
    txn,
  );

  const answer = await Answer.create(
    {
      displayValue: 'zombieViscerion',
      value: '3',
      valueType: 'number' as AnswerValueTypeOptions,
      riskAdjustmentType: 'increment' as RiskAdjustmentTypeOptions,
      inSummary: true,
      summaryText: 'Dragon has blue eyes',
      questionId: question.id,
      order: 1,
    },
    txn,
  );

  await PatientList.create(
    {
      title: 'White Walkers',
      order: 1,
      answerId: answer.id,
    },
    txn,
  );

  const screeningTool = await ScreeningTool.create(
    {
      title: 'White Walker Screening Tool',
      riskAreaId: riskArea.id,
    },
    txn,
  );

  const patientScreeningToolSubmission1 = await PatientScreeningToolSubmission.create(
    {
      screeningToolId: screeningTool.id,
      patientId: patient1.id,
      userId: user.id,
    },
    txn,
  );

  const screeningToolPatientAnswers1 = await PatientAnswer.createForScreeningTool(
    {
      patientId: patient1.id,
      patientScreeningToolSubmissionId: patientScreeningToolSubmission1.id,
      questionIds: [question.id],
      answers: [
        {
          questionId: question.id,
          answerId: answer.id,
          answerValue: '',
          patientId: patient1.id,
          applicable: true,
          userId: user.id,
        },
      ],
    },
    txn,
  );

  await PatientScreeningToolSubmission.submitScore(
    patientScreeningToolSubmission1.id,
    { patientAnswers: screeningToolPatientAnswers1 },
    txn,
  );

  const patientScreeningToolSubmission2 = await PatientScreeningToolSubmission.create(
    {
      screeningToolId: screeningTool.id,
      patientId: patient2.id,
      userId: user.id,
    },
    txn,
  );

  const screeningToolPatientAnswers2 = await PatientAnswer.createForScreeningTool(
    {
      patientId: patient2.id,
      patientScreeningToolSubmissionId: patientScreeningToolSubmission2.id,
      questionIds: [question.id],
      answers: [
        {
          questionId: question.id,
          answerId: answer.id,
          answerValue: '',
          patientId: patient2.id,
          applicable: true,
          userId: user.id,
        },
      ],
    },
    txn,
  );

  await PatientScreeningToolSubmission.submitScore(
    patientScreeningToolSubmission2.id,
    { patientAnswers: screeningToolPatientAnswers2 },
    txn,
  );

  const patientScreeningToolSubmission3 = await PatientScreeningToolSubmission.create(
    {
      screeningToolId: screeningTool.id,
      patientId: patient3.id,
      userId: user.id,
    },
    txn,
  );

  const screeningToolPatientAnswers3 = await PatientAnswer.createForScreeningTool(
    {
      patientId: patient3.id,
      patientScreeningToolSubmissionId: patientScreeningToolSubmission3.id,
      questionIds: [question.id],
      answers: [
        {
          questionId: question.id,
          answerId: answer.id,
          answerValue: '',
          patientId: patient3.id,
          applicable: false,
          userId: user.id,
        },
      ],
    },
    txn,
  );

  await PatientScreeningToolSubmission.submitScore(
    patientScreeningToolSubmission3.id,
    { patientAnswers: screeningToolPatientAnswers3 },
    txn,
  );

  return { patient1, patient2, patient3, answer, user };
}

export async function createFullRiskAreaGroupAssociations(
  riskAreaGroupId: string,
  patientId: string,
  userId: string,
  riskAreaTitle: string,
  txn: Transaction,
) {
  const riskAreaTitle2 = 'Zombie Drogon';
  const riskArea = await RiskArea.create(
    {
      title: riskAreaTitle,
      riskAreaGroupId,
      assessmentType: 'manual' as AssessmentType,
      order: 1,
      mediumRiskThreshold: 4,
      highRiskThreshold: 8,
    },
    txn,
  );
  await RiskArea.create(
    {
      title: riskAreaTitle2,
      riskAreaGroupId,
      assessmentType: 'automated' as AssessmentType,
      order: 2,
      mediumRiskThreshold: 4,
      highRiskThreshold: 8,
    },
    txn,
  );
  const question = await Question.create(
    {
      title: 'like writing tests?',
      answerType: 'dropdown' as AnswerTypeOptions,
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    },
    txn,
  );
  const question2 = await Question.create(
    {
      title: 'hate writing tests?',
      answerType: 'dropdown' as AnswerTypeOptions,
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 2,
    },
    txn,
  );
  const question3 = await Question.create(
    {
      title: 'really hate writing tests?',
      answerType: 'dropdown' as AnswerTypeOptions,
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    },
    txn,
  );
  const answer1 = await Answer.create(
    {
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number' as AnswerValueTypeOptions,
      riskAdjustmentType: 'increment' as RiskAdjustmentTypeOptions,
      inSummary: true,
      summaryText: 'Dragon has blue eyes',
      questionId: question.id,
      order: 1,
    },
    txn,
  );
  const answer2 = await Answer.create(
    {
      displayValue: 'hates writing tests!',
      value: '4',
      valueType: 'number' as AnswerValueTypeOptions,
      riskAdjustmentType: 'increment' as RiskAdjustmentTypeOptions,
      inSummary: true,
      summaryText: 'Dragon breathes blue fire',
      questionId: question2.id,
      order: 1,
    },
    txn,
  );
  const answer3 = await Answer.create(
    {
      displayValue: 'really hates writing tests!',
      value: '5',
      valueType: 'number' as AnswerValueTypeOptions,
      riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
      inSummary: true,
      summaryText: 'Dragon is ridden by Night King',
      questionId: question3.id,
      order: 1,
    },
    txn,
  );
  const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create(
    {
      patientId,
      userId,
      riskAreaId: riskArea.id,
    },
    txn,
  );
  const screeningTool = await ScreeningTool.create(
    {
      title: 'Screening Tool Title',
      riskAreaId: riskArea.id,
    },
    txn,
  );
  await ScreeningToolScoreRange.create(
    {
      screeningToolId: screeningTool.id,
      description: 'Score Range Description',
      minimumScore: 1,
      maximumScore: 5,
      riskAdjustmentType: 'increment' as RiskAdjustmentTypeOptions,
    },
    txn,
  );
  const screeningToolQuestion = await Question.create(
    {
      title: 'screening tool says what?',
      answerType: 'dropdown' as AnswerTypeOptions,
      screeningToolId: screeningTool.id,
      type: 'screeningTool',
      order: 1,
    },
    txn,
  );
  await Answer.create(
    {
      displayValue: 'screening tool says answer 1',
      value: '0',
      valueType: 'number' as AnswerValueTypeOptions,
      riskAdjustmentType: 'inactive' as RiskAdjustmentTypeOptions,
      inSummary: false,
      questionId: screeningToolQuestion.id,
      order: 1,
    },
    txn,
  );
  const screeningToolAnswer2 = await Answer.create(
    {
      displayValue: 'screening tool says answer 2',
      value: '1',
      valueType: 'number' as AnswerValueTypeOptions,
      riskAdjustmentType: 'inactive' as RiskAdjustmentTypeOptions,
      inSummary: false,
      questionId: screeningToolQuestion.id,
      order: 2,
    },
    txn,
  );
  const patientScreeningToolSubmission = await PatientScreeningToolSubmission.create(
    {
      screeningToolId: screeningTool.id,
      patientId,
      userId,
    },
    txn,
  );
  const screeningToolPatientAnswers = await PatientAnswer.createForScreeningTool(
    {
      patientId,
      patientScreeningToolSubmissionId: patientScreeningToolSubmission.id,
      questionIds: [screeningToolAnswer2.questionId],
      answers: [
        {
          questionId: screeningToolAnswer2.questionId,
          answerId: screeningToolAnswer2.id,
          answerValue: screeningToolAnswer2.value,
          patientId,
          applicable: true,
          userId,
        },
      ],
    },
    txn,
  );
  await PatientScreeningToolSubmission.submitScore(
    patientScreeningToolSubmission.id,
    { patientAnswers: screeningToolPatientAnswers },
    txn,
  );

  await PatientAnswer.createForRiskArea(
    {
      patientId,
      riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
      questionIds: [answer1.questionId, answer2.id, answer3.id],
      answers: [
        {
          questionId: answer1.questionId,
          answerId: answer1.id,
          answerValue: '3',
          patientId,
          applicable: true,
          userId,
        },
        {
          questionId: answer2.questionId,
          answerId: answer2.id,
          answerValue: '4',
          patientId,
          applicable: false,
          userId,
        },
        {
          questionId: answer3.questionId,
          answerId: answer3.id,
          answerValue: '5',
          patientId,
          applicable: true,
          userId,
        },
      ],
    },
    txn,
  );

  return { answer1, answer2, answer3 };
}

export async function createCBOCategory(txn: Transaction, title: string = 'Food Services') {
  return CBOCategory.create(
    {
      title,
    },
    txn,
  );
}

export async function createCBO(txn: Transaction, name: string = "Night's Watch") {
  const cboCategory = await createCBOCategory(txn);

  const cbo = await CBO.create(
    {
      name,
      categoryId: cboCategory.id,
      address: '55 Washington Street',
      city: 'Brooklyn',
      state: 'NY',
      zip: '10013',
      phone: '(212) 555-5555',
      url: 'www.cityblock.com',
    },
    txn,
  );

  return cbo;
}

export async function createCBOReferral(txn: Transaction) {
  const cbo = await createCBO(txn);

  return CBOReferral.create(
    {
      categoryId: cbo.categoryId,
      CBOId: cbo.id,
      diagnosis: 'Winter is here',
    },
    txn,
  );
}

// Google Cloud Storage
export function mockGoogleCloudStorageAggregatedDataFileDownload(
  bucket: string,
  patientId: string,
  file: 'medications' | 'diagnoses' | 'encounters',
  fileContents: string,
) {
  nock(
    `https://www.googleapis.com/storage/v1/b/${bucket}/o/${patientId}%2Faggregated_data%2F${file}.json`,
  )
    .get('')
    .reply(200, [Buffer.from(fileContents, 'utf8')]);
}

export function createMockPatientProblemFile() {
  return `
    [
      {
        "timestamp": "2018-05-07T17:33:41.381Z",
        "messageId": "345514190",
        "patient": {
          "patientId": "d78b790a-b0c1-4ce7-aed1-6e5384eb2f47",
          "externalId": "123",
          "source": {
            "name": "ACPNY"
          }
        },
        "problem": {
          "StartDate": "2017-10-23",
          "EndDate": "",
          "Code": "15640441000119104",
          "CodeSystem": "2.16.840.1.113883.6.96",
          "CodeSystemName": "SNOMED CT",
          "Name": "Primary open angle glaucoma of right eye",
          "Category": {
            "Code": "55607006",
            "CodeSystem": "2.16.840.1.113883.6.96",
            "CodeSystemName": "SNOMED CT",
            "Name": "Problem"
          },
          "HealthStatus": {
            "Code": "",
            "CodeSystem": "",
            "CodeSystemName": "",
            "Name": ""
          },
          "Status": {
            "Code": "55561003",
            "CodeSystem": "2.16.840.1.113883.6.96",
            "CodeSystemName": "SNOMED CT",
            "Name": "Active"
          }
        }
      },
      {
        "timestamp": "2018-05-07T17:33:41.381Z",
        "messageId": "345514190",
        "patient": {
          "patientId": "d78b790a-b0c1-4ce7-aed1-6e5384eb2f47",
          "externalId": "5826211",
          "source": {
            "name": "ACPNY"
          }
        },
        "problem": {
          "StartDate": "2017-10-23",
          "EndDate": "",
          "Code": "426875007",
          "CodeSystem": "2.16.840.1.113883.6.96",
          "CodeSystemName": "SNOMED CT",
          "Name": "Diabetes 1.5, managed as type 2 (HCC)",
          "Category": {
            "Code": "55607006",
            "CodeSystem": "2.16.840.1.113883.6.96",
            "CodeSystemName": "SNOMED CT",
            "Name": "Problem"
          },
          "HealthStatus": {
            "Code": "",
            "CodeSystem": "",
            "CodeSystemName": "",
            "Name": ""
          },
          "Status": {
            "Code": "55561003",
            "CodeSystem": "2.16.840.1.113883.6.96",
            "CodeSystemName": "SNOMED CT",
            "Name": "Active"
          }
        }
      },
    ]
  `;
}

export function createMockPatientMedicationsFile() {
  return `
    [
      {
        "timestamp": "2018-05-07T17:33:41.410Z",
        "messageId": "345514190",
        "patient": {
          "patientId": "d78b790a-b0c1-4ce7-aed1-6e5384eb2f47",
          "externalId": "123",
          "source": {
            "name": "ACPNY"
          }
        },
        "medication": {
          "Prescription": true,
          "FreeTextSig": "",
          "Dose": {
            "Quantity": "5",
            "Units": "MG"
          },
          "Rate": {
            "Quantity": "",
            "Units": ""
          },
          "Route": {
            "Code": "PO",
            "CodeSystem": "2.16.840.1.113883.3.26.1.1",
            "CodeSystemName": "NCI Thesaurus",
            "Name": "Oral"
          },
          "StartDate": "",
          "EndDate": "",
          "Frequency": {
            "Period": "",
            "Unit": ""
          },
          "IsPRN": false,
          "Product": {
            "Code": "1049621",
            "CodeSystem": "2.16.840.1.113883.6.88",
            "CodeSystemName": "RxNorm",
            "Name": "oxyCODONE (ROXICODONE) 5 MG immediate release tablet"
          }
        }
      },
      {
        "timestamp": "2018-05-07T17:33:41.410Z",
        "messageId": "345514190",
        "patient": {
          "patientId": "d78b790a-b0c1-4ce7-aed1-6e5384eb2f47",
          "externalId": "5826211",
          "source": {
            "name": "ACPNY"
          }
        },
        "medication": {
          "Prescription": true,
          "FreeTextSig": "",
          "Dose": {
            "Quantity": "5",
            "Units": "MG"
          },
          "Rate": {
            "Quantity": "",
            "Units": ""
          },
          "Route": {
            "Code": "NEBULIZATION",
            "CodeSystem": "2.16.840.1.113883.3.26.1.1",
            "CodeSystemName": "NCI Thesaurus",
            "Name": "Nebulization"
          },
          "StartDate": "2016-08-17T19:15:00.000Z",
          "EndDate": "",
          "Frequency": {
            "Period": "",
            "Unit": ""
          },
          "IsPRN": false,
          "Product": {
            "Code": "245314",
            "CodeSystem": "2.16.840.1.113883.6.88",
            "CodeSystemName": "RxNorm",
            "Name": "albuterol (PROVENTIL) nebulizer solution 5 mg"
          }
        }
      }
    ]
  `;
}

interface ISiuMessageOptions {
  patientId: string;
  dateTime: string;
  transmissionId?: number;
  eventType?: 'New' | 'Modification' | 'Cancel' | 'Reschedule';
}

export function createMockSiuMessage(options: ISiuMessageOptions) {
  return {
    patientId: options.patientId,
    eventType: options.eventType || 'New',
    transmissionId: options.transmissionId || 230086677,
    visitId: '4557',
    dateTime: options.dateTime,
    duration: 15,
    status: 'Scheduled',
    reason: null,
    cancelReason: null,
    instructions: [
      'Please arrive 15 minutes prior to scheduled appointment time to complete required paperwork. Check in with the reception staff as soon as you arrive. This will allow time to complete required paperwork if needed.',
      'Please bring your current legal photo ID, current insurance card and any referrals (if applicable)  to ALL of your appointments. Just as a reminder all applicable copays are due at time of service.',
      'If you will be late to your appointment, please call the appropriate medical office.',
    ],
    facility: 'WHMO',
    facilityType: null,
    facilityDepartment: 'WHMO INTERNAL MED',
    facilityRoom: null,
    provider: {
      id: null,
      idType: null,
      credentials: ['MD', 'DDS'],
      firstName: 'Navarra',
      lastName: 'Rodriguez',
    },
    attendingProvider: {
      id: null,
      idType: null,
      credentials: [],
      firstName: null,
      lastName: null,
    },
    consultingProvider: {
      id: null,
      idType: null,
      credentials: [],
      firstName: null,
      lastName: null,
    },
    referringProvider: {
      id: null,
      idType: null,
      credentials: [],
      firstName: null,
      lastName: null,
    },
    diagnoses: [
      {
        code: null,
        codeset: null,
        name: null,
        diagnosisType: null,
      },
      {
        code: 'Hello',
        codeset: 'SNOMED',
        name: 'Fake Diagnosis',
        diagnosisType: 'Bad',
      },
    ],
  };
}

interface IRiskAreaSubmissionInput {
  riskAreaId: string;
  patientId: string;
  userId: string;
}

export async function setupRiskAreaSubmissionWithSuggestionsForPatient(
  { riskAreaId, patientId, userId }: IRiskAreaSubmissionInput,
  txn: Transaction,
) {
  const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create(
    {
      patientId,
      userId,
      riskAreaId,
    },
    txn,
  );

  const concern1 = await Concern.create({ title: 'Food' }, txn);
  const concernSuggestion1 = await CarePlanSuggestion.create(
    {
      patientId,
      suggestionType: 'concern' as CarePlanSuggestionType,
      concernId: concern1.id,
      type: 'riskAreaAssessmentSubmission',
      riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
    },
    txn,
  );

  const concern2 = await Concern.create({ title: 'Medical' }, txn);
  const concernSuggestion2 = await CarePlanSuggestion.create(
    {
      patientId,
      suggestionType: 'concern' as CarePlanSuggestionType,
      concernId: concern2.id,
      type: 'riskAreaAssessmentSubmission',
      riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
    },
    txn,
  );

  const goalSuggestionTemplate1 = await GoalSuggestionTemplate.create({ title: 'Find CBO' }, txn);
  const goalSuggestion1 = await CarePlanSuggestion.create(
    {
      patientId,
      suggestionType: 'goal' as CarePlanSuggestionType,
      goalSuggestionTemplateId: goalSuggestionTemplate1.id,
      type: 'riskAreaAssessmentSubmission',
      riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
    },
    txn,
  );

  const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create(
    { title: 'Talk to patient more' },
    txn,
  );
  const goalSuggestion2 = await CarePlanSuggestion.create(
    {
      patientId,
      suggestionType: 'goal' as CarePlanSuggestionType,
      goalSuggestionTemplateId: goalSuggestionTemplate2.id,
      type: 'riskAreaAssessmentSubmission',
      riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
    },
    txn,
  );

  return {
    riskAreaAssessmentSubmission,
    concern1,
    concernSuggestion1,
    concern2,
    concernSuggestion2,
    goalSuggestionTemplate1,
    goalSuggestion1,
    goalSuggestionTemplate2,
    goalSuggestion2,
  };
}

interface IScreeningToolSubmissionInput {
  screeningToolId: string;
  patientId: string;
  userId: string;
}

export async function setupScreeningToolSubmissionWithSuggestionsForPatient(
  { screeningToolId, patientId, userId }: IScreeningToolSubmissionInput,
  txn: Transaction,
) {
  const patientScreeningToolSubmission = await PatientScreeningToolSubmission.create(
    {
      screeningToolId,
      patientId,
      userId,
    },
    txn,
  );

  const concern1 = await Concern.create({ title: 'Transit' }, txn);
  const concernSuggestion1 = await CarePlanSuggestion.create(
    {
      patientId,
      suggestionType: 'concern' as CarePlanSuggestionType,
      concernId: concern1.id,
      type: 'patientScreeningToolSubmission',
      patientScreeningToolSubmissionId: patientScreeningToolSubmission.id,
    },
    txn,
  );

  const concern2 = await Concern.create({ title: 'Healthcare' }, txn);
  const concernSuggestion2 = await CarePlanSuggestion.create(
    {
      patientId,
      suggestionType: 'concern' as CarePlanSuggestionType,
      concernId: concern2.id,
      type: 'patientScreeningToolSubmission',
      patientScreeningToolSubmissionId: patientScreeningToolSubmission.id,
    },
    txn,
  );

  const goalSuggestionTemplate1 = await GoalSuggestionTemplate.create(
    { title: 'Find travel' },
    txn,
  );
  const goalSuggestion1 = await CarePlanSuggestion.create(
    {
      patientId,
      suggestionType: 'goal' as CarePlanSuggestionType,
      goalSuggestionTemplateId: goalSuggestionTemplate1.id,
      type: 'patientScreeningToolSubmission',
      patientScreeningToolSubmissionId: patientScreeningToolSubmission.id,
    },
    txn,
  );

  const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create(
    { title: 'Talk to provider' },
    txn,
  );
  const goalSuggestion2 = await CarePlanSuggestion.create(
    {
      patientId,
      suggestionType: 'goal' as CarePlanSuggestionType,
      goalSuggestionTemplateId: goalSuggestionTemplate2.id,
      type: 'patientScreeningToolSubmission',
      patientScreeningToolSubmissionId: patientScreeningToolSubmission.id,
    },
    txn,
  );

  return {
    patientScreeningToolSubmission,
    concern1,
    concernSuggestion1,
    concern2,
    concernSuggestion2,
    goalSuggestionTemplate1,
    goalSuggestion1,
    goalSuggestionTemplate2,
    goalSuggestion2,
  };
}

interface IComputedFieldAnswerInput {
  computedFieldId: string;
  patientId: string;
  userId: string;
}

export async function setupComputedFieldAnswerWithSuggestionsForPatient(
  { computedFieldId, patientId, userId }: IComputedFieldAnswerInput,
  txn: Transaction,
) {
  const concern1 = await Concern.create({ title: 'Housing' }, txn);
  const concernSuggestion1 = await CarePlanSuggestion.create(
    {
      patientId,
      suggestionType: 'concern' as CarePlanSuggestionType,
      concernId: concern1.id,
      type: 'computedFieldAnswer',
      computedFieldId,
    },
    txn,
  );

  const concern2 = await Concern.create({ title: 'Resiliency' }, txn);
  const concernSuggestion2 = await CarePlanSuggestion.create(
    {
      patientId,
      suggestionType: 'concern' as CarePlanSuggestionType,
      concernId: concern2.id,
      type: 'computedFieldAnswer',
      computedFieldId,
    },
    txn,
  );

  const goalSuggestionTemplate1 = await GoalSuggestionTemplate.create(
    { title: 'Apply for section 8' },
    txn,
  );
  const goalSuggestion1 = await CarePlanSuggestion.create(
    {
      patientId,
      suggestionType: 'goal' as CarePlanSuggestionType,
      goalSuggestionTemplateId: goalSuggestionTemplate1.id,
      type: 'computedFieldAnswer',
      computedFieldId,
    },
    txn,
  );

  const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create(
    { title: 'Find therapist' },
    txn,
  );
  const goalSuggestion2 = await CarePlanSuggestion.create(
    {
      patientId,
      suggestionType: 'goal' as CarePlanSuggestionType,
      goalSuggestionTemplateId: goalSuggestionTemplate2.id,
      type: 'computedFieldAnswer',
      computedFieldId,
    },
    txn,
  );

  return {
    concern1,
    concernSuggestion1,
    concern2,
    concernSuggestion2,
    goalSuggestionTemplate1,
    goalSuggestion1,
    goalSuggestionTemplate2,
    goalSuggestion2,
  };
}
