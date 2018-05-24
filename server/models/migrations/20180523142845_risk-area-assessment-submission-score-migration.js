exports.up = function(knex, Promise) {
  return knex.schema.alterTable('risk_area_assessment_submission', table => {
    table.integer('score');
    table.boolean('forceHighRisk');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('risk_area_assessment_submission', table => {
    table.dropColumn('score');
    table.dropColumn('forceHighRisk');
  });
};
