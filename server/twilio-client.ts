import config from './config';

/* tslint:disable no-var-requires */
const twilio = require('twilio');
/* tslint:enable no-var-requires */

let singleton: any;

export default class TwilioClient {
  static get() {
    if (singleton) return singleton;
    singleton = new twilio(config.TWILIO_SID, config.TWILIO_AUTH_TOKEN);
    return singleton;
  }
}
