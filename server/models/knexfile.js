// Config file for Knex
module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'pokedex',
      host: '127.0.0.1',
      timezone: 'UTC',
    },
    migrations: {
      directory: __dirname + '/migrations',
    },
    pool: {
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 1000,
      max: 200,
      min: 4,
    },
    seeds: {
      directory: __dirname + '/seeds/dev',
    },
  },
  production: {
    client: 'pg',
    connection: {
      database: 'db',
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: true,
      timezone: 'UTC',
      user: process.env.DB_USER,
    },
    migrations: {
      directory: __dirname + '/migrations',
    },
    pool: {
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 1000,
      max: 200,
      min: 4,
    },
  },
  test: {
    client: 'pg',
    connection: {
      database: 'pokedex_test',
      host: '127.0.0.1',
      timezone: 'UTC',
      user: 'postgres',
    },
    migrations: {
      directory: __dirname + '/migrations',
    },
  },
};
