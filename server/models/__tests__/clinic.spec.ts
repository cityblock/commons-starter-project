import { transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Clinic from '../clinic';

describe('clinic model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('clinic functions', () => {
    it('creates and retrieves a clinic', async () => {
      await transaction(Clinic.knex(), async txn => {
        const clinic = await Clinic.create(
          {
            departmentId: 1,
            name: 'Center Zero',
          },
          txn,
        );
        const clinicById = await Clinic.get(clinic.id, txn);

        expect(clinicById).toMatchObject(clinic);
      });
    });

    it('gets a clinic by a field', async () => {
      await transaction(Clinic.knex(), async txn => {
        const clinic = await Clinic.create(
          {
            departmentId: 1,
            name: 'Center Zero',
          },
          txn,
        );
        const clinicByDepartmentId = await Clinic.getBy(
          { fieldName: 'departmentId', field: 1 },
          txn,
        );
        const clinicByName = await Clinic.getBy({ fieldName: 'name', field: 'Center Zero' }, txn);

        expect(clinicByDepartmentId).toMatchObject(clinic);
        expect(clinicByName).toMatchObject(clinic);
      });
    });

    it('updates a clinic', async () => {
      await transaction(Clinic.knex(), async txn => {
        const clinic = await Clinic.create(
          {
            departmentId: 1,
            name: 'Center Zero',
          },
          txn,
        );
        const updatedClinic = await Clinic.update(
          clinic.id,
          {
            departmentId: 2,
            name: 'Center One',
          },
          txn,
        );
        expect(updatedClinic.name).toBe('Center One');
        expect(updatedClinic.departmentId).toBe(2);
      });
    });

    it('returns null if calling getBy without a comparison parameter', async () => {
      await transaction(Clinic.knex(), async txn => {
        const result = await Clinic.getBy({ fieldName: 'name' }, txn);
        expect(result).toBeFalsy();
      });
    });

    it('throws an error when getting a clinic by an invalid id', async () => {
      await transaction(Clinic.knex(), async txn => {
        const fakeId = uuid();
        await expect(Clinic.get(fakeId, txn)).rejects.toMatch(
          `No such clinic for clinicId: ${fakeId}`,
        );
      });
    });

    it('fetches all clinics', async () => {
      await transaction(Clinic.knex(), async txn => {
        await Clinic.create({ departmentId: 1, name: 'Center Zero' }, txn);
        await Clinic.create({ departmentId: 2, name: 'Center One' }, txn);

        expect(await Clinic.getAll({ pageNumber: 0, pageSize: 10 }, txn)).toMatchObject({
          results: [
            {
              name: 'Center Zero',
            },
            {
              name: 'Center One',
            },
          ],
          total: 2,
        });
      });
    });
  });
});
