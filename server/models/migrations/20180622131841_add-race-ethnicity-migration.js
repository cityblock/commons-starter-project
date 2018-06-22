exports.up = function(knex, Promise) {
  return knex.schema.alterTable('patient_info', table => {
    table.boolean('isWhite');
    table.boolean('isBlack');
    table.boolean('isAmericanIndianAlaskan');
    table.boolean('isAsian');
    table.boolean('isHawaiianPacific');
    table.boolean('isOtherRace');
    table.boolean('isHispanic');
    table.string('raceFreeText');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('patient_info', table => {
    table.dropColumn('isWhite');
    table.dropColumn('isBlack');
    table.dropColumn('isAmericanIndianAlaskan');
    table.dropColumn('isAsian');
    table.dropColumn('isHawaiianPacific');
    table.dropColumn('isOtherRace');
    table.dropColumn('isHispanic');
    table.dropColumn('raceFreeText');
  });
};
