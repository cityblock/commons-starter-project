import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Answer from '../../models/answer';
import CarePlanSuggestion from '../../models/care-plan-suggestion';
import Clinic from '../../models/clinic';
import Concern from '../../models/concern';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import Patient from '../../models/patient';
import PatientConcern from '../../models/patient-concern';
import PatientGoal from '../../models/patient-goal';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import User from '../../models/user';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

const orderBy = 'title';
const order = 'asc';

describe('care plan resolver tests', () => {
  let db: Db;
  const userRole = 'admin';
  let riskArea: RiskArea;
  let riskArea2: RiskArea;
  let question: Question;
  let question2: Question;
  let user: User;
  let clinic: Clinic;
  let patient: Patient;
  let concern: Concern;
  let goalSuggestionTemplate: GoalSuggestionTemplate;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id));

    concern = await Concern.create({ title: 'Concern' });
    goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'Goal' });
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
      type: 'riskArea',
      order: 1,
    });
    question2 = await Question.create({
      title: 'hate writing tests',
      answerType: 'dropdown',
      riskAreaId: riskArea2.id,
      type: 'riskArea',
      order: 2,
    });
    await Answer.create({
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    });
    await Answer.create({
      displayValue: 'hates writing tests!',
      value: '4',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question2.id,
      order: 2,
    });
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve care plan', () => {
    it('resolves care plan for a patient', async () => {
      const patientConcern = await PatientConcern.create({
        patientId: patient.id,
        concernId: concern.id,
        startedAt: new Date().toISOString(),
        userId: user.id,
      });
      const patientGoal = await PatientGoal.create({
        patientId: patient.id,
        title: 'Patient Goal',
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        userId: user.id,
      });

      const query = `{
        carePlanForPatient(patientId: "${patient.id}") {
          concerns {
            id
            concern {
              title
            }
          }
          goals {
            id
            title
          }
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.carePlanForPatient)).toMatchObject({
        concerns: [{ id: patientConcern.id, concern: { title: concern.title } }],
        goals: [{ id: patientGoal.id, title: patientGoal.title }],
      });
    });
  });

  describe('resolve care plan suggestions', () => {
    it('can get care plan suggestions for a patient', async () => {
      const suggestion1 = await CarePlanSuggestion.create({
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern.id,
      });
      const suggestion2 = await CarePlanSuggestion.create({
        patientId: patient.id,
        suggestionType: 'goal',
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
      });

      const query = `{
        carePlanSuggestionsForPatient(patientId: "${patient.id}") {
          id
          concern {
            id
          }
          goalSuggestionTemplate {
            id
          }
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.carePlanSuggestionsForPatient)).toMatchObject([
        {
          id: suggestion1.id,
          concern: {
            id: concern.id,
          },
          goalSuggestionTemplate: null,
        },
        {
          id: suggestion2.id,
          concern: null,
          goalSuggestionTemplate: {
            id: goalSuggestionTemplate.id,
          },
        },
      ]);
    });
  });

  describe('carePlanSuggestionDismiss', () => {
    it('dismisses a carePlanSuggestion', async () => {
      const suggestion1 = await CarePlanSuggestion.create({
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern.id,
      });

      const mutation = `mutation {
        carePlanSuggestionDismiss(
          input: { carePlanSuggestionId: "${suggestion1.id}", dismissedReason: "Because" }
        ) {
          dismissedById
          dismissedReason
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.carePlanSuggestionDismiss)).toMatchObject({
        dismissedById: user.id,
        dismissedReason: 'Because',
      });
    });
  });

  describe('carePlanSuggestionAccept', () => {
    it('accepts a concern suggestion and sets it as active or inactive', async () => {
      const concern2 = await Concern.create({ title: 'Second concern' });
      const suggestion1 = await CarePlanSuggestion.create({
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern.id,
      });
      const suggestion2 = await CarePlanSuggestion.create({
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern2.id,
      });

      const mutation = `mutation {
        carePlanSuggestionAccept(
          input: { carePlanSuggestionId: "${suggestion1.id}" }
        ) {
          id
        }
      }`;
      await graphql(schema, mutation, null, { db, userRole, userId: user.id });

      const mutation2 = `mutation {
        carePlanSuggestionAccept(
          input: {
            carePlanSuggestionId: "${suggestion2.id}", startedAt: "${new Date().toISOString()}"
          }
        ) {
          id
        }
      }`;
      await graphql(schema, mutation2, null, { db, userRole, userId: user.id });

      const patientConcerns = await PatientConcern.getForPatient(patient.id);
      expect(patientConcerns[0].concernId).toEqual(concern.id);
      expect(patientConcerns[0].startedAt).toBeFalsy();
      expect(patientConcerns[1].concernId).toEqual(concern2.id);
      expect(patientConcerns[1].startedAt).not.toBeFalsy();

      const fetchedSuggestion1 = await CarePlanSuggestion.get(suggestion1.id);
      const fetchedSuggestion2 = await CarePlanSuggestion.get(suggestion2.id);
      expect(fetchedSuggestion1!.acceptedAt).not.toBeFalsy();
      expect(fetchedSuggestion2!.acceptedAt).not.toBeFalsy();
    });

    it('accepts a goal suggestion and creates a new patientConcern', async () => {
      const suggestion = await CarePlanSuggestion.create({
        patientId: patient.id,
        suggestionType: 'goal',
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
      });
      const concern2 = await Concern.create({ title: 'Concern 2' });

      const mutation = `mutation {
        carePlanSuggestionAccept(
          input: { carePlanSuggestionId: "${suggestion.id}", concernId: "${concern2.id}" }
        ) {
          id
        }
      }`;
      await graphql(schema, mutation, null, { db, userRole, userId: user.id });

      const patientConcerns = await PatientConcern.getForPatient(patient.id);
      const patientGoals = await PatientGoal.getForPatient(patient.id);
      const concerns = await Concern.getAll({ orderBy, order });
      expect(concerns.map(c => c.title)).toContain(concern2.title);
      expect(patientConcerns[0].concern.title).toEqual(concern2.title);
      expect(patientGoals[0].goalSuggestionTemplateId).toEqual(goalSuggestionTemplate.id);
      expect(patientGoals[0].patientConcernId).toEqual(patientConcerns[0].id);

      const fetchedSuggestion = await CarePlanSuggestion.get(suggestion.id);
      expect(fetchedSuggestion!.acceptedAt).not.toBeFalsy();
    });

    it('accepts a goal suggestion and attaches to a newly suggested concern', async () => {
      const concernSuggestion = await CarePlanSuggestion.create({
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern.id,
      });
      const goalSuggestion = await CarePlanSuggestion.create({
        patientId: patient.id,
        suggestionType: 'goal',
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
      });

      const mutation = `mutation {
        carePlanSuggestionAccept(
          input: { carePlanSuggestionId: "${goalSuggestion.id}", concernId: "${concern.id}" }
        ) {
          id
        }
      }`;
      await graphql(schema, mutation, null, { db, userRole, userId: user.id });

      const patientConcerns = await PatientConcern.getForPatient(patient.id);
      const patientGoals = await PatientGoal.getForPatient(patient.id);
      expect(patientConcerns.map(c => c.concern.title)).toContain(concern.title);
      expect(patientGoals.map(g => g.goalSuggestionTemplateId)).toContain(
        goalSuggestionTemplate.id,
      );

      const fetchedConcernSuggestion = await CarePlanSuggestion.get(concernSuggestion.id);
      const fetchedGoalSuggestion = await CarePlanSuggestion.get(goalSuggestion.id);
      expect(fetchedConcernSuggestion!.acceptedAt).not.toBeFalsy();
      expect(fetchedGoalSuggestion!.acceptedAt).not.toBeFalsy();
    });

    it('accepts a goal suggestion and attaches to an existing patientConcern', async () => {
      const suggestion = await CarePlanSuggestion.create({
        patientId: patient.id,
        suggestionType: 'goal',
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
      });
      const patientConcern = await PatientConcern.create({
        patientId: patient.id,
        concernId: concern.id,
        userId: user.id,
      });

      const mutation = `mutation {
        carePlanSuggestionAccept(
          input: {
            carePlanSuggestionId: "${suggestion.id}",
            patientConcernId: "${patientConcern.id}"
          }
        ) {
          id
        }
      }`;
      await graphql(schema, mutation, null, { db, userRole, userId: user.id });

      const patientGoals = await PatientGoal.getForPatient(patient.id);
      expect(patientGoals.map(g => g.goalSuggestionTemplateId)).toContain(
        goalSuggestionTemplate.id,
      );
      expect(patientGoals[0].patientConcernId).toEqual(patientConcern.id);

      const fetchedSuggestion = await CarePlanSuggestion.get(suggestion.id);
      expect(fetchedSuggestion!.acceptedAt).not.toBeFalsy();
    });
  });
});
