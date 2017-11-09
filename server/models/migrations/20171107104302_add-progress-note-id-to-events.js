exports.up = function(knex, Promise) {
  return knex.schema
    .table('patient_answer_event', function(table) {
      table.uuid('progressNoteId');
      table
        .foreign('progressNoteId')
        .references('id')
        .inTable('progress_note');
    })
    .table('care_plan_update_event', function(table) {
      table.uuid('progressNoteId');
      table
        .foreign('progressNoteId')
        .references('id')
        .inTable('progress_note');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table('patient_answer_event', function(table) {
      table.dropColumn('progressNoteId');
    })
    .table('care_plan_update_event', function(table) {
      table.dropColumn('progressNoteId');
    });
};
