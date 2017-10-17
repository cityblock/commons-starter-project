exports.up = function(knex, Promise) {
  return knex.schema
    .alterTable('screening_tool_score_range', function (table) {
      table.dropIndex(['screeningToolId', 'minimumScore', 'deletedAt'], 'screening_tool_score_range_screeningtoolid_minimum_score');
      table.dropIndex(['screeningToolId', 'maximumScore', 'deletedAt'], 'screening_tool_score_range_screeningtoolid_maximum_score');
      table.dropColumns(['minimumScore', 'maximumScore'])
      table.specificType('range', 'int4range').notNullable();
    })
    .raw('create extension if not exists btree_gist')
    // do not allow overlapping ranges for the same screeningToolId where deletedAt is null
    .raw(
      'alter table screening_tool_score_range add constraint screening_tool_score_range_range exclude using gist ("screeningToolId" with =, range with &&) where ("deletedAt" is null)'
    );
};

exports.down = function(knex, Promise) {
  return knex.schema
    .alterTable('screening_tool_score_range', function (table) {
      table.integer('minimumScore');
      table.integer('maximumScore');
    })
    .raw(
      'create unique index screening_tool_score_range_screeningtoolid_minimum_score on screening_tool_score_range ("screeningToolId", "minimumScore") where "deletedAt" IS NULL;',
    )
    .raw(
      'create unique index screening_tool_score_range_screeningtoolid_maximum_score on screening_tool_score_range ("screeningToolId", "maximumScore") where "deletedAt" IS NULL;',
    )
    .raw(
      'alter table "screening_tool_score_range" drop constraint "screening_tool_score_range_range"'
    )
    .alterTable('screening_tool_score_range', function (table) {
      table.dropColumn('range');
    });
};
