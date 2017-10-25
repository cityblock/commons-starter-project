exports.up = function(knex, Promise) {
  return knex.schema.alterTable('patient', function(table) {
    table.string('zip').alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('patient', function(table) {
    table.integer('zip').alter();
  });
};
