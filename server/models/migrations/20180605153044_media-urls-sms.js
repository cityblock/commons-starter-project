exports.up = function(knex, Promise) {
  return knex.schema.table('sms_message', table => {
    table.json('mediaUrls');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('sms_message', table => {
    table.dropColumn('mediaUrls');
  });
};
