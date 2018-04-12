exports.up = function(knex, Promise) {
  return knex.schema.alterTable('cbo', table => {
    table
      .string('url')
      .nullable()
      .alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('cbo', table => {
    table
      .string('url')
      .nonNullable()
      .alter();
  });
};
