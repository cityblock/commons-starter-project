import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  cleanPatientAnswerEvents,
  createMockClinic,
  createMockPatient,
  createMockUser,
  createRiskArea,
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

interface ISetup {
  user: User;
  patient: Patient;
  riskArea: RiskArea;
  question: Question;
  answer: Answer;
  patientAnswer: PatientAnswer;
  clinic: Clinic;
  riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission;
}

const userRole = 'physician';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await Patient.create(createMockPatient(123, 123, clinic.id), txn);
  const riskArea = await createRiskArea({ title: 'Risk Area' }, txn);
  const question = await Question.create(
    {
      riskAreaId: riskArea.id,
      title: 'Question Title',
      answerType: 'dropdown',
      type: 'riskArea',
      order: 1,
    },
    txn,
  );
  const answer = await Answer.create(
    {
      questionId: question.id,
      displayValue: '1',
      value: '1',
      valueType: 'number',
      order: 1,
      inSummary: false,
    },
    txn,
  );
  const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create(
    {
      patientId: patient.id,
      userId: user.id,
      riskAreaId: riskArea.id,
    },
    txn,
  );
  const patientAnswer = (await PatientAnswer.create(
    {
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
    },
    txn,
  ))[0];

  await cleanPatientAnswerEvents(patient.id, txn);

  return {
    clinic,
    user,
    patient,
    riskArea,
    question,
    answer,
    riskAreaAssessmentSubmission,
    patientAnswer,
  };
}

describe('patient answer event model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and fetches a patientAnswerEvent', async () => {
    await transaction(PatientAnswerEvent.knex(), async txn => {
      const { patient, user, patientAnswer } = await setup(txn);
      const patientAnswerEvent = await PatientAnswerEvent.create(
        {
          patientId: patient.id,
          userId: user.id,
          patientAnswerId: patientAnswer.id,
          eventType: 'create_patient_answer',
        },
        txn,
      );
      expect(patientAnswerEvent.patientAnswer).toMatchObject(patientAnswer);

      const fetchedPatientAnswerEvent = await PatientAnswerEvent.get(patientAnswerEvent.id, txn);
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
  });

  it('automatically opens a progress note on create', async () => {
    await transaction(PatientAnswerEvent.knex(), async txn => {
      const { patient, user, patientAnswer } = await setup(txn);
      const patientAnswerEvent = await PatientAnswerEvent.create(
        {
          patientId: patient.id,
          userId: user.id,
          patientAnswerId: patientAnswer.id,
          eventType: 'create_patient_answer',
        },
        txn,
      );

      expect(patientAnswerEvent.progressNoteId).not.toBeFalsy();
    });
  });

  it('creates multiple patientAnswerEvents', async () => {
    await transaction(PatientAnswerEvent.knex(), async txn => {
      const {
        patient,
        riskAreaAssessmentSubmission,
        answer,
        question,
        user,
        patientAnswer,
      } = await setup(txn);
      const patientAnswer2 = (await PatientAnswer.create(
        {
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
        },
        txn,
      ))[0];

      await cleanPatientAnswerEvents(patient.id, txn);
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
      );

      const fetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForPatient(
        patient.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );

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
  });

  it('automatically opens a progress note on createMultiple', async () => {
    await transaction(PatientAnswerEvent.knex(), async txn => {
      const {
        patient,
        riskAreaAssessmentSubmission,
        question,
        answer,
        patientAnswer,
        user,
      } = await setup(txn);
      const patientAnswer2 = (await PatientAnswer.create(
        {
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
        },
        txn,
      ))[0];

      const patientAnswerEvents = await PatientAnswerEvent.createMultiple(
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
      );

      expect(patientAnswerEvents[0].progressNoteId).not.toBeFalsy();
      expect(patientAnswerEvents[1].progressNoteId).not.toBeFalsy();
    });
  });

  it('throws an error when getting an invalid id', async () => {
    await transaction(PatientAnswerEvent.knex(), async txn => {
      const fakeId = uuid();
      await expect(PatientAnswerEvent.get(fakeId, txn)).rejects.toMatch(
        `No such patientAnswerEvent: ${fakeId}`,
      );
    });
  });

  it('deletes a patientAnswerEvent', async () => {
    await transaction(PatientAnswerEvent.knex(), async txn => {
      const { patient, user, patientAnswer } = await setup(txn);
      const patientAnswerEvent = await PatientAnswerEvent.create(
        {
          patientId: patient.id,
          userId: user.id,
          patientAnswerId: patientAnswer.id,
          eventType: 'create_patient_answer',
        },
        txn,
      );
      const fetchedPatientAnswerEvent = await PatientAnswerEvent.get(patientAnswerEvent.id, txn);
      expect(fetchedPatientAnswerEvent.deletedAt).toBeFalsy();

      await PatientAnswerEvent.delete(patientAnswerEvent.id, txn);
      await expect(PatientAnswerEvent.get(patientAnswerEvent.id, txn)).rejects.toMatch(
        `No such patientAnswerEvent: ${patientAnswerEvent.id}`,
      );
    });
  });

  it('fetches all not deleted patient answer events for an answer', async () => {
    await transaction(PatientAnswerEvent.knex(), async txn => {
      const { patient, user, patientAnswer, answer } = await setup(txn);
      const patientAnswerEvent = await PatientAnswerEvent.create(
        {
          patientId: patient.id,
          userId: user.id,
          patientAnswerId: patientAnswer.id,
          eventType: 'create_patient_answer',
        },
        txn,
      );
      const patientAnswerEventToBeDeleted = await PatientAnswerEvent.create(
        {
          patientId: patient.id,
          userId: user.id,
          patientAnswerId: patientAnswer.id,
          eventType: 'create_patient_answer',
        },
        txn,
      );

      // Make sure all patientAnswerEvents are returned
      const fetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForAnswer(
        answer.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      const fetchedPatientAnswerEventIds = fetchedPatientAnswerEvents.results.map(
        event => event.id,
      );
      expect(fetchedPatientAnswerEvents.total).toEqual(2);
      expect(fetchedPatientAnswerEventIds).toContain(patientAnswerEvent.id);
      expect(fetchedPatientAnswerEventIds).toContain(patientAnswerEventToBeDeleted.id);

      await PatientAnswerEvent.delete(patientAnswerEventToBeDeleted.id, txn);

      // Make sure the deleted patientAnswerEvent isn't returned
      const secondFetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForAnswer(
        answer.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      expect(secondFetchedPatientAnswerEvents).toMatchObject({
        results: [{ id: patientAnswerEvent.id }],
        total: 1,
      });
    });
  });

  it('fetches all not deleted patient answer events for a patient', async () => {
    await transaction(PatientAnswerEvent.knex(), async txn => {
      const { patient, user, patientAnswer } = await setup(txn);
      const patientAnswerEvent = await PatientAnswerEvent.create(
        {
          patientId: patient.id,
          userId: user.id,
          patientAnswerId: patientAnswer.id,
          eventType: 'create_patient_answer',
        },
        txn,
      );
      const patientAnswerEventToBeDeleted = await PatientAnswerEvent.create(
        {
          patientId: patient.id,
          userId: user.id,
          patientAnswerId: patientAnswer.id,
          eventType: 'create_patient_answer',
        },
        txn,
      );

      // Make sure all patientAnswerEvents are returned
      const fetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForPatient(
        patient.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      const patientAnswerEventIds = fetchedPatientAnswerEvents.results.map(event => event.id);
      expect(patientAnswerEventIds).toContain(patientAnswerEvent.id);
      expect(patientAnswerEventIds).toContain(patientAnswerEventToBeDeleted.id);
      expect(fetchedPatientAnswerEvents.total).toEqual(2);

      await PatientAnswerEvent.delete(patientAnswerEventToBeDeleted.id, txn);

      // Make sure the deleted patientAnswerEvent isn't returned
      const secondFetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForPatient(
        patient.id,
        { pageNumber: 0, pageSize: 10 },
        txn,
      );
      expect(secondFetchedPatientAnswerEvents).toMatchObject({
        results: [{ id: patientAnswerEvent.id }],
        total: 1,
      });
    });
  });

  it('fetches all not deleted patient answer events for a user', async () => {
    await transaction(PatientAnswerEvent.knex(), async txn => {
      const { patient, user, patientAnswer } = await setup(txn);
      const patientAnswerEvent = await PatientAnswerEvent.create(
        {
          patientId: patient.id,
          userId: user.id,
          patientAnswerId: patientAnswer.id,
          eventType: 'create_patient_answer',
        },
        txn,
      );
      const patientAnswerEventToBeDeleted = await PatientAnswerEvent.create(
        {
          patientId: patient.id,
          userId: user.id,
          patientAnswerId: patientAnswer.id,
          eventType: 'create_patient_answer',
        },
        txn,
      );

      // Make sure all patientAnswerEvents are returned
      const fetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForUser(
        user.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      const patientAnswerEventIds = fetchedPatientAnswerEvents.results.map(event => event.id);
      expect(patientAnswerEventIds).toContain(patientAnswerEvent.id);
      expect(patientAnswerEventIds).toContain(patientAnswerEventToBeDeleted.id);
      expect(fetchedPatientAnswerEvents.total).toEqual(2);

      await PatientAnswerEvent.delete(patientAnswerEventToBeDeleted.id, txn);

      // Make sure the deleted patientAnswerEvent isn't returned
      const secondFetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForUser(
        user.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      expect(secondFetchedPatientAnswerEvents).toMatchObject({
        results: [{ id: patientAnswerEvent.id }],
        total: 1,
      });
    });
  });

  it('fetches all not deleted patient answer events for a progress note', async () => {
    await transaction(PatientAnswerEvent.knex(), async txn => {
      const { patient, user, patientAnswer } = await setup(txn);
      const progressNote = await ProgressNote.autoOpenIfRequired(
        {
          patientId: patient.id,
          userId: user.id,
        },
        txn,
      );
      const patientAnswerEvent = await PatientAnswerEvent.create(
        {
          patientId: patient.id,
          userId: user.id,
          patientAnswerId: patientAnswer.id,
          eventType: 'create_patient_answer',
          progressNoteId: progressNote.id,
        },
        txn,
      );
      const patientAnswerEventToBeDeleted = await PatientAnswerEvent.create(
        {
          patientId: patient.id,
          userId: user.id,
          patientAnswerId: patientAnswer.id,
          eventType: 'create_patient_answer',
          progressNoteId: progressNote.id,
        },
        txn,
      );

      // Make sure all patientAnswerEvents are returned
      const fetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForProgressNote(
        progressNote.id,
        txn,
      );
      const fetchedPatientAnswerEventIds = fetchedPatientAnswerEvents.map(event => event.id);
      expect(fetchedPatientAnswerEventIds).toContain(patientAnswerEventToBeDeleted.id);
      expect(fetchedPatientAnswerEventIds).toContain(patientAnswerEvent.id);

      await PatientAnswerEvent.delete(patientAnswerEventToBeDeleted.id, txn);

      // Make sure the deleted patientAnswerEvent isn't returned
      const secondFetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForProgressNote(
        progressNote.id,
        txn,
      );
      expect(secondFetchedPatientAnswerEvents).toMatchObject([{ id: patientAnswerEvent.id }]);
    });
  });

  it('filters out patient answers that are deleted when patient answer event is not deleted', async () => {
    // happens when changing answers to the same question
    await transaction(PatientAnswerEvent.knex(), async txn => {
      const { patient, user, patientAnswer, question, riskAreaAssessmentSubmission } = await setup(
        txn,
      );

      // second answer
      const answer = await Answer.create(
        {
          questionId: question.id,
          displayValue: '2',
          value: '2',
          valueType: 'number',
          order: 2,
        },
        txn,
      );

      const progressNote = await ProgressNote.autoOpenIfRequired(
        {
          patientId: patient.id,
          userId: user.id,
        },
        txn,
      );
      const patientAnswerEvent = await PatientAnswerEvent.create(
        {
          patientId: patient.id,
          userId: user.id,
          patientAnswerId: patientAnswer.id,
          eventType: 'create_patient_answer',
          progressNoteId: progressNote.id,
        },
        txn,
      );

      const secondPatientAnswer = (await PatientAnswer.create(
        {
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
        },
        txn,
      ))[0];

      const secondPatientAnswerEvent = await PatientAnswerEvent.create(
        {
          patientId: patient.id,
          userId: user.id,
          patientAnswerId: secondPatientAnswer.id,
          eventType: 'create_patient_answer',
          progressNoteId: progressNote.id,
        },
        txn,
      );

      // Make sure all patientAnswerEvents are returned
      const fetchedPatientAnswerEvents = await PatientAnswerEvent.getAllForProgressNote(
        progressNote.id,
        txn,
      );
      const fetchedPatientAnswerEventIds = fetchedPatientAnswerEvents.map(event => event.id);
      expect(fetchedPatientAnswerEventIds).toContain(secondPatientAnswerEvent.id);
      expect(fetchedPatientAnswerEventIds).not.toContain(patientAnswerEvent.id);
    });
  });
});
