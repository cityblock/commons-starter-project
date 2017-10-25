exports.up = function(knex, Promise) {
  return knex.schema.table('patient_goal', function(table) {
    table
      .string('goalSuggestionTemplateId')
      .references('id')
      .inTable('goal_suggestion_template');
    table
      .string('patientConcernId')
      .references('id')
      .inTable('patient_concern');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('patient_goal', table => {
    table.dropColumn('goalSuggestionTemplateId');
    table.dropColumn('patientConcernId');
  });
};
