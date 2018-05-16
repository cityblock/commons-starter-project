exports.up = function(knex, Promise) {
  return knex.schema.alterTable('patient', table => {
    table.string('nmi');
    table.string('mrn');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('patient', table => {
    table.dropColumn('nmi');
    table.dropColumn('mrn');
  });
};
