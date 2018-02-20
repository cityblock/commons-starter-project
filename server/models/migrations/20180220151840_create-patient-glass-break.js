exports.up = function(knex, Promise) {
  return knex.schema.hasTable('patient_glass_break').then(exists => {
    if (!exists) {
      return knex.schema.createTable('patient_glass_break', table => {
        table.uuid('id').primary();
        table
          .uuid('userId')
          .references('id')
          .inTable('user')
          .notNullable();
        table
          .uuid('patientId')
          .references('id')
          .inTable('patient')
          .notNullable();
        table.string('reason').notNullable();
        table.text('note');

        // timestamps
        table.timestamp('deletedAt');
        table.timestamp('createdAt').defaultTo(knex.raw('now()'));
        table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('patient_glass_break').then(exists => {
    if (exists) {
      return knex.schema.dropTable('patient_glass_break');
    }
  });
};
