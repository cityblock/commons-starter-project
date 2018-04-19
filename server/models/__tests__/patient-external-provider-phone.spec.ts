import { transaction, Transaction } from 'objection';
import Db from '../../db';
import {
  createMockClinic,
  createMockPatientExternalProvider,
  createMockPhone,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientExternalProvider from '../patient-external-provider';
import PatientExternalProviderPhone from '../patient-external-provider-phone';
import Phone from '../phone';
import User from '../user';

const userRole = 'admin';

interface ISetup {
  patientExternalProvider: PatientExternalProvider;
  patient: Patient;
  user: User;
  phone: Phone;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const phone = await Phone.create(createMockPhone(), txn);
  const patientExternalProvider = await PatientExternalProvider.create(
    createMockPatientExternalProvider(patient.id, user.id, phone),
    txn,
  );
  await PatientExternalProviderPhone.create(
    { phoneId: phone.id, patientExternalProviderId: patientExternalProvider.id },
    txn,
  );
  const fullPatientExternalProvider = await PatientExternalProvider.get(
    patientExternalProvider.id,
    txn,
  );

  return { patient, patientExternalProvider: fullPatientExternalProvider, user, phone };
}

describe('patient external provider phone model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(PatientExternalProviderPhone.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('create', async () => {
    it('should create external provider to phone join', async () => {
      const { patientExternalProvider, phone } = await setup(txn);
      const patientExternalProviderPhone = await PatientExternalProviderPhone.create(
        {
          patientExternalProviderId: patientExternalProvider.id,
          phoneId: phone.id,
        },
        txn,
      );

      expect(patientExternalProviderPhone.length).toBe(1);
      expect(patientExternalProviderPhone[0]).toMatchObject({
        phoneNumber: '+11234567890',
        type: 'home',
        description: 'moms home phone',
      });
    });
  });

  describe('delete', async () => {
    it('should mark external provider phone relationship as deleted', async () => {
      const { patientExternalProvider, phone } = await setup(txn);
      const patientExternalProviderPhone = await PatientExternalProviderPhone.create(
        {
          patientExternalProviderId: patientExternalProvider.id,
          phoneId: phone.id,
        },
        txn,
      );

      expect(patientExternalProviderPhone.length).toBe(1);
      expect(patientExternalProviderPhone[0]).toMatchObject({
        phoneNumber: '+11234567890',
        type: 'home',
        description: 'moms home phone',
      });

      const remainingPhones = await PatientExternalProviderPhone.delete(
        {
          patientExternalProviderId: patientExternalProvider.id,
          phoneId: phone.id,
        },
        txn,
      );
      expect(remainingPhones.length).toBe(0);
    });
  });

  describe('get for external provider', async () => {
    it('should get the one non deleted phones for a external provider', async () => {
      const { patientExternalProvider, phone, user, patient } = await setup(txn);

      // first phone for provider (deleted)
      await PatientExternalProviderPhone.create(
        { patientExternalProviderId: patientExternalProvider.id, phoneId: phone.id },
        txn,
      );
      await PatientExternalProviderPhone.delete(
        { patientExternalProviderId: patientExternalProvider.id, phoneId: phone.id },
        txn,
      );

      // second phone for the same provider
      const phone2 = await Phone.create({ phoneNumber: '111-111-1111', type: 'mobile' }, txn);
      await PatientExternalProviderPhone.create(
        { patientExternalProviderId: patientExternalProvider.id, phoneId: phone2.id },
        txn,
      );

      // phone for another patientExternalProvider
      const phone4 = await Phone.create({ phoneNumber: '333-333-3333', type: 'mobile' }, txn);
      const patientExternalProvider2 = await PatientExternalProvider.create(
        createMockPatientExternalProvider(patient.id, user.id, phone4),
        txn,
      );
      await PatientExternalProviderPhone.create(
        { patientExternalProviderId: patientExternalProvider2.id, phoneId: phone4.id },
        txn,
      );

      const phones = await PatientExternalProviderPhone.getForPatientExternalProvider(
        patientExternalProvider.id,
        txn,
      );
      expect(phones.length).toBe(1);
      expect(phones[0]).toMatchObject({ phoneNumber: '+11111111111', type: 'mobile' });
    });
  });
});
