import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import * as uuid from 'uuid/v4';
import Db from '../../db';
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
  createMockPatient,
  createMockRiskAreaGroup,
  createMockUser,
  createPatient,
  createRiskArea,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('answer tests', () => {
  let db: Db;
  const userRole = 'admin';
  let riskArea: RiskArea;
  let question: Question;
  let user: User;
  let clinic: Clinic;
  let riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    riskArea = await createRiskArea({ title: 'testing' });
    question = await Question.create({
      title: 'like writing tests?',
      answerType: 'dropdown',
      type: 'riskArea',
      riskAreaId: riskArea.id,
      order: 1,
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve riskArea', () => {
    it('can fetch riskArea', async () => {
      const query = `{
        riskArea(riskAreaId: "${riskArea.id}") {
          id
          title
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.riskArea)).toMatchObject({
        id: riskArea.id,
        title: 'testing',
      });
    });

    it('errors if an riskArea cannot be found', async () => {
      const fakeId = uuid();
      const query = `{ riskArea(riskAreaId: "${fakeId}") { id } }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(result.errors![0].message).toMatch(`No such risk area: ${fakeId}`);
    });

    it('gets all risk areas', async () => {
      const query = `{
        riskAreas {
          id
          title
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
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
      const query = `mutation {
        riskAreaEdit(input: {
          title: "new value",
          riskAreaId: "${riskArea.id}"
        }) {
          title
        }
      }`;
      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.riskAreaEdit)).toMatchObject({
        title: 'new value',
      });
    });
  });

  describe('riskArea Create', () => {
    it('creates a new riskArea', async () => {
      const riskAreaGroup = await RiskAreaGroup.create(createMockRiskAreaGroup());
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
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.riskAreaCreate)).toMatchObject({
        title: 'new risk area',
        assessmentType: 'manual',
        mediumRiskThreshold: 5,
        highRiskThreshold: 8,
        riskAreaGroupId: riskAreaGroup.id,
      });
    });
  });

  describe('riskArea delete', () => {
    it('marks an riskArea as deleted', async () => {
      const mutation = `mutation {
        riskAreaDelete(input: { riskAreaId: "${riskArea.id}" }) {
          id,
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.riskAreaDelete)).toMatchObject({
        id: riskArea.id,
      });
    });
  });

  describe('riskArea tests with patient answers', () => {
    let patient: Patient;

    beforeEach(async () => {
      riskArea = await createRiskArea({ title: 'testing' });
      question = await Question.create({
        title: 'like writing tests?',
        answerType: 'dropdown',
        type: 'riskArea',
        riskAreaId: riskArea.id,
        order: 1,
      });
      patient = await createPatient(createMockPatient(123, clinic.id), user.id);
      riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create({
        patientId: patient.id,
        userId: user.id,
        riskAreaId: riskArea.id,
      });
    });

    it('gets summary for patient', async () => {
      const answer = await Answer.create({
        displayValue: 'loves writing tests!',
        value: '3',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: true,
        summaryText: 'summary text!',
        questionId: question.id,
        order: 1,
      });
      await PatientAnswer.create({
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
      });
      const query = `{
        patientRiskAreaSummary(
          riskAreaId: "${riskArea.id}",
          patientId: "${patient.id}",
        ) {
          summary
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.patientRiskAreaSummary)).toMatchObject({
        summary: ['summary text!'],
      });
    });

    it('gets summary for patient with an embedded patient answer', async () => {
      const answer = await Answer.create({
        displayValue: 'loves writing tests!',
        value: '3',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: true,
        summaryText: 'the patient said: {answer}',
        questionId: question.id,
        order: 1,
      });
      await PatientAnswer.create({
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
      });
      const query = `{
        patientRiskAreaSummary(
          riskAreaId: "${riskArea.id}",
          patientId: "${patient.id}",
        ) {
          summary
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.patientRiskAreaSummary)).toMatchObject({
        summary: ['the patient said: patient wrote this'],
      });
    });

    it('gets increment and high risk score for patient', async () => {
      const answer = await Answer.create({
        displayValue: 'loves writing tests!',
        value: '3',
        valueType: 'number',
        riskAdjustmentType: 'increment',
        inSummary: true,
        summaryText: 'summary text!',
        questionId: question.id,
        order: 1,
      });
      const question2 = await Question.create({
        title: 'other question',
        answerType: 'dropdown',
        type: 'riskArea',
        riskAreaId: riskArea.id,
        order: 2,
      });
      const highRiskAnswer = await Answer.create({
        displayValue: 'loves writing tests!',
        value: '4',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: true,
        summaryText: 'summary text!',
        questionId: question2.id,
        order: 1,
      });
      await PatientAnswer.create({
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
      });
      await PatientAnswer.create({
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
      });

      const query = `{
        patientRiskAreaRiskScore(
          riskAreaId: "${riskArea.id}",
          patientId: "${patient.id}",
        ) {
          score,
          forceHighRisk
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.patientRiskAreaRiskScore)).toMatchObject({
        score: 1,
        forceHighRisk: true,
      });
    });
  });
});
