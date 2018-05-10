// Config file for Knex
module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'commons',
      host: '127.0.0.1',
      timezone: 'UTC',
    },
    pool: {
      min: 4,
      max: 20,
      idleTimeoutMillis: 1000,
      reapIntervalMillis: 1000,
      acquireTimeoutMillis: 20000,
    },
    migrations: {
      directory: __dirname + '/migrations',
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
      user: process.env.DB_USER,
      timezone: 'UTC',
    },
    pool: {
      min: 4,
      max: 20,
      idleTimeoutMillis: 1000,
      reapIntervalMillis: 1000,
      acquireTimeoutMillis: 20000,
    },
    migrations: {
      directory: __dirname + '/migrations',
    },
  },
  test: {
    client: 'pg',
    connection: {
      database: 'commons_test',
      host: '127.0.0.1',
      user: process.env.DB_USER || 'root',
      timezone: 'UTC',
    },
    migrations: {
      directory: __dirname + '/migrations',
    },
  },
};
