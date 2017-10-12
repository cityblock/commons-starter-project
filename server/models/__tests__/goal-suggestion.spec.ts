import Db from '../../db';
import { createMockPatient, createPatient } from '../../spec-helpers';
import Answer from '../answer';
import CarePlanSuggestion from '../care-plan-suggestion';
import GoalSuggestion from '../goal-suggestion';
import GoalSuggestionTemplate from '../goal-suggestion-template';
import PatientAnswer from '../patient-answer';
import PatientGoal from '../patient-goal';
import Question from '../question';
import RiskArea from '../risk-area';
import ScreeningTool from '../screening-tool';
import ScreeningToolScoreRange from '../screening-tool-score-range';
import User from '../user';

describe('goal suggestion model', () => {
  let db: Db;
  let answer: Answer;
  let goalSuggestionTemplate: GoalSuggestionTemplate;
  let riskArea: RiskArea;
  let question: Question;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

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
    answer = await Answer.create({
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    });
    goalSuggestionTemplate = await GoalSuggestionTemplate.create({
      title: 'Fix housing',
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('goal suggestion methods', () => {
    it('should associate multiple goal suggestions with an answer', async () => {
      const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create({
        title: 'fix Medical',
      });

      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        answerId: answer.id,
      });
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate2.id,
        answerId: answer.id,
      });

      const goalSuggestionsForAnswer = await GoalSuggestion.getForAnswer(answer.id);
      const answersForGoalSuggestion = await GoalSuggestion.getForGoalSuggestion(
        goalSuggestionTemplate.id,
      );

      expect(answersForGoalSuggestion[0].id).toEqual(answer.id);
      expect(goalSuggestionsForAnswer[0].id).toEqual(goalSuggestionTemplate.id);
      expect(goalSuggestionsForAnswer[1].id).toEqual(goalSuggestionTemplate2.id);
    });

    it('throws an error if adding a non-existant goal suggestion to an answer', async () => {
      const error =
        'insert into "goal_suggestion" ("answerId", "goalSuggestionTemplateId",' +
        ' "id") values ($1, $2, $3) returning "id" - insert or update on table ' +
        '"goal_suggestion" violates foreign key constraint ' +
        '"goal_suggestion_goalsuggestiontemplateid_foreign"';

      await expect(
        GoalSuggestion.create({
          goalSuggestionTemplateId: 'does-not-exist',
          answerId: answer.id,
        }),
      ).rejects.toMatchObject(new Error(error));
    });

    it('can remove an answer from a goal suggestion', async () => {
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        answerId: answer.id,
      });
      const goalSuggestionsForAnswer = await GoalSuggestion.getForAnswer(answer.id);
      expect(goalSuggestionsForAnswer[0].id).toEqual(goalSuggestionTemplate.id);

      const concernAnswerResponse = await GoalSuggestion.delete({
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        answerId: answer.id,
      });
      expect(concernAnswerResponse).toMatchObject([]);
      expect(await GoalSuggestion.getForAnswer(answer.id)).toEqual([]);
    });

    it('returns goal suggestions for a patient', async () => {
      const user = await User.create({
        email: 'care@care.com',
        userRole: 'physician',
        homeClinicId: '1',
      });
      const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create({
        title: 'Fix Food',
      });
      const patient = await createPatient(createMockPatient(123), user.id);

      const question2 = await Question.create({
        title: 'hate writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        order: 1,
      });
      const answer2 = await Answer.create({
        displayValue: 'hates writing tests!',
        value: '3',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: false,
        questionId: question2.id,
        order: 1,
      });
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        answerId: answer.id,
      });
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate2.id,
        answerId: answer2.id,
      });

      await PatientAnswer.create({
        patientId: patient.id,
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
      });

      // At this point, only first goal should be suggested
      const goalSuggestions = await GoalSuggestion.getNewForPatient(patient.id);
      expect(goalSuggestions[0]).toMatchObject(goalSuggestionTemplate);
      expect(goalSuggestions.length).toEqual(1);

      await PatientAnswer.create({
        patientId: patient.id,
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
      });

      // Now both goals should be suggested
      const secondGoalSuggestions = await GoalSuggestion.getNewForPatient(patient.id);
      expect(secondGoalSuggestions[0]).toMatchObject(goalSuggestionTemplate);
      expect(secondGoalSuggestions[1]).toMatchObject(goalSuggestionTemplate2);
      expect(secondGoalSuggestions.length).toEqual(2);
    });

    it('does not return goal suggestions where one already exists', async () => {
      const user = await User.create({
        email: 'care@care.com',
        userRole: 'physician',
        homeClinicId: '1',
      });
      const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create({
        title: 'Fix Food',
      });
      const patient = await createPatient(createMockPatient(123), user.id);

      const question2 = await Question.create({
        title: 'hate writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        order: 1,
      });
      const answer2 = await Answer.create({
        displayValue: 'hates writing tests!',
        value: '3',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: false,
        questionId: question2.id,
        order: 1,
      });
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        answerId: answer.id,
      });
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate2.id,
        answerId: answer2.id,
      });

      await PatientAnswer.create({
        patientId: patient.id,
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
      });

      await CarePlanSuggestion.create({
        patientId: patient.id,
        suggestionType: 'goal',
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
      });

      const goalSuggestions = await GoalSuggestion.getNewForPatient(patient.id);
      expect(goalSuggestions.length).toEqual(1);
      expect(goalSuggestions[0]).toMatchObject(goalSuggestionTemplate2);
      expect(goalSuggestions.length).toEqual(1);
    });

    it('does not return goal suggestions that already exist on the care plan', async () => {
      const user = await User.create({
        email: 'care@care.com',
        userRole: 'physician',
        homeClinicId: '1',
      });
      const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create({ title: 'Fix Food' });
      const patient = await createPatient(createMockPatient(123), user.id);

      const question2 = await Question.create({
        title: 'hate writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        order: 1,
      });
      const answer2 = await Answer.create({
        displayValue: 'hates writing tests!',
        value: '3',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: false,
        questionId: question2.id,
        order: 1,
      });
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        answerId: answer.id,
      });
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate2.id,
        answerId: answer2.id,
      });

      await PatientAnswer.create({
        patientId: patient.id,
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
      });

      await PatientGoal.create({
        title: 'Patient Goal',
        patientId: patient.id,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        userId: user.id,
      });

      // Now both goals should be suggested
      const secondGoalSuggestions = await GoalSuggestion.getNewForPatient(patient.id);
      expect(secondGoalSuggestions[0]).toMatchObject(goalSuggestionTemplate2);
      expect(secondGoalSuggestions.length).toEqual(1);
    });

    it('gets goal suggestions for a screening tool score range', async () => {
      const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create({ title: 'Fix Food' });
      const screeningTool = await ScreeningTool.create({ title: 'Test', riskAreaId: riskArea.id });
      const screeningToolScoreRange = await ScreeningToolScoreRange.create({
        description: 'Range',
        screeningToolId: screeningTool.id,
        minimumScore: 0,
        maximumScore: 10,
      });
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        screeningToolScoreRangeId: screeningToolScoreRange.id,
      });
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate2.id,
        screeningToolScoreRangeId: screeningToolScoreRange.id,
      });
      const fetchedGoalSuggestions = await GoalSuggestion.getForScreeningToolScoreRange(
        screeningToolScoreRange.id,
      );
      expect(fetchedGoalSuggestions.length).toEqual(2);
      expect(fetchedGoalSuggestions[0].id).toEqual(goalSuggestionTemplate.id);
      expect(fetchedGoalSuggestions[1].id).toEqual(goalSuggestionTemplate2.id);
    });
  });
});
