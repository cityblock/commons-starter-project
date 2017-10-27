exports.up = function(knex, Promise) {
  return knex.schema.table('question', function(table) {
    table.dropColumn('progressNoteId');
    table
      .string('progressNoteTemplateId')
      .references('id')
      .inTable('progress_note_template');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('question', function(table) {
    table.dropColumn('progressNoteTemplateId');
    table
      .string('progressNoteId')
      .references('id')
      .inTable('progress_note');
  });
};
