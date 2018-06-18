import dotenv from 'dotenv';
import kue from 'kue';
import redis from 'redis';
import config from '../config';

dotenv.config();

interface IRedisConnection {
  createClientFactory: () => kue.redisClientFactory.RedisClient;
}

// Helper to generate correct redis client connection
export function createRedisClient(): IRedisConnection {
  return {
    createClientFactory: () =>
      redis.createClient(config.REDIS_PORT, config.REDIS_HOST, {
        password: config.REDIS_PASSWORD,
        tls:
          config.NODE_ENV === 'development'
            ? null
            : {
                port: config.REDIS_PORT,
                host: config.REDIS_HOST,
              },
      }),
  };
}
