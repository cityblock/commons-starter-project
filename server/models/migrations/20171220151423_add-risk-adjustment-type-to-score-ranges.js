exports.up = function(knex, Promise) {
  return knex.schema.raw(`
    ALTER TABLE "screening_tool_score_range"
    ADD COLUMN "riskAdjustmentType" TEXT NOT NULL DEFAULT 'increment',
    ADD CONSTRAINT "screening_tool_score_range_riskAdjustmentType_check"
    CHECK ("riskAdjustmentType" IN (
      'inactive',
      'increment',
      'forceHighRisk'
    ))
  `);
};

exports.down = function(knex, Promise) {
  return knex.schema.raw(`
    ALTER TABLE "screening_tool_score_range"
    DROP CONSTRAINT "screening_tool_score_range_riskAdjustmentType_check",
    DROP COLUMN "riskAdjustmentType"
  `);
};
