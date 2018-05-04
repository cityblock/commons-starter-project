exports.up = function(knex, Promise) {
  return knex.schema
    .table('patient_siu_event', table => {
      table.dropIndex('visitId');
      table.dropUnique('visitId');
    })
    .raw(`
      CREATE UNIQUE INDEX patientsiuevent_visitid_unique ON patient_siu_event ("visitId")
      WHERE "deletedAt" IS NULL;
    `).raw(`
      CREATE UNIQUE INDEX patientsiuevent_visitid_deletedat_unique ON patient_siu_event ("visitId", "deletedAt")
      WHERE "deletedAt" IS NOT NULL;
    `)
};

exports.down = function(knex, Promise) {
  return knex.schema
    .raw(
      `
      DROP INDEX patientsiuevent_visitid_deletedat_unique;
      DROP INDEX patientsiuevent_visitid_unique
    `,
    )
    .table('patient_siu_event', table => {
      table.unique('visitId');
      table.index('visitId');
    });
};
