exports.up = function(knex, Promise) {
  return knex.schema.raw(`
    ALTER TABLE "task_event"
    DROP CONSTRAINT "task_event_eventType_check",
    ADD CONSTRAINT "task_event_eventType_check"
    CHECK ("eventType" IN (
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
      'edit_title',
      'edit_description'
    ))
  `);
};

exports.down = function(knex, Promise) {
  return knex.schema;
};
