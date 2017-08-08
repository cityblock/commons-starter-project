exports.up = function (knex, Promise) {
  return knex.schema.raw(`
    ALTER TABLE "answer"
    DROP CONSTRAINT "answer_riskAdjustmentType_check",
    ADD CONSTRAINT "answer_riskAdjustmentType_check"
    CHECK ("riskAdjustmentType" IN (
      'inactive',
      'increment',
      'forceHighRisk'
    ))
  `).raw(`
    ALTER TABLE "answer"
    ALTER COLUMN "riskAdjustmentType"
    SET DEFAULT 'inactive'
  `);
};

exports.down = function (knex, Promise) {
  return knex.schema;
};
