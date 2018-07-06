exports.up = function(knex, Promise) {
  return knex.schema.hasTable('puppy').then(exists => {
    if (!exists) {
      return knex.schema.createTable('puppy', table => {
        table.uuid('id').primary();
        table.string('name').notNullable();

        // timestamps
        table.timestamp('deletedAt');
        table.timestamp('createdAt').defaultTo(knex.raw('now()'));
        table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('puppy').then(exists => {
    if (exists) {
      return knex.schema.dropTable('puppy');
    }
  });
};
