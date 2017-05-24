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
    let error;

    try {
      await Clinic.get('fakeId');
    } catch (err) {
      error = err;
    }

    expect(error).toMatch('No such clinic');
  });
});
