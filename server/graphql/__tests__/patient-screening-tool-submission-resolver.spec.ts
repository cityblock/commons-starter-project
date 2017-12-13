import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import PatientScreeningToolSubmission from '../../models/patient-screening-tool-submission';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import ScreeningTool from '../../models/screening-tool';
import User from '../../models/user';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('patient screening tool submission resolver tests', () => {
  let db: Db;
  const userRole = 'admin';
  let riskArea: RiskArea;
  let screeningTool: ScreeningTool;
  let patient: Patient;
  let user: User;
  let clinic: Clinic;
  let submission: PatientScreeningToolSubmission;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    riskArea = await RiskArea.create({
      title: 'Risk Area',
      order: 1,
    });
    screeningTool = await ScreeningTool.create({
      title: 'Screening Tool',
      riskAreaId: riskArea.id,
    });
    submission = await PatientScreeningToolSubmission.create({
      patientId: patient.id,
      userId: user.id,
      screeningToolId: screeningTool.id,
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve patientScreeningToolSubmission', () => {
    it('can fetch a patientScreeningToolSubmission', async () => {
      const query = `{
        patientScreeningToolSubmission(patientScreeningToolSubmissionId: "${submission.id}") {
          id
          score
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.patientScreeningToolSubmission)).toMatchObject({
        id: submission.id,
        score: submission.score,
      });
    });

    it('errors if a patientScreeningToolSubmission cannot be found', async () => {
      const fakeId = uuid();
      const query = `{
        patientScreeningToolSubmission(patientScreeningToolSubmissionId: "${fakeId}") {
          id
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(result.errors![0].message).toMatch(
        `No such patient screening tool submission: ${fakeId}`,
      );
    });

    it('gets all patientScreeningToolSubmissions', async () => {
      const screeningTool2 = await ScreeningTool.create({
        riskAreaId: riskArea.id,
        title: 'Another Screening Tool',
      });
      const submission2 = await PatientScreeningToolSubmission.create({
        patientId: patient.id,
        userId: user.id,
        screeningToolId: screeningTool2.id,
      });

      const query = `{
        patientScreeningToolSubmissions {
          id
          score
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.patientScreeningToolSubmissions)).toMatchObject([
        {
          id: submission.id,
          score: submission.score,
        },
        {
          id: submission2.id,
          score: submission2.score,
        },
      ]);
    });

    it('gets all patientScreeningToolSubmissions for a patient', async () => {
      const patient2 = await createPatient(createMockPatient(456, clinic.id), user.id);
      const screeningTool2 = await ScreeningTool.create({
        riskAreaId: riskArea.id,
        title: 'Another Screening Tool',
      });
      const submission2 = await PatientScreeningToolSubmission.create({
        patientId: patient.id,
        userId: user.id,
        screeningToolId: screeningTool2.id,
      });
      const submission3 = await PatientScreeningToolSubmission.create({
        patientId: patient2.id,
        userId: user.id,
        screeningToolId: screeningTool2.id,
      });

      const query = `{
        patientScreeningToolSubmissionsForPatient(patientId: "${patient.id}", scored: false) {
          id
          score
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      const submissions = cloneDeep(result.data!.patientScreeningToolSubmissionsForPatient);
      const submissionIds = submissions.map((sub: PatientScreeningToolSubmission) => sub.id);
      expect(submissions.length).toEqual(2);
      expect(submissionIds).not.toContain(submission3.id);
      expect(submissions).toMatchObject([
        {
          id: submission.id,
          score: submission.score,
        },
        {
          id: submission2.id,
          score: submission2.score,
        },
      ]);
    });

    it('gets all patientScreeningToolSubmissions for a patient for a screeningTool', async () => {
      const screeningTool2 = await ScreeningTool.create({
        riskAreaId: riskArea.id,
        title: 'Another Screening Tool',
      });
      const submission2 = await PatientScreeningToolSubmission.create({
        patientId: patient.id,
        userId: user.id,
        screeningToolId: screeningTool2.id,
      });
      const submission3 = await PatientScreeningToolSubmission.create({
        patientId: patient.id,
        userId: user.id,
        screeningToolId: screeningTool2.id,
      });

      const query = `{
        patientScreeningToolSubmissionsForPatient(
          patientId: "${patient.id}"
          screeningToolId: "${screeningTool2.id}"
          scored: false
        ) {
          id
          score
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      const submissions = cloneDeep(result.data!.patientScreeningToolSubmissionsForPatient);
      const submissionIds = submissions.map((sub: PatientScreeningToolSubmission) => sub.id);
      expect(submissions.length).toEqual(2);
      expect(submissionIds).not.toContain(submission.id);
      expect(submissions).toMatchObject([
        {
          id: submission2.id,
          score: submission2.score,
        },
        {
          id: submission3.id,
          score: submission3.score,
        },
      ]);
    });

    it('gets the latest patientScreeningToolSubmission for a patient for a tool', async () => {
      const screeningTool2 = await ScreeningTool.create({
        riskAreaId: riskArea.id,
        title: 'Another Screening Tool',
      });
      await PatientScreeningToolSubmission.create({
        patientId: patient.id,
        userId: user.id,
        screeningToolId: screeningTool2.id,
      });
      const submission2 = await PatientScreeningToolSubmission.create({
        patientId: patient.id,
        userId: user.id,
        screeningToolId: screeningTool2.id,
      });

      const query = `{
        patientScreeningToolSubmissionForPatientAndScreeningTool(
          screeningToolId: "${screeningTool2.id}"
          patientId: "${patient.id}"
          scored: false
        ) {
          id
          score
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      const resultSubmission = cloneDeep(
        result.data!.patientScreeningToolSubmissionForPatientAndScreeningTool,
      );
      expect(resultSubmission.id).toEqual(submission2.id);
      expect(resultSubmission.score).toEqual(submission2.score);
    });

    it('returns null if no latest submission for a patient for a tool', async () => {
      const screeningTool2 = await ScreeningTool.create({
        riskAreaId: riskArea.id,
        title: 'Another Screening Tool',
      });
      await PatientScreeningToolSubmission.create({
        patientId: patient.id,
        userId: user.id,
        screeningToolId: screeningTool.id,
      });

      const query = `{
        patientScreeningToolSubmissionForPatientAndScreeningTool(
          screeningToolId: "${screeningTool2.id}"
          patientId: "${patient.id}"
          scored: false
        ) {
          id
          score
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      const resultSubmission = cloneDeep(
        result.data!.patientScreeningToolSubmissionForPatientAndScreeningTool,
      );
      expect(resultSubmission).toBeFalsy();
    });
  });

  describe('patientScreeningToolSubmission submit score', () => {
    it('submits score', async () => {
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
        patientScreeningToolSubmissionId: submission.id,
        type: 'patientScreeningToolSubmission',
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
        patientScreeningToolSubmissionScore(input: {
          patientScreeningToolSubmissionId: "${submission.id}"
        }) {
          score
        }
      }`;
      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.patientScreeningToolSubmissionScore)).toMatchObject({
        score: 5,
      });
    });
  });

  describe('patientScreeningToolSubmission create', () => {
    it('creates a new patientScreeningToolSubmission', async () => {
      const mutation = `mutation {
        patientScreeningToolSubmissionCreate(input: {
          screeningToolId: "${screeningTool.id}"
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
      expect(cloneDeep(result.data!.patientScreeningToolSubmissionCreate)).toMatchObject({
        userId: user.id,
        patientId: patient.id,
      });
    });
  });
});
