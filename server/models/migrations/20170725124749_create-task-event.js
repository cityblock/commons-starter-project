exports.up = function (knex, Promise) {
  return knex.schema
    .createTableIfNotExists('task_event', table => {
      table.string('id').primary();
      table.string('taskId').references('id').inTable('task');
      table.string('userId').references('id').inTable('user');
      table.string('eventCommentId').references('id').inTable('task_comment');
      table.string('eventUserId').references('id').inTable('user');
      table.enu('eventType', [
        'create_task',
        'add_follower',
        'remove_follower',
        'complete_task',
        'uncomplete_task',
        'delete_task',
        'add_comment',
        'edit_comment',
        'delete_comment',
        'edit_priority',
        'edit_due_date',
        'edit_assignee',
      ]);

      // timestamps
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
      table.timestamp('deletedAt');

      // indexes
      table.index('taskId');
      table.index('userId');
      table.index('eventCommentId');
      table.index('eventUserId');
      table.index('eventType');
      table.index('deletedAt');
    });
};

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTableIfExists('task_event');
};
