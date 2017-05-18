import Db from '../../db';
import Patient from '../patient';
import User from '../user';

const userRole = 'physician';

describe('patient model', () => {
  let db: Db = null as any;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('patient', () => {
    it('should create and retrieve a patient', async () => {
      const user = await User.create({
        email: 'care@care.com',
        password: 'password1',
        userRole,
        homeClinicId: '1',
      });
      const patient = await Patient.create({
        athenaPatientId: 123,
        firstName: 'a',
        lastName: 'b',
        homeClinicId: '1',
      }, user.id);
      expect(patient).toMatchObject({
        id: patient.id,
        athenaPatientId: 123,
      });
      const patientById = await Patient.get(patient.id);
      expect(patientById).toMatchObject({
        id: patient.id,
        athenaPatientId: 123,
      });
    });

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
      const patient2 = await Patient.addUserToCareTeam(user2.id, patient1.id);
      const careTeam = patient2.careTeam.map((u: any) => u.id);
      expect(careTeam).toContain(user1.id);
      expect(careTeam).toContain(user2.id);
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

      const careTeamResponse = await Patient.removeUserFromCareTeam(user.id, patient1.id);
      expect(careTeamResponse).toMatchObject({
        id: patient1.id,
        athenaPatientId: 123,
        careTeam: [],
      });
    });

  });

  describe('patients', () => {
    beforeEach(async () => {
      const user = await User.create({
        email: 'care@care.com',
        password: 'password1',
        userRole,
        homeClinicId: '1',
      });
      await Patient.create({
        athenaPatientId: 123,
        firstName: 'a',
        lastName: 'b',
        homeClinicId: '1',
      }, user.id);
      await Patient.create({
        athenaPatientId: 234,
        firstName: 'c',
        lastName: 'd',
        homeClinicId: '1',
      }, user.id);
    });

    it('should fetch patients', async () => {
      expect(await Patient.getAll({ limit: 100 })).toMatchObject([
        {
          athenaPatientId: 123,
        },
        {
          athenaPatientId: 234,
        },
      ]);
    });

    it('should fetch a limited set of patients', async () => {
      expect(await Patient.getAll({ limit: 1 })).toMatchObject([
        { athenaPatientId: 123 },
      ]);
      expect(await Patient.getAll({ limit: 1, offset: 1 })).toMatchObject([
        { athenaPatientId: 234 },
      ]);
    });

    it('should fetch by athenaPatientId', async () => {
      expect(await Patient.getBy('athenaPatientId', '123')).toMatchObject({ athenaPatientId: 123 });
    });
  });
});
