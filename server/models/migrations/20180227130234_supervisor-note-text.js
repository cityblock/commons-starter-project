exports.up = function(knex, Promise) {
  return knex.schema.alterTable('progress_note', function(table) {
    table.text('supervisorNotes').alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('progress_note', function(table) {
    table.string('supervisorNotes').alter();
  });
};
