import { transaction, Transaction } from 'objection';
import {
  AnswerTypeOptions,
  CarePlanSuggestionType,
  ComputedFieldDataTypes,
  UserRole,
} from 'schema';
import * as uuid from 'uuid/v4';
import {
  createMockClinic,
  createMockUser,
  createPatient,
  createRiskArea,
  setupComputedFieldAnswerWithSuggestionsForPatient,
  setupRiskAreaSubmissionWithSuggestionsForPatient,
  setupScreeningToolSubmissionWithSuggestionsForPatient,
} from '../../spec-helpers';
import CarePlanSuggestion from '../care-plan-suggestion';
import Clinic from '../clinic';
import ComputedField from '../computed-field';
import Concern from '../concern';
import GoalSuggestionTemplate from '../goal-suggestion-template';
import Patient from '../patient';
import PatientConcern from '../patient-concern';
import Question from '../question';
import RiskArea from '../risk-area';
import RiskAreaAssessmentSubmission from '../risk-area-assessment-submission';
import ScreeningTool from '../screening-tool';
import User from '../user';

interface ISetup {
  patient: Patient;
  user: User;
  clinic: Clinic;
  concern: Concern;
  goalSuggestionTemplate: GoalSuggestionTemplate;
  riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission;
  riskArea: RiskArea;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, 'physician' as UserRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const concern = await Concern.create({ title: 'Concern' }, txn);
  const riskArea = await createRiskArea({ title: 'testing' }, txn);
  const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
    { title: 'Goal Template' },
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
  return {
    clinic,
    user,
    patient,
    concern,
    riskArea,
    goalSuggestionTemplate,
    riskAreaAssessmentSubmission,
  };
}

interface ISetupForSuggestions {
  riskArea: RiskArea;
  riskArea2: RiskArea;
  computedField: ComputedField;
  computedField2: ComputedField;
  screeningTool: ScreeningTool;
  screeningTool2: ScreeningTool;
  user: User;
  patient: Patient;
  patient2: Patient;
}

async function setupForSuggestions(trx: Transaction): Promise<ISetupForSuggestions> {
  const clinic = await Clinic.create(createMockClinic(), trx);
  const user = await User.create(createMockUser(11, clinic.id), trx);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, trx);
  const patient2 = await createPatient({ cityblockId: 234, homeClinicId: clinic.id }, trx);
  const riskArea = await createRiskArea({ title: 'testing' }, trx);
  const riskArea2 = await createRiskArea({ title: 'testing second area', order: 2 }, trx);
  const screeningTool = await ScreeningTool.create(
    {
      title: 'White Walker Screening Tool',
      riskAreaId: riskArea.id,
    },
    trx,
  );
  const screeningTool2 = await ScreeningTool.create(
    {
      title: 'Traitor Screening Tool',
      riskAreaId: riskArea2.id,
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
  const computedField2 = await ComputedField.create(
    {
      slug: 'enemy',
      label: 'Has an enemy',
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
  await Question.create(
    {
      title: 'like writing code?',
      answerType: 'radio' as AnswerTypeOptions,
      computedFieldId: computedField2.id,
      riskAreaId: riskArea2.id,
      type: 'riskArea',
      order: 1,
    },
    trx,
  );

  return {
    riskArea,
    riskArea2,
    screeningTool,
    screeningTool2,
    computedField,
    computedField2,
    patient,
    patient2,
    user,
  };
}

describe('care plan suggestion', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Patient.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('care plan suggestion methods', () => {
    it('creates and fetches a care plan suggestion', async () => {
      const { patient, concern, riskAreaAssessmentSubmission } = await setup(txn);
      const carePlanSuggestion = await CarePlanSuggestion.create(
        {
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          patientId: patient.id,
          suggestionType: 'concern' as CarePlanSuggestionType,
          concernId: concern.id,
        },
        txn,
      );

      const fetchedCarePlanSuggestion = await CarePlanSuggestion.get(carePlanSuggestion.id, txn);
      expect(fetchedCarePlanSuggestion!.concern!.id).toEqual(concern.id);
    });

    it('throws an error when getting an invalid id', async () => {
      const fakeId = uuid();
      await expect(CarePlanSuggestion.get(fakeId, txn)).rejects.toMatch(
        `No such carePlanSuggestion: ${fakeId}`,
      );
    });

    it('finds a care plan suggestion for a given concern if it exists', async () => {
      const { patient, concern, riskAreaAssessmentSubmission } = await setup(txn);

      const concern2 = await Concern.create({ title: 'Second Concern' }, txn);
      const carePlanSuggestion = await CarePlanSuggestion.create(
        {
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          patientId: patient.id,
          suggestionType: 'concern' as CarePlanSuggestionType,
          concernId: concern.id,
        },
        txn,
      );

      const foundCarePlanSuggestion = await CarePlanSuggestion.findForPatientAndConcern(
        patient.id,
        concern.id,
        txn,
      );
      const notFoundCarePlanSuggestion = await CarePlanSuggestion.findForPatientAndConcern(
        patient.id,
        concern2.id,
        txn,
      );

      expect(foundCarePlanSuggestion[0].id).toEqual(carePlanSuggestion.id);
      expect(notFoundCarePlanSuggestion).toHaveLength(0);
    });

    it('creates multiple carePlanSuggestions at once', async () => {
      const {
        patient,
        concern,
        riskAreaAssessmentSubmission,
        goalSuggestionTemplate,
      } = await setup(txn);

      await CarePlanSuggestion.createMultiple(
        {
          suggestions: [
            {
              type: 'riskAreaAssessmentSubmission',
              riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
              patientId: patient.id,
              suggestionType: 'concern' as CarePlanSuggestionType,
              concernId: concern.id,
            },
            {
              type: 'riskAreaAssessmentSubmission',
              riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
              patientId: patient.id,
              suggestionType: 'goal' as CarePlanSuggestionType,
              goalSuggestionTemplateId: goalSuggestionTemplate.id,
            },
          ],
        },
        txn,
      );

      const fetchedCarePlanSuggestions = await CarePlanSuggestion.getFromRiskAreaAssessmentsForPatient(
        patient.id,
        txn,
      );

      expect(fetchedCarePlanSuggestions.length).toEqual(2);

      const goalSuggestion = fetchedCarePlanSuggestions.find(s => s.suggestionType === 'goal');
      const concernSuggestion = fetchedCarePlanSuggestions.find(
        s => s.suggestionType === 'concern',
      );

      expect(concernSuggestion!.concern!.id).toEqual(concern.id);
      expect(goalSuggestion!.goalSuggestionTemplate).toMatchObject(goalSuggestionTemplate);
    });

    describe('gets suggestions from Risk Area Assessments for a patient', () => {
      it('gets from Risk Area Assessments for a patient', async () => {
        const {
          riskArea,
          riskArea2,
          screeningTool,
          computedField,
          patient,
          patient2,
          user,
        } = await setupForSuggestions(txn);

        const submission = await setupRiskAreaSubmissionWithSuggestionsForPatient(
          {
            riskAreaId: riskArea.id,
            patientId: patient.id,
            userId: user.id,
          },
          txn,
        );
        const submission2 = await setupRiskAreaSubmissionWithSuggestionsForPatient(
          {
            riskAreaId: riskArea2.id,
            patientId: patient.id,
            userId: user.id,
          },
          txn,
        );

        // create suggestions for another patient
        await setupRiskAreaSubmissionWithSuggestionsForPatient(
          {
            riskAreaId: riskArea.id,
            patientId: patient2.id,
            userId: user.id,
          },
          txn,
        );

        // create suggestions for non risk area assessment
        await setupComputedFieldAnswerWithSuggestionsForPatient(
          {
            computedFieldId: computedField.id,
            patientId: patient.id,
            userId: user.id,
          },
          txn,
        );
        await setupScreeningToolSubmissionWithSuggestionsForPatient(
          {
            screeningToolId: screeningTool.id,
            patientId: patient.id,
            userId: user.id,
          },
          txn,
        );

        const suggestions = await CarePlanSuggestion.getFromRiskAreaAssessmentsForPatient(
          patient.id,
          txn,
        );
        expect(suggestions).toHaveLength(8);

        // suggestions from first risk area
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission.concernSuggestion1.id,
            concernId: submission.concern1.id,
            goalSuggestionTemplateId: null,
            riskArea: expect.objectContaining({
              id: riskArea.id,
              title: riskArea.title,
            }),
            patientScreeningToolSubmissionId: null,
            computedFieldId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission.concernSuggestion2.id,
            concernId: submission.concern2.id,
            goalSuggestionTemplateId: null,
            riskArea: expect.objectContaining({
              id: riskArea.id,
              title: riskArea.title,
            }),
            patientScreeningToolSubmissionId: null,
            computedFieldId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission.goalSuggestion1.id,
            concernId: null,
            goalSuggestionTemplateId: submission.goalSuggestionTemplate1.id,
            riskArea: expect.objectContaining({
              id: riskArea.id,
              title: riskArea.title,
            }),
            patientScreeningToolSubmissionId: null,
            computedFieldId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission.goalSuggestion2.id,
            concernId: null,
            goalSuggestionTemplateId: submission.goalSuggestionTemplate2.id,
            riskArea: expect.objectContaining({
              id: riskArea.id,
              title: riskArea.title,
            }),
            patientScreeningToolSubmissionId: null,
            computedFieldId: null,
          }),
        );

        // submissions from second risk area
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission2.concernSuggestion1.id,
            concernId: submission2.concern1.id,
            goalSuggestionTemplateId: null,
            riskArea: expect.objectContaining({
              id: riskArea2.id,
              title: riskArea2.title,
            }),
            patientScreeningToolSubmissionId: null,
            computedFieldId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission2.concernSuggestion2.id,
            concernId: submission2.concern2.id,
            goalSuggestionTemplateId: null,
            riskArea: expect.objectContaining({
              id: riskArea2.id,
              title: riskArea2.title,
            }),
            patientScreeningToolSubmissionId: null,
            computedFieldId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission2.goalSuggestion1.id,
            concernId: null,
            goalSuggestionTemplateId: submission2.goalSuggestionTemplate1.id,
            riskArea: expect.objectContaining({
              id: riskArea2.id,
              title: riskArea2.title,
            }),
            patientScreeningToolSubmissionId: null,
            computedFieldId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission2.goalSuggestion2.id,
            concernId: null,
            goalSuggestionTemplateId: submission2.goalSuggestionTemplate2.id,
            riskArea: expect.objectContaining({
              id: riskArea2.id,
              title: riskArea2.title,
            }),
            patientScreeningToolSubmissionId: null,
            computedFieldId: null,
          }),
        );
      });

      it("doesn't get accepted or dismissed suggestions for risk area assessments for a patient", async () => {
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

        await CarePlanSuggestion.acceptForConcern(
          {
            concernId: concern2.id,
            patientId: patient.id,
            acceptedById: user.id,
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

        const suggestions = await CarePlanSuggestion.getFromRiskAreaAssessmentsForPatient(
          patient.id,
          txn,
        );
        expect(suggestions).toHaveLength(2);

        // suggestions from first risk area
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: concernSuggestion1.id,
            concernId: concern1.id,
            goalSuggestionTemplateId: null,
            riskArea: expect.objectContaining({
              id: riskArea.id,
              title: riskArea.title,
            }),
            patientScreeningToolSubmissionId: null,
            computedFieldId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: goalSuggestion1.id,
            concernId: null,
            goalSuggestionTemplateId: goalSuggestionTemplate1.id,
            riskArea: expect.objectContaining({
              id: riskArea.id,
              title: riskArea.title,
            }),
            patientScreeningToolSubmissionId: null,
            computedFieldId: null,
          }),
        );
      });

      it("doesn't get concerns that exist already for risk area assessments for a patient", async () => {
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

        const suggestions = await CarePlanSuggestion.getFromRiskAreaAssessmentsForPatient(
          patient.id,
          txn,
        );
        expect(suggestions).toHaveLength(2);

        // suggestions from first risk area
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: concernSuggestion1.id,
            concernId: concern1.id,
            goalSuggestionTemplateId: null,
            riskArea: expect.objectContaining({
              id: riskArea.id,
              title: riskArea.title,
            }),
            patientScreeningToolSubmissionId: null,
            computedFieldId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: goalSuggestion1.id,
            concernId: null,
            goalSuggestionTemplateId: goalSuggestionTemplate1.id,
            riskArea: expect.objectContaining({
              id: riskArea.id,
              title: riskArea.title,
            }),
            patientScreeningToolSubmissionId: null,
            computedFieldId: null,
          }),
        );
      });
    });

    describe('gets suggestions from Screening Tools for a patient', () => {
      it('can get care plan suggestions for screening tools for a patient', async () => {
        const {
          riskArea,
          screeningTool,
          screeningTool2,
          computedField,
          patient,
          patient2,
          user,
        } = await setupForSuggestions(txn);

        const submission = await setupScreeningToolSubmissionWithSuggestionsForPatient(
          {
            screeningToolId: screeningTool.id,
            patientId: patient.id,
            userId: user.id,
          },
          txn,
        );
        const submission2 = await setupScreeningToolSubmissionWithSuggestionsForPatient(
          {
            screeningToolId: screeningTool2.id,
            patientId: patient.id,
            userId: user.id,
          },
          txn,
        );

        // create suggestions for another patient
        await setupScreeningToolSubmissionWithSuggestionsForPatient(
          {
            screeningToolId: screeningTool.id,
            patientId: patient2.id,
            userId: user.id,
          },
          txn,
        );

        // create suggestions for non risk area assessment
        await setupComputedFieldAnswerWithSuggestionsForPatient(
          {
            computedFieldId: computedField.id,
            patientId: patient.id,
            userId: user.id,
          },
          txn,
        );
        await setupRiskAreaSubmissionWithSuggestionsForPatient(
          {
            riskAreaId: riskArea.id,
            patientId: patient.id,
            userId: user.id,
          },
          txn,
        );

        const suggestions = await CarePlanSuggestion.getFromScreeningToolsForPatient(
          patient.id,
          txn,
        );
        expect(suggestions).toHaveLength(8);

        // suggestions from first screening tool
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission.concernSuggestion1.id,
            concernId: submission.concern1.id,
            goalSuggestionTemplateId: null,
            screeningTool: expect.objectContaining({
              id: screeningTool.id,
              title: screeningTool.title,
            }),
            riskAreaAssessmentSubmissionId: null,
            computedFieldId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission.concernSuggestion2.id,
            concernId: submission.concern2.id,
            goalSuggestionTemplateId: null,
            screeningTool: expect.objectContaining({
              id: screeningTool.id,
              title: screeningTool.title,
            }),
            riskAreaAssessmentSubmissionId: null,
            computedFieldId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission.goalSuggestion1.id,
            concernId: null,
            goalSuggestionTemplateId: submission.goalSuggestionTemplate1.id,
            screeningTool: expect.objectContaining({
              id: screeningTool.id,
              title: screeningTool.title,
            }),
            riskAreaAssessmentSubmissionId: null,
            computedFieldId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission.goalSuggestion2.id,
            concernId: null,
            goalSuggestionTemplateId: submission.goalSuggestionTemplate2.id,
            screeningTool: expect.objectContaining({
              id: screeningTool.id,
              title: screeningTool.title,
            }),
            riskAreaAssessmentSubmissionId: null,
            computedFieldId: null,
          }),
        );

        // submissions from second screening tool
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission2.concernSuggestion1.id,
            concernId: submission2.concern1.id,
            goalSuggestionTemplateId: null,
            screeningTool: expect.objectContaining({
              id: screeningTool2.id,
              title: screeningTool2.title,
            }),
            riskAreaAssessmentSubmissionId: null,
            computedFieldId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission2.concernSuggestion2.id,
            concernId: submission2.concern2.id,
            goalSuggestionTemplateId: null,
            screeningTool: expect.objectContaining({
              id: screeningTool2.id,
              title: screeningTool2.title,
            }),
            riskAreaAssessmentSubmissionId: null,
            computedFieldId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission2.goalSuggestion1.id,
            concernId: null,
            goalSuggestionTemplateId: submission2.goalSuggestionTemplate1.id,
            screeningTool: expect.objectContaining({
              id: screeningTool2.id,
              title: screeningTool2.title,
            }),
            riskAreaAssessmentSubmissionId: null,
            computedFieldId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission2.goalSuggestion2.id,
            concernId: null,
            goalSuggestionTemplateId: submission2.goalSuggestionTemplate2.id,
            screeningTool: expect.objectContaining({
              id: screeningTool2.id,
              title: screeningTool2.title,
            }),
            riskAreaAssessmentSubmissionId: null,
            computedFieldId: null,
          }),
        );
      });

      it("doesn't get accepted or dismissed suggestions for screening tools for a patient", async () => {
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

        await CarePlanSuggestion.acceptForConcern(
          {
            concernId: concern2.id,
            patientId: patient.id,
            acceptedById: user.id,
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

        const suggestions = await CarePlanSuggestion.getFromScreeningToolsForPatient(
          patient.id,
          txn,
        );
        expect(suggestions).toHaveLength(2);

        // suggestions from first risk area
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: concernSuggestion1.id,
            concernId: concern1.id,
            goalSuggestionTemplateId: null,
            screeningTool: expect.objectContaining({
              id: screeningTool.id,
              title: screeningTool.title,
            }),
            riskAreaAssessmentSubmissionId: null,
            computedFieldId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: goalSuggestion1.id,
            concernId: null,
            goalSuggestionTemplateId: goalSuggestionTemplate1.id,
            screeningTool: expect.objectContaining({
              id: screeningTool.id,
              title: screeningTool.title,
            }),
            riskAreaAssessmentSubmissionId: null,
            computedFieldId: null,
          }),
        );
      });

      it("doesn't get concerns that exist already for screening tools for a patient", async () => {
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

        const suggestions = await CarePlanSuggestion.getFromScreeningToolsForPatient(
          patient.id,
          txn,
        );
        expect(suggestions).toHaveLength(2);

        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: concernSuggestion1.id,
            concernId: concern1.id,
            goalSuggestionTemplateId: null,
            screeningTool: expect.objectContaining({
              id: screeningTool.id,
              title: screeningTool.title,
            }),
            riskAreaAssessmentSubmissionId: null,
            computedFieldId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: goalSuggestion1.id,
            concernId: null,
            goalSuggestionTemplateId: goalSuggestionTemplate1.id,
            screeningTool: expect.objectContaining({
              id: screeningTool.id,
              title: screeningTool.title,
            }),
            riskAreaAssessmentSubmissionId: null,
            computedFieldId: null,
          }),
        );
      });
    });

    describe('gets suggestions from Computed Field Answers for a patient', () => {
      it('can get care plan suggestions for computed field answers for a patient', async () => {
        const {
          riskArea,
          riskArea2,
          screeningTool,
          computedField,
          computedField2,
          patient,
          patient2,
          user,
        } = await setupForSuggestions(txn);

        const submission = await setupComputedFieldAnswerWithSuggestionsForPatient(
          {
            computedFieldId: computedField.id,
            patientId: patient.id,
            userId: user.id,
          },
          txn,
        );
        const submission2 = await setupComputedFieldAnswerWithSuggestionsForPatient(
          {
            computedFieldId: computedField2.id,
            patientId: patient.id,
            userId: user.id,
          },
          txn,
        );

        // create suggestions for another patient
        await setupComputedFieldAnswerWithSuggestionsForPatient(
          {
            computedFieldId: computedField.id,
            patientId: patient2.id,
            userId: user.id,
          },
          txn,
        );

        // create suggestions for non risk area assessment
        await setupRiskAreaSubmissionWithSuggestionsForPatient(
          {
            riskAreaId: riskArea.id,
            patientId: patient.id,
            userId: user.id,
          },
          txn,
        );
        await setupScreeningToolSubmissionWithSuggestionsForPatient(
          {
            screeningToolId: screeningTool.id,
            patientId: patient.id,
            userId: user.id,
          },
          txn,
        );

        const suggestions = await CarePlanSuggestion.getFromComputedFieldsForPatient(
          patient.id,
          txn,
        );
        expect(suggestions).toHaveLength(8);

        // suggestions from first computed field answer
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission.concernSuggestion1.id,
            concernId: submission.concern1.id,
            goalSuggestionTemplateId: null,
            computedField: expect.objectContaining({
              id: computedField.id,
              label: computedField.label,
              riskArea: expect.objectContaining({
                id: riskArea.id,
                title: riskArea.title,
              }),
            }),
            patientScreeningToolSubmissionId: null,
            riskAreaAssessmentSubmissionId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission.concernSuggestion2.id,
            concernId: submission.concern2.id,
            goalSuggestionTemplateId: null,
            computedField: expect.objectContaining({
              id: computedField.id,
              label: computedField.label,
              riskArea: expect.objectContaining({
                id: riskArea.id,
                title: riskArea.title,
              }),
            }),
            patientScreeningToolSubmissionId: null,
            riskAreaAssessmentSubmissionId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission.goalSuggestion1.id,
            concernId: null,
            goalSuggestionTemplateId: submission.goalSuggestionTemplate1.id,
            computedField: expect.objectContaining({
              id: computedField.id,
              label: computedField.label,
              riskArea: expect.objectContaining({
                id: riskArea.id,
                title: riskArea.title,
              }),
            }),
            patientScreeningToolSubmissionId: null,
            riskAreaAssessmentSubmissionId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission.goalSuggestion2.id,
            concernId: null,
            goalSuggestionTemplateId: submission.goalSuggestionTemplate2.id,
            computedField: expect.objectContaining({
              id: computedField.id,
              label: computedField.label,
              riskArea: expect.objectContaining({
                id: riskArea.id,
                title: riskArea.title,
              }),
            }),
            patientScreeningToolSubmissionId: null,
            riskAreaAssessmentSubmissionId: null,
          }),
        );

        // suggestions from first computed field answer
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission2.concernSuggestion1.id,
            concernId: submission2.concern1.id,
            goalSuggestionTemplateId: null,
            computedField: expect.objectContaining({
              id: computedField2.id,
              label: computedField2.label,
              riskArea: expect.objectContaining({
                id: riskArea2.id,
                title: riskArea2.title,
              }),
            }),
            patientScreeningToolSubmissionId: null,
            riskAreaAssessmentSubmissionId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission2.concernSuggestion2.id,
            concernId: submission2.concern2.id,
            goalSuggestionTemplateId: null,
            computedField: expect.objectContaining({
              id: computedField2.id,
              label: computedField2.label,
              riskArea: expect.objectContaining({
                id: riskArea2.id,
                title: riskArea2.title,
              }),
            }),
            patientScreeningToolSubmissionId: null,
            riskAreaAssessmentSubmissionId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission2.goalSuggestion1.id,
            concernId: null,
            goalSuggestionTemplateId: submission2.goalSuggestionTemplate1.id,
            computedField: expect.objectContaining({
              id: computedField2.id,
              label: computedField2.label,
              riskArea: expect.objectContaining({
                id: riskArea2.id,
                title: riskArea2.title,
              }),
            }),
            patientScreeningToolSubmissionId: null,
            riskAreaAssessmentSubmissionId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: submission2.goalSuggestion2.id,
            concernId: null,
            goalSuggestionTemplateId: submission2.goalSuggestionTemplate2.id,
            computedField: expect.objectContaining({
              id: computedField2.id,
              label: computedField2.label,
              riskArea: expect.objectContaining({
                id: riskArea2.id,
                title: riskArea2.title,
              }),
            }),
            patientScreeningToolSubmissionId: null,
            riskAreaAssessmentSubmissionId: null,
          }),
        );
      });

      it("doesn't get accepted or dismissed suggestions for computed field answers for a patient", async () => {
        const { riskArea, computedField, patient, user } = await setupForSuggestions(txn);

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

        await CarePlanSuggestion.acceptForConcern(
          {
            concernId: concern2.id,
            patientId: patient.id,
            acceptedById: user.id,
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

        const suggestions = await CarePlanSuggestion.getFromComputedFieldsForPatient(
          patient.id,
          txn,
        );
        expect(suggestions).toHaveLength(2);

        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: concernSuggestion1.id,
            concernId: concern1.id,
            goalSuggestionTemplateId: null,
            computedField: expect.objectContaining({
              id: computedField.id,
              label: computedField.label,
              riskArea: expect.objectContaining({
                id: riskArea.id,
                title: riskArea.title,
              }),
            }),
            patientScreeningToolSubmissionId: null,
            riskAreaAssessmentSubmissionId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: goalSuggestion1.id,
            concernId: null,
            goalSuggestionTemplateId: goalSuggestionTemplate1.id,
            computedField: expect.objectContaining({
              id: computedField.id,
              label: computedField.label,
              riskArea: expect.objectContaining({
                id: riskArea.id,
                title: riskArea.title,
              }),
            }),
            patientScreeningToolSubmissionId: null,
            riskAreaAssessmentSubmissionId: null,
          }),
        );
      });

      it("doesn't get concerns that exist already for computed field answers for a patient", async () => {
        const { computedField2, riskArea2, patient, user } = await setupForSuggestions(txn);

        const {
          concern1,
          concernSuggestion1,
          concern2,
          goalSuggestionTemplate1,
          goalSuggestion1,
          goalSuggestion2,
        } = await setupComputedFieldAnswerWithSuggestionsForPatient(
          {
            computedFieldId: computedField2.id,
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

        const suggestions = await CarePlanSuggestion.getFromComputedFieldsForPatient(
          patient.id,
          txn,
        );
        expect(suggestions).toHaveLength(2);

        // suggestions from first risk area
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: concernSuggestion1.id,
            concernId: concern1.id,
            goalSuggestionTemplateId: null,
            computedField: expect.objectContaining({
              id: computedField2.id,
              label: computedField2.label,
              riskArea: expect.objectContaining({
                id: riskArea2.id,
                title: riskArea2.title,
              }),
            }),
            patientScreeningToolSubmissionId: null,
            riskAreaAssessmentSubmissionId: null,
          }),
        );
        expect(suggestions).toContainEqual(
          expect.objectContaining({
            id: goalSuggestion1.id,
            concernId: null,
            goalSuggestionTemplateId: goalSuggestionTemplate1.id,
            computedField: expect.objectContaining({
              id: computedField2.id,
              label: computedField2.label,
              riskArea: expect.objectContaining({
                id: riskArea2.id,
                title: riskArea2.title,
              }),
            }),
            patientScreeningToolSubmissionId: null,
            riskAreaAssessmentSubmissionId: null,
          }),
        );
      });
    });

    it('accepts a carePlanSuggestion', async () => {
      const { patient, concern, riskAreaAssessmentSubmission, user } = await setup(txn);

      const carePlanSuggestion = await CarePlanSuggestion.create(
        {
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          patientId: patient.id,
          suggestionType: 'concern' as CarePlanSuggestionType,
          concernId: concern.id,
        },
        txn,
      );

      await CarePlanSuggestion.acceptForConcern(
        {
          concernId: carePlanSuggestion.concernId!,
          patientId: carePlanSuggestion.patientId,
          acceptedById: user.id,
        },
        txn,
      );

      const fetchedCarePlanSuggestion = await CarePlanSuggestion.get(carePlanSuggestion.id, txn);
      expect(fetchedCarePlanSuggestion!.acceptedAt).not.toBeFalsy();
      expect(fetchedCarePlanSuggestion!.acceptedBy).toMatchObject(user);
    });

    it('accepts duplicate concern suggestions', async () => {
      const { patient, concern, riskAreaAssessmentSubmission, user } = await setup(txn);

      await CarePlanSuggestion.createMultiple(
        {
          suggestions: [
            {
              type: 'riskAreaAssessmentSubmission',
              riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
              patientId: patient.id,
              suggestionType: 'concern' as CarePlanSuggestionType,
              concernId: concern.id,
            },
            {
              type: 'riskAreaAssessmentSubmission',
              riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
              patientId: patient.id,
              suggestionType: 'concern' as CarePlanSuggestionType,
              concernId: concern.id,
            },
          ],
        },
        txn,
      );
      const suggestions = await CarePlanSuggestion.query(txn).where({
        concernId: concern.id,
        acceptedAt: null,
      });
      expect(suggestions.length).toEqual(2);

      // getForPatient should NOT de-dupe them
      const suggestionsForPatient = await CarePlanSuggestion.getFromRiskAreaAssessmentsForPatient(
        patient.id,
        txn,
      );
      expect(suggestionsForPatient.length).toEqual(2);

      // accept for that concernId
      await CarePlanSuggestion.acceptForConcern(
        {
          concernId: suggestions[0].concernId!,
          patientId: suggestions[0].patientId,
          acceptedById: user.id,
        },
        txn,
      );

      // getForPatient should return correct number as well
      const suggestionsForPatientAfterAccepting = await CarePlanSuggestion.getFromRiskAreaAssessmentsForPatient(
        patient.id,
        txn,
      );
      expect(suggestionsForPatientAfterAccepting.length).toEqual(0);

      const suggestionsAfterAccepting = await CarePlanSuggestion.query(txn).where({
        concernId: concern.id,
        acceptedAt: null,
      });

      expect(suggestionsAfterAccepting.length).toEqual(0);
    });

    it('accepts duplicate goal suggestions', async () => {
      const { patient, goalSuggestionTemplate, riskAreaAssessmentSubmission, user } = await setup(
        txn,
      );

      await CarePlanSuggestion.createMultiple(
        {
          suggestions: [
            {
              type: 'riskAreaAssessmentSubmission',
              riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
              patientId: patient.id,
              suggestionType: 'goal' as CarePlanSuggestionType,
              goalSuggestionTemplateId: goalSuggestionTemplate.id,
            },
            {
              type: 'riskAreaAssessmentSubmission',
              riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
              patientId: patient.id,
              suggestionType: 'goal' as CarePlanSuggestionType,
              goalSuggestionTemplateId: goalSuggestionTemplate.id,
            },
          ],
        },
        txn,
      );
      const suggestions = await CarePlanSuggestion.query(txn).where({
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        acceptedAt: null,
      });
      expect(suggestions.length).toEqual(2);

      // getForPatient should NOT de-dupe them
      const suggestionsForPatient = await CarePlanSuggestion.getFromRiskAreaAssessmentsForPatient(
        patient.id,
        txn,
      );
      expect(suggestionsForPatient.length).toEqual(2);

      // accept for that goal template
      await CarePlanSuggestion.acceptForGoal(
        {
          goalSuggestionTemplateId: suggestions[0].goalSuggestionTemplateId!,
          patientId: suggestions[0].patientId,
          acceptedById: user.id,
        },
        txn,
      );

      const suggestionsAfterAccepting = await CarePlanSuggestion.query(txn).where({
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        acceptedAt: null,
      });

      // getForPatient should return correct number as well
      const suggestionsForPatientAfterAccepting = await CarePlanSuggestion.getFromRiskAreaAssessmentsForPatient(
        patient.id,
        txn,
      );
      expect(suggestionsForPatientAfterAccepting.length).toEqual(0);

      expect(suggestionsAfterAccepting.length).toEqual(0);
    });

    it('dismisses a carePlanSuggestion', async () => {
      const { patient, concern, riskAreaAssessmentSubmission, user } = await setup(txn);

      const carePlanSuggestion = await CarePlanSuggestion.create(
        {
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          patientId: patient.id,
          suggestionType: 'concern' as CarePlanSuggestionType,
          concernId: concern.id,
        },
        txn,
      );

      await CarePlanSuggestion.dismiss(
        {
          carePlanSuggestionId: carePlanSuggestion.id,
          dismissedById: user.id,
          dismissedReason: 'Because',
        },
        txn,
      );

      const fetchedCarePlanSuggestion = await CarePlanSuggestion.get(carePlanSuggestion.id, txn);
      expect(fetchedCarePlanSuggestion!.dismissedAt).not.toBeFalsy();
      expect(fetchedCarePlanSuggestion!.dismissedBy).toMatchObject(user);
      expect(fetchedCarePlanSuggestion!.dismissedReason).toEqual('Because');
    });

    it('does not return accepted or dismissed carePlanSuggestions for a patient', async () => {
      const {
        patient,
        concern,
        riskAreaAssessmentSubmission,
        user,
        goalSuggestionTemplate,
      } = await setup(txn);
      const concern2 = await Concern.create({ title: 'Second Concern' }, txn);

      const carePlanSuggestion1 = await CarePlanSuggestion.create(
        {
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          patientId: patient.id,
          suggestionType: 'concern' as CarePlanSuggestionType,
          concernId: concern.id,
        },
        txn,
      );
      const carePlanSuggestion2 = await CarePlanSuggestion.create(
        {
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          patientId: patient.id,
          suggestionType: 'concern' as CarePlanSuggestionType,
          concernId: concern2.id,
        },
        txn,
      );
      const carePlanSuggestion3 = await CarePlanSuggestion.create(
        {
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          patientId: patient.id,
          suggestionType: 'goal' as CarePlanSuggestionType,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
        },
        txn,
      );

      await CarePlanSuggestion.dismiss(
        {
          carePlanSuggestionId: carePlanSuggestion1.id,
          dismissedById: user.id,
          dismissedReason: 'Because',
        },
        txn,
      );
      await CarePlanSuggestion.acceptForConcern(
        {
          concernId: carePlanSuggestion2.concernId!,
          patientId: carePlanSuggestion2.patientId,
          acceptedById: user.id,
        },
        txn,
      );

      const patientCarePlanSuggestions = await CarePlanSuggestion.getFromRiskAreaAssessmentsForPatient(
        patient.id,
        txn,
      );
      expect(patientCarePlanSuggestions.length).toEqual(1);
      expect(patientCarePlanSuggestions[0].id).toEqual(carePlanSuggestion3.id);
    });
  });

  it('gets patient id for a given care plan suggestion', async () => {
    const { patient, concern, riskAreaAssessmentSubmission } = await setup(txn);

    const suggestion = await CarePlanSuggestion.create(
      {
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        patientId: patient.id,
        suggestionType: 'concern' as CarePlanSuggestionType,
        concernId: concern.id,
      },
      txn,
    );

    const fetchedPatientId = await CarePlanSuggestion.getPatientIdForResource(suggestion.id, txn);

    expect(fetchedPatientId).toBe(patient.id);
  });
});
