exports.up = function(knex, Promise) {
  return knex.schema.table('risk_area_group', table => {
    table
      .integer('order')
      .defaultTo(1)
      .notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('risk_area_group', table => {
    table.dropColumn('order');
  });
};
