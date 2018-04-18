exports.up = function(knex, Promise) {
  return knex.schema.alterTable('care_team', table => {
    table.string('googleCalendarAclRuleId');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('care_team', table => {
    table.dropColumn('googleCalendarAclRuleId');
  });
};
