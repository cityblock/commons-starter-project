exports.up = function(knex, Promise) {
  return knex.schema.raw(`
  ALTER TABLE "progress_note"
  ADD CONSTRAINT "worry_score_range"
  CHECK ("worryScore" > 0 and "worryScore" < 4)
`);
};

exports.down = function(knex, Promise) {
  return knex.schema;
};
