exports.up = function(knex, Promise) {
  return knex.schema
    .alterTable('address', table => {
      table.renameColumn('street', 'street1');
    })
    .table('address', table => {
      table.string('street2');
    })
    .table('patient', table => {
      table.dropColumn('consentToText');
      table.dropColumn('consentToCall');
    })
    .table('patient_info', table => {
      table.bool('canReceiveCalls');
      table.bool('canReceiveTexts');
      table.bool('hasEmail');
      table.bool('isMarginallyHoused');
      table.enu('preferredContactMethod', ['text', 'phone', 'email']);
      table.enu('sexAtBirth', ['male', 'female'])
      table.string('preferredName');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .alterTable('address', table => {
      table.renameColumn('street1', 'street');
    })
    .table('address', table => {
      table.dropColumn('street2');
    })
    .table('patient', table => {
      table.bool('consentToText');
      table.bool('consentToCall');
    })
    .table('patient_info', table => {
      table.dropColumn('canReceiveCalls');
      table.dropColumn('canReceiveTexts');
      table.dropColumn('hasEmail');
      table.dropColumn('isMarginallyHoused');
      table.dropColumn('preferredContactMethod');
      table.dropColumn('sexAtBirth');
      table.dropColumn('preferredName');
    });
};
