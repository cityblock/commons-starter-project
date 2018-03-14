exports.up = function(knex, Promise) {
  return knex.schema
    .alterTable('care_team', table => {
      table.boolean('isCareTeamLead').defaultTo(false);
    })
    .raw(
      `CREATE UNIQUE INDEX iscareteamlead_patientid_unique ON care_team ("patientId") WHERE "deletedAt" IS NULL AND "isCareTeamLead" IS TRUE`,
    );
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('care_team', table => {
    table.dropColumn('isCareTeamLead');
  });
};
