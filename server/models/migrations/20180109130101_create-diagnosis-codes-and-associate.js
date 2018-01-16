exports.up = function(knex, Promise) {
  return knex.schema
    .createTableIfNotExists('diagnosis_code', table => {
      table.uuid('id').primary();
      table.string('codesetName').notNullable();
      table.text('label').notNullable();
      table.string('code').notNullable();
      table.string('version').notNullable();

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    })
    .createTableIfNotExists('concern_diagnosis_code', table => {
      table.uuid('id').primary();
      table
        .uuid('diagnosisCodeId')
        .references('id')
        .inTable('diagnosis_code')
        .notNullable();
      table
        .uuid('concernId')
        .references('id')
        .inTable('concern')
        .notNullable();

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('concern_diagnosis_code')
    .dropTableIfExists('diagnosis_code');
};
