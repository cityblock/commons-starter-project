exports.up = function(knex, Promise) {
  return knex.schema.hasTable('patient_document').then(exists => {
    if (!exists) {
      return knex.schema.createTable('patient_document', table => {
        table.uuid('id').primary();
        table
          .uuid('patientId')
          .references('id')
          .inTable('patient')
          .notNullable();

        table
          .uuid('uploadedById')
          .references('id')
          .inTable('user')
          .notNullable();

        table.string('filename').notNullable();
        table.string('description');
        table.enu('documentType', [
          'cityblockConsent',
          'hipaaConsent',
          'hieHealthixConsent',
          'hcp',
          'molst',
        ]);

        // timestamps
        table.timestamp('deletedAt');
        table.timestamp('createdAt').defaultTo(knex.raw('now()'));
        table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('patient_document').then(exists => {
    if (exists) {
      return knex.schema.dropTable('patient_document');
    }
  });
};
