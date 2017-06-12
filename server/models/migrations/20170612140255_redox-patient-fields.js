exports.up = function (knex, Promise) {
  return knex.schema.table('patient', table => {
    table.string('language');
    table.string('middleName');
    table.bool('consentToCall');
    table.bool('consentToText');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('patient', table => {
    table.dropColumn('language');
    table.dropColumn('middleName');
    table.dropColumn('consentToCall');
    table.dropColumn('consentToText');
  });
};
