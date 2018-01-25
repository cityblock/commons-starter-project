exports.up = function(knex, Promise) {
  return knex.schema.alterTable('patient_answer', function(table) {
    table.text('answerValue').alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('patient_answer', function(table) {
    table.string('answerValue').alter();
  });
};
