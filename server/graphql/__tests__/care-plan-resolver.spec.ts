import { subHours } from 'date-fns';
import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import {
  AnswerTypeOptions,
  AnswerValueTypeOptions,
  CarePlanSuggestionType,
  ComputedFieldDataTypes,
  Priority,
  RiskAdjustmentTypeOptions,
  UserRole,
} from 'schema';
import * as uuid from 'uuid/v4';
import * as carePlanSuggestionAccept from '../../../app/graphql/queries/care-plan-suggestion-accept-mutation.graphql';
import * as carePlanSuggestionDismiss from '../../../app/graphql/queries/care-plan-suggestion-dismiss-mutation.graphql';
import * as getComputedFieldSuggestionsQuery from '../../../app/graphql/queries/get-care-plan-suggestions-from-computed-fields-for-patient.graphql';
import * as getRiskAreaAssessmentSuggestionsQuery from '../../../app/graphql/queries/get-care-plan-suggestions-from-risk-area-assessments-for-patient.graphql';
import * as getScreeningToolSuggestionsQuery from '../../../app/graphql/queries/get-care-plan-suggestions-from-screening-tools-for-patient.graphql';
import * as getCarePlanForPatient from '../../../app/graphql/queries/get-patient-care-plan.graphql';
import Answer from '../../models/answer';
import CarePlanSuggestion from '../../models/care-plan-suggestion';
import Clinic from '../../models/clinic';
import ComputedField from '../../models/computed-field';
import Concern from '../../models/concern';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import Patient from '../../models/patient';
import PatientConcern from '../../models/patient-concern';
import PatientGlassBreak from '../../models/patient-glass-break';
import PatientGoal from '../../models/patient-goal';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import RiskAreaAssessmentSubmission from '../../models/risk-area-assessment-submission';
import ScreeningTool from '../../models/screening-tool';
import Task from '../../models/task';
import TaskTemplate from '../../models/task-template';
import User from '../../models/user';
import {
  createMockClinic,
  createMockUser,
  createPatient,
  createRiskArea,
  setupComputedFieldAnswerWithSuggestionsForPatient,
  setupRiskAreaSubmissionWithSuggestionsForPatient,
  setupScreeningToolSubmissionWithSuggestionsForPatient,
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

async function setup(trx: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), trx);
  const user = await User.create(createMockUser(11, clinic.id), trx);
  const concern = await Concern.create({ title: 'Concern' }, trx);
  const goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'Goal' }, trx);
  const taskTemplate = await TaskTemplate.create(
    {
      title: 'Housing Task',
      repeating: false,
      goalSuggestionTemplateId: goalSuggestionTemplate.id,
      priority: 'low' as Priority,
      careTeamAssigneeRole: 'physician' as UserRole,
    },
    trx,
  );
  const riskArea = await createRiskArea({ title: 'testing' }, trx);
  const riskArea2 = await createRiskArea({ title: 'testing second area', order: 2 }, trx);
  const question = await Question.create(
    {
      title: 'like writing tests?',
      answerType: 'dropdown' as AnswerTypeOptions,
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    },
    trx,
  );
  const question2 = await Question.create(
    {
      title: 'hate writing tests',
      answerType: 'dropdown' as AnswerTypeOptions,
      riskAreaId: riskArea2.id,
      type: 'riskArea',
      order: 2,
    },
    trx,
  );
  await Answer.create(
    {
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number' as AnswerValueTypeOptions,
      riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
      inSummary: false,
      questionId: question.id,
      order: 1,
    },
    trx,
  );
  await Answer.create(
    {
      displayValue: 'hates writing tests!',
      value: '4',
      valueType: 'number' as AnswerValueTypeOptions,
      riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
      inSummary: false,
      questionId: question2.id,
      order: 2,
    },
    trx,
  );
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, trx);
  const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create(
    {
      patientId: patient.id,
      userId: user.id,
      riskAreaId: riskArea.id,
    },
    trx,
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

interface ISetupForSuggestions {
  riskArea: RiskArea;
  computedField: ComputedField;
  screeningTool: ScreeningTool;
  user: User;
  patient: Patient;
}

async function setupForSuggestions(trx: Transaction): Promise<ISetupForSuggestions> {
  const clinic = await Clinic.create(createMockClinic(), trx);
  const user = await User.create(createMockUser(11, clinic.id), trx);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, trx);
  const riskArea = await createRiskArea({ title: 'testing' }, trx);
  const screeningTool = await ScreeningTool.create(
    {
      title: 'White Walker Screening Tool',
      riskAreaId: riskArea.id,
    },
    trx,
  );
  const computedField = await ComputedField.create(
    {
      slug: 'drogon',
      label: 'Has a massive dragon',
      dataType: 'boolean' as ComputedFieldDataTypes,
    },
    trx,
  );

  // Need to create questions to link computed field to risk area
  await Question.create(
    {
      title: 'like writing tests?',
      answerType: 'radio' as AnswerTypeOptions,
      computedFieldId: computedField.id,
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    },
    trx,
  );

  return {
    riskArea,
    screeningTool,
    computedField,
    patient,
    user,
  };
}

describe('care plan resolver tests', () => {
  const permissions = 'green';
  const carePlanForPatientQuery = print(getCarePlanForPatient);
  const computedFieldSuggestionsQuery = print(getComputedFieldSuggestionsQuery);
  const riskAreaAssessmentSuggestionsQuery = print(getRiskAreaAssessmentSuggestionsQuery);
  const screeningToolSuggestionsQuery = print(getScreeningToolSuggestionsQuery);
  const carePlanSuggestionAcceptMutation = print(carePlanSuggestionAccept);
  const carePlanSuggestionDismissMutation = print(carePlanSuggestionDismiss);

  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolve care plan', () => {
    it('resolves care plan for a patient', async () => {
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
          patientConcernId: patientConcern.id,
        },
        txn,
      );
      const result = await graphql(
        schema,
        carePlanForPatientQuery,
        null,
        {
          userId: user.id,
          permissions,
          testTransaction: txn,
        },
        { patientId: patient.id },
      );
      expect(cloneDeep(result.data!.carePlanForPatient)).toMatchObject({
        concerns: [
          { concern: { title: 'Administrative Tasks' } },
          { id: patientConcern.id, concern: { title: concern.title } },
        ],
        goals: [{ id: patientGoal.id, title: patientGoal.title }],
      });
    });

    it('validates glass break if glass break id not passed as in refetch query', async () => {
      const { patient, user, concern, goalSuggestionTemplate } = await setup(txn);

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
          patientConcernId: patientConcern.id,
        },
        txn,
      );

      await PatientGlassBreak.create(
        { userId: user.id, patientId: patient.id, reason: 'yo', note: null },
        txn,
      );

      const result = await graphql(
        schema,
        carePlanForPatientQuery,
        null,
        {
          userId: user.id,
          permissions: 'blue',
          testTransaction: txn,
        },
        { patientId: patient.id },
      );

      expect(cloneDeep(result.data!.carePlanForPatient)).toMatchObject({
        concerns: [
          { concern: { title: 'Administrative Tasks' } },
          { id: patientConcern.id, concern: { title: concern.title } },
        ],
        goals: [{ id: patientGoal.id, title: patientGoal.title }],
      });
    });

    it('blocks resolving care plan for patient if glass break needed', async () => {
      const { patient, user } = await setup(txn);

      const result = await graphql(
        schema,
        carePlanForPatientQuery,
        null,
        {
          userId: user.id,
          permissions: 'blue',
          testTransaction: txn,
        },
        { patientId: patient.id, glassBreakId: uuid() },
      );

      expect(result.errors![0].message).toBe(
        'You must break the glass again to view this patient. Please refresh the page.',
      );
    });

    it('blocks resolving care plan for patient with too old glass break', async () => {
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

      const result = await graphql(
        schema,
        carePlanForPatientQuery,
        null,
        {
          userId: user.id,
          permissions: 'blue',
          testTransaction: txn,
        },
        { patientId: patient.id, glassBreakId: patientGlassBreak.id },
      );

      expect(result.errors![0].message).toBe(
        'You must break the glass again to view this patient. Please refresh the page.',
      );
    });

    it('blocks resolving care plan for patient when needed glass break id not provided', async () => {
      const { patient, clinic } = await setup(txn);
      const user2 = await User.create(createMockUser(12, clinic.id), txn);

      const result = await graphql(
        schema,
        carePlanForPatientQuery,
        null,
        {
          userId: user2.id,
          permissions: 'blue',
          testTransaction: txn,
        },
        { patientId: patient.id },
      );

      const error = `User ${user2.id} cannot automatically break the glass for patient ${
        patient.id
      }`;
      expect(result.errors![0].message).toBe(error);
    });
  });

  describe('resolve care plan suggestions for risk area assessments', () => {
    it('resolves suggestions risk area assessments for a patient', async () => {
      const { riskArea, patient, user } = await setupForSuggestions(txn);

      const {
        concern1,
        concernSuggestion1,
        concern2,
        goalSuggestionTemplate1,
        goalSuggestion1,
        goalSuggestion2,
      } = await setupRiskAreaSubmissionWithSuggestionsForPatient(
        {
          riskAreaId: riskArea.id,
          patientId: patient.id,
          userId: user.id,
        },
        txn,
      );

      await PatientConcern.create(
        {
          patientId: patient.id,
          concernId: concern2.id,
          startedAt: new Date().toISOString(),
          userId: user.id,
        },
        txn,
      );
      await CarePlanSuggestion.dismiss(
        {
          carePlanSuggestionId: goalSuggestion2.id,
          dismissedById: user.id,
          dismissedReason: 'not good',
        },
        txn,
      );

      const result = await graphql(
        schema,
        riskAreaAssessmentSuggestionsQuery,
        null,
        {
          userId: user.id,
          permissions,
          testTransaction: txn,
        },
        { patientId: patient.id },
      );
      const suggestions = cloneDeep(
        result.data!.carePlanSuggestionsFromRiskAreaAssessmentsForPatient,
      );
      expect(suggestions).toHaveLength(2);

      // suggestions from first risk area
      expect(suggestions).toContainEqual(
        expect.objectContaining({
          id: concernSuggestion1.id,
          concernId: concern1.id,
          goalSuggestionTemplateId: null,
          riskArea: {
            id: riskArea.id,
            title: riskArea.title,
          },
          screeningTool: null,
          computedField: null,
        }),
      );
      expect(suggestions).toContainEqual(
        expect.objectContaining({
          id: goalSuggestion1.id,
          concernId: null,
          goalSuggestionTemplateId: goalSuggestionTemplate1.id,
          riskArea: {
            id: riskArea.id,
            title: riskArea.title,
          },
          screeningTool: null,
          computedField: null,
        }),
      );
    });

    it('blocks getting care plan suggetsions for a patient with invalid glass break', async () => {
      const { patient, user } = await setup(txn);

      const result = await graphql(
        schema,
        riskAreaAssessmentSuggestionsQuery,
        null,
        {
          userId: user.id,
          permissions: 'blue',
          testTransaction: txn,
        },
        { patientId: patient.id, glassBreakId: uuid() },
      );

      expect(result.errors![0].message).toBe(
        'You must break the glass again to view this patient. Please refresh the page.',
      );
    });

    it('blocks getting care plan suggetsions for a patient with too old glass break', async () => {
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

      const result = await graphql(
        schema,
        riskAreaAssessmentSuggestionsQuery,
        null,
        {
          userId: user.id,
          permissions: 'blue',
          testTransaction: txn,
        },
        { patientId: patient.id, glassBreakId: patientGlassBreak.id },
      );

      expect(result.errors![0].message).toBe(
        'You must break the glass again to view this patient. Please refresh the page.',
      );
    });
  });

  describe('resolve care plan suggestions for screening tools', () => {
    it('resolves suggestions for screening tools for a patient', async () => {
      const { screeningTool, patient, user } = await setupForSuggestions(txn);

      const {
        concern1,
        concernSuggestion1,
        concern2,
        goalSuggestionTemplate1,
        goalSuggestion1,
        goalSuggestion2,
      } = await setupScreeningToolSubmissionWithSuggestionsForPatient(
        {
          screeningToolId: screeningTool.id,
          patientId: patient.id,
          userId: user.id,
        },
        txn,
      );

      await PatientConcern.create(
        {
          patientId: patient.id,
          concernId: concern2.id,
          startedAt: new Date().toISOString(),
          userId: user.id,
        },
        txn,
      );
      await CarePlanSuggestion.dismiss(
        {
          carePlanSuggestionId: goalSuggestion2.id,
          dismissedById: user.id,
          dismissedReason: 'not good',
        },
        txn,
      );

      const result = await graphql(
        schema,
        screeningToolSuggestionsQuery,
        null,
        {
          userId: user.id,
          permissions,
          testTransaction: txn,
        },
        { patientId: patient.id },
      );
      const suggestions = cloneDeep(result.data!.carePlanSuggestionsFromScreeningToolsForPatient);
      expect(suggestions).toHaveLength(2);

      expect(suggestions).toContainEqual(
        expect.objectContaining({
          id: concernSuggestion1.id,
          concernId: concern1.id,
          goalSuggestionTemplateId: null,
          screeningTool: {
            id: screeningTool.id,
            title: screeningTool.title,
          },
          riskArea: null,
          computedField: null,
        }),
      );
      expect(suggestions).toContainEqual(
        expect.objectContaining({
          id: goalSuggestion1.id,
          concernId: null,
          goalSuggestionTemplateId: goalSuggestionTemplate1.id,
          screeningTool: {
            id: screeningTool.id,
            title: screeningTool.title,
          },
          riskArea: null,
          computedField: null,
        }),
      );
    });

    it('blocks getting care plan suggetsions for a patient with invalid glass break', async () => {
      const { patient, user } = await setup(txn);

      const result = await graphql(
        schema,
        screeningToolSuggestionsQuery,
        null,
        {
          userId: user.id,
          permissions: 'blue',
          testTransaction: txn,
        },
        { patientId: patient.id, glassBreakId: uuid() },
      );

      expect(result.errors![0].message).toBe(
        'You must break the glass again to view this patient. Please refresh the page.',
      );
    });

    it('blocks getting care plan suggetsions for a patient with too old glass break', async () => {
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

      const result = await graphql(
        schema,
        screeningToolSuggestionsQuery,
        null,
        {
          userId: user.id,
          permissions: 'blue',
          testTransaction: txn,
        },
        { patientId: patient.id, glassBreakId: patientGlassBreak.id },
      );

      expect(result.errors![0].message).toBe(
        'You must break the glass again to view this patient. Please refresh the page.',
      );
    });
  });

  describe('resolve care plan suggestions for computed field answers', () => {
    it('resolves suggestions for computed field answers for a patient', async () => {
      const { computedField, riskArea, patient, user } = await setupForSuggestions(txn);

      const {
        concern1,
        concernSuggestion1,
        concern2,
        goalSuggestionTemplate1,
        goalSuggestion1,
        goalSuggestion2,
      } = await setupComputedFieldAnswerWithSuggestionsForPatient(
        {
          computedFieldId: computedField.id,
          patientId: patient.id,
          userId: user.id,
        },
        txn,
      );

      await PatientConcern.create(
        {
          patientId: patient.id,
          concernId: concern2.id,
          startedAt: new Date().toISOString(),
          userId: user.id,
        },
        txn,
      );
      await CarePlanSuggestion.dismiss(
        {
          carePlanSuggestionId: goalSuggestion2.id,
          dismissedById: user.id,
          dismissedReason: 'not good',
        },
        txn,
      );

      const result = await graphql(
        schema,
        computedFieldSuggestionsQuery,
        null,
        {
          userId: user.id,
          permissions,
          testTransaction: txn,
        },
        { patientId: patient.id },
      );
      const suggestions = cloneDeep(result.data!.carePlanSuggestionsFromComputedFieldsForPatient);
      expect(suggestions).toHaveLength(2);

      // suggestions from first risk area
      expect(suggestions).toContainEqual(
        expect.objectContaining({
          id: concernSuggestion1.id,
          concernId: concern1.id,
          goalSuggestionTemplateId: null,
          computedField: {
            id: computedField.id,
            label: computedField.label,
            riskArea: {
              id: riskArea.id,
              title: riskArea.title,
            },
          },
          screeningTool: null,
          riskArea: null,
        }),
      );
      expect(suggestions).toContainEqual(
        expect.objectContaining({
          id: goalSuggestion1.id,
          concernId: null,
          goalSuggestionTemplateId: goalSuggestionTemplate1.id,
          computedField: {
            id: computedField.id,
            label: computedField.label,
            riskArea: {
              id: riskArea.id,
              title: riskArea.title,
            },
          },
          screeningTool: null,
          riskArea: null,
        }),
      );
    });

    it('blocks getting care plan suggetsions for a patient with invalid glass break', async () => {
      const { patient, user } = await setup(txn);

      const result = await graphql(
        schema,
        computedFieldSuggestionsQuery,
        null,
        {
          userId: user.id,
          permissions: 'blue',
          testTransaction: txn,
        },
        { patientId: patient.id, glassBreakId: uuid() },
      );

      expect(result.errors![0].message).toBe(
        'You must break the glass again to view this patient. Please refresh the page.',
      );
    });

    it('blocks getting care plan suggetsions for a patient with too old glass break', async () => {
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

      const result = await graphql(
        schema,
        computedFieldSuggestionsQuery,
        null,
        {
          userId: user.id,
          permissions: 'blue',
          testTransaction: txn,
        },
        { patientId: patient.id, glassBreakId: patientGlassBreak.id },
      );

      expect(result.errors![0].message).toBe(
        'You must break the glass again to view this patient. Please refresh the page.',
      );
    });
  });

  describe('carePlanSuggestionDismiss', () => {
    it('dismisses a carePlanSuggestion', async () => {
      const { patient, concern, riskAreaAssessmentSubmission, user } = await setup(txn);

      const suggestion1 = await CarePlanSuggestion.create(
        {
          patientId: patient.id,
          suggestionType: 'concern' as CarePlanSuggestionType,
          concernId: concern.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        },
        txn,
      );

      const result = await graphql(
        schema,
        carePlanSuggestionDismissMutation,
        null,
        {
          permissions,
          userId: user.id,
          testTransaction: txn,
        },
        {
          carePlanSuggestionId: suggestion1.id,
          dismissedReason: 'Because',
        },
      );
      expect(cloneDeep(result.data!.carePlanSuggestionDismiss)).toMatchObject({
        dismissedById: user.id,
        dismissedReason: 'Because',
      });
    });
  });

  describe('carePlanSuggestionAccept', () => {
    it('accepts a concern suggestion and sets it as active or inactive', async () => {
      const { patient, concern, riskAreaAssessmentSubmission, user } = await setup(txn);

      const concern2 = await Concern.create({ title: 'Second concern' }, txn);
      const suggestion1 = await CarePlanSuggestion.create(
        {
          patientId: patient.id,
          suggestionType: 'concern' as CarePlanSuggestionType,
          concernId: concern.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        },
        txn,
      );
      const suggestion2 = await CarePlanSuggestion.create(
        {
          patientId: patient.id,
          suggestionType: 'concern' as CarePlanSuggestionType,
          concernId: concern2.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        },
        txn,
      );

      await graphql(
        schema,
        carePlanSuggestionAcceptMutation,
        null,
        { permissions, userId: user.id, testTransaction: txn },
        {
          carePlanSuggestionId: suggestion1.id,
        },
      );

      await graphql(
        schema,
        carePlanSuggestionAcceptMutation,
        null,
        { permissions, userId: user.id, testTransaction: txn },
        {
          carePlanSuggestionId: suggestion2.id,
          startedAt: new Date().toISOString(),
        },
      );

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

    it('accepts a goal suggestion and creates a new patientConcern', async () => {
      const { patient, goalSuggestionTemplate, riskAreaAssessmentSubmission, user } = await setup(
        txn,
      );

      const suggestion = await CarePlanSuggestion.create(
        {
          patientId: patient.id,
          suggestionType: 'goal' as CarePlanSuggestionType,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        },
        txn,
      );
      const concern2 = await Concern.create({ title: 'Concern 2' }, txn);

      await graphql(
        schema,
        carePlanSuggestionAcceptMutation,
        null,
        { permissions, userId: user.id, testTransaction: txn },
        {
          carePlanSuggestionId: suggestion.id,
          concernId: concern2.id,
        },
      );

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

    it('accepts a goal suggestion and some task templates', async () => {
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
          suggestionType: 'goal' as CarePlanSuggestionType,
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

      await graphql(
        schema,
        carePlanSuggestionAcceptMutation,
        null,
        { permissions, userId: user.id, testTransaction: txn },
        {
          carePlanSuggestionId: suggestion.id,
          patientConcernId: patientConcern.id,
          taskTemplateIds: [taskTemplate.id],
        },
      );

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

    xit('accepts a goal suggestion and attaches to a newly suggested concern', async () => {
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
          suggestionType: 'concern' as CarePlanSuggestionType,
          concernId: concern.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        },
        txn,
      );
      const goalSuggestion = await CarePlanSuggestion.create(
        {
          patientId: patient.id,
          suggestionType: 'goal' as CarePlanSuggestionType,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        },
        txn,
      );

      await graphql(
        schema,
        carePlanSuggestionAcceptMutation,
        null,
        { permissions, userId: user.id, testTransaction: txn },
        {
          carePlanSuggestionId: goalSuggestion.id,
          concernId: concern.id,
        },
      );

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

    xit('accepts a goal suggestion and attaches to an existing patientConcern', async () => {
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
          suggestionType: 'goal' as CarePlanSuggestionType,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        },
        txn,
      );
      // dupe suggestion
      const dupeSuggestion = await CarePlanSuggestion.create(
        {
          patientId: patient.id,
          suggestionType: 'goal' as CarePlanSuggestionType,
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

      await graphql(
        schema,
        carePlanSuggestionAcceptMutation,
        null,
        { permissions, userId: user.id, testTransaction: txn },
        {
          carePlanSuggestionId: suggestion.id,
          patientConcernId: patientConcern.id,
        },
      );

      // accept the same suggestion again
      const dupeSuggestionAcceptResponse = await graphql(
        schema,
        carePlanSuggestionAcceptMutation,
        null,
        { permissions, userId: user.id, testTransaction: txn },
        {
          carePlanSuggestionId: suggestion.id,
          patientConcernId: patientConcern.id,
        },
      );
      expect(dupeSuggestionAcceptResponse.errors![0].message).toBe(
        'Suggestion was already accepted',
      );

      const patientGoals = await PatientGoal.getForPatient(patient.id, txn);
      expect(patientGoals.map(g => g.goalSuggestionTemplateId)).toContain(
        goalSuggestionTemplate.id,
      );
      expect(patientGoals).toHaveLength(1);
      expect(patientGoals[0].patientConcernId).toEqual(patientConcern.id);

      const fetchedSuggestion = await CarePlanSuggestion.get(suggestion.id, txn);
      expect(fetchedSuggestion!.acceptedAt).not.toBeFalsy();

      const fetchedDupeSuggestion = await CarePlanSuggestion.get(dupeSuggestion.id, txn);
      expect(fetchedDupeSuggestion!.acceptedAt).not.toBeFalsy();
    });
  });
});
