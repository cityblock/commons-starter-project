import { transaction, Transaction } from 'objection';
import Db from '../../db';
import {
  createMockClinic,
  createMockPhone,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientPhone from '../patient-phone';
import Phone from '../phone';
import User from '../user';

const userRole = 'admin';

interface ISetup {
  patient: Patient;
  user: User;
  phone: Phone;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const phone = await Phone.create(createMockPhone(), txn);

  return { patient, phone, user, clinic };
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
        type: 'home',
        description: 'moms home phone',
      });
    });

    it('should not create same patient phone entry for given patient and phone id', async () => {
      const { patient, phone } = await setup(txn);
      await PatientPhone.create(
        {
          patientId: patient.id,
          phoneId: phone.id,
        },
        txn,
      );

      try {
        await PatientPhone.create(
          {
            patientId: patient.id,
            phoneId: phone.id,
          },
          txn,
        );
        // ensure error is thrown by failing otherwise
        expect(false).toBeTruthy();
      } catch (err) {
        expect(err.constraint).toBe('patientphone_phoneid_patientid_unique');
      }
    });

    it('should not create same patient phone entry if phone number being used by another patient', async () => {
      const { patient, phone, clinic } = await setup(txn);
      const patient2 = await createPatient({ cityblockId: 125, homeClinicId: clinic.id }, txn);
      await PatientPhone.create(
        {
          patientId: patient.id,
          phoneId: phone.id,
        },
        txn,
      );

      const phone2 = await Phone.create(createMockPhone(), txn);

      await expect(
        PatientPhone.create(
          {
            patientId: patient2.id,
            phoneId: phone2.id,
          },
          txn,
        ),
      ).rejects.toMatch(
        'Another patient is currently using that number. Please contact us for help.',
      );
    });

    it('allows creating patient phone for same number if old patient no longer using it', async () => {
      const { patient, phone, clinic } = await setup(txn);
      const patient2 = await createPatient({ cityblockId: 125, homeClinicId: clinic.id }, txn);
      await PatientPhone.create(
        {
          patientId: patient.id,
          phoneId: phone.id,
        },
        txn,
      );
      await PatientPhone.delete({ patientId: patient.id, phoneId: phone.id }, txn);

      const phone2 = await Phone.create(createMockPhone(), txn);

      const patientPhones = await PatientPhone.create(
        {
          patientId: patient2.id,
          phoneId: phone2.id,
        },
        txn,
      );

      expect(patientPhones[0]).toMatchObject({
        type: 'home',
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
        type: 'home',
        description: 'moms home phone',
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
      const phone2 = await Phone.create({ phoneNumber: '111-111-1111', type: 'mobile' }, txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone2.id }, txn);

      // third phone for the same patient that gets deleted
      const phone3 = await Phone.create({ phoneNumber: '222-222-2222', type: 'other' }, txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone3.id }, txn);
      await PatientPhone.delete({ patientId: patient.id, phoneId: phone3.id }, txn);

      // phone for another patient
      const patient2 = await createPatient({ cityblockId: 124, homeClinicId: clinic.id }, txn);
      const phone4 = await Phone.create({ phoneNumber: '333-333-3333', type: 'other' }, txn);
      await PatientPhone.create({ patientId: patient2.id, phoneId: phone4.id }, txn);

      const phones = await PatientPhone.getAll(patient.id, txn);
      expect(phones.length).toBe(2);
      expect(phones[0]).toMatchObject({
        phoneNumber: '+11234567890',
        type: 'home',
        description: 'moms home phone',
      });
      expect(phones[1]).toMatchObject({ phoneNumber: '+11111111111', type: 'mobile' });
    });
  });

  describe('get patient phone number', async () => {
    it('should get patient id associated with a phone if there is one', async () => {
      const { patient, phone } = await setup(txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);

      const patientId = await PatientPhone.getPatientIdForPhoneNumber('+11234567890', txn);

      expect(patientId).toBe(patient.id);
    });

    it('should return null if no patient id associated with phone', async () => {
      await Phone.create(createMockPhone('727-422-7011'), txn);

      const patientId = await PatientPhone.getPatientIdForPhoneNumber('+17274117011', txn);

      expect(patientId).toBeNull();
    });

    it('should return null if patient deleted that number', async () => {
      const { patient, phone } = await setup(txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);
      await PatientPhone.delete({ patientId: patient.id, phoneId: phone.id }, txn);

      const patientId = await PatientPhone.getPatientIdForPhoneNumber('+11234567890', txn);

      expect(patientId).toBeNull();
    });
  });
});
