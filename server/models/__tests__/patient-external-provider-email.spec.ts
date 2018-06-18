import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';

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
  patientExternalProvider: PatientExternalProvider;
  organization: PatientExternalOrganization;
  user: User;
  email: Email;
  phone: Phone;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const phone = await Phone.create(createMockPhone(), txn);
  const email = await Email.create(createMockEmail(user.id), txn);
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
    email,
    organization,
  };
}

describe('patient external provider email model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Email.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create', async () => {
    it('should create patient external provider to email join', async () => {
      const { patientExternalProvider, email } = await setup(txn);
      const patientExternalProviderEmail = await PatientExternalProviderEmail.create(
        {
          patientExternalProviderId: patientExternalProvider.id,
          emailId: email.id,
        },
        txn,
      );

      expect(patientExternalProviderEmail.length).toBe(1);
      expect(patientExternalProviderEmail[0]).toMatchObject({
        emailAddress: 'spam@email.com',
        description: 'spam email',
      });
    });
  });

  describe('delete', async () => {
    it('should mark patient external provider email relationship as deleted', async () => {
      const { patientExternalProvider, email } = await setup(txn);
      const patientExternalProviderEmail = await PatientExternalProviderEmail.create(
        {
          patientExternalProviderId: patientExternalProvider.id,
          emailId: email.id,
        },
        txn,
      );

      expect(patientExternalProviderEmail.length).toBe(1);
      expect(patientExternalProviderEmail[0]).toMatchObject({
        emailAddress: 'spam@email.com',
        description: 'spam email',
      });

      const remainingEmails = await PatientExternalProviderEmail.delete(
        {
          patientExternalProviderId: patientExternalProvider.id,
          emailId: email.id,
        },
        txn,
      );
      expect(remainingEmails.length).toBe(0);
    });
  });

  describe('get for patient external provider', async () => {
    it('should get the one non deleted email for a patient external provider', async () => {
      const { patientExternalProvider, patient, phone, email, user, organization } = await setup(
        txn,
      );

      // first email for provider (deleted)
      await PatientExternalProviderEmail.create(
        { patientExternalProviderId: patientExternalProvider.id, emailId: email.id },
        txn,
      );
      await PatientExternalProviderEmail.delete(
        { patientExternalProviderId: patientExternalProvider.id, emailId: email.id },
        txn,
      );

      // second email for the same patient external provider
      const email2 = await Email.create(
        { emailAddress: 'joe@email.edu', updatedById: user.id },
        txn,
      );
      await PatientExternalProviderEmail.create(
        { patientExternalProviderId: patientExternalProvider.id, emailId: email2.id },
        txn,
      );

      // email for another patient external provider
      const patientExternalProvider2 = await PatientExternalProvider.create(
        createMockPatientExternalProvider(patient.id, user.id, phone, organization.id),
        txn,
      );
      await PatientExternalProviderPhone.create(
        { phoneId: phone.id, patientExternalProviderId: patientExternalProvider2.id },
        txn,
      );
      const email3 = await Email.create(
        { emailAddress: 'test@email.com', updatedById: user.id },
        txn,
      );
      await PatientExternalProviderEmail.create(
        { patientExternalProviderId: patientExternalProvider2.id, emailId: email3.id },
        txn,
      );

      const emails = await PatientExternalProviderEmail.getForPatientExternalProvider(
        patientExternalProvider.id,
        txn,
      );
      expect(emails.length).toBe(1);
      expect(emails[0]).toMatchObject({ emailAddress: 'joe@email.edu' });
    });
  });
});
