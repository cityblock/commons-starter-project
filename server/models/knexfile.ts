import dotenv from 'dotenv';
dotenv.config();

// Config file for Knex
const config = {
  ext: 'ts',
  development: {
    client: 'pg',
    connection: {
      application_name: 'pokedex dev',
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
      max: 50,
      min: 1,
    },
  },
  production: {
    client: 'pg',
    connection: {
      application_name: 'pokedex production',
      database: 'pokedex',
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
      max: 50,
      min: 1,
    },
  },
  test: {
    client: 'pg',
    connection: {
      application_name: 'pokedex test',
      database: 'pokedex_test',
      host: '127.0.0.1',
      timezone: 'UTC',
      user: process.env.DB_USER || 'root',
    },
    migrations: {
      directory: __dirname + '/migrations',
    },
    pool: {
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 1000,
      max: 2,
      min: 1,
    },
  },
};

// For the migration script
module.exports = config;
