exports.up = function(knex, Promise) {
  return knex.schema.alterTable('computed_patient_status', table => {
    table.boolean('hasProgressNote');
    table.boolean('hasChp');
    table.boolean('hasOutreachSpecialist');
    table.boolean('hasPcp');
    table.boolean('isAssessed');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('computed_patient_status', table => {
    table.dropColumn('hasProgressNote');
    table.dropColumn('hasChp');
    table.dropColumn('hasOutreachSpecialist');
    table.dropColumn('hasPcp');
    table.dropColumn('isAssessed');
  });
};
