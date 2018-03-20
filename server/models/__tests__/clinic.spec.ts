import { transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { attributionUserClinicName } from '../../lib/consts';
import Clinic from '../clinic';

describe('clinic model', () => {
  let txn = null as any;

  beforeAll(async () => {
    await Db.get();
    await Db.clear();
  });

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(Clinic.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('clinic functions', () => {
    it('creates and retrieves a clinic', async () => {
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

    it('should create an attribution clinic', async () => {
      const clinic = await Clinic.findOrCreateAttributionClinic(txn);
      expect(clinic.name).toEqual(attributionUserClinicName);

      // Check to make sure it's an idempotent operation
      await Clinic.findOrCreateAttributionClinic(txn);
      const clinics = await Clinic.getAll({ pageNumber: 0, pageSize: 100 }, txn);

      expect(clinics.total).toEqual(1);
    });

    it('gets a clinic by a field', async () => {
      const clinic = await Clinic.create(
        {
          departmentId: 1,
          name: 'Center Zero',
        },
        txn,
      );
      const clinicByDepartmentId = await Clinic.getBy({ fieldName: 'departmentId', field: 1 }, txn);
      const clinicByName = await Clinic.getBy({ fieldName: 'name', field: 'Center Zero' }, txn);

      expect(clinicByDepartmentId).toMatchObject(clinic);
      expect(clinicByName).toMatchObject(clinic);
    });

    it('updates a clinic', async () => {
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

    it('returns null if calling getBy without a comparison parameter', async () => {
      const result = await Clinic.getBy({ fieldName: 'name' }, txn);
      expect(result).toBeFalsy();
    });

    it('throws an error when getting a clinic by an invalid id', async () => {
      const fakeId = uuid();
      await expect(Clinic.get(fakeId, txn)).rejects.toMatch(
        `No such clinic for clinicId: ${fakeId}`,
      );
    });

    it('fetches all clinics', async () => {
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
