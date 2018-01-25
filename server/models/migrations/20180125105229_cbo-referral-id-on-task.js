exports.up = function(knex, Promise) {
  return knex.schema.table('task', table => {
    table
      .uuid('CBOReferralId')
      .references('id')
      .inTable('cbo_referral');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('task', table => {
    table.dropColumn('CBOReferralId');
  });
};
