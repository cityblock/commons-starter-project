exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('computed_patient_status', table => {
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
    table.boolean('hasCareTeamMember');
    table.boolean('hasProgressNote');
    table.boolean('coreIdVerified');
    table.boolean('consentsSigned');
    table.boolean('hasPcp');
    table.boolean('isIneligible');
    table.boolean('isDisenrolled');

    // timestamps
    table.timestamp('deletedAt');
    table.timestamp('createdAt').defaultTo(knex.raw('now()'));
    table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('computed_patient_status');
};
