import { transaction, Transaction } from 'objection';
import { Priority, UserRole } from 'schema';
import * as uuid from 'uuid/v4';

import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientTaskSuggestion from '../patient-task-suggestion';
import TaskTemplate from '../task-template';
import User from '../user';

const userRole = 'physician' as UserRole;

interface ISetup {
  patient: Patient;
  user: User;
  taskTemplate: TaskTemplate;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const taskTemplate = await TaskTemplate.create(
    {
      title: 'Housing',
      repeating: false,
      priority: 'low' as Priority,
      careTeamAssigneeRole: userRole,
    },
    txn,
  );
  return { clinic, user, patient, taskTemplate };
}

describe('patient task suggestion', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(PatientTaskSuggestion.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('patient task suggestion methods', () => {
    it('creates and fetches a task template', async () => {
      const { patient, taskTemplate } = await setup(txn);
      const patientTaskSuggestion = await PatientTaskSuggestion.create(
        {
          patientId: patient.id,
          taskTemplateId: taskTemplate.id,
        },
        txn,
      );

      const fetchPatientTaskSuggestion = await PatientTaskSuggestion.get(
        patientTaskSuggestion.id,
        txn,
      );
      expect(fetchPatientTaskSuggestion!.taskTemplate).toMatchObject(taskTemplate);
    });

    it('throws an error when getting an invalid id', async () => {
      const fakeId = uuid();
      await expect(PatientTaskSuggestion.get(fakeId, txn)).rejects.toMatch(
        `No such patientTaskSuggestion: ${fakeId}`,
      );
    });

    it('finds a task suggestion for a patient', async () => {
      const { patient, taskTemplate } = await setup(txn);

      const patientTaskSuggestion = await PatientTaskSuggestion.create(
        {
          patientId: patient.id,
          taskTemplateId: taskTemplate.id,
        },
        txn,
      );

      const foundPatientTaskSuggestions = await PatientTaskSuggestion.getForPatient(
        patient.id,
        txn,
      );
      expect(foundPatientTaskSuggestions.length).toEqual(1);
      expect(foundPatientTaskSuggestions[0].id).toEqual(patientTaskSuggestion.id);
    });

    it('creates multiple patientTaskSuggestions at once', async () => {
      const { patient, taskTemplate } = await setup(txn);

      await PatientTaskSuggestion.createMultiple(
        {
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
        },
        txn,
      );

      const fetchedPatientTaskSuggestions = await PatientTaskSuggestion.getForPatient(
        patient.id,
        txn,
      );
      expect(fetchedPatientTaskSuggestions.length).toEqual(2);
      expect(fetchedPatientTaskSuggestions[0].taskTemplate).toMatchObject(taskTemplate);
      expect(fetchedPatientTaskSuggestions[1].taskTemplate).toMatchObject(taskTemplate);
    });

    it('accepts a patientTaskSuggestion', async () => {
      const { patient, taskTemplate, user } = await setup(txn);

      const patientTaskSuggestion = await PatientTaskSuggestion.create(
        {
          patientId: patient.id,
          taskTemplateId: taskTemplate.id,
        },
        txn,
      );

      await PatientTaskSuggestion.accept(patientTaskSuggestion.id, user.id, txn);

      const fetchedPatientTaskSuggestion = await PatientTaskSuggestion.get(
        patientTaskSuggestion.id,
        txn,
      );
      expect(fetchedPatientTaskSuggestion!.acceptedAt).not.toBeFalsy();
      expect(fetchedPatientTaskSuggestion!.acceptedBy).toMatchObject(user);
    });

    it('dismisses a patientTaskSuggestion', async () => {
      const { patient, taskTemplate, user } = await setup(txn);

      const patientTaskSuggestion = await PatientTaskSuggestion.create(
        {
          patientId: patient.id,
          taskTemplateId: taskTemplate.id,
        },
        txn,
      );

      await PatientTaskSuggestion.dismiss(
        {
          patientTaskSuggestionId: patientTaskSuggestion.id,
          dismissedById: user.id,
          dismissedReason: 'Because',
        },
        txn,
      );

      const fetchedPatientTaskSuggestion = await PatientTaskSuggestion.get(
        patientTaskSuggestion.id,
        txn,
      );
      expect(fetchedPatientTaskSuggestion!.dismissedAt).not.toBeFalsy();
      expect(fetchedPatientTaskSuggestion!.dismissedBy).toMatchObject(user);
      expect(fetchedPatientTaskSuggestion!.dismissedReason).toEqual('Because');
    });

    it('does not return accepted or dismissed patientTaskSuggestions for a patient', async () => {
      const { patient, taskTemplate, user } = await setup(txn);

      const patientTaskSuggestion1 = await PatientTaskSuggestion.create(
        {
          patientId: patient.id,
          taskTemplateId: taskTemplate.id,
        },
        txn,
      );
      const patientTaskSuggestion2 = await PatientTaskSuggestion.create(
        {
          patientId: patient.id,
          taskTemplateId: taskTemplate.id,
        },
        txn,
      );
      const patientTaskSuggestion3 = await PatientTaskSuggestion.create(
        {
          patientId: patient.id,
          taskTemplateId: taskTemplate.id,
        },
        txn,
      );

      await PatientTaskSuggestion.dismiss(
        {
          patientTaskSuggestionId: patientTaskSuggestion1.id,
          dismissedById: user.id,
          dismissedReason: 'Because',
        },
        txn,
      );
      await PatientTaskSuggestion.accept(patientTaskSuggestion2.id, user.id, txn);

      const patientPatientTaskSuggestions = await PatientTaskSuggestion.getForPatient(
        patient.id,
        txn,
      );
      expect(patientPatientTaskSuggestions.length).toEqual(1);
      expect(patientPatientTaskSuggestions[0].id).toEqual(patientTaskSuggestion3.id);
    });

    it('gets patient id for a given patient task suggestion', async () => {
      const { patient, taskTemplate } = await setup(txn);
      const patientTaskSuggestion = await PatientTaskSuggestion.create(
        {
          patientId: patient.id,
          taskTemplateId: taskTemplate.id,
        },
        txn,
      );

      const fetchedPatientId = await PatientTaskSuggestion.getPatientIdForResource(
        patientTaskSuggestion.id,
        txn,
      );

      expect(fetchedPatientId).toBe(patient.id);
    });
  });
});
