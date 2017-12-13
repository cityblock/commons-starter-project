import { transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  cleanPatientAnswerEvents,
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Answer from '../answer';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientAnswer from '../patient-answer';
import PatientAnswerEvent from '../patient-answer-event';
import ProgressNote from '../progress-note';
import Question from '../question';
import RiskArea from '../risk-area';
import RiskAreaAssessmentSubmission from '../risk-area-assessment-submission';
import User from '../user';

const userRole = 'physician';

describe('patient answer event model', () => {
  let user: User;
  let patient: Patient;
  let riskArea: RiskArea;
  let question: Question;
  let answer: Answer;
  let patientAnswer: PatientAnswer;
  let clinic: Clinic;
  let riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission;

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    riskArea = await RiskArea.create({ title: 'Risk Area', order: 1 });
    question = await Question.create({
      riskAreaId: riskArea.id,
      title: 'Question Title',
      answerType: 'dropdown',
      type: 'riskArea',
      order: 1,
    });
    answer = await Answer.create({
      questionId: question.id,
      displayValue: '1',
      value: '1',
      valueType: 'number',
      order: 1,
    });
    riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create({
      patientId: patient.id,
      userId: user.id,
      riskAreaId: riskArea.id,
    });
    patientAnswer = (await PatientAnswer.create({
      patientId: patient.id,
      type: 'riskAreaAssessmentSubmission',
      riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
      questionIds: [answer.questionId],
      answers: [
        {
          answerId: answer.id,
          questionId: question.id,
          answerValue: answer.value,
          patientId: patient.id,
          applicable: true,
          userId: user.id,
        },
      ],
    }))[0];
    await cleanPatientAnswerEvents(patient.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and fetches a patientAnswerEvent', async () => {
    const patientAnswerEvent = await PatientAnswerEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientAnswerId: patientAnswer.id,
      eventType: 'create_patient_answer',
    });
    expect(patientAnswerEvent.patientAnswer).toMatchObject(patientAnswer);

    const fetchedPatientAnswerEvent = await PatientAnswerEvent.get(patientAnswerEvent.id);
    expect(fetchedPatientAnswerEvent).toMatchObject({
      id: patientAnswerEvent.id,
      patientId: patientAnswerEvent.patientId,
      userId: patientAnswerEvent.userId,
      eventType: 'create_patient_answer',
    });
    expect(fetchedPatientAnswerEvent.deletedAt).toBeFalsy();
    expect(fetchedPatientAnswerEvent.createdAt).not.toBeFalsy();
    expect(fetchedPatientAnswerEvent.updatedAt).not.toBeFalsy();
  });

  it('automatically opens a progress note on create', async () => {
    const patientAnswerEvent = await PatientAnswerEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientAnswerId: patientAnswer.id,
      eventType: 'create_patient_answer',
    });

    expect(patientAnswerEvent.progressNoteId).not.toBeFalsy();
  });

  it('creates multiple patientAnswerEvents', async () => {
    const patientAnswer2 = (await PatientAnswer.create({
      patientId: patient.id,
      type: 'riskAreaAssessmentSubmission',
      riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
      questionIds: [answer.questionId],
      answers: [
        {
          answerId: answer.id,
          questionId: question.id,
          answerValue: answer.value,
          patientId: patient.id,
          applicable: true,
          userId: user.id,
        },
      ],
    }))[0];

    await cleanPatientAnswerEvents(patient.id);

    await transaction(
      PatientAnswerEvent.knex(),
      async txn =>
        await PatientAnswerEvent.createMultiple(
          {
            patientAnswerEvents: [
              {
                patientId: patient.id,
                userId: user.id,
                patientAnswerId: patientAnswer.id,
                eventType: 'create_patient_answer',
              },
              {
                patientId: patient.id,
                userId: user.id,
                patientAnswerId: patientAnswer2.id,
                eventType: 'create_patient_answer',
              },
            ],
          },
          txn,
        ),
    );

    const fetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForPatient(patient.id, {
      pageNumber: 0,
      pageSize: 10,
    });

    expect(fetchedPatientAnswerEvents.total).toEqual(2);

    expect(fetchedPatientAnswerEvents.total).toEqual(2);
    const newAnswer = fetchedPatientAnswerEvents.results.find(
      r => r.patientAnswerId === patientAnswer.id,
    );
    const newAnswer2 = fetchedPatientAnswerEvents.results.find(
      r => r.patientAnswerId === patientAnswer2.id,
    );

    expect(newAnswer).toBeTruthy();
    expect(newAnswer2).toBeTruthy();
  });

  it('automatically opens a progress note on createMultiple', async () => {
    const patientAnswer2 = (await PatientAnswer.create({
      patientId: patient.id,
      type: 'riskAreaAssessmentSubmission',
      riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
      questionIds: [question.id],
      answers: [
        {
          answerId: answer.id,
          questionId: question.id,
          answerValue: answer.value,
          patientId: patient.id,
          applicable: true,
          userId: user.id,
        },
      ],
    }))[0];

    const patientAnswerEvents = await transaction(
      PatientAnswerEvent.knex(),
      async txn =>
        await PatientAnswerEvent.createMultiple(
          {
            patientAnswerEvents: [
              {
                patientId: patient.id,
                userId: user.id,
                patientAnswerId: patientAnswer.id,
                eventType: 'create_patient_answer',
              },
              {
                patientId: patient.id,
                userId: user.id,
                patientAnswerId: patientAnswer2.id,
                eventType: 'create_patient_answer',
              },
            ],
          },
          txn,
        ),
    );

    expect(patientAnswerEvents[0].progressNoteId).not.toBeFalsy();
    expect(patientAnswerEvents[1].progressNoteId).not.toBeFalsy();
  });

  it('throws an error when getting an invalid id', async () => {
    const fakeId = uuid();
    await expect(PatientAnswerEvent.get(fakeId)).rejects.toMatch(
      `No such patientAnswerEvent: ${fakeId}`,
    );
  });

  it('deletes a patientAnswerEvent', async () => {
    const patientAnswerEvent = await PatientAnswerEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientAnswerId: patientAnswer.id,
      eventType: 'create_patient_answer',
    });
    const fetchedPatientAnswerEvent = await PatientAnswerEvent.get(patientAnswerEvent.id);
    expect(fetchedPatientAnswerEvent.deletedAt).toBeFalsy();

    await PatientAnswerEvent.delete(patientAnswerEvent.id);
    await expect(PatientAnswerEvent.get(patientAnswerEvent.id)).rejects.toMatch(
      `No such patientAnswerEvent: ${patientAnswerEvent.id}`,
    );
  });

  it('fetches all not deleted patient answer events for an answer', async () => {
    const patientAnswerEvent = await PatientAnswerEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientAnswerId: patientAnswer.id,
      eventType: 'create_patient_answer',
    });
    const patientAnswerEventToBeDeleted = await PatientAnswerEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientAnswerId: patientAnswer.id,
      eventType: 'create_patient_answer',
    });

    // Make sure all patientAnswerEvents are returned
    const fetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForAnswer(answer.id, {
      pageNumber: 0,
      pageSize: 10,
    });
    expect(fetchedPatientAnswerEvents).toMatchObject({
      results: [
        {
          id: patientAnswerEventToBeDeleted.id,
        },
        {
          id: patientAnswerEvent.id,
        },
      ],
      total: 2,
    });

    await PatientAnswerEvent.delete(patientAnswerEventToBeDeleted.id);

    // Make sure the deleted patientAnswerEvent isn't returned
    const secondFetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForAnswer(answer.id, {
      pageNumber: 0,
      pageSize: 10,
    });
    expect(secondFetchedPatientAnswerEvents).toMatchObject({
      results: [{ id: patientAnswerEvent.id }],
      total: 1,
    });
  });

  it('fetches all not deleted patient answer events for a patient', async () => {
    const patientAnswerEvent = await PatientAnswerEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientAnswerId: patientAnswer.id,
      eventType: 'create_patient_answer',
    });
    const patientAnswerEventToBeDeleted = await PatientAnswerEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientAnswerId: patientAnswer.id,
      eventType: 'create_patient_answer',
    });

    // Make sure all patientAnswerEvents are returned
    const fetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForPatient(patient.id, {
      pageNumber: 0,
      pageSize: 10,
    });
    expect(fetchedPatientAnswerEvents).toMatchObject({
      results: [
        {
          id: patientAnswerEventToBeDeleted.id,
        },
        {
          id: patientAnswerEvent.id,
        },
      ],
      total: 2,
    });

    await PatientAnswerEvent.delete(patientAnswerEventToBeDeleted.id);

    // Make sure the deleted patientAnswerEvent isn't returned
    const secondFetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForPatient(patient.id, {
      pageNumber: 0,
      pageSize: 10,
    });
    expect(secondFetchedPatientAnswerEvents).toMatchObject({
      results: [{ id: patientAnswerEvent.id }],
      total: 1,
    });
  });

  it('fetches all not deleted patient answer events for a user', async () => {
    const patientAnswerEvent = await PatientAnswerEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientAnswerId: patientAnswer.id,
      eventType: 'create_patient_answer',
    });
    const patientAnswerEventToBeDeleted = await PatientAnswerEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientAnswerId: patientAnswer.id,
      eventType: 'create_patient_answer',
    });

    // Make sure all patientAnswerEvents are returned
    const fetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForUser(user.id, {
      pageNumber: 0,
      pageSize: 10,
    });
    expect(fetchedPatientAnswerEvents).toMatchObject({
      results: [
        {
          id: patientAnswerEventToBeDeleted.id,
        },
        {
          id: patientAnswerEvent.id,
        },
      ],
      total: 2,
    });

    await PatientAnswerEvent.delete(patientAnswerEventToBeDeleted.id);

    // Make sure the deleted patientAnswerEvent isn't returned
    const secondFetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForUser(user.id, {
      pageNumber: 0,
      pageSize: 10,
    });
    expect(secondFetchedPatientAnswerEvents).toMatchObject({
      results: [{ id: patientAnswerEvent.id }],
      total: 1,
    });
  });

  it('fetches all not deleted patient answer events for a progress note', async () => {
    const progressNote = await ProgressNote.autoOpenIfRequired({
      patientId: patient.id,
      userId: user.id,
    });
    const patientAnswerEvent = await PatientAnswerEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientAnswerId: patientAnswer.id,
      eventType: 'create_patient_answer',
      progressNoteId: progressNote.id,
    });
    const patientAnswerEventToBeDeleted = await PatientAnswerEvent.create({
      patientId: patient.id,
      userId: user.id,
      patientAnswerId: patientAnswer.id,
      eventType: 'create_patient_answer',
      progressNoteId: progressNote.id,
    });

    // Make sure all patientAnswerEvents are returned
    const fetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForProgressNote(
      progressNote.id,
    );
    const fetchedPatientAnswerEventIds = fetchedPatientAnswerEvents.map(event => event.id);
    expect(fetchedPatientAnswerEventIds).toContain(patientAnswerEventToBeDeleted.id);
    expect(fetchedPatientAnswerEventIds).toContain(patientAnswerEvent.id);

    await PatientAnswerEvent.delete(patientAnswerEventToBeDeleted.id);

    // Make sure the deleted patientAnswerEvent isn't returned
    const secondFetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForProgressNote(
      progressNote.id,
    );
    expect(secondFetchedPatientAnswerEvents).toMatchObject([{ id: patientAnswerEvent.id }]);
  });
});
