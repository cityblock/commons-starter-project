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
import PatientAnswer from '../patient-answer';
import PatientConcern from '../patient-concern';
import PatientScreeningToolSubmission from '../patient-screening-tool-submission';
import Question from '../question';
import RiskArea from '../risk-area';
import ScreeningTool from '../screening-tool';
import ScreeningToolScoreRange from '../screening-tool-score-range';
import User from '../user';

describe('concern suggestion model', () => {
  let answer: Answer;
  let question: Question;
  let riskArea: RiskArea;
  let clinic: Clinic;

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

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
          concernId: uuid(),
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
      clinic = await Clinic.create(createMockClinic());
      const user = await User.create(createMockUser(11, clinic.id, 'physician'));
      const concern1 = await Concern.create({ title: 'Housing' });
      const concern2 = await Concern.create({ title: 'Food' });
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

      const concern3 = await Concern.create({ title: 'Screening Tool Concern' });
      const screeningTool = await ScreeningTool.create({ title: 'Test', riskAreaId: riskArea.id });
      const screeningToolScoreRange = await ScreeningToolScoreRange.create({
        description: 'Range',
        screeningToolId: screeningTool.id,
        minimumScore: 0,
        maximumScore: 10,
      });
      await ConcernSuggestion.create({
        concernId: concern3.id,
        screeningToolScoreRangeId: screeningToolScoreRange.id,
      });
      await PatientScreeningToolSubmission.create({
        screeningToolId: screeningTool.id,
        patientId: patient.id,
        userId: user.id,
        score: 4,
        patientAnswers: [],
      });

      // Now it should suggest three concerns, including one based on a screening tool
      const thirdConcernSuggestions = await ConcernSuggestion.getNewForPatient(patient.id);
      expect(thirdConcernSuggestions[0]).toMatchObject(concern1);
      expect(thirdConcernSuggestions[1]).toMatchObject(concern2);
      expect(thirdConcernSuggestions[2]).toMatchObject(concern3);
      expect(thirdConcernSuggestions.length).toEqual(3);
    });

    it('does not return concern suggestions where one already exists', async () => {
      clinic = await Clinic.create(createMockClinic());
      const user = await User.create(createMockUser(11, clinic.id, 'physician'));
      const concern1 = await Concern.create({ title: 'Housing' });
      const concern2 = await Concern.create({ title: 'Food' });
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

      // Check to make sure it handles screening tool concern suggestions as well
      const concern3 = await Concern.create({ title: 'Housing' });
      const screeningTool = await ScreeningTool.create({ title: 'Test', riskAreaId: riskArea.id });
      const screeningToolScoreRange = await ScreeningToolScoreRange.create({
        description: 'Range',
        screeningToolId: screeningTool.id,
        minimumScore: 0,
        maximumScore: 10,
      });
      await ConcernSuggestion.create({
        concernId: concern3.id,
        screeningToolScoreRangeId: screeningToolScoreRange.id,
      });
      await PatientScreeningToolSubmission.create({
        screeningToolId: screeningTool.id,
        patientId: patient.id,
        userId: user.id,
        score: 4,
        patientAnswers: [],
      });

      const concernSuggestions2 = await ConcernSuggestion.getNewForPatient(patient.id);
      expect(concernSuggestions2.length).toEqual(2);
      expect(concernSuggestions2[0]).toMatchObject(concern2);
      expect(concernSuggestions2[1]).toMatchObject(concern3);

      await CarePlanSuggestion.create({
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern3.id,
      });

      const concernSuggestions3 = await ConcernSuggestion.getNewForPatient(patient.id);
      expect(concernSuggestions3.length).toEqual(1);
      expect(concernSuggestions3[0]).toMatchObject(concern2);
    });

    it('does not return suggestions for concerns that are already in the care plan', async () => {
      clinic = await Clinic.create(createMockClinic());
      const user = await User.create(createMockUser(11, clinic.id, 'physician'));
      const concern1 = await Concern.create({ title: 'Housing' });
      const concern2 = await Concern.create({ title: 'Food' });
      const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
      const question2 = await Question.create({
        title: 'hate writing tests?',
        answerType: 'dropdown',
        type: 'riskArea',
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

      await PatientConcern.create({
        order: 1,
        concernId: concern1.id,
        patientId: patient.id,
        userId: user.id,
      });

      const secondConcernSuggestions = await ConcernSuggestion.getNewForPatient(patient.id);
      expect(secondConcernSuggestions[0]).toMatchObject(concern2);
      expect(secondConcernSuggestions.length).toEqual(1);

      // It handles screening tool concern suggestions as well
      const concern3 = await Concern.create({ title: 'Screening Tool Concern' });
      const screeningTool = await ScreeningTool.create({ title: 'Test', riskAreaId: riskArea.id });
      const screeningToolScoreRange = await ScreeningToolScoreRange.create({
        description: 'Range',
        screeningToolId: screeningTool.id,
        minimumScore: 0,
        maximumScore: 10,
      });
      await ConcernSuggestion.create({
        concernId: concern3.id,
        screeningToolScoreRangeId: screeningToolScoreRange.id,
      });
      await PatientScreeningToolSubmission.create({
        screeningToolId: screeningTool.id,
        patientId: patient.id,
        userId: user.id,
        score: 4,
        patientAnswers: [],
      });

      // The new screening tool concern suggestion should be returned
      const thirdConcernSuggestions = await ConcernSuggestion.getNewForPatient(patient.id);
      expect(thirdConcernSuggestions[0]).toMatchObject(concern2);
      expect(thirdConcernSuggestions[1]).toMatchObject(concern3);
      expect(thirdConcernSuggestions.length).toEqual(2);

      await PatientConcern.create({
        order: 2,
        concernId: concern3.id,
        patientId: patient.id,
        userId: user.id,
      });

      // Now it should not be returned
      const fourthConcernSuggestions = await ConcernSuggestion.getNewForPatient(patient.id);
      expect(fourthConcernSuggestions[0]).toMatchObject(concern2);
      expect(fourthConcernSuggestions.length).toEqual(1);
    });

    it('gets new concern suggestions based on screening tool score ranges', async () => {
      clinic = await Clinic.create(createMockClinic());
      const user = await User.create(createMockUser(11, clinic.id, 'physician'));
      const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
      const concern = await Concern.create({ title: 'Housing' });
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
      await PatientScreeningToolSubmission.create({
        screeningToolId: screeningTool.id,
        patientId: patient.id,
        userId: user.id,
        score: 4,
        patientAnswers: [],
      });

      const concernSuggestions = await ConcernSuggestion.getNewForPatient(patient.id);
      expect(concernSuggestions[0]).toMatchObject(concern);
      expect(concernSuggestions.length).toEqual(1);
    });

    it('dedupes the same concern suggestion for an answer and score range', async () => {
      clinic = await Clinic.create(createMockClinic());
      const user = await User.create(createMockUser(11, clinic.id, 'physician'));

      const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
      const concern = await Concern.create({ title: 'Housing' });
      const screeningTool = await ScreeningTool.create({ title: 'Test', riskAreaId: riskArea.id });
      const screeningToolScoreRange = await ScreeningToolScoreRange.create({
        description: 'Range',
        screeningToolId: screeningTool.id,
        minimumScore: 0,
        maximumScore: 10,
      });
      const answer2 = await Answer.create({
        displayValue: 'hates writing tests!',
        value: '3',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: false,
        questionId: question.id,
        order: 1,
      });
      await ConcernSuggestion.create({
        concernId: concern.id,
        screeningToolScoreRangeId: screeningToolScoreRange.id,
      });
      await ConcernSuggestion.create({
        concernId: concern.id,
        answerId: answer2.id,
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
            answerId: answer2.id,
            answerValue: answer2.value,
            applicable: true,
            questionId: question.id,
            userId: user.id,
          },
        ],
      });

      const concernSuggestions = await ConcernSuggestion.getNewForPatient(patient.id);
      expect(concernSuggestions[0]).toMatchObject(concern);
      expect(concernSuggestions.length).toEqual(1);
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
