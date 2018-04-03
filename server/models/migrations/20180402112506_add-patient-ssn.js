exports.up = function(knex, Promise) {
  return knex.schema
    .alterTable('patient', table => {
      table.string('ssn');
      table.string('ssnEnd');
    })
    .then(createSSNViewLog);

  function createSSNViewLog() {
    return knex.schema.hasTable('patient_social_security_view').then(exists => {
      if (!exists) {
        return knex.schema.createTable('patient_social_security_view', table => {
          table.uuid('id').primary();
          table
            .uuid('patientId')
            .references('id')
            .inTable('patient')
            .notNullable();
          table
            .uuid('userId')
            .references('id')
            .inTable('user')
            .notNullable();
          table
            .uuid('glassBreakId')
            .references('id')
            .inTable('patient_glass_break');

          table.timestamp('createdAt').defaultTo(knex.raw('now()'));
          table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
        });
      }
    });
  }
};

exports.down = function(knex, Promise) {
  return knex.schema
    .alterTable('patient', table => {
      table.dropColumn('ssn');
      table.dropColumn('ssnEnd');
    })
    .then(dropSSNViewLog);

  function dropSSNViewLog() {
    return knex.schema.hasTable('patient_social_security_view').then(exists => {
      if (exists) {
        return knex.schema.dropTable('patient_social_security_view');
      }
    });
  }
};
