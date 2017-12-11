import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
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

const userRole = 'physician';

describe('patient screening tool submission model', () => {
  let riskArea: RiskArea;
  let screeningTool1: ScreeningTool;
  let screeningTool2: ScreeningTool;
  let patient1: Patient;
  let patient2: Patient;
  let user: User;
  let clinic: Clinic;

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

    riskArea = await RiskArea.create({ title: 'Housing', order: 1 });
    screeningTool1 = await ScreeningTool.create({
      title: 'Screening Tool',
      riskAreaId: riskArea.id,
    });
    screeningTool2 = await ScreeningTool.create({
      title: 'Screening Tool 2',
      riskAreaId: riskArea.id,
    });
    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    patient1 = await createPatient(createMockPatient(123, clinic.id), user.id);
    patient2 = await createPatient(createMockPatient(45, clinic.id), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and gets a patient screening tool submission with associations', async () => {
    const submission = await PatientScreeningToolSubmission.create({
      screeningToolId: screeningTool1.id,
      patientId: patient1.id,
      userId: user.id,
    });

    const finalSubmission = await PatientScreeningToolSubmission.submitScore(submission.id, {
      score: 10,
    });

    expect(finalSubmission.score).toEqual(10);
    expect(finalSubmission.patient.id).toEqual(patient1.id);
    expect(finalSubmission.user.id).toEqual(user.id);
    expect(finalSubmission.riskArea.id).toEqual(riskArea.id);
    expect(await PatientScreeningToolSubmission.get(finalSubmission.id)).toMatchObject(
      finalSubmission,
    );
  });

  it('creates a patient screening tool submission with the correct score', async () => {
    const initialSuggestions = await CarePlanSuggestion.getForPatient(patient1.id);
    expect(initialSuggestions.length).toEqual(0);

    const concern = await Concern.create({ title: 'Screening Tool Concern' });
    const goalSuggestionTemplate = await GoalSuggestionTemplate.create({
      title: 'Fix housing',
    });
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

    const submission = await PatientScreeningToolSubmission.autoOpenIfRequired({
      screeningToolId: screeningTool1.id,
      patientId: patient1.id,
      userId: user.id,
    });

    const patientAnswers = await PatientAnswer.create({
      patientId: patient1.id,
      patientScreeningToolSubmissionId: submission.id,
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
    });

    expect(submission.score).toBeFalsy();
    expect(submission.patient.id).toEqual(patient1.id);
    expect(submission.user.id).toEqual(user.id);
    expect(submission.riskArea.id).toEqual(riskArea.id);

    const screeningToolScoreRange = await ScreeningToolScoreRange.create({
      description: 'Range',
      screeningToolId: screeningTool1.id,
      minimumScore: 0,
      maximumScore: 10,
    });
    await ConcernSuggestion.create({
      concernId: concern.id,
      screeningToolScoreRangeId: screeningToolScoreRange.id,
    });
    await GoalSuggestion.create({
      goalSuggestionTemplateId: goalSuggestionTemplate.id,
      screeningToolScoreRangeId: screeningToolScoreRange.id,
    });

    // score the submission
    expect(
      (await PatientScreeningToolSubmission.submitScore(submission.id, {
        patientAnswers: [patientAnswers[0], patientAnswers[1]],
      })).score,
    ).toEqual(5);

    const suggestions = await CarePlanSuggestion.getForPatient(patient1.id);
    expect(suggestions.length).toEqual(2);
  });

  it('returns already open and not yet submitted progress note', async () => {
    const initialSubmission = await PatientScreeningToolSubmission.autoOpenIfRequired({
      screeningToolId: screeningTool1.id,
      patientId: patient1.id,
      userId: user.id,
    });
    const secondSubmission = await PatientScreeningToolSubmission.autoOpenIfRequired({
      screeningToolId: screeningTool1.id,
      patientId: patient1.id,
      userId: user.id,
    });
    expect(initialSubmission.id).toEqual(secondSubmission.id);
  });

  it('throws an error if a patient submission does not exist for a given id', async () => {
    const fakeId = uuid();
    await expect(PatientScreeningToolSubmission.get(fakeId)).rejects.toMatch(
      `No such patient screening tool submission: ${fakeId}`,
    );
  });

  it('cannot edit a patient screening tool submission that has been scored', async () => {
    const submission = await PatientScreeningToolSubmission.create({
      screeningToolId: screeningTool1.id,
      patientId: patient1.id,
      userId: user.id,
    });

    const fetchedSubmission = await PatientScreeningToolSubmission.submitScore(submission.id, {
      score: 10,
    });
    expect(fetchedSubmission.score).toEqual(10);

    await expect(
      PatientScreeningToolSubmission.submitScore(submission.id, { score: 5 }),
    ).rejects.toMatch('Screening tool has already been scored, create a new submission');
  });

  it('gets all screening tool submissions for a patient', async () => {
    const submission1 = await PatientScreeningToolSubmission.create({
      screeningToolId: screeningTool1.id,
      patientId: patient1.id,
      userId: user.id,
    });
    const submission2 = await PatientScreeningToolSubmission.create({
      screeningToolId: screeningTool2.id,
      patientId: patient1.id,
      userId: user.id,
    });
    const submission3 = await PatientScreeningToolSubmission.create({
      screeningToolId: screeningTool1.id,
      patientId: patient2.id,
      userId: user.id,
    });

    const submissions = await PatientScreeningToolSubmission.getForPatient(patient1.id);
    const submissionIds = submissions.map(submission => submission.id);
    expect(submissions.length).toEqual(2);
    expect(submissions).toMatchObject([submission1, submission2]);
    expect(submissionIds).not.toContain(submission3.id);
  });

  it('gets the latest screening tool submission for a patient and tool', async () => {
    const firstSubmission = await PatientScreeningToolSubmission.create({
      screeningToolId: screeningTool1.id,
      patientId: patient1.id,
      userId: user.id,
    });
    const secondSubmission = await PatientScreeningToolSubmission.create({
      screeningToolId: screeningTool1.id,
      patientId: patient1.id,
      userId: user.id,
    });
    await PatientScreeningToolSubmission.create({
      screeningToolId: screeningTool2.id,
      patientId: patient1.id,
      userId: user.id,
    });

    // gets unscored submission
    const submission = await PatientScreeningToolSubmission.getLatestForPatientAndScreeningTool(
      screeningTool1.id,
      patient1.id,
      false,
    );
    expect(submission!.id).toEqual(secondSubmission.id);

    // gets scored submission
    await PatientScreeningToolSubmission.submitScore(firstSubmission.id, {
      score: 10,
    });
    const secondSub = await PatientScreeningToolSubmission.getLatestForPatientAndScreeningTool(
      screeningTool1.id,
      patient1.id,
      true,
    );
    expect(secondSub!.id).toEqual(firstSubmission.id);
  });

  it('returns null when there is no latest submission for a patient and tool', async () => {
    await PatientScreeningToolSubmission.create({
      screeningToolId: screeningTool1.id,
      patientId: patient1.id,
      userId: user.id,
    });
    await PatientScreeningToolSubmission.create({
      screeningToolId: screeningTool1.id,
      patientId: patient1.id,
      userId: user.id,
    });

    const submission = await PatientScreeningToolSubmission.getLatestForPatientAndScreeningTool(
      screeningTool2.id,
      patient1.id,
      false,
    );
    expect(submission).toBeFalsy();
  });

  it('gets all screening tool submissions for a patient for a screening tool', async () => {
    const submission1 = await PatientScreeningToolSubmission.create({
      screeningToolId: screeningTool1.id,
      patientId: patient1.id,
      userId: user.id,
    });
    const submission2 = await PatientScreeningToolSubmission.create({
      screeningToolId: screeningTool2.id,
      patientId: patient1.id,
      userId: user.id,
    });
    const submission3 = await PatientScreeningToolSubmission.create({
      screeningToolId: screeningTool1.id,
      patientId: patient1.id,
      userId: user.id,
    });

    const submissions = await PatientScreeningToolSubmission.getForPatient(
      patient1.id,
      screeningTool1.id,
    );
    const submissionIds = submissions.map(submission => submission.id);
    expect(submissions.length).toEqual(2);
    expect(submissions).toMatchObject([submission1, submission3]);
    expect(submissionIds).not.toContain(submission2.id);
  });

  it('gets all patient screening tool submissions', async () => {
    const submission1 = await PatientScreeningToolSubmission.create({
      screeningToolId: screeningTool1.id,
      patientId: patient1.id,
      userId: user.id,
    });
    const submission2 = await PatientScreeningToolSubmission.create({
      screeningToolId: screeningTool2.id,
      patientId: patient1.id,
      userId: user.id,
    });
    const submission3 = await PatientScreeningToolSubmission.create({
      screeningToolId: screeningTool1.id,
      patientId: patient2.id,
      userId: user.id,
    });

    const submissions = await PatientScreeningToolSubmission.getAll();
    expect(submissions.length).toEqual(3);
    expect(submissions).toMatchObject([submission1, submission2, submission3]);
  });

  it('deletes a patient screening tool submission', async () => {
    const submission = await PatientScreeningToolSubmission.create({
      screeningToolId: screeningTool1.id,
      patientId: patient1.id,
      userId: user.id,
    });

    const fetchedSubmission = await PatientScreeningToolSubmission.get(submission.id);
    expect(fetchedSubmission.deletedAt).toBeFalsy();

    await PatientScreeningToolSubmission.delete(submission.id);

    await expect(PatientScreeningToolSubmission.get(submission.id)).rejects.toMatch(
      `No such patient screening tool submission: ${submission.id}`,
    );
  });
});
