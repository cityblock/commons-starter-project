import { transaction, Transaction } from 'objection';
import Db from '../../db';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Clinic from '../clinic';
import ComputedPatientStatus from '../computed-patient-status';
import Patient from '../patient';
import ProgressNote from '../progress-note';
import ProgressNoteTemplate from '../progress-note-template';
import User from '../user';

const userRole = 'physician';

interface ISetup {
  clinic: Clinic;
  progressNoteTemplate: ProgressNoteTemplate;
  user: User;
  patient: Patient;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
  const patient = await createPatient(createMockPatient(123, clinic.id), user.id, txn);
  const progressNoteTemplate = await ProgressNoteTemplate.create(
    {
      title: 'title',
    },
    txn,
  );
  return { clinic, user, patient, progressNoteTemplate };
}

describe('computed patient status model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('returns null when getting a computed patient status for a patient who has none', async () => {
    await transaction(ComputedPatientStatus.knex(), async txn => {
      const { patient } = await setup(txn);
      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus).toBeNull();
    });
  });

  it('gets a computed patient status for a patient who has one', async () => {
    await transaction(ComputedPatientStatus.knex(), async txn => {
      const { patient, user } = await setup(txn);
      await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);

      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus).not.toBeNull();
    });
  });

  it('updates and gets a computed patient status for a patient', async () => {
    await transaction(ComputedPatientStatus.knex(), async txn => {
      const { patient, user, progressNoteTemplate } = await setup(txn);

      await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
        },
        txn,
      );

      const updatedComputedPatientStatus = await ComputedPatientStatus.updateForPatient(
        patient.id,
        user.id,
        txn,
      );
      expect(updatedComputedPatientStatus.hasProgressNote).toEqual(true);

      const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
        patient.id,
        txn,
      );
      expect(refetchedComputedPatientStatus).toMatchObject(updatedComputedPatientStatus);
    });
  });

  it('updates computed patient statuses for all patients', async () => {
    await transaction(ComputedPatientStatus.knex(), async txn => {
      const { clinic, patient, user } = await setup(txn);
      const patient2 = await createPatient(createMockPatient(456, clinic.id), user.id, txn);

      const computedPatientStatus1 = await ComputedPatientStatus.getForPatient(patient.id, txn);
      const computedPatientStatus2 = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus1).toBeNull();
      expect(computedPatientStatus2).toBeNull();

      await ComputedPatientStatus.updateForAllPatients(user.id, txn);

      const refetchedPatientStatus1 = await ComputedPatientStatus.getForPatient(patient.id, txn);
      const refetchedPatientStatus2 = await ComputedPatientStatus.getForPatient(patient2.id, txn);

      expect(refetchedPatientStatus1).not.toBeNull();
      expect(refetchedPatientStatus2).not.toBeNull();
    });
  });
});
