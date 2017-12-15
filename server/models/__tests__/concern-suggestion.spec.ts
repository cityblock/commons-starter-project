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
import PatientAnswer from '../patient-answer';
import PatientConcern from '../patient-concern';
import Question from '../question';
import RiskArea from '../risk-area';
import RiskAreaAssessmentSubmission from '../risk-area-assessment-submission';
import User from '../user';

describe('concern suggestion model', () => {
  let answer: Answer;
  let question: Question;
  let riskArea: RiskArea;
  let clinic: Clinic;

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

    riskArea = await createRiskArea('testing');
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
      const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create({
        patientId: patient.id,
        userId: user.id,
        riskAreaId: riskArea.id,
      });
      await PatientAnswer.create({
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
      });

      // At this point, only first concern should be suggested
      /* tslint:disable:max-line-length */
      const concernSuggestions = await ConcernSuggestion.getNewSuggestionsForRiskAreaAssessmentSubmission(
        patient.id,
        riskAreaAssessmentSubmission.id,
      );
      /* tslint:enable:max-line-length */
      expect(concernSuggestions[0]).toMatchObject(concern1);
      expect(concernSuggestions.length).toEqual(1);

      await PatientAnswer.create({
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
      });

      // Now both concerns should be suggested
      /* tslint:disable:max-line-length */
      const secondConcernSuggestions = await ConcernSuggestion.getNewSuggestionsForRiskAreaAssessmentSubmission(
        patient.id,
        riskAreaAssessmentSubmission.id,
      );
      /* tslint:enable:max-line-length */

      expect(secondConcernSuggestions[0]).toMatchObject(concern1);
      expect(secondConcernSuggestions[1]).toMatchObject(concern2);
      expect(secondConcernSuggestions.length).toEqual(2);
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
      const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create({
        patientId: patient.id,
        userId: user.id,
        riskAreaId: riskArea.id,
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
      });

      await CarePlanSuggestion.create({
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern1.id,
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
      });

      /* tslint:disable:max-line-length */
      const concernSuggestions = await ConcernSuggestion.getNewSuggestionsForRiskAreaAssessmentSubmission(
        patient.id,
        riskAreaAssessmentSubmission.id,
      );
      /* tslint:enable:max-line-length */

      expect(concernSuggestions.length).toEqual(1);
      expect(concernSuggestions[0]).toMatchObject(concern2);
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
      const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create({
        patientId: patient.id,
        userId: user.id,
        riskAreaId: riskArea.id,
      });

      await PatientAnswer.create({
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
      });

      await PatientConcern.create({
        order: 1,
        concernId: concern1.id,
        patientId: patient.id,
        userId: user.id,
      });

      /* tslint:disable:max-line-length */
      const secondConcernSuggestions = await ConcernSuggestion.getNewSuggestionsForRiskAreaAssessmentSubmission(
        patient.id,
        riskAreaAssessmentSubmission.id,
      );
      /* tslint:enable:max-line-length */
      expect(secondConcernSuggestions[0]).toMatchObject(concern2);
      expect(secondConcernSuggestions.length).toEqual(1);

      await PatientConcern.create({
        order: 2,
        concernId: concern2.id,
        patientId: patient.id,
        userId: user.id,
      });

      // Now it should not be returned
      /* tslint:disable:max-line-length */
      const fourthConcernSuggestions = await ConcernSuggestion.getNewSuggestionsForRiskAreaAssessmentSubmission(
        patient.id,
        riskAreaAssessmentSubmission.id,
      );
      /* tslint:enable:max-line-length */
      expect(fourthConcernSuggestions.length).toEqual(0);
    });
  });
});
