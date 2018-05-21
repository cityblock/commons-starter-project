import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import * as uuid from 'uuid/v4';

import {
  createMockAnswer,
  createMockClinic,
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

const userRole = 'admin' as UserRole;
const reason = 'Viscerion destroyed the Wall';

interface ISetup {
  user: User;
  clinic: Clinic;
  patient: Patient;
  riskArea: RiskArea;
  question: Question;
  answer: Answer;
  patientAnswers: PatientAnswer[];
  riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 12, homeClinicId: clinic.id }, txn);
  const riskArea = await createRiskArea({ title: 'The War for the Dawn' }, txn);
  const question = await Question.create(createMockQuestion(riskArea.id) as IRiskAreaQuestion, txn);
  const answer = await Answer.create(createMockAnswer(question.id), txn);
  const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create(
    {
      riskAreaId: riskArea.id,
      patientId: patient.id,
      userId: user.id,
    },
    txn,
  );

  const patientAnswers = await PatientAnswer.createForRiskArea(
    {
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
    },
    txn,
  );
  return {
    patientAnswers,
    clinic,
    user,
    patient,
    riskArea,
    question,
    answer,
    riskAreaAssessmentSubmission,
  };
}

describe('computed field flag model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Question.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('should create and get a computed field flag', async () => {
    const { patientAnswers, user } = await setup(txn);
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

  it('throws an error if the computed field flag does not exist for given id', async () => {
    const fakeId = uuid();
    const error = `No such computed field flag: ${fakeId}`;
    await expect(ComputedFieldFlag.get(fakeId, txn)).rejects.toMatch(error);
  });

  it('gets all computed field flags', async () => {
    const { patientAnswers, user, clinic } = await setup(txn);

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

  it('deletes computed field flag', async () => {
    const { patientAnswers, user } = await setup(txn);
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
