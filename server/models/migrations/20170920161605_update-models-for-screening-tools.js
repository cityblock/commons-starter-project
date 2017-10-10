exports.up = function (knex, Promise) {
  return knex.schema
    .table('question', table => {
      table.string('screeningToolId').references('id').inTable('screening_tool');

      table.index('screeningToolId');
    })
    .table('concern_suggestion', table => {
      table.string('screeningToolScoreRangeId').references('id').inTable('screening_tool_score_range');

      table.index('screeningToolScoreRangeId');
    })
    .table('goal_suggestion', table => {
      table.string('screeningToolScoreRangeId').references('id').inTable('screening_tool_score_range');

      table.index('screeningToolScoreRangeId');
    })
    .table('patient_answer', table => {
      table.string('patientScreeningToolSubmissionId').references('id')
        .inTable('patient_screening_tool_submission');

      table.index('patientScreeningToolSubmissionId');
    });
};

exports.down = function (knex, Promise) {
  return knex.schema
    .table('question', table => {
      table.dropIndex('screeningToolId');
      table.dropColumn('screeningToolId');
    })
    .table('concern_suggestion', table => {
      table.dropIndex('screeningToolScoreRangeId');
      table.dropColumn('screeningToolScoreRangeId');
    })
    .table('goal_suggestion', table => {
      table.dropIndex('screeningToolScoreRangeId');
      table.dropColumn('screeningToolScoreRangeId');
    })
    .table('patient_answer', table => {
      table.dropIndex('patientScreeningToolSubmissionId');
      table.dropColumn('patientScreeningToolSubmissionId');
    });
};
