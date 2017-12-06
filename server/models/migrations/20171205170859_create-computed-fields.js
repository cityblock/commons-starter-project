exports.up = async function(knex, Promise) {
  await knex.schema.raw(
    `CREATE TYPE computed_field_data_type AS ENUM ('boolean', 'number', 'string')`,
  );

  await knex.schema.createTableIfNotExists('computed_field', table => {
    table.uuid('id').primary();
    table.string('slug').notNullable();
    table.string('label').notNullable();
    table.specificType('dataType', 'computed_field_data_type').notNullable();

    // timestamps
    table.timestamp('createdAt').defaultTo(knex.raw('now()'));
    table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    table.timestamp('deletedAt');

    // indexes
    table.index('slug');
    table.index('dataType');
    table.index('deletedAt');
    table.unique(['slug', 'deletedAt']);
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTableIfExists('computed_field');
  await knex.schema.raw(`DROP TYPE IF EXISTS computed_field_data_type`);
};
