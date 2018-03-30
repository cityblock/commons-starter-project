import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction } from 'objection';
import * as getClinics from '../../../app/graphql/queries/get-clinics.graphql';
import Db from '../../db';
import Clinic from '../../models/clinic';
import User from '../../models/user';
import { createMockUser } from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('clinic resolver', () => {
  const userRole = 'admin';
  const permissions = 'green';
  let txn = null as any;
  let db: Db;
  const getClinicsQuery = print(getClinics);

  beforeEach(async () => {
    db = await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve clinic', () => {
    it('fetches a clinic', async () => {
      const clinic = await Clinic.create(
        {
          departmentId: 1,
          name: 'Center Zero',
        },
        txn,
      );
      const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
      const query = `{ clinic(clinicId: "${clinic.id}") { name, departmentId } }`;
      const result = await graphql(schema, query, null, { userId: user.id, permissions, txn });

      expect(cloneDeep(result.data!.clinic)).toMatchObject({
        name: 'Center Zero',
        departmentId: 1,
      });
    });
  });

  describe('clinics', () => {
    it('returns correct page information', async () => {
      const clinic1 = await Clinic.create(
        {
          departmentId: 1,
          name: 'Center Zero',
        },
        txn,
      );
      await Clinic.create(
        {
          departmentId: 2,
          name: 'Center One',
        },
        txn,
      );
      await Clinic.create(
        {
          departmentId: 3,
          name: 'Center Two',
        },
        txn,
      );
      await Clinic.create(
        {
          departmentId: 4,
          name: 'Center Three',
        },
        txn,
      );
      await Clinic.create({ departmentId: 5, name: 'Center Four' }, txn);

      const user = await User.create(createMockUser(11, clinic1.id, userRole), txn);
      const result = await graphql(
        schema,
        getClinicsQuery,
        null,
        {
          db,
          permissions,
          userId: user.id,
          txn,
        },
        {
          pageNumber: 0,
          pageSize: 4,
        },
      );
      expect(cloneDeep(result.data!.clinics.edges)).toHaveLength(4);
    });
  });
});
