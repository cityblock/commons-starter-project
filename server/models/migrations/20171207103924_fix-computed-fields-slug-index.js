exports.up = async function(knex, Promise) {
  await knex.schema.raw(
    `alter table "computed_field" drop constraint if exists "computed_field_slug_deletedat_unique"`,
  );
  await knex.schema.raw(`drop index if exists computed_field_slug_deletedat_unique`);
  await knex.schema.raw(`create unique index computed_field_slug_unique on computed_field (slug)`);
};

exports.down = async function(knex, Promise) {
  await knex.schema.raw(`drop index if exists computed_field_slug_unique`);
  await knex.schema.raw(`
    create unique index computed_field_slug_deletedat_unique on computed_field (slug, "deletedAt")`);
};
