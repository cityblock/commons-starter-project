exports.up = function(knex, Promise) {
  return knex.schema.raw(
    'alter table patient_screening_tool_submission add column if not exists "screeningToolScoreRangeId" character varying(255) references screening_tool_score_range',
  );
};

exports.down = function(knex, Promise) {
  return knex.schema;
};
