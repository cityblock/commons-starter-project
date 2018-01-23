import * as nock from 'nock';
import { Transaction } from 'objection';
import { AnswerValueTypeOptions, RiskAdjustmentTypeOptions } from '../app/graphql/types';
import {
  IRedoxClinicalSummaryEncounter,
  IRedoxClinicalSummaryMedication,
  IRedoxPatientCreateResponse,
} from './apis/redox/types';
import config from './config';
import Answer from './models/answer';
import CarePlanSuggestion from './models/care-plan-suggestion';
import CarePlanUpdateEvent from './models/care-plan-update-event';
import CareTeam from './models/care-team';
import CBO from './models/cbo';
import CBOCategory from './models/cbo-category';
import Clinic from './models/clinic';
import ComputedField from './models/computed-field';
import Concern from './models/concern';
import EventNotification from './models/event-notification';
import Patient, { IPatientEditableFields } from './models/patient';
import PatientAnswer from './models/patient-answer';
import PatientAnswerEvent from './models/patient-answer-event';
import PatientConcern from './models/patient-concern';
import PatientList from './models/patient-list';
import PatientScreeningToolSubmission from './models/patient-screening-tool-submission';
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

export interface ICreatePatient extends IPatientEditableFields {
  athenaPatientId: number;
}

export interface ICreateRiskArea {
  title?: string;
  order?: number;
}

export async function createPatient(
  patient: ICreatePatient,
  userId: string,
  txn: Transaction,
): Promise<Patient> {
  const instance = await Patient.query(txn).insertAndFetch(patient);
  await CareTeam.create({ userId, patientId: instance.id }, txn);
  return instance;
}

export function createMockPatient(
  athenaPatientId = 1,
  homeClinicId: string,
  firstName?: string,
  lastName?: string,
) {
  return {
    athenaPatientId,
    firstName: firstName || 'dan',
    lastName: lastName || 'plant',
    homeClinicId,
    zip: '11238',
    gender: 'M',
    dateOfBirth: '01/01/1900',
    consentToCall: false,
    consentToText: false,
    language: 'en',
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
  return await RiskArea.create(
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

// Redox
export function mockRedoxPost(body: any) {
  nock(config.REDOX_API_URL)
    .post('')
    .reply(200, body);
}

export function mockRedoxPostError(body: any, status = 400) {
  nock(config.REDOX_API_URL)
    .post('')
    .reply(status, body);
}

export function mockRedoxTokenFetch() {
  nock(config.REDOX_TOKEN_URL)
    .post('')
    .reply(200, {
      expires: new Date('01-01-2020').toISOString(),
      accessToken: 'cool-token',
      refreshToken: 'refreshing-token',
    });
}

export function mockRedoxCreatePatient(athenaPatientId: number) {
  const response: IRedoxPatientCreateResponse = {
    Patient: {
      Identifiers: [
        {
          IDType: 'AthenaNet Enterprise ID',
          ID: String(athenaPatientId),
        },
      ],
    },
    Meta: {
      DataModel: 'PatientAdmin',
      EventType: 'NewPatient',
      Message: {
        ID: 123,
      },
      Source: {
        ID: 'source',
      },
      Destinations: [
        {
          ID: 'athena-sandbox-id',
          Name: 'athenahealth sandbox',
        },
      ],
    },
  };
  mockRedoxPost(response);
}

export function mockRedoxCreatePatientError() {
  mockRedoxPostError({
    Meta: {
      DataModel: 'PatientAdmin',
      EventType: 'NewPatient',
      Message: {
        ID: 101141540,
      },
      Source: {
        ID: '87c226a2-9e53-481e-a9e9-68b5fbdb6471',
        Name: 'Athena Sandbox (s)',
      },
      Destinations: [
        {
          ID: 'aed98aae-5e94-404f-912d-9ca0b6ebe869',
          Name: 'athenahealth sandbox',
        },
      ],
      Errors: [
        {
          ID: 1505416,
          Text: 'Post received a 400 response',
          Type: 'transmission',
          Module: 'Send',
        },
      ],
    },
  });
}

export type MockRedoxClinicalSummaryEncounter = Partial<IRedoxClinicalSummaryEncounter>;
export type MockRedoxClinicalSummaryMedication = Partial<IRedoxClinicalSummaryMedication>;

export function mockRedoxGetPatientEncounters(encountersBody: MockRedoxClinicalSummaryEncounter[]) {
  const fullResponseBody = {
    Meta: {
      DataModel: 'Clinical Summary',
      EventType: 'PatientQuery',
    },
    Encounters: encountersBody,
  };

  mockRedoxPost(fullResponseBody);
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
  return await Task.create(
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

const patient1Name = 'Arya';
const patient2Name = 'Rickon';
const patient3Name = 'Robb';
const patient4Name = 'Bran';
const patient5Name = 'Sansa';

export async function setupPatientsNewToCareTeam(txn: Transaction) {
  const clinic = await Clinic.create(createMockClinic("King's Landing", 13), txn);
  const user = await User.create(createMockUser(211, clinic.id), txn);
  const user2 = await User.create(createMockUser(212, clinic.id), txn);

  const patient1 = await createPatient(
    createMockPatient(311, clinic.id, patient1Name),
    user.id,
    txn,
  );
  await createPatient(createMockPatient(312, clinic.id, patient2Name), user2.id, txn);
  const patient3 = await createPatient(
    createMockPatient(313, clinic.id, patient2Name),
    user.id,
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
  const user2 = await User.create(createMockUser(312, clinic.id), txn);

  const patient1 = await createPatient(
    createMockPatient(411, clinic.id, patient1Name),
    user.id,
    txn,
  );
  const patient2 = await createPatient(
    createMockPatient(412, clinic.id, patient2Name),
    user2.id,
    txn,
  );
  await createPatient(createMockPatient(413, clinic.id, patient3Name), user.id, txn);
  const patient4 = await createPatient(
    createMockPatient(414, clinic.id, patient4Name),
    user.id,
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
  const user2 = await User.create(createMockUser(212, clinic.id), txn);

  await createPatient(createMockPatient(511, clinic.id, patient1Name), user.id, txn);
  const patient1 = await createPatient(
    {
      athenaPatientId: 13,
      firstName: patient2Name,
      lastName: 'Stark',
      homeClinicId: clinic.id,
      zip: '11238',
      dateOfBirth: '01/01/1900',
      consentToCall: false,
      consentToText: false,
      language: 'en',
    } as any,
    user.id,
    txn,
  );
  await createPatient(
    {
      athenaPatientId: 14,
      firstName: patient3Name,
      lastName: 'Stark',
      homeClinicId: clinic.id,
      zip: '11238',
      dateOfBirth: '01/01/1900',
      consentToCall: false,
      consentToText: false,
      language: 'en',
    } as any,
    user2.id,
    txn,
  );

  return { user, patient1 };
}

export async function setupPatientsWithNoRecentEngagement(txn: Transaction) {
  const clinic = await Clinic.create(createMockClinic('The Dothraki Sea', 13), txn);
  const user = await User.create(createMockUser(211, clinic.id), txn);
  const user2 = await User.create(createMockUser(212, clinic.id), txn);

  const patient1 = await createPatient(
    createMockPatient(611, clinic.id, patient1Name),
    user.id,
    txn,
  );
  const patient2 = await createPatient(
    createMockPatient(612, clinic.id, patient2Name),
    user2.id,
    txn,
  );
  const patient3 = await createPatient(
    createMockPatient(613, clinic.id, patient3Name),
    user.id,
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
    createMockPatient(711, clinic.id, patient1Name),
    user.id,
    txn,
  );
  const patient2 = await createPatient(
    createMockPatient(712, clinic.id, patient2Name),
    user2.id,
    txn,
  );
  const patient3 = await createPatient(
    createMockPatient(713, clinic.id, patient3Name),
    user.id,
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

export async function setupUrgentTasks(txn: Transaction) {
  const clinic = await Clinic.create(createMockClinic('Winterfell', 12), txn);
  const user = await User.create(createMockUser(111, clinic.id), txn);
  const user2 = await User.create(createMockUser(121, clinic.id), txn);

  const patient1 = await createPatient(
    createMockPatient(1234, clinic.id, patient1Name),
    user.id,
    txn,
  );
  const patient2 = await createPatient(
    createMockPatient(234, clinic.id, patient2Name),
    user.id,
    txn,
  );
  await createPatient(createMockPatient(456, clinic.id, patient3Name), user2.id, txn);
  await createPatient(createMockPatient(345, clinic.id, patient4Name), user.id, txn);
  const patient5 = await createPatient(
    createMockPatient(567, clinic.id, patient5Name),
    user.id,
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

  return { user, patient1, patient5, task, task1, eventNotification };
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
  const user2 = await User.create(createMockUser(121, clinic.id), txn);

  const patient1 = await createPatient(
    createMockPatient(811, clinic.id, patient1Name),
    user.id,
    txn,
  );
  const patient2 = await createPatient(
    createMockPatient(812, clinic.id, patient2Name),
    user2.id,
    txn,
  );
  const patient3 = await createPatient(
    createMockPatient(813, clinic.id, patient3Name),
    user.id,
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
  return await CBOCategory.create(
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
