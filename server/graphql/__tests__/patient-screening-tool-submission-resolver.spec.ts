import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientScreeningToolSubmission from '../../models/patient-screening-tool-submission';
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
      score: 10,
      patientAnswers: [],
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
        score: 20,
        patientAnswers: [],
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
        score: 20,
        patientAnswers: [],
      });
      const submission3 = await PatientScreeningToolSubmission.create({
        patientId: patient2.id,
        userId: user.id,
        screeningToolId: screeningTool2.id,
        score: 20,
        patientAnswers: [],
      });

      const query = `{
        patientScreeningToolSubmissionsForPatient(patientId: "${patient.id}") {
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
        score: 20,
        patientAnswers: [],
      });
      const submission3 = await PatientScreeningToolSubmission.create({
        patientId: patient.id,
        userId: user.id,
        screeningToolId: screeningTool2.id,
        score: 20,
        patientAnswers: [],
      });

      const query = `{
        patientScreeningToolSubmissionsForPatient(
          patientId: "${patient.id}"
          screeningToolId: "${screeningTool2.id}"
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
        score: 20,
        patientAnswers: [],
      });
      const submission2 = await PatientScreeningToolSubmission.create({
        patientId: patient.id,
        userId: user.id,
        screeningToolId: screeningTool2.id,
        score: 20,
        patientAnswers: [],
      });

      const query = `{
        patientScreeningToolSubmissionForPatientAndScreeningTool(
          screeningToolId: "${screeningTool2.id}"
          patientId: "${patient.id}"
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
        score: 20,
        patientAnswers: [],
      });

      const query = `{
        patientScreeningToolSubmissionForPatientAndScreeningTool(
          screeningToolId: "${screeningTool2.id}"
          patientId: "${patient.id}"
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

  describe('patientScreeningToolSubmission edit', () => {
    it('edits a patientScreeningToolSubmission', async () => {
      const query = `mutation {
        patientScreeningToolSubmissionEdit(input: {
          patientScreeningToolSubmissionId: "${submission.id}"
          score: 100,
        }) {
          score
        }
      }`;
      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.patientScreeningToolSubmissionEdit)).toMatchObject({
        score: 100,
      });
    });
  });

  describe('patientScreeningToolSubmission create', () => {
    it('creates a new patientScreeningToolSubmission', async () => {
      const mutation = `mutation {
        patientScreeningToolSubmissionCreate(input: {
          screeningToolId: "${screeningTool.id}"
          patientId: "${patient.id}"
          userId: "${user.id}"
          score: 2
        }) {
          score
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.patientScreeningToolSubmissionCreate)).toMatchObject({
        score: 2,
      });
    });
  });

  describe('patientScreeningToolSubmission delete', () => {
    it('marks a patientScreeningToolSubmission as deleted', async () => {
      const mutation = `mutation {
        patientScreeningToolSubmissionDelete(input: {
          patientScreeningToolSubmissionId: "${submission.id}"
        }) {
          id
          deletedAt
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      const deletedSubmission = cloneDeep(result.data!.patientScreeningToolSubmissionDelete);
      expect(deletedSubmission).toMatchObject({
        id: submission.id,
      });
      expect(deletedSubmission.deletedAt).not.toBeFalsy();
      expect(deletedSubmission.deletedAt).not.toBeFalsy();
    });
  });
});
