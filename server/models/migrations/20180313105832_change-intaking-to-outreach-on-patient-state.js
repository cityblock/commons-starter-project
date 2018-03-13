exports.up = function(knex, Promise) {
  return knex.schema.raw(`
    ALTER TABLE "patient_state"
    DROP CONSTRAINT "patient_state_currentState_check"
  `).raw(`
    UPDATE "patient_state"
    SET "currentState" = 'outreach'
    WHERE "currentState" = 'intaking'
  `).raw(`
    ALTER TABLE "patient_state"
    ADD CONSTRAINT "patient_state_currentState_check"
    CHECK ("currentState" IN (
      'attributed',
      'assigned',
      'outreach',
      'consented',
      'enrolled',
      'disenrolled',
      'ineligible'
    ))
  `);
};

exports.down = function(knex, Promise) {
  return knex.schema.raw(`
    ALTER TABLE "patient_state"
    DROP CONSTRAINT "patient_state_currentState_check"
  `).raw(`
    UPDATE "patient_state"
    SET "currentState" = 'intaking'
    WHERE "currentState" = 'outreach'
  `).raw(`
    ALTER TABLE "patient_state"
    ADD CONSTRAINT "patient_state_currentState_check"
    CHECK ("currentState" IN (
      'attributed',
      'assigned',
      'intaking',
      'consented',
      'enrolled',
      'disenrolled',
      'ineligible'
    ))
  `);
};
