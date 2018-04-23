exports.up = function(knex, Promise) {
  return knex.schema.alterTable('google_auth', table => {
    table.string('refreshToken');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('google_auth', table => {
    table.dropColumn('refreshToken');
  });
};
