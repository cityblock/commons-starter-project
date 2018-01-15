import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientTaskSuggestion from '../patient-task-suggestion';
import TaskTemplate from '../task-template';
import User from '../user';

const userRole = 'physician';

interface ISetup {
  patient: Patient;
  user: User;
  taskTemplate: TaskTemplate;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient(createMockPatient(123, clinic.id), user.id, txn);
  const taskTemplate = await TaskTemplate.create(
    {
      title: 'Housing',
      repeating: false,
      priority: 'low',
      careTeamAssigneeRole: 'physician',
    },
    txn,
  );
  return { clinic, user, patient, taskTemplate };
}

describe('patient task suggestion', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('patient task suggestion methods', () => {
    it('creates and fetches a task template', async () => {
      await transaction(PatientTaskSuggestion.knex(), async txn => {
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
    });

    it('throws an error when getting an invalid id', async () => {
      await transaction(PatientTaskSuggestion.knex(), async txn => {
        const fakeId = uuid();
        await expect(PatientTaskSuggestion.get(fakeId, txn)).rejects.toMatch(
          `No such patientTaskSuggestion: ${fakeId}`,
        );
      });
    });

    it('finds a task suggestion for a patient', async () => {
      await transaction(PatientTaskSuggestion.knex(), async txn => {
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
    });

    it('creates multiple patientTaskSuggestions at once', async () => {
      await transaction(PatientTaskSuggestion.knex(), async txn => {
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
    });

    it('accepts a patientTaskSuggestion', async () => {
      await transaction(PatientTaskSuggestion.knex(), async txn => {
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
    });

    it('dismisses a patientTaskSuggestion', async () => {
      await transaction(PatientTaskSuggestion.knex(), async txn => {
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
    });

    it('does not return accepted or dismissed patientTaskSuggestions for a patient', async () => {
      await transaction(PatientTaskSuggestion.knex(), async txn => {
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
    });
  });
});
