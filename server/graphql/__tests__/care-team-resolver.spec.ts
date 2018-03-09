import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import CareTeam from '../../models/care-team';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  clinic: Clinic;
  patient: Patient;
  user: User;
}

const userRole = 'physician';
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 11, homeClinicId: clinic.id }, txn);
  await CareTeam.create({ userId: user.id, patientId: patient.id }, txn);

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
        const result = await graphql(schema, mutation, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });

        expect(cloneDeep(result.data!.careTeamAddUser).id).toEqual(user2.id);
        const patientCareTeam = await CareTeam.getForPatient(patient.id, txn);
        const patientCareTeamIds = patientCareTeam.map(teamMember => teamMember.id);

        expect(patientCareTeamIds).toContain(user.id);
        expect(patientCareTeamIds).toContain(user2.id);
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
        const result = await graphql(schema, mutation, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
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

        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        const careTeamUserIds = cloneDeep(result.data!.patientCareTeam).map((u: any) => u.id);

        expect(careTeamUserIds).toContain(user.id);
      });
    });

    it('bulk assigns patients to have a user on their care team', async () => {
      await transaction(CareTeam.knex(), async txn => {
        const { patient, user, clinic } = await setup(txn);
        const user2 = await User.create(
          createMockUser(12, clinic.id, userRole, 'care2@care.com'),
          txn,
        );

        const patient2 = await createPatient(
          {
            cityblockId: 124,
            homeClinicId: clinic.id,
            userId: user2.id,
          },
          txn,
        );
        await createPatient(
          {
            cityblockId: 125,
            homeClinicId: clinic.id,
            userId: user2.id,
          },
          txn,
        );

        const mutation = `mutation {
          careTeamAssignPatients(input: { patientIds: ["${patient.id}", "${
          patient2.id
        }"], userId: "${user.id}" }) {
            id,
            firstName,
            lastName,
            patientCount,
          }
        }`;

        const result = await graphql(schema, mutation, null, {
          db,
          permissions,
          txn,
          userId: user2.id,
        });
        expect(cloneDeep(result.data!.careTeamAssignPatients)).toMatchObject({
          id: user.id,
          firstName: 'dan',
          lastName: 'plant',
          patientCount: 2,
        });
      });
    });

    it('reassigns a care team member', async () => {
      await transaction(CareTeam.knex(), async txn => {
        const { patient, user, clinic } = await setup(txn);
        const user2 = await User.create(
          createMockUser(12, clinic.id, userRole, 'care2@care.com'),
          txn,
        );
        await CareTeam.create({ userId: user2.id, patientId: patient.id }, txn);
        const careTeam = await CareTeam.getForPatient(patient.id, txn);
        const careTeamUserIds = careTeam.map(careTeamUser => careTeamUser.id);
        expect(careTeam).toHaveLength(2);
        expect(careTeamUserIds).toContain(user.id);
        expect(careTeamUserIds).toContain(user2.id);

        const mutation = `mutation {
          careTeamReassignUser(input: { userId: "${user.id}", patientId: "${
          patient.id
        }", reassignedToId: "${user2.id}" }) {
            id
          }
        }`;

        const result = await graphql(schema, mutation, null, {
          db,
          permissions,
          txn,
          userId: user2.id,
        });
        expect(cloneDeep(result.data!.careTeamReassignUser)).toMatchObject({
          id: user.id,
        });

        const refetchedCareTeam = await CareTeam.getForPatient(patient.id, txn);
        const refetchedCareTeamUserIds = refetchedCareTeam.map(careTeamUser => careTeamUser.id);
        expect(refetchedCareTeam).toHaveLength(1);
        expect(refetchedCareTeamUserIds).toContain(user2.id);
      });
    });
  });
});
