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
import GoalSuggestion from '../goal-suggestion';
import GoalSuggestionTemplate from '../goal-suggestion-template';
import PatientAnswer from '../patient-answer';
import PatientGoal from '../patient-goal';
import PatientScreeningToolSubmission from '../patient-screening-tool-submission';
import Question from '../question';
import RiskArea from '../risk-area';
import ScreeningTool from '../screening-tool';
import ScreeningToolScoreRange from '../screening-tool-score-range';
import User from '../user';

const userRole = 'physician';

describe('goal suggestion model', () => {
  let answer: Answer;
  let goalSuggestionTemplate: GoalSuggestionTemplate;
  let riskArea: RiskArea;
  let question: Question;
  let clinic: Clinic;

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());
    riskArea = await RiskArea.create({
      title: 'testing',
      order: 1,
    });
    question = await Question.create({
      title: 'like writing tests?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      type: 'riskArea',
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
          goalSuggestionTemplateId: uuid(),
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

      const goalAnswerResponse = await GoalSuggestion.delete({
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        answerId: answer.id,
      });
      expect(goalAnswerResponse).toMatchObject([]);
      expect(await GoalSuggestion.getForAnswer(answer.id)).toEqual([]);
    });

    it('returns goal suggestions for a patient', async () => {
      const user = await User.create(createMockUser(11, clinic.id, userRole));
      const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create({
        title: 'Fix Food',
      });
      const patient = await createPatient(createMockPatient(123, clinic.id), user.id);

      const question2 = await Question.create({
        title: 'hate writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        type: 'riskArea',
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
      expect(secondGoalSuggestions).toEqual(
        expect.arrayContaining([goalSuggestionTemplate, goalSuggestionTemplate2]),
      );
      expect(secondGoalSuggestions.length).toEqual(2);

      const screeningTool = await ScreeningTool.create({ title: 'Test', riskAreaId: riskArea.id });
      const screeningToolScoreRange = await ScreeningToolScoreRange.create({
        description: 'Range',
        screeningToolId: screeningTool.id,
        minimumScore: 0,
        maximumScore: 10,
      });
      const goalSuggestionTemplate3 = await GoalSuggestionTemplate.create({
        title: 'Fix Stuff',
      });
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate3.id,
        screeningToolScoreRangeId: screeningToolScoreRange.id,
      });
      await PatientScreeningToolSubmission.create({
        screeningToolId: screeningTool.id,
        patientId: patient.id,
        userId: user.id,
        score: 4,
        patientAnswers: [],
      });

      // Now it should suggest three goals, including one based on a screening tool
      const thirdGoalSuggestions = await GoalSuggestion.getNewForPatient(patient.id);
      expect(thirdGoalSuggestions).toEqual(
        expect.arrayContaining([
          goalSuggestionTemplate,
          goalSuggestionTemplate2,
          goalSuggestionTemplate3,
        ]),
      );
      expect(thirdGoalSuggestions.length).toEqual(3);
    });

    it('does not return goal suggestions where one already exists', async () => {
      const user = await User.create(createMockUser(11, clinic.id, userRole));
      const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create({
        title: 'Fix Food',
      });
      const patient = await createPatient(createMockPatient(123, clinic.id), user.id);

      const question2 = await Question.create({
        title: 'hate writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        type: 'riskArea',
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

      // Check to make sure it handles screening tool goal suggestions as well
      const goalSuggestionTemplate3 = await GoalSuggestionTemplate.create({ title: 'Third' });
      const screeningTool = await ScreeningTool.create({ title: 'Test', riskAreaId: riskArea.id });
      const screeningToolScoreRange = await ScreeningToolScoreRange.create({
        description: 'Range',
        screeningToolId: screeningTool.id,
        minimumScore: 0,
        maximumScore: 10,
      });
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate3.id,
        screeningToolScoreRangeId: screeningToolScoreRange.id,
      });
      await PatientScreeningToolSubmission.create({
        screeningToolId: screeningTool.id,
        patientId: patient.id,
        userId: user.id,
        score: 4,
        patientAnswers: [],
      });

      const goalSuggestions2 = await GoalSuggestion.getNewForPatient(patient.id);
      expect(goalSuggestions2.length).toEqual(2);
      expect(goalSuggestions2[0]).toMatchObject(goalSuggestionTemplate2);
      expect(goalSuggestions2[1]).toMatchObject(goalSuggestionTemplate3);

      await CarePlanSuggestion.create({
        patientId: patient.id,
        suggestionType: 'goal',
        goalSuggestionTemplateId: goalSuggestionTemplate3.id,
      });

      const goalSuggestions3 = await GoalSuggestion.getNewForPatient(patient.id);
      expect(goalSuggestions3.length).toEqual(1);
      expect(goalSuggestions3[0]).toMatchObject(goalSuggestionTemplate2);
    });

    it('does not return goal suggestions that already exist on the care plan', async () => {
      const user = await User.create(createMockUser(11, clinic.id, userRole));
      const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create({ title: 'Fix Food' });
      const patient = await createPatient(createMockPatient(123, clinic.id), user.id);

      const question2 = await Question.create({
        title: 'hate writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        type: 'riskArea',
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

      const secondGoalSuggestions = await GoalSuggestion.getNewForPatient(patient.id);
      expect(secondGoalSuggestions[0]).toMatchObject(goalSuggestionTemplate2);
      expect(secondGoalSuggestions.length).toEqual(1);

      // It handles screening tool goal suggestions as well
      const goalSuggestionTemplate3 = await GoalSuggestionTemplate.create({ title: 'Goal' });
      const screeningTool = await ScreeningTool.create({ title: 'Test', riskAreaId: riskArea.id });
      const screeningToolScoreRange = await ScreeningToolScoreRange.create({
        description: 'Range',
        screeningToolId: screeningTool.id,
        minimumScore: 0,
        maximumScore: 10,
      });
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate3.id,
        screeningToolScoreRangeId: screeningToolScoreRange.id,
      });
      await PatientScreeningToolSubmission.create({
        screeningToolId: screeningTool.id,
        patientId: patient.id,
        userId: user.id,
        score: 4,
        patientAnswers: [],
      });

      // The new screening tool goal suggesiton should be returned
      const thirdGoalSuggestions = await GoalSuggestion.getNewForPatient(patient.id);
      expect(thirdGoalSuggestions[0]).toMatchObject(goalSuggestionTemplate2);
      expect(thirdGoalSuggestions[1]).toMatchObject(goalSuggestionTemplate3);
      expect(thirdGoalSuggestions.length).toEqual(2);

      await PatientGoal.create({
        title: 'Patient Goal',
        patientId: patient.id,
        goalSuggestionTemplateId: goalSuggestionTemplate3.id,
        userId: user.id,
      });

      // Now it should not be returned
      const fourthGoalSuggestions = await GoalSuggestion.getNewForPatient(patient.id);
      expect(fourthGoalSuggestions[0]).toMatchObject(goalSuggestionTemplate2);
      expect(fourthGoalSuggestions.length).toEqual(1);
    });

    it('gets new goal suggestions based on screening tool score ranges', async () => {
      const user = await User.create(createMockUser(11, clinic.id, userRole));
      const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
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
      await PatientScreeningToolSubmission.create({
        screeningToolId: screeningTool.id,
        patientId: patient.id,
        userId: user.id,
        score: 4,
        patientAnswers: [],
      });

      const goalSuggestions = await GoalSuggestion.getNewForPatient(patient.id);
      expect(goalSuggestions[0]).toMatchObject(goalSuggestionTemplate);
      expect(goalSuggestions.length).toEqual(1);
    });

    it('dedupes the same goal suggestion for an answer and score range', async () => {
      const user = await User.create(createMockUser(11, clinic.id, userRole));
      const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
      const screeningTool = await ScreeningTool.create({ title: 'Test', riskAreaId: riskArea.id });
      const screeningToolScoreRange = await ScreeningToolScoreRange.create({
        description: 'Range',
        screeningToolId: screeningTool.id,
        minimumScore: 0,
        maximumScore: 10,
      });

      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        answerId: answer.id,
      });
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        screeningToolScoreRangeId: screeningToolScoreRange.id,
      });
      await PatientScreeningToolSubmission.create({
        screeningToolId: screeningTool.id,
        patientId: patient.id,
        userId: user.id,
        score: 4,
        patientAnswers: [],
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

      const goalSuggestions = await GoalSuggestion.getNewForPatient(patient.id);
      expect(goalSuggestions[0]).toMatchObject(goalSuggestionTemplate);
      expect(goalSuggestions.length).toEqual(1);
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
