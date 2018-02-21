exports.up = function(knex, Promise) {
  return knex.schema.hasTable('progress_note_glass_break').then(exists => {
    if (!exists) {
      return knex.schema.createTable('progress_note_glass_break', table => {
        table.uuid('id').primary();
        table
          .uuid('userId')
          .references('id')
          .inTable('user')
          .notNullable();
        table
          .uuid('progressNoteId')
          .references('id')
          .inTable('progress_note')
          .notNullable();
        table.string('reason').notNullable();
        table.text('note');

        // timestamps
        table.timestamp('deletedAt');
        table.timestamp('createdAt').defaultTo(knex.raw('now()'));
        table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('progress_note_glass_break', table => {
    if (exists) {
      return knex.schema.dropTable('progress_note_glass_break');
    }
  });
};
