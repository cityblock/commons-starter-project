exports.up = function(knex, Promise) {
  return knex.schema
    .table('task', table => {
      table.dropColumn('dueAt');
    })
    .table('task', table => {
      table.date('dueAt');
    })
    .table('cbo_referral', table => {
      table.dropColumn('sentAt');
      table.dropColumn('acknowledgedAt');
    })
    .table('cbo_referral', table => {
      table.date('sentAt');
      table.date('acknowledgedAt');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table('task', table => {
      table.dropColumn('dueAt');
    })
    .table('task', table => {
      table.timestamp('dueAt');
    })
    .table('cbo_referral', table => {
      table.dropColumn('sentAt');
      table.dropColumn('acknowledgedAt');
    })
    .table('cbo_referral', table => {
      table.timestamp('sentAt');
      table.timestamp('acknowledgedAt');
    });
};
