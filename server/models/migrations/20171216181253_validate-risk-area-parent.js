exports.up = function(knex, Promise) {
  return knex.schema.alterTable('risk_area', table => {
    table
      .uuid('riskAreaGroupId')
      .notNullable()
      .alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('risk_area', table => {
    table
      .uuid('riskAreaGroupId')
      .nullable()
      .alter();
  });
};
