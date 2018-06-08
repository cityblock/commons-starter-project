exports.up = function(knex, Promise) {
  return knex.schema.table('user', table => {
    table
      .boolean('isAvailable')
      .defaultTo(true)
      .notNullable();

    table
      .text('awayMessage')
      .defaultTo(
        '[Auto response] Sorry, I am away from my work phone. I will get to your message ASAP when back. Please call Member Services at 1-800-336-1100 if urgent.',
      )
      .notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('user', table => {
    table.dropColumn('isAvailable');
    table.dropColumn('awayMessage');
  });
};
