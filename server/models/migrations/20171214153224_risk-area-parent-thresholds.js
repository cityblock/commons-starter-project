exports.up = function(knex, Promise) {
  return knex.schema.alterTable('risk_area', table => {
    table
      .integer('mediumRiskThreshold')
      .notNullable()
      .defaultTo(50);
    table
      .integer('highRiskThreshold')
      .notNullable()
      .defaultTo(80);
    table
      .uuid('riskAreaGroupId')
      .references('id')
      .inTable('risk_area_group');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('risk_area', table => {
    table.dropForeign('riskAreaGroupId');
    table.dropColumns('mediumRiskThreshold', 'highRiskThreshold', 'riskAreaGroupId');
  });
};
