exports.up = function(knex, Promise) {
  return createEmail()
    .then(createPatientEmail)
    .then(editPatientInfo);

  function createEmail() {
    return knex.schema.hasTable('email').then(exists => {
      if (!exists) {
        return knex.schema.createTable('email', table => {
          table.uuid('id').primary();
          table.string('email').notNullable();
          table.string('description');
          table
            .uuid('updatedBy')
            .references('id')
            .inTable('user')
            .notNullable();

          // timestamps
          table.timestamp('createdAt').defaultTo(knex.raw('now()'));
          table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
        });
      }
    });
  }

  function createPatientEmail() {
    return knex.schema.hasTable('patient_email').then(exists => {
      if (!exists) {
        return knex.schema.createTable('patient_email', table => {
          table.uuid('id').primary();
          table
            .uuid('patientId')
            .references('id')
            .inTable('patient')
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
          CREATE UNIQUE INDEX patientemail_emailid_patientid_unique ON patient_email ("emailId", "patientId")
          WHERE "deletedAt" IS NULL;
        `).raw(`
          CREATE UNIQUE INDEX patientemail_emailid_patientid_deletedat_unique ON patient_email ("emailId", "patientId", "deletedAt")
          WHERE "deletedAt" IS NOT NULL;
        `);
      }
    });
  }

  function editPatientInfo() {
    return knex.schema.table('patient_info', table => {
      table
        .uuid('primaryEmailId')
        .references('id')
        .inTable('email');
    });
  }
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table('patient_info', table => {
      table.dropColumn('primaryEmailId');
    })
    .then(dropPatientEmail)
    .then(dropEmail);

  function dropPatientEmail() {
    return knex.schema.hasTable('patient_email').then(exists => {
      if (exists) {
        return knex.schema.dropTable('patient_email');
      }
    });
  }

  function dropEmail() {
    return knex.schema.hasTable('email').then(exists => {
      if (exists) {
        return knex.schema.dropTable('email');
      }
    });
  }
};
