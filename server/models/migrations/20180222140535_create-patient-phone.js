exports.up = function(knex, Promise) {
  return createPhone()
    .then(createPatientPhone)
    .then(editPatientInfo);

  function createPhone() {
    return knex.schema.hasTable('phone').then(exists => {
      if (!exists) {
        return knex.schema.createTable('phone', table => {
          table.uuid('id').primary();
          table.string('phoneNumber').notNullable();
          table.enu('type', ['home', 'work', 'mobile', 'other']);
          table.string('description');
          table
            .uuid('updatedById')
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

  function createPatientPhone() {
    return knex.schema.hasTable('patient_phone').then(exists => {
      if (!exists) {
        return knex.schema.createTable('patient_phone', table => {
          table.uuid('id').primary();
          table
            .uuid('patientId')
            .references('id')
            .inTable('patient')
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
          CREATE UNIQUE INDEX patientphone_phoneid_patientid_unique ON patient_phone ("phoneId", "patientId")
          WHERE "deletedAt" IS NULL;
        `).raw(`
          CREATE UNIQUE INDEX patientphone_phoneid_patientid_deletedat_unique ON patient_phone ("phoneId", "patientId", "deletedAt")
          WHERE "deletedAt" IS NOT NULL;
        `);
      }
    });
  }

  function editPatientInfo() {
    return knex.schema.table('patient_info', table => {
      table
        .uuid('primaryPhoneId')
        .references('id')
        .inTable('phone');
    });
  }
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table('patient_info', table => {
      table.dropColumn('primaryPhoneId');
    })
    .then(dropPatientPhone)
    .then(dropPhone);

  function dropPatientPhone() {
    return knex.schema.hasTable('patient_phone').then(exists => {
      if (exists) {
        return knex.schema.dropTable('patient_phone');
      }
    });
  }

  function dropPhone() {
    return knex.schema.hasTable('phone').then(exists => {
      if (exists) {
        return knex.schema.dropTable('phone');
      }
    });
  }
};
