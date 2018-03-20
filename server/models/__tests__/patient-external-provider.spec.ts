import { transaction, Transaction } from 'objection';
import Db from '../../db';
import {
  createMockClinic,
  createMockEmail,
  createMockPatientExternalProvider,
  createMockPhone,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Clinic from '../clinic';
import Email from '../email';
import Patient from '../patient';
import PatientExternalProvider from '../patient-external-provider';
import PatientExternalProviderEmail from '../patient-external-provider-email';
import PatientExternalProviderPhone from '../patient-external-provider-phone';
import Phone from '../phone';
import User from '../user';

const userRole = 'admin';

interface ISetup {
  patient: Patient;
  user: User;
  phone: Phone;
  patientExternalProvider: PatientExternalProvider;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const phone = await Phone.create(createMockPhone(user.id), txn);
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

describe('patient external provider model', () => {
  let txn = null as any;

  beforeAll(async () => {
    await Db.get();
    await Db.clear();
  });

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(PatientExternalProvider.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('get', async () => {
    it('should get patient external provider by id', async () => {
      const { patientExternalProvider } = await setup(txn);

      const result = await PatientExternalProvider.get(patientExternalProvider.id, txn);
      expect(result).toMatchObject(patientExternalProvider);
    });
  });

  describe('create', async () => {
    it('should create a patient external provider with minimal info', async () => {
      const { phone, patient, patientExternalProvider } = await setup(txn);

      expect(patientExternalProvider).toMatchObject({
        phone,
        patientId: patient.id,
        firstName: 'Hermione',
        lastName: 'Granger',
        role: 'psychiatrist',
        agencyName: 'Hogwarts',
        roleFreeText: null,
        email: null,
        description: 'some provider description',
      });
    });

    it('should create a patient external provider with all contact fields', async () => {
      const { user, phone, patient } = await setup(txn);
      const email = await Email.create(createMockEmail(user.id), txn);
      const patientExternalProvider = await PatientExternalProvider.create(
        createMockPatientExternalProvider(patient.id, user.id, phone, {
          email,
          role: 'otherMedicalSpecialty',
          roleFreeText: 'potion intern',
        }),
        txn,
      );

      await PatientExternalProviderPhone.create(
        { phoneId: phone.id, patientExternalProviderId: patientExternalProvider.id },
        txn,
      );
      await PatientExternalProviderEmail.create(
        { emailId: email.id, patientExternalProviderId: patientExternalProvider.id },
        txn,
      );

      expect(patientExternalProvider).toMatchObject({
        phone: null,
        email: null,
        patientId: patient.id,
        firstName: 'Hermione',
        lastName: 'Granger',
        role: 'otherMedicalSpecialty',
        agencyName: 'Hogwarts',
        roleFreeText: 'potion intern',
        description: 'some provider description',
      });

      const fullPatientExternalProvider = await PatientExternalProvider.get(
        patientExternalProvider.id,
        txn,
      );

      expect(fullPatientExternalProvider).toMatchObject({
        phone,
        email,
        patientId: patient.id,
        firstName: 'Hermione',
        lastName: 'Granger',
        role: 'otherMedicalSpecialty',
        agencyName: 'Hogwarts',
        roleFreeText: 'potion intern',
        description: 'some provider description',
      });
    });
  });

  describe('edit', async () => {
    it('should edit patient info', async () => {
      const { patient, patientExternalProvider, user, phone } = await setup(txn);
      const result = await PatientExternalProvider.edit(
        {
          firstName: 'Ron',
          lastName: 'Weasley',
          role: 'oncology',
          agencyName: 'Hogwarts Cancer Ward',
          description: 'magical cancer treatments',
          updatedById: user.id,
        },
        patientExternalProvider.id,
        txn,
      );

      expect(result).toMatchObject({
        phone,
        patientId: patient.id,
        firstName: 'Ron',
        lastName: 'Weasley',
        role: 'oncology',
        roleFreeText: null,
        email: null,
        description: 'magical cancer treatments',
      });
    });
  });

  describe('delete', async () => {
    it('should delete patient external provider', async () => {
      const { patient, user, patientExternalProvider } = await setup(txn);
      const result = await PatientExternalProvider.delete(patientExternalProvider.id, user.id, txn);

      expect(result).toMatchObject({
        patientId: patient.id,
        firstName: 'Hermione',
        lastName: 'Granger',
        role: 'psychiatrist',
        agencyName: 'Hogwarts',
        roleFreeText: null,
        email: null,
        description: 'some provider description',
      });
    });
  });
});
