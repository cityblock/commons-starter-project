exports.up = function(knex, Promise) {
  return knex.schema
    .alterTable('email', table => {
      table.renameColumn('updatedBy', 'updatedById');
      table.renameColumn('email', 'emailAddress');
    })
    .alterTable('address', table => {
      table.renameColumn('updatedBy', 'updatedById');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .alterTable('email', table => {
      table.renameColumn('updatedById', 'updatedBy');
      table.renameColumn('emailAddress', 'email');
    })
    .alterTable('address', table => {
      table.renameColumn('updatedById', 'updatedBy');
    });
};
