import { transaction, Transaction } from 'objection';
import Db from '../../db';
import { createMockClinic, createMockPhone, createPatient } from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientPhone from '../patient-phone';
import Phone from '../phone';

interface ISetup {
  patient: Patient;
  phone: Phone;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const phone = await Phone.create(createMockPhone(), txn);

  return { patient, phone, clinic };
}

describe('patient phone model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(PatientPhone.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('create', async () => {
    it('should create patient to phone join', async () => {
      const { patient, phone } = await setup(txn);
      const patientPhone = await PatientPhone.create(
        {
          patientId: patient.id,
          phoneId: phone.id,
        },
        txn,
      );

      expect(patientPhone.length).toBe(1);
      expect(patientPhone[0]).toMatchObject({
        phoneNumber: '+11234567890',
      });
    });
  });

  describe('delete', async () => {
    it('should mark patient phone relationship as deleted', async () => {
      const { patient, phone } = await setup(txn);
      const patientPhone = await PatientPhone.create(
        {
          patientId: patient.id,
          phoneId: phone.id,
        },
        txn,
      );

      expect(patientPhone.length).toBe(1);
      expect(patientPhone[0]).toMatchObject({
        phoneNumber: '+11234567890',
      });

      const remainingPhones = await PatientPhone.delete(
        {
          patientId: patient.id,
          phoneId: phone.id,
        },
        txn,
      );
      expect(remainingPhones.length).toBe(0);
    });
  });

  describe('get for patient', async () => {
    it('should get all non deleted phones for a patient', async () => {
      const { patient, phone, clinic } = await setup(txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);

      // second phone for the same patient
      const phone2 = await Phone.create({ phoneNumber: '111-111-1111' }, txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone2.id }, txn);

      // third phone for the same patient that gets deleted
      const phone3 = await Phone.create({ phoneNumber: '222-222-2222' }, txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone3.id }, txn);
      await PatientPhone.delete({ patientId: patient.id, phoneId: phone3.id }, txn);

      // phone for another patient
      const patient2 = await createPatient({ cityblockId: 124, homeClinicId: clinic.id }, txn);
      const phone4 = await Phone.create({ phoneNumber: '333-333-3333' }, txn);
      await PatientPhone.create({ patientId: patient2.id, phoneId: phone4.id }, txn);

      const phones = await PatientPhone.getAll(patient.id, txn);
      expect(phones.length).toBe(2);
      expect(phones[0]).toMatchObject({ phoneNumber: '+11234567890' });
      expect(phones[1]).toMatchObject({ phoneNumber: '+11111111111' });
    });
  });
});
