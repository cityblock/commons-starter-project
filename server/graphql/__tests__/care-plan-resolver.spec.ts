import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Answer from '../../models/answer';
import Concern from '../../models/concern';
import ConcernSuggestion from '../../models/concern-suggestion';
import GoalSuggestion from '../../models/goal-suggestion';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import User from '../../models/user';
import {
  createMockPatient,
  createPatient,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('patient answer tests', () => {

  let db: Db;
  const userRole = 'admin';
  let riskArea: RiskArea;
  let riskArea2: RiskArea;
  let question: Question;
  let question2: Question;
  let answer: Answer;
  let answer2: Answer;
  let user: User;
  let patient: Patient;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
    user = await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });

    riskArea = await RiskArea.create({
      title: 'testing',
      order: 1,
    });
    riskArea2 = await RiskArea.create({
      title: 'testing second area',
      order: 2,
    });
    question = await Question.create({
      title: 'like writing tests?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      order: 1,
    });
    question2 = await Question.create({
      title: 'hate writing tests',
      answerType: 'dropdown',
      riskAreaId: riskArea2.id,
      order: 2,
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
    answer2 = await Answer.create({
      displayValue: 'hates writing tests!',
      value: '4',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question2.id,
      order: 2,
    });
    patient = await createPatient(createMockPatient(123), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve care plan suggestions', () => {
    it('can get care plan suggestions for a patient', async () => {
      const concern = await Concern.create({ title: 'Concern' });
      const goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'Goal' });

      await ConcernSuggestion.create({
        concernId: concern.id, answerId: answer.id,
      });
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate.id, answerId: answer2.id,
      });

      await PatientAnswer.create({
        patientId: patient.id,
        answers: [{
          questionId: answer.questionId,
          answerId: answer.id,
          answerValue: '3',
          patientId: patient.id,
          applicable: true,
          userId: user.id,
        }, {
          questionId: answer2.questionId,
          answerId: answer2.id,
          answerValue: '3',
          patientId: patient.id,
          applicable: true,
          userId: user.id,
        }],
      });

      const query = `{
        carePlanSuggestionsForPatient(patientId: "${patient.id}") {
          concernSuggestions {
            id
            title
          }
          goalSuggestions {
            id
            title
          }
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.carePlanSuggestionsForPatient)).toMatchObject({
        concernSuggestions: [{ id: concern.id, title: concern.title }],
        goalSuggestions: [{ id: goalSuggestionTemplate.id, title: goalSuggestionTemplate.title }],
      });
    });

    it('gets care plan suggestions for a patient and risk area', async () => {
      const concern = await Concern.create({ title: 'Concern' });
      const goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'Goal' });

      await ConcernSuggestion.create({
        concernId: concern.id, answerId: answer.id,
      });
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate.id, answerId: answer2.id,
      });

      await PatientAnswer.create({
        patientId: patient.id,
        answers: [{
          questionId: answer.questionId,
          answerId: answer.id,
          answerValue: '3',
          patientId: patient.id,
          applicable: true,
          userId: user.id,
        }, {
          questionId: answer2.questionId,
          answerId: answer2.id,
          answerValue: '3',
          patientId: patient.id,
          applicable: true,
          userId: user.id,
        }],
      });

      const query = `{
        carePlanSuggestionsForPatient(patientId: "${patient.id}", riskAreaId: "${riskArea2.id}") {
          concernSuggestions {
            id
            title
          }
          goalSuggestions {
            id
            title
          }
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      const suggestions = cloneDeep(result.data!.carePlanSuggestionsForPatient);
      expect(suggestions).toMatchObject({
        concernSuggestions: [],
        goalSuggestions: [{ id: goalSuggestionTemplate.id, title: goalSuggestionTemplate.title }],
      });
      expect(suggestions.concernSuggestions).toEqual([]);
    });
  });
});
