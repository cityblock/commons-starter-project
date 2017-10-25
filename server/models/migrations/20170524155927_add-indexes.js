exports.up = function(knex, Promise) {
  // Order matters
  return (
    knex.schema
      // CareTeam indexes
      .table('care_team', table => {
        table.dropUnique(['userId', 'patientId']);
        table.unique(['userId', 'patientId', 'deletedAt']);
        /* We only need to index the last two columns separately. Queries on userId will already
       * gain the benefits of an index. See this discussion for details:
       * https://dba.stackexchange.com/questions/6115/working-of-indexes-in-postgresql
       */
        table.index('patientId');
        table.index('deletedAt');
      })
      // Clinic indexes
      .table('clinic', table => {
        table.unique('departmentId');
      })
      // Patient indexes
      .table('patient', table => {
        table.unique('athenaPatientId');
        table.index('homeClinicId');
      })
      // User indexes
      .table('user', table => {
        table.index('homeClinicId');
        table.index('userRole');
      })
  );
};

exports.down = function(knex, Promise) {
  // Order matters
  return knex.schema
    .table('care_team', table => {
      table.dropUnique(['userId', 'patientId', 'deletedAt']);
      table.unique(['userId', 'patientId']);
      table.dropIndex('patientId');
      table.dropIndex('deletedAt');
    })
    .table('clinic', table => {
      table.dropUnique('departmentId');
    })
    .table('patient', table => {
      table.dropUnique('athenaPatientId');
      table.dropIndex('homeClinicId');
    })
    .table('user', table => {
      table.dropIndex('homeClinicId');
      table.dropIndex('userRole');
    });
};
