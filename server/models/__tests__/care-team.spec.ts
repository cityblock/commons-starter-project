import Db from '../../db';
import { createMockPatient, createPatient } from '../../spec-helpers';
import CareTeam from '../care-team';
import User from '../user';

const userRole = 'physician';

describe('care model', () => {
  let db: Db = null as any;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('care team', () => {
    it('should associate multiple users with a patient', async () => {
      const user1 = await User.create({
        email: 'care@care.com',
        userRole,
        homeClinicId: '1',
      });
      const user2 = await User.create({
        email: 'b@c.com',
        userRole,
        homeClinicId: '1',
      });
      // auto-adds user1
      const patient1 = await createPatient(createMockPatient(123), user1.id);

      // Add 2nd user to patient 1 care team
      const careTeam = await CareTeam.addUserToCareTeam({
        userId: user2.id,
        patientId: patient1.id,
      });
      expect(careTeam[0].id).toEqual(user1.id);
      expect(careTeam[1].id).toEqual(user2.id);
    });

    it('throws an error if adding a non-existant user to a care team', async () => {
      const user = await User.create({
        email: 'care@care.com',
        userRole,
        homeClinicId: '1',
      });
      const patient = await createPatient(createMockPatient(123), user.id);
      const error = 'insert into "care_team" ("id", "patientId", "userId") values ($1, $2, $3) ' +
        'returning "id" - insert or update on table "care_team" violates foreign key constraint ' +
        '"care_team_userid_foreign"';

      await expect(CareTeam.addUserToCareTeam({ userId: 'fakeUserId', patientId: patient.id }))
        .rejects
        .toMatchObject({
          message: error,
        });
    });

    it('can remove a user from a care team', async () => {
      const user = await User.create({
        email: 'care@care.com',
        userRole,
        homeClinicId: '1',
      });
      const patient1 = await createPatient(createMockPatient(123), user.id);

      const careTeamResponse = await CareTeam.removeUserFromCareTeam({
        userId: user.id,
        patientId: patient1.id,
      });
      expect(careTeamResponse).toMatchObject([]);
    });

  });

  describe('get patients for user', () => {
    it('should fetch limited set of patients', async () => {
      const user = await User.create({
        email: 'care@care.com',
        userRole,
        homeClinicId: '1',
      });
      await createPatient(createMockPatient(123), user.id);
      await createPatient(createMockPatient(321), user.id);

      expect(await CareTeam.getForUser(user.id, { pageNumber: 1, pageSize: 1 })).toMatchObject({
        results: [{ athenaPatientId: 321 }],
        total: 2,
      });

      expect(await CareTeam.getForUser(user.id, { pageSize: 1, pageNumber: 0 })).toMatchObject({
        results: [{ athenaPatientId: 123 }],
        total: 2,
      });
    });
  });

  describe('get users for patient', () => {
    it('should fetch care team', async () => {
      const user = await User.create({
        email: 'care@care.com',
        userRole,
        homeClinicId: '1',
      });
      const patient = await createPatient(createMockPatient(123), user.id);

      expect(await CareTeam.getForPatient(patient.id)).toMatchObject([
        { id: user.id },
      ]);
    });
  });
});
