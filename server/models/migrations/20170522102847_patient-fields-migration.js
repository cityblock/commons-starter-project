exports.up = function (knex, Promise) {
  return knex.schema.table('patient', table => {
    table.enu('gender', ['M', 'F']);
    table.string('dateOfBirth');
    table.integer('zip');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('patient', table => {
    table.dropColumn('gender');
    table.dropColumn('dateOfBirth');
    table.dropColumn('zip');
  });
};
