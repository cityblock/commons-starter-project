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
