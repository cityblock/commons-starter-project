import rabbot from './rabbot';

// NOTE: Do not import this file on the client
export default {
  HOSTNAME: 'localhost',
  PORT: '3000',
  NODE_ENV: 'development',
  ATHENA_TOKEN_URL: 'https://apitest.athenahealth.com/oauthpreview/token',
  ATHENA_API_BASE: 'https://apitest.athenahealth.com/preview1',
  ATHENA_PRACTICE_ID: 1959277,
  ATHENA_CLIENT_KEY: null,
  ATHENA_CLIENT_SECRET: null,
  GOOGLE_OAUTH_TOKEN: null,
  GOOGLE_OAUTH_SECRET: null,
  GOOGLE_OAUTH_REDIRECT_URI: 'http://localhost:3000',
  GOOGLE_OAUTH_VALID_EMAIL_DOMAIN: '@cityblock.com',
  TIME_ZONE: '-04:00',
  JWT_SECRET: 'topsecret',
  JWT_EXPIRY: '1d',
  REDOX_TOKEN_URL: 'https://api.redoxengine.com/auth/authenticate',
  REDOX_API_URL: 'https://api.redoxengine.com/endpoint',
  REDOX_KEY: null,
  REDOX_SECRET: null,
  ...process.env,
  ...rabbot,
};
