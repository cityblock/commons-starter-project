exports.up = function(knex, Promise) {
  return knex.schema.alterTable('patient_screening_tool_submission', function(table) {
    table.timestamp('scoredAt');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('patient_screening_tool_submission', function(table) {
    table.dropColumn('scoredAt');
  });
};
