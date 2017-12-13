exports.up = function(knex, Promise) {
  return knex.schema
    .createTableIfNotExists('risk_area_assessment_submission', table => {
      table.uuid('id').primary();
      table
        .uuid('patientId')
        .notNullable()
        .references('id')
        .inTable('patient');

      table
        .uuid('userId')
        .notNullable()
        .references('id')
        .inTable('user');

      table
        .uuid('riskAreaId')
        .notNullable()
        .references('id')
        .inTable('risk_area');

      // timestamps
      table.timestamp('completedAt');
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));

      // indexes
      table.index('patientId');
      table.index('userId');
      table.index('riskAreaId');
      table.index('completedAt');
    })
    .table('patient_screening_tool_submission', table => {
      table.index('scoredAt');
    })
    .table('care_plan_suggestion', table => {
      table
        .uuid('riskAreaAssessmentSubmissionId')
        .references('id')
        .inTable('risk_area_assessment_submission');
    })
    .table('patient_answer', table => {
      table
        .uuid('riskAreaAssessmentSubmissionId')
        .references('id')
        .inTable('risk_area_assessment_submission');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table('patient_answer', table => {
      table.dropColumn('riskAreaAssessmentSubmissionId');
    })
    .table('care_plan_suggestion', table => {
      table.dropColumn('riskAreaAssessmentSubmissionId');
    })
    .table('patient_screening_tool_submission', table => {
      table.dropIndex('scoredAt');
    })
    .dropTableIfExists('risk_area_assessment_submission');
};
