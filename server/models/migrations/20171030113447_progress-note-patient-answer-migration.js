exports.up = function(knex, Promise) {
  return knex.schema.table('patient_answer', function(table) {
    table
      .string('progressNoteId')
      .references('id')
      .inTable('progress_note');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('patient_answer', function(table) {
    table.dropColumn('progressNoteId');
  });
};
