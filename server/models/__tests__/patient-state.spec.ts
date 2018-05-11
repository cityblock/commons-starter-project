import { transaction, Transaction } from 'objection';
import { CurrentPatientState, UserRole } from 'schema';

import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientState from '../patient-state';
import User from '../user';

const userRole = 'physician' as UserRole;

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
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(PatientState.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('gets a patient state model for a patient', async () => {
    const { patient } = await setup(txn);
    const patientState = await PatientState.getForPatient(patient.id, txn);

    expect(patientState).not.toBeNull();
  });

  it('updates and gets a patient state for a patient', async () => {
    const { patient, user } = await setup(txn);
    const patientState = await PatientState.getForPatient(patient.id, txn);

    expect(patientState!.currentState).toEqual('attributed');

    await PatientState.updateForPatient(
      {
        patientId: patient.id,
        updatedById: user.id,
        currentState: 'assigned' as CurrentPatientState,
      },
      txn,
    );
    const refetchedPatientState = await PatientState.getForPatient(patient.id, txn);

    expect(refetchedPatientState!.currentState).toEqual('assigned');
  });
});
