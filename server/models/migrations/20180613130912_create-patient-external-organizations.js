exports.up = function(knex, Promise) {
  return knex.schema.hasTable('patient_external_organization').then(exists => {
    if (!exists) {
      return knex.schema.createTable('patient_external_organization', table => {
        table.uuid('id').primary();
        table.string('name').notNullable();
        table.string('description');
        table.string('phoneNumber');
        table.string('faxNumber');

        table
          .uuid('patientId')
          .references('id')
          .inTable('patient')
          .notNullable();
        table
          .uuid('addressId')
          .references('id')
          .inTable('address');

        table.boolean('isConsentedForSubstanceUse');
        table.boolean('isConsentedForHiv');
        table.boolean('isConsentedForStd');
        table.boolean('isConsentedForGeneticTesting');
        table.boolean('isConsentedForFamilyPlanning');
        table
          .uuid('consentDocumentId')
          .references('id')
          .inTable('patient_document');

        // timestamps
        table.timestamp('createdAt').defaultTo(knex.raw('now()'));
        table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
        table.timestamp('deletedAt');
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('patient_external_organization').then(exists => {
    if (exists) {
      return knex.schema.dropTable('patient_external_organization');
    }
  });
};
