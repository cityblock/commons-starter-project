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
import GoalSuggestion from '../goal-suggestion';
import GoalSuggestionTemplate from '../goal-suggestion-template';
import PatientAnswer from '../patient-answer';
import PatientConcern from '../patient-concern';
import PatientGoal from '../patient-goal';
import Question from '../question';
import RiskArea from '../risk-area';
import RiskAreaAssessmentSubmission from '../risk-area-assessment-submission';
import User from '../user';

const userRole = 'physician';

interface ISetup {
  answer: Answer;
  goalSuggestionTemplate: GoalSuggestionTemplate;
  riskArea: RiskArea;
  question: Question;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const riskArea = await createRiskArea({ title: 'testing' }, txn);
  const question = await Question.create(
    {
      title: 'like writing tests?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    },
    txn,
  );
  const answer = await Answer.create(
    {
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    },
    txn,
  );
  const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
    {
      title: 'Fix housing',
    },
    txn,
  );
  return { clinic, riskArea, question, answer, goalSuggestionTemplate };
}

describe('goal suggestion model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(GoalSuggestionTemplate.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('goal suggestion methods', () => {
    it('should associate multiple goal suggestions with an answer', async () => {
      const { goalSuggestionTemplate, answer } = await setup(txn);
      const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create(
        {
          title: 'fix Medical',
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
      await GoalSuggestion.create(
        {
          goalSuggestionTemplateId: goalSuggestionTemplate2.id,
          answerId: answer.id,
        },
        txn,
      );

      const goalSuggestionsForAnswer = await GoalSuggestion.getForAnswer(answer.id, txn);
      const answersForGoalSuggestion = await GoalSuggestion.getForGoalSuggestion(
        goalSuggestionTemplate.id,
        txn,
      );

      expect(answersForGoalSuggestion[0].id).toEqual(answer.id);
      const idArray = [goalSuggestionsForAnswer[0].id, goalSuggestionsForAnswer[1].id];
      expect(idArray).toContain(goalSuggestionTemplate2.id);
      expect(idArray).toContain(goalSuggestionTemplate.id);
    });

    it('throws an error if adding a non-existant goal suggestion to an answer', async () => {
      const { answer } = await setup(txn);

      const error =
        'insert into "goal_suggestion" ("answerId", "createdAt", "goalSuggestionTemplateId",' +
        ' "id") values ($1, $2, $3, $4) returning "id" - insert or update on table ' +
        '"goal_suggestion" violates foreign key constraint ' +
        '"goal_suggestion_goalsuggestiontemplateid_foreign"';

      await expect(
        GoalSuggestion.create(
          {
            goalSuggestionTemplateId: uuid(),
            answerId: answer.id,
          },
          txn,
        ),
      ).rejects.toMatchObject(new Error(error));
    });

    it('can remove an answer from a goal suggestion', async () => {
      const { goalSuggestionTemplate, answer } = await setup(txn);

      await GoalSuggestion.create(
        {
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          answerId: answer.id,
        },
        txn,
      );
      const goalSuggestionsForAnswer = await GoalSuggestion.getForAnswer(answer.id, txn);
      expect(goalSuggestionsForAnswer[0].id).toEqual(goalSuggestionTemplate.id);

      const goalAnswerResponse = await GoalSuggestion.delete(
        {
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          answerId: answer.id,
        },
        txn,
      );
      expect(goalAnswerResponse).toMatchObject([]);
      expect(await GoalSuggestion.getForAnswer(answer.id, txn)).toEqual([]);
    });

    it('returns correct goal suggestions for a patient with existing goals in MAP', async () => {
      const { goalSuggestionTemplate, answer, clinic, riskArea, question } = await setup(txn);

      const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
      const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create(
        {
          title: 'Fix Food',
        },
        txn,
      );
      const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
      const concern = await Concern.create({ title: 'Night King brought the Wall down' }, txn);
      const patientConcern = await PatientConcern.create(
        {
          concernId: concern.id,
          patientId: patient.id,
          userId: user.id,
        },
        txn,
      );

      // Creates a PatientGoal with no goal suggestion template
      // Important since currentPatientGoalTemplateIdsQuery looks at PatientGoals
      // Need to ensure that query handles goals with and without a goalSuggestionTempalteID
      await PatientGoal.create(
        {
          title: 'goal title',
          patientId: patient.id,
          userId: user.id,
          patientConcernId: patientConcern.id,
        },
        txn,
      );
      const question2 = await Question.create(
        {
          title: 'hate writing tests?',
          answerType: 'dropdown',
          riskAreaId: riskArea.id,
          type: 'riskArea',
          order: 1,
        },
        txn,
      );
      const answer2 = await Answer.create(
        {
          displayValue: 'hates writing tests!',
          value: '3',
          valueType: 'number',
          riskAdjustmentType: 'forceHighRisk',
          inSummary: false,
          questionId: question2.id,
          order: 1,
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
      await GoalSuggestion.create(
        {
          goalSuggestionTemplateId: goalSuggestionTemplate2.id,
          answerId: answer2.id,
        },
        txn,
      );
      const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create(
        {
          patientId: patient.id,
          userId: user.id,
          riskAreaId: riskArea.id,
        },
        txn,
      );
      await PatientAnswer.create(
        {
          patientId: patient.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [question.id],
          answers: [
            {
              patientId: patient.id,
              answerId: answer.id,
              answerValue: answer.value,
              applicable: true,
              questionId: question.id,
              userId: user.id,
            },
          ],
        },
        txn,
      );

      // At this point, only first goal should be suggested
      const goalSuggestions = await GoalSuggestion.getNewSuggestionsForRiskAreaAssessmentSubmission(
        patient.id,
        riskAreaAssessmentSubmission.id,
        txn,
      );
      expect(goalSuggestions[0]).toMatchObject(goalSuggestionTemplate);
      expect(goalSuggestions.length).toEqual(1);
      await PatientAnswer.create(
        {
          patientId: patient.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [question2.id],
          answers: [
            {
              patientId: patient.id,
              answerId: answer2.id,
              answerValue: answer2.value,
              applicable: true,
              questionId: question2.id,
              userId: user.id,
            },
          ],
        },
        txn,
      );

      // Now both goals should be suggested
      const secondGoalSuggestions = await GoalSuggestion.getNewSuggestionsForRiskAreaAssessmentSubmission(
        patient.id,
        riskAreaAssessmentSubmission.id,
        txn,
      );
      expect(secondGoalSuggestions).toEqual(
        expect.arrayContaining([goalSuggestionTemplate, goalSuggestionTemplate2]),
      );
      expect(secondGoalSuggestions.length).toEqual(2);
    });

    it('does not return goal suggestions where one already exists', async () => {
      const { goalSuggestionTemplate, answer, clinic, riskArea, question } = await setup(txn);

      const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
      const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create(
        {
          title: 'Fix Food',
        },
        txn,
      );
      const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

      const question2 = await Question.create(
        {
          title: 'hate writing tests?',
          answerType: 'dropdown',
          riskAreaId: riskArea.id,
          type: 'riskArea',
          order: 1,
        },
        txn,
      );
      const answer2 = await Answer.create(
        {
          displayValue: 'hates writing tests!',
          value: '3',
          valueType: 'number',
          riskAdjustmentType: 'forceHighRisk',
          inSummary: false,
          questionId: question2.id,
          order: 1,
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
      await GoalSuggestion.create(
        {
          goalSuggestionTemplateId: goalSuggestionTemplate2.id,
          answerId: answer2.id,
        },
        txn,
      );

      const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create(
        {
          patientId: patient.id,
          userId: user.id,
          riskAreaId: riskArea.id,
        },
        txn,
      );

      await PatientAnswer.create(
        {
          patientId: patient.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [question.id, question2.id],
          answers: [
            {
              patientId: patient.id,
              answerId: answer.id,
              answerValue: answer.value,
              applicable: true,
              questionId: question.id,
              userId: user.id,
            },
            {
              patientId: patient.id,
              answerId: answer2.id,
              answerValue: answer2.value,
              applicable: true,
              questionId: question2.id,
              userId: user.id,
            },
          ],
        },
        txn,
      );

      await CarePlanSuggestion.create(
        {
          patientId: patient.id,
          suggestionType: 'goal',
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          type: 'riskAreaAssessmentSubmission',
        },
        txn,
      );

      const goalSuggestions = await GoalSuggestion.getNewSuggestionsForRiskAreaAssessmentSubmission(
        patient.id,
        riskAreaAssessmentSubmission.id,
        txn,
      );
      expect(goalSuggestions.length).toEqual(1);
      expect(goalSuggestions[0]).toMatchObject(goalSuggestionTemplate2);
      expect(goalSuggestions.length).toEqual(1);
    });

    it('does not return goal suggestions that already exist on the care plan', async () => {
      const { goalSuggestionTemplate, answer, clinic, riskArea, question } = await setup(txn);

      const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
      const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create(
        { title: 'Fix Food' },
        txn,
      );
      const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

      const question2 = await Question.create(
        {
          title: 'hate writing tests?',
          answerType: 'dropdown',
          riskAreaId: riskArea.id,
          type: 'riskArea',
          order: 1,
        },
        txn,
      );
      const answer2 = await Answer.create(
        {
          displayValue: 'hates writing tests!',
          value: '3',
          valueType: 'number',
          riskAdjustmentType: 'forceHighRisk',
          inSummary: false,
          questionId: question2.id,
          order: 1,
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
      await GoalSuggestion.create(
        {
          goalSuggestionTemplateId: goalSuggestionTemplate2.id,
          answerId: answer2.id,
        },
        txn,
      );

      const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create(
        {
          patientId: patient.id,
          userId: user.id,
          riskAreaId: riskArea.id,
        },
        txn,
      );

      await PatientAnswer.create(
        {
          patientId: patient.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [question.id, question2.id],
          answers: [
            {
              patientId: patient.id,
              answerId: answer.id,
              answerValue: answer.value,
              applicable: true,
              questionId: question.id,
              userId: user.id,
            },
            {
              patientId: patient.id,
              answerId: answer2.id,
              answerValue: answer2.value,
              applicable: true,
              questionId: question2.id,
              userId: user.id,
            },
          ],
        },
        txn,
      );
      const concern = await Concern.create({ title: 'Night King brought the Wall down' }, txn);
      const patientConcern = await PatientConcern.create(
        {
          concernId: concern.id,
          patientId: patient.id,
          userId: user.id,
        },
        txn,
      );

      await PatientGoal.create(
        {
          title: 'Patient Goal',
          patientId: patient.id,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          userId: user.id,
          patientConcernId: patientConcern.id,
        },
        txn,
      );

      // accept the care plan suggestion
      await CarePlanSuggestion.create(
        {
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          patientId: patient.id,
          suggestionType: 'goal',
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
        },
        txn,
      );
      const secondGoalSuggestions = await GoalSuggestion.getNewSuggestionsForRiskAreaAssessmentSubmission(
        patient.id,
        riskAreaAssessmentSubmission.id,
        txn,
      );

      expect(secondGoalSuggestions[0]).toMatchObject(goalSuggestionTemplate2);
      expect(secondGoalSuggestions.length).toEqual(1);
    });
  });

  describe('utility methods', async () => {
    it('gets correct current goal suggestion templates', async () => {
      const { goalSuggestionTemplate, answer, clinic, riskArea, question } = await setup(txn);

      const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
      const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

      await GoalSuggestion.create(
        {
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          answerId: answer.id,
        },
        txn,
      );

      const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create(
        {
          patientId: patient.id,
          userId: user.id,
          riskAreaId: riskArea.id,
        },
        txn,
      );

      await PatientAnswer.create(
        {
          patientId: patient.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [question.id],
          answers: [
            {
              patientId: patient.id,
              answerId: answer.id,
              answerValue: answer.value,
              applicable: true,
              questionId: question.id,
              userId: user.id,
            },
          ],
        },
        txn,
      );

      const carePlanSuggestion = await CarePlanSuggestion.create(
        {
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          patientId: patient.id,
          suggestionType: 'goal',
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
        },
        txn,
      );

      // should be 1 item since we have created a goal suggestion
      expect(await GoalSuggestion.currentGoalSuggestionTemplateIdsQuery(patient.id, txn)).toEqual([
        { goalSuggestionTemplateId: goalSuggestionTemplate.id },
      ]);

      await CarePlanSuggestion.accept(carePlanSuggestion, user.id, txn);
      const concern = await Concern.create({ title: 'Night King brought the Wall down' }, txn);
      const patientConcern = await PatientConcern.create(
        {
          concernId: concern.id,
          patientId: patient.id,
          userId: user.id,
        },
        txn,
      );

      const patientGoal = await PatientGoal.create(
        {
          title: 'Patient Goal',
          patientId: patient.id,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          userId: user.id,
          patientConcernId: patientConcern.id,
        },
        txn,
      );

      // now should be 0 items after accepting care plan suggestion
      expect(await GoalSuggestion.currentGoalSuggestionTemplateIdsQuery(patient.id, txn)).toEqual(
        [],
      );
      // dismiss
      await PatientGoal.delete(patientGoal.id, user.id, txn);

      // suggest the goal again
      await CarePlanSuggestion.create(
        {
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          patientId: patient.id,
          suggestionType: 'goal',
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
        },
        txn,
      );
      // now should be 1 item again
      expect(await GoalSuggestion.currentGoalSuggestionTemplateIdsQuery(patient.id, txn)).toEqual([
        { goalSuggestionTemplateId: goalSuggestionTemplate.id },
      ]);
    });
  });
});
