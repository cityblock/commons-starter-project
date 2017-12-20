import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  createMockClinic,
  createMockPatient,
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

describe('care plan suggestion', () => {
  let patient: Patient;
  let user: User;
  let clinic: Clinic;
  let concern: Concern;
  let goalSuggestionTemplate: GoalSuggestionTemplate;
  let riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission;
  let riskArea: RiskArea;

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, 'physician'));
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    concern = await Concern.create({ title: 'Concern' });
    riskArea = await createRiskArea({ title: 'testing' });
    goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'Goal Template' });
    riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create({
      patientId: patient.id,
      userId: user.id,
      riskAreaId: riskArea.id,
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('care plan suggestion methods', () => {
    it('creates and fetches a care plan suggestion', async () => {
      const carePlanSuggestion = await CarePlanSuggestion.create({
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern.id,
      });

      const fetchedCarePlanSuggestion = await CarePlanSuggestion.get(carePlanSuggestion.id);
      expect(fetchedCarePlanSuggestion!.concern).toMatchObject(concern);
    });

    it('throws an error when getting an invalid id', async () => {
      const fakeId = uuid();
      await expect(CarePlanSuggestion.get(fakeId)).rejects.toMatch(
        `No such carePlanSuggestion: ${fakeId}`,
      );
    });

    it('finds a care plan suggestion for a given concern if it exists', async () => {
      const concern2 = await Concern.create({ title: 'Second Concern' });
      const carePlanSuggestion = await CarePlanSuggestion.create({
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern.id,
      });

      const foundCarePlanSuggestion = await CarePlanSuggestion.findForPatientAndConcern(
        patient.id,
        concern.id,
      );
      const notFoundCarePlanSuggestion = await CarePlanSuggestion.findForPatientAndConcern(
        patient.id,
        concern2.id,
      );

      expect(foundCarePlanSuggestion!.id).toEqual(carePlanSuggestion.id);
      expect(notFoundCarePlanSuggestion).toBeFalsy();
    });

    it('creates multiple carePlanSuggestions at once', async () => {
      await CarePlanSuggestion.createMultiple({
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
      });

      const fetchedCarePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id);

      expect(fetchedCarePlanSuggestions.length).toEqual(2);

      const goalSuggestion = fetchedCarePlanSuggestions.find(s => s.suggestionType === 'goal');
      const concernSuggestion = fetchedCarePlanSuggestions.find(
        s => s.suggestionType === 'concern',
      );

      expect(concernSuggestion!.concern).toMatchObject(concern);
      expect(goalSuggestion!.goalSuggestionTemplate).toMatchObject(goalSuggestionTemplate);
    });

    it('gets carePlanSuggestions for a patient', async () => {
      await CarePlanSuggestion.create({
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern.id,
      });

      const patientCarePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id);

      expect(patientCarePlanSuggestions.length).toEqual(1);
      expect(patientCarePlanSuggestions[0].concern).toMatchObject(concern);
    });

    it('does not get suggestions for which a patientGoal or patientConcern exists', async () => {
      const concern2 = await Concern.create({ title: 'Second Concern' });
      const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create({ title: 'Second Goal' });

      await CarePlanSuggestion.createMultiple({
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
            goalSuggestionTemplateId: goalSuggestionTemplate2.id,
          },
        ],
      });

      await PatientConcern.create({
        patientId: patient.id,
        concernId: concern.id,
        userId: user.id,
      });
      await PatientGoal.create({
        title: 'Patient Goal',
        userId: user.id,
        patientId: patient.id,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
      });

      const patientCarePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id);

      expect(patientCarePlanSuggestions.length).toEqual(2);
      const goalSuggestion = patientCarePlanSuggestions.find(s => s.suggestionType === 'goal');
      const concernSuggestion = patientCarePlanSuggestions.find(
        s => s.suggestionType === 'concern',
      );

      expect(concernSuggestion!.concernId).toEqual(concern2.id);
      expect(goalSuggestion!.goalSuggestionTemplateId).toEqual(goalSuggestionTemplate2.id);
    });

    it('accepts a carePlanSuggestion', async () => {
      const carePlanSuggestion = await CarePlanSuggestion.create({
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern.id,
      });

      await CarePlanSuggestion.accept(carePlanSuggestion.id, user.id);

      const fetchedCarePlanSuggestion = await CarePlanSuggestion.get(carePlanSuggestion.id);
      expect(fetchedCarePlanSuggestion!.acceptedAt).not.toBeFalsy();
      expect(fetchedCarePlanSuggestion!.acceptedBy).toMatchObject(user);
    });

    it('dismisses a carePlanSuggestion', async () => {
      const carePlanSuggestion = await CarePlanSuggestion.create({
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern.id,
      });

      await CarePlanSuggestion.dismiss({
        carePlanSuggestionId: carePlanSuggestion.id,
        dismissedById: user.id,
        dismissedReason: 'Because',
      });

      const fetchedCarePlanSuggestion = await CarePlanSuggestion.get(carePlanSuggestion.id);
      expect(fetchedCarePlanSuggestion!.dismissedAt).not.toBeFalsy();
      expect(fetchedCarePlanSuggestion!.dismissedBy).toMatchObject(user);
      expect(fetchedCarePlanSuggestion!.dismissedReason).toEqual('Because');
    });

    it('does not return accepted or dismissed carePlanSuggestions for a patient', async () => {
      const concern2 = await Concern.create({ title: 'Second Concern' });

      const carePlanSuggestion1 = await CarePlanSuggestion.create({
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern.id,
      });
      const carePlanSuggestion2 = await CarePlanSuggestion.create({
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern2.id,
      });
      const carePlanSuggestion3 = await CarePlanSuggestion.create({
        type: 'riskAreaAssessmentSubmission',
        riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
        patientId: patient.id,
        suggestionType: 'goal',
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
      });

      await CarePlanSuggestion.dismiss({
        carePlanSuggestionId: carePlanSuggestion1.id,
        dismissedById: user.id,
        dismissedReason: 'Because',
      });
      await CarePlanSuggestion.accept(carePlanSuggestion2.id, user.id);

      const patientCarePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id);
      expect(patientCarePlanSuggestions.length).toEqual(1);
      expect(patientCarePlanSuggestions[0].id).toEqual(carePlanSuggestion3.id);
    });
  });
});
