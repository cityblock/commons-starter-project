import { transaction, Transaction } from 'objection';
import Db from '../../db';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientState from '../patient-state';
import User from '../user';

const userRole = 'physician';

interface ISetup {
  clinic: Clinic;
  user: User;
  patient: Patient;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
  const patient = await createPatient(
    {
      cityblockId: 123,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );

  return { clinic, user, patient };
}

describe('patient state model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('gets a patient state model for a patient', async () => {
    await transaction(PatientState.knex(), async txn => {
      const { patient } = await setup(txn);
      const patientState = await PatientState.getForPatient(patient.id, txn);

      expect(patientState).not.toBeNull();
    });
  });

  it('updates and gets a patient state for a patient', async () => {
    await transaction(PatientState.knex(), async txn => {
      const { patient, user } = await setup(txn);
      const patientState = await PatientState.getForPatient(patient.id, txn);

      expect(patientState!.currentState).toEqual('attributed');

      await PatientState.updateForPatient(
        {
          patientId: patient.id,
          updatedById: user.id,
          currentState: 'assigned',
        },
        txn,
      );
      const refetchedPatientState = await PatientState.getForPatient(patient.id, txn);

      expect(refetchedPatientState!.currentState).toEqual('assigned');
    });
  });
});
