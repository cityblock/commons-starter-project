exports.up = function(knex, Promise) {
  return knex.schema
    .table('patient', table => {
      // remove unused fields
      table.dropColumn('zip');
      table.dropColumn('gender');
      table.dropColumn('dateOfBirth');
      table.dropColumn('language');
    })
    .table('patient', table => {
      table
        .date('dateOfBirth')
        .notNullable()
        .defaultTo('01/31/1900');
    })
    .raw(
      `
      ALTER TABLE patient ALTER COLUMN "dateOfBirth" DROP DEFAULT
    `,
    )
    .createTableIfNotExists('address', table => {
      table.uuid('id').primary();
      table.string('street');
      table.string('zip');
      table.string('state');
      table.string('city');
      table.string('description');
      table.timestamp('createdAt');
      table.timestamp('updatedAt');
      table
        .uuid('updatedBy')
        .references('id')
        .inTable('user')
        .notNullable();
    })
    .createTableIfNotExists('patient_address', table => {
      table.uuid('id').primary();
      table
        .uuid('patientId')
        .references('id')
        .inTable('patient')
        .notNullable();
      table
        .uuid('addressId')
        .references('id')
        .inTable('address')
        .notNullable();
      table.timestamp('deletedAt');
      table.timestamp('createdAt');
      table.timestamp('updatedAt');
    })
    .createTableIfNotExists('patient_info', table => {
      table.uuid('id').primary();
      table
        .uuid('patientId')
        .references('id')
        .inTable('patient')
        .unique()
        .notNullable();
      table.enu('gender', ['male', 'female', 'transgender', 'nonbinary']);
      table.string('language');
      table
        .uuid('primaryAddressId')
        .references('id')
        .inTable('address');
      table.timestamp('createdAt');
      table.timestamp('updatedAt');
      table
        .uuid('updatedBy')
        .references('id')
        .inTable('user')
        .notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table('patient', table => {
      table.dropColumn('dateOfBirth');

      table.string('language');
      table.string('zip');
      table.enu('gender', ['M', 'F']);
    })
    .table('patient', table => {
      table.string('dateOfBirth');
    })
    .dropTableIfExists('patient_info')
    .dropTableIfExists('patient_address')
    .dropTableIfExists('address');
};
