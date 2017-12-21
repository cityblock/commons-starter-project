import { transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  createMockAnswer,
  createMockClinic,
  createMockPatient,
  createMockQuestion,
  createMockUser,
  createPatient,
  createRiskArea,
} from '../../spec-helpers';
import Answer from '../answer';
import Clinic from '../clinic';
import ComputedFieldFlag from '../computed-field-flag';
import Patient from '../patient';
import PatientAnswer from '../patient-answer';
import Question, { IRiskAreaQuestion } from '../question';
import RiskArea from '../risk-area';
import RiskAreaAssessmentSubmission from '../risk-area-assessment-submission';
import User from '../user';

const userRole = 'admin';
const reason = 'Viscerion destroyed the Wall';

describe('computed field flag model', () => {
  let user: User;
  let clinic: Clinic;
  let patient: Patient;
  let riskArea: RiskArea;
  let question: Question;
  let answer: Answer;
  let patientAnswers: PatientAnswer[];
  let riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission;

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    patient = await createPatient(createMockPatient(12, clinic.id), user.id);
    riskArea = await createRiskArea({ title: 'The War for the Dawn' });
    question = await Question.create(createMockQuestion(riskArea.id) as IRiskAreaQuestion);
    answer = await Answer.create(createMockAnswer(question.id));
    riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create({
      riskAreaId: riskArea.id,
      patientId: patient.id,
      userId: user.id,
    });

    patientAnswers = await PatientAnswer.create({
      patientId: patient.id,
      questionIds: [question.id],
      riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
      answers: [
        {
          questionId: question.id,
          answerId: answer.id,
          answerValue: '3',
          patientId: patient.id,
          userId: user.id,
          applicable: true,
        },
      ],
      type: 'riskAreaAssessmentSubmission',
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and get a computed field flag', async () => {
    await transaction(ComputedFieldFlag.knex(), async txn => {
      const computedFieldFlag = await ComputedFieldFlag.create(
        {
          patientAnswerId: patientAnswers[0].id,
          userId: user.id,
          reason,
        },
        txn,
      );

      expect(computedFieldFlag).toMatchObject({
        patientAnswerId: patientAnswers[0].id,
        userId: user.id,
        reason,
      });

      expect(await ComputedFieldFlag.get(computedFieldFlag.id, txn)).toMatchObject({
        patientAnswerId: patientAnswers[0].id,
        userId: user.id,
        reason,
      });
    });
  });

  it('throws an error if the computed field flag does not exist for given id', async () => {
    await transaction(ComputedFieldFlag.knex(), async txn => {
      const fakeId = uuid();
      const error = `No such computed field flag: ${fakeId}`;
      await expect(ComputedFieldFlag.get(fakeId, txn)).rejects.toMatch(error);
    });
  });

  it('gets all computed field flags', async () => {
    await transaction(ComputedFieldFlag.knex(), async txn => {
      const user2 = await User.create(createMockUser(12, clinic.id, userRole), txn);
      await ComputedFieldFlag.create(
        {
          patientAnswerId: patientAnswers[0].id,
          userId: user.id,
          reason,
        },
        txn,
      );
      await ComputedFieldFlag.create(
        {
          patientAnswerId: patientAnswers[0].id,
          userId: user2.id,
          reason,
        },
        txn,
      );

      const computedFieldFlags = await ComputedFieldFlag.getAll(txn);
      const userIds = computedFieldFlags.map(field => field.userId);
      const sortFn = (a: string, b: string) => {
        if (a < b) return -1;
        else return 1;
      };
      expect(userIds.sort(sortFn)).toEqual([user.id, user2.id].sort(sortFn));
    });
  });

  it('deletes computed field flag', async () => {
    await transaction(ComputedFieldFlag.knex(), async txn => {
      const computedFieldFlag = await ComputedFieldFlag.create(
        {
          patientAnswerId: patientAnswers[0].id,
          userId: user.id,
          reason,
        },
        txn,
      );
      expect(computedFieldFlag.deletedAt).toBeFalsy();
      const deleted = await ComputedFieldFlag.delete(computedFieldFlag.id, txn);
      expect(deleted.deletedAt).toBeTruthy();
    });
  });
});
