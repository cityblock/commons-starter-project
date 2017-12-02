exports.up = function(knex, Promise) {
  return knex.schema.table('progress_note', table => {
    table.text('summary');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('progress_note', table => {
    table.dropColumn('summary');
  });
};
