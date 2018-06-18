import { transaction, Transaction } from 'objection';
import { ExternalProviderOptions, UserRole } from 'schema';

import {
  createMockClinic,
  createMockEmail,
  createMockPatientExternalOrganization,
  createMockPatientExternalProvider,
  createMockPhone,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Clinic from '../clinic';
import Email from '../email';
import Patient from '../patient';
import PatientExternalOrganization from '../patient-external-organization';
import PatientExternalProvider from '../patient-external-provider';
import PatientExternalProviderEmail from '../patient-external-provider-email';
import PatientExternalProviderPhone from '../patient-external-provider-phone';
import Phone from '../phone';
import User from '../user';

const userRole = 'admin' as UserRole;

interface ISetup {
  patient: Patient;
  user: User;
  phone: Phone;
  patientExternalProvider: PatientExternalProvider;
  organization: PatientExternalOrganization;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const phone = await Phone.create(createMockPhone(), txn);
  const organization = await PatientExternalOrganization.create(
    createMockPatientExternalOrganization(patient.id, 'Test organization'),
    txn,
  );
  const patientExternalProvider = await PatientExternalProvider.create(
    createMockPatientExternalProvider(patient.id, user.id, phone, organization.id),
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

  return {
    patient,
    patientExternalProvider: fullPatientExternalProvider,
    user,
    phone,
    organization,
  };
}

describe('patient external provider model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(PatientExternalProvider.knex());
  });

  afterEach(async () => {
    await txn.rollback();
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
      const { phone, patient, patientExternalProvider, organization } = await setup(txn);

      expect(patientExternalProvider).toMatchObject({
        phone,
        patientId: patient.id,
        firstName: 'Hermione',
        lastName: 'Granger',
        role: 'psychiatrist',
        patientExternalOrganizationId: organization.id,
        roleFreeText: null,
        email: null,
        description: 'some provider description',
      });
    });

    it('should create a patient external provider with all contact fields', async () => {
      const { user, phone, patient, organization } = await setup(txn);
      const email = await Email.create(createMockEmail(user.id), txn);
      const patientExternalProvider = await PatientExternalProvider.create(
        createMockPatientExternalProvider(patient.id, user.id, phone, organization.id, {
          email,
          role: 'otherMedicalSpecialist' as ExternalProviderOptions,
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
        role: 'otherMedicalSpecialist',
        patientExternalOrganizationId: organization.id,
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
        role: 'otherMedicalSpecialist',
        patientExternalOrganizationId: organization.id,
        roleFreeText: 'potion intern',
        description: 'some provider description',
      });
    });
  });

  describe('edit', async () => {
    it('should edit patient provider', async () => {
      const { patient, patientExternalProvider, user, phone } = await setup(txn);
      const organization2 = await PatientExternalOrganization.create(
        createMockPatientExternalOrganization(patient.id, 'Another organization'),
        txn,
      );
      const result = await PatientExternalProvider.edit(
        {
          firstName: 'Ron',
          lastName: 'Weasley',
          role: 'oncology' as ExternalProviderOptions,
          patientExternalOrganizationId: organization2.id,
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
        patientExternalOrganizationId: organization2.id,
      });
    });
  });

  describe('delete', async () => {
    it('should delete patient external provider', async () => {
      const { patient, user, patientExternalProvider, organization } = await setup(txn);
      const result = await PatientExternalProvider.delete(patientExternalProvider.id, user.id, txn);

      expect(result).toMatchObject({
        patientId: patient.id,
        firstName: 'Hermione',
        lastName: 'Granger',
        role: 'psychiatrist',
        patientExternalOrganizationId: organization.id,
        roleFreeText: null,
        email: null,
        description: 'some provider description',
      });
    });
  });
});
