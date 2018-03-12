exports.up = function(knex, Promise) {
  return knex.schema.hasTable('patient_state').then(exists => {
    if (!exists) {
      return knex.schema
        .createTable('patient_state', table => {
          table.uuid('id').primary();
          table
            .uuid('patientId')
            .references('id')
            .inTable('patient')
            .notNullable();
          table
            .uuid('updatedById')
            .references('id')
            .inTable('user')
            .notNullable();
          table.enu('currentState', [
            'attributed',
            'assigned',
            'intaking',
            'consented',
            'enrolled',
            'disenrolled',
            'ineligible',
          ]);

          // timestamps
          table.timestamp('deletedAt');
          table.timestamp('createdAt').defaultTo(knex.raw('now()'));
          table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
        })
        .raw(
          `CREATE UNIQUE INDEX patientstate_patientid_unique ON patient_state ("patientId") WHERE "deletedAt" IS NULL`,
        );
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('patient_state').then(exists => {
    if (exists) {
      return knex.schema.dropTable('patient_state');
    }
  });
};
