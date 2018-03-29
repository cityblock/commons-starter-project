exports.up = function(knex, Promise) {
  return (
    knex.schema
      // Order matters!
      .dropTable('patient_consent_form')
      .dropTable('patient_advanced_directive_form')
      .dropTable('consent_form')
      .dropTable('advanced_directive_form')
  );
};

exports.down = function(knex, Promise) {
  return knex.schema
    .createTable('consent_form', table => {
      table.uuid('id').primary();
      table.string('title');

      // indexes
      table.unique('title');

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    })
    .createTable('advanced_directive_form', table => {
      table.uuid('id').primary();
      table.string('title');

      // indexes
      table.unique('title');

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    })
    .createTable('patient_consent_form', table => {
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
        .uuid('formId')
        .references('id')
        .inTable('consent_form')
        .notNullable();
      table.date('signedAt');

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    })
    .createTable('patient_advanced_directive_form', table => {
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
        .uuid('formId')
        .references('id')
        .inTable('advanced_directive_form')
        .notNullable();
      table.date('signedAt');

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    })
    .raw(
      'create unique index patientconsentform_patientid_formid_deletedat on patient_consent_form ("patientId", "formId") where "deletedAt" IS NULL;',
    )
    .raw(
      'create unique index patientadvanceddirectiveform_patientid_formid_deletedat on patient_advanced_directive_form ("patientId", "formId") where "deletedAt" IS NULL;',
    );
};
