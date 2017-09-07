exports.up = function(knex, Promise) {
  return knex.schema
    .alterTable('patient_concern', function (table) {
      table.integer('order').defaultTo(1).alter();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .alterTable('patient_concern', function (table) {
      table.integer('order').defaultTo(null).alter();
    });
};
