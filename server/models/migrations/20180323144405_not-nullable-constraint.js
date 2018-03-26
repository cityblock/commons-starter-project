exports.up = function(knex, Promise) {
  return knex.schema.alterTable('patient', table => {
    table
      .integer('cityblockId')
      .defaultTo(0)
      .notNullable()
      .alter();
    table.unique('cityblockId');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('patient', table => {
    table
      .integer('cityblockId')
      .nullable()
      .alter();
  });
};
