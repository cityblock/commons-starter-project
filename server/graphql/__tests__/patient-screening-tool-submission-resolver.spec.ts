import { subHours } from 'date-fns';
import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import PatientGlassBreak from '../../models/patient-glass-break';
import PatientScreeningToolSubmission from '../../models/patient-screening-tool-submission';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import ScreeningTool from '../../models/screening-tool';
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
  screeningTool: ScreeningTool;
  patient: Patient;
  user: User;
  clinic: Clinic;
  submission: PatientScreeningToolSubmission;
}

const userRole = 'admin';
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const riskArea = await createRiskArea({ title: 'Risk Area' }, txn);
  const screeningTool = await ScreeningTool.create(
    {
      title: 'Screening Tool',
      riskAreaId: riskArea.id,
    },
    txn,
  );
  const submission = await PatientScreeningToolSubmission.create(
    {
      patientId: patient.id,
      userId: user.id,
      screeningToolId: screeningTool.id,
    },
    txn,
  );

  return {
    clinic,
    user,
    patient,
    riskArea,
    screeningTool,
    submission,
  };
}

describe('patient screening tool submission resolver tests', () => {
  let txn = null as any;
  let db: Db;

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

  describe('resolve patientScreeningToolSubmission', () => {
    it('can fetch a patientScreeningToolSubmission', async () => {
      const { submission, user } = await setup(txn);
      const query = `{
          patientScreeningToolSubmission(patientScreeningToolSubmissionId: "${submission.id}") {
            id
            score
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        userId: user.id,
        permissions,
        txn,
      });
      expect(cloneDeep(result.data!.patientScreeningToolSubmission)).toMatchObject({
        id: submission.id,
        score: submission.score,
      });
    });

    it('errors if a patientScreeningToolSubmission cannot be found', async () => {
      const { user } = await setup(txn);
      const fakeId = uuid();
      const query = `{
          patientScreeningToolSubmission(patientScreeningToolSubmissionId: "${fakeId}") {
            id
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        userId: user.id,
        permissions,
        txn,
      });
      expect(result.errors![0].message).toMatch(
        `No such patient screening tool submission: ${fakeId}`,
      );
    });

    it('gets all patientScreeningToolSubmissions', async () => {
      const { riskArea, patient, user, submission } = await setup(txn);
      const screeningTool2 = await ScreeningTool.create(
        {
          riskAreaId: riskArea.id,
          title: 'Another Screening Tool',
        },
        txn,
      );
      const submission2 = await PatientScreeningToolSubmission.create(
        {
          patientId: patient.id,
          userId: user.id,
          screeningToolId: screeningTool2.id,
        },
        txn,
      );

      const query = `{
          patientScreeningToolSubmissions {
            id
            score
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      const clonedResult = cloneDeep(result.data!.patientScreeningToolSubmissions);
      const mappedResults = clonedResult.map((sub: any) => ({ id: sub.id, score: sub.score }));
      expect(
        mappedResults.some(
          (res: any) => res.id === submission.id && res.score === submission.score,
        ),
      ).toEqual(true);
      expect(
        mappedResults.some(
          (res: any) => res.id === submission2.id && res.score === submission2.score,
        ),
      ).toEqual(true);
    });

    it('gets all patientScreeningToolSubmissions for a patient', async () => {
      const { clinic, user, riskArea, patient, submission } = await setup(txn);
      const patient2 = await createPatient({ cityblockId: 456, homeClinicId: clinic.id }, txn);
      const screeningTool2 = await ScreeningTool.create(
        {
          riskAreaId: riskArea.id,
          title: 'Another Screening Tool',
        },
        txn,
      );
      const submission2 = await PatientScreeningToolSubmission.create(
        {
          patientId: patient.id,
          userId: user.id,
          screeningToolId: screeningTool2.id,
        },
        txn,
      );
      const submission3 = await PatientScreeningToolSubmission.create(
        {
          patientId: patient2.id,
          userId: user.id,
          screeningToolId: screeningTool2.id,
        },
        txn,
      );

      const query = `{
          patientScreeningToolSubmissionsForPatient(patientId: "${patient.id}", scored: false) {
            id
            score
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      const submissions = cloneDeep(result.data!.patientScreeningToolSubmissionsForPatient);
      const submissionIds = submissions.map((sub: PatientScreeningToolSubmission) => sub.id);
      const mappedResults = submissions.map((sub: any) => ({ id: sub.id, score: sub.score }));
      expect(submissions.length).toEqual(2);
      expect(submissionIds).not.toContain(submission3.id);
      expect(
        mappedResults.some(
          (res: any) => res.id === submission.id && res.score === submission.score,
        ),
      ).toEqual(true);
      expect(
        mappedResults.some(
          (res: any) => res.id === submission2.id && res.score === submission2.score,
        ),
      ).toEqual(true);
    });

    it('gets all patientScreeningToolSubmissions for patient 360', async () => {
      const { clinic, user, riskArea, patient, submission } = await setup(txn);
      const patient2 = await createPatient({ cityblockId: 456, homeClinicId: clinic.id }, txn);
      const screeningTool2 = await ScreeningTool.create(
        {
          riskAreaId: riskArea.id,
          title: 'Another Screening Tool',
        },
        txn,
      );
      const submission2 = await PatientScreeningToolSubmission.create(
        {
          patientId: patient.id,
          userId: user.id,
          screeningToolId: screeningTool2.id,
        },
        txn,
      );
      const submission3 = await PatientScreeningToolSubmission.create(
        {
          patientId: patient2.id,
          userId: user.id,
          screeningToolId: screeningTool2.id,
        },
        txn,
      );

      const query = `{
          patientScreeningToolSubmissionsFor360(patientId: "${patient.id}") {
            id
            score
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      const submissions = cloneDeep(result.data!.patientScreeningToolSubmissionsFor360);
      const submissionIds = submissions.map((sub: PatientScreeningToolSubmission) => sub.id);
      const mappedResults = submissions.map((sub: any) => ({ id: sub.id, score: sub.score }));
      expect(submissions.length).toEqual(2);
      expect(submissionIds).not.toContain(submission3.id);
      expect(
        mappedResults.some(
          (res: any) => res.id === submission.id && res.score === submission.score,
        ),
      ).toEqual(true);
      expect(
        mappedResults.some(
          (res: any) => res.id === submission2.id && res.score === submission2.score,
        ),
      ).toEqual(true);
    });

    it('blocks getting submisisons for patient 360 if invalid glass break', async () => {
      const { user, patient } = await setup(txn);

      const query = `{
          patientScreeningToolSubmissionsFor360(patientId: "${
            patient.id
          }", glassBreakId: "${uuid()}") {
            id
            score
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        permissions: 'blue',
        userId: user.id,
        txn,
      });

      expect(result.errors![0].message).toBe(
        'You must break the glass again to view this patient. Please refresh the page.',
      );
    });

    it('blocks getting submisisons for patient 360 if too old glass break', async () => {
      const { user, patient } = await setup(txn);

      const patientGlassBreak = await PatientGlassBreak.create(
        {
          userId: user.id,
          patientId: patient.id,
          reason: 'Needed for routine care',
          note: null,
        },
        txn,
      );

      await PatientGlassBreak.query(txn)
        .where({ userId: user.id, patientId: patient.id })
        .patch({ createdAt: subHours(new Date(), 9).toISOString() });

      const query = `{
          patientScreeningToolSubmissionsFor360(patientId: "${patient.id}", glassBreakId: "${
        patientGlassBreak.id
      }") {
            id
            score
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        permissions: 'blue',
        userId: user.id,
        txn,
      });

      expect(result.errors![0].message).toBe(
        'You must break the glass again to view this patient. Please refresh the page.',
      );
    });

    it('gets all patientScreeningToolSubmissions for a patient for a screeningTool', async () => {
      const { riskArea, patient, user, submission } = await setup(txn);
      const screeningTool2 = await ScreeningTool.create(
        {
          riskAreaId: riskArea.id,
          title: 'Another Screening Tool',
        },
        txn,
      );
      const submission2 = await PatientScreeningToolSubmission.create(
        {
          patientId: patient.id,
          userId: user.id,
          screeningToolId: screeningTool2.id,
        },
        txn,
      );
      const submission3 = await PatientScreeningToolSubmission.create(
        {
          patientId: patient.id,
          userId: user.id,
          screeningToolId: screeningTool2.id,
        },
        txn,
      );

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
      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      const submissions = cloneDeep(result.data!.patientScreeningToolSubmissionsForPatient);
      const submissionIds = submissions.map((sub: PatientScreeningToolSubmission) => sub.id);
      expect(submissions.length).toEqual(2);
      expect(submissionIds).not.toContain(submission.id);
      expect(submissionIds).toContain(submission2.id);
      expect(submissionIds).toContain(submission3.id);
    });

    it('gets the latest patientScreeningToolSubmission for a patient for a tool', async () => {
      const { riskArea, patient, user } = await setup(txn);
      const screeningTool2 = await ScreeningTool.create(
        {
          riskAreaId: riskArea.id,
          title: 'Another Screening Tool',
        },
        txn,
      );
      await PatientScreeningToolSubmission.create(
        {
          patientId: patient.id,
          userId: user.id,
          screeningToolId: screeningTool2.id,
        },
        txn,
      );
      const submission2 = await PatientScreeningToolSubmission.create(
        {
          patientId: patient.id,
          userId: user.id,
          screeningToolId: screeningTool2.id,
        },
        txn,
      );

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
      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      const resultSubmission = cloneDeep(
        result.data!.patientScreeningToolSubmissionForPatientAndScreeningTool,
      );
      expect(resultSubmission.id).toEqual(submission2.id);
      expect(resultSubmission.score).toEqual(submission2.score);
    });

    it('returns null if no latest submission for a patient for a tool', async () => {
      const { riskArea, patient, user, screeningTool } = await setup(txn);
      const screeningTool2 = await ScreeningTool.create(
        {
          riskAreaId: riskArea.id,
          title: 'Another Screening Tool',
        },
        txn,
      );
      await PatientScreeningToolSubmission.create(
        {
          patientId: patient.id,
          userId: user.id,
          screeningToolId: screeningTool.id,
        },
        txn,
      );

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
      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      const resultSubmission = cloneDeep(
        result.data!.patientScreeningToolSubmissionForPatientAndScreeningTool,
      );
      expect(resultSubmission).toBeFalsy();
    });
  });

  describe('patientScreeningToolSubmission submit score', () => {
    it('submits score', async () => {
      const { riskArea, patient, user, submission } = await setup(txn);
      const question = await Question.create(
        {
          title: 'Question Title',
          answerType: 'dropdown',
          riskAreaId: riskArea.id,
          type: 'riskArea',
          order: 1,
        },
        txn,
      );
      const question2 = await Question.create(
        {
          title: 'Question 2 Title',
          answerType: 'dropdown',
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
          valueType: 'number',
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
          valueType: 'number',
          order: 1,
          inSummary: false,
        },
        txn,
      );
      await PatientAnswer.create(
        {
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
        },
        txn,
      );

      const query = `mutation {
          patientScreeningToolSubmissionScore(input: {
            patientScreeningToolSubmissionId: "${submission.id}"
          }) {
            score
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      expect(cloneDeep(result.data!.patientScreeningToolSubmissionScore)).toMatchObject({
        score: 5,
      });
    });
  });

  describe('patientScreeningToolSubmission create', () => {
    it('creates a new patientScreeningToolSubmission', async () => {
      const { screeningTool, patient, user } = await setup(txn);
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
        permissions,
        userId: user.id,
        txn,
      });
      expect(cloneDeep(result.data!.patientScreeningToolSubmissionCreate)).toMatchObject({
        userId: user.id,
        patientId: patient.id,
      });
    });
  });
});
