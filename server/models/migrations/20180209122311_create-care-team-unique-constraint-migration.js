exports.up = function(knex, Promise) {
  // Order matters
  return (
    knex.schema
      // CareTeam indexes
      .table('care_team', table => {
        table.dropUnique(['userId', 'patientId', 'deletedAt']);
      }).raw(`
        CREATE UNIQUE INDEX careteam_userid_patientid_unique ON care_team ("userId", "patientId")
        WHERE "deletedAt" IS NULL;
      `).raw(`
        CREATE UNIQUE INDEX careteam_userid_patientid_deletedat_unique ON care_team ("userId", "patientId", "deletedAt")
        WHERE "deletedAt" IS NOT NULL;
      `)
  );
};

exports.down = function(knex, Promise) {
  // Order matters
  return knex.schema
    .raw(
      `
      DROP INDEX careteam_userid_patientid_deletedat_unique;
      DROP INDEX careteam_userid_patientid_unique
    `,
    )
    .table('care_team', table => {
      table.unique(['userId', 'patientId', 'deletedAt']);
    });
};
