exports.up = function(knex, Promise) {
  return knex.schema.table('question', table => {
    table
      .uuid('otherTextAnswerId')
      .references('id')
      .inTable('answer');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('question', table => {
    table.dropForeign('otherTextAnswerId');
    table.dropColumn('otherTextAnswerId');
  });
};
