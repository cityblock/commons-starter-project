exports.up = function(knex, Promise) {
  return knex.schema.alterTable('sms_message', table => {
    table
      .string('contactNumber')
      .notNullable()
      .alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('sms_message', table => {
    table
      .string('contactNumber')
      .nullable()
      .alter();
  });
};
