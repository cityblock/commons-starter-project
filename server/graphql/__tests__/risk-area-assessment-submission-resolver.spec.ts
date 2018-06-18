import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { AnswerTypeOptions, AnswerValueTypeOptions, UserRole } from 'schema';
import uuid from 'uuid/v4';

import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import RiskAreaAssessmentSubmission from '../../models/risk-area-assessment-submission';
import User from '../../models/user';
import {
  createMockClinic,
  createMockUser,
  createPatient,
  createRiskArea,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  riskArea: RiskArea;
  patient: Patient;
  user: User;
  clinic: Clinic;
  submission: RiskAreaAssessmentSubmission;
}

const userRole = 'admin' as UserRole;
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const riskArea = await createRiskArea({ title: 'Risk Area' }, txn);
  const submission = await RiskAreaAssessmentSubmission.create(
    {
      patientId: patient.id,
      userId: user.id,
      riskAreaId: riskArea.id,
    },
    txn,
  );
  return { clinic, user, patient, riskArea, submission };
}
describe('risk area assessment resolver tests', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolve riskAreaAssessmentSubmission', () => {
    it('can fetch a riskAreaAssessmentSubmission', async () => {
      const { submission, user } = await setup(txn);

      const query = `{
          riskAreaAssessmentSubmission(riskAreaAssessmentSubmissionId: "${submission.id}") {
            id
          }
        }`;

      const result = await graphql(schema, query, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });

      expect(cloneDeep(result.data!.riskAreaAssessmentSubmission)).toMatchObject({
        id: submission.id,
      });
    });

    it('errors if a riskAreaAssessmentSubmission cannot be found', async () => {
      const { user } = await setup(txn);
      const fakeId = uuid();
      const query = `{
          riskAreaAssessmentSubmission(riskAreaAssessmentSubmissionId: "${fakeId}") {
            id
          }
        }`;
      const result = await graphql(schema, query, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });
      expect(result.errors![0].message).toMatch(
        `No such risk area assessment submission: ${fakeId}`,
      );
    });

    it('gets the latest riskAreaAssessmentSubmission for a patient for a risk area', async () => {
      const { patient, user, riskArea, submission } = await setup(txn);

      const submission1 = await RiskAreaAssessmentSubmission.create(
        {
          patientId: patient.id,
          userId: user.id,
          riskAreaId: riskArea.id,
        },
        txn,
      );
      const submission2 = await RiskAreaAssessmentSubmission.create(
        {
          patientId: patient.id,
          userId: user.id,
          riskAreaId: riskArea.id,
        },
        txn,
      );

      const query = `{
          riskAreaAssessmentSubmissionForPatient(
            riskAreaId: "${riskArea.id}"
            patientId: "${patient.id}"
            completed: false
          ) {
            id
          }
        }`;
      const result = await graphql(schema, query, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });
      const resultSubmission = cloneDeep(result.data!.riskAreaAssessmentSubmissionForPatient);
      expect([submission.id, submission1.id, submission2.id]).toContain(resultSubmission.id);
    });

    it('returns null if no latest submission for a patient for a risk area', async () => {
      const { submission, riskArea, patient, user } = await setup(txn);

      await RiskAreaAssessmentSubmission.complete(submission.id, txn);

      const query = `{
          riskAreaAssessmentSubmissionForPatient(
            riskAreaId: "${riskArea.id}"
            patientId: "${patient.id}"
            completed: false
          ) {
            id
          }
        }`;
      const result = await graphql(schema, query, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });
      const resultSubmission = cloneDeep(result.data!.riskAreaAssessmentSubmissionForPatient);
      expect(resultSubmission).toBeFalsy();
    });
  });

  describe('riskAreaAssessmentSubmission completes submission', () => {
    it('completes submission', async () => {
      const { riskArea, patient, user, submission } = await setup(txn);

      const question = await Question.create(
        {
          title: 'Question Title',
          answerType: 'dropdown' as AnswerTypeOptions,
          riskAreaId: riskArea.id,
          type: 'riskArea',
          order: 1,
        },
        txn,
      );
      const question2 = await Question.create(
        {
          title: 'Question 2 Title',
          answerType: 'dropdown' as AnswerTypeOptions,
          riskAreaId: riskArea.id,
          type: 'riskArea',
          order: 2,
        },
        txn,
      );
      const answer = await Answer.create(
        {
          questionId: question.id,
          displayValue: '1',
          value: '1',
          valueType: 'number' as AnswerValueTypeOptions,
          order: 1,
          inSummary: false,
        },
        txn,
      );
      const answer2 = await Answer.create(
        {
          questionId: question2.id,
          displayValue: '4',
          value: '4',
          valueType: 'number' as AnswerValueTypeOptions,
          order: 1,
          inSummary: false,
        },
        txn,
      );
      await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
          riskAreaAssessmentSubmissionId: submission.id,
          questionIds: [question.id, question2.id],
          answers: [
            {
              answerId: answer.id,
              questionId: question.id,
              answerValue: '1',
              patientId: patient.id,
              applicable: true,
              userId: user.id,
            },
            {
              answerId: answer2.id,
              questionId: question2.id,
              answerValue: '4',
              patientId: patient.id,
              applicable: true,
              userId: user.id,
            },
          ],
        },
        txn,
      );

      const query = `mutation {
          riskAreaAssessmentSubmissionComplete(input: {
            riskAreaAssessmentSubmissionId: "${submission.id}"
          }) {
            id
            completedAt
          }
        }`;
      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.riskAreaAssessmentSubmissionComplete)).toMatchObject({
        id: submission.id,
      });
      expect(
        cloneDeep(result.data!.riskAreaAssessmentSubmissionComplete).completedAt,
      ).not.toBeFalsy();
    });
  });

  describe('riskAreaAssessmentSubmission create', () => {
    it('creates a new riskAreaAssessmentSubmission', async () => {
      const { riskArea, patient, user } = await setup(txn);

      const mutation = `mutation {
        riskAreaAssessmentSubmissionCreate(input: {
          riskAreaId: "${riskArea.id}"
          patientId: "${patient.id}"
        }) {
          userId
          patientId
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.riskAreaAssessmentSubmissionCreate)).toMatchObject({
        userId: user.id,
        patientId: patient.id,
      });
    });
  });
});
