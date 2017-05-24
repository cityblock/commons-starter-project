exports.up = function(knex, Promise) {
  return knex.schema.table('user', table => {
    table.integer('athenaProviderId').unique();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('user', table => {
    table.dropColumn('athenaProviderId');
  });
};
