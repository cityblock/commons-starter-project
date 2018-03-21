import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
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
import Question from '../question';
import RiskArea from '../risk-area';
import RiskAreaAssessmentSubmission from '../risk-area-assessment-submission';
import User from '../user';

const userRole = 'physician';

interface ISetup {
  riskArea: RiskArea;
  patient: Patient;
  user: User;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const riskArea = await createRiskArea({ title: 'Housing' }, txn);
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  return { riskArea, clinic, user, patient };
}

describe('patient risk area assessment submission model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(Question.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and gets a patient risk area assessment submission with associations', async () => {
    const { riskArea, user, patient } = await setup(txn);
    const submission = await RiskAreaAssessmentSubmission.create(
      {
        riskAreaId: riskArea.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );

    const finalSubmission = await RiskAreaAssessmentSubmission.complete(submission.id, txn);

    expect(finalSubmission.completedAt).not.toBeFalsy();
    expect(finalSubmission.patient.id).toEqual(patient.id);
    expect(finalSubmission.user.id).toEqual(user.id);
    expect(finalSubmission.riskArea.id).toEqual(riskArea.id);
    expect(await RiskAreaAssessmentSubmission.get(finalSubmission.id, txn)).toMatchObject(
      finalSubmission,
    );
  });

  it('autoOpenIfRequired works for multiple risk area ids', async () => {
    const { riskArea, user, patient } = await setup(txn);

    await RiskAreaAssessmentSubmission.autoOpenIfRequired(
      {
        riskAreaId: riskArea.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    // call it a 2nd time
    const submission = await RiskAreaAssessmentSubmission.autoOpenIfRequired(
      {
        riskAreaId: riskArea.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const riskArea2 = await createRiskArea({ title: 'Food' }, txn);
    // call it a 2nd time
    await RiskAreaAssessmentSubmission.autoOpenIfRequired(
      {
        riskAreaId: riskArea2.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const submission2 = await RiskAreaAssessmentSubmission.autoOpenIfRequired(
      {
        riskAreaId: riskArea2.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );

    expect(submission.riskAreaId).toEqual(riskArea.id);
    expect(submission2.riskAreaId).toEqual(riskArea2.id);
  });

  it('creates a patient risk area assessment submission with the correct suggestions', async () => {
    const { riskArea, user, patient } = await setup(txn);

    const initialSuggestions = await CarePlanSuggestion.getForPatient(patient.id, txn);
    expect(initialSuggestions.length).toEqual(0);

    const concern = await Concern.create({ title: 'Screening Tool Concern' }, txn);
    const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
      {
        title: 'Fix housing',
      },
      txn,
    );
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

    const submission = await RiskAreaAssessmentSubmission.autoOpenIfRequired(
      {
        riskAreaId: riskArea.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );

    await PatientAnswer.create(
      {
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
      },
      txn,
    );

    expect(submission.completedAt).toBeFalsy();
    expect(submission.patient.id).toEqual(patient.id);
    expect(submission.user.id).toEqual(user.id);
    expect(submission.riskArea.id).toEqual(riskArea.id);

    await ConcernSuggestion.create(
      {
        concernId: concern.id,
        answerId: answer.id,
      },
      txn,
    );
    await GoalSuggestion.create(
      {
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        answerId: answer.id,
      },
      txn,
    );

    // score the submission
    const completedSubmission = await RiskAreaAssessmentSubmission.complete(submission.id, txn);
    expect(completedSubmission.carePlanSuggestions).toHaveLength(2);

    const suggestions = await CarePlanSuggestion.getForPatient(patient.id, txn);
    expect(suggestions).toHaveLength(2);
  });

  it('returns already open and not yet submitted progress note', async () => {
    const { riskArea, user, patient } = await setup(txn);

    const initialSubmission = await RiskAreaAssessmentSubmission.autoOpenIfRequired(
      {
        riskAreaId: riskArea.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const secondSubmission = await RiskAreaAssessmentSubmission.autoOpenIfRequired(
      {
        riskAreaId: riskArea.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    expect(initialSubmission.id).toEqual(secondSubmission.id);
  });

  it('throws an error if a patient submission does not exist for a given id', async () => {
    const fakeId = uuid();
    await expect(RiskAreaAssessmentSubmission.get(fakeId, txn)).rejects.toMatch(
      `No such risk area assessment submission: ${fakeId}`,
    );
  });

  it('cannot edit a patient risk area assessment submission that has been scored', async () => {
    const { riskArea, user, patient } = await setup(txn);
    const submission = await RiskAreaAssessmentSubmission.create(
      {
        riskAreaId: riskArea.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );

    const fetchedSubmission = await RiskAreaAssessmentSubmission.complete(submission.id, txn);
    expect(fetchedSubmission.completedAt).not.toBeFalsy();

    await expect(RiskAreaAssessmentSubmission.complete(submission.id, txn)).rejects.toMatch(
      'Risk area assessment has already been completed, create a new submission',
    );
  });

  it('gets the latest risk area assessment submission for a patient and tool', async () => {
    const { riskArea, user, patient } = await setup(txn);
    const firstSubmission = await RiskAreaAssessmentSubmission.create(
      {
        riskAreaId: riskArea.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const secondSubmission = await RiskAreaAssessmentSubmission.create(
      {
        riskAreaId: riskArea.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );

    // gets unscored submission
    const submission = await RiskAreaAssessmentSubmission.getLatestForPatient(
      riskArea.id,
      patient.id,
      false,
      txn,
    );
    expect([firstSubmission.id, secondSubmission.id]).toContain(submission!.id);

    // gets scored submission
    await RiskAreaAssessmentSubmission.complete(firstSubmission.id, txn);
    const secondSub = await RiskAreaAssessmentSubmission.getLatestForPatient(
      riskArea.id,
      patient.id,
      true,
      txn,
    );
    expect(secondSub!.id).toEqual(firstSubmission.id);
  });

  it('returns null when there is no latest submission for a patient and tool', async () => {
    const { riskArea, user, patient } = await setup(txn);
    const firstSubmission = await RiskAreaAssessmentSubmission.create(
      {
        riskAreaId: riskArea.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    await RiskAreaAssessmentSubmission.complete(firstSubmission.id, txn);

    const submission = await RiskAreaAssessmentSubmission.getLatestForPatient(
      riskArea.id,
      patient.id,
      false,
      txn,
    );
    expect(submission).toBeFalsy();
  });

  it('deletes a patient risk area assessment submission', async () => {
    const { riskArea, user, patient } = await setup(txn);
    const submission = await RiskAreaAssessmentSubmission.create(
      {
        riskAreaId: riskArea.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );

    const fetchedSubmission = await RiskAreaAssessmentSubmission.get(submission.id, txn);
    expect(fetchedSubmission.deletedAt).toBeFalsy();

    await RiskAreaAssessmentSubmission.delete(submission.id, txn);

    await expect(RiskAreaAssessmentSubmission.get(submission.id, txn)).rejects.toMatch(
      `No such risk area assessment submission: ${submission.id}`,
    );
  });

  it('fetches patient id associated with risk area assessment submission', async () => {
    const { riskArea, user, patient } = await setup(txn);
    const submission = await RiskAreaAssessmentSubmission.create(
      {
        riskAreaId: riskArea.id,
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );

    const finalSubmission = await RiskAreaAssessmentSubmission.complete(submission.id, txn);

    const fetchedPatientId = await RiskAreaAssessmentSubmission.getPatientIdForResource(
      finalSubmission.id,
      txn,
    );

    expect(fetchedPatientId).toBe(patient.id);
  });
});
