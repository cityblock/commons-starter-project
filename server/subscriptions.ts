import { RedisPubSub } from 'graphql-redis-subscriptions';
import config from './config';

let singleton: RedisPubSub | null;

export default class PubSub {
  static get() {
    if (singleton) return singleton;
    singleton = new RedisPubSub({
      connection: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        retryStrategy: (options: any) => {
          // reconnect after
          return Math.max(options.attempt * 100, 3000);
        },
        password: config.REDIS_PASSWORD,
        tls:
          config.NODE_ENV === 'development'
            ? undefined
            : {
                port: config.REDIS_PORT,
                host: config.REDIS_HOST,
              },
      },
    });

    return singleton;
  }
}
