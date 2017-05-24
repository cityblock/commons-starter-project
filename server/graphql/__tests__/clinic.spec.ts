import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Clinic from '../../models/clinic';
import schema from '../make-executable-schema';

describe('clinic resolver', () => {
  let db: Db = null as any;
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
      const clinic = await Clinic.create({ departmentId: 1, name: 'Center Zero' });
      const query = `{ clinic(clinicId: "${clinic.id}") { name, departmentId } }`;
      const result = await graphql(schema, query, null, { userRole });

      expect(cloneDeep(result.data!.clinic)).toMatchObject({
        name: 'Center Zero',
        departmentId: 1,
      });
    });
  });

  describe('create clinic', () => {
    it('creates a clinic', async () => {
      const mutation = `mutation {
        createClinic(input: { departmentId: 1, name: "Center Zero" }) {
          name
          departmentId
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });

      expect(cloneDeep(result.data!.createClinic)).toMatchObject({
        name: 'Center Zero',
        departmentId: 1,
      });
    });

    it('returns an error if a clinic with the same departmentId already exists', async () => {
      await Clinic.create({ departmentId: 1, name: 'Center Zero' });
      const mutation = `mutation {
        createClinic(input: { departmentId: 1, name: "Center One" }) {
          name
          departmentId
        }
      }`;

      const result = await graphql(schema, mutation, null, { userRole });

      expect(cloneDeep(result.errors![0].message)).toMatch(
        'Cannot create clinic: departmentId already exists for 1',
      );
    });
  });
});
