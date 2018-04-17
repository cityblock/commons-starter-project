exports.up = function(knex, Promise) {
  return knex.schema.alterTable('patient_info', table => {
    table.string('googleCalendarId');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('patient_info', table => {
    table.dropColumn('googleCalendarId');
  });
};
