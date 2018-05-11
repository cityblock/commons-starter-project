import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import * as computedFieldFlagCreate from '../../../app/graphql/queries/computed-field-flag-create-mutation.graphql';

import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import ComputedFieldFlag from '../../models/computed-field-flag';
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

const userRole = 'admin' as UserRole;
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
  let txn = null as any;
  const computedFieldFlagCreateMutation = print(computedFieldFlagCreate);

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('creates a computed field flag', async () => {
    const { patientAnswers, user } = await setup(txn);
    const result = await graphql(
      schema,
      computedFieldFlagCreateMutation,
      null,
      {
        permissions,
        userId: user.id,
        txn,
      },
      {
        patientAnswerId: patientAnswers[0].id,
        reason,
      },
    );
    const computedFieldFlag = cloneDeep(result.data!.computedFieldFlagCreate);

    expect(computedFieldFlag.id).toBeTruthy();
    const fetchedFlag = await ComputedFieldFlag.get(computedFieldFlag.id, txn);
    expect(fetchedFlag).toMatchObject({
      userId: user.id,
      patientAnswerId: patientAnswers[0].id,
      reason,
    });
  });
});
