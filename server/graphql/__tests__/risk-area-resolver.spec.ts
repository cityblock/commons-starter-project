import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Answer from '../../models/answer';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import User from '../../models/user';
import { createMockPatient, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('answer tests', () => {
  let db: Db;
  const userRole = 'admin';
  let riskArea: RiskArea;
  let question: Question;
  let user: User;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
    user = await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });

    riskArea = await RiskArea.create({
      title: 'testing',
      order: 1,
    });
    question = await Question.create({
      title: 'like writing tests?',
      answerType: 'dropdown',
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
      const query = `{ riskArea(riskAreaId: "fakeId") { id } }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(result.errors![0].message).toMatch('No such risk area: fakeId');
    });

    it('gets all risk areas', async () => {
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
  });

  describe('riskArea edit', () => {
    it('edits riskArea', async () => {
      const query = `mutation {
        riskAreaEdit(input: { title: "new value", riskAreaId: "${riskArea.id}" }) {
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
      const mutation = `mutation {
        riskAreaCreate(input: {
          title: "new risk area"
          order: 1
        }) {
          title
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.riskAreaCreate)).toMatchObject({
        title: 'new risk area',
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
      riskArea = await RiskArea.create({
        title: 'testing',
        order: 1,
      });
      question = await Question.create({
        title: 'like writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        order: 1,
      });
      patient = await createPatient(createMockPatient(123), user.id);
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
