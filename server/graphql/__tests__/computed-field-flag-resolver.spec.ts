import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import Question, { IRiskAreaQuestion } from '../../models/question';
import RiskArea from '../../models/risk-area';
import RiskAreaAssessmentSubmission from '../../models/risk-area-assessment-submission';
import User from '../../models/user';
import {
  createMockAnswer,
  createMockClinic,
  createMockQuestion,
  createMockUser,
  createPatient,
  createRiskArea,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'admin';
const permissions = 'green';
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

async function setup(trx: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), trx);
  const user = await User.create(createMockUser(11, clinic.id, userRole), trx);
  const patient = await createPatient({ cityblockId: 12, homeClinicId: clinic.id }, trx);
  const riskArea = await createRiskArea({ title: 'The War for the Dawn' }, trx);
  const question = await Question.create(createMockQuestion(riskArea.id) as IRiskAreaQuestion, trx);
  const answer = await Answer.create(createMockAnswer(question.id), trx);
  const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create(
    {
      riskAreaId: riskArea.id,
      patientId: patient.id,
      userId: user.id,
    },
    trx,
  );

  const patientAnswers = await PatientAnswer.create(
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
      type: 'riskAreaAssessmentSubmission',
    },
    trx,
  );
  return {
    clinic,
    user,
    patient,
    riskArea,
    question,
    answer,
    riskAreaAssessmentSubmission,
    patientAnswers,
  };
}

describe('computed field flag resolver', () => {
  let db: Db;
  let txn = null as any;

  beforeEach(async () => {
    db = await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates a computed field flag', async () => {
    const { patientAnswers, user } = await setup(txn);
    const mutation = `mutation {
        computedFieldFlagCreate(input: {
          patientAnswerId: "${patientAnswers[0].id}",
          reason: "${reason}"
        }) {
          id
          patientAnswerId
          userId
          reason
        }
      }`;

    const result = await graphql(schema, mutation, null, {
      db,
      permissions,
      userId: user.id,
      txn,
    });
    const computedFieldFlag = cloneDeep(result.data!.computedFieldFlagCreate);

    expect(computedFieldFlag.id).toBeTruthy();
    expect(computedFieldFlag).toMatchObject({
      userId: user.id,
      patientAnswerId: patientAnswers[0].id,
      reason,
    });
  });
});
