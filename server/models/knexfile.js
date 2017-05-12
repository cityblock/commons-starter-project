// Config file for Knex
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      database: 'commons',
    },
    migrations: {
      directory: __dirname + '/migrations',
    },
  },
  test: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      database: 'commons_test',
    },
    migrations: {
      directory: __dirname + '/migrations',
    },
  },
  production: {
    client: 'pg',
    connection: {
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'db',
      ssl: true,
    },
    migrations: {
      directory: __dirname + '/migrations',
    },
  },
}

