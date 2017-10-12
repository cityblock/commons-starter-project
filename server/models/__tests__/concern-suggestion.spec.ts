import Db from '../../db';
import { createMockPatient, createPatient } from '../../spec-helpers';
import Answer from '../answer';
import CarePlanSuggestion from '../care-plan-suggestion';
import Concern from '../concern';
import ConcernSuggestion from '../concern-suggestion';
import PatientAnswer from '../patient-answer';
import PatientConcern from '../patient-concern';
import Question from '../question';
import RiskArea from '../risk-area';
import ScreeningTool from '../screening-tool';
import ScreeningToolScoreRange from '../screening-tool-score-range';
import User from '../user';

describe('concern suggestion model', () => {
  let db: Db;
  let answer: Answer;
  let question: Question;
  let riskArea: RiskArea;

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
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('concern suggestion methods', () => {
    it('should associate multiple answers with a concern', async () => {
      const answer2 = await Answer.create({
        displayValue: 'loves writing more tests!',
        value: '2',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: false,
        questionId: question.id,
        order: 2,
      });
      const concern = await Concern.create({ title: 'Housing' });

      await ConcernSuggestion.create({
        concernId: concern.id,
        answerId: answer.id,
      });
      await ConcernSuggestion.create({
        concernId: concern.id,
        answerId: answer2.id,
      });

      const concernsForAnswer = await ConcernSuggestion.getForAnswer(answer.id);
      const answersForConcern = await ConcernSuggestion.getForConcern(concern.id);

      expect(concernsForAnswer[0].id).toEqual(concern.id);
      expect(answersForConcern[0].id).toEqual(answer.id);
      expect(answersForConcern[1].id).toEqual(answer2.id);
    });

    it('throws an error if adding a non-existant concern to an answer', async () => {
      const error =
        'insert into "concern_suggestion" ("answerId", "concernId", "id") values ' +
        '($1, $2, $3) returning "id" - insert or update on table "concern_suggestion" ' +
        'violates foreign key constraint "concern_suggestion_concernid_foreign"';

      await expect(
        ConcernSuggestion.create({
          concernId: 'does-not-exist',
          answerId: answer.id,
        }),
      ).rejects.toMatchObject(new Error(error));
    });

    it('can remove an answer from a concern', async () => {
      const concern = await Concern.create({ title: 'Housing' });
      await ConcernSuggestion.create({
        concernId: concern.id,
        answerId: answer.id,
      });
      const concernsForAnswer = await ConcernSuggestion.getForAnswer(answer.id);
      expect(concernsForAnswer[0].id).toEqual(concern.id);

      const concernAnswerResponse = await ConcernSuggestion.delete({
        concernId: concern.id,
        answerId: answer.id,
      });
      expect(concernAnswerResponse).toMatchObject([]);
      expect(await ConcernSuggestion.getForAnswer(answer.id)).toEqual([]);
    });

    it('returns concern suggestions for a patient', async () => {
      const user = await User.create({
        email: 'care@care.com',
        userRole: 'physician',
        homeClinicId: '1',
      });
      const concern1 = await Concern.create({ title: 'Housing' });
      const concern2 = await Concern.create({ title: 'Food' });
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

      await ConcernSuggestion.create({
        concernId: concern1.id,
        answerId: answer.id,
      });
      await ConcernSuggestion.create({
        concernId: concern2.id,
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

      // At this point, only first concern should be suggested
      const concernSuggestions = await ConcernSuggestion.getNewForPatient(patient.id);
      expect(concernSuggestions[0]).toMatchObject(concern1);
      expect(concernSuggestions.length).toEqual(1);

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

      // Now both concerns should be suggested
      const secondConcernSuggestions = await ConcernSuggestion.getNewForPatient(patient.id);
      expect(secondConcernSuggestions[0]).toMatchObject(concern1);
      expect(secondConcernSuggestions[1]).toMatchObject(concern2);
      expect(secondConcernSuggestions.length).toEqual(2);
    });

    it('does not return concern suggestions where one already exists', async () => {
      const user = await User.create({
        email: 'care@care.com',
        userRole: 'physician',
        homeClinicId: '1',
      });
      const concern1 = await Concern.create({ title: 'Housing' });
      const concern2 = await Concern.create({ title: 'Food' });
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

      await ConcernSuggestion.create({
        concernId: concern1.id,
        answerId: answer.id,
      });
      await ConcernSuggestion.create({
        concernId: concern2.id,
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
        suggestionType: 'concern',
        concernId: concern1.id,
      });

      const concernSuggestions = await ConcernSuggestion.getNewForPatient(patient.id);
      expect(concernSuggestions.length).toEqual(1);
      expect(concernSuggestions[0]).toMatchObject(concern2);
    });

    it('does not return suggestions for concerns that are already in the care plan', async () => {
      const user = await User.create({
        email: 'care@care.com',
        userRole: 'physician',
        homeClinicId: '1',
      });
      const concern1 = await Concern.create({ title: 'Housing' });
      const concern2 = await Concern.create({ title: 'Food' });
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

      await ConcernSuggestion.create({
        concernId: concern1.id,
        answerId: answer.id,
      });
      await ConcernSuggestion.create({
        concernId: concern2.id,
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

      await PatientConcern.create({ order: 1, concernId: concern1.id, patientId: patient.id });

      const secondConcernSuggestions = await ConcernSuggestion.getNewForPatient(patient.id);
      expect(secondConcernSuggestions[0]).toMatchObject(concern2);
      expect(secondConcernSuggestions.length).toEqual(1);
    });

    it('gets concern suggestions for a screening tool score range', async () => {
      const concern = await Concern.create({ title: 'Housing' });
      const concern2 = await Concern.create({ title: 'Other' });
      const screeningTool = await ScreeningTool.create({ title: 'Test', riskAreaId: riskArea.id });
      const screeningToolScoreRange = await ScreeningToolScoreRange.create({
        description: 'Range',
        screeningToolId: screeningTool.id,
        minimumScore: 0,
        maximumScore: 10,
      });
      await ConcernSuggestion.create({
        concernId: concern.id,
        screeningToolScoreRangeId: screeningToolScoreRange.id,
      });
      await ConcernSuggestion.create({
        concernId: concern2.id,
        screeningToolScoreRangeId: screeningToolScoreRange.id,
      });
      const fetchedConcernSuggestions = await ConcernSuggestion.getForScreeningToolScoreRange(
        screeningToolScoreRange.id,
      );
      expect(fetchedConcernSuggestions.length).toEqual(2);
      expect(fetchedConcernSuggestions[0].id).toEqual(concern.id);
      expect(fetchedConcernSuggestions[1].id).toEqual(concern2.id);
    });
  });
});
