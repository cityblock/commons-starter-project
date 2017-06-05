import Db from '../../db';
import Clinic from '../clinic';

describe('clinic model', () => {
  let db: Db = null as any;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('clinic functions', () => {
    it('creates and retrieves a clinic', async () => {
      const clinic = await Clinic.create({ departmentId: 1, name: 'Center Zero' });
      const clinicById = await Clinic.get(clinic.id);

      expect(clinicById).toMatchObject(clinic);
    });

    it('gets a clinic by a field', async () => {
      const clinic = await Clinic.create({ departmentId: 1, name: 'Center Zero' });
      const clinicByDepartmentId = await Clinic.getBy('departmentId', 1);
      const clinicByName = await Clinic.getBy('name', 'Center Zero');

      expect(clinicByDepartmentId).toMatchObject(clinic);
      expect(clinicByName).toMatchObject(clinic);
    });

    it('returns null if calling getBy without a comparison parameter', async () => {
      const result = await Clinic.getBy('name');
      expect(result).toBeNull();
    });

    it('throws an error when getting a clinic by an invalid id', async () => {
      const fakeId = 'fakeId';
      await expect(Clinic.get(fakeId))
        .rejects
        .toMatch('No such clinic for clinicId: fakeId');
    });

    it('fetches all clinics', async () => {
      await Clinic.create({ departmentId: 1, name: 'Center Zero' });
      await Clinic.create({ departmentId: 2, name: 'Center One' });

      expect(await Clinic.getAll({ pageNumber: 0, pageSize: 10 })).toMatchObject(
        {
          results: [{
            name: 'Center Zero',
          }, {
            name: 'Center One',
          }],
          total: 2,
        },
      );
    });
  });
});
