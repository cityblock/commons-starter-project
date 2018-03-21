exports.up = function(knex, Promise) {
  return knex.schema.table('patient_info', table => {
    table
      .boolean('hasUploadedPhoto')
      .notNullable()
      .defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('patient_info', table => {
    table.dropColumn('hasUploadedPhoto');
  });
};
