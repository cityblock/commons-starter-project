import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';

import HomeClinic from '../../models/clinic';
import Email from '../../models/email';
import Patient from '../../models/patient';
import PatientEmail from '../../models/patient-email';
import PatientInfo from '../../models/patient-info';
import User from '../../models/user';
import { createMockEmail, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  patient: Patient;
  user: User;
  email: Email;
  primaryEmail: Email;
}

const userRole = 'physician' as UserRole;
const permissions = 'green';

async function setup(trx: Transaction): Promise<ISetup> {
  const homeClinic = await HomeClinic.create(
    {
      name: 'cool clinic - patient email',
      departmentId: 1,
    },
    trx,
  );
  const homeClinicId = homeClinic.id;
  const user = await User.create(
    {
      firstName: 'Daenerys',
      lastName: 'Targaryen',
      email: 'a@b.com',
      userRole,
      homeClinicId,
    },
    trx,
  );
  const patient = await createPatient({ cityblockId: 1, homeClinicId }, trx);
  const email = await Email.create(createMockEmail(user.id), trx);
  const primaryEmail = await Email.create(
    { emailAddress: 'primary@email.com', updatedById: user.id },
    trx,
  );
  await PatientEmail.create({ emailId: email.id, patientId: patient.id }, trx);
  await PatientEmail.create({ emailId: primaryEmail.id, patientId: patient.id }, trx);
  await PatientInfo.edit(
    { primaryEmailId: primaryEmail.id, updatedById: user.id },
    patient.patientInfo.id,
    trx,
  );

  return { patient, user, email, primaryEmail };
}

describe('email resolver', () => {
  const log = jest.fn();
  const logger = { log };
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('get all patient emails', async () => {
    it('should get all patient emails', async () => {
      const { primaryEmail, email, patient, user } = await setup(txn);
      const query = `{
          patientEmails(patientId: "${patient.id}") {
            id, emailAddress, description
          }
        }`;

      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        logger,
        txn,
      });
      expect(cloneDeep(result.data!.patientEmails)).toHaveLength(2);
      expect(cloneDeep(result.data!.patientEmails)).toContainEqual(
        expect.objectContaining({
          id: primaryEmail.id,
          emailAddress: primaryEmail.emailAddress,
          description: primaryEmail.description,
        }),
      );
      expect(cloneDeep(result.data!.patientEmails)).toContainEqual(
        expect.objectContaining({
          id: email.id,
          emailAddress: email.emailAddress,
          description: email.description,
        }),
      );
      expect(log).toBeCalled();
    });
  });
});
