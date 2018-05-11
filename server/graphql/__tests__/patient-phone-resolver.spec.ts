import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { PhoneTypeOptions, UserRole } from 'schema';

import HomeClinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientInfo from '../../models/patient-info';
import PatientPhone from '../../models/patient-phone';
import Phone from '../../models/phone';
import User from '../../models/user';
import { createMockPhone, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  patient: Patient;
  user: User;
  phone: Phone;
  primaryPhone: Phone;
}

const userRole = 'physician' as UserRole;
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const homeClinic = await HomeClinic.create(
    {
      name: 'cool clinic - patient phone',
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
  const phone = await Phone.create(createMockPhone(), txn);
  const primaryPhone = await Phone.create(
    { phoneNumber: '+11112223333', type: 'mobile' as PhoneTypeOptions },
    txn,
  );
  await PatientPhone.create({ phoneId: phone.id, patientId: patient.id }, txn);
  await PatientPhone.create({ phoneId: primaryPhone.id, patientId: patient.id }, txn);
  await PatientInfo.edit(
    { primaryPhoneId: primaryPhone.id, updatedById: user.id },
    patient.patientInfo.id,
    txn,
  );

  return { patient, user, phone, primaryPhone };
}

describe('phone resolver', () => {
  const log = jest.fn();
  const logger = { log };
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('get all patient phones', async () => {
    it('should get all patient phones', async () => {
      const { primaryPhone, phone, patient, user } = await setup(txn);
      const query = `{
          patientPhones(patientId: "${patient.id}") {
            id, phoneNumber, description
          }
        }`;

      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        logger,
        txn,
      });
      expect(cloneDeep(result.data!.patientPhones)).toHaveLength(2);
      expect(cloneDeep(result.data!.patientPhones)).toContainEqual(
        expect.objectContaining({
          id: primaryPhone.id,
          phoneNumber: primaryPhone.phoneNumber,
          description: primaryPhone.description,
        }),
      );
      expect(cloneDeep(result.data!.patientPhones)).toContainEqual(
        expect.objectContaining({
          id: phone.id,
          phoneNumber: phone.phoneNumber,
          description: phone.description,
        }),
      );
      expect(log).toBeCalled();
    });
  });
});
