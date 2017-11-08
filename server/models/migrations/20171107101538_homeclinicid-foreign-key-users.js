exports.up = function(knex, Promise) {
  return knex.schema.alterTable('user', table => {
    table
      .foreign('homeClinicId')
      .references('id')
      .inTable('clinic');

    table
      .uuid('homeClinicId')
      .notNullable()
      .alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('user', table => {
    table.dropForeign('homeClinicId');

    table
      .uuid('homeClinicId')
      .nullable()
      .alter();
  });
};
