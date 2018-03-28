import { format } from 'date-fns';
import { get, isNil } from 'lodash';
import * as nock from 'nock';
import { Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import { AnswerValueTypeOptions, RiskAdjustmentTypeOptions } from '../app/graphql/types';
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
import Patient from './models/patient';
import PatientAddress from './models/patient-address';
import PatientAnswer from './models/patient-answer';
import PatientAnswerEvent from './models/patient-answer-event';
import PatientConcern from './models/patient-concern';
import PatientContact, { PatientRelationOptions } from './models/patient-contact';
import PatientDocument from './models/patient-document';
import { ExternalProviderOptions } from './models/patient-external-provider';
import PatientInfo, { PatientGenderOptions } from './models/patient-info';
import PatientList from './models/patient-list';
import PatientScreeningToolSubmission from './models/patient-screening-tool-submission';
import PatientState from './models/patient-state';
import { PhoneTypeOptions } from './models/phone';
import ProgressNote from './models/progress-note';
import ProgressNoteTemplate from './models/progress-note-template';
import Question from './models/question';
import RiskArea from './models/risk-area';
import RiskAreaAssessmentSubmission from './models/risk-area-assessment-submission';
import RiskAreaGroup from './models/risk-area-group';
import ScreeningTool from './models/screening-tool';
import ScreeningToolScoreRange from './models/screening-tool-score-range';
import Task from './models/task';
import TaskEvent from './models/task-event';
import User from './models/user';
import { UserRole } from './models/user';

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
  gender?: PatientGenderOptions;
  language?: string;
}

export async function createPatient(patient: ICreatePatient, txn: Transaction): Promise<Patient> {
  const { cityblockId, firstName, lastName, dateOfBirth, gender, userId, homeClinicId } = patient;

  const mockPatient = await Patient.create(
    createMockPatient(cityblockId, homeClinicId, firstName, lastName, dateOfBirth, gender),
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

export function createMockPhone(userId: string) {
  return {
    phoneNumber: '123-456-7890',
    type: 'home' as PhoneTypeOptions,
    description: 'moms home phone',
    updatedById: userId,
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
  gender?: PatientGenderOptions,
  language?: string,
) {
  return {
    patientId: uuid(),
    cityblockId,
    firstName: firstName || 'dan',
    lastName: lastName || 'plant',
    gender: (gender || 'male') as PatientGenderOptions,
    language: language || 'en',
    homeClinicId,
    dateOfBirth: dateOfBirth || '01/01/1900',
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
    canContact?: boolean;
    description?: string;
  },
) {
  const isEmergencyContact = get(options, 'isEmergencyContact');
  const isHealthcareProxy = get(options, 'isHealthcareProxy');
  const canContact = get(options, 'canContact');

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
    canContact: isNil(canContact) ? false : canContact,
    email: get(options, 'email'),
    address: get(options, 'address'),
    description: get(options, 'description') || 'some contact description',
  };
}

export function createMockPatientExternalProvider(
  patientId: string,
  userId: string,
  phone: { phoneNumber: string },
  options?: {
    email?: { emailAddress: string };
    firstName?: string;
    lastName?: string;
    role?: ExternalProviderOptions;
    roleFreeText?: string;
    agencyName?: string;
    description?: string;
  },
) {
  return {
    phone,
    updatedById: userId,
    patientId,
    firstName: get(options, 'firstName') || 'Hermione',
    lastName: get(options, 'lastName') || 'Granger',
    role: get(options, 'role') || ('psychiatrist' as ExternalProviderOptions),
    agencyName: get(options, 'agencyName') || 'Hogwarts',
    roleFreeText: get(options, 'roleFreeText') || null,
    email: get(options, 'email'),
    description: get(options, 'description') || 'some provider description',
  };
}

export function createMockPatientInfo(primaryAddressId?: string) {
  return {
    gender: 'male' as PatientGenderOptions,
    language: 'en',
    primaryAddressId,
  };
}

export function createMockUser(
  athenaProviderId = 1,
  homeClinicId: string,
  userRole: UserRole = 'admin',
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
      assessmentType: 'manual',
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
    answerType: 'dropdown',
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

export async function createTask(
  patientId: string,
  userId: string,
  dueAt: string,
  txn: Transaction,
) {
  return Task.create(
    {
      title: 'Defeat Night King',
      dueAt,
      patientId,
      createdById: userId,
      assignedToId: userId,
      priority: 'high',
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
  return Task.create(
    {
      title: 'Defeat Cersei and Lannister Army',
      dueAt: '02/05/2018',
      patientId,
      createdById: userId,
      assignedToId: userId,
      priority: 'high',
      CBOReferralId,
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
      dataType: 'boolean',
    },
    txn,
  );

  await CarePlanSuggestion.create(
    {
      patientId: patient1.id,
      concernId: concern.id,
      suggestionType: 'concern',
      type: 'computedFieldAnswer',
      computedFieldId: computedField.id,
    },
    txn,
  );
  await CarePlanSuggestion.create(
    {
      patientId: patient2.id,
      concernId: concern.id,
      suggestionType: 'concern',
      type: 'computedFieldAnswer',
      computedFieldId: computedField.id,
    },
    txn,
  );
  const suggestion4 = await CarePlanSuggestion.create(
    {
      patientId: patient4.id,
      concernId: concern.id,
      suggestionType: 'concern',
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
      gender: null,
      language: null,
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
      gender: null,
      language: null,
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
      gender: null,
      language: null,
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
    { patientId: patient1.id, updatedById: user.id, currentState: 'assigned' },
    txn,
  );

  await PatientState.updateForPatient(
    { patientId: patient2.id, updatedById: user.id, currentState: 'assigned' },
    txn,
  );

  await PatientState.updateForPatient(
    { patientId: patient3.id, updatedById: user.id, currentState: 'enrolled' },
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

  await Patient.query(txn).patchAndFetchById(
    patient2.id,
    {
      coreIdentityVerifiedAt: new Date().toISOString(),
      coreIdentityVerifiedById: user.id,
    },
  );
  await PatientInfo.edit(
    {
      gender: 'nonbinary',
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
      relationToPatient: 'sibling',
      firstName: 'Aya',
      lastName: 'Stark',
      isEmergencyContact: true,
      isHealthcareProxy: false,
      canContact: true,
    },
    txn,
  );
  await PatientDocument.create(
    {
      patientId: patient2.id,
      uploadedById: user.id,
      filename: 'test2.txt',
      description: 'some file for consent',
      documentType: 'hipaaConsent',
    },
    txn,
  );
  await PatientDocument.create(
    {
      patientId: patient2.id,
      uploadedById: user.id,
      filename: 'test3.txt',
      description: 'some file for consent',
      documentType: 'hieHealthixConsent',
    },
    txn,
  );
  await PatientDocument.create(
    {
      patientId: patient2.id,
      uploadedById: user.id,
      filename: 'test.txt',
      description: 'some file for consent',
      documentType: 'cityblockConsent',
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
      gender: 'nonbinary',
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

  const task1 = await createTask(patient1.id, user.id, soonDueDate, txn);
  await createTask(patient1.id, user.id, laterDueDate, txn);
  await createTask(patient2.id, user.id, laterDueDate, txn);
  const task = await createTask(patient5.id, user.id, laterDueDate, txn);
  await createTask(patient5.id, user2.id, soonDueDate, txn);

  const taskEvent = await TaskEvent.create(
    {
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_description',
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
      eventType: 'edit_description',
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
      gender: 'female',
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
      gender: 'female',
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
      gender: 'female',
    },
    txn,
  );
  await createPrimaryAddressForPatient('11211', patient5.id, patient5.patientInfo.id, user.id, txn);
  await CareTeam.create({ patientId: patient5.id, userId: user3.id }, txn);
  await PatientState.updateForPatient(
    { patientId: patient5.id, updatedById: user.id, currentState: 'enrolled' },
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
      assessmentType: 'manual',
      order: 1,
      mediumRiskThreshold: 4,
      highRiskThreshold: 8,
    },
    txn,
  );

  const question = await Question.create(
    {
      title: 'Who will win the war for the dawn?',
      answerType: 'dropdown',
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
      valueType: 'number',
      riskAdjustmentType: 'increment',
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
      valueType: 'number',
      riskAdjustmentType: 'increment',
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
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
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
      assessmentType: 'manual',
      order: 1,
      mediumRiskThreshold: 4,
      highRiskThreshold: 8,
    },
    txn,
  );

  const question = await Question.create(
    {
      title: 'Who will win the war for the dawn?',
      answerType: 'dropdown',
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
      valueType: 'number',
      riskAdjustmentType: 'increment',
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

  const screeningToolPatientAnswers1 = await PatientAnswer.create(
    {
      patientId: patient1.id,
      type: 'patientScreeningToolSubmission',
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

  const screeningToolPatientAnswers2 = await PatientAnswer.create(
    {
      patientId: patient2.id,
      type: 'patientScreeningToolSubmission',
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

  const screeningToolPatientAnswers3 = await PatientAnswer.create(
    {
      patientId: patient3.id,
      type: 'patientScreeningToolSubmission',
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
      assessmentType: 'manual',
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
      assessmentType: 'automated',
      order: 2,
      mediumRiskThreshold: 4,
      highRiskThreshold: 8,
    },
    txn,
  );
  const question = await Question.create(
    {
      title: 'like writing tests?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    },
    txn,
  );
  const question2 = await Question.create(
    {
      title: 'hate writing tests?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 2,
    },
    txn,
  );
  const question3 = await Question.create(
    {
      title: 'really hate writing tests?',
      answerType: 'dropdown',
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
      valueType: 'number',
      riskAdjustmentType: 'increment',
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
      valueType: 'number',
      riskAdjustmentType: 'increment',
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
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
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
      riskAdjustmentType: 'increment',
    },
    txn,
  );
  const screeningToolQuestion = await Question.create(
    {
      title: 'screening tool says what?',
      answerType: 'dropdown',
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
      valueType: 'number',
      riskAdjustmentType: 'inactive',
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
      valueType: 'number',
      riskAdjustmentType: 'inactive',
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
  const screeningToolPatientAnswers = await PatientAnswer.create(
    {
      patientId,
      type: 'patientScreeningToolSubmission',
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

  await PatientAnswer.create(
    {
      patientId,
      type: 'riskAreaAssessmentSubmission',
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
