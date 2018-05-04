exports.up = function(knex, Promise) {
  return knex.schema.hasTable('patient_siu_event').then(exists => {
    if (!exists) {
      return knex.schema.createTable('patient_siu_event', table => {
        table.uuid('id').primary();
        table
          .string('visitId')
          .unique()
          .notNullable();
        table
          .uuid('patientId')
          .references('id')
          .inTable('patient')
          .notNullable();
        table.string('transmissionId').notNullable();
        table.string('googleEventId').notNullable();

        // timestamps
        table.timestamp('deletedAt');
        table.timestamp('createdAt').defaultTo(knex.raw('now()'));
        table.timestamp('updatedAt').defaultTo(knex.raw('now()'));

        table.index('visitId');
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('patient_siu_event').then(exists => {
    if (exists) {
      return knex.schema.dropTable('patient_siu_event');
    }
  });
};
