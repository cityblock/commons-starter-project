import { transaction, Transaction } from 'objection';
import uuid from 'uuid/v4';
import { createMockClinic, createPatient } from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientDisenrollment from '../patient-disenrollment';

interface ISetup {
  patient: Patient;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const patient = await createPatient({ cityblockId: 12, homeClinicId: clinic.id }, txn);

  return { patient };
}

describe('Patient Disenrollment Model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(PatientDisenrollment.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('should create and get a disenrollment for patient', async () => {
    const { patient } = await setup(txn);

    await PatientDisenrollment.create(
      {
        patientId: patient.id,
        reason: 'moved',
        note: 'relocated beyond the Wall',
      },
      txn,
    );

    const disenrollment = await PatientDisenrollment.getForPatient(patient.id, txn);

    expect(disenrollment).toMatchObject({
      patientId: patient.id,
      reason: 'moved',
      note: 'relocated beyond the Wall',
    });
  });

  it('should not disenroll patient for other reason with no explanation', async () => {
    const { patient } = await setup(txn);

    await expect(
      PatientDisenrollment.create(
        {
          patientId: patient.id,
          reason: 'other',
        },
        txn,
      ),
    ).rejects.toMatch('Must include note if disenrolling for other reason');
  });

  it('should return null if no disenrollment for patient', async () => {
    const disenrollment = await PatientDisenrollment.getForPatient(uuid(), txn);

    expect(disenrollment).toBeNull();
  });
});
