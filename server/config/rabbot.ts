export default {
  rabbot: {
    development: {
      api: {
        protocol: 'http',
        url: 'localhost',
        endpoint: '/api/queues',
        port: 15672,
        user: 'guest',
        pass: 'guest',
      },
      connection: {
        user: 'guest',
        pass: 'guest',
        server: 'localhost',
        port: 5672,
      },
      queues: [
        { name: 'low-priority' },
        { name: 'high-priority' },
      ],
      logging: {
        adapters: {
          stdOut: {
            level: 4,
            bailIfDebug: true,
          },
        },
      },
    },
    production: {
      api: {
        protocol: 'https',
        url: process.env.RABBIT_SERVER,
        endpoint: process.env.RABBIT_API_ENDPOINT,
        port: process.env.RABBIT_API_PORT,
        user: process.env.RABBIT_USER,
        pass: process.env.RABBIT_PASSWORD,
      },
      connection: {
        user: process.env.RABBIT_USER,
        pass: process.env.RABBIT_PASSWORD,
        server: process.env.RABBIT_SERVER,
        port: process.env.RABBIT_PORT,
        vhost: process.env.RABBIT_VHOST,
        passphrase: process.env.RABBIT_PASSPHRASE,
      },
      queues: [
        { name: 'low-priority', limit: 1 },
        { name: 'high-priority', limit: 3 },
      ],
      logging: {
        adapters: {
          stdOut: {
            level: 4,
            bailIfDebug: true,
          },
        },
      },
    },
  },
};
