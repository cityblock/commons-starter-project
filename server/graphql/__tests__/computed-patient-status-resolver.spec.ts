import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import HomeClinic from '../../models/clinic';
import ComputedPatientStatus from '../../models/computed-patient-status';
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

async function setup(txn: Transaction): Promise<ISetup> {
  const homeClinic = await HomeClinic.create(
    {
      name: 'cool clinic',
      departmentId: 1,
    },
    txn,
  );
  const user = await User.create(
    {
      firstName: 'Daenerys',
      lastName: 'Targaryen',
      email: 'a@b.com',
      userRole,
      homeClinicId: homeClinic.id,
    },
    txn,
  );
  const patient = await createPatient({ cityblockId: 1, homeClinicId: homeClinic.id }, txn);

  return { patient, user };
}

describe('computed patient status resolver', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve patient computed patient status', () => {
    it('resolves a computed patient status for a patient', async () => {
      await transaction(ComputedPatientStatus.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const { computedPatientStatus } = patient;

        const query = `{
          patientComputedPatientStatus(patientId: "${patient.id}") {
            id
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });

        expect(cloneDeep(result.data!.patientComputedPatientStatus)).toMatchObject({
          id: computedPatientStatus.id,
        });
      });
    });
  });
});
