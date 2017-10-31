import Db from '../../db';
import { createMockPatient, createPatient } from '../../spec-helpers';
import CarePlanSuggestion from '../care-plan-suggestion';
import Concern from '../concern';
import GoalSuggestionTemplate from '../goal-suggestion-template';
import Patient from '../patient';
import PatientConcern from '../patient-concern';
import PatientGoal from '../patient-goal';
import User from '../user';

describe('care plan suggestion', () => {
  let db: Db;
  let patient: Patient;
  let user: User;
  let concern: Concern;
  let goalSuggestionTemplate: GoalSuggestionTemplate;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    user = await User.create({ email: 'user@email.com', homeClinicId: '1', userRole: 'physician' });
    patient = await createPatient(createMockPatient(123, '1'), user.id);
    concern = await Concern.create({ title: 'Concern' });
    goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'Goal Template' });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('care plan suggestion methods', () => {
    it('creates and fetches a care plan suggestion', async () => {
      const carePlanSuggestion = await CarePlanSuggestion.create({
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern.id,
      });

      const fetchedCarePlanSuggestion = await CarePlanSuggestion.get(carePlanSuggestion.id);
      expect(fetchedCarePlanSuggestion!.concern).toMatchObject(concern);
    });

    it('throws an error when getting an invalid id', async () => {
      const fakeId = 'fakeId';
      await expect(CarePlanSuggestion.get(fakeId)).rejects.toMatch(
        'No such carePlanSuggestion: fakeId',
      );
    });

    it('finds a care plan suggestion for a given concern if it exists', async () => {
      const concern2 = await Concern.create({ title: 'Second Concern' });
      const carePlanSuggestion = await CarePlanSuggestion.create({
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
      expect(notFoundCarePlanSuggestion).toBeUndefined();
    });

    it('creates multiple carePlanSuggestions at once', async () => {
      await CarePlanSuggestion.createMultiple({
        suggestions: [
          {
            patientId: patient.id,
            suggestionType: 'concern',
            concernId: concern.id,
          },
          {
            patientId: patient.id,
            suggestionType: 'goal',
            goalSuggestionTemplateId: goalSuggestionTemplate.id,
          },
        ],
      });

      const fetchedCarePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id);
      expect(fetchedCarePlanSuggestions.length).toEqual(2);
      expect(fetchedCarePlanSuggestions[0].goalSuggestionTemplate).toMatchObject(
        goalSuggestionTemplate,
      );
      expect(fetchedCarePlanSuggestions[1].concern).toMatchObject(concern);
    });

    it('gets carePlanSuggestions for a patient', async () => {
      await CarePlanSuggestion.create({
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern.id,
      });

      const patientCarePlanSuggestions = await CarePlanSuggestion.getForPatient(patient.id);

      expect(patientCarePlanSuggestions.length).toEqual(1);
      expect(patientCarePlanSuggestions[0].concern).toMatchObject(concern);
    });

    it('does not get suggestions for which a patientGol or patientConcern exists', async () => {
      const concern2 = await Concern.create({ title: 'Second Concern' });
      const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create({ title: 'Second Goal' });

      await CarePlanSuggestion.createMultiple({
        suggestions: [
          {
            patientId: patient.id,
            suggestionType: 'concern',
            concernId: concern.id,
          },
          {
            patientId: patient.id,
            suggestionType: 'concern',
            concernId: concern2.id,
          },
          {
            patientId: patient.id,
            suggestionType: 'goal',
            goalSuggestionTemplateId: goalSuggestionTemplate.id,
          },
          {
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
      expect(patientCarePlanSuggestions[0].goalSuggestionTemplateId).toEqual(
        goalSuggestionTemplate2.id,
      );
      expect(patientCarePlanSuggestions[1].concernId).toEqual(concern2.id);
    });

    it('accepts a carePlanSuggestion', async () => {
      const carePlanSuggestion = await CarePlanSuggestion.create({
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern.id,
      });

      await CarePlanSuggestion.accept(carePlanSuggestion.id, user.id);

      const fetchedCarePlanSuggestion = await CarePlanSuggestion.get(carePlanSuggestion.id);
      expect(fetchedCarePlanSuggestion!.acceptedAt).not.toBeNull();
      expect(fetchedCarePlanSuggestion!.acceptedBy).toMatchObject(user);
    });

    it('dismisses a carePlanSuggestion', async () => {
      const carePlanSuggestion = await CarePlanSuggestion.create({
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
      expect(fetchedCarePlanSuggestion!.dismissedAt).not.toBeNull();
      expect(fetchedCarePlanSuggestion!.dismissedBy).toMatchObject(user);
      expect(fetchedCarePlanSuggestion!.dismissedReason).toEqual('Because');
    });

    it('does not return accepted or dismissed carePlanSuggestions for a patient', async () => {
      const concern2 = await Concern.create({ title: 'Second Concern' });

      const carePlanSuggestion1 = await CarePlanSuggestion.create({
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern.id,
      });
      const carePlanSuggestion2 = await CarePlanSuggestion.create({
        patientId: patient.id,
        suggestionType: 'concern',
        concernId: concern2.id,
      });
      const carePlanSuggestion3 = await CarePlanSuggestion.create({
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
