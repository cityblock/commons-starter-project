exports.up = function(knex, Promise) {
  return knex.schema
    .table('diagnosis_code', table => table.index('code'))
    .table('patient_concern', table => table.index('order'))
    .raw(`DROP INDEX index_patient_full_name`)
    .raw('DROP INDEX screening_tool_score_range_deletedat_index');
};

exports.down = function(knex, Promise) {
  return knex.schema;
};
