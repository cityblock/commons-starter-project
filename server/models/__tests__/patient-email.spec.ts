import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import Db from '../../db';
import {
  createMockClinic,
  createMockEmail,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Clinic from '../clinic';
import Email from '../email';
import Patient from '../patient';
import PatientEmail from '../patient-email';
import User from '../user';

const userRole = 'admin' as UserRole;

interface ISetup {
  patient: Patient;
  user: User;
  email: Email;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const email = await Email.create(createMockEmail(user.id), txn);

  return { patient, email, user, clinic };
}

describe('patient email model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(PatientEmail.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('create', async () => {
    it('should create patient to email join', async () => {
      const { patient, email } = await setup(txn);
      const patientEmail = await PatientEmail.create(
        {
          patientId: patient.id,
          emailId: email.id,
        },
        txn,
      );

      expect(patientEmail.length).toBe(1);
      expect(patientEmail[0]).toMatchObject({
        emailAddress: 'spam@email.com',
        description: 'spam email',
      });
    });
  });

  describe('delete', async () => {
    it('should mark patient email relationship as deleted', async () => {
      const { patient, email } = await setup(txn);
      const patientEmail = await PatientEmail.create(
        {
          patientId: patient.id,
          emailId: email.id,
        },
        txn,
      );

      expect(patientEmail.length).toBe(1);
      expect(patientEmail[0]).toMatchObject({
        emailAddress: 'spam@email.com',
        description: 'spam email',
      });

      const remainingEmails = await PatientEmail.delete(
        {
          patientId: patient.id,
          emailId: email.id,
        },
        txn,
      );
      expect(remainingEmails.length).toBe(0);
    });
  });

  describe('get for patient', async () => {
    it('should get all non deleted emails for a patient', async () => {
      const { patient, email, user, clinic } = await setup(txn);
      await PatientEmail.create({ patientId: patient.id, emailId: email.id }, txn);

      // second email for the same patient
      const email2 = await Email.create(
        { emailAddress: 'joe@email.edu', updatedById: user.id },
        txn,
      );
      await PatientEmail.create({ patientId: patient.id, emailId: email2.id }, txn);

      // third email for the same patient that gets deleted
      const email3 = await Email.create(
        { emailAddress: 'jane@email.com', updatedById: user.id },
        txn,
      );
      await PatientEmail.create({ patientId: patient.id, emailId: email3.id }, txn);
      await PatientEmail.delete({ patientId: patient.id, emailId: email3.id }, txn);

      // email for another patient
      const patient2 = await createPatient({ cityblockId: 124, homeClinicId: clinic.id }, txn);
      const email4 = await Email.create(
        { emailAddress: 'test@email.com', updatedById: user.id },
        txn,
      );
      await PatientEmail.create({ patientId: patient2.id, emailId: email4.id }, txn);

      const emails = await PatientEmail.getAll(patient.id, txn);
      expect(emails.length).toBe(2);
      expect(emails[0]).toMatchObject({
        emailAddress: 'spam@email.com',
        description: 'spam email',
      });
      expect(emails[1]).toMatchObject({ emailAddress: 'joe@email.edu' });
    });
  });
});
