exports.up = async function(knex, Promise) {
  return knex.schema.table('sms_message', table => {
    table.dropColumn('direction');
  });
};

exports.down = async function(knex, Promise) {
  return knex.schema.table('sms_message', table => {
    table.enu('direction', ['inbound', 'outbound']).notNullable();
  });
};
