exports.up = function(knex, Promise) {
  return createPatientProvider()
    .then(createPatientProviderPhone)
    .then(createPatientProviderEmail);

  function createPatientProvider() {
    return knex.schema.hasTable('patient_external_provider').then(exists => {
      if (!exists) {
        return knex.schema.createTable('patient_external_provider', table => {
          table.uuid('id').primary();
          table
            .uuid('patientId')
            .references('id')
            .inTable('patient')
            .notNullable();

          table.string('role').notNullable();
          table
            .boolean('isMedicalSpecialist')
            .notNullable()
            .defaultTo(false);

          table.string('firstName');
          table.string('lastName');
          table.string('agencyName').notNullable();
          table.string('description');

          table
            .uuid('updatedById')
            .references('id')
            .inTable('user')
            .notNullable();

          // timestamps
          table.timestamp('deletedAt');
          table.timestamp('createdAt').defaultTo(knex.raw('now()'));
          table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
        });
      }
    });
  }

  function createPatientProviderPhone() {
    return knex.schema.hasTable('patient_external_provider_phone').then(exists => {
      if (!exists) {
        return knex.schema.createTable('patient_external_provider_phone', table => {
          table.uuid('id').primary();
          table
            .uuid('patientExternalProviderId')
            .references('id')
            .inTable('patient_external_provider')
            .notNullable();
          table
            .uuid('phoneId')
            .references('id')
            .inTable('phone')
            .notNullable();

          // timestamps
          table.timestamp('deletedAt');
          table.timestamp('createdAt').defaultTo(knex.raw('now()'));
          table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
        }).raw(`
          CREATE UNIQUE INDEX patientexternalproviderphone_phoneid_patientexternalproviderid_unique ON patient_external_provider_phone ("phoneId", "patientExternalProviderId")
          WHERE "deletedAt" IS NULL;
        `).raw(`
          CREATE UNIQUE INDEX patientexternalproviderphone_phoneid_deletedat_patientexternalproviderid_unique ON patient_external_provider_phone ("phoneId", "patientExternalProviderId", "deletedAt")
          WHERE "deletedAt" IS NOT NULL;
        `);
      }
    });
  }

  function createPatientProviderEmail() {
    return knex.schema.hasTable('patient_external_provider_email').then(exists => {
      if (!exists) {
        return knex.schema.createTable('patient_external_provider_email', table => {
          table.uuid('id').primary();
          table
            .uuid('patientExternalProviderId')
            .references('id')
            .inTable('patient_external_provider')
            .notNullable();
          table
            .uuid('emailId')
            .references('id')
            .inTable('email')
            .notNullable();

          // timestamps
          table.timestamp('deletedAt');
          table.timestamp('createdAt').defaultTo(knex.raw('now()'));
          table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
        }).raw(`
          CREATE UNIQUE INDEX patientexternalprovideremail_emailid_patientexternalproviderid_unique ON patient_external_provider_email ("emailId", "patientExternalProviderId")
          WHERE "deletedAt" IS NULL;
        `).raw(`
          CREATE UNIQUE INDEX patientexternalprovideremail_emailid_deletedat_patientexternalproviderid_unique ON patient_external_provider_email ("emailId", "patientExternalProviderId", "deletedAt")
          WHERE "deletedAt" IS NOT NULL;
        `);
      }
    });
  }
};

exports.down = function(knex, Promise) {
  return dropPatientProviderEmail()
    .then(dropPatientProviderPhone)
    .then(dropPatientProvider);

  function dropPatientProviderPhone() {
    return knex.schema.hasTable('patient_external_provider_phone').then(exists => {
      if (exists) {
        return knex.schema.dropTable('patient_external_provider_phone');
      }
    });
  }

  function dropPatientProviderEmail() {
    return knex.schema.hasTable('patient_external_provider_email').then(exists => {
      if (exists) {
        return knex.schema.dropTable('patient_external_provider_email');
      }
    });
  }

  function dropPatientProvider() {
    return knex.schema.hasTable('patient_external_provider').then(exists => {
      if (exists) {
        return knex.schema.dropTable('patient_external_provider');
      }
    });
  }
};
