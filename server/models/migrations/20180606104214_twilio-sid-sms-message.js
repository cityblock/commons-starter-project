exports.up = function(knex, Promise) {
  return knex.schema.table('sms_message', table => {
    table.string('messageSid').notNullable();
    table.unique('messageSid');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('sms_message', table => {
    table.dropUnique('messageSid');
    table.dropColumn('messageSid');
  });
};
