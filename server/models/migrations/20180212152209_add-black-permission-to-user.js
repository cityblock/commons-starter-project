exports.up = function(knex, Promise) {
  return knex.schema.raw(`
    ALTER TABLE "user"
    DROP CONSTRAINT "user_permissions_check",
    ADD CONSTRAINT "user_permissions_check"
    CHECK ("permissions" IN (
      'green',
      'pink',
      'orange',
      'blue',
      'yellow',
      'red',
      'black'
    ))
  `);
};

exports.down = function(knex, Promise) {
  return knex.schema.raw(`
      UPDATE "user"
      SET permissions = 'red'
      WHERE permissions = 'black'
    `).raw(`
      ALTER TABLE "user"
      DROP CONSTRAINT "user_permissions_check",
      ADD CONSTRAINT "user_permissions_check"
      CHECK ("permissions" IN (
        'green',
        'pink',
        'orange',
        'blue',
        'yellow',
        'red'
      ))
    `);
};
