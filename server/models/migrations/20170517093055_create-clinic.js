exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('clinic', table => {
    table.string('id').primary();
    table.string('name');
    table.integer('departmentId');

    // timestamps
    table.timestamp('createdAt').defaultTo(knex.raw('now()'));
    table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('clinic');
};
