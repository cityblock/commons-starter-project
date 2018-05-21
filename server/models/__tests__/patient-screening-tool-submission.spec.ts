import { transaction, Transaction } from 'objection';
import { AnswerTypeOptions, AnswerValueTypeOptions, UserRole } from 'schema';
import * as uuid from 'uuid/v4';

import {
  createMockClinic,
  createMockUser,
  createPatient,
  createRiskArea,
} from '../../spec-helpers';
import Answer from '../answer';
import CarePlanSuggestion from '../care-plan-suggestion';
import Clinic from '../clinic';
import Concern from '../concern';
import ConcernSuggestion from '../concern-suggestion';
import GoalSuggestion from '../goal-suggestion';
import GoalSuggestionTemplate from '../goal-suggestion-template';
import Patient from '../patient';
import PatientAnswer from '../patient-answer';
import PatientScreeningToolSubmission from '../patient-screening-tool-submission';
import Question from '../question';
import RiskArea from '../risk-area';
import ScreeningTool from '../screening-tool';
import ScreeningToolScoreRange from '../screening-tool-score-range';
import User from '../user';

interface ISetup {
  riskArea: RiskArea;
  screeningTool1: ScreeningTool;
  screeningTool2: ScreeningTool;
  patient1: Patient;
  patient2: Patient;
  user: User;
  clinic: Clinic;
}

const userRole = 'physician' as UserRole;

async function setup(txn: Transaction): Promise<ISetup> {
  const riskArea = await createRiskArea({ title: 'Housing' }, txn);
  const screeningTool1 = await ScreeningTool.create(
    {
      title: 'Screening Tool',
      riskAreaId: riskArea.id,
    },
    txn,
  );
  const screeningTool2 = await ScreeningTool.create(
    {
      title: 'Screening Tool 2',
      riskAreaId: riskArea.id,
    },
    txn,
  );
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient1 = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const patient2 = await createPatient({ cityblockId: 234, homeClinicId: clinic.id }, txn);

  return {
    riskArea,
    screeningTool1,
    screeningTool2,
    clinic,
    user,
    patient1,
    patient2,
  };
}

describe('patient screening tool submission model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Question.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('creates and gets a patient screening tool submission with associations', async () => {
    const { screeningTool1, patient1, user, riskArea } = await setup(txn);
    const submission = await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );

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
    const patientAnswers = await PatientAnswer.createForScreeningTool(
      {
        patientId: patient1.id,
        patientScreeningToolSubmissionId: submission.id,
        questionIds: [question.id],
        answers: [
          {
            answerId: answer.id,
            questionId: question.id,
            answerValue: '1',
            patientId: patient1.id,
            applicable: true,
            userId: user.id,
          },
        ],
      },
      txn,
    );

    const finalSubmission = await PatientScreeningToolSubmission.submitScore(
      submission.id,
      {
        patientAnswers,
      },
      txn,
    );

    expect(finalSubmission.score).toEqual(1);
    expect(finalSubmission.patient.id).toEqual(patient1.id);
    expect(finalSubmission.user.id).toEqual(user.id);
    expect(await PatientScreeningToolSubmission.get(finalSubmission.id, txn)).toMatchObject(
      finalSubmission,
    );
  });

  it('creates a patient screening tool submission with the correct score', async () => {
    const { patient1, riskArea, screeningTool1, user } = await setup(txn);
    const initialSuggestions = await CarePlanSuggestion.getForPatient(patient1.id, txn);
    expect(initialSuggestions.length).toEqual(0);

    const concern = await Concern.create({ title: 'Screening Tool Concern' }, txn);
    const concern2 = await Concern.create({ title: 'Also a concern' }, txn);
    const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
      {
        title: 'Fix housing',
      },
      txn,
    );
    const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create(
      {
        title: 'Find food',
      },
      txn,
    );
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
    const submission = await PatientScreeningToolSubmission.autoOpenIfRequired(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );

    // expect it not to have a progress note yet
    expect(submission.progressNoteId).toBeNull();

    const patientAnswers = await PatientAnswer.createForScreeningTool(
      {
        patientId: patient1.id,
        patientScreeningToolSubmissionId: submission.id,
        questionIds: [question.id, question2.id],
        answers: [
          {
            answerId: answer.id,
            questionId: question.id,
            answerValue: '1',
            patientId: patient1.id,
            applicable: true,
            userId: user.id,
          },
          {
            answerId: answer2.id,
            questionId: question2.id,
            answerValue: '4',
            patientId: patient1.id,
            applicable: true,
            userId: user.id,
          },
        ],
      },
      txn,
    );

    expect(submission.score).toBeFalsy();
    expect(submission.patient.id).toEqual(patient1.id);
    expect(submission.user.id).toEqual(user.id);

    const screeningToolScoreRange = await ScreeningToolScoreRange.create(
      {
        description: 'Range',
        screeningToolId: screeningTool1.id,
        minimumScore: 0,
        maximumScore: 10,
      },
      txn,
    );
    await ConcernSuggestion.create(
      {
        concernId: concern.id,
        screeningToolScoreRangeId: screeningToolScoreRange.id,
      },
      txn,
    );
    await ConcernSuggestion.create(
      {
        concernId: concern2.id,
        answerId: answer.id,
      },
      txn,
    );
    await GoalSuggestion.create(
      {
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        screeningToolScoreRangeId: screeningToolScoreRange.id,
      },
      txn,
    );
    await GoalSuggestion.create(
      {
        goalSuggestionTemplateId: goalSuggestionTemplate2.id,
        answerId: answer2.id,
      },
      txn,
    );

    // score the submission
    expect(
      (await PatientScreeningToolSubmission.submitScore(
        submission.id,
        {
          patientAnswers: [patientAnswers[0], patientAnswers[1]],
        },
        txn,
      )).score,
    ).toEqual(5);

    // should now have a progress note
    const finalSubmission = await PatientScreeningToolSubmission.get(submission.id, txn);
    expect(finalSubmission.progressNoteId).not.toBeFalsy();

    const suggestions = await CarePlanSuggestion.getForPatient(patient1.id, txn);
    expect(suggestions.length).toEqual(4);
  });

  it('returns already open and not yet submitted submission', async () => {
    const { screeningTool1, patient1, user } = await setup(txn);
    const initialSubmission = await PatientScreeningToolSubmission.autoOpenIfRequired(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );
    const secondSubmission = await PatientScreeningToolSubmission.autoOpenIfRequired(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );
    expect(initialSubmission.id).toEqual(secondSubmission.id);
  });

  it('throws an error if a patient submission does not exist for a given id', async () => {
    const fakeId = uuid();
    await expect(PatientScreeningToolSubmission.get(fakeId, txn)).rejects.toMatch(
      `No such patient screening tool submission: ${fakeId}`,
    );
  });

  it('cannot edit a patient screening tool submission that has been scored', async () => {
    const { screeningTool1, patient1, user, riskArea } = await setup(txn);
    const submission = await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );

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
    const patientAnswers = await PatientAnswer.createForScreeningTool(
      {
        patientId: patient1.id,
        patientScreeningToolSubmissionId: submission.id,
        questionIds: [question.id],
        answers: [
          {
            answerId: answer.id,
            questionId: question.id,
            answerValue: '1',
            patientId: patient1.id,
            applicable: true,
            userId: user.id,
          },
        ],
      },
      txn,
    );

    const fetchedSubmission = await PatientScreeningToolSubmission.submitScore(
      submission.id,
      { patientAnswers },
      txn,
    );
    expect(fetchedSubmission.score).toEqual(1);

    await expect(
      PatientScreeningToolSubmission.submitScore(submission.id, { patientAnswers }, txn),
    ).rejects.toMatch('Screening tool has already been scored, create a new submission');
  });

  it('gets all screening tool submissions for a patient', async () => {
    const { screeningTool1, patient1, user, patient2, screeningTool2 } = await setup(txn);
    const submission1 = await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );
    const submission2 = await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool2.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );
    const submission3 = await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient2.id,
        userId: user.id,
      },
      txn,
    );

    const submissions = await PatientScreeningToolSubmission.getForPatient(patient1.id, txn);
    const submissionIds = submissions.map(submission => submission.id);
    expect(submissions.length).toEqual(2);
    expect(submissionIds).toContain(submission1.id);
    expect(submissionIds).toContain(submission2.id);
    expect(submissionIds).not.toContain(submission3.id);
  });

  it('gets all screening tool submissions for patient 360', async () => {
    const { screeningTool1, patient1, user, patient2, screeningTool2 } = await setup(txn);
    const submission1 = await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );
    const submission2 = await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool2.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );
    const submission3 = await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient2.id,
        userId: user.id,
      },
      txn,
    );

    const submissions = await PatientScreeningToolSubmission.getFor360(patient1.id, txn);
    const submissionIds = submissions.map(submission => submission.id);
    expect(submissions.length).toEqual(2);
    expect(submissionIds).toContain(submission1.id);
    expect(submissionIds).toContain(submission2.id);
    expect(submissionIds).not.toContain(submission3.id);
  });

  it('gets the latest screening tool submission for a patient and tool', async () => {
    const { screeningTool1, patient1, user, screeningTool2, riskArea } = await setup(txn);
    const firstSubmission = await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );
    const secondSubmission = await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );
    await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool2.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );

    // gets unscored submission
    const submission = await PatientScreeningToolSubmission.getLatestForPatientAndScreeningTool(
      screeningTool1.id,
      patient1.id,
      false,
      txn,
    );
    expect(submission!.id).toEqual(secondSubmission.id);

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
    const patientAnswers = await PatientAnswer.createForScreeningTool(
      {
        patientId: patient1.id,
        patientScreeningToolSubmissionId: firstSubmission.id,
        questionIds: [question.id],
        answers: [
          {
            answerId: answer.id,
            questionId: question.id,
            answerValue: '1',
            patientId: patient1.id,
            applicable: true,
            userId: user.id,
          },
        ],
      },
      txn,
    );

    // gets scored submission
    await PatientScreeningToolSubmission.submitScore(
      firstSubmission.id,
      {
        patientAnswers,
      },
      txn,
    );
    const secondSub = await PatientScreeningToolSubmission.getLatestForPatientAndScreeningTool(
      screeningTool1.id,
      patient1.id,
      true,
      txn,
    );
    expect(secondSub!.id).toEqual(firstSubmission.id);
  });

  it('returns null when there is no latest submission for a patient and tool', async () => {
    const { screeningTool1, patient1, user, screeningTool2 } = await setup(txn);
    await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );
    await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );

    const submission = await PatientScreeningToolSubmission.getLatestForPatientAndScreeningTool(
      screeningTool2.id,
      patient1.id,
      false,
      txn,
    );
    expect(submission).toBeFalsy();
  });

  it('gets all screening tool submissions for a patient for a screening tool', async () => {
    const { screeningTool1, patient1, user, screeningTool2 } = await setup(txn);
    const submission1 = await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );
    const submission2 = await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool2.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );
    const submission3 = await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );

    const submissions = await PatientScreeningToolSubmission.getForPatientAndScreeningTool(
      patient1.id,
      screeningTool1.id,
      txn,
    );
    const submissionIds = submissions.map(submission => submission.id);
    expect(submissions.length).toEqual(2);
    expect(submissionIds).toContain(submission3.id);
    expect(submissionIds).toContain(submission1.id);
    expect(submissionIds).not.toContain(submission2.id);
  });

  it('gets all patient screening tool submissions', async () => {
    const { screeningTool1, patient1, user, screeningTool2, patient2 } = await setup(txn);
    const submission1 = await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );
    const submission2 = await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool2.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );
    const submission3 = await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient2.id,
        userId: user.id,
      },
      txn,
    );

    const submissions = await PatientScreeningToolSubmission.getAll(txn);
    const submissionIds = submissions.map(submission => submission.id);
    expect(submissions.length).toEqual(3);
    expect(submissionIds).toContain(submission1.id);
    expect(submissionIds).toContain(submission2.id);
    expect(submissionIds).toContain(submission3.id);
  });

  it('deletes a patient screening tool submission', async () => {
    const { screeningTool1, patient1, user } = await setup(txn);
    const submission = await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );

    const fetchedSubmission = await PatientScreeningToolSubmission.get(submission.id, txn);
    expect(fetchedSubmission.deletedAt).toBeFalsy();

    await PatientScreeningToolSubmission.delete(submission.id, txn);

    await expect(PatientScreeningToolSubmission.get(submission.id, txn)).rejects.toMatch(
      `No such patient screening tool submission: ${submission.id}`,
    );
  });

  it('gets associated patient id for a screening tool submission', async () => {
    const { screeningTool1, patient1, user, riskArea } = await setup(txn);
    const submission = await PatientScreeningToolSubmission.create(
      {
        screeningToolId: screeningTool1.id,
        patientId: patient1.id,
        userId: user.id,
      },
      txn,
    );

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
    const patientAnswers = await PatientAnswer.createForScreeningTool(
      {
        patientId: patient1.id,
        patientScreeningToolSubmissionId: submission.id,
        questionIds: [question.id],
        answers: [
          {
            answerId: answer.id,
            questionId: question.id,
            answerValue: '1',
            patientId: patient1.id,
            applicable: true,
            userId: user.id,
          },
        ],
      },
      txn,
    );

    const finalSubmission = await PatientScreeningToolSubmission.submitScore(
      submission.id,
      {
        patientAnswers,
      },
      txn,
    );

    const fetchedPatientId = await PatientScreeningToolSubmission.getPatientIdForResource(
      finalSubmission.id,
      txn,
    );

    expect(fetchedPatientId).toBe(patient1.id);
  });
});
