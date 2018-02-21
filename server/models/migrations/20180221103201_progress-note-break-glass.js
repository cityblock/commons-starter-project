
exports.up = function(knex, Promise) {
  return knex.schema.table('progress_note_template', table => {
    table
      .boolean('requiresGlassBreak')
      .notNullable()
      .defaultTo(false);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('progress_note_template', table => {
    table.dropColumn('requiresGlassBreak');
  })
};
