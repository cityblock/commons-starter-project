import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
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

const userRole = 'physician';
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const homeClinic = await HomeClinic.create(
    {
      name: 'cool clinic',
      departmentId: 1,
    },
    txn,
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
    txn,
  );
  const patient = await createPatient({ cityblockId: 1, homeClinicId }, txn);
  const email = await Email.create(createMockEmail(user.id), txn);
  const primaryEmail = await Email.create(
    { emailAddress: 'primary@email.com', updatedById: user.id },
    txn,
  );
  await PatientEmail.create({ emailId: email.id, patientId: patient.id }, txn);
  await PatientEmail.create({ emailId: primaryEmail.id, patientId: patient.id }, txn);
  await PatientInfo.edit(
    { primaryEmailId: primaryEmail.id, updatedById: user.id },
    patient.patientInfo.id,
    txn,
  );

  return { patient, user, email, primaryEmail };
}

describe('email resolver', () => {
  let db: Db;
  const log = jest.fn();
  const logger = { log };

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('get all patient emails', async () => {
    it('should get all patient emails', async () => {
      await transaction(Email.knex(), async txn => {
        const { primaryEmail, email, patient, user } = await setup(txn);
        const query = `{
          patientEmails(patientId: "${patient.id}") {
            id, emailAddress, description
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
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
});
