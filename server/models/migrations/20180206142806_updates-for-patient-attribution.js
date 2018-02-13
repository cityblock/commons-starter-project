exports.up = function(knex, Promise) {
  return knex.schema.alterTable('patient_info', table => {
    table.renameColumn('updatedBy', 'updatedById');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('patient_info', table => {
    table.renameColumn('updatedById', 'updatedBy');
  });
};
