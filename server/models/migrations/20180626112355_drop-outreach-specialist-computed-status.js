exports.up = function(knex, Promise) {
  return knex.schema.table('computed_patient_status', table => {
    table.dropColumn('hasOutreachSpecialist');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('computed_patient_status', table => {
    table
      .boolean('hasOutreachSpecialist')
      .notNullable()
      .defaultTo(false);
  });
};
