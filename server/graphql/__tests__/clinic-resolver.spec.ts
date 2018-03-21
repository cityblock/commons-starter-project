import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction } from 'objection';
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
      const clinic2 = await Clinic.create(
        {
          departmentId: 2,
          name: 'Center One',
        },
        txn,
      );
      const clinic3 = await Clinic.create(
        {
          departmentId: 3,
          name: 'Center Two',
        },
        txn,
      );
      const clinic4 = await Clinic.create(
        {
          departmentId: 4,
          name: 'Center Three',
        },
        txn,
      );
      await Clinic.create({ departmentId: 5, name: 'Center Four' }, txn);

      const query = `{
          clinics(pageNumber: 0, pageSize: 4) {
            edges {
              node {
                name
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
          }
        }`;
      const user = await User.create(createMockUser(11, clinic1.id, userRole), txn);
      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      expect(cloneDeep(result.data!.clinics)).toMatchObject({
        edges: [
          {
            node: {
              name: clinic1.name,
            },
          },
          {
            node: {
              name: clinic2.name,
            },
          },
          {
            node: {
              name: clinic3.name,
            },
          },
          {
            node: {
              name: clinic4.name,
            },
          },
        ],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
        },
      });
    });
  });
});
