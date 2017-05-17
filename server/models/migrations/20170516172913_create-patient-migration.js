exports.up = function(knex, Promise) {
  return knex.schema
    .createTableIfNotExists('patient', table => {
      table.string('id').primary();
      table.string('firstName');
      table.string('lastName');
      table.integer('athenaPatientId');

      // timestamps
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('patient');
};
