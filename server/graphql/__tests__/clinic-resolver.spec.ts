import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction } from 'objection';
import { UserRole } from 'schema';
import getClinics from '../../../app/graphql/queries/get-clinics.graphql';

import Clinic from '../../models/clinic';
import User from '../../models/user';
import { createMockUser } from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('clinic resolver', () => {
  const userRole = 'Pharmacist' as UserRole;
  const permissions = 'green';
  let txn = null as any;

  const getClinicsQuery = print(getClinics);

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
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
      const result = await graphql(schema, query, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });

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
          permissions,
          userId: user.id,
          testTransaction: txn,
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
