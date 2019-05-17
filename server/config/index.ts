// NOTE: Do not import this file on the client
export default {
  HOSTNAME: 'localhost',
  PORT: '3000',
  NODE_ENV: 'development',
  TZ: 'UTC',
  ASSET_URL: '/assets',
  ...process.env,
};
