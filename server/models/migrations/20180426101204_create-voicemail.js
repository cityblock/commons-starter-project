exports.up = function(knex, Promise) {
  return knex.schema.hasTable('voicemail').then(exists => {
    if (!exists) {
      return knex.schema.createTable('voicemail', table => {
        table.uuid('id').primary();
        table
          .uuid('phoneCallId')
          .references('id')
          .inTable('phone_call')
          .notNullable();
        table.timestamp('twilioCreatedAt').notNullable();
        table.timestamp('twilioUpdatedAt').notNullable();
        table.integer('duration').notNullable();
        table.json('twilioPayload').notNullable();
        table.uuid('jobId').notNullable();

        // timestamps
        table.timestamp('deletedAt');
        table.timestamp('createdAt').defaultTo(knex.raw('now()'));
        table.timestamp('updatedAt').defaultTo(knex.raw('now()'));

        table.unique('phoneCallId');
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('voicemail').then(exists => {
    if (exists) {
      return knex.schema.dropTable('voicemail');
    }
  });
};
