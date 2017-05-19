import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Patient from '../../models/patient';
import User from '../../models/user';
import schema from '../make-executable-schema';

describe('patient', () => {

  let db: Db = null as any;
  let patient = null as any;
  let user = null as any;
  const userRole = 'physician';
  const homeClinicId = '1';

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    user = await User.create({
      email: 'a@b.com',
      password: 'password1',
      userRole,
      homeClinicId,
    });
    patient = await Patient.create({
      athenaPatientId: 1,
      firstName: 'Constance',
      lastName: 'Blanton',
      homeClinicId,
    }, user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('care team', () => {
    it('adds user to care team', async () => {
      const user2 = await User.create({
        email: 'b@c.com',
        password: 'password1',
        userRole,
        homeClinicId,
      });
      const mutation = `mutation {
        addUserToCareTeam(input: { userId: "${user2.id}", patientId: "${patient.id}" }) {
          id
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole });
      const careTeamUserIds = cloneDeep(result.data!.addUserToCareTeam)
        .map((u: any) => u.id);

      expect(careTeamUserIds).toContain(user.id);
      expect(careTeamUserIds).toContain(user2.id);
    });

    it('remove user from care team', async () => {
      const mutation = `mutation {
        removeUserFromCareTeam(input: { userId: "${user.id}", patientId: "${patient.id}" }) {
          id
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole });
      const careTeamUserIds = cloneDeep(result.data!.removeUserFromCareTeam)
        .map((u: any) => u.id);

      expect(careTeamUserIds).not.toContain(user.id);
    });
  });
});
