import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { Gender, Permissions, UserRole } from 'schema';
import * as getPatientPanel from '../../../app/graphql/queries/get-patient-panel.graphql';
import * as getPatientSearch from '../../../app/graphql/queries/get-patient-search.graphql';
import * as getPatientSocialSecurity from '../../../app/graphql/queries/get-patient-social-security.graphql';
import * as getPatient from '../../../app/graphql/queries/get-patient.graphql';
import * as patientForComputedList from '../../../app/graphql/queries/get-patients-for-computed-list.graphql';
import * as patientsNewToCareTeam from '../../../app/graphql/queries/get-patients-new-to-care-team.graphql';
import * as patientsWithAssignedState from '../../../app/graphql/queries/get-patients-with-assigned-state.graphql';
import * as patientsWithIntakeInProgress from '../../../app/graphql/queries/get-patients-with-intake-in-progress.graphql';
import * as patientsWithMissingInfo from '../../../app/graphql/queries/get-patients-with-missing-info.graphql';
import * as patientsWithNoRecentEngagement from '../../../app/graphql/queries/get-patients-with-no-recent-engagement.graphql';
import * as patientsWithOpenCBOReferrals from '../../../app/graphql/queries/get-patients-with-open-cbo-referrals.graphql';
import * as patientsWithOutOfDateMAP from '../../../app/graphql/queries/get-patients-with-out-of-date-map.graphql';
import * as patientsWithPendingSuggestions from '../../../app/graphql/queries/get-patients-with-pending-suggestions.graphql';
import * as patientsWithRecentConversations from '../../../app/graphql/queries/get-patients-with-recent-conversations.graphql';
import * as patientsWithUrgentTasks from '../../../app/graphql/queries/get-patients-with-urgent-tasks.graphql';

import HomeClinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientGlassBreak from '../../models/patient-glass-break';
import User from '../../models/user';
import {
  createPatient,
  setupComputedPatientList,
  setupPatientsForPanelFilter,
  setupPatientsNewToCareTeam,
  setupPatientsWithAssignedState,
  setupPatientsWithIntakeInProgress,
  setupPatientsWithMissingInfo,
  setupPatientsWithNoRecentEngagement,
  setupPatientsWithOpenCBOReferrals,
  setupPatientsWithOutOfDateMAP,
  setupPatientsWithPendingSuggestions,
  setupRecentConversations,
  setupUrgentTasks,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  patient: Patient;
  user: User;
  homeClinicId: string;
}

const userRole = 'physician' as UserRole;
const permissions = 'green';

async function setup(trx: Transaction): Promise<ISetup> {
  const homeClinic = await HomeClinic.create(
    {
      name: 'cool clinic - patient 1',
      departmentId: 2,
    },
    trx,
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
    trx,
  );
  const patient = await createPatient(
    {
      cityblockId: 1,
      homeClinicId,
      userId: user.id,
    },
    trx,
  );

  return { patient, user, homeClinicId };
}

async function additionalSetup(trx: Transaction): Promise<ISetup> {
  const { user, patient, homeClinicId } = await setup(trx);
  const user2 = await User.create(
    {
      firstName: 'Ygritte',
      lastName: 'of the  North',
      email: 'ygritte@beyondthewall.com',
      userRole,
      homeClinicId,
    },
    trx,
  );
  await createPatient(
    {
      cityblockId: 11,
      firstName: 'Jon',
      lastName: 'Snow',
      homeClinicId,
      userId: user.id,
    },
    trx,
  );
  await createPatient(
    {
      cityblockId: 12,
      firstName: 'Robb',
      lastName: 'Stark',
      homeClinicId,
      userId: user2.id,
    },
    trx,
  );
  await createPatient(
    {
      cityblockId: 13,
      firstName: 'Arya',
      lastName: 'Stark',
      homeClinicId,
      userId: user.id,
    },
    trx,
  );
  await createPatient(
    {
      cityblockId: 14,
      firstName: 'Sansa',
      lastName: 'Stark',
      homeClinicId,
      userId: user.id,
    },
    trx,
  );

  return { user, patient, homeClinicId };
}

describe('patient', () => {
  let txn = null as any;
  const log = jest.fn();
  const logger = { log };
  const getPatientQuery = print(getPatient);
  const getPatientPanelQuery = print(getPatientPanel);
  const getPatientSearchQuery = print(getPatientSearch);
  const getPatientSocialSecurityQuery = print(getPatientSocialSecurity);
  const patientForComputedListQuery = print(patientForComputedList);
  const patientsNewToCareTeamQuery = print(patientsNewToCareTeam);
  const patientsWithMissingInfoQuery = print(patientsWithMissingInfo);
  const patientsWithNoRecentEngagementQuery = print(patientsWithNoRecentEngagement);
  const patientsWithOpenCBOReferralsQuery = print(patientsWithOpenCBOReferrals);
  const patientsWithOutOfDateMAPQuery = print(patientsWithOutOfDateMAP);
  const patientsWithPendingSuggestionsQuery = print(patientsWithPendingSuggestions);
  const patientsWithUrgentTasksQuery = print(patientsWithUrgentTasks);
  const patientsWithRecentConversationsQuery = print(patientsWithRecentConversations);
  const patientsWithAssignedStateQuery = print(patientsWithAssignedState);
  const patientsWithIntakeInProgressQuery = print(patientsWithIntakeInProgress);

  beforeEach(async () => {
    txn = await transaction.start(Patient.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolvePatient', () => {
    it('returns patient', async () => {
      const { patient, user } = await setup(txn);

      const result = await graphql(
        schema,
        getPatientQuery,
        null,
        {
          userId: user.id,
          permissions,
          logger,
          txn,
        },
        { patientId: patient.id },
      );
      expect(cloneDeep(result.data!.patient)).toMatchObject({
        id: patient.id,
        firstName: 'dan',
        lastName: 'plant',
      });
      expect(log).toBeCalled();
    });

    it("won't return patient social security number", async () => {
      const { patient, user } = await setup(txn);

      const query = `{
        patient(patientId: "${patient.id}") {
          id
          ssn
        }
      }`;

      const result = await graphql(
        schema,
        query,
        null,
        {
          userId: user.id,
          permissions,
          logger,
          txn,
        },
        { patientId: patient.id },
      );

      expect(result.errors![0].message).toMatch('Cannot query field "ssn" on type "Patient"');
    });
  });

  describe('patient search', () => {
    it('searches for a single patients', async () => {
      const { user } = await additionalSetup(txn);
      const result = await graphql(
        schema,
        getPatientSearchQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { query: 'jon', pageNumber: 0, pageSize: 10 },
      );

      expect(cloneDeep(result.data!.patientSearch)).toMatchObject({
        edges: [
          {
            node: {
              firstName: 'Jon',
              lastName: 'Snow',
              userCareTeam: true,
            },
          },
        ],
        totalCount: 1,
      });
    });

    it('searches for multiple patients', async () => {
      const { user } = await additionalSetup(txn);

      const result = await graphql(
        schema,
        getPatientSearchQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { query: 'stark', pageNumber: 0, pageSize: 10 },
      );

      expect(cloneDeep(result.data!.patientSearch)).toMatchObject({
        edges: [
          {
            node: {
              lastName: 'Stark',
              userCareTeam: true,
            },
          },
          {
            node: {
              lastName: 'Stark',
              userCareTeam: true,
            },
          },
          {
            node: {
              firstName: 'Robb',
              lastName: 'Stark',
              userCareTeam: false,
            },
          },
        ],
        totalCount: 3,
      });
    });

    it('fuzzy searches for a patient', async () => {
      const { user } = await additionalSetup(txn);
      const result = await graphql(
        schema,
        getPatientSearchQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { query: 'john snow', pageNumber: 0, pageSize: 10 },
      );

      expect(cloneDeep(result.data!.patientSearch)).toMatchObject({
        edges: [
          {
            node: {
              firstName: 'Jon',
              lastName: 'Snow',
              userCareTeam: true,
            },
          },
        ],
        totalCount: 1,
      });
    });

    it('returns no search results', async () => {
      const { user } = await setup(txn);
      const result = await graphql(
        schema,
        getPatientSearchQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { query: 'daenerys', pageNumber: 0, pageSize: 10 },
      );

      expect(cloneDeep(result.data!.patientSearch)).toMatchObject({
        edges: [],
        totalCount: 0,
      });
    });

    it('catches error if not logged in', async () => {
      await additionalSetup(txn);

      const result = await graphql(
        schema,
        getPatientSearchQuery,
        null,
        {
          permissions,
          userId: '',
          txn,
        },
        { query: 'daenerys', pageNumber: 0, pageSize: 10 },
      );

      expect(result.errors![0].message).toBe('not logged in');
    });

    it('catches error if empty string searched', async () => {
      const { user } = await additionalSetup(txn);
      const result = await graphql(
        schema,
        getPatientSearchQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { query: '', pageNumber: 0, pageSize: 10 },
      );

      expect(result.errors![0].message).toBe('Must provide a search term');
    });
  });

  describe('patient filtering', () => {
    it('catches error if not logged in', async () => {
      await setupPatientsForPanelFilter(txn);

      const result = await graphql(
        schema,
        getPatientPanelQuery,
        null,
        {
          permissions,
          userId: '',
          txn,
        },
        { pageNumber: 0, pageSize: 10, filters: {} },
      );

      expect(result.errors![0].message).toBe('not logged in');
    });

    it('works if user has no patients', async () => {
      const homeClinic = await HomeClinic.create(
        {
          name: 'cool clinic - patient 2',
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

      const result = await graphql(
        schema,
        getPatientPanelQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { pageNumber: 0, pageSize: 10, filters: {} },
      );
      expect(cloneDeep(result.data!.patientPanel)).toMatchObject({
        edges: [],
      });
    });

    it('works if user has patients', async () => {
      const { user, patient, homeClinicId } = await setup(txn);
      const patient1 = await createPatient(
        {
          cityblockId: 123,
          homeClinicId,
          userId: user.id,
        },
        txn,
      );
      const patient2 = await createPatient(
        {
          cityblockId: 321,
          homeClinicId,
          userId: user.id,
        },
        txn,
      );

      const result = await graphql(
        schema,
        getPatientPanelQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { pageNumber: 0, pageSize: 10, filters: {} },
      );
      const patientPanel = cloneDeep(result.data!.patientPanel);
      const patientIds = patientPanel.edges.map((edge: any) => edge.node.id);
      expect(patientIds).toContain(patient.id);
      expect(patientIds).toContain(patient1.id);
      expect(patientIds).toContain(patient2.id);
    });

    it('finds all patients for user with no filter', async () => {
      const { user } = await setupPatientsForPanelFilter(txn);

      const result = await graphql(
        schema,
        getPatientPanelQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { pageNumber: 0, pageSize: 10, filters: {} },
      );

      expect(result.data!.patientPanel.totalCount).toBe(4);
    });

    it('returns single result for zip code 10001', async () => {
      const { user } = await setupPatientsForPanelFilter(txn);
      const result = await graphql(
        schema,
        getPatientPanelQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { pageNumber: 0, pageSize: 10, filters: { zip: '10001' } },
      );

      expect(cloneDeep(result.data!.patientPanel)).toMatchObject({
        edges: [
          {
            node: {
              firstName: 'Mark',
              lastName: 'Man',
              patientInfo: {
                gender: 'male' as Gender,
              },
            },
          },
        ],
        totalCount: 1,
      });
    });

    it('returns two results for zip code 11211 for first user', async () => {
      const { user } = await setupPatientsForPanelFilter(txn);
      const result = await graphql(
        schema,
        getPatientPanelQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { pageNumber: 0, pageSize: 10, filters: { zip: '11211' } },
      );

      expect(result.data!.patientPanel.totalCount).toBe(2);
    });

    it('returns single result age range 19 and under', async () => {
      const { user } = await setupPatientsForPanelFilter(txn);
      const result = await graphql(
        schema,
        getPatientPanelQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { pageNumber: 0, pageSize: 10, filters: { ageMax: 19 } },
      );

      expect(cloneDeep(result.data!.patientPanel)).toMatchObject({
        edges: [
          {
            node: {
              firstName: 'Robb',
              lastName: 'Stark',
              patientInfo: {
                gender: 'male' as Gender,
              },
            },
          },
        ],
        totalCount: 1,
      });
    });

    it('returns two results for age range 20 to 24', async () => {
      const { user } = await setupPatientsForPanelFilter(txn);

      const result = await graphql(
        schema,
        getPatientPanelQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { pageNumber: 0, pageSize: 10, filters: { ageMin: 20, ageMax: 24 } },
      );

      expect(result.data!.patientPanel.totalCount).toBe(2);
    });

    it('returns single result age range 80 and older', async () => {
      const { user } = await setupPatientsForPanelFilter(txn);
      const result = await graphql(
        schema,
        getPatientPanelQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { pageNumber: 0, pageSize: 10, filters: { ageMin: 80 } },
      );

      expect(cloneDeep(result.data!.patientPanel.edges[0].node)).toMatchObject({
        firstName: 'Mark',
        lastName: 'Man',
        patientInfo: {
          gender: 'male' as Gender,
        },
      });
    });

    it('returns single result for second user and no filters', async () => {
      const { user2 } = await setupPatientsForPanelFilter(txn);

      const result = await graphql(
        schema,
        getPatientPanelQuery,
        null,
        {
          permissions,
          userId: user2.id,
          txn,
        },
        { pageNumber: 0, pageSize: 10, filters: {} },
      );

      expect(cloneDeep(result.data!.patientPanel.edges[0].node)).toMatchObject({
        firstName: 'Juanita',
        lastName: 'Jacobs',
        patientInfo: {
          gender: 'female' as Gender,
        },
      });
    });

    it('returns two results for female gender', async () => {
      const { user } = await setupPatientsForPanelFilter(txn);

      const result = await graphql(
        schema,
        getPatientPanelQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { pageNumber: 0, pageSize: 10, filters: { gender: 'female' } },
      );

      expect(result.data!.patientPanel.totalCount).toBe(2);
    });

    it('returns single result for female in zip code 11211', async () => {
      const { user } = await setupPatientsForPanelFilter(txn);
      const result = await graphql(
        schema,
        getPatientPanelQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { pageNumber: 0, pageSize: 10, filters: { gender: 'female' as Gender, zip: '11211' } },
      );

      expect(result.data!.patientPanel.totalCount).toBe(1);
      expect(cloneDeep(result.data!.patientPanel.edges[0].node)).toMatchObject({
        firstName: 'Jane',
        lastName: 'Jacobs',
      });
    });

    describe('with permissions that do not allow filtering entire patient panel', () => {
      it('still only returns results from care team when showAllMembers is true', async () => {
        const { user } = await setupPatientsForPanelFilter(txn);
        await User.updateUserPermissions(user.id, 'pink' as Permissions, txn);
        const result = await graphql(
          schema,
          getPatientPanelQuery,
          null,
          {
            permissions: user.permissions,
            userId: user.id,
            txn,
          },
          { pageNumber: 0, pageSize: 10, filters: { gender: 'female' }, showAllPatients: true },
        );

        expect(result.data!.patientPanel.totalCount).toBe(2);
      });
    });

    describe('with permissions that allow filtering entire patient panel', () => {
      it('returns results from all members when showAllMembers is true', async () => {
        const { user } = await setupPatientsForPanelFilter(txn);
        const result = await graphql(
          schema,
          getPatientPanelQuery,
          null,
          {
            permissions,
            userId: user.id,
            txn,
          },
          { pageNumber: 0, pageSize: 10, filters: { gender: 'female' }, showAllPatients: true },
        );

        expect(result.data!.patientPanel.totalCount).toBe(3);
      });

      it('still only returns results from care team when showAllMembers is false', async () => {
        const { user } = await setupPatientsForPanelFilter(txn);
        const result = await graphql(
          schema,
          getPatientPanelQuery,
          null,
          {
            permissions,
            userId: user.id,
            txn,
          },
          { pageNumber: 0, pageSize: 10, filters: { gender: 'female' }, showAllPatients: false },
        );

        expect(result.data!.patientPanel.totalCount).toBe(2);
      });
    });
  });

  describe('patient dashboard', () => {
    it('gets patients with tasks due soon or that have notifications', async () => {
      const { user, patient5 } = await setupUrgentTasks(txn);
      const result = await graphql(
        schema,
        patientsWithUrgentTasksQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { pageNumber: 0, pageSize: 10 },
      );

      expect(result.data!.patientsWithUrgentTasks.totalCount).toBe(2);
      expect([
        result.data!.patientsWithUrgentTasks.edges[0].node.firstName,
        result.data!.patientsWithUrgentTasks.edges[1].node.firstName,
      ]).toContain(patient5.firstName);
    });
  });

  it('gets patients that have had recent conversations with user', async () => {
    const { user, patient1, patient5 } = await setupRecentConversations(txn);

    const result = await graphql(
      schema,
      patientsWithRecentConversationsQuery,
      null,
      {
        permissions,
        userId: user.id,
        txn,
      },
      { pageNumber: 0, pageSize: 10 },
    );

    expect(result.data!.patientsWithRecentConversations.totalCount).toBe(2);
    expect(result.data!.patientsWithRecentConversations.edges[0]).toMatchObject({
      node: {
        id: patient1.id,
        firstName: patient1.firstName,
      },
    });

    expect(result.data!.patientsWithRecentConversations.totalCount).toBe(2);
    expect(result.data!.patientsWithRecentConversations.edges[1]).toMatchObject({
      node: {
        id: patient5.id,
        firstName: patient5.firstName,
      },
    });
  });

  it("gets patients that are new to user's care team", async () => {
    const { user, patient1 } = await setupPatientsNewToCareTeam(txn);
    const result = await graphql(
      schema,
      patientsNewToCareTeamQuery,
      null,
      {
        permissions,
        userId: user.id,
        txn,
      },
      { pageNumber: 0, pageSize: 10 },
    );

    expect(result.data!.patientsNewToCareTeam.totalCount).toBe(1);
    expect(result.data!.patientsNewToCareTeam.edges[0].node).toMatchObject({
      id: patient1.id,
      firstName: patient1.firstName,
    });
  });

  it('gets patients that are in the assigned state', async () => {
    const { user, patient1 } = await setupPatientsWithAssignedState(txn);
    const result = await graphql(
      schema,
      patientsWithAssignedStateQuery,
      null,
      {
        permissions,
        userId: user.id,
        txn,
      },
      { pageNumber: 0, pageSize: 10 },
    );

    expect(result.data!.patientsWithAssignedState.totalCount).toBe(1);
    expect(result.data!.patientsWithAssignedState.edges[0].node).toMatchObject({
      id: patient1.id,
      firstName: patient1.firstName,
    });
  });

  it('gets patients that have intake in progress', async () => {
    const { user, patient1, patient3 } = await setupPatientsWithIntakeInProgress(txn);
    const result = await graphql(
      schema,
      patientsWithIntakeInProgressQuery,
      null,
      {
        permissions,
        userId: user.id,
        txn,
      },
      { pageNumber: 0, pageSize: 10 },
    );

    expect(result.data!.patientsWithIntakeInProgress.totalCount).toBe(2);
    const patients = result.data!.patientsWithIntakeInProgress.edges.map((edge: any) => edge.node);
    expect(patients).toContainEqual(
      expect.objectContaining({
        id: patient1.id,
        firstName: patient1.firstName,
        computedPatientStatus: {
          isCoreIdentityVerified: false,
          isDemographicInfoUpdated: false,
          isEmergencyContactAdded: false,
          isAdvancedDirectivesAdded: false,
          isConsentSigned: false,
          isPhotoAddedOrDeclined: false,
        },
      }),
    );
    expect(patients).toContainEqual(
      expect.objectContaining({
        id: patient3.id,
        firstName: patient3.firstName,
        computedPatientStatus: {
          isCoreIdentityVerified: false,
          isDemographicInfoUpdated: true,
          isEmergencyContactAdded: false,
          isAdvancedDirectivesAdded: true,
          isConsentSigned: false,
          isPhotoAddedOrDeclined: true,
        },
      }),
    );
  });

  it('gets patients that have pending MAP suggestions', async () => {
    const { user, patient1 } = await setupPatientsWithPendingSuggestions(txn);
    const result = await graphql(
      schema,
      patientsWithPendingSuggestionsQuery,
      null,
      {
        permissions,
        userId: user.id,
        txn,
      },
      { pageNumber: 0, pageSize: 10 },
    );

    expect(result.data!.patientsWithPendingSuggestions.totalCount).toBe(1);
    expect(result.data!.patientsWithPendingSuggestions.edges[0].node).toMatchObject({
      id: patient1.id,
      firstName: patient1.firstName,
    });
  });

  it('gets patients that have missing demographic info', async () => {
    const { user, patient } = await setupPatientsWithMissingInfo(txn);

    const result = await graphql(
      schema,
      patientsWithMissingInfoQuery,
      null,
      {
        permissions,
        userId: user.id,
        txn,
      },
      { pageNumber: 0, pageSize: 10 },
    );

    expect(result.data!.patientsWithMissingInfo.totalCount).toBe(1);
    expect(result.data!.patientsWithMissingInfo.edges[0].node).toMatchObject({
      id: patient.id,
      firstName: patient.firstName,
      patientInfo: {
        gender: null,
      },
    });
  });

  it('gets patients that have no recent engagement', async () => {
    const { user, patient1 } = await setupPatientsWithNoRecentEngagement(txn);

    const result = await graphql(
      schema,
      patientsWithNoRecentEngagementQuery,
      null,
      {
        permissions,
        userId: user.id,
        txn,
      },
      { pageNumber: 0, pageSize: 10 },
    );

    expect(result.data!.patientsWithNoRecentEngagement.totalCount).toBe(1);
    expect(result.data!.patientsWithNoRecentEngagement.edges[0].node).toMatchObject({
      id: patient1.id,
      firstName: patient1.firstName,
    });
  });

  it('gets patients that have an out of date MAP', async () => {
    const { user, patient1 } = await setupPatientsWithOutOfDateMAP(txn);
    const result = await graphql(
      schema,
      patientsWithOutOfDateMAPQuery,
      null,
      {
        permissions,
        userId: user.id,
        txn,
      },
      { pageNumber: 0, pageSize: 10 },
    );

    expect(result.data!.patientsWithOutOfDateMAP.totalCount).toBe(1);
    expect(result.data!.patientsWithOutOfDateMAP.edges[0].node).toMatchObject({
      id: patient1.id,
      firstName: patient1.firstName,
    });
    await txn.rollback();
  });

  it('gets patients with open CBO referrals', async () => {
    const { user, patient5 } = await setupPatientsWithOpenCBOReferrals(txn);
    const result = await graphql(
      schema,
      patientsWithOpenCBOReferralsQuery,
      null,
      {
        permissions,
        userId: user.id,
        txn,
      },
      { pageNumber: 0, pageSize: 10 },
    );

    expect(result.data!.patientsWithOpenCBOReferrals.totalCount).toBe(2);
    expect([
      result.data!.patientsWithOpenCBOReferrals.edges[0].node.firstName,
      result.data!.patientsWithOpenCBOReferrals.edges[1].node.firstName,
    ]).toContain(patient5.firstName);
  });

  it('gets patients for a computed list from answer', async () => {
    const { user, patient1, answer } = await setupComputedPatientList(txn);

    const result = await graphql(
      schema,
      patientForComputedListQuery,
      null,
      {
        permissions,
        userId: user.id,
        txn,
      },
      { answerId: answer.id, pageNumber: 0, pageSize: 10 },
    );

    expect(result.data!.patientsForComputedList.totalCount).toBe(1);
    expect(result.data!.patientsForComputedList.edges[0].node).toMatchObject({
      id: patient1.id,
      firstName: patient1.firstName,
    });
  });

  describe('resolves patient social security', () => {
    it('returns patient social security number for user on care team', async () => {
      const { patient, user } = await setup(txn);

      const result = await graphql(
        schema,
        getPatientSocialSecurityQuery,
        null,
        {
          userId: user.id,
          permissions: 'blue',
          logger,
          txn,
        },
        { patientId: patient.id },
      );

      expect(cloneDeep(result.data!.patientSocialSecurity)).toMatchObject({
        id: patient.id,
        ssn: patient.ssn,
      });
    });

    it('returns patient social security number for user with green permission', async () => {
      const { patient, homeClinicId } = await setup(txn);
      const user2 = await User.create(
        {
          firstName: 'Cristina',
          lastName: 'Lozano',
          email: 'b@c.com',
          userRole,
          homeClinicId,
        },
        txn,
      );

      const result = await graphql(
        schema,
        getPatientSocialSecurityQuery,
        null,
        {
          userId: user2.id,
          permissions: 'green',
          logger,
          txn,
        },
        { patientId: patient.id },
      );

      expect(cloneDeep(result.data!.patientSocialSecurity)).toMatchObject({
        id: patient.id,
        ssn: patient.ssn,
      });
    });

    it("doesn't return patient social security number for user not on care team", async () => {
      const { patient, homeClinicId } = await setup(txn);
      const user2 = await User.create(
        {
          firstName: 'Cristina',
          lastName: 'Lozano',
          email: 'b@c.com',
          userRole,
          homeClinicId,
        },
        txn,
      );

      const result = await graphql(
        schema,
        getPatientSocialSecurityQuery,
        null,
        {
          userId: user2.id,
          permissions: 'blue',
          logger,
          txn,
        },
        { patientId: patient.id },
      );

      const error = `User ${user2.id} cannot automatically break the glass for patient ${
        patient.id
      }`;
      expect(result.errors![0].message).toBe(error);
    });

    it('returns patient social security number for user who broke the glass', async () => {
      const { patient, homeClinicId } = await setup(txn);
      const user2 = await User.create(
        {
          firstName: 'Cristina',
          lastName: 'Lozano',
          email: 'b@c.com',
          userRole,
          homeClinicId,
        },
        txn,
      );

      const patientGlassBreak = await PatientGlassBreak.create(
        {
          userId: user2.id,
          patientId: patient.id,
          reason: 'Needed for routine care',
          note: null,
        },
        txn,
      );

      const result = await graphql(
        schema,
        getPatientSocialSecurityQuery,
        null,
        {
          userId: user2.id,
          permissions: 'blue',
          logger,
          txn,
        },
        { patientId: patient.id, glassBreakId: patientGlassBreak.id },
      );

      expect(cloneDeep(result.data!.patientSocialSecurity)).toMatchObject({
        id: patient.id,
        ssn: patient.ssn,
      });
    });
  });
});
