import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import getComputedPatientStatus from '../../../app/graphql/queries/get-patient-computed-patient-status.graphql';

import HomeClinic from '../../models/clinic';
import Patient from '../../models/patient';
import User from '../../models/user';
import { createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  patient: Patient;
  user: User;
}

const userRole = 'Pharmacist' as UserRole;
const permissions = 'green';

async function setup(trx: Transaction): Promise<ISetup> {
  const homeClinic = await HomeClinic.create(
    {
      name: 'cool clinic - computed patient',
      departmentId: 1,
    },
    trx,
  );
  const user = await User.create(
    {
      firstName: 'Daenerys',
      lastName: 'Targaryen',
      email: 'a@b.com',
      userRole,
      homeClinicId: homeClinic.id,
    },
    trx,
  );
  const patient = await createPatient({ cityblockId: 1, homeClinicId: homeClinic.id }, trx);

  return { patient, user };
}

describe('computed patient status resolver', () => {
  let txn = null as any;
  const getComputedPatientStatusQuery = print(getComputedPatientStatus);

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolve patient computed patient status', () => {
    it('resolves a computed patient status for a patient', async () => {
      const { patient, user } = await setup(txn);
      const { computedPatientStatus } = patient;

      const result = await graphql(
        schema,
        getComputedPatientStatusQuery,
        null,
        {
          permissions,
          userId: user.id,
          testTransaction: txn,
        },
        {
          patientId: patient.id,
        },
      );

      expect(cloneDeep(result.data!.patientComputedPatientStatus)).toMatchObject({
        id: computedPatientStatus.id,
      });
    });
  });
});
