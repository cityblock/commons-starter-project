exports.up = function(knex, Promise) {
  return knex.schema
    .table('care_plan_suggestion', table => {
      table.string('patientScreeningToolSubmissionId').references('id').inTable('patient_screening_tool_submission');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table('care_plan_suggestion', table => {
      table.dropColumn('patientScreeningToolSubmissionId');
    });
};
