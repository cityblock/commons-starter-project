exports.up = function(knex, Promise) {
  return knex.schema
    .table('task', table => {
      table.enu('priority', ['low', 'medium', 'high']);
      table.timestamp('deletedAt');
    })
    .createTableIfNotExists('task_comment', table => {
      table.string('id').primary();
      table
        .string('userId')
        .references('id')
        .inTable('user');
      table
        .string('taskId')
        .references('id')
        .inTable('task');
      table.text('body');

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));

      /* We only need to index the last two columns separately. Queries on userId will already
       * gain the benefits of an index. See this discussion for details:
       * https://dba.stackexchange.com/questions/6115/working-of-indexes-in-postgresql
       */
      table.index('taskId');
      table.index('deletedAt');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table('task', table => {
      table.dropColumn('priority');
      table.dropColumn('deletedAt');
    })
    .dropTableIfExists('task_comment');
};
