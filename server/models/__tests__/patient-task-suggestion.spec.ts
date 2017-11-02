import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createMockPatient, createPatient } from '../../spec-helpers';
import Patient from '../patient';
import PatientTaskSuggestion from '../patient-task-suggestion';
import TaskTemplate from '../task-template';
import User from '../user';

describe('patient task suggestion', () => {
  let db: Db;
  let patient: Patient;
  let user: User;
  let taskTemplate: TaskTemplate;
  const homeClinicId = uuid();

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    user = await User.create({ email: 'user@email.com', homeClinicId, userRole: 'physician' });
    patient = await createPatient(createMockPatient(123, homeClinicId), user.id);
    taskTemplate = await TaskTemplate.create({
      title: 'Housing',
      repeating: false,
      priority: 'low',
      careTeamAssigneeRole: 'physician',
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('patient task suggestion methods', () => {
    it('creates and fetches a task template', async () => {
      const patientTaskSuggestion = await PatientTaskSuggestion.create({
        patientId: patient.id,
        taskTemplateId: taskTemplate.id,
      });

      const fetchPatientTaskSuggestion = await PatientTaskSuggestion.get(patientTaskSuggestion.id);
      expect(fetchPatientTaskSuggestion!.taskTemplate).toMatchObject(taskTemplate);
    });

    it('throws an error when getting an invalid id', async () => {
      const fakeId = uuid();
      await expect(PatientTaskSuggestion.get(fakeId)).rejects.toMatch(
        `No such patientTaskSuggestion: ${fakeId}`,
      );
    });

    it('finds a task suggestion for a patient', async () => {
      const patientTaskSuggestion = await PatientTaskSuggestion.create({
        patientId: patient.id,
        taskTemplateId: taskTemplate.id,
      });

      const foundPatientTaskSuggestions = await PatientTaskSuggestion.getForPatient(patient.id);
      expect(foundPatientTaskSuggestions.length).toEqual(1);
      expect(foundPatientTaskSuggestions[0].id).toEqual(patientTaskSuggestion.id);
    });

    it('creates multiple patientTaskSuggestions at once', async () => {
      await PatientTaskSuggestion.createMultiple({
        suggestions: [
          {
            patientId: patient.id,
            taskTemplateId: taskTemplate.id,
          },
          {
            patientId: patient.id,
            taskTemplateId: taskTemplate.id,
          },
        ],
      });

      const fetchedPatientTaskSuggestions = await PatientTaskSuggestion.getForPatient(patient.id);
      expect(fetchedPatientTaskSuggestions.length).toEqual(2);
      expect(fetchedPatientTaskSuggestions[0].taskTemplate).toMatchObject(taskTemplate);
      expect(fetchedPatientTaskSuggestions[1].taskTemplate).toMatchObject(taskTemplate);
    });

    it('accepts a patientTaskSuggestion', async () => {
      const patientTaskSuggestion = await PatientTaskSuggestion.create({
        patientId: patient.id,
        taskTemplateId: taskTemplate.id,
      });

      await PatientTaskSuggestion.accept(patientTaskSuggestion.id, user.id);

      const fetchedPatientTaskSuggestion = await PatientTaskSuggestion.get(
        patientTaskSuggestion.id,
      );
      expect(fetchedPatientTaskSuggestion!.acceptedAt).not.toBeNull();
      expect(fetchedPatientTaskSuggestion!.acceptedBy).toMatchObject(user);
    });

    it('dismisses a patientTaskSuggestion', async () => {
      const patientTaskSuggestion = await PatientTaskSuggestion.create({
        patientId: patient.id,
        taskTemplateId: taskTemplate.id,
      });

      await PatientTaskSuggestion.dismiss({
        patientTaskSuggestionId: patientTaskSuggestion.id,
        dismissedById: user.id,
        dismissedReason: 'Because',
      });

      const fetchedPatientTaskSuggestion = await PatientTaskSuggestion.get(
        patientTaskSuggestion.id,
      );
      expect(fetchedPatientTaskSuggestion!.dismissedAt).not.toBeNull();
      expect(fetchedPatientTaskSuggestion!.dismissedBy).toMatchObject(user);
      expect(fetchedPatientTaskSuggestion!.dismissedReason).toEqual('Because');
    });

    it('does not return accepted or dismissed patientTaskSuggestions for a patient', async () => {
      const patientTaskSuggestion1 = await PatientTaskSuggestion.create({
        patientId: patient.id,
        taskTemplateId: taskTemplate.id,
      });
      const patientTaskSuggestion2 = await PatientTaskSuggestion.create({
        patientId: patient.id,
        taskTemplateId: taskTemplate.id,
      });
      const patientTaskSuggestion3 = await PatientTaskSuggestion.create({
        patientId: patient.id,
        taskTemplateId: taskTemplate.id,
      });

      await PatientTaskSuggestion.dismiss({
        patientTaskSuggestionId: patientTaskSuggestion1.id,
        dismissedById: user.id,
        dismissedReason: 'Because',
      });
      await PatientTaskSuggestion.accept(patientTaskSuggestion2.id, user.id);

      const patientPatientTaskSuggestions = await PatientTaskSuggestion.getForPatient(patient.id);
      expect(patientPatientTaskSuggestions.length).toEqual(1);
      expect(patientPatientTaskSuggestions[0].id).toEqual(patientTaskSuggestion3.id);
    });
  });
});
