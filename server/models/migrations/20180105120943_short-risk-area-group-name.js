exports.up = function(knex, Promise) {
  return knex.schema.table('risk_area_group', table => {
    table
      .string('shortTitle', 14)
      .defaultTo('Short title')
      .notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('risk_area_group', table => {
    table.dropColumn('shortTitle');
  });
};
