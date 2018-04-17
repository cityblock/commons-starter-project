exports.up = function(knex, Promise) {
  return knex.schema.hasTable('phone_call').then(exists => {
    if (!exists) {
      return knex.schema.createTable('phone_call', table => {
        table.uuid('id').primary();
        table
          .uuid('userId')
          .references('id')
          .inTable('user')
          .notNullable();
        table.string('contactNumber').notNullable();
        table
          .uuid('patientId')
          .references('id')
          .inTable('patient');

        table.enu('direction', ['toUser', 'fromUser']).notNullable();
        table.integer('duration').notNullable();
        table
          .enu('callStatus', [
            'completed',
            'busy',
            'no-answer',
            'failed',
            'canceled',
            'queued',
            'ringing',
            'in-progress',
          ])
          .notNullable();

        table.json('twilioPayload').notNullable();

        // timestamps
        table.timestamp('deletedAt');
        table.timestamp('createdAt').defaultTo(knex.raw('now()'));
        table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('phone_call').then(exists => {
    if (exists) {
      return knex.schema.dropTable('phone_call');
    }
  });
};
