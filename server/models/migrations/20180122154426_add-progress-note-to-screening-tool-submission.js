exports.up = function(knex, Promise) {
  return knex.schema.table('patient_screening_tool_submission', function(table) {
    table.uuid('progressNoteId');
    table
      .foreign('progressNoteId')
      .references('id')
      .inTable('progress_note');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('patient_screening_tool_submission', function(table) {
    table.dropColumn('progressNoteId');
  });
};
