import { camelCase } from 'lodash';
import { transaction } from 'objection';
import Db from '../../../db';
import User from '../../../models/user';
import resourceToModelMappings, {
  glassBreakResources,
  ModelResource,
} from '../resource-to-model-mapping';

describe('Resource to Model Mappings', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('ensures that all tables are represented in model list', async () => {
    await transaction(User.knex(), async txn => {
      const tables = await txn
        .withSchema('information_schema')
        .select('table_name')
        .from('tables')
        .whereRaw(
          `table_catalog = ? AND table_schema = ? AND table_name != ? AND table_name != ?`,
          [txn.client.database(), 'public', 'knex_migrations', 'knex_migrations_lock'],
        );

      tables.forEach((table: { table_name: string }) => {
        let formattedTableName = camelCase(table.table_name);
        // handle a few corner cases
        if (formattedTableName === 'cboCategory') formattedTableName = 'CBOCategory';
        if (formattedTableName === 'cboReferral') formattedTableName = 'CBOReferral';
        if (formattedTableName === 'cbo') formattedTableName = 'CBO';

        // grab associated model from the mapping
        const model = resourceToModelMappings[formattedTableName as ModelResource] as any;

        // model must be included in the resource to model map
        expect(model).toBeTruthy();
        // model must have a static class boolean variable "hasPHI"
        expect(typeof model.hasPHI).toBe('boolean');
        // ensure mapped resource is the correct one
        expect(model.tableName).toBe(table.table_name);

        // check that models with PHI have getPatientIdForResource function and vice versa
        if (model.hasPHI) {
          expect(model.getPatientIdForResource).toBeTruthy();
        }
        if (model.getPatientIdForResource) {
          expect(model.hasPHI).toBe(true);
        }
      });
    });
  });

  it('ensures that glass break resources have needed methods', () => {
    glassBreakResources.forEach(resource => {
      const model = resourceToModelMappings[resource] as any;

      expect(model.validateGlassBreak).toBeTruthy();
      expect(model.validateGlassBreakNotNeeded).toBeTruthy();
      expect(model.getForCurrentUserSession).toBeTruthy();
    });
  });
});
