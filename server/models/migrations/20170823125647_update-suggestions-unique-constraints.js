exports.up = function(knex, Promise) {
  return knex.schema
    .table('concern_suggestion', table => {
      table.dropUnique(['answerId', 'concernId']);
      table.unique(['answerId', 'concernId', 'deletedAt']);

      table.index('answerId');
      table.index('concernId');
      table.index('deletedAt');
    })
    .table('goal_suggestion', table => {
      table.dropUnique(['answerId', 'goalSuggestionTemplateId']);
      table.unique(['answerId', 'goalSuggestionTemplateId', 'deletedAt']);

      table.index('answerId');
      table.index('goalSuggestionTemplateId');
      table.index('deletedAt');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table('concern_suggestion', table => {
      table.dropUnique(['answerId', 'concernId', 'deletedAt']);
      table.unique(['answerId', 'concernId']);

      table.dropIndex('answerId');
      table.dropIndex('concernId');
      table.dropIndex('deletedAt');
    })
    .table('goal_suggestion', table => {
      table.dropUnique(['answerId', 'goalSuggestionTemplateId', 'deletedAt']);
      table.unique(['answerId', 'goalSuggestionTemplateId']);

      table.dropIndex('answerId');
      table.dropIndex('goalSuggestionTemplateId');
      table.dropIndex('deletedAt');
    });
};
