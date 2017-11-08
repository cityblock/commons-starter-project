exports.up = async function(knex, Promise) {
  await knex.schema.raw(
    `
    CREATE TYPE quick_call_direction AS ENUM ('Inbound', 'Outbound')
    `,
  );

  await knex.schema.createTableIfNotExists('quick_call', table => {
    table.uuid('id').primary();
    table.text('reason').notNullable();
    table.text('summary').notNullable();
    table.specificType('direction', 'quick_call_direction').notNullable();
    table.text('callRecipient').notNullable();
    table.boolean('wasSuccessful').notNullable();
    table.dateTime('startTime'); // Using a full timestamp here just in case we need to add date later
    table.dateTime('createdAt');
    table.dateTime('updatedAt');
    table.dateTime('deletedAt');
    table
      .uuid('progressNoteId')
      .references('progress_note.id')
      .notNullable();
    table
      .uuid('userId')
      .references('user.id')
      .notNullable();
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTableIfExists('quick_call');
  await knex.schema.raw(
    `
    DROP TYPE IF EXISTS quick_call_direction
    `,
  );
};
