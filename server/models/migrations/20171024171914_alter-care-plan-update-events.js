exports.up = function (knex, Promise) {
  return knex.schema.raw(`
    ALTER TABLE "care_plan_update_event"
    DROP CONSTRAINT "care_plan_update_event_eventType_check",
    ADD CONSTRAINT "care_plan_update_event_eventType_check"
    CHECK ("eventType" IN (
      'create_patient_concern',
      'edit_patient_concern',
      'delete_patient_concern',
      'create_patient_goal',
      'edit_patient_goal',
      'delete_patient_goal'
    ))
  `).raw(`
    ALTER TABLE "care_plan_update_event"
    ADD CONSTRAINT "care_plan_update_event_patientConcernId_patientGoalId_check"
    CHECK ("patientConcernId" IS NULL OR "patientGoalId" IS NULL)
  `);
};

exports.down = function (knex, Promise) {
  return knex.schema.raw(`
    ALTER TABLE "care_plan_update_event"
    DROP CONSTRAINT IF EXISTS "care_plan_update_event_patientConcernId_patientGoalId_check"
  `);
};
