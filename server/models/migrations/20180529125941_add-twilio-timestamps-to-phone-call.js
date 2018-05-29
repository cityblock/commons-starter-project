exports.up = function(knex, Promise) {
  return knex.schema.table('phone_call', table => {
    table.timestamp('twilioCreatedAt').notNullable();
    table.timestamp('twilioUpdatedAt').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('phone_call', table => {
    table.dropColumn('twilioCreatedAt');
    table.dropColumn('twilioUpdatedAt');
  });
};
