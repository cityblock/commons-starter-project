exports.up = function(knex, Promise) {
  return knex.schema.alterTable('computed_patient_status', table => {
    table.boolean('isFullConsentSigned');
    table.renameColumn('isConsentSigned', 'isCoreConsentSigned');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('computed_patient_status', table => {
    table.dropColumn('isFullConsentSigned');
    table.renameColumn('isCoreConsentSigned', 'isConsentSigned');
  });
};
