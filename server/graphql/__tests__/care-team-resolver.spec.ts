import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import CareTeam from '../../models/care-team';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import User from '../../models/user';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  clinic: Clinic;
  patient: Patient;
  user: User;
}

const userRole = 'physician';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient(createMockPatient(11, clinic.id), user.id, txn);

  return { clinic, user, patient };
}

describe('care team', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('patient care team', () => {
    it('adds user to care team', async () => {
      await transaction(CareTeam.knex(), async txn => {
        const { user, patient, clinic } = await setup(txn);
        const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);
        const mutation = `mutation {
          careTeamAddUser(input: { userId: "${user2.id}", patientId: "${patient.id}" }) {
            id
          }
        }`;
        const result = await graphql(schema, mutation, null, { db, userRole, txn });
        const careTeamUserIds = cloneDeep(result.data!.careTeamAddUser).map((u: any) => u.id);

        expect(careTeamUserIds).toContain(user.id);
        expect(careTeamUserIds).toContain(user2.id);
      });
    });

    it('remove user from care team', async () => {
      await transaction(CareTeam.knex(), async txn => {
        const { user, patient } = await setup(txn);
        const mutation = `mutation {
          careTeamRemoveUser(input: { userId: "${user.id}", patientId: "${patient.id}" }) {
            id
          }
        }`;
        const result = await graphql(schema, mutation, null, { db, userRole, txn });
        const careTeamUserIds = cloneDeep(result.data!.careTeamRemoveUser).map((u: any) => u.id);

        expect(careTeamUserIds).not.toContain(user.id);
      });
    });

    it('resolves a patient care team', async () => {
      await transaction(CareTeam.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const query = `{
          patientCareTeam(patientId: "${patient.id}") {
            id
          }
        }`;

        const result = await graphql(schema, query, null, { db, userRole, txn });
        const careTeamUserIds = cloneDeep(result.data!.patientCareTeam).map((u: any) => u.id);

        expect(careTeamUserIds).toContain(user.id);
      });
    });
  });
});
