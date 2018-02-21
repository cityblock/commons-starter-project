exports.up = function(knex, Promise) {
  return knex.schema.alterTable('computed_patient_status', table => {
    table.dropColumn('hasCareTeamMember');
    table.dropColumn('hasProgressNote');
    table.dropColumn('hasPcp');
    table.renameColumn('coreIdVerified', 'isCoreIdentityVerified');
    table.renameColumn('consentsSigned', 'isConsentSigned');
    table.boolean('isDemographicInfoUpdated');
    table.boolean('isEmergencyContactAdded');
    table.boolean('isAdvancedDirectivesAdded');
    table.boolean('isPhotoAddedOrDeclined');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('computed_patient_status', table => {
    table.dropColumn('isPhotoAddedOrDeclined');
    table.dropColumn('isAdvancedDirectivesAdded');
    table.dropColumn('isEmergencyContactAdded');
    table.dropColumn('isDemographicInfoUpdated');
    table.renameColumn('isConsentSigned', 'consentsSigned');
    table.renameColumn('isCoreIdentityVerified', 'coreIdVerified');
    table.boolean('hasPcp');
    table.boolean('hasProgressNote');
    table.boolean('hasCareTeamMember');
  });
};
