exports.up = function (knex, Promise) {
  return knex.schema
    .createTableIfNotExists('event_notification', table => {
      table.string('id').primary();
      table.string('userId').references('id').inTable('user');
      table.string('taskEventId').references('id').inTable('task_event');

      // timestamps
      table.timestamp('seenAt');
      table.timestamp('emailSentAt');
      table.timestamp('deliveredAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
      table.timestamp('deletedAt');

      // indexes
      table.index('userId');
      table.index('taskEventId');
      table.index('seenAt');
      table.index('emailSentAt');
      table.index('deliveredAt');
      table.index('deletedAt');
    });
};

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTableIfExists('event_notification');
};
