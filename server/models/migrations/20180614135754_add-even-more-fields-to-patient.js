exports.up = function(knex, Promise) {
  return knex.schema.table('patient', table => {
    table.string('productDescription').defaultTo('Unknown');
    table.string('lineOfBusiness').defaultTo('Unknown');
    table.string('medicaidPremiumGroup').defaultTo('Unknown');
    table.string('pcpName');
    table.string('pcpPractice');
    table.string('pcpPhone');
    table.string('pcpAddress');
    table.string('memberId').defaultTo('Unknown');
    table.string('insurance').defaultTo('Unknown');
    table.boolean('inNetwork').defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('patient', table => {
    table.dropColumn('productDescription');
    table.dropColumn('lineOfBusiness');
    table.dropColumn('medicaidPremiumGroup');
    table.dropColumn('pcpName');
    table.dropColumn('pcpPractice');
    table.dropColumn('pcpPhone');
    table.dropColumn('pcpAddress');
    table.dropColumn('memberId');
    table.dropColumn('insurance');
    table.dropColumn('inNetwork');
  });
};
