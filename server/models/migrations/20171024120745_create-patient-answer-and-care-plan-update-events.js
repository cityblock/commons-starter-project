exports.up = function (knex, Promise) {
  return knex.schema
    .createTableIfNotExists('patient_answer_event', table => {
      table.string('id').primary();
      table.string('patientId').references('id').inTable('patient');
      table.string('userId').references('id').inTable('user');
      table.string('patientAnswerId').references('id').inTable('patient_answer');
      table.string('previousPatientAnswerId').references('id').inTable('patient_answer');
      table.enu('eventType', ['create_patient_answer']);

      // timestamps
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
      table.timestamp('deletedAt');

      // indexes
      table.index('patientId');
      table.index('userId');
      table.index('patientAnswerId');
      table.index('previousPatientAnswerId');
      table.index('eventType');
      table.index('deletedAt');
    })
  .createTableIfNotExists('care_plan_update_event', table => {
    table.string('id').primary();
    table.string('patientId').references('id').inTable('patient');
    table.string('userId').references('id').inTable('user');
    table.string('patientConcernId').references('id').inTable('patient_concern');
    table.string('patientGoalId').references('id').inTable('patient_goal');
    table.enu('eventType', [
      'create_concern',
      'edit_concern',
      'delete_concern',
      'create_goal',
      'edit_goal',
      'delete_goal',
    ]);

    // timestamps
    table.timestamp('createdAt').defaultTo(knex.raw('now()'));
    table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    table.timestamp('deletedAt');

    // indexes
    table.index('patientId');
    table.index('userId');
    table.index('patientConcernId');
    table.index('patientGoalId');
    table.index('eventType');
    table.index('deletedAt');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTableIfExists('patient_answer_event')
    .dropTableIfExists('care_plan_update_event');
};
