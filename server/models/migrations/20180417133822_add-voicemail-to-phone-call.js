exports.up = function(knex, Promise) {
  return knex.schema.table('phone_call', table => {
    table.string('callSid').notNullable();
    table.string('voicemailUrl');
    table.json('voicemailPayload');

    table.unique('callSid');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('phone_call', table => {
    table.dropUnique('callSid');

    table.dropColumn('callSid');
    table.dropColumn('voicemailUrl');
    table.dropColumn('voicemailPayload');
  });
};
