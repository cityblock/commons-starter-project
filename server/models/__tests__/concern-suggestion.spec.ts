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
import PatientAnswer from '../patient-answer';
import PatientConcern from '../patient-concern';
import Question from '../question';
import RiskArea from '../risk-area';
import RiskAreaAssessmentSubmission from '../risk-area-assessment-submission';
import User from '../user';

interface ISetup {
  answer: Answer;
  question: Question;
  riskArea: RiskArea;
}

async function setup(txn: Transaction): Promise<ISetup> {
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
  return { riskArea, question, answer };
}

describe('concern suggestion model', () => {
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

  describe('concern suggestion methods', () => {
    it('should associate multiple answers with a concern', async () => {
      const { question, answer } = await setup(txn);
      const answer2 = await Answer.create(
        {
          displayValue: 'loves writing more tests!',
          value: '2',
          valueType: 'number',
          riskAdjustmentType: 'forceHighRisk',
          inSummary: false,
          questionId: question.id,
          order: 2,
        },
        txn,
      );
      const concern = await Concern.create({ title: 'Housing' }, txn);

      await ConcernSuggestion.create(
        {
          concernId: concern.id,
          answerId: answer.id,
        },
        txn,
      );
      await ConcernSuggestion.create(
        {
          concernId: concern.id,
          answerId: answer2.id,
        },
        txn,
      );

      const concernsForAnswer = await ConcernSuggestion.getForAnswer(answer.id, txn);
      const answersIdsForConcern = (await ConcernSuggestion.getForConcern(concern.id, txn)).map(
        a => a.id,
      );

      expect(concernsForAnswer[0].id).toEqual(concern.id);

      expect(answersIdsForConcern).toContain(answer.id);
      expect(answersIdsForConcern).toContain(answer2.id);
    });

    it('throws an error if adding a non-existant concern to an answer', async () => {
      const { answer } = await setup(txn);
      const error =
        'insert into "concern_suggestion" ("answerId", "concernId", "createdAt", "id") values ' +
        '($1, $2, $3, $4) returning "id" - insert or update on table "concern_suggestion" ' +
        'violates foreign key constraint "concern_suggestion_concernid_foreign"';

      await expect(
        ConcernSuggestion.create(
          {
            concernId: uuid(),
            answerId: answer.id,
          },
          txn,
        ),
      ).rejects.toMatchObject(new Error(error));
    });

    it('can remove an answer from a concern', async () => {
      const { answer } = await setup(txn);
      const concern = await Concern.create({ title: 'Housing' }, txn);
      await ConcernSuggestion.create(
        {
          concernId: concern.id,
          answerId: answer.id,
        },
        txn,
      );
      const concernsForAnswer = await ConcernSuggestion.getForAnswer(answer.id, txn);
      expect(concernsForAnswer[0].id).toEqual(concern.id);

      const concernAnswerResponse = await ConcernSuggestion.delete(
        {
          concernId: concern.id,
          answerId: answer.id,
        },
        txn,
      );
      expect(concernAnswerResponse).toMatchObject([]);
      expect(await ConcernSuggestion.getForAnswer(answer.id, txn)).toEqual([]);
    });

    it('returns concern suggestions for a patient', async () => {
      const { question, answer, riskArea } = await setup(txn);
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user = await User.create(createMockUser(11, clinic.id, 'physician'), txn);
      const concern1 = await Concern.create({ title: 'Housing' }, txn);
      const concern2 = await Concern.create({ title: 'Food' }, txn);
      const concern3 = await Concern.create({ title: 'Medical' }, txn);
      const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

      // Add a concern to the patient MAP
      await PatientConcern.create(
        { concernId: concern3.id, patientId: patient.id, userId: user.id },
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

      await ConcernSuggestion.create(
        {
          concernId: concern1.id,
          answerId: answer.id,
        },
        txn,
      );
      await ConcernSuggestion.create(
        {
          concernId: concern2.id,
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

      // At this point, only first concern should be suggested

      const concernSuggestions = await ConcernSuggestion.getNewSuggestionsForRiskAreaAssessmentSubmission(
        patient.id,
        riskAreaAssessmentSubmission.id,
        txn,
      );

      expect(concernSuggestions[0].id).toEqual(concern1.id);
      expect(concernSuggestions.length).toEqual(1);

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

      // Now both concerns should be suggested
      const secondConcernSuggestionIds = (await ConcernSuggestion.getNewSuggestionsForRiskAreaAssessmentSubmission(
        patient.id,
        riskAreaAssessmentSubmission.id,
        txn,
      )).map(suggestion => suggestion.id);

      expect(secondConcernSuggestionIds).toContain(concern1.id);
      expect(secondConcernSuggestionIds).toContain(concern2.id);
      expect(secondConcernSuggestionIds).toHaveLength(2);

      const patientConcerns = await PatientConcern.getForPatient(patient.id, txn);

      // PatientConcerns should be both the concern we created at the start + administrative tasks
      expect(patientConcerns).toHaveLength(2);
    });

    it('does not return concern suggestions where one already exists', async () => {
      const { question, answer, riskArea } = await setup(txn);
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user = await User.create(createMockUser(11, clinic.id, 'physician'), txn);
      const concern1 = await Concern.create({ title: 'Housing' }, txn);
      const concern2 = await Concern.create({ title: 'Food' }, txn);
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
      const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create(
        {
          patientId: patient.id,
          userId: user.id,
          riskAreaId: riskArea.id,
        },
        txn,
      );

      await ConcernSuggestion.create(
        {
          concernId: concern1.id,
          answerId: answer.id,
        },
        txn,
      );
      await ConcernSuggestion.create(
        {
          concernId: concern2.id,
          answerId: answer2.id,
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
          suggestionType: 'concern',
          concernId: concern1.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        },
        txn,
      );

      const concernSuggestions = await ConcernSuggestion.getNewSuggestionsForRiskAreaAssessmentSubmission(
        patient.id,
        riskAreaAssessmentSubmission.id,
        txn,
      );

      expect(concernSuggestions.length).toEqual(1);
      expect(concernSuggestions[0].id).toEqual(concern2.id);
    });

    it('does not return suggestions for concerns that are already in the care plan', async () => {
      const { question, answer, riskArea } = await setup(txn);
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user = await User.create(createMockUser(11, clinic.id, 'physician'), txn);
      const concern1 = await Concern.create({ title: 'Housing' }, txn);
      const concern2 = await Concern.create({ title: 'Food' }, txn);
      const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
      const question2 = await Question.create(
        {
          title: 'hate writing tests?',
          answerType: 'dropdown',
          type: 'riskArea',
          riskAreaId: riskArea.id,
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

      await ConcernSuggestion.create(
        {
          concernId: concern1.id,
          answerId: answer.id,
        },
        txn,
      );
      await ConcernSuggestion.create(
        {
          concernId: concern2.id,
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

      await PatientConcern.create(
        {
          order: 1,
          concernId: concern1.id,
          patientId: patient.id,
          userId: user.id,
        },
        txn,
      );
      // accept the care plan suggestion
      await CarePlanSuggestion.create(
        {
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          patientId: patient.id,
          suggestionType: 'concern',
          concernId: concern1.id,
        },
        txn,
      );

      const secondConcernSuggestions = await ConcernSuggestion.getNewSuggestionsForRiskAreaAssessmentSubmission(
        patient.id,
        riskAreaAssessmentSubmission.id,
        txn,
      );

      expect(secondConcernSuggestions[0].id).toEqual(concern2.id);
      expect(secondConcernSuggestions.length).toEqual(1);

      // added, but without a corresponding suggestion accepted
      await PatientConcern.create(
        {
          order: 2,
          concernId: concern2.id,
          patientId: patient.id,
          userId: user.id,
        },
        txn,
      );

      // Now it should not be returned
      const fourthConcernSuggestions = await ConcernSuggestion.getNewSuggestionsForRiskAreaAssessmentSubmission(
        patient.id,
        riskAreaAssessmentSubmission.id,
        txn,
      );

      expect(fourthConcernSuggestions.length).toEqual(0);

      const patientConcerns = await PatientConcern.getForPatient(patient.id, txn);
      expect(patientConcerns).toHaveLength(3);
    });
  });
  describe('utility methods', async () => {
    it('gets correct current concern suggestions', async () => {
      const { riskArea, question, answer } = await setup(txn);
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user = await User.create(createMockUser(11, clinic.id, 'physician'), txn);
      const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
      const concern = await Concern.create({ title: 'Housing' }, txn);

      await ConcernSuggestion.create(
        {
          concernId: concern.id,
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
          suggestionType: 'concern',
          concernId: concern.id,
        },
        txn,
      );

      // should be 1 item since we have created a concern suggestion
      expect(await ConcernSuggestion.currentConcernSuggestionIdsQuery(patient.id, txn)).toEqual([
        { concernId: concern.id },
      ]);

      await CarePlanSuggestion.accept(carePlanSuggestion, user.id, txn);
      const patientConcern = await PatientConcern.create(
        {
          order: 2,
          concernId: concern.id,
          patientId: patient.id,
          userId: user.id,
        },
        txn,
      );

      // now should be 0 items after accepting care plan suggestion
      expect(await ConcernSuggestion.currentConcernSuggestionIdsQuery(patient.id, txn)).toEqual([]);
      // dismiss
      await PatientConcern.delete(patientConcern.id, user.id, txn);

      // suggest the concern again
      await CarePlanSuggestion.create(
        {
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          patientId: patient.id,
          suggestionType: 'concern',
          concernId: concern.id,
        },
        txn,
      );
      // now should be 1 item again
      expect(await ConcernSuggestion.currentConcernSuggestionIdsQuery(patient.id, txn)).toEqual([
        { concernId: concern.id },
      ]);
    });
  });
});
