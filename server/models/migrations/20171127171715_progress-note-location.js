exports.up = function(knex, Promise) {
  return knex.schema.table('progress_note', table => {
    table.timestamp('startedAt');
    table.string('location');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('progress_note', table => {
    table.dropColumn('location');
    table.dropColumn('startedAt');
  });
};
