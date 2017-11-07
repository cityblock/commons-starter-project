import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
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

describe('care team', () => {
  let db: Db;
  let patient: Patient;
  let user: User;
  let clinic: Clinic;
  const userRole = 'physician';

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    patient = await createPatient(createMockPatient(11, clinic.id), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('patient care team', () => {
    it('adds user to care team', async () => {
      const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'));
      const mutation = `mutation {
        careTeamAddUser(input: { userId: "${user2.id}", patientId: "${patient.id}" }) {
          id
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole });
      const careTeamUserIds = cloneDeep(result.data!.careTeamAddUser).map((u: any) => u.id);

      expect(careTeamUserIds).toContain(user.id);
      expect(careTeamUserIds).toContain(user2.id);
    });

    it('remove user from care team', async () => {
      const mutation = `mutation {
        careTeamRemoveUser(input: { userId: "${user.id}", patientId: "${patient.id}" }) {
          id
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole });
      const careTeamUserIds = cloneDeep(result.data!.careTeamRemoveUser).map((u: any) => u.id);

      expect(careTeamUserIds).not.toContain(user.id);
    });

    it('resolves a patient care team', async () => {
      const query = `{
        patientCareTeam(patientId: "${patient.id}") {
          id
        }
      }`;

      const result = await graphql(schema, query, null, { db, userRole });
      const careTeamUserIds = cloneDeep(result.data!.patientCareTeam).map((u: any) => u.id);

      expect(careTeamUserIds).toContain(user.id);
    });
  });

  describe('user patient panel', () => {
    describe('getting a patient panel for a different user', () => {
      it('works if user has no patients', async () => {
        const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'));
        const query = `{
          userPatientPanel(userId: "${user2.id}", pageNumber: 0, pageSize: 10) {
            edges { node { id, firstName } }
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
        });
        expect(cloneDeep(result.data!.userPatientPanel)).toMatchObject({
          edges: [],
        });
      });

      it('works if user has patients', async () => {
        const patient1 = await createPatient(createMockPatient(123, clinic.id), user.id);
        const patient2 = await createPatient(createMockPatient(321, clinic.id), user.id);

        const query = `{
          userPatientPanel(userId: "${user.id}", pageNumber: 0, pageSize: 10) {
            edges { node { id, firstName } }
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
        });
        expect(cloneDeep(result.data!.userPatientPanel)).toMatchObject({
          edges: [
            {
              node: {
                id: patient.id,
              },
            },
            {
              node: {
                id: patient1.id,
              },
            },
            {
              node: {
                id: patient2.id,
              },
            },
          ],
        });
      });
    });

    describe('getting a patient panel for the current user', () => {
      it('works if user has no patients', async () => {
        const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'));
        const query = `{
          userPatientPanel(pageNumber: 0, pageSize: 10) {
            edges { node { id, firstName } }
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user2.id,
        });
        expect(cloneDeep(result.data!.userPatientPanel)).toMatchObject({
          edges: [],
        });
      });

      it('works if user has patients', async () => {
        const patient1 = await createPatient(createMockPatient(123, clinic.id), user.id);
        const patient2 = await createPatient(createMockPatient(321, clinic.id), user.id);

        const query = `{
          userPatientPanel(pageNumber: 0, pageSize: 10) {
            edges { node { id, firstName } }
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
        });
        expect(cloneDeep(result.data!.userPatientPanel)).toMatchObject({
          edges: [
            {
              node: {
                id: patient.id,
              },
            },
            {
              node: {
                id: patient1.id,
              },
            },
            {
              node: {
                id: patient2.id,
              },
            },
          ],
        });
      });

      it('returns an error if there is no logged in user', async () => {
        const query = `{
          userPatientPanel(pageNumber: 0, pageSize: 10) {
            edges { node { id, firstName } }
          }
        }`;
        const result = await graphql(schema, query, null, { db, userRole });
        expect(cloneDeep(result.errors![0].message)).toMatch(
          'Could not get userPatientPanel. User not logged in.',
        );
      });
    });
  });
});
