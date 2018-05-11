import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import {
  AnswerTypeOptions,
  AnswerValueTypeOptions,
  AssessmentType,
  RiskAdjustmentTypeOptions,
  UserRole,
} from 'schema';
import * as uuid from 'uuid/v4';

import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import RiskAreaAssessmentSubmission from '../../models/risk-area-assessment-submission';
import RiskAreaGroup from '../../models/risk-area-group';
import User from '../../models/user';
import {
  createMockClinic,
  createMockRiskAreaGroup,
  createMockUser,
  createPatient,
  createRiskArea,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  riskArea: RiskArea;
  question: Question;
  user: User;
  clinic: Clinic;
  patient: Patient;
  riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission;
}

const userRole = 'admin' as UserRole;
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const riskArea = await createRiskArea({ title: 'testing' }, txn);
  const question = await Question.create(
    {
      title: 'like writing tests?',
      answerType: 'dropdown' as AnswerTypeOptions,
      type: 'riskArea',
      riskAreaId: riskArea.id,
      order: 1,
    },
    txn,
  );
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create(
    {
      patientId: patient.id,
      userId: user.id,
      riskAreaId: riskArea.id,
    },
    txn,
  );

  return {
    riskArea,
    question,
    user,
    clinic,
    patient,
    riskAreaAssessmentSubmission,
  };
}

describe('answer tests', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolve riskArea', () => {
    it('can fetch riskArea', async () => {
      const { riskArea, user } = await setup(txn);
      const query = `{
          riskArea(riskAreaId: "${riskArea.id}") {
            id
            title
          }
        }`;
      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        txn,
      });
      expect(cloneDeep(result.data!.riskArea)).toMatchObject({
        id: riskArea.id,
        title: 'testing',
      });
    });

    it('errors if an riskArea cannot be found', async () => {
      const fakeId = uuid();
      const query = `{ riskArea(riskAreaId: "${fakeId}") { id } }`;
      const result = await graphql(schema, query, null, {
        userId: 'fakeUserId',
        permissions,
        txn,
      });
      expect(result.errors![0].message).toMatch(`No such risk area: ${fakeId}`);
    });

    it('gets all risk areas', async () => {
      const { riskArea, user } = await setup(txn);
      const query = `{
          riskAreas {
            id
            title
          }
        }`;
      const result = await graphql(schema, query, null, {
        userId: user.id,
        permissions,
        txn,
      });
      expect(cloneDeep(result.data!.riskAreas)).toMatchObject([
        {
          id: riskArea.id,
          title: 'testing',
        },
      ]);
    });
  });

  describe('riskArea edit', () => {
    it('edits riskArea', async () => {
      const { riskArea, user } = await setup(txn);
      const query = `mutation {
          riskAreaEdit(input: {
            title: "new value",
            riskAreaId: "${riskArea.id}"
          }) {
            title
          }
        }`;
      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        txn,
      });
      expect(cloneDeep(result.data!.riskAreaEdit)).toMatchObject({
        title: 'new value',
      });
    });
  });

  describe('riskArea Create', () => {
    it('creates a new riskArea', async () => {
      const { user } = await setup(txn);
      const riskAreaGroup = await RiskAreaGroup.create(createMockRiskAreaGroup(), txn);
      const mutation = `mutation {
          riskAreaCreate(input: {
            title: "new risk area"
            order: 1
            assessmentType: manual
            mediumRiskThreshold: 5
            highRiskThreshold: 8
            riskAreaGroupId: "${riskAreaGroup.id}"
          }) {
            title
            assessmentType
            mediumRiskThreshold
            highRiskThreshold
            riskAreaGroupId
          }
        }`;
      const result = await graphql(schema, mutation, null, {
        permissions,
        userId: user.id,
        txn,
      });
      expect(cloneDeep(result.data!.riskAreaCreate)).toMatchObject({
        title: 'new risk area',
        assessmentType: 'manual' as AssessmentType,
        mediumRiskThreshold: 5,
        highRiskThreshold: 8,
        riskAreaGroupId: riskAreaGroup.id,
      });
    });
  });

  describe('riskArea delete', () => {
    it('marks an riskArea as deleted', async () => {
      const { riskArea, user } = await setup(txn);
      const mutation = `mutation {
          riskAreaDelete(input: { riskAreaId: "${riskArea.id}" }) {
            id,
          }
        }`;
      const result = await graphql(schema, mutation, null, {
        permissions,
        userId: user.id,
        txn,
      });
      expect(cloneDeep(result.data!.riskAreaDelete)).toMatchObject({
        id: riskArea.id,
      });
    });
  });

  describe('riskArea tests with patient answers', () => {
    it('gets summary for patient', async () => {
      const { question, patient, riskAreaAssessmentSubmission, user, riskArea } = await setup(txn);
      const answer = await Answer.create(
        {
          displayValue: 'loves writing tests!',
          value: '3',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
          inSummary: true,
          summaryText: 'summary text!',
          questionId: question.id,
          order: 1,
        },
        txn,
      );
      await PatientAnswer.create(
        {
          patientId: patient.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [answer.questionId],
          answers: [
            {
              questionId: answer.questionId,
              answerId: answer.id,
              answerValue: '3',
              patientId: patient.id,
              applicable: true,
              userId: user.id,
            },
          ],
        },
        txn,
      );
      const query = `{
          patientRiskAreaSummary(
            riskAreaId: "${riskArea.id}",
            patientId: "${patient.id}",
          ) {
            summary
          }
        }`;
      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        txn,
      });
      expect(cloneDeep(result.data!.patientRiskAreaSummary)).toMatchObject({
        summary: ['summary text!'],
      });
    });

    it('gets summary for patient with an embedded patient answer', async () => {
      const { question, patient, riskAreaAssessmentSubmission, user, riskArea } = await setup(txn);
      const answer = await Answer.create(
        {
          displayValue: 'loves writing tests!',
          value: '3',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
          inSummary: true,
          summaryText: 'the patient said: {answer}',
          questionId: question.id,
          order: 1,
        },
        txn,
      );
      await PatientAnswer.create(
        {
          patientId: patient.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [answer.questionId],
          answers: [
            {
              questionId: answer.questionId,
              answerId: answer.id,
              answerValue: 'patient wrote this',
              patientId: patient.id,
              applicable: true,
              userId: user.id,
            },
          ],
        },
        txn,
      );
      const query = `{
          patientRiskAreaSummary(
            riskAreaId: "${riskArea.id}",
            patientId: "${patient.id}",
          ) {
            summary
          }
        }`;
      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        txn,
      });
      expect(cloneDeep(result.data!.patientRiskAreaSummary)).toMatchObject({
        summary: ['the patient said: patient wrote this'],
      });
    });

    it('gets increment and high risk score for patient', async () => {
      const { question, riskArea, patient, riskAreaAssessmentSubmission, user } = await setup(txn);
      const answer = await Answer.create(
        {
          displayValue: 'loves writing tests!',
          value: '3',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'increment' as RiskAdjustmentTypeOptions,
          inSummary: true,
          summaryText: 'summary text!',
          questionId: question.id,
          order: 1,
        },
        txn,
      );
      const question2 = await Question.create(
        {
          title: 'other question',
          answerType: 'dropdown' as AnswerTypeOptions,
          type: 'riskArea',
          riskAreaId: riskArea.id,
          order: 2,
        },
        txn,
      );
      const highRiskAnswer = await Answer.create(
        {
          displayValue: 'loves writing tests!',
          value: '4',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
          inSummary: true,
          summaryText: 'summary text!',
          questionId: question2.id,
          order: 1,
        },
        txn,
      );
      await PatientAnswer.create(
        {
          patientId: patient.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [answer.questionId],
          answers: [
            {
              questionId: answer.questionId,
              answerId: answer.id,
              answerValue: '3',
              patientId: patient.id,
              applicable: true,
              userId: user.id,
            },
          ],
        },
        txn,
      );
      await PatientAnswer.create(
        {
          patientId: patient.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [highRiskAnswer.questionId],
          answers: [
            {
              questionId: highRiskAnswer.questionId,
              answerId: highRiskAnswer.id,
              answerValue: '4',
              patientId: patient.id,
              applicable: true,
              userId: user.id,
            },
          ],
        },
        txn,
      );

      const query = `{
          patientRiskAreaRiskScore(
            riskAreaId: "${riskArea.id}",
            patientId: "${patient.id}",
          ) {
            score,
            forceHighRisk
          }
        }`;
      const result = await graphql(schema, query, null, {
        userId: user.id,
        permissions,
        txn,
      });
      expect(cloneDeep(result.data!.patientRiskAreaRiskScore)).toMatchObject({
        score: 1,
        forceHighRisk: true,
      });
    });
  });
});
