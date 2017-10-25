exports.up = function(knex, Promise) {
  return knex.schema.table('patient', table => {
    table.text('scratchPad');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('patient', table => {
    table.dropColumn('scratchPad');
  });
};
