import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  createMockClinic,
  createMockUser,
  createPatient,
  createRiskArea,
} from '../../spec-helpers';
import CarePlanSuggestion from '../care-plan-suggestion';
import Clinic from '../clinic';
import Concern from '../concern';
import GoalSuggestionTemplate from '../goal-suggestion-template';
import Patient from '../patient';
import PatientConcern from '../patient-concern';
import PatientGoal from '../patient-goal';
import RiskArea from '../risk-area';
import RiskAreaAssessmentSubmission from '../risk-area-assessment-submission';
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
  const user = await User.create(createMockUser(11, clinic.id, 'physician'), txn);
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

describe('care plan suggestion', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('care plan suggestion methods', () => {
    it('creates and fetches a care plan suggestion', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
        const { patient, concern, riskAreaAssessmentSubmission } = await setup(txn);
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

        const fetchedCarePlanSuggestion = await CarePlanSuggestion.get(carePlanSuggestion.id, txn);
        expect(fetchedCarePlanSuggestion!.concern!.id).toEqual(concern.id);
      });
    });

    it('throws an error when getting an invalid id', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
        const fakeId = uuid();
        await expect(CarePlanSuggestion.get(fakeId, txn)).rejects.toMatch(
          `No such carePlanSuggestion: ${fakeId}`,
        );
      });
    });

    it('finds a care plan suggestion for a given concern if it exists', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
        const { patient, concern, riskAreaAssessmentSubmission } = await setup(txn);

        const concern2 = await Concern.create({ title: 'Second Concern' }, txn);
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

        expect(foundCarePlanSuggestion!.id).toEqual(carePlanSuggestion.id);
        expect(notFoundCarePlanSuggestion).toBeFalsy();
      });
    });

    it('creates multiple carePlanSuggestions at once', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
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
                suggestionType: 'concern',
                concernId: concern.id,
              },
              {
                type: 'riskAreaAssessmentSubmission',
                riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
                patientId: patient.id,
                suggestionType: 'goal',
                goalSuggestionTemplateId: goalSuggestionTemplate.id,
              },
            ],
          },
          txn,
        );

        const fetchedCarePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id, txn);

        expect(fetchedCarePlanSuggestions.length).toEqual(2);

        const goalSuggestion = fetchedCarePlanSuggestions.find(s => s.suggestionType === 'goal');
        const concernSuggestion = fetchedCarePlanSuggestions.find(
          s => s.suggestionType === 'concern',
        );

        expect(concernSuggestion!.concern!.id).toEqual(concern.id);
        expect(goalSuggestion!.goalSuggestionTemplate).toMatchObject(goalSuggestionTemplate);
      });
    });

    it('gets carePlanSuggestions for a patient', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
        const { patient, concern, riskAreaAssessmentSubmission } = await setup(txn);

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

        const patientCarePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id, txn);

        expect(patientCarePlanSuggestions.length).toEqual(1);
        expect(patientCarePlanSuggestions[0].concern!.id).toEqual(concern.id);
      });
    });

    it('does not get suggestions for which a patientConcern exists', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
        const {
          patient,
          concern,
          riskAreaAssessmentSubmission,
          user,
          goalSuggestionTemplate,
        } = await setup(txn);

        const concern2 = await Concern.create({ title: 'Second Concern' }, txn);

        await CarePlanSuggestion.createMultiple(
          {
            suggestions: [
              {
                type: 'riskAreaAssessmentSubmission',
                riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
                patientId: patient.id,
                suggestionType: 'concern',
                concernId: concern.id,
              },
              {
                type: 'riskAreaAssessmentSubmission',
                riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
                patientId: patient.id,
                suggestionType: 'concern',
                concernId: concern2.id,
              },
            ],
          },
          txn,
        );

        await PatientConcern.create(
          {
            patientId: patient.id,
            concernId: concern.id,
            userId: user.id,
          },
          txn,
        );
        await PatientGoal.create(
          {
            title: 'Patient Goal',
            userId: user.id,
            patientId: patient.id,
            goalSuggestionTemplateId: goalSuggestionTemplate.id,
          },
          txn,
        );

        const patientCarePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id, txn);

        expect(patientCarePlanSuggestions.length).toEqual(1);
        const concernSuggestion = patientCarePlanSuggestions.find(
          s => s.suggestionType === 'concern',
        );

        expect(concernSuggestion!.concernId).toEqual(concern2.id);
      });
    });

    it('accepts a carePlanSuggestion', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
        const { patient, concern, riskAreaAssessmentSubmission, user } = await setup(txn);

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

        await CarePlanSuggestion.accept(carePlanSuggestion, user.id, txn);

        const fetchedCarePlanSuggestion = await CarePlanSuggestion.get(carePlanSuggestion.id, txn);
        expect(fetchedCarePlanSuggestion!.acceptedAt).not.toBeFalsy();
        expect(fetchedCarePlanSuggestion!.acceptedBy).toMatchObject(user);
      });
    });

    it('accepts duplicate concern suggestions', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
        const { patient, concern, riskAreaAssessmentSubmission, user } = await setup(txn);

        await CarePlanSuggestion.createMultiple(
          {
            suggestions: [
              {
                type: 'riskAreaAssessmentSubmission',
                riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
                patientId: patient.id,
                suggestionType: 'concern',
                concernId: concern.id,
              },
              {
                type: 'riskAreaAssessmentSubmission',
                riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
                patientId: patient.id,
                suggestionType: 'concern',
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
        const suggestionsForPatient = await CarePlanSuggestion.getForPatient(patient.id, txn);
        expect(suggestionsForPatient.length).toEqual(2);

        await CarePlanSuggestion.accept(suggestions[0], user.id, txn);

        // getForPatient should return correct number as well
        const suggestionsForPatientAfterAccepting = await CarePlanSuggestion.getForPatient(
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
    });

    it('accepts duplicate goal suggestions', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
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
                suggestionType: 'goal',
                goalSuggestionTemplateId: goalSuggestionTemplate.id,
              },
              {
                type: 'riskAreaAssessmentSubmission',
                riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
                patientId: patient.id,
                suggestionType: 'goal',
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
        const suggestionsForPatient = await CarePlanSuggestion.getForPatient(patient.id, txn);
        expect(suggestionsForPatient.length).toEqual(2);

        await CarePlanSuggestion.accept(suggestions[0], user.id, txn);

        const suggestionsAfterAccepting = await CarePlanSuggestion.query(txn).where({
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          acceptedAt: null,
        });

        // getForPatient should return correct number as well
        const suggestionsForPatientAfterAccepting = await CarePlanSuggestion.getForPatient(
          patient.id,
          txn,
        );
        expect(suggestionsForPatientAfterAccepting.length).toEqual(0);

        expect(suggestionsAfterAccepting.length).toEqual(0);
      });
    });

    it('dismisses a carePlanSuggestion', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
        const { patient, concern, riskAreaAssessmentSubmission, user } = await setup(txn);

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
    });

    it('does not return accepted or dismissed carePlanSuggestions for a patient', async () => {
      await transaction(CarePlanSuggestion.knex(), async txn => {
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
            suggestionType: 'concern',
            concernId: concern.id,
          },
          txn,
        );
        const carePlanSuggestion2 = await CarePlanSuggestion.create(
          {
            type: 'riskAreaAssessmentSubmission',
            riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
            patientId: patient.id,
            suggestionType: 'concern',
            concernId: concern2.id,
          },
          txn,
        );
        const carePlanSuggestion3 = await CarePlanSuggestion.create(
          {
            type: 'riskAreaAssessmentSubmission',
            riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
            patientId: patient.id,
            suggestionType: 'goal',
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
        await CarePlanSuggestion.accept(carePlanSuggestion2, user.id, txn);

        const patientCarePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id, txn);
        expect(patientCarePlanSuggestions.length).toEqual(1);
        expect(patientCarePlanSuggestions[0].id).toEqual(carePlanSuggestion3.id);
      });
    });
  });

  it('gets patient id for a given care plan suggestion', async () => {
    await transaction(CarePlanSuggestion.knex(), async txn => {
      const { patient, concern, riskAreaAssessmentSubmission } = await setup(txn);

      const suggestion = await CarePlanSuggestion.create(
        {
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          patientId: patient.id,
          suggestionType: 'concern',
          concernId: concern.id,
        },
        txn,
      );

      const fetchedPatientId = await CarePlanSuggestion.getPatientIdForResource(suggestion.id, txn);

      expect(fetchedPatientId).toBe(patient.id);
    });
  });
});
