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
  const phone = await Phone.create(createMockPhone(user.id), txn);

  return { patient, phone, user, clinic };
}

describe('patient phone model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('create', async () => {
    it('should create patient to phone join', async () => {
      await transaction(PatientPhone.knex(), async txn => {
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
          phoneNumber: '123-456-7890',
          type: 'home',
          description: 'moms home phone',
        });
      });
    });
  });

  describe('delete', async () => {
    it('should mark patient phone relationship as deleted', async () => {
      await transaction(PatientPhone.knex(), async txn => {
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
          phoneNumber: '123-456-7890',
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
  });

  describe('get for patient', async () => {
    it('should get all non deleted phones for a patient', async () => {
      await transaction(PatientPhone.knex(), async txn => {
        const { patient, phone, user, clinic } = await setup(txn);
        await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);

        // second phone for the same patient
        const phone2 = await Phone.create(
          { phoneNumber: '111-111-1111', type: 'mobile', updatedById: user.id },
          txn,
        );
        await PatientPhone.create({ patientId: patient.id, phoneId: phone2.id }, txn);

        // third phone for the same patient that gets deleted
        const phone3 = await Phone.create(
          { phoneNumber: '222-222-2222', type: 'other', updatedById: user.id },
          txn,
        );
        await PatientPhone.create({ patientId: patient.id, phoneId: phone3.id }, txn);
        await PatientPhone.delete({ patientId: patient.id, phoneId: phone3.id }, txn);

        // phone for another patient
        const patient2 = await createPatient({ cityblockId: 124, homeClinicId: clinic.id }, txn);
        const phone4 = await Phone.create({ phoneNumber: '333-333-3333', updatedById: user.id }, txn);
        await PatientPhone.create({ patientId: patient2.id, phoneId: phone4.id }, txn);

        const phones = await PatientPhone.getForPatient(patient.id, txn);
        expect(phones.length).toBe(2);
        expect(phones[0]).toMatchObject({
          phoneNumber: '123-456-7890',
          type: 'home',
          description: 'moms home phone',
        });
        expect(phones[1]).toMatchObject({ phoneNumber: '111-111-1111', type: 'mobile' });
      });
    });
  });
});
