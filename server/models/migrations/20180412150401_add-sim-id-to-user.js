exports.up = function(knex, Promise) {
  return knex.schema.table('user', table => {
    table.string('twilioSimId');

    table.unique('twilioSimId');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('user', table => {
    table.dropUnique('twilioSimId');

    table.dropColumn('twilioSimId');
  });
};
