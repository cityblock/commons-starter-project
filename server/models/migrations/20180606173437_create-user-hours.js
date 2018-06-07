exports.up = function(knex, Promise) {
  return knex.schema.hasTable('user_hours').then(exists => {
    if (!exists) {
      return knex.schema
        .createTable('user_hours', table => {
          table.uuid('id').primary();
          table
            .uuid('userId')
            .references('id')
            .inTable('user')
            .notNullable();
          table.integer('weekday').notNullable();
          table.specificType('timeRange', 'int4range').notNullable();

          // timestamps
          table.timestamp('createdAt').defaultTo(knex.raw('now()'));
          table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
          table.timestamp('deletedAt');
        })
        .raw(
          'create unique index user_hours_one_per_day on user_hours ("userId", "weekday") where "deletedAt" IS NULL;',
        );
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('user_hours').then(exists => {
    if (exists) {
      return knex.schema.dropTable('user_hours');
    }
  });
};
