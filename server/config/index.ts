import rabbot from './rabbot';

export default {
  HOSTNAME: 'localhost',
  PORT: '3000',
  NODE_ENV: 'development',
  ATHENA_TOKEN_URL: 'https://apitest.athenahealth.com/oauthpreview/token',
  ATHENA_API_BASE: 'https://apitest.athenahealth.com/preview1',
  ATHENA_PRACTICE_ID: 1959277,
  ATHENA_CLIENT_KEY: null,
  ATHENA_CLIENT_SECRET: null,
  TIME_ZONE: '-04:00',
  JWT_SECRET: 'topsecret',
  JWT_EXPIRT: '1d',
  SALT_ROUNDS: 12,
  ...process.env,
  ...rabbot,
};
