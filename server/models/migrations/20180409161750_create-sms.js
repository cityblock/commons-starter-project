exports.up = function(knex, Promise) {
  return knex.schema.hasTable('sms_message').then(exists => {
    if (!exists) {
      return knex.schema.createTable('sms_message', table => {
        table.uuid('id').primary();
        table
          .uuid('userId')
          .references('id')
          .inTable('user')
          .notNullable();
        table
          .uuid('phoneId')
          .references('id')
          .inTable('phone')
          .notNullable();

        table.enu('direction', ['inbound', 'outbound']).notNullable();
        table.string('body').notNullable();
        table.string('mediaUrls');

        table.string('twilioMessageSid').notNullable();

        // timestamps
        table.timestamp('deletedAt');
        table.timestamp('createdAt').defaultTo(knex.raw('now()'));
        table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('sms_message').then(exists => {
    if (exists) {
      return knex.schema.dropTable('sms_message');
    }
  });
};
