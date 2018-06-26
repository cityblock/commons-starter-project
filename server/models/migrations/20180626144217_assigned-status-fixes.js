exports.up = function(knex, Promise) {
  return knex.schema.table('computed_patient_status', table => {
    table
      .boolean('hasCareTeam')
      .notNullable()
      .defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('computed_patient_status', table => {
    table.dropColumn('hasCareTeam');
  });
};
