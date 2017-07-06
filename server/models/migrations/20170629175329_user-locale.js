exports.up = function (knex, Promise) {
  return knex.schema.table('user', table => {
    table.enu('locale', ['en', 'es']);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('user', table => {
    table.dropColumn('locale');
  });
};
