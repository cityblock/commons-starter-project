exports.up = function(knex, Promise) {
  return knex.schema.table('patient_contact', table => {
    table.dropColumn('primaryAddressId');
    table.dropColumn('primaryEmailId');
    table.dropColumn('primaryPhoneId');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('patient_contact', table => {
    table
      .uuid('primaryEmailId')
      .references('id')
      .inTable('email');
    table
      .uuid('primaryAddressId')
      .references('id')
      .inTable('address');

    table
      .uuid('updatedById')
      .references('id')
      .inTable('user')
      .notNullable();
  });
};
