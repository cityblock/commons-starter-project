exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('user', table => {
    table.string('id').primary();
    table.string('firstName');
    table.string('lastName');
    table.string('userRole');
    table
      .string('email')
      .notNullable()
      .unique();
    table.string('hashedPassword').notNullable();
    table.string('lastLoginAt');

    // timestamps
    table.timestamp('createdAt').defaultTo(knex.raw('now()'));
    table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user');
};
