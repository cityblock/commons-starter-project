exports.up = function (knex, Promise) {
  return knex.schema
    .createTableIfNotExists('task', table => {
      table.string('id').primary();
      table.string('title');
      table.text('description');
      table.string('patientId').references('id').inTable('patient');
      table.string('createdById').references('id').inTable('user');
      table.string('assignedToId').references('id').inTable('user');
      table.string('completedById').references('id').inTable('user');

      // timestamps
      table.timestamp('completedAt');
      table.timestamp('dueAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));

      // indexes
      table.index('patientId')
      table.index('createdById')
      table.index('assignedToId')
      table.index('completedById')
    })
    .createTableIfNotExists('task_follower', table => {
      table.string('id').primary();
      table.string('userId').references('id').inTable('user');
      table.string('taskId').references('id').inTable('task');
      table.unique(['userId', 'taskId']);

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));

      // indexes
      table.unique(['userId', 'taskId', 'deletedAt']);
      /* We only need to index the last two columns separately. Queries on userId will already
       * gain the benefits of an index. See this discussion for details:
       * https://dba.stackexchange.com/questions/6115/working-of-indexes-in-postgresql
       */
      table.index('taskId');
      table.index('deletedAt')
    })
};


exports.down = function (knex, Promise) {
  return knex.schema
    .dropTableIfExists('task_follower')
    .dropTableIfExists('task');
};
