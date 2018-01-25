import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import CareTeam from '../care-team';
import Clinic from '../clinic';
import User from '../user';

const userRole = 'physician';

interface ISetup {
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  return { clinic };
}

describe('care model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('care team', () => {
    it('should associate multiple users with a patient', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user1 = await User.create(
          createMockUser(11, clinic.id, userRole, 'care@care.com'),
          txn,
        );
        const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);
        // auto-adds user1
        const patient1 = await createPatient(createMockPatient(123, clinic.id), user1.id, txn);

        // Add 2nd user to patient 1 care team
        const careTeam = await CareTeam.create(
          {
            userId: user2.id,
            patientId: patient1.id,
          },
          txn,
        );
        expect(careTeam[0].id).toEqual(user1.id);
        expect(careTeam[1].id).toEqual(user2.id);
      });
    });

    it('throws an error if adding a non-existant user to a care team', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(
          createMockUser(11, clinic.id, userRole, 'care@care.com'),
          txn,
        );
        const patient = await createPatient(createMockPatient(123, clinic.id), user.id, txn);
        const error =
          'insert into "care_team" ("createdAt", "id", "patientId", "updatedAt", "userId") values ($1, $2, $3, $4, $5) returning "id" - insert or update on table "care_team" violates foreign key constraint "care_team_userid_foreign"';

        await expect(
          CareTeam.create({ userId: uuid(), patientId: patient.id }, txn),
        ).rejects.toMatchObject(new Error(error));
      });
    });

    it('can remove a user from a care team', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);

        const user = await User.create(
          createMockUser(11, clinic.id, userRole, 'care@care.com'),
          txn,
        );
        const patient1 = await createPatient(createMockPatient(123, clinic.id), user.id, txn);

        const careTeamResponse = await CareTeam.delete(
          {
            userId: user.id,
            patientId: patient1.id,
          },
          txn,
        );
        expect(careTeamResponse).toMatchObject([]);
      });
    });
  });

  describe('get patients for user', () => {
    it('should fetch limited set of patients', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(
          createMockUser(11, clinic.id, userRole, 'care@care.com'),
          txn,
        );
        await createPatient(createMockPatient(123, clinic.id), user.id, txn);
        await createPatient(createMockPatient(321, clinic.id), user.id, txn);

        expect(
          await CareTeam.getForUser(user.id, { pageNumber: 1, pageSize: 1 }, txn),
        ).toMatchObject({
          results: [{ athenaPatientId: 321 }],
          total: 2,
        });

        expect(
          await CareTeam.getForUser(user.id, { pageSize: 1, pageNumber: 0 }, txn),
        ).toMatchObject({
          results: [{ athenaPatientId: 123 }],
          total: 2,
        });
      });
    });
  });

  describe('get users for patient', () => {
    it('should fetch care team', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(
          createMockUser(11, clinic.id, userRole, 'care@care.com'),
          txn,
        );
        const patient = await createPatient(createMockPatient(123, clinic.id), user.id, txn);

        expect(await CareTeam.getForPatient(patient.id, txn)).toMatchObject([{ id: user.id }]);
      });
    });
  });
});
