exports.up = function(knex, Promise) {
  return knex.schema
    .createTableIfNotExists('progress_note_template', function(table) {
      table.string('id').primary();
      table.string('title');

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    })
    .createTableIfNotExists('progress_note', function(table) {
      table.string('id').primary();
      table.string('title');

      table
        .string('userId')
        .references('id')
        .inTable('user');
      table
        .string('patientId')
        .references('id')
        .inTable('patient');
      table
        .string('progressNoteTemplateId')
        .references('id')
        .inTable('progress_note_template');

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('completedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    })
    .table('task_event', function(table) {
      table
        .string('progressNoteId')
        .references('id')
        .inTable('progress_note');
    })
    .table('question', function(table) {
      table
        .string('progressNoteId')
        .references('id')
        .inTable('progress_note');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table('task_event', function(table) {
      table.dropColumn('progressNoteId');
    })
    .table('question', function(table) {
      table.dropColumn('progressNoteId');
    })
    .dropTableIfExists('progress_note')
    .dropTableIfExists('progress_note_template');
};
