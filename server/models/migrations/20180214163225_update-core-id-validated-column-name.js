exports.up = function(knex, Promise) {
  return knex.schema.alterTable('patient', table => {
    table.renameColumn('coreIdentityValidatedAt', 'coreIdentityVerifiedAt');
    table.renameColumn('coreIdentityValidatedById', 'coreIdentityVerifiedById');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('patient', table => {
    table.renameColumn('coreIdentityVerifiedAt', 'coreIdentityValidatedAt');
    table.renameColumn('coreIdentityVerifiedById', 'coreIdentityValidatedById');
  });
};
