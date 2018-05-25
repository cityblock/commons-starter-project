exports.up = function(knex, Promise) {
  return knex.schema
    .dropTable('patient_task_suggestion')
    .table('answer', function(table) {
      table.dropIndex('order');
      table.dropIndex('deletedAt');
    })
    .table('patient', function(table) {
      table.dropIndex('homeClinicId');
    })
    .table('question', function(table) {
      table.dropIndex('order');
    })
    .table('patient_answer', function(table) {
      table.dropIndex('patientId');
    })
    .table('patient_answer_event', function(table) {
      table.dropIndex('patientId');
      table.dropIndex('eventType');
      table.dropIndex('userId');
      table.dropIndex('deletedAt');
      table.dropIndex('previousPatientAnswerId');
    })
    .table('goal_suggestion', function(table) {
      table.dropIndex('deletedAt');
    })
    .table('care_plan_suggestion', function(table) {
      table.dropIndex('acceptedAt');
      table.dropIndex('dismissedAt');
    })
    .table('care_plan_update_event', function(table) {
      table.dropIndex('eventType');
      table.dropIndex('patientConcernId');
      table.dropIndex('patientGoalId');
      table.dropIndex('patientId');
      table.dropIndex('userId');
    })
    .table('care_team', function(table) {
      table.dropIndex('deletedAt');
      table.dropIndex('patientId');
    })
    .table('cbo', function(table) {
      table.dropIndex('categoryId');
    })
    .table('concern_suggestion', function(table) {
      table.dropIndex('deletedAt');
    })
    .table('patient_concern', function(table) {
      table.dropIndex('deletedAt');
      table.dropIndex('patientId');
    })
    .table('patient_screening_tool_submission', function(table) {
      table.dropIndex('deletedAt');
      table.dropIndex('scoredAt');
      table.dropIndex('screeningToolId');
    })
    .table('risk_area_assessment_submission', function(table) {
      table.dropIndex('completedAt');
    })
    .table('risk_area', function(table) {
      table.dropIndex('order');
    })
    .table('screening_tool', function(table) {
      table.dropIndex('deletedAt');
      table.dropIndex('riskAreaId');
    })
    .table('screening_tool_score_range', function(table) {
      table.dropIndex('screeningToolId');
    })
    .table('task_comment', function(table) {
      table.dropIndex('deletedAt');
    })
    .table('task_event', function(table) {
      table.dropIndex('eventType');
      table.dropIndex('userId');
      table.dropIndex('deletedAt');
      table.dropIndex('eventCommentId');
      table.dropIndex('eventUserId');
    })
    .table('task', function(table) {
      table.dropIndex('completedById');
      table.dropIndex('createdById');
    })
    .table('user', function(table) {
      table.dropIndex('deletedAt');
      table.dropIndex('homeClinicId');
      table.dropIndex('userRole');
    })
    .table('event_notification', function(table) {
      table.dropIndex('deletedAt');
      table.dropIndex('deliveredAt');
      table.dropIndex('emailSentAt');
      table.dropIndex('seenAt');
    })
    .table('computed_field', function(table) {
      table.dropIndex('dataType');
      table.dropIndex('deletedAt');
      table.dropIndex('slug');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table('answer', function(table) {
      table.index('order');
      table.index('deletedAt');
    })
    .table('patient', function(table) {
      table.index('homeClinicId');
    })
    .table('question', function(table) {
      table.index('order');
    })
    .table('patient_answer', function(table) {
      table.index('patientId');
    })
    .table('patient_answer_event', function(table) {
      table.index('patientId');
      table.index('eventType');
      table.index('userId');
      table.index('deletedAt');
      table.index('previousPatientAnswerId');
    })
    .table('goal_suggestion', function(table) {
      table.index('deletedAt');
    })
    .table('care_plan_suggestion', function(table) {
      table.index('acceptedAt');
      table.index('dismissedAt');
    })
    .table('care_plan_update_event', function(table) {
      table.index('eventType');
      table.index('patientConcernId');
      table.index('patientGoalId');
      table.index('patientId');
      table.index('userId');
    })
    .table('care_team', function(table) {
      table.index('deletedAt');
      table.index('patientId');
    })
    .table('cbo', function(table) {
      table.index('categoryId');
    })
    .table('concern_suggestion', function(table) {
      table.index('deletedAt');
    })
    .table('patient_concern', function(table) {
      table.index('deletedAt');
      table.index('patientId');
    })
    .table('patient_screening_tool_submission', function(table) {
      table.index('deletedAt');
      table.index('scoredAt');
      table.index('screeningToolId');
    })
    .table('risk_area_assessment_submission', function(table) {
      table.index('completedAt');
    })
    .table('risk_area', function(table) {
      table.index('order');
    })
    .table('screening_tool', function(table) {
      table.index('deletedAt');
      table.index('riskAreaId');
    })
    .table('screening_tool_score_range', function(table) {
      table.index('screeningToolId');
    })
    .table('task_comment', function(table) {
      table.index('deletedAt');
    })
    .table('task_event', function(table) {
      table.index('eventType');
      table.index('userId');
      table.index('deletedAt');
      table.index('eventCommentId');
      table.index('eventUserId');
    })
    .table('task', function(table) {
      table.index('completedById');
      table.index('createdById');
    })
    .table('user', function(table) {
      table.index('deletedAt');
      table.index('homeClinicId');
      table.index('userRole');
    })
    .table('event_notification', function(table) {
      table.index('deletedAt');
      table.index('deliveredAt');
      table.index('emailSentAt');
      table.index('seenAt');
    })
    .table('computed_field', function(table) {
      table.index('dataType');
      table.index('deletedAt');
      table.index('slug');
    });
};
