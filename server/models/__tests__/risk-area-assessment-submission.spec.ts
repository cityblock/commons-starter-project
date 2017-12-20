import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  createMockClinic,
  createMockPatient,
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
import Question from '../question';
import RiskArea from '../risk-area';
import RiskAreaAssessmentSubmission from '../risk-area-assessment-submission';
import User from '../user';

const userRole = 'physician';

describe('patient risk area assessment submission model', () => {
  let riskArea: RiskArea;
  let patient: Patient;
  let user: User;
  let clinic: Clinic;

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

    riskArea = await createRiskArea({ title: 'Housing' });
    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and gets a patient risk area assessment submission with associations', async () => {
    const submission = await RiskAreaAssessmentSubmission.create({
      riskAreaId: riskArea.id,
      patientId: patient.id,
      userId: user.id,
    });

    const finalSubmission = await RiskAreaAssessmentSubmission.complete(submission.id);

    expect(finalSubmission.completedAt).not.toBeFalsy();
    expect(finalSubmission.patient.id).toEqual(patient.id);
    expect(finalSubmission.user.id).toEqual(user.id);
    expect(finalSubmission.riskArea.id).toEqual(riskArea.id);
    expect(await RiskAreaAssessmentSubmission.get(finalSubmission.id)).toMatchObject(
      finalSubmission,
    );
  });

  it('creates a patient risk area assessment submission with the correct suggestions', async () => {
    const initialSuggestions = await CarePlanSuggestion.getForPatient(patient.id);
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

    const submission = await RiskAreaAssessmentSubmission.autoOpenIfRequired({
      riskAreaId: riskArea.id,
      patientId: patient.id,
      userId: user.id,
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

    expect(submission.completedAt).toBeFalsy();
    expect(submission.patient.id).toEqual(patient.id);
    expect(submission.user.id).toEqual(user.id);
    expect(submission.riskArea.id).toEqual(riskArea.id);

    await ConcernSuggestion.create({
      concernId: concern.id,
      answerId: answer.id,
    });
    await GoalSuggestion.create({
      goalSuggestionTemplateId: goalSuggestionTemplate.id,
      answerId: answer.id,
    });

    // score the submission
    const completedSubmission = await RiskAreaAssessmentSubmission.complete(submission.id);
    expect(completedSubmission.carePlanSuggestions).toHaveLength(2);

    const suggestions = await CarePlanSuggestion.getForPatient(patient.id);
    expect(suggestions).toHaveLength(2);
  });

  it('returns already open and not yet submitted progress note', async () => {
    const initialSubmission = await RiskAreaAssessmentSubmission.autoOpenIfRequired({
      riskAreaId: riskArea.id,
      patientId: patient.id,
      userId: user.id,
    });
    const secondSubmission = await RiskAreaAssessmentSubmission.autoOpenIfRequired({
      riskAreaId: riskArea.id,
      patientId: patient.id,
      userId: user.id,
    });
    expect(initialSubmission.id).toEqual(secondSubmission.id);
  });

  it('throws an error if a patient submission does not exist for a given id', async () => {
    const fakeId = uuid();
    await expect(RiskAreaAssessmentSubmission.get(fakeId)).rejects.toMatch(
      `No such risk area assessment submission: ${fakeId}`,
    );
  });

  it('cannot edit a patient risk area assessment submission that has been scored', async () => {
    const submission = await RiskAreaAssessmentSubmission.create({
      riskAreaId: riskArea.id,
      patientId: patient.id,
      userId: user.id,
    });

    const fetchedSubmission = await RiskAreaAssessmentSubmission.complete(submission.id);
    expect(fetchedSubmission.completedAt).not.toBeFalsy();

    await expect(RiskAreaAssessmentSubmission.complete(submission.id)).rejects.toMatch(
      'Risk area assessment has already been completed, create a new submission',
    );
  });

  it('gets the latest risk area assessment submission for a patient and tool', async () => {
    const firstSubmission = await RiskAreaAssessmentSubmission.create({
      riskAreaId: riskArea.id,
      patientId: patient.id,
      userId: user.id,
    });
    const secondSubmission = await RiskAreaAssessmentSubmission.create({
      riskAreaId: riskArea.id,
      patientId: patient.id,
      userId: user.id,
    });

    // gets unscored submission
    const submission = await RiskAreaAssessmentSubmission.getLatestForPatient(
      riskArea.id,
      patient.id,
      false,
    );
    expect(submission!.id).toEqual(secondSubmission.id);

    // gets scored submission
    await RiskAreaAssessmentSubmission.complete(firstSubmission.id);
    const secondSub = await RiskAreaAssessmentSubmission.getLatestForPatient(
      riskArea.id,
      patient.id,
      true,
    );
    expect(secondSub!.id).toEqual(firstSubmission.id);
  });

  it('returns null when there is no latest submission for a patient and tool', async () => {
    const firstSubmission = await RiskAreaAssessmentSubmission.create({
      riskAreaId: riskArea.id,
      patientId: patient.id,
      userId: user.id,
    });
    await RiskAreaAssessmentSubmission.complete(firstSubmission.id);

    const submission = await RiskAreaAssessmentSubmission.getLatestForPatient(
      riskArea.id,
      patient.id,
      false,
    );
    expect(submission).toBeFalsy();
  });

  it('deletes a patient risk area assessment submission', async () => {
    const submission = await RiskAreaAssessmentSubmission.create({
      riskAreaId: riskArea.id,
      patientId: patient.id,
      userId: user.id,
    });

    const fetchedSubmission = await RiskAreaAssessmentSubmission.get(submission.id);
    expect(fetchedSubmission.deletedAt).toBeFalsy();

    await RiskAreaAssessmentSubmission.delete(submission.id);

    await expect(RiskAreaAssessmentSubmission.get(submission.id)).rejects.toMatch(
      `No such risk area assessment submission: ${submission.id}`,
    );
  });
});
