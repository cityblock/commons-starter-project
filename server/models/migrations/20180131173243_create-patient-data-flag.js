exports.up = function(knex, Promise) {
  return knex.schema
    .createTableIfNotExists('patient_data_flag', table => {
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
      table.string('fieldName');
      table.text('suggestedValue');

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    })
    .table('patient', table => {
      table.timestamp('coreIdentityValidatedAt');
      table
        .uuid('coreIdentityValidatedById')
        .references('id')
        .inTable('user');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('patient_data_flag')
    .table('patient', table => {
      table.dropColumn('coreIdentityValidatedAt');
      table.dropColumn('coreIdentityValidatedById');
    });
};
