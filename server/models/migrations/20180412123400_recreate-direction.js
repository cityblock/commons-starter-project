exports.up = function(knex, Promise) {
  return knex.schema.table('sms_message', table => {
    table.enu('direction', ['toUser', 'fromUser']).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('sms_message', table => {
    table.dropColumn('direction');
  });
};
