exports.up = function(knex, Promise) {
  return knex.schema.table('phone_call', table => {
    table.dropColumn('voicemailUrl');
    table.dropColumn('voicemailPayload');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('phone_call', table => {
    table.string('voicemailUrl');
    table.json('voicemailPayload');
  });
};
