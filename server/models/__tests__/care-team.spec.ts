import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  createMockClinic,
  createMockUser,
  createPatient,
  mockGoogleCredentials,
} from '../../spec-helpers';
import CareTeam from '../care-team';
import Clinic from '../clinic';
import ProgressNote from '../progress-note';
import ProgressNoteTemplate from '../progress-note-template';
import Task from '../task';
import TaskFollower from '../task-follower';
import User from '../user';

const userRole = 'physician';

interface ISetup {
  clinic: Clinic;
  testConfig: any;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const testConfig = mockGoogleCredentials();
  return { clinic, testConfig };
}

describe('care team model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('care team', () => {
    it('should associate multiple users with a patient', async () => {
      const { clinic } = await setup(txn);
      const user1 = await User.create(
        createMockUser(11, clinic.id, userRole, 'care@care.com'),
        txn,
      );
      const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);
      const patient1 = await createPatient(
        {
          cityblockId: 123,
          homeClinicId: clinic.id,
          userId: user1.id,
        },
        txn,
      );

      await CareTeam.create(
        {
          userId: user2.id,
          patientId: patient1.id,
        },
        txn,
      );
      const careTeam = await CareTeam.getForPatient(patient1.id, txn);
      const careTeamIds = careTeam.map(user => user.id);
      expect(careTeamIds).toContain(user1.id);
      expect(careTeamIds).toContain(user2.id);
    });

    it('throws an error if adding a non-existant user to a care team', async () => {
      const { clinic } = await setup(txn);
      const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
      const error =
        'insert into "care_team" ("createdAt", "id", "patientId", "updatedAt", "userId") values ($1, $2, $3, $4, $5) returning "id" - insert or update on table "care_team" violates foreign key constraint "care_team_userid_foreign"';

      await expect(
        CareTeam.create({ userId: uuid(), patientId: patient.id }, txn),
      ).rejects.toMatchObject(new Error(error));
    });

    it('can remove a user from a care team', async () => {
      const { clinic } = await setup(txn);

      const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'), txn);
      const patient1 = await createPatient(
        {
          cityblockId: 123,
          homeClinicId: clinic.id,
          userId: user.id,
        },
        txn,
      );

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

  describe('get patients for user', () => {
    it('should fetch limited set of patients', async () => {
      const { clinic } = await setup(txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'), txn);
      const patient1 = await createPatient(
        {
          cityblockId: 123,
          homeClinicId: clinic.id,
          userId: user.id,
        },
        txn,
      );
      const patient2 = await createPatient(
        {
          cityblockId: 234,
          homeClinicId: clinic.id,
          userId: user.id,
        },
        txn,
      );

      expect(await CareTeam.getForUser(user.id, { pageNumber: 1, pageSize: 1 }, txn)).toMatchObject(
        {
          results: [{ id: patient2.id }],
          total: 2,
        },
      );

      expect(await CareTeam.getForUser(user.id, { pageSize: 1, pageNumber: 0 }, txn)).toMatchObject(
        {
          results: [{ id: patient1.id }],
          total: 2,
        },
      );
    });
  });

  describe('get users for patient', () => {
    it('should fetch care team', async () => {
      const { clinic } = await setup(txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'), txn);
      const patient = await createPatient(
        {
          cityblockId: 123,
          homeClinicId: clinic.id,
          userId: user.id,
        },
        txn,
      );

      expect(await CareTeam.getForPatient(patient.id, txn)).toMatchObject([{ id: user.id }]);
    });
  });

  describe('get raw care team records for patient', () => {
    it('should fetch care team records', async () => {
      const { clinic } = await setup(txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'), txn);
      const patient = await createPatient(
        {
          cityblockId: 123,
          homeClinicId: clinic.id,
          userId: user.id,
        },
        txn,
      );
      const careTeam = await CareTeam.getCareTeamRecordsForPatient(patient.id, txn);

      expect(careTeam).toHaveLength(1);
      expect(careTeam[0].user).toMatchObject({ id: user.id });
    });
  });

  describe('get count of users for patient', () => {
    it('should return a count of care team members', async () => {
      const { clinic } = await setup(txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'), txn);
      const user2 = await User.create(
        createMockUser(12, clinic.id, userRole, 'care2@care.com'),
        txn,
      );
      const patient = await createPatient(
        {
          cityblockId: 123,
          homeClinicId: clinic.id,
          userId: user.id,
        },
        txn,
      );

      const careTeamCount1 = await CareTeam.getCountForPatient(patient.id, txn);
      expect(careTeamCount1).toEqual(1);

      await CareTeam.create({ userId: user2.id, patientId: patient.id }, txn);

      const careTeamCount2 = await CareTeam.getCountForPatient(patient.id, txn);
      expect(careTeamCount2).toEqual(2);
    });
  });

  describe('isOnCareTeam', () => {
    it("should return true if user on patient's care team", async () => {
      const { clinic } = await setup(txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'), txn);
      const patient = await createPatient(
        {
          cityblockId: 123,
          homeClinicId: clinic.id,
          userId: user.id,
        },
        txn,
      );

      const result = await CareTeam.isOnCareTeam({ userId: user.id, patientId: patient.id }, txn);
      expect(result).toBe(true);
    });

    it("should return false if user not on patient's care team", async () => {
      const { clinic } = await setup(txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'), txn);
      const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

      const result = await CareTeam.isOnCareTeam({ userId: user.id, patientId: patient.id }, txn);
      expect(result).toBe(false);
    });
  });

  describe('bulk assign patients to a users care team', () => {
    it('should assign patients', async () => {
      const { clinic } = await setup(txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'), txn);
      const user2 = await User.create(
        createMockUser(12, clinic.id, userRole, 'care2@care.com'),
        txn,
      );

      const patient = await createPatient(
        {
          cityblockId: 123,
          homeClinicId: clinic.id,
          userId: user.id,
        },
        txn,
      );
      const patient2 = await createPatient(
        {
          cityblockId: 234,
          homeClinicId: clinic.id,
          userId: user2.id,
        },
        txn,
      );
      const patient3 = await createPatient(
        {
          cityblockId: 345,
          homeClinicId: clinic.id,
          userId: user2.id,
        },
        txn,
      );

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

  describe('reassignUser', () => {
    it('reassigns tasks and removes the user from a care team', async () => {
      const { clinic, testConfig } = await setup(txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'), txn);
      const user2 = await User.create(
        createMockUser(12, clinic.id, userRole, 'care2@care.com'),
        txn,
      );
      const user3 = await User.create(
        createMockUser(13, clinic.id, userRole, 'care3@care.com'),
        txn,
      );
      const patient = await createPatient(
        {
          cityblockId: 123,
          homeClinicId: clinic.id,
          userId: user.id,
        },
        txn,
      );
      await CareTeam.create({ userId: user2.id, patientId: patient.id }, txn);
      await CareTeam.create({ userId: user3.id, patientId: patient.id }, txn);
      const task1 = await Task.create(
        {
          title: 'title',
          description: 'description',
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
        },
        txn,
      );
      const task2 = await Task.create(
        {
          title: 'title',
          description: 'description',
          patientId: patient.id,
          createdById: user2.id,
          assignedToId: user2.id,
        },
        txn,
      );
      await TaskFollower.followTask(
        {
          userId: user.id,
          taskId: task2.id,
        },
        txn,
      );

      const careTeam = await CareTeam.getForPatient(patient.id, txn);
      const careTeamUserIds = careTeam.map(careTeamUser => careTeamUser.id);
      const userTasks = await Task.getAllUserPatientTasks(
        { userId: user.id, patientId: patient.id },
        txn,
      );
      const user3Tasks = await Task.getAllUserPatientTasks(
        { userId: user3.id, patientId: patient.id },
        txn,
      );
      expect(careTeam).toHaveLength(3);
      expect(careTeamUserIds).toContain(user.id);
      expect(careTeamUserIds).toContain(user2.id);
      expect(careTeamUserIds).toContain(user3.id);
      expect(userTasks).toHaveLength(2);
      expect(user3Tasks).toHaveLength(0);

      await CareTeam.reassignUser(
        { userId: user.id, patientId: patient.id, reassignedToId: user3.id },
        txn,
        testConfig,
      );

      const refetchedCareTeam = await CareTeam.getForPatient(patient.id, txn);
      const refetchedCareTeamUserIds = refetchedCareTeam.map(careTeamUser => careTeamUser.id);
      const refetchedUserTasks = await Task.getAllUserPatientTasks(
        { userId: user.id, patientId: patient.id },
        txn,
      );
      const refetchedUser3Tasks = await Task.getAllUserPatientTasks(
        { userId: user3.id, patientId: patient.id },
        txn,
      );
      const refetchedUser3TaskIds = refetchedUser3Tasks.map(task => task.id);
      expect(refetchedCareTeam).toHaveLength(2);
      expect(refetchedCareTeamUserIds).toContain(user2.id);
      expect(refetchedCareTeamUserIds).toContain(user3.id);
      expect(refetchedUserTasks).toHaveLength(0);
      expect(refetchedUser3Tasks).toHaveLength(2);
      expect(refetchedUser3TaskIds).toContain(task1.id);
      expect(refetchedUser3TaskIds).toContain(task2.id);
    });

    it('throws an error if there are tasks to be reassigned and no new user provided', async () => {
      const { clinic, testConfig } = await setup(txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'), txn);
      const user2 = await User.create(
        createMockUser(12, clinic.id, userRole, 'care2@care.com'),
        txn,
      );
      const user3 = await User.create(
        createMockUser(13, clinic.id, userRole, 'care3@care.com'),
        txn,
      );
      const patient = await createPatient(
        {
          cityblockId: 123,
          homeClinicId: clinic.id,
          userId: user.id,
        },
        txn,
      );
      await CareTeam.create({ userId: user2.id, patientId: patient.id }, txn);
      await CareTeam.create({ userId: user3.id, patientId: patient.id }, txn);
      await Task.create(
        {
          title: 'title',
          description: 'description',
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
        },
        txn,
      );
      const task2 = await Task.create(
        {
          title: 'title',
          description: 'description',
          patientId: patient.id,
          createdById: user2.id,
          assignedToId: user2.id,
        },
        txn,
      );
      await TaskFollower.followTask(
        {
          userId: user.id,
          taskId: task2.id,
        },
        txn,
      );

      await expect(
        CareTeam.reassignUser({ userId: user.id, patientId: patient.id }, txn, testConfig),
      ).rejects.toMatch('Must provide a replacement user when there are tasks to reassign');
    });

    it('throws an error if the user has an open progress note for the patient', async () => {
      const { clinic, testConfig } = await setup(txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'), txn);
      const patient = await createPatient(
        {
          cityblockId: 123,
          homeClinicId: clinic.id,
          userId: user.id,
        },
        txn,
      );
      const progressNoteTemplate = await ProgressNoteTemplate.create(
        {
          title: 'title',
        },
        txn,
      );
      await ProgressNote.create(
        {
          patientId: patient.id,
          userId: user.id,
          progressNoteTemplateId: progressNoteTemplate.id,
        },
        txn,
      );
      await expect(
        CareTeam.reassignUser({ userId: user.id, patientId: patient.id }, txn, testConfig),
      ).rejects.toMatch(
        'This user has an open Progress Note. Please submit before removing from care team.',
      );
    });
  });

  describe('making a care team user the team lead', () => {
    it('sets and gets the team lead', async () => {
      const { clinic } = await setup(txn);
      const user1 = await User.create(
        createMockUser(11, clinic.id, userRole, 'user1@cityblock.com'),
        txn,
      );
      const user2 = await User.create(
        createMockUser(12, clinic.id, userRole, 'user2@cityblock.com'),
        txn,
      );
      const patient = await createPatient(
        {
          cityblockId: 123,
          homeClinicId: clinic.id,
          userId: user1.id,
        },
        txn,
      );
      await CareTeam.create({ userId: user2.id, patientId: patient.id }, txn);
      await CareTeam.makeTeamLead({ userId: user1.id, patientId: patient.id }, txn);
      const careTeamLead = await CareTeam.getTeamLeadForPatient(patient.id, txn);

      expect(careTeamLead!.id).toEqual(user1.id);

      await CareTeam.makeTeamLead({ userId: user2.id, patientId: patient.id }, txn);
      const refetchedCareTeamLead = await CareTeam.getTeamLeadForPatient(patient.id, txn);

      expect(refetchedCareTeamLead!.id).toEqual(user2.id);
    });

    it('returns null when fetching the team lead and there is none', async () => {
      const { clinic } = await setup(txn);
      const user = await User.create(
        createMockUser(11, clinic.id, userRole, 'user@cityblock.com'),
        txn,
      );
      const patient = await createPatient(
        {
          cityblockId: 123,
          homeClinicId: clinic.id,
          userId: user.id,
        },
        txn,
      );
      const careTeamLead = await CareTeam.getTeamLeadForPatient(patient.id, txn);

      expect(careTeamLead).toBeNull();
    });
  });
});
