exports.up = function(knex, Promise) {
  return knex.schema.table('patient_answer', table => {
    table
      .string('userId')
      .references('id')
      .inTable('user');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('patient_answer', table => {
    table.dropColumn('userId');
  });
};
