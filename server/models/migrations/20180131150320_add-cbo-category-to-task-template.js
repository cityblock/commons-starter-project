exports.up = function(knex, Promise) {
  return knex.schema.table('task_template', table => {
    table
      .uuid('CBOCategoryId')
      .references('id')
      .inTable('cbo_category');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('task_template', table => {
    table.dropColumn('CBOCategoryId');
  });
};
