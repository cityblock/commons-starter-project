exports.up = async function(knex, Promise) {
  await knex.schema.raw(`
    ALTER TABLE "task_template"
    DROP COLUMN IF EXISTS "careTeamAssigneeRole";
  `);

  return knex.schema.table('task_template', table => {
    table.specificType('careTeamAssigneeRole', 'user_role');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('task_template', table => {
    table
      .enu('careTeamAssigneeRole', ['familyMember', 'healthCoach', 'physician', 'nurseCareManager'])
      .alter();
  });
};
