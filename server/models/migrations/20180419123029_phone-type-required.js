exports.up = function(knex, Promise) {
  return knex.schema.alterTable('phone', table => {
    table
      .text('type')
      .notNullable()
      .defaultTo('other')
      .alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('phone', table => {
    table
      .text('type')
      .nullable()
      .alter();
  });
};
