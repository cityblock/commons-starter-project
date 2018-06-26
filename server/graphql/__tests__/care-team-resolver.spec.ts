import { graphql, print } from 'graphql';
import kue from 'kue';
import { find } from 'lodash';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import careTeamMakeTeamLead from '../../../app/graphql/queries/care-team-make-team-lead-mutation.graphql';
import careTeamReassignUser from '../../../app/graphql/queries/care-team-reassign-user-mutation.graphql';
import patientCareTeam from '../../../app/graphql/queries/get-patient-care-team.graphql';
import careTeamAddUser from '../../../app/graphql/queries/patient-care-team-add-user-mutation.graphql';
import Mattermost from '../../mattermost';
import CareTeam from '../../models/care-team';
import Clinic from '../../models/clinic';
import ComputedPatientStatus from '../../models/computed-patient-status';
import Patient from '../../models/patient';
import User from '../../models/user';
import {
  createMockClinic,
  createMockUser,
  createPatient,
  mockGoogleCredentials,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  clinic: Clinic;
  patient: Patient;
  user: User;
  testConfig: any;
}

const queue = kue.createQueue();

const userRole = 'Pharmacist' as UserRole;
const permissions = 'green';

async function setup(trx: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), trx);
  const user = await User.create(createMockUser(11, clinic.id, userRole), trx);
  const patient = await createPatient({ cityblockId: 11, homeClinicId: clinic.id }, trx);
  await CareTeam.create({ userId: user.id, patientId: patient.id }, trx);
  const testConfig = mockGoogleCredentials();

  return { clinic, user, patient, testConfig };
}

describe('care team', () => {
  let txn = null as any;
  const careTeamMakeTeamLeadMutation = print(careTeamMakeTeamLead);
  const patientCareTeamQuery = print(patientCareTeam);
  const careTeamAddUserMutation = print(careTeamAddUser);
  const careTeamReassignUserMutation = print(careTeamReassignUser);

  beforeAll(() => {
    queue.testMode.enter();
  });

  beforeEach(async () => {
    txn = await transaction.start(Patient.knex());
    queue.testMode.clear();
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    queue.testMode.exit();
    queue.shutdown(0, () => true); // There must be a better way to do this...
  });

  describe('patient care team', () => {
    it('adds user to care team', async () => {
      const { user, patient, clinic } = await setup(txn);
      const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);

      const addUserToChannel = jest.fn();

      Mattermost.get = jest.fn().mockReturnValue({
        queueAddUserToPatientChannel: addUserToChannel,
      });

      const result = await graphql(
        schema,
        careTeamAddUserMutation,
        null,
        {
          permissions,
          userId: user.id,
          testTransaction: txn,
        },
        {
          userId: user2.id,
          patientId: patient.id,
        },
      );

      expect(cloneDeep(result.data!.careTeamAddUser).id).toEqual(user2.id);
      const careTeam = await CareTeam.getForPatient(patient.id, txn);
      const patientCareTeamIds = careTeam.map(teamMember => teamMember.id);

      expect(patientCareTeamIds).toContain(user.id);
      expect(patientCareTeamIds).toContain(user2.id);
      expect(addUserToChannel).toBeCalledWith(patient.id, user2.id);

      expect(queue.testMode.jobs.length).toBe(1);
      expect(queue.testMode.jobs[0].data).toMatchObject({
        patientId: patient.id,
        type: 'addCareTeamMember',
        userId: user2.id,
      });
    });

    it('updates computed patient status when adding a user to a care team', async () => {
      const { user, patient, clinic } = await setup(txn);
      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus!.hasChp).toEqual(false);

      const user2 = await User.create(
        {
          email: 'chp@cityblock.com',
          firstName: 'Chp',
          lastName: 'User',
          userRole: 'Community_Health_Partner' as UserRole,
          homeClinicId: clinic.id,
        },
        txn,
      );
      await graphql(
        schema,
        careTeamAddUserMutation,
        null,
        {
          permissions,
          userId: user.id,
          testTransaction: txn,
        },
        { userId: user2.id, patientId: patient.id },
      );

      await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);

      const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
        patient.id,
        txn,
      );

      expect(refetchedComputedPatientStatus!.hasChp).toEqual(true);
    });

    it('resolves a patient care team', async () => {
      const { patient, user } = await setup(txn);
      const result = await graphql(
        schema,
        patientCareTeamQuery,
        null,
        {
          permissions,
          userId: user.id,
          testTransaction: txn,
        },
        { patientId: patient.id },
      );
      const careTeamUserIds = cloneDeep(result.data!.patientCareTeam).map((u: any) => u.id);

      expect(careTeamUserIds).toContain(user.id);
    });

    it('resolves a patient care team with the correct team lead', async () => {
      const { patient, user, clinic } = await setup(txn);
      const user2 = await User.create(createMockUser(12, clinic.id, userRole), txn);
      await CareTeam.create({ userId: user2.id, patientId: patient.id }, txn);
      await CareTeam.makeTeamLead({ userId: user.id, patientId: patient.id }, txn);

      const result = await graphql(
        schema,
        patientCareTeamQuery,
        null,
        {
          permissions,
          userId: user.id,
          testTransaction: txn,
        },
        { patientId: patient.id },
      );
      const careTeam = cloneDeep(result.data!.patientCareTeam);
      const userCareTeamResult = find(careTeam, ['id', user.id]);
      const user2CareTeamResult = find(careTeam, ['id', user2.id]);

      expect(careTeam).toHaveLength(2);
      expect(userCareTeamResult.isCareTeamLead).toEqual(true);
      expect(user2CareTeamResult.isCareTeamLead).toEqual(false);
    });

    it('bulk assigns patients to have a user on their care team', async () => {
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

      const addUserToChannel = jest.fn();

      Mattermost.get = jest.fn().mockReturnValue({
        queueAddUserToPatientChannel: addUserToChannel,
      });

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
        permissions,
        testTransaction: txn,
        userId: user2.id,
      });
      expect(cloneDeep(result.data!.careTeamAssignPatients)).toMatchObject({
        id: user.id,
        firstName: 'dan',
        lastName: 'plant',
        patientCount: 2,
      });
      expect(addUserToChannel).toHaveBeenCalledTimes(2);
      expect(addUserToChannel).toBeCalledWith(patient.id, user.id);
      expect(addUserToChannel).toBeCalledWith(patient2.id, user.id);

      expect(queue.testMode.jobs.length).toBe(1);
      expect(queue.testMode.jobs[0].data).toMatchObject({
        patientIds: [patient.id, patient2.id],
        type: 'addCareTeamMember',
        userId: user.id,
      });
    });

    it('updates computed patient status when bulk assigning patients', async () => {
      const { patient, user, clinic } = await setup(txn);
      const patient2 = await createPatient(
        {
          cityblockId: 124,
          homeClinicId: clinic.id,
        },
        txn,
      );
      const user2 = await User.create(
        {
          email: 'chp@cityblock.com',
          firstName: 'Chp',
          lastName: 'User',
          userRole: 'Community_Health_Partner' as UserRole,
          homeClinicId: clinic.id,
        },
        txn,
      );
      const computedPatientStatus1 = await ComputedPatientStatus.getForPatient(patient.id, txn);
      const computedPatientStatus2 = await ComputedPatientStatus.getForPatient(patient2.id, txn);

      expect(computedPatientStatus1!.hasChp).toEqual(false);
      expect(computedPatientStatus2!.hasChp).toEqual(false);

      const mutation = `mutation {
        careTeamAssignPatients(input: { patientIds: ["${patient.id}", "${patient2.id}"], userId: "${
        user2.id
      }" }) {
          id
        }
      }`;
      await graphql(schema, mutation, null, {
        permissions,
        testTransaction: txn,
        userId: user.id,
      });
      const refetchedComputedPatientStatus1 = await ComputedPatientStatus.getForPatient(
        patient.id,
        txn,
      );
      const refetchedComputedPatientStatus2 = await ComputedPatientStatus.getForPatient(
        patient2.id,
        txn,
      );

      expect(refetchedComputedPatientStatus1!.hasChp).toEqual(true);
      expect(refetchedComputedPatientStatus2!.hasChp).toEqual(true);
    });

    it('reassigns a care team member', async () => {
      const { patient, user, clinic, testConfig } = await setup(txn);
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

      const removeUserFromChannel = jest.fn();

      Mattermost.get = jest.fn().mockReturnValue({
        removeUserFromPatientChannel: removeUserFromChannel,
      });

      const result = await graphql(
        schema,
        careTeamReassignUserMutation,
        null,
        {
          permissions,
          testTransaction: txn,
          userId: user2.id,
          testConfig,
        },
        {
          userId: user.id,
          patientId: patient.id,
          reassignedToId: user2.id,
        },
      );
      expect(cloneDeep(result.data!.careTeamReassignUser)).toMatchObject({
        id: user.id,
      });

      const refetchedCareTeam = await CareTeam.getForPatient(patient.id, txn);
      const refetchedCareTeamUserIds = refetchedCareTeam.map(careTeamUser => careTeamUser.id);
      expect(refetchedCareTeam).toHaveLength(1);
      expect(refetchedCareTeamUserIds).toContain(user2.id);

      expect(queue.testMode.jobs.length).toBe(1);
      expect(queue.testMode.jobs[0].data).toMatchObject({
        patientId: patient.id,
        type: 'addCareTeamMember',
        userId: user2.id,
      });
    });

    it('updates computed patient status when reassigning a care team member', async () => {
      const { user, patient, clinic, testConfig } = await setup(txn);
      const user2 = await User.create(
        {
          email: 'chp@cityblock.com',
          firstName: 'Chp',
          lastName: 'User',
          userRole: 'Community_Health_Partner' as UserRole,
          homeClinicId: clinic.id,
        },
        txn,
      );
      await CareTeam.create({ userId: user2.id, patientId: patient.id }, txn);
      const computedPatientStatus = await ComputedPatientStatus.updateForPatient(
        patient.id,
        user.id,
        txn,
      );

      expect(computedPatientStatus.hasChp).toEqual(true);
      await graphql(
        schema,
        careTeamReassignUserMutation,
        null,
        {
          permissions,
          userId: user.id,
          testTransaction: txn,
          testConfig,
        },
        {
          userId: user2.id,
          patientId: patient.id,
        },
      );

      await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);

      const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
        patient.id,
        txn,
      );

      expect(refetchedComputedPatientStatus!.hasChp).toEqual(false);
    });

    it('makes a user the care team lead for a patient', async () => {
      const { patient, user, clinic } = await setup(txn);
      const user2 = await User.create(
        createMockUser(12, clinic.id, userRole, 'care2@care.com'),
        txn,
      );
      await CareTeam.create({ userId: user2.id, patientId: patient.id }, txn);
      await CareTeam.makeTeamLead({ userId: user.id, patientId: patient.id }, txn);
      const careTeamLead = await CareTeam.getTeamLeadForPatient(patient.id, txn);

      expect(careTeamLead!.id).toEqual(user.id);

      const result = await graphql(
        schema,
        careTeamMakeTeamLeadMutation,
        null,
        {
          permissions,
          testTransaction: txn,
          userId: user.id,
        },
        { userId: user2.id, patientId: patient.id },
      );
      expect(cloneDeep(result.data!.careTeamMakeTeamLead)).toMatchObject({
        id: user2.id,
      });

      const refetchedCareTeamLead = await CareTeam.getTeamLeadForPatient(patient.id, txn);
      expect(refetchedCareTeamLead!.id).toEqual(user2.id);
    });
  });
});
