exports.up = function(knex, Promise) {
  return knex.schema.table('risk_area', table => {
    table
      .enu('assessmentType', ['manual', 'automated'])
      .defaultTo('manual')
      .notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('risk_area', table => {
    table.dropColumn('assessmentType');
  });
};
