import { subHours } from 'date-fns';
import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Answer from '../../models/answer';
import CarePlanSuggestion from '../../models/care-plan-suggestion';
import Clinic from '../../models/clinic';
import Concern from '../../models/concern';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import Patient from '../../models/patient';
import PatientConcern from '../../models/patient-concern';
import PatientGlassBreak from '../../models/patient-glass-break';
import PatientGoal from '../../models/patient-goal';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import RiskAreaAssessmentSubmission from '../../models/risk-area-assessment-submission';
import Task from '../../models/task';
import TaskTemplate from '../../models/task-template';
import User from '../../models/user';
import {
  createMockClinic,
  createMockUser,
  createPatient,
  createRiskArea,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

const orderBy = 'title';
const order = 'asc';

interface ISetup {
  riskArea: RiskArea;
  riskArea2: RiskArea;
  question: Question;
  question2: Question;
  user: User;
  clinic: Clinic;
  patient: Patient;
  concern: Concern;
  goalSuggestionTemplate: GoalSuggestionTemplate;
  riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission;
  taskTemplate: TaskTemplate;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id), txn);
  const concern = await Concern.create({ title: 'Concern' }, txn);
  const goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'Goal' }, txn);
  const taskTemplate = await TaskTemplate.create(
    {
      title: 'Housing Task',
      repeating: false,
      goalSuggestionTemplateId: goalSuggestionTemplate.id,
      priority: 'low',
      careTeamAssigneeRole: 'physician',
    },
    txn,
  );
  const riskArea = await createRiskArea({ title: 'testing' }, txn);
  const riskArea2 = await createRiskArea({ title: 'testing second area', order: 2 }, txn);
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
  const question2 = await Question.create(
    {
      title: 'hate writing tests',
      answerType: 'dropdown',
      riskAreaId: riskArea2.id,
      type: 'riskArea',
      order: 2,
    },
    txn,
  );
  await Answer.create(
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
  await Answer.create(
    {
      displayValue: 'hates writing tests!',
      value: '4',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question2.id,
      order: 2,
    },
    txn,
  );
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create(
    {
      patientId: patient.id,
      userId: user.id,
      riskAreaId: riskArea.id,
    },
    txn,
  );

  return {
    clinic,
    user,
    concern,
    goalSuggestionTemplate,
    riskArea,
    riskArea2,
    question,
    question2,
    patient,
    riskAreaAssessmentSubmission,
    taskTemplate,
  };
}

describe('care plan resolver tests', () => {
  let db: Db;
  const permissions = 'green';

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve care plan', () => {
    it('resolves care plan for a patient', async () => {
      await transaction(PatientConcern.knex(), async txn => {
        const { patient, concern, user, goalSuggestionTemplate } = await setup(txn);

        const patientConcern = await PatientConcern.create(
          {
            patientId: patient.id,
            concernId: concern.id,
            startedAt: new Date().toISOString(),
            userId: user.id,
          },
          txn,
        );
        const patientGoal = await PatientGoal.create(
          {
            patientId: patient.id,
            title: 'Patient Goal',
            goalSuggestionTemplateId: goalSuggestionTemplate.id,
            userId: user.id,
          },
          txn,
        );
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
        const result = await graphql(schema, query, null, {
          db,
          userId: user.id,
          permissions,
          txn,
        });
        expect(cloneDeep(result.data!.carePlanForPatient)).toMatchObject({
          concerns: [
            { concern: { title: 'Administrative Tasks' } },
            { id: patientConcern.id, concern: { title: concern.title } },
          ],
          goals: [{ id: patientGoal.id, title: patientGoal.title }],
        });
      });
    });

    it('blocks resolving care plan for patient if glass break needed', async () => {
      await transaction(PatientConcern.knex(), async txn => {
        const { patient, user } = await setup(txn);

        const query = `{
          carePlanForPatient(patientId: "${patient.id}", glassBreakId: "${uuid()}") {
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
        const result = await graphql(schema, query, null, {
          db,
          userId: user.id,
          permissions: 'blue',
          txn,
        });

        expect(result.errors![0].message).toBe(
          'You must break the glass again to view this patient. Please refresh the page.',
        );
      });
    });

    it('blocks resolving care plan for patient with too old glass break', async () => {
      await transaction(PatientConcern.knex(), async txn => {
        const { patient, user } = await setup(txn);

        const patientGlassBreak = await PatientGlassBreak.create(
          {
            userId: user.id,
            patientId: patient.id,
            reason: 'Needed for routine care',
            note: null,
          },
          txn,
        );

        await PatientGlassBreak.query(txn)
          .where({ userId: user.id, patientId: patient.id })
          .patch({ createdAt: subHours(new Date(), 9).toISOString() });

        const query = `{
          carePlanForPatient(patientId: "${patient.id}", glassBreakId: "${patientGlassBreak.id}") {
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
        const result = await graphql(schema, query, null, {
          db,
          userId: user.id,
          permissions: 'blue',
          txn,
        });

        expect(result.errors![0].message).toBe(
          'You must break the glass again to view this patient. Please refresh the page.',
        );
      });
    });

    it('blocks resolving care plan for patient when needed glass break id not provided', async () => {
      await transaction(PatientConcern.knex(), async txn => {
        const { patient, clinic } = await setup(txn);
        const user2 = await User.create(createMockUser(12, clinic.id), txn);

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
        const result = await graphql(schema, query, null, {
          db,
          userId: user2.id,
          permissions: 'blue',
          txn,
        });

        const error = `User ${user2.id} cannot automatically break the glass for patient ${
          patient.id
        }`;
        expect(result.errors![0].message).toBe(error);
      });
    });
  });

  describe('resolve care plan suggestions', () => {
    it('can get care plan suggestions for a patient', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
        const {
          patient,
          concern,
          riskAreaAssessmentSubmission,
          goalSuggestionTemplate,
          user,
        } = await setup(txn);

        const suggestion1 = await CarePlanSuggestion.create(
          {
            patientId: patient.id,
            suggestionType: 'concern',
            concernId: concern.id,
            type: 'riskAreaAssessmentSubmission',
            riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          },
          txn,
        );
        const suggestion2 = await CarePlanSuggestion.create(
          {
            patientId: patient.id,
            suggestionType: 'goal',
            goalSuggestionTemplateId: goalSuggestionTemplate.id,
            type: 'riskAreaAssessmentSubmission',
            riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          },
          txn,
        );

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
        const result = await graphql(schema, query, null, {
          db,
          userId: user.id,
          permissions,
          txn,
        });
        const clonedResult = cloneDeep(result.data!.carePlanSuggestionsForPatient);
        const suggestions = clonedResult.map((suggestion: any) => ({
          id: suggestion.id,
          concernId: suggestion.concern ? suggestion.concern.id : null,
          goalSuggestionTemplateId: suggestion.goalSuggestionTemplate
            ? suggestion.goalSuggestionTemplate.id
            : null,
        }));
        expect(
          suggestions.some(
            (sug: any) =>
              sug.id === suggestion1.id &&
              sug.concernId === concern.id &&
              sug.goalSuggestionTemplateId === null,
          ),
        ).toEqual(true);
        expect(
          suggestions.some(
            (sug: any) =>
              sug.id === suggestion2.id &&
              sug.concernId === null &&
              sug.goalSuggestionTemplateId === goalSuggestionTemplate.id,
          ),
        ).toEqual(true);
      });
    });

    it('blocks getting care plan suggetsions for a patient with invalid glass break', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
        const { patient, user } = await setup(txn);

        const query = `{
          carePlanSuggestionsForPatient(patientId: "${patient.id}", glassBreakId: "${uuid()}") {
            id
            concern {
              id
            }
            goalSuggestionTemplate {
              id
            }
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          userId: user.id,
          permissions: 'blue',
          txn,
        });

        expect(result.errors![0].message).toBe(
          'You must break the glass again to view this patient. Please refresh the page.',
        );
      });
    });

    it('blocks getting care plan suggetsions for a patient with too old glass break', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
        const { patient, user } = await setup(txn);

        const patientGlassBreak = await PatientGlassBreak.create(
          {
            userId: user.id,
            patientId: patient.id,
            reason: 'Needed for routine care',
            note: null,
          },
          txn,
        );

        await PatientGlassBreak.query(txn)
          .where({ userId: user.id, patientId: patient.id })
          .patch({ createdAt: subHours(new Date(), 9).toISOString() });

        const query = `{
          carePlanSuggestionsForPatient(patientId: "${patient.id}", glassBreakId: "${
          patientGlassBreak.id
        }") {
            id
            concern {
              id
            }
            goalSuggestionTemplate {
              id
            }
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          userId: user.id,
          permissions: 'blue',
          txn,
        });

        expect(result.errors![0].message).toBe(
          'You must break the glass again to view this patient. Please refresh the page.',
        );
      });
    });
  });

  describe('carePlanSuggestionDismiss', () => {
    it('dismisses a carePlanSuggestion', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
        const { patient, concern, riskAreaAssessmentSubmission, user } = await setup(txn);

        const suggestion1 = await CarePlanSuggestion.create(
          {
            patientId: patient.id,
            suggestionType: 'concern',
            concernId: concern.id,
            type: 'riskAreaAssessmentSubmission',
            riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          },
          txn,
        );

        const mutation = `mutation {
          carePlanSuggestionDismiss(
            input: { carePlanSuggestionId: "${suggestion1.id}", dismissedReason: "Because" }
          ) {
            dismissedById
            dismissedReason
          }
        }`;
        const result = await graphql(schema, mutation, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.carePlanSuggestionDismiss)).toMatchObject({
          dismissedById: user.id,
          dismissedReason: 'Because',
        });
      });
    });
  });

  describe('carePlanSuggestionAccept', () => {
    it('accepts a concern suggestion and sets it as active or inactive', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
        const { patient, concern, riskAreaAssessmentSubmission, user } = await setup(txn);

        const concern2 = await Concern.create({ title: 'Second concern' }, txn);
        const suggestion1 = await CarePlanSuggestion.create(
          {
            patientId: patient.id,
            suggestionType: 'concern',
            concernId: concern.id,
            type: 'riskAreaAssessmentSubmission',
            riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          },
          txn,
        );
        const suggestion2 = await CarePlanSuggestion.create(
          {
            patientId: patient.id,
            suggestionType: 'concern',
            concernId: concern2.id,
            type: 'riskAreaAssessmentSubmission',
            riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          },
          txn,
        );

        const mutation = `mutation {
          carePlanSuggestionAccept(
            input: { carePlanSuggestionId: "${suggestion1.id}" }
          ) {
            id
          }
        }`;
        await graphql(schema, mutation, null, { db, permissions, userId: user.id, txn });

        const mutation2 = `mutation {
          carePlanSuggestionAccept(
            input: {
              carePlanSuggestionId: "${suggestion2.id}", startedAt: "${new Date().toISOString()}"
            }
          ) {
            id
          }
        }`;
        await graphql(schema, mutation2, null, { db, permissions, userId: user.id, txn });

        const patientConcerns = await PatientConcern.getForPatient(patient.id, txn);
        // Note: Index starts at 1 because the first concern is Admin Tasks
        expect(patientConcerns[1].concernId).toEqual(concern.id);
        expect(patientConcerns[1].startedAt).toBeFalsy();
        expect(patientConcerns[2].concernId).toEqual(concern2.id);
        expect(patientConcerns[2].startedAt).not.toBeFalsy();

        const fetchedSuggestion1 = await CarePlanSuggestion.get(suggestion1.id, txn);
        const fetchedSuggestion2 = await CarePlanSuggestion.get(suggestion2.id, txn);
        expect(fetchedSuggestion1!.acceptedAt).not.toBeFalsy();
        expect(fetchedSuggestion2!.acceptedAt).not.toBeFalsy();
      });
    });

    it('accepts a goal suggestion and creates a new patientConcern', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
        const { patient, goalSuggestionTemplate, riskAreaAssessmentSubmission, user } = await setup(
          txn,
        );

        const suggestion = await CarePlanSuggestion.create(
          {
            patientId: patient.id,
            suggestionType: 'goal',
            goalSuggestionTemplateId: goalSuggestionTemplate.id,
            type: 'riskAreaAssessmentSubmission',
            riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          },
          txn,
        );
        const concern2 = await Concern.create({ title: 'Concern 2' }, txn);

        const mutation = `mutation {
          carePlanSuggestionAccept(
            input: { carePlanSuggestionId: "${suggestion.id}", concernId: "${concern2.id}" }
          ) {
            id
          }
        }`;
        await graphql(schema, mutation, null, { db, permissions, userId: user.id, txn });

        const patientConcerns = await PatientConcern.getForPatient(patient.id, txn);
        const patientGoals = await PatientGoal.getForPatient(patient.id, txn);
        const concerns = await Concern.getAll({ orderBy, order }, txn);
        expect(concerns.map(c => c.title)).toContain(concern2.title);
        // Note: Index starts at 1 because 0 is Admin Tasks
        expect(patientConcerns[1].concern.title).toEqual(concern2.title);
        expect(patientGoals[0].goalSuggestionTemplateId).toEqual(goalSuggestionTemplate.id);
        expect(patientGoals[0].patientConcernId).toEqual(patientConcerns[1].id);

        const fetchedSuggestion = await CarePlanSuggestion.get(suggestion.id, txn);
        expect(fetchedSuggestion!.acceptedAt).not.toBeFalsy();
      });
    });

    it('accepts a goal suggestion and attaches to a newly suggested concern', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
        const {
          patient,
          concern,
          riskAreaAssessmentSubmission,
          goalSuggestionTemplate,
          user,
        } = await setup(txn);

        const concernSuggestion = await CarePlanSuggestion.create(
          {
            patientId: patient.id,
            suggestionType: 'concern',
            concernId: concern.id,
            type: 'riskAreaAssessmentSubmission',
            riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          },
          txn,
        );
        const goalSuggestion = await CarePlanSuggestion.create(
          {
            patientId: patient.id,
            suggestionType: 'goal',
            goalSuggestionTemplateId: goalSuggestionTemplate.id,
            type: 'riskAreaAssessmentSubmission',
            riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          },
          txn,
        );

        const mutation = `mutation {
          carePlanSuggestionAccept(
            input: { carePlanSuggestionId: "${goalSuggestion.id}", concernId: "${concern.id}" }
          ) {
            id
          }
        }`;
        await graphql(schema, mutation, null, { db, permissions, userId: user.id, txn });

        const patientConcerns = await PatientConcern.getForPatient(patient.id, txn);
        const patientGoals = await PatientGoal.getForPatient(patient.id, txn);
        expect(patientConcerns.map(c => c.concern.title)).toContain(concern.title);
        expect(patientGoals.map(g => g.goalSuggestionTemplateId)).toContain(
          goalSuggestionTemplate.id,
        );

        const fetchedConcernSuggestion = await CarePlanSuggestion.get(concernSuggestion.id, txn);
        const fetchedGoalSuggestion = await CarePlanSuggestion.get(goalSuggestion.id, txn);
        expect(fetchedConcernSuggestion!.acceptedAt).not.toBeFalsy();
        expect(fetchedGoalSuggestion!.acceptedAt).not.toBeFalsy();
      });
    });

    it('accepts a goal suggestion and attaches to an existing patientConcern', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
        const {
          patient,
          goalSuggestionTemplate,
          riskAreaAssessmentSubmission,
          concern,
          user,
        } = await setup(txn);

        const suggestion = await CarePlanSuggestion.create(
          {
            patientId: patient.id,
            suggestionType: 'goal',
            goalSuggestionTemplateId: goalSuggestionTemplate.id,
            type: 'riskAreaAssessmentSubmission',
            riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          },
          txn,
        );
        const patientConcern = await PatientConcern.create(
          {
            patientId: patient.id,
            concernId: concern.id,
            userId: user.id,
          },
          txn,
        );

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
        await graphql(schema, mutation, null, { db, permissions, userId: user.id, txn });

        const patientGoals = await PatientGoal.getForPatient(patient.id, txn);
        expect(patientGoals.map(g => g.goalSuggestionTemplateId)).toContain(
          goalSuggestionTemplate.id,
        );
        expect(patientGoals[0].patientConcernId).toEqual(patientConcern.id);

        const fetchedSuggestion = await CarePlanSuggestion.get(suggestion.id, txn);
        expect(fetchedSuggestion!.acceptedAt).not.toBeFalsy();
      });
    });

    it('accepts a goal suggestion and some task templates', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
        const {
          patient,
          goalSuggestionTemplate,
          riskAreaAssessmentSubmission,
          concern,
          user,
          taskTemplate,
        } = await setup(txn);

        const suggestion = await CarePlanSuggestion.create(
          {
            patientId: patient.id,
            suggestionType: 'goal',
            goalSuggestionTemplateId: goalSuggestionTemplate.id,
            type: 'riskAreaAssessmentSubmission',
            riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          },
          txn,
        );
        const patientConcern = await PatientConcern.create(
          {
            patientId: patient.id,
            concernId: concern.id,
            userId: user.id,
          },
          txn,
        );

        const mutation = `mutation {
          carePlanSuggestionAccept(
            input: {
              carePlanSuggestionId: "${suggestion.id}",
              patientConcernId: "${patientConcern.id}",
              taskTemplateIds: ["${taskTemplate.id}"]
            }
          ) {
            id
          }
        }`;
        await graphql(schema, mutation, null, { db, permissions, userId: user.id, txn });

        const patientTasks = await Task.getPatientTasks(
          patient.id,
          {
            pageNumber: 0,
            pageSize: 10,
            orderBy: 'createdAt',
            order: 'asc',
          },
          txn,
        );
        expect(patientTasks.total).toEqual(1);
        expect(patientTasks.results[0].title).toEqual(taskTemplate.title);
      });
    });
  });
});
