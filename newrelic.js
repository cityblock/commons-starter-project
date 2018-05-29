'use strict';
/**
 * New Relic agent configuration.
 *
 * See lib/config/default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  app_name: ['commons-development'],
  license_key: '2af0b067c1d3982f15171532bb9ec206239b0fd3',
  logging: {
    level: 'info',
  },
  allow_all_headers: true,
  browser_monitoring: {
    enable: true,
  },
  attributes: {
    exclude: [
      'request.headers.auth_token', // Ensures our auth token is not stored
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*',
    ],
  },
};
