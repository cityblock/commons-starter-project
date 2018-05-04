exports.up = function(knex, Promise) {
  return knex.schema.alterTable('patient_siu_event', table => {
    table.bigInteger('transmissionId').notNullable().alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('patient_siu_event', table => {
    table.string('transmissionId').notNullable().alter();
  });
};
