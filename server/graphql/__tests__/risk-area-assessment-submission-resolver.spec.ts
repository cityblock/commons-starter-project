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
import User from '../../models/user';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
  createRiskArea,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('risk area assessment resolver tests', () => {
  let db: Db;
  const userRole = 'admin';
  let riskArea: RiskArea;
  let patient: Patient;
  let user: User;
  let clinic: Clinic;
  let submission: RiskAreaAssessmentSubmission;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    riskArea = await createRiskArea();
    submission = await RiskAreaAssessmentSubmission.create({
      patientId: patient.id,
      userId: user.id,
      riskAreaId: riskArea.id,
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve riskAreaAssessmentSubmission', () => {
    it('can fetch a riskAreaAssessmentSubmission', async () => {
      const query = `{
        riskAreaAssessmentSubmission(riskAreaAssessmentSubmissionId: "${submission.id}") {
          id
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.riskAreaAssessmentSubmission)).toMatchObject({
        id: submission.id,
      });
    });

    it('errors if a riskAreaAssessmentSubmission cannot be found', async () => {
      const fakeId = uuid();
      const query = `{
        riskAreaAssessmentSubmission(riskAreaAssessmentSubmissionId: "${fakeId}") {
          id
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(result.errors![0].message).toMatch(
        `No such risk area assessment submission: ${fakeId}`,
      );
    });

    it('gets the latest riskAreaAssessmentSubmission for a patient for a risk area', async () => {
      await RiskAreaAssessmentSubmission.create({
        patientId: patient.id,
        userId: user.id,
        riskAreaId: riskArea.id,
      });
      const submission2 = await RiskAreaAssessmentSubmission.create({
        patientId: patient.id,
        userId: user.id,
        riskAreaId: riskArea.id,
      });

      const query = `{
        riskAreaAssessmentSubmissionForPatient(
          riskAreaId: "${riskArea.id}"
          patientId: "${patient.id}"
          completed: false
        ) {
          id
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      const resultSubmission = cloneDeep(result.data!.riskAreaAssessmentSubmissionForPatient);
      expect(resultSubmission.id).toEqual(submission2.id);
    });

    it('returns null if no latest submission for a patient for a risk area', async () => {
      await RiskAreaAssessmentSubmission.complete(submission.id);

      const query = `{
        riskAreaAssessmentSubmissionForPatient(
          riskAreaId: "${riskArea.id}"
          patientId: "${patient.id}"
          completed: false
        ) {
          id
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      const resultSubmission = cloneDeep(result.data!.riskAreaAssessmentSubmissionForPatient);
      expect(resultSubmission).toBeFalsy();
    });
  });

  describe('riskAreaAssessmentSubmission completes submission', () => {
    it('completes submission', async () => {
      const question = await Question.create({
        title: 'Question Title',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 1,
      });
      const question2 = await Question.create({
        title: 'Question 2 Title',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 2,
      });
      const answer = await Answer.create({
        questionId: question.id,
        displayValue: '1',
        value: '1',
        valueType: 'number',
        order: 1,
      });
      const answer2 = await Answer.create({
        questionId: question2.id,
        displayValue: '4',
        value: '4',
        valueType: 'number',
        order: 1,
      });
      await PatientAnswer.create({
        patientId: patient.id,
        riskAreaAssessmentSubmissionId: submission.id,
        type: 'riskAreaAssessmentSubmission',
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
      });

      const query = `mutation {
        riskAreaAssessmentSubmissionComplete(input: {
          riskAreaAssessmentSubmissionId: "${submission.id}"
        }) {
          id
          completedAt
        }
      }`;
      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
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
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.riskAreaAssessmentSubmissionCreate)).toMatchObject({
        userId: user.id,
        patientId: patient.id,
      });
    });
  });
});
