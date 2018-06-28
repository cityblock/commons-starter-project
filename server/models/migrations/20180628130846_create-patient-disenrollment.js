exports.up = function(knex, Promise) {
  return knex.schema.hasTable('patient_disenrollment').then(exists => {
    if (!exists) {
      return knex.schema.createTable('patient_disenrollment', table => {
        table.uuid('id').primary();
        table
          .uuid('patientId')
          .references('id')
          .inTable('patient')
          .notNullable();

        table
          .enu('reason', [
            'transferPlan',
            'moved',
            'dissatisfied',
            'ineligible',
            'deceased',
            'other',
          ])
          .notNullable();

        table.text('note');

        // timestamps
        table.timestamp('deletedAt');
        table.timestamp('createdAt').defaultTo(knex.raw('now()'));
        table.timestamp('updatedAt').defaultTo(knex.raw('now()'));

        table.unique('patientId');
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('patient_disenrollment').then(exists => {
    if (exists) {
      return knex.schema.dropTable('patient_disenrollment');
    }
  });
};
