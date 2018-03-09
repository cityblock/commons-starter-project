exports.up = function(knex, Promise) {
  return knex.schema.hasTable('patient_scratch_pad').then(exists => {
    if (!exists) {
      return knex.schema.createTable('patient_scratch_pad', table => {
        table.uuid('id').primary();
        table
          .uuid('patientId')
          .references('id')
          .inTable('patient')
          .notNullable();

        table
          .uuid('userId')
          .references('id')
          .inTable('user')
          .notNullable();

        table.unique(['userId', 'patientId']);

        table
          .text('body')
          .notNullable()
          .defaultTo('');

        // timestamps
        table.timestamp('deletedAt');
        table.timestamp('createdAt').defaultTo(knex.raw('now()'));
        table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('patient_scratch_pad').then(exists => {
    if (exists) {
      return knex.schema.dropTable('patient_scratch_pad');
    }
  });
};
