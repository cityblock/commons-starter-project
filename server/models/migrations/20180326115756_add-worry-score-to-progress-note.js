exports.up = function(knex, Promise) {
  return knex.schema.table('progress_note', table => {
    table.integer('worryScore');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('progress_note', table => {
    table.dropColumn('worryScore');
  });
};
