import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import * as getComputedPatientStatus from '../../../app/graphql/queries/get-patient-computed-patient-status.graphql';
import Db from '../../db';
import HomeClinic from '../../models/clinic';
import Patient from '../../models/patient';
import User from '../../models/user';
import { createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  patient: Patient;
  user: User;
}

const userRole = 'physician';
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
  let db: Db;
  let txn = null as any;
  const getComputedPatientStatusQuery = print(getComputedPatientStatus);

  beforeEach(async () => {
    db = await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
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
          db,
          permissions,
          userId: user.id,
          txn,
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
