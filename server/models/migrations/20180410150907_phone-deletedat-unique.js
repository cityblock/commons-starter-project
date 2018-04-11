exports.up = async function(knex, Promise) {
  return knex.schema
    .raw(
      `
    CREATE TEMPORARY SEQUENCE phonenum START 17185550000;
    UPDATE phone
      SET "phoneNumber"='+' || nextVal('phonenum')::text;

    CREATE UNIQUE INDEX phone_number_unique ON phone ("phoneNumber")
    WHERE "deletedAt" IS NULL;
  `,
    )
    .table('phone', table => {
      // delete columns that we will move to join tables
      table.dropColumn('type');
      table.dropColumn('description');
      table.dropColumn('updatedById');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table('phone', table => {
      table.enu('type', ['home', 'work', 'mobile', 'other']);
      table.string('description');
      table
        .uuid('updatedById')
        .references('id')
        .inTable('user')
        .notNullable();
    })
    .raw('DROP INDEX phone_number_unique;');
};
