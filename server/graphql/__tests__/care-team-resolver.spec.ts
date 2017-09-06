import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Patient from '../../models/patient';
import User from '../../models/user';
import { createMockPatient, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('care team', () => {
  let db: Db;
  let patient: Patient;
  let user: User;
  const userRole = 'physician';
  const homeClinicId = '1';

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    user = await User.create({
      email: 'a@b.com',
      firstName: 'Dan',
      lastName: 'Plant',
      userRole,
      homeClinicId,
    });
    patient = await createPatient(createMockPatient(), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('patient care team', () => {
    it('adds user to care team', async () => {
      const user2 = await User.create({
        email: 'b@c.com',
        userRole,
        homeClinicId,
      });
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
        const user2 = await User.create({
          email: 'b@c.com',
          userRole,
          homeClinicId,
        });
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
        const patient1 = await createPatient(createMockPatient(123), user.id);
        const patient2 = await createPatient(createMockPatient(321), user.id);

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
        const user2 = await User.create({
          email: 'b@c.com',
          userRole,
          homeClinicId,
        });
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
        const patient1 = await createPatient(createMockPatient(123), user.id);
        const patient2 = await createPatient(createMockPatient(321), user.id);

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
