import Db from '../../db';
import { createMockPatient, createPatient } from '../../spec-helpers';
import Answer from '../answer';
import Patient from '../patient';
import PatientAnswer from '../patient-answer';
import PatientAnswerEvent from '../patient-answer-event';
import Question from '../question';
import RiskArea from '../risk-area';
import User from '../user';

const userRole = 'physician';

describe('patient answer event model', () => {
  let db: Db;
  let user: User;
  let patient: Patient;
  let riskArea: RiskArea;
  let question: Question;
  let answer: Answer;
  let patientAnswer: PatientAnswer;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    user = await User.create({
      email: 'care@care.com',
      firstName: 'Dan',
      lastName: 'Plant',
      userRole,
      homeClinicId: '1',
    });
    patient = await createPatient(createMockPatient(123), user.id);
    riskArea = await RiskArea.create({ title: 'Risk Area', order: 1 });
    question = await Question.create({
      riskAreaId: riskArea.id,
      title: 'Question Title',
      answerType: 'dropdown',
      order: 1,
    });
    answer = await Answer.create({
      questionId: question.id,
      displayValue: '1',
      value: '1',
      valueType: 'number',
      order: 1,
    });
    patientAnswer = (await PatientAnswer.create({
      patientId: patient.id,
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
    expect(fetchedPatientAnswerEvent.deletedAt).toBeNull();
    expect(fetchedPatientAnswerEvent.createdAt).not.toBeNull();
    expect(fetchedPatientAnswerEvent.updatedAt).not.toBeNull();
  });

  it('throws an error when getting an invalid id', async () => {
    const fakeId = 'fakeId';
    await expect(PatientAnswerEvent.get(fakeId)).rejects.toMatch(
      'No such patientAnswerEvent: fakeId',
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
    expect(fetchedPatientAnswerEvent.deletedAt).toBeNull();

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
});
