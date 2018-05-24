exports.up = function(knex, Promise) {
  return knex.schema
    .table('patient_answer', table => {
      // indexes
      table.index('patientId');
    })
    .table('answer', table => {
      // indexes
      table.index('questionId');
      table.index('deletedAt');
    })
    .raw(
      'CREATE INDEX patient_answer_deleted_at_null ON patient_answer ("deletedAt" NULLS FIRST, "patientId")',
    );
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table('patient_answer', table => {
      // indexes
      table.dropIndex('patientId');
    })
    .table('answer', table => {
      // indexes
      table.dropIndex('questionId');
      table.dropIndex('deletedAt');
    })
    .raw('DROP INDEX patient_answer_deleted_at_null');
};
