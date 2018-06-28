import { transaction, Transaction } from 'objection';
import Clinic from '../../server/models/clinic';
import ComputedPatientStatus from '../../server/models/computed-patient-status';
import Patient from '../../server/models/patient';
import PatientDisenrollment from '../../server/models/patient-disenrollment';
import PatientState from '../../server/models/patient-state';
import User from '../../server/models/user';
import { createMockClinic, createMockUser, createPatient } from '../../server/spec-helpers';
import { disenrollPatient } from '../disenroll-patient';

interface ISetup {
  patient: Patient;
  user: User;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(
    createMockUser(11, clinic.id, 'Pharmacist' as any, 'a@b.com'),
    txn,
  );
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

  return { user, patient };
}

describe('Disenroll Patient Script', () => {
  let txn = null as any;
  let consolePlaceholder = null as any;

  beforeEach(async () => {
    consolePlaceholder = jest.fn();
    console.log = consolePlaceholder;

    txn = await transaction.start(Patient.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('disenrollPatient', () => {
    it('disenrolls patient', async () => {
      const { patient, user } = await setup(txn);

      const patientState = await PatientState.getForPatient(patient.id, txn);

      expect(patientState!.currentState).toEqual('attributed');

      await disenrollPatient(
        ['node', 'script', patient.id, user.id, 'moved', 'went beyond the Wall'],
        txn,
      );

      const patientState2 = await PatientState.getForPatient(patient.id, txn);

      expect(patientState2!.currentState).toEqual('disenrolled');

      const disenrollment = await PatientDisenrollment.getForPatient(patient.id, txn);

      expect(disenrollment).toMatchObject({
        patientId: patient.id,
        reason: 'moved',
        note: 'went beyond the Wall',
      });

      const computedStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedStatus!.isDisenrolled).toBeTruthy();
    });

    it('logs error if it occurs', async () => {
      const { patient, user } = await setup(txn);

      await disenrollPatient(['node', 'script', patient.id, user.id, 'invalidReason'], txn);

      const args = consolePlaceholder.mock.calls;
      expect(consolePlaceholder).toHaveBeenCalledTimes(2);

      expect(args[0][0]).toMatch(`Disenrolling patient ${patient.id} for reason: invalidReason`);
      expect(args[1][0]).toMatch(
        'Error disenrolling patient: reason: should be equal to one of the allowed values',
      );
    });
  });
});
