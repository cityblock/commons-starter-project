// NOTE: Do not import this file on the client
export default {
  HOSTNAME: 'localhost',
  PORT: '3000',
  NODE_ENV: 'development',
  IS_BUILDER_ENABLED: 'true',
  GOOGLE_OAUTH_TOKEN: null,
  GOOGLE_OAUTH_SECRET: null,
  GOOGLE_OAUTH_REDIRECT_URI: 'http://localhost:3000',
  GOOGLE_OAUTH_VALID_EMAIL_DOMAIN: '@cityblock.com',
  PUBSUB_HMAC_SECRET: 'supertopsecret',
  TIME_ZONE: '-04:00',
  JWT_SECRET: 'topsecret',
  JWT_EXPIRY: '1d',
  DATADOG_API_KEY: null,
  REDIS_HOST: '127.0.0.1',
  REDIS_PORT: 6379,
  REDIS_PASSWORD: undefined, // Null breaks things, unfortunately
  PERMISSIONS_SESSION_IN_HOURS: 8,
  GCS_PROJECT_ID: null,
  GCS_BUCKET: null,
  GCP_CREDS: null,
  TWILIO_SID: null,
  TWILIO_AUTH_TOKEN: null,
  SUBSCRIPTIONS_ENDPOINT: 'ws://localhost:3000/subscriptions',
  ...process.env,
};
