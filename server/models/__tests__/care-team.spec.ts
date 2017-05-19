import Db from '../../db';
import CareTeam from '../care-team';
import Patient from '../patient';
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
        password: 'password1',
        userRole,
        homeClinicId: '1',
      });
      const user2 = await User.create({
        email: 'b@c.com',
        password: 'password1',
        userRole,
        homeClinicId: '1',
      });
      // auto-adds user1
      const patient1 = await Patient.create({
        athenaPatientId: 123,
        firstName: 'first',
        lastName: 'last',
        homeClinicId: '1',
      }, user1.id);

      // Add 2nd user to patient 1 care team
      const careTeam = await CareTeam.addUserToCareTeam({
        userId: user2.id,
        patientId: patient1.id,
      });
      expect(careTeam[0].id).toEqual(user1.id);
      expect(careTeam[1].id).toEqual(user2.id);
    });

    it('can remove a user from a care team', async () => {
      const user = await User.create({
        email: 'care@care.com',
        password: 'password1',
        userRole,
        homeClinicId: '1',
      });
      const patient1 = await Patient.create({
        athenaPatientId: 123,
        firstName: 'first',
        lastName: 'last',
        homeClinicId: '1',
      }, user.id);

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
        password: 'password1',
        userRole,
        homeClinicId: '1',
      });
      await Patient.create({
        athenaPatientId: 123,
        firstName: 'first',
        lastName: 'last',
        homeClinicId: '1',
      }, user.id);
      await Patient.create({
        athenaPatientId: 321,
        firstName: 'first',
        lastName: 'last',
        homeClinicId: '1',
      }, user.id);

      expect(await CareTeam.getForUser(user.id, { limit: 1, offset: 1 })).toMatchObject([
        { athenaPatientId: 321 },
      ]);

      expect(await CareTeam.getForUser(user.id, { limit: 1, offset: 0 })).toMatchObject([
        { athenaPatientId: 123 },
      ]);
    });
  });

  describe('get users for patient', () => {
    it('should fetch care team', async () => {
      const user = await User.create({
        email: 'care@care.com',
        password: 'password1',
        userRole,
        homeClinicId: '1',
      });
      const patient = await Patient.create({
        athenaPatientId: 123,
        firstName: 'first',
        lastName: 'last',
        homeClinicId: '1',
      }, user.id);

      expect(await CareTeam.getForPatient(patient.id)).toMatchObject([
        { id: user.id },
      ]);
    });
  });
});
