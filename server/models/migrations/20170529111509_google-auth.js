
exports.up = function (knex, Promise) {
  return knex.schema
    .createTableIfNotExists('google_auth', table => {
      table.string('id').primary();
      table.string('accessToken').notNullable();
      table.string('expiresAt').notNullable();
      table.string('userId').notNullable().references('id').inTable('user');

      // timestamps
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    })
    .table('user', table => {
      table.string('googleProfileImageUrl');
      table.string('googleAuthId').references('id').inTable('google_auth');
      table.dropColumn('hashedPassword');
    });
};

exports.down = function (knex, Promise) {
  return knex.schema
    .table('user', table => {
      table.dropColumn('googleAuthId');
    }).dropTableIfExists('google_auth');
};
