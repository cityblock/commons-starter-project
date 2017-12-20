import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction } from 'objection';
import Db from '../../db';
import Clinic from '../../models/clinic';
import schema from '../make-executable-schema';

describe('clinic resolver', () => {
  let db: Db;
  const userRole = 'admin';

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve clinic', () => {
    it('fetches a clinic', async () => {
      await transaction(Clinic.knex(), async txn => {
        const clinic = await Clinic.create(
          {
            departmentId: 1,
            name: 'Center Zero',
          },
          txn,
        );
        const query = `{ clinic(clinicId: "${clinic.id}") { name, departmentId } }`;
        const result = await graphql(schema, query, null, { userRole, txn });

        expect(cloneDeep(result.data!.clinic)).toMatchObject({
          name: 'Center Zero',
          departmentId: 1,
        });
      });
    });
  });

  describe('clinicCreate', () => {
    it('creates a clinic', async () => {
      await transaction(Clinic.knex(), async txn => {
        const mutation = `mutation {
          clinicCreate(input: { departmentId: 1, name: "Center Zero" }) {
            name
            departmentId
          }
        }`;
        const result = await graphql(schema, mutation, null, { userRole, txn });

        expect(cloneDeep(result.data!.clinicCreate)).toMatchObject({
          name: 'Center Zero',
          departmentId: 1,
        });
      });
    });

    it('returns an error if a clinic with the same departmentId already exists', async () => {
      await transaction(Clinic.knex(), async txn => {
        await Clinic.create({ departmentId: 1, name: 'Center Zero' }, txn);
        const mutation = `mutation {
          clinicCreate(input: { departmentId: 1, name: "Center One" }) {
            name
            departmentId
          }
        }`;

        const result = await graphql(schema, mutation, null, { userRole, txn });

        expect(cloneDeep(result.errors![0].message)).toMatch(
          'Cannot create clinic: departmentId already exists for 1',
        );
      });
    });
  });
  describe('clinics', () => {
    it('returns correct page information', async () => {
      await transaction(Clinic.knex(), async txn => {
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

        const result = await graphql(schema, query, null, {
          db,
          userRole: 'admin',
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
});
