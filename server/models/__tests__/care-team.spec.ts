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

describe('care model', () => {
  let clinic: Clinic;

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('care team', () => {
    it('should associate multiple users with a patient', async () => {
      const user1 = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'));
      const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'));
      // auto-adds user1
      const patient1 = await createPatient(createMockPatient(123, clinic.id), user1.id);

      // Add 2nd user to patient 1 care team
      const careTeam = await CareTeam.create({
        userId: user2.id,
        patientId: patient1.id,
      });
      expect(careTeam[0].id).toEqual(user1.id);
      expect(careTeam[1].id).toEqual(user2.id);
    });

    it('throws an error if adding a non-existant user to a care team', async () => {
      const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'));
      const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
      const error =
        'insert into "care_team" ("id", "patientId", "userId") values ($1, $2, $3) ' +
        'returning "id" - insert or update on table "care_team" violates foreign key constraint ' +
        '"care_team_userid_foreign"';

      await expect(
        CareTeam.create({ userId: uuid(), patientId: patient.id }),
      ).rejects.toMatchObject(new Error(error));
    });

    it('can remove a user from a care team', async () => {
      const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'));
      const patient1 = await createPatient(createMockPatient(123, clinic.id), user.id);

      const careTeamResponse = await CareTeam.delete({
        userId: user.id,
        patientId: patient1.id,
      });
      expect(careTeamResponse).toMatchObject([]);
    });
  });

  describe('get patients for user', () => {
    it('should fetch limited set of patients', async () => {
      const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'));
      await createPatient(createMockPatient(123, clinic.id), user.id);
      await createPatient(createMockPatient(321, clinic.id), user.id);

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
      const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'));
      const patient = await createPatient(createMockPatient(123, clinic.id), user.id);

      expect(await CareTeam.getForPatient(patient.id)).toMatchObject([{ id: user.id }]);
    });
  });
});
