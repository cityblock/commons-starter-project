exports.up = function(knex, Promise) {
  return knex.schema.table('sms_message', table => {
    table
      .uuid('patientId')
      .references('id')
      .inTable('patient');
    table.string('contactNumber');
    table.json('twilioPayload').notNullable();

    // now using phone number to identify
    table.dropColumn('phoneId');
    // will handle media at a later date
    table.dropColumn('mediaUrls');
    // twilio message data now all stored in payload
    table.dropColumn('twilioMessageSid');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('sms_message', table => {
    table.dropColumn('patientId');
    table.dropColumn('contactNumber');
    table.dropColumn('twilioPayload');

    table
      .uuid('phoneId')
      .references('id')
      .inTable('phone')
      .notNullable();
    table.string('mediaUrls');
    table.string('twilioMessageSid').notNullable();
  });
};
