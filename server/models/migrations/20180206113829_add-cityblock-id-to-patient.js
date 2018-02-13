exports.up = function(knex, Promise) {
  return knex.schema.table('patient', table => {
    table.integer('cityblockId');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('patient', table => {
    table.dropColumn('cityblockId');
  });
};
