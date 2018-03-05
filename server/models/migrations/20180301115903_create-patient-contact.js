exports.up = function(knex, Promise) {
  return createPatientContact()
    .then(createPatientContactPhone)
    .then(createPatientContactEmail)
    .then(createPatientContactAddress);

  function createPatientContact() {
    return knex.schema.hasTable('patient_contact').then(exists => {
      if (!exists) {
        return knex.schema.createTable('patient_contact', table => {
          table.uuid('id').primary();
          table
            .uuid('patientId')
            .references('id')
            .inTable('patient')
            .notNullable();

          table.string('relationToPatient').notNullable();
          table.string('firstName').notNullable();
          table.string('lastName').notNullable();
          table
            .boolean('isEmergencyContact')
            .notNullable()
            .defaultTo(false);
          table
            .boolean('isHealthcareProxy')
            .notNullable()
            .defaultTo(false);
          table
            .boolean('canContact')
            .notNullable()
            .defaultTo(false);
          table.string('description');

          table
            .uuid('primaryPhoneId')
            .references('id')
            .inTable('phone')
            .notNullable();
          table
            .uuid('primaryEmailId')
            .references('id')
            .inTable('email');
          table
            .uuid('primaryAddressId')
            .references('id')
            .inTable('address');

          table
            .uuid('updatedById')
            .references('id')
            .inTable('user')
            .notNullable();

          // timestamps
          table.timestamp('createdAt').defaultTo(knex.raw('now()'));
          table.timestamp('updatedAt').defaultTo(knex.raw('now()'));

          // indexes
          table.index('patientId');
        });
      }
    });
  }

  function createPatientContactPhone() {
    return knex.schema.hasTable('patient_contact_phone').then(exists => {
      if (!exists) {
        return knex.schema.createTable('patient_contact_phone', table => {
          table.uuid('id').primary();
          table
            .uuid('patientContactId')
            .references('id')
            .inTable('patient_contact')
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
          CREATE UNIQUE INDEX patientcontactphone_phoneid_patientcontactid_unique ON patient_contact_phone ("phoneId", "patientContactId")
          WHERE "deletedAt" IS NULL;
        `).raw(`
          CREATE UNIQUE INDEX patientcontactphone_phoneid_patientcontactid_deletedat_unique ON patient_contact_phone ("phoneId", "patientContactId", "deletedAt")
          WHERE "deletedAt" IS NOT NULL;
        `);
      }
    });
  }

  function createPatientContactEmail() {
    return knex.schema.hasTable('patient_contact_email').then(exists => {
      if (!exists) {
        return knex.schema.createTable('patient_contact_email', table => {
          table.uuid('id').primary();
          table
            .uuid('patientContactId')
            .references('id')
            .inTable('patient_contact')
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
          CREATE UNIQUE INDEX patientcontactemail_emailid_patientcontactid_unique ON patient_contact_email ("emailId", "patientContactId")
          WHERE "deletedAt" IS NULL;
        `).raw(`
          CREATE UNIQUE INDEX patientcontactemail_emailid_patientcontactid_deletedat_unique ON patient_contact_email ("emailId", "patientContactId", "deletedAt")
          WHERE "deletedAt" IS NOT NULL;
        `);
      }
    });
  }

  function createPatientContactAddress() {
    return knex.schema.hasTable('patient_contact_address').then(exists => {
      if (!exists) {
        return knex.schema.createTable('patient_contact_address', table => {
          table.uuid('id').primary();
          table
            .uuid('patientContactId')
            .references('id')
            .inTable('patient_contact')
            .notNullable();
          table
            .uuid('addressId')
            .references('id')
            .inTable('address')
            .notNullable();

          // timestamps
          table.timestamp('deletedAt');
          table.timestamp('createdAt').defaultTo(knex.raw('now()'));
          table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
        }).raw(`
          CREATE UNIQUE INDEX patientcontactaddress_addressid_patientcontactid_unique ON patient_contact_address ("addressId", "patientContactId")
          WHERE "deletedAt" IS NULL;
        `).raw(`
          CREATE UNIQUE INDEX patientcontactaddress_addressid_patientcontactid_deletedat_unique ON patient_contact_address ("addressId", "patientContactId", "deletedAt")
          WHERE "deletedAt" IS NOT NULL;
        `);
      }
    });
  }
};

exports.down = function(knex, Promise) {
  return dropPatientContactAddress()
    .then(dropPatientContactEmail)
    .then(dropPatientContactPhone)
    .then(dropPatientContact);

  function dropPatientContactPhone() {
    return knex.schema.hasTable('patient_contact_phone').then(exists => {
      if (exists) {
        return knex.schema.dropTable('patient_contact_phone');
      }
    });
  }

  function dropPatientContactEmail() {
    return knex.schema.hasTable('patient_contact_email').then(exists => {
      if (exists) {
        return knex.schema.dropTable('patient_contact_email');
      }
    });
  }

  function dropPatientContactAddress() {
    return knex.schema.hasTable('patient_contact_address').then(exists => {
      if (exists) {
        return knex.schema.dropTable('patient_contact_address');
      }
    });
  }

  function dropPatientContact() {
    return knex.schema.hasTable('patient_contact').then(exists => {
      if (exists) {
        return knex.schema.dropTable('patient_contact');
      }
    });
  }
};
