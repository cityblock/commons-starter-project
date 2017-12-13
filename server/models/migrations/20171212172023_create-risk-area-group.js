
exports.up = function(knex, Promise) {
  return knex.schema
    .createTableIfNotExists('risk_area_group', function(table) {
      table.uuid('id').primary();
      table.string('title').notNullable();
      table.integer('mediumRiskThreshold').notNullable();
      table.integer('highRiskThreshold').notNullable();

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('risk_area_group');
};
