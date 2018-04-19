exports.up = function(knex, Promise) {
  return knex.schema
    .raw(
      `
    UPDATE phone
    SET type = 'other'
    WHERE type IS NULL;
  `,
    )
    .alterTable('phone', table => {
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
