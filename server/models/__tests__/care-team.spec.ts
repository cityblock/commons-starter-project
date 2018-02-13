import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createMockClinic, createMockPatient, createMockUser } from '../../spec-helpers';
import CareTeam from '../care-team';
import Clinic from '../clinic';
import Patient from '../patient';
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
        const patient1 = await Patient.create(createMockPatient(123, 123, clinic.id), txn);
        await CareTeam.create({ userId: user1.id, patientId: patient1.id }, txn);

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
        const patient = await Patient.create(createMockPatient(123, 123, clinic.id), txn);
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
        const patient1 = await Patient.create(createMockPatient(123, 123, clinic.id), txn);
        await CareTeam.create({ userId: user.id, patientId: patient1.id }, txn);

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
        const patient1 = await Patient.create(createMockPatient(123, 123, clinic.id), txn);
        await CareTeam.create({ userId: user.id, patientId: patient1.id }, txn);
        const patient2 = await Patient.create(createMockPatient(321, 321, clinic.id), txn);
        await CareTeam.create({ userId: user.id, patientId: patient2.id }, txn);

        expect(
          await CareTeam.getForUser(user.id, { pageNumber: 1, pageSize: 1 }, txn),
        ).toMatchObject({
          results: [{ id: patient2.id }],
          total: 2,
        });

        expect(
          await CareTeam.getForUser(user.id, { pageSize: 1, pageNumber: 0 }, txn),
        ).toMatchObject({
          results: [{ id: patient1.id }],
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
        const patient = await Patient.create(createMockPatient(123, 123, clinic.id), txn);
        await CareTeam.create({ userId: user.id, patientId: patient.id }, txn);

        expect(await CareTeam.getForPatient(patient.id, txn)).toMatchObject([{ id: user.id }]);
      });
    });
  });

  describe('get count of users for patient', () => {
    it('should return a count of care team members', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(
          createMockUser(11, clinic.id, userRole, 'care@care.com'),
          txn,
        );
        const user2 = await User.create(
          createMockUser(12, clinic.id, userRole, 'care2@care.com'),
          txn,
        );
        const patient = await Patient.create(createMockPatient(123, 123, clinic.id), txn);
        await CareTeam.create({ userId: user.id, patientId: patient.id }, txn);

        const careTeamCount1 = await CareTeam.getCountForPatient(patient.id, txn);
        expect(careTeamCount1).toEqual(1);

        await CareTeam.create({ userId: user2.id, patientId: patient.id }, txn);

        const careTeamCount2 = await CareTeam.getCountForPatient(patient.id, txn);
        expect(careTeamCount2).toEqual(2);
      });
    });
  });

  describe('isOnCareTeam', () => {
    it("should return true if user on patient's care team", async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(
          createMockUser(11, clinic.id, userRole, 'care@care.com'),
          txn,
        );
        const patient = await Patient.create(createMockPatient(123, 123, clinic.id), txn);
        await CareTeam.create({ userId: user.id, patientId: patient.id }, txn);

        const result = await CareTeam.isOnCareTeam({ userId: user.id, patientId: patient.id }, txn);
        expect(result).toBe(true);
      });
    });

    it("should return false if user not on patient's care team", async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(
          createMockUser(11, clinic.id, userRole, 'care@care.com'),
          txn,
        );
        const patient = await Patient.create(createMockPatient(123, 123, clinic.id), txn);

        const result = await CareTeam.isOnCareTeam({ userId: user.id, patientId: patient.id }, txn);
        expect(result).toBe(false);
      });
    });
  });

  describe('bulk assign patients to a users care team', () => {
    it('should assign patients', async () => {
      await transaction(User.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(
          createMockUser(11, clinic.id, userRole, 'care@care.com'),
          txn,
        );
        const user2 = await User.create(
          createMockUser(12, clinic.id, userRole, 'care2@care.com'),
          txn,
        );

        const patient = await Patient.create(createMockPatient(123, 123, clinic.id), txn);
        await CareTeam.create({ userId: user.id, patientId: patient.id }, txn);
        const patient2 = await Patient.create(createMockPatient(124, 124, clinic.id), txn);
        await CareTeam.create({ userId: user2.id, patientId: patient2.id }, txn);
        const patient3 = await Patient.create(createMockPatient(125, 125, clinic.id), txn);
        await CareTeam.create({ userId: user2.id, patientId: patient3.id }, txn);

        const result = await CareTeam.createAllForUser(
          {
            userId: user.id,
            patientIds: [patient.id, patient2.id, patient3.id, patient.id],
          },
          txn,
        );

        expect(result).toMatchObject({
          firstName: 'dan',
          lastName: 'plant',
          patientCount: '3',
        });
      });
    });
  });
});
