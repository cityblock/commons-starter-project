exports.up = function(knex, Promise) {
  return knex.schema.table('progress_note', function(table) {
    table.string('supervisorNotes');
    table
      .uuid('supervisorId')
      .references('id')
      .inTable('user');
    table.boolean('needsSupervisorReview').defaultTo(false);
    table.timestamp('reviewedBySupervisorAt');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('progress_note', function(table) {
    table.dropColumn('supervisorNotes');
    table.dropColumn('supervisorId');
    table.dropColumn('needsSupervisorReview');
    table.dropColumn('reviewedBySupervisorAt');
  });
};
