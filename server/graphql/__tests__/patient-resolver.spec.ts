import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import RedoxApi from '../../apis/redox';
import Db from '../../db';
import HomeClinic from '../../models/clinic';
import Patient from '../../models/patient';
import User from '../../models/user';
import {
  createMockPatient,
  createPatient,
  mockRedoxCreatePatient,
  mockRedoxCreatePatientError,
  mockRedoxTokenFetch,
  setupComputedPatientList,
  setupPatientsForPanelFilter,
  setupPatientsNewToCareTeam,
  setupPatientsWithMissingInfo,
  setupPatientsWithNoRecentEngagement,
  setupPatientsWithOpenCBOReferrals,
  setupPatientsWithOutOfDateMAP,
  setupPatientsWithPendingSuggestions,
  setupUrgentTasks,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  patient: Patient;
  user: User;
  homeClinicId: string;
}

const userRole = 'physician';

async function setup(txn: Transaction): Promise<ISetup> {
  const homeClinic = await HomeClinic.create(
    {
      name: 'cool clinic',
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
  const patient = await createPatient(createMockPatient(1, homeClinicId), user.id, txn);

  return { patient, user, homeClinicId };
}

async function additionalSetup(txn: Transaction): Promise<ISetup> {
  const { user, patient, homeClinicId } = await setup(txn);
  const user2 = await User.create(
    {
      firstName: 'Ygritte',
      lastName: 'of the  North',
      email: 'ygritte@beyondthewall.com',
      userRole,
      homeClinicId,
    },
    txn,
  );
  await createPatient(createMockPatient(11, homeClinicId, 'Jon', 'Snow'), user.id, txn);
  await createPatient(createMockPatient(12, homeClinicId, 'Robb', 'Stark'), user2.id, txn);
  await createPatient(createMockPatient(13, homeClinicId, 'Arya', 'Stark'), user.id, txn);
  await createPatient(createMockPatient(14, homeClinicId, 'Sansa', 'Stark'), user.id, txn);

  return { user, patient, homeClinicId };
}

describe('patient', () => {
  let redoxApi: RedoxApi;
  let db: Db;
  const log = jest.fn();
  const logger = { log };

  beforeEach(async () => {
    redoxApi = await RedoxApi.get();
    db = await Db.get();
    await Db.clear();
    mockRedoxTokenFetch();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolvePatient', () => {
    it('returns patient', async () => {
      await transaction(Patient.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const query = `{
          patient(patientId: "${patient.id}") {
            id, firstName, lastName
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userId: user.id,
          userRole,
          logger,
          txn,
        });
        expect(cloneDeep(result.data!.patient)).toMatchObject({
          id: patient.id,
          firstName: 'dan',
          lastName: 'plant',
        });
        expect(log).toBeCalled();
      });
    });
  });

  describe('patientEdit', () => {
    it('edits patient', async () => {
      await transaction(Patient.knex(), async txn => {
        const { patient } = await setup(txn);
        const query = `mutation {
          patientEdit(input: { patientId: "${patient.id}", firstName: "first" }) {
            id, firstName
          }
        }`;

        const result = await graphql(schema, query, null, { db, userRole, logger, txn });
        expect(cloneDeep(result.data!.patientEdit)).toMatchObject({
          id: patient.id,
          firstName: 'first',
        });
        expect(log).toBeCalled();
      });
    });
  });

  describe('patientSetup', () => {
    it('sets up patient', async () => {
      await transaction(Patient.knex(), async txn => {
        const { homeClinicId, user } = await setup(txn);
        const query = `mutation {
          patientSetup(input: {
            firstName: "first",
            lastName: "last",
            gender: "female",
            zip: "02345",
            homeClinicId: "${homeClinicId}",
            dateOfBirth: "${new Date('02/02/1902').toISOString()}",
            consentToText: true,
            consentToCall: true,
            maritalStatus: "Unknown",
            race: "Other Race",
            ssn: "123456789",
            language: "en",
          }) {
            id, firstName, lastName, dateOfBirth
          }
        }`;

        mockRedoxCreatePatient(123);

        const result = await graphql(schema, query, null, {
          redoxApi,
          db,
          userRole,
          userId: user.id,
          logger,
          txn,
        });

        expect(cloneDeep(result.data!.patientSetup)).toMatchObject({
          firstName: 'first',
          lastName: 'last',
          dateOfBirth: new Date('02/02/1902').toString(),
        });
        expect(log).toBeCalled();
      });
    });

    // MARKED AS PENDING
    xit('errors and does not create patient when redox fails', async () => {
      // TODO: FIGURE OUT HOW TO RUN THIS IN A TRANSACTION
      await transaction(Patient.knex(), async txn => {
        const setupResult = await transaction(Patient.knex(), async innerTransaction => {
          const homeClinic = await HomeClinic.create(
            {
              name: 'cool clinic',
              departmentId: 1,
            },
            innerTransaction,
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
            innerTransaction,
          );
          await createPatient(createMockPatient(1, homeClinicId), user.id, innerTransaction);

          return { homeClinicId, user };
        });

        const patientCount = await Patient.query(txn).count();
        const query = `mutation {
          patientSetup(input: {
            firstName: "first",
            lastName: "last",
            homeClinicId: "${setupResult.homeClinicId}",
            dateOfBirth: "02/02/1902",
            consentToText: true,
            consentToCall: true,
            maritalStatus: "Unknown",
            race: "Other Race",
            ssn: "123456789",
          }) {
            id, firstName, lastName, dateOfBirth
          }
        }`;

        mockRedoxCreatePatientError();

        const result = await graphql(schema, query, null, {
          redoxApi,
          db,
          userRole,
          userId: setupResult.user.id,
          logger,
          txn,
        });
        expect(result.errors![0].message).toContain('Athena patient was not correctly created');
        expect(await Patient.query(txn).count()).toEqual(patientCount);
      });
    });
  });

  describe('resolvePatientScratchPad', () => {
    it('resolves a patient scratchPad', async () => {
      await transaction(Patient.knex(), async txn => {
        const { patient, user } = await setup(txn);
        await Patient.edit({ scratchPad: 'Test Scratch Pad' }, patient.id, txn);

        const query = `{
          patientScratchPad(patientId: "${patient.id}") {
            text
          }
        }`;

        const result = await graphql(schema, query, null, { db, userRole, userId: user.id, txn });

        expect(cloneDeep(result.data!.patientScratchPad)).toMatchObject({
          text: 'Test Scratch Pad',
        });
      });
    });
  });

  describe('patientScratchPadEdit', () => {
    it('saves a patient scratchPad', async () => {
      await transaction(Patient.knex(), async txn => {
        const { patient, user } = await setup(txn);
        await Patient.edit({ scratchPad: 'Unedited Scratch Pad' }, patient.id, txn);

        const query = `mutation {
          patientScratchPadEdit(input: { patientId: "${patient.id}", text: "Edited Scratch Pad" }) {
            text
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
          logger,
          txn,
        });
        expect(cloneDeep(result.data!.patientScratchPadEdit)).toMatchObject({
          text: 'Edited Scratch Pad',
        });
      });
    });
  });

  describe('patient search', () => {
    it('searches for a single patients', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user } = await additionalSetup(txn);
        const query = `{
          patientSearch(query: "jon", pageNumber: 0, pageSize: 10) {
            edges { node { firstName, lastName, userCareTeam } }
            totalCount
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });

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
    });

    it('searches for multiple patients', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user } = await additionalSetup(txn);
        const query = `{
          patientSearch(query: "stark", pageNumber: 0, pageSize: 10) {
            edges { node { firstName, lastName, userCareTeam } }
            totalCount
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });

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
    });

    it('fuzzy searches for a patient', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user } = await additionalSetup(txn);
        const query = `{
          patientSearch(query: "john snow", pageNumber: 0, pageSize: 10) {
            edges { node { firstName, lastName, userCareTeam } }
            totalCount
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });

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
    });

    it('returns no search results', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user } = await setup(txn);
        const query = `{
          patientSearch(query: "daenerys", pageNumber: 0, pageSize: 10) {
            edges { node { firstName, lastName, userCareTeam } }
            totalCount
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });

        expect(cloneDeep(result.data!.patientSearch)).toMatchObject({
          edges: [],
          totalCount: 0,
        });
      });
    });

    it('catches error if not logged in', async () => {
      await transaction(Patient.knex(), async txn => {
        await additionalSetup(txn);
        const query = `{
          patientSearch(query: "daenerys", pageNumber: 0, pageSize: 10) {
            edges { node { firstName, lastName, userCareTeam } }
            totalCount
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: '',
          txn,
        });

        expect(result.errors![0].message).toBe('not logged in');
      });
    });

    it('catches error if empty string searched', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user } = await additionalSetup(txn);
        const query = `{
          patientSearch(query: "", pageNumber: 0, pageSize: 10) {
            edges { node { firstName, lastName, userCareTeam } }
            totalCount
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });

        expect(result.errors![0].message).toBe('Must provide a search term');
      });
    });
  });

  describe('patient filtering', () => {
    it('catches error if not logged in', async () => {
      await transaction(Patient.knex(), async txn => {
        await setupPatientsForPanelFilter(txn);
        const query = `{
          patientPanel(pageNumber: 0, pageSize: 10, filters: {}) {
            edges { node { firstName, lastName } }
            totalCount
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: '',
          txn,
        });

        expect(result.errors![0].message).toBe('not logged in');
      });
    });

    it('works if user has no patients', async () => {
      await transaction(Patient.knex(), async txn => {
        const homeClinic = await HomeClinic.create(
          {
            name: 'cool clinic',
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

        const query = `{
          patientPanel(pageNumber: 0, pageSize: 10, filters: {}) {
            edges { node { id, firstName } }
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.patientPanel)).toMatchObject({
          edges: [],
        });
      });
    });

    it('works if user has patients', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user, patient, homeClinicId } = await setup(txn);
        const patient1 = await createPatient(createMockPatient(123, homeClinicId), user.id, txn);
        const patient2 = await createPatient(createMockPatient(321, homeClinicId), user.id, txn);

        const query = `{
          patientPanel(pageNumber: 0, pageSize: 10, filters: {}) {
            edges { node { id, firstName } }
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });
        const patientPanel = cloneDeep(result.data!.patientPanel);
        const patientIds = patientPanel.edges.map((edge: any) => edge.node.id);
        expect(patientIds).toContain(patient.id);
        expect(patientIds).toContain(patient1.id);
        expect(patientIds).toContain(patient2.id);
      });
    });

    it('finds all patients for user with no filter', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user } = await setupPatientsForPanelFilter(txn);
        const query = `{
          patientPanel(pageNumber: 0, pageSize: 10, filters: {}) {
            edges { node { firstName, lastName } }
            totalCount
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });

        expect(result.data!.patientPanel.totalCount).toBe(4);
      });
    });

    it('returns single result for zip code 10001', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user } = await setupPatientsForPanelFilter(txn);
        const query = `{
          patientPanel(pageNumber: 0, pageSize: 10, filters: { zip: "10001" }) {
            edges { node { firstName, lastName, patientInfo { gender, language, primaryAddress { zip } } } }
            totalCount
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });

        expect(cloneDeep(result.data!.patientPanel)).toMatchObject({
          edges: [
            {
              node: {
                firstName: 'Mark',
                lastName: 'Man',
                patientInfo: {
                  gender: 'male',
                  language: 'ch',
                  primaryAddress: {
                    zip: '10001',
                  },
                },
              },
            },
          ],
          totalCount: 1,
        });
      });
    });

    it('returns two results for zip code 11211 for first user', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user } = await setupPatientsForPanelFilter(txn);
        const query = `{
          patientPanel(pageNumber: 0, pageSize: 10, filters: { zip: "11211" }) {
            edges { node { firstName, lastName } }
            totalCount
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });

        expect(result.data!.patientPanel.totalCount).toBe(2);
        expect(cloneDeep(result.data!.patientPanel.edges)).toContainEqual(
          expect.objectContaining({
            node: {
              firstName: 'Robb',
              lastName: 'Stark',
            },
          }),
        );
        expect(cloneDeep(result.data!.patientPanel.edges)).toContainEqual(
          expect.objectContaining({
            node: {
              firstName: 'Jane',
              lastName: 'Jacobs',
            },
          }),
        );
      });
    });

    it('returns single result age range 19 and under', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user } = await setupPatientsForPanelFilter(txn);
        const query = `{
          patientPanel(pageNumber: 0, pageSize: 10, filters: { ageMax: 19 }) {
            edges { node { firstName, lastName, patientInfo { gender, language, primaryAddress { zip } } } }
            totalCount
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });

        expect(cloneDeep(result.data!.patientPanel)).toMatchObject({
          edges: [
            {
              node: {
                firstName: 'Robb',
                lastName: 'Stark',
                patientInfo: {
                  gender: 'male',
                  language: 'en',
                  primaryAddress: {
                    zip: '11211',
                  },
                },
              },
            },
          ],
          totalCount: 1,
        });
      });
    });

    it('returns two results for age range 20 to 24', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user } = await setupPatientsForPanelFilter(txn);
        const query = `{
          patientPanel(pageNumber: 0, pageSize: 10, filters: { ageMin: 20, ageMax: 24 }) {
            edges { node { firstName, lastName } }
            totalCount
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });

        expect(result.data!.patientPanel.totalCount).toBe(2);
        expect(cloneDeep(result.data!.patientPanel.edges)).toContainEqual(
          expect.objectContaining({
            node: {
              firstName: 'Maxie',
              lastName: 'Jacobs',
            },
          }),
        );
        expect(cloneDeep(result.data!.patientPanel.edges)).toContainEqual(
          expect.objectContaining({
            node: {
              firstName: 'Jane',
              lastName: 'Jacobs',
            },
          }),
        );
      });
    });

    it('returns single result age range 80 and older', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user } = await setupPatientsForPanelFilter(txn);
        const query = `{
          patientPanel(pageNumber: 0, pageSize: 10, filters: { ageMin: 80 }) {
            edges { node { firstName, lastName, patientInfo { gender, language, primaryAddress { zip } } } }
            totalCount
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });

        expect(cloneDeep(result.data!.patientPanel)).toMatchObject({
          edges: [
            {
              node: {
                firstName: 'Mark',
                lastName: 'Man',
                patientInfo: {
                  gender: 'male',
                  language: 'ch',
                  primaryAddress: {
                    zip: '10001',
                  },
                },
              },
            },
          ],
          totalCount: 1,
        });
      });
    });

    it('returns single result for second user and no filters', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user2 } = await setupPatientsForPanelFilter(txn);
        const query = `{
          patientPanel(pageNumber: 0, pageSize: 10, filters: { gender: female }) {
            edges { node { firstName, lastName, patientInfo { gender, language, primaryAddress { zip } } } }
            totalCount
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user2.id,
          txn,
        });

        expect(cloneDeep(result.data!.patientPanel)).toMatchObject({
          edges: [
            {
              node: {
                firstName: 'Juanita',
                lastName: 'Jacobs',
                patientInfo: {
                  gender: 'female',
                  language: 'en',
                  primaryAddress: {
                    zip: '11211',
                  },
                },
              },
            },
          ],
          totalCount: 1,
        });
      });
    });

    it('returns two results for female gender', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user } = await setupPatientsForPanelFilter(txn);
        const query = `{
          patientPanel(pageNumber: 0, pageSize: 10, filters: { gender: female }) {
            edges { node { firstName, lastName } }
            totalCount
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });

        expect(result.data!.patientPanel.totalCount).toBe(2);
        expect(cloneDeep(result.data!.patientPanel.edges)).toContainEqual(
          expect.objectContaining({
            node: {
              firstName: 'Maxie',
              lastName: 'Jacobs',
            },
          }),
        );
        expect(cloneDeep(result.data!.patientPanel.edges)).toContainEqual(
          expect.objectContaining({
            node: {
              firstName: 'Jane',
              lastName: 'Jacobs',
            },
          }),
        );
      });
    });

    it('returns single result for female in zip code 11211', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user } = await setupPatientsForPanelFilter(txn);
        expect(
          await Patient.filter(
            user.id,
            { pageNumber: 0, pageSize: 10 },
            { gender: 'female', zip: '11211' },
            txn,
          ),
        ).toMatchObject({
          results: [
            {
              firstName: 'Jane',
              lastName: 'Jacobs',
              patientInfo: {
                gender: 'female',
                language: 'en',
                primaryAddress: {
                  zip: '11211',
                },
              },
            },
          ],
          total: 1,
        });
      });
    });
  });

  describe('patient dashboard', () => {
    it('gets patients with tasks due soon or that have notifications', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user, patient1, patient5 } = await setupUrgentTasks(txn);

        const query = `{
          patientsWithUrgentTasks(pageNumber: 0, pageSize: 10) {
            edges { node { id, firstName }}
            totalCount
          }
        }`;

        const result = await graphql(schema, query, null, {
          userRole,
          userId: user.id,
          txn,
        });

        expect(result.data!.patientsWithUrgentTasks.totalCount).toBe(2);
        expect(result.data!.patientsWithUrgentTasks.edges[0].node).toMatchObject({
          id: patient1.id,
          firstName: patient1.firstName,
        });
        expect(result.data!.patientsWithUrgentTasks.edges[1].node).toMatchObject({
          id: patient5.id,
          firstName: patient5.firstName,
        });
      });
    });
  });

  it("gets patients that are new to user's care team", async () => {
    await transaction(Patient.knex(), async txn => {
      const { user, patient1 } = await setupPatientsNewToCareTeam(txn);

      const query = `{
        patientsNewToCareTeam(pageNumber: 0, pageSize: 10) {
          edges { node { id, firstName }}
          totalCount
        }
      }`;

      const result = await graphql(schema, query, null, {
        userRole,
        userId: user.id,
        txn,
      });

      expect(result.data!.patientsNewToCareTeam.totalCount).toBe(1);
      expect(result.data!.patientsNewToCareTeam.edges[0].node).toMatchObject({
        id: patient1.id,
        firstName: patient1.firstName,
      });
    });
  });

  it('gets patients that have pending MAP suggestions', async () => {
    await transaction(Patient.knex(), async txn => {
      const { user, patient1 } = await setupPatientsWithPendingSuggestions(txn);

      const query = `{
        patientsWithPendingSuggestions(pageNumber: 0, pageSize: 10) {
          edges { node { id, firstName }}
          totalCount
        }
      }`;

      const result = await graphql(schema, query, null, {
        userRole,
        userId: user.id,
        txn,
      });

      expect(result.data!.patientsWithPendingSuggestions.totalCount).toBe(1);
      expect(result.data!.patientsWithPendingSuggestions.edges[0].node).toMatchObject({
        id: patient1.id,
        firstName: patient1.firstName,
      });
    });
  });

  it('gets patients that have missing demographic info', async () => {
    await transaction(Patient.knex(), async txn => {
      const { user, patient } = await setupPatientsWithMissingInfo(txn);

      const query = `{
        patientsWithMissingInfo(pageNumber: 0, pageSize: 10) {
          edges { node { id, firstName, patientInfo { gender } }}
          totalCount
        }
      }`;

      const result = await graphql(schema, query, null, {
        userRole,
        userId: user.id,
        txn,
      });

      expect(result.data!.patientsWithMissingInfo.totalCount).toBe(1);
      expect(result.data!.patientsWithMissingInfo.edges[0].node).toMatchObject({
        id: patient.id,
        firstName: patient.firstName,
        patientInfo: {
          gender: null,
        },
      });
    });
  });

  it('gets patients that have no recent engagement', async () => {
    await transaction(Patient.knex(), async txn => {
      const { user, patient1 } = await setupPatientsWithNoRecentEngagement(txn);

      const query = `{
        patientsWithNoRecentEngagement(pageNumber: 0, pageSize: 10) {
          edges { node { id, firstName }}
          totalCount
        }
      }`;

      const result = await graphql(schema, query, null, {
        userRole,
        userId: user.id,
        txn,
      });

      expect(result.data!.patientsWithNoRecentEngagement.totalCount).toBe(1);
      expect(result.data!.patientsWithNoRecentEngagement.edges[0].node).toMatchObject({
        id: patient1.id,
        firstName: patient1.firstName,
      });
    });
  });

  it('gets patients that have an out of date MAP', async () => {
    await transaction(Patient.knex(), async txn => {
      const { user, patient1 } = await setupPatientsWithOutOfDateMAP(txn);

      const query = `{
        patientsWithOutOfDateMAP(pageNumber: 0, pageSize: 10) {
          edges { node { id, firstName }}
          totalCount
        }
      }`;

      const result = await graphql(schema, query, null, {
        userRole,
        userId: user.id,
        txn,
      });

      expect(result.data!.patientsWithOutOfDateMAP.totalCount).toBe(1);
      expect(result.data!.patientsWithOutOfDateMAP.edges[0].node).toMatchObject({
        id: patient1.id,
        firstName: patient1.firstName,
      });
    });
  });

  it('gets patients with open CBO referrals', async () => {
    await transaction(Patient.knex(), async txn => {
      const { user, patient1, patient5 } = await setupPatientsWithOpenCBOReferrals(txn);

      const query = `{
        patientsWithOpenCBOReferrals(pageNumber: 0, pageSize: 10) {
          edges { node { id, firstName }}
          totalCount
        }
      }`;

      const result = await graphql(schema, query, null, {
        userRole,
        userId: user.id,
        txn,
      });

      expect(result.data!.patientsWithOpenCBOReferrals.totalCount).toBe(2);
      expect(result.data!.patientsWithOpenCBOReferrals.edges[0].node).toMatchObject({
        id: patient1.id,
        firstName: patient1.firstName,
      });
      expect(result.data!.patientsWithOpenCBOReferrals.edges[1].node).toMatchObject({
        id: patient5.id,
        firstName: patient5.firstName,
      });
    });
  });

  it('gets patients for a computed list from answer', async () => {
    await transaction(Patient.knex(), async txn => {
      const { user, patient1, answer } = await setupComputedPatientList(txn);

      const query = `{
        patientsForComputedList(answerId: "${answer.id}", pageNumber: 0, pageSize: 10) {
          edges { node { id, firstName }}
          totalCount
        }
      }`;

      const result = await graphql(schema, query, null, {
        userRole,
        userId: user.id,
        txn,
      });

      expect(result.data!.patientsForComputedList.totalCount).toBe(1);
      expect(result.data!.patientsForComputedList.edges[0].node).toMatchObject({
        id: patient1.id,
        firstName: patient1.firstName,
      });
    });
  });
});
