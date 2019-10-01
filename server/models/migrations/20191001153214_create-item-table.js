exports.up = function(knex, Promise) {
    return knex.schema.hasTable('item').then(exists => {
        if (!exists) {
            return knex.schema.createTable('item', table => {
                table
                    .uuid('id')
                    .notNullable()
                    .primary()
                    .unique();
                table.string('name').notNullable();
                table
                    .uuid('pokemonId')
                    .references('id')
                    .inTable('pokemon')
                    .notNullable();
                table.integer('price').notNullable();
                table.integer('happiness').notNullable();
                table.string('imageUrl').notNullable();
                table.timestamp('createdAt').defaultTo(knex.raw('now()'));
                table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
                table.timestamp('deletedAt').nullable();
            });
        }
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.hasTable('item').then(exists => {
        if (exists) {
            return knex.schema.dropTable('item');
        }
    });
};