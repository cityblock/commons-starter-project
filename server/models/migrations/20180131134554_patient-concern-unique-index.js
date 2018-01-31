exports.up = function(knex, Promise) {
  return knex.schema
    .table('patient_concern', table => {
      table.dropUnique(['patientId', 'concernId']);
      table.index('patientId');
      table.index('concernId');
      table.index('deletedAt');
    })
    .raw(
      'create unique index patientconcern_patientid_deletedat on patient_concern ("patientId", "concernId") where "deletedAt" IS NULL;',
    );
};

exports.down = function(knex, Promise) {
  return knex.schema.table('patient_concern', table => {
    table.dropIndex('patientconcern_patientid_deletedat');
    table.unique(['patientId', 'concernId']);

    table.dropIndex('patientId');
    table.dropIndex('concernId');
    table.dropIndex('deletedAt');
  });
};
